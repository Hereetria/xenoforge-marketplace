import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";
import { handleError } from "@/lib/errors/errorHandler";
import prisma from "@/lib/prisma";
import { validate } from "@/lib/validation/validate";
import { courseQuerySchema } from "@/lib/validation/schemas";
import { getPriceInfo } from "@/lib/discountUtils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    const validatedQuery = validate(courseQuerySchema, queryParams);
    
    const {
      page = 1,
      limit = 12,
      category,
      level,
      search,
      priceRange,
      duration,
      sort,
      featured = false,
    } = validatedQuery;

    
    let currentUserId: string | null = null;
    let enrolledCourseIds: string[] = [];
    
    try {
      const { user } = await requireAuth();
      currentUserId = user.id;
      
      
      const enrollments = await prisma.enrollment.findMany({
        where: { userId: user.id },
        select: { courseId: true }
      });
      enrolledCourseIds = enrollments.map((e: { courseId: string }) => e.courseId);
    } catch {
      // Ignore enrollment fetch errors
    }

    const where: Record<string, unknown> = {
      isPublished: true,
    };

    
    if (currentUserId) {
      where.instructorId = { not: currentUserId };
    }

    
    if (enrolledCourseIds.length > 0) {
      where.id = { notIn: enrolledCourseIds };
    }

    if (category) {
      const categoryResult = await prisma.$queryRaw`
        SELECT id FROM "Category" WHERE name = ${category} AND "isActive" = true
      `;
      
      if (categoryResult && (categoryResult as { id: string }[]).length > 0) {
        where.categoryId = (categoryResult as { id: string }[])[0].id;
      } else {
        
        where.id = "non-existent-id";
      }
    }

    if (level) {
      where.level = level;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    
    

    if (duration) {
      switch (duration) {
        case "under-2h":
          where.duration = { lt: 120 }; 
          break;
        case "2-10h":
          where.duration = { gte: 120, lte: 600 }; 
          break;
        case "10-30h":
          where.duration = { gte: 600, lte: 1800 }; 
          break;
        case "30h-plus":
          where.duration = { gt: 1800 }; 
          break;
      }
    }

    if (featured) {
      where.isFeatured = true;
    }

    
    let orderBy: { createdAt?: "desc" | "asc"; price?: "desc" | "asc" } = { createdAt: "desc" }; 
    if (sort === "price-low") orderBy = { price: "asc" };
    if (sort === "price-high") orderBy = { price: "desc" };

    
    const allCourses = await prisma.course.findMany({
      where,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
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
      orderBy,
    });

    
    let filteredCourses = allCourses;
    if (priceRange) {
      filteredCourses = allCourses.filter((course: any) => {
        const priceInfo = getPriceInfo(course.price);
        const actualPrice = priceInfo.discountedPrice;
        
        switch (priceRange) {
          case "free":
            return actualPrice === 0;
          case "under-25":
            return actualPrice < 25;
          case "25-50":
            return actualPrice >= 25 && actualPrice <= 50;
          case "50-100":
            return actualPrice >= 50 && actualPrice <= 100;
          case "over-100":
            return actualPrice > 100;
          default:
            return true;
        }
      });
    }

    
    if (sort === "popular") {
      
      filteredCourses = filteredCourses.sort(
        (a: any, b: any) => (b.enrollments?.length || 0) - (a.enrollments?.length || 0)
      );
    } else if (sort === "newest" || !sort) {
      
      filteredCourses = filteredCourses.sort((a: { createdAt: string | Date }, b: { createdAt: string | Date }) => {
        const aTime = new Date(a.createdAt).getTime();
        const bTime = new Date(b.createdAt).getTime();
        return bTime - aTime;
      });
    }

    
    const total = filteredCourses.length;
    const courses = filteredCourses.slice((page - 1) * limit, page * limit);

    

    const coursesWithStats = courses.map((course: any) => {
      const avgRating = course.reviews.length > 0
        ? course.reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) / course.reviews.length
        : 0;
      
      return {
        ...course,
        averageRating: Math.round(avgRating * 10) / 10,
        studentCount: course.enrollments.length,
        reviews: undefined, 
        enrollments: undefined, 
      };
    });

    return NextResponse.json({
      courses: coursesWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleError(error);
  }
}

