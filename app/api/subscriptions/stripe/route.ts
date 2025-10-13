import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Role } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getEnvVar } from "@/lib/getEnvVar";
import { getStripe } from "@/lib/stripe";
import { requireAuth } from "@/lib/auth/requireAuth";
import { requireRole } from "@/lib/auth/requireRole";
import { badRequestError } from "@/lib/errors/httpErrors";
import { handleError } from "@/lib/errors/errorHandler";
import { validate } from "@/lib/validation/validate";
import { z } from "zod";

const stripe = getStripe();

export const StripeSubscriptionSchema = z.object({
  plan: z.string(),
  price: z.number().min(0),
});

async function ensureStripeCustomer(user: {
  id: string;
  email: string;
  name?: string | null;
  stripeCustomerId?: string | null;
}) {
  const createCustomer = async () => {
    const created = await stripe.customers.create({
      email: user.email,
      name: user.name || undefined,
      metadata: { userId: user.id },
    });
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: created.id },
    });
    return created.id;
  };

  if (!user.stripeCustomerId) return createCustomer();

  try {
    await stripe.customers.retrieve(user.stripeCustomerId);
    return user.stripeCustomerId;
  } catch {
    return createCustomer();
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user } = await requireAuth();
    requireRole(user.role, [Role.USER]);

    const { plan, price } = validate(StripeSubscriptionSchema, await req.json());

    if (plan !== "premium") {
      throw badRequestError("Invalid subscription plan");
    }

    const existingActiveSubscription = await prisma.subscription.findFirst({
      where: {
        payment: {
          buyerId: user.id,
        },
        active: true,
      },
      include: {
        payment: {
          select: {
            status: true,
          },
        },
      },
    });

    if (existingActiveSubscription) {
      return NextResponse.json(
        { 
          error: "You already have an active subscription. Please cancel your current subscription before subscribing again.",
          hasActiveSubscription: true 
        },
        { status: 400 }
      );
    }

    const stripeCustomerId = await ensureStripeCustomer(user);

    // Create subscription session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: stripeCustomerId,
      billing_address_collection: "required",
      automatic_tax: { enabled: true },
      customer_update: { address: "auto" },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Premium Subscription",
              description: "Unlimited access to all courses and premium features",
            },
            unit_amount: 2900, // $29.00 in cents
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${getEnvVar("NEXTAUTH_URL")}/success?type=subscription&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getEnvVar("NEXTAUTH_URL")}/premium-checkout`,
      metadata: {
        plan: "premium",
        buyerId: user.id,
        type: "subscription",
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
