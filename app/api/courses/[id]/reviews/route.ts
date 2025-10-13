import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";
import { handleError } from "@/lib/errors/errorHandler";
import prisma from "@/lib/prisma";
import { requireParam } from "@/lib/requireParam";
import { RouteContext } from "@/types/routeTypes";

export async function GET(
  _req: NextRequest,
  context: RouteContext
) {
  try {
    const { user } = await requireAuth();
    const courseId = requireParam("id", await context.params);

    const reviews = await prisma.review.findMany({
      where: {
        courseId: courseId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      reviews,
      currentUserId: user?.id,
    });
  } catch (error) {
    return handleError(error);
  }
}

// // POST - Create a new review
// export async function POST(
//   req: NextRequest,
//   context: RouteContext
// ) {
//   try {
//     const { user } = await requireAuth();
//     const courseId = requireParam("id", await context.params);
//     const { rating, comment } = validate(createReviewSchema, await req.json());

//     // Check if user is enrolled in the course
//     const enrollment = await prisma.enrollment.findFirst({
//       where: {
//         userId: user.id,
//         courseId: courseId,
//       },
//     });

//     if (!enrollment) {
//       return NextResponse.json(
//         { error: "You must be enrolled in this course to review it" },
//         { status: 403 }
//       );
//     }

//     // Check if user already has a review
//     const existingReview = await prisma.review.findUnique({
//       where: {
//         userId_courseId: {
//           userId: user.id,
//           courseId: courseId,
//         },
//       },
//     });

//     if (existingReview) {
//       return NextResponse.json(
//         { error: "You have already reviewed this course" },
//         { status: 409 }
//       );
//     }

//     // Create the review
//     const review = await prisma.review.create({
//       data: {
//         rating,
//         comment: comment || null,
//         userId: user.id,
//         courseId: courseId,
//       },
//       include: {
//         user: {
//           select: {
//             id: true,
//             name: true,
//             avatar: true,
//           },
//         },
//       },
//     });

//     return NextResponse.json({ review }, { status: 201 });
//   } catch (error) {
//     return handleError(error);
//   }
// }

// // PUT - Update existing review
// export async function PUT(
//   req: NextRequest,
//   context: RouteContext
// ) {
//   try {
//     const { user } = await requireAuth();
//     const courseId = requireParam("id", await context.params);
//     const { rating, comment } = validate(updateReviewSchema, await req.json());

//     // Find existing review
//     const existingReview = await prisma.review.findUnique({
//       where: {
//         userId_courseId: {
//           userId: user.id,
//           courseId: courseId,
//         },
//       },
//     });

//     if (!existingReview) {
//       return NextResponse.json(
//         { error: "Review not found" },
//         { status: 404 }
//       );
//     }

//     // Update the review
//     const review = await prisma.review.update({
//       where: {
//         id: existingReview.id,
//       },
//       data: {
//         rating,
//         comment: comment || null,
//       },
//       include: {
//         user: {
//           select: {
//             id: true,
//             name: true,
//             avatar: true,
//           },
//         },
//       },
//     });

//     return NextResponse.json({ review });
//   } catch (error) {
//     return handleError(error);
//   }
// }

// // DELETE - Delete review
// export async function DELETE(
//   req: NextRequest,
//   context: RouteContext
// ) {
//   try {
//     const { user } = await requireAuth();
//     const courseId = requireParam("id", await context.params);

//     // Find existing review
//     const existingReview = await prisma.review.findUnique({
//       where: {
//         userId_courseId: {
//           userId: user.id,
//           courseId: courseId,
//         },
//       },
//     });

//     if (!existingReview) {
//       return NextResponse.json(
//         { error: "Review not found" },
//         { status: 404 }
//       );
//     }

//     // Delete the review
//     await prisma.review.delete({
//       where: {
//         id: existingReview.id,
//       },
//     });

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     return handleError(error);
//   }
// }


