import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";
import { handleError } from "@/lib/errors/errorHandler";
import prisma from "@/lib/prisma";
import { validate } from "@/lib/validation/validate";
import { updateEnrollmentSchema } from "@/lib/validation/schemas";
import { requireParam } from "@/lib/requireParam";
import { RouteContext } from "@/types/routeTypes";

export async function POST(
  _req: NextRequest,
  context: RouteContext
) {
  try {
    const { user } = await requireAuth();
    const courseId = requireParam("id", await context.params);

    // Check if user has an active subscription
    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        payment: {
          buyerId: user.id,
        },
        active: true,
        currentPeriodEnd: {
          gt: new Date(),
        },
      },
    });

    if (!activeSubscription) {
      return NextResponse.json(
        { error: "Premium subscription required to enroll in courses" },
        { status: 403 }
      );
    }

    // Check if course exists and is published
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        isPublished: true,
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found or not published" },
        { status: 404 }
      );
    }

    // Check if user is already enrolled
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId: user.id,
        courseId: courseId,
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "Already enrolled in this course" },
        { status: 400 }
      );
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: courseId,
        progress: 0,
        lastAccessedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      enrollment: {
        id: enrollment.id,
        courseId: enrollment.courseId,
        enrolledAt: enrollment.createdAt,
        progress: enrollment.progress,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const { user } = await requireAuth();
    const enrollmentId = requireParam("id", await context.params);
    const { progress, isCompleted, lastAccessed } = validate(updateEnrollmentSchema, await req.json());

    // Update the enrollment
    const updatedEnrollment = await prisma.enrollment.update({
      where: {
        id: enrollmentId,
        userId: user.id, // Ensure user can only update their own enrollments
      },
      data: {
        progress: Math.round(progress),
        lastAccessedAt: lastAccessed ? new Date(lastAccessed) : new Date(),
        completedAt: isCompleted || progress >= 100 ? new Date() : null,
      },
    });

    // If course is completed, create a certificate
    if (isCompleted || progress >= 100) {
      // Check if certificate already exists
      const existingCertificate = await prisma.certificate.findFirst({
        where: {
          userId: user.id,
          courseId: updatedEnrollment.courseId,
        },
      });

      if (!existingCertificate) {
        await prisma.certificate.create({
          data: {
            userId: user.id,
            courseId: updatedEnrollment.courseId,
            issuedAt: new Date(),
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      enrollment: updatedEnrollment,
    });
  } catch (error) {
    return handleError(error);
  }
}
