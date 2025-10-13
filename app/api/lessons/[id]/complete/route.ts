import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";
import { handleError } from "@/lib/errors/errorHandler";
import { notFoundError, forbiddenError } from "@/lib/errors/httpErrors";
import prisma from "@/lib/prisma";
import { requireParam } from "@/lib/requireParam";
import { RouteContext } from "@/types/routeTypes";
import { Role } from "@/lib/constants/roles";
import { requireRole } from "@/lib/auth/requireRole";

export async function POST(_req: NextRequest, context: RouteContext) {
  try {
    const { user } = await requireAuth();
    requireRole(user.role, [Role.USER, Role.ADMIN]);

    const lessonId = requireParam("id", await context.params);

    // Get lesson with course info
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!lesson) {
      throw notFoundError("Lesson not found");
    }

    // Check if user is enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: lesson.module.course.id,
        },
      },
    });

    if (!enrollment) {
      throw forbiddenError("You are not enrolled in this course");
    }

    // Check if lesson is already completed
    const existingCompletion = await prisma.lessonCompletion.findUnique({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId: lessonId,
        },
      },
    });

    if (existingCompletion) {
      return NextResponse.json({ message: "Lesson already completed" });
    }

    // Create lesson completion
    await prisma.lessonCompletion.create({
      data: {
        enrollmentId: enrollment.id,
        lessonId: lessonId,
      },
    });

    // Update enrollment progress
    const totalLessons = await prisma.lesson.count({
      where: {
        module: {
          courseId: lesson.module.course.id,
        },
      },
    });

    const completedLessons = await prisma.lessonCompletion.count({
      where: {
        enrollmentId: enrollment.id,
      },
    });

    const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        progress,
        lastAccessedAt: new Date(),
        completedAt: progress === 100 ? new Date() : null,
      },
    });

    return NextResponse.json({
      message: "Lesson completed successfully",
      progress: Math.round(progress * 100) / 100,
      completedLessons,
      totalLessons,
    });
  } catch (error) {
    return handleError(error);
  }
}
