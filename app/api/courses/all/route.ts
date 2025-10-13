import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";
import { handleError } from "@/lib/errors/errorHandler";
import prisma from "@/lib/prisma";
import { CourseWithEnrollment } from "@/types/api";

// Prisma'dan gelen course tipini tanımla
type CourseFromPrisma = {
  id: string;
  title: string;
  description: string;
  shortDescription: string | null;
  price: number;
  thumbnail: string | null;
  level: string;
  duration: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  instructor: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
    color: string | null;
  } | null;
  modules: {
    id: string;
    title: string;
    order: number;
  }[];
  enrollments: {
    id: string;
    createdAt: Date;
  }[];
  _count: {
    enrollments: number;
  };
};

export async function GET() {
  try {
    const { user } = await requireAuth();

    // Get all courses except those created by the authenticated user
    const courses = await prisma.course.findMany({
      where: {
        instructorId: {
          not: user.id, // Exclude courses created by the authenticated user
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        shortDescription: true,
        price: true,
        thumbnail: true,
        level: true,
        duration: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
          },
        },
        modules: {
          select: {
            id: true,
            title: true,
            order: true,
          },
          orderBy: {
            order: "asc",
          },
        },
        enrollments: {
          where: {
            userId: user.id,
          },
          select: {
            id: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform the data to include enrollment status
    const coursesWithEnrollmentStatus: CourseWithEnrollment[] = courses.map((course: CourseFromPrisma) => ({
      ...course,
      isEnrolled: course.enrollments.length > 0,
      enrollmentId: course.enrollments[0]?.id || null,
      enrolledAt: course.enrollments[0]?.createdAt || null,
      _count: {
        ...course._count,
        lessons: course.modules.length,
      },
    }));

    return NextResponse.json({
      courses: coursesWithEnrollmentStatus,
      total: coursesWithEnrollmentStatus.length,
    });
  } catch (error) {
    return handleError(error);
  }
}
