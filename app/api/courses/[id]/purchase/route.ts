import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";
import { handleError } from "@/lib/errors/errorHandler";
import { notFoundError, badRequestError } from "@/lib/errors/httpErrors";
import prisma from "@/lib/prisma";
import { requireParam } from "@/lib/requireParam";
import { RouteContext } from "@/types/routeTypes";
import { Role } from "@/lib/constants/roles";
import { requireRole } from "@/lib/auth/requireRole";

export async function POST(_req: NextRequest, context: RouteContext) {
  try {
    const { user } = await requireAuth();
    requireRole(user.role, [Role.USER, Role.ADMIN]);

    const courseId = requireParam("id", await context.params);

    // Check if course exists and is published
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw notFoundError("Course not found");
    }

    if (!course.isPublished) {
      throw badRequestError("Course is not available for purchase");
    }

    // Check if user is already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: courseId,
        },
      },
    });

    if (existingEnrollment) {
      throw badRequestError("You are already enrolled in this course");
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        provider: "STRIPE", // Default to Stripe for now
        status: "PENDING",
        amount: course.price,
        currency: "USD",
        courseId: courseId,
        buyerId: user.id,
      },
    });

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: courseId,
        paymentId: payment.id,
      },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      enrollment,
      payment,
      message: "Course purchased successfully",
    }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
