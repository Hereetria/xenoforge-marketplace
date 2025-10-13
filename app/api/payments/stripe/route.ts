import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { Course } from "@prisma/client"
import { Role } from "@/lib/constants/roles"
import prisma from "@/lib/prisma"
import { getEnvVar } from "@/lib/getEnvVar"
import { getStripe } from "@/lib/stripe"
import { requireAuth } from "@/lib/auth/requireAuth"
import { requireRole } from "@/lib/auth/requireRole"
import { badRequestError, notFoundError } from "@/lib/errors/httpErrors"
import { handleError } from "@/lib/errors/errorHandler"
import { validate } from "@/lib/validation/validate"
import { z } from "zod"
import { isDiscountEnabled, DISCOUNT_PERCENTAGE } from "@/lib/discountUtils"

const stripe = getStripe()

export const CheckoutSchema = z.object({
  courses: z
    .array(
      z.object({
        id: z.string(),
      })
    )
    .nonempty(),
  couponDiscountPercentage: z.number().min(0).max(100).optional(),
  source: z.enum(["cart", "direct"]),
})

async function ensureStripeCustomer(user: {
  id: string
  email: string
  name?: string | null
  stripeCustomerId?: string | null
}) {
  const createCustomer = async () => {
    const created = await stripe.customers.create({
      email: user.email,
      name: user.name || undefined,
      metadata: { userId: user.id },
    })
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: created.id },
    })
    return created.id
  }

  if (!user.stripeCustomerId) return createCustomer()

  try {
    await stripe.customers.retrieve(user.stripeCustomerId)
    return user.stripeCustomerId
  } catch {
    return createCustomer()
  }
}

async function resolveCourses(userId: string, coursesInput: { id: string }[]) {
    const courseIds = coursesInput.map(i => i.id)

    const courses = await prisma.course.findMany({
      where: { id: { in: courseIds }, isPublished: true },
      include: { instructor: { select: { name: true } } },
    })
    if (courses.length !== coursesInput.length)
      throw badRequestError("Some courses are not available for purchase")
  
    const owned = await prisma.enrollment.findMany({
      where: { userId, courseId: { in: courseIds } },
      select: { courseId: true },
    })
    if (owned.length > 0) {
      console.log("You already own one or more selected courses. Please remove them from cart.")
      throw badRequestError("You already own one or more selected courses. Please remove them from cart.")
    }
      
    return courses

}

export async function POST(req: NextRequest) {
  try {
    const { user } = await requireAuth()
    requireRole(user.role, [Role.USER])

    const { 
      courses: payloadCourses, 
      couponDiscountPercentage, 
      source 
    } = validate(CheckoutSchema, await req.json())
    console.log("Received request data:", {
      courses: payloadCourses,
      couponDiscountPercentage,
      source
    })
    const courses = await resolveCourses(user.id, payloadCourses)

    if (!courses.length) throw badRequestError("No valid courses provided")
    const stripeCustomerId = await ensureStripeCustomer(user)

    const effectiveDiscountPercentage = 
      typeof couponDiscountPercentage === "number" 
        ? couponDiscountPercentage 
        : (isDiscountEnabled() ? DISCOUNT_PERCENTAGE : 0)

    const lineItems = courses.map(course => {
      const basePrice = course.price
      const effectivePrice = Math.round(basePrice * (1 - effectiveDiscountPercentage / 100) * 100) / 100
      const unitAmountCents = Math.round(effectivePrice * 100)

      return {
        price_data: {
          currency: "usd",
          tax_behavior: "exclusive",
          product_data: {
            name: course.title,
            description: course.description,
            images: course.thumbnail ? [course.thumbnail] : [],
          },
          unit_amount: unitAmountCents,
        },
        quantity: 1,
      } as Stripe.Checkout.SessionCreateParams.LineItem
    })
      

      const successUrl = `${getEnvVar("NEXTAUTH_URL")}/success?source=${source}&session_id={CHECKOUT_SESSION_ID}`
      const cancelUrl = `${getEnvVar("NEXTAUTH_URL")}/cancel`


      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        customer: stripeCustomerId,
        billing_address_collection: "required",
        automatic_tax: { enabled: true },
        customer_update: { address: "auto" },
        line_items: lineItems,
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          courseIds: JSON.stringify(courses.map(c => c.id)),
          buyerId: user.id,
        },
      })      

    return NextResponse.json({ sessionId: session.id, url: session.url }, { status: 200 })
  } catch (error) {
    return handleError(error)
  }
}
