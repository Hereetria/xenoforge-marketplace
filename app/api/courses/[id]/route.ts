import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";
import { handleError } from "@/lib/errors/errorHandler";
import { notFoundError } from "@/lib/errors/httpErrors";
import prisma from "@/lib/prisma";
import { requireParam } from "@/lib/requireParam";
import { RouteContext } from "@/types/routeTypes";

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const id = requireParam("id", await context.params);

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            avatar: true,
            bio: true,
            website: true,
          },
        },
        modules: {
          include: {
            lessons: {
              orderBy: { order: "asc" },
            },
          },
          orderBy: { order: "asc" },
        },
        enrollments: {
          select: {
            id: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!course) {
      throw notFoundError("Course not found");
    }

    const averageRating = course.reviews.length > 0
      ? course.reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) / course.reviews.length
      : 0;

    const studentCount = course.enrollments.length;

    let isEnrolled = false;
    let userProgress = null;

    try {
      const { user } = await requireAuth();
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: id,
          },
        },
        include: {
          lessonCompletions: {
            include: {
              lesson: true,
            },
          },
        },
      });

      if (enrollment) {
        isEnrolled = true;
        userProgress = {
          progress: enrollment.progress,
          lastAccessedAt: enrollment.lastAccessedAt,
          completedAt: enrollment.completedAt,
          completedLessons: enrollment.lessonCompletions.length,
        };
      }
    } catch {

    }

    return NextResponse.json({
      ...course,
      averageRating: Math.round(averageRating * 10) / 10,
      studentCount,
      isEnrolled,
      userProgress,
    });
  } catch (error) {
    return handleError(error);
  }
}

// export async function PUT(req: NextRequest, context: RouteContext) {
//   try {
//     const { user } = await requireAuth();
//     const id = requireParam("id", await context.params);

//     const course = await prisma.course.findUnique({
//       where: { id },
//     });

//     if (!course) {
//       throw notFoundError("Course not found");
//     }

//     // Check if user is the instructor or admin
//     if (course.instructorId !== user.id && user.role !== Role.ADMIN) {
//       throw forbiddenError("You are not authorized to edit this course");
//     }

//     const body = validate(updateCourseSchema, await req.json());

//     const updatedCourse = await prisma.course.update({
//       where: { id },
//       data: body,
//       include: {
//         instructor: {
//           select: {
//             id: true,
//             name: true,
//             avatar: true,
//           },
//         },
//       },
//     });

//     return NextResponse.json(updatedCourse);
//   } catch (error) {
//     return handleError(error);
//   }
// }

// export async function DELETE(req: NextRequest, context: RouteContext) {
//   try {
//     const { user } = await requireAuth();
//     const id = requireParam("id", await context.params);

//     const course = await prisma.course.findUnique({
//       where: { id },
//     });

//     if (!course) {
//       throw notFoundError("Course not found");
//     }

//     // Check if user is the instructor or admin
//     if (course.instructorId !== user.id && user.role !== Role.ADMIN) {
//       throw forbiddenError("You are not authorized to delete this course");
//     }

//     await prisma.course.delete({
//       where: { id },
//     });

//     return new NextResponse(null, { status: 204 });
//   } catch (error) {
//     return handleError(error);
//   }
// }
