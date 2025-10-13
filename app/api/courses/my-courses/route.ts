import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/requireAuth";
import { handleError } from "@/lib/errors/errorHandler";

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const { user } = await requireAuth();

    // Fetch courses for the instructor
    const courses = await prisma.course.findMany({
      where: {
        instructorId: user.id,
      },
      include: {
        enrollments: {
          select: {
            id: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate average rating for each course
    const coursesWithStats = courses.map((course: { 
      id: string;
      title: string;
      description: string;
      price: number;
      originalPrice?: number | null;
      thumbnail?: string | null;
      level: string;
      language: string;
      duration: number;
      isPublished: boolean;
      isFeatured: boolean;
      createdAt: Date;
      updatedAt: Date;
      reviews: { rating: number }[];
      enrollments: { id: string }[];
      [key: string]: unknown;
    }) => {
      const avgRating = course.reviews.length > 0 
        ? course.reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) / course.reviews.length
        : 0;

      return {
        id: course.id,
        title: course.title,
        description: course.description,
        shortDescription: course.shortDescription,
        thumbnail: course.thumbnail,
        price: course.price,
        level: course.level,
        language: course.language,
        duration: course.duration,
        isPublished: course.isPublished,
        isFeatured: course.isFeatured,
        enrollments: course.enrollments.length,
        rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal place
        createdAt: course.createdAt.toISOString(),
        updatedAt: course.updatedAt.toISOString(),
      };
    });

    return Response.json(coursesWithStats);
  } catch (error) {
    return handleError(error);
  }
}
