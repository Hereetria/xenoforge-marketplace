import { NextResponse } from "next/server";
import { handleError } from "@/lib/errors/errorHandler";
import prisma from "@/lib/prisma";
import { CategoryWithCount } from "@/types/api";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
      },
      include: {
        _count: {
          select: {
            courses: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    const transformedCategories: CategoryWithCount[] = categories.map((cat: {
      id: string;
      name: string;
      slug: string;
      description: string | null;
      icon: string | null;
      color: string | null;
      _count: {
        courses: number;
      };
    }) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      icon: cat.icon,
      color: cat.color,
      _count: {
        courses: cat._count.courses,
      },
    }));

    return NextResponse.json(
      { categories: transformedCategories },
      { status: 200 }
    );
  } catch (error) {
    console.error("Categories API error:", error);
    return handleError(error);
  }
}
