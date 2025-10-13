"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CourseFilters from "@/app/(main)/courses/_components/CourseFilters";
import CourseGridClient from "@/app/(main)/courses/_components/CourseGridClient";
import CoursesHeader from "@/app/(main)/courses/_components/CoursesHeader";

interface Course {
  id: number | string;
  title: string;
  instructor: string;
  rating: number;
  students: number;
  price: number;
  originalPrice?: number;
  thumbnail: string;
  duration: string;
  level: string;
  category: string;
  description: string;
  showDiscount?: boolean;
  savings?: number;
}

export default function CoursesPageClient() {
  const clientSearchParams = useSearchParams();
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    pages: 1,
  });
  const [loading, setLoading] = useState(true);

  const pageParam = clientSearchParams.get("page") || "1";
  const limitParam = clientSearchParams.get("limit") || "9";
  const search = clientSearchParams.get("search") || undefined;
  const category = clientSearchParams.get("category") || undefined;
  const priceRange = clientSearchParams.get("priceRange") || undefined;
  const rating = clientSearchParams.get("rating") || undefined;
  const duration = clientSearchParams.get("duration") || undefined;
  const level = clientSearchParams.get("level") || undefined;
  const sort = clientSearchParams.get("sort") || undefined;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);

        const filters = {
          search,
          category,
          priceRange,
          rating,
          duration,
          level,
          sort,
        };

        const params = new URLSearchParams({
          page: "1",
          limit: "100",
        });

        if (filters.search) params.set("search", filters.search);
        if (filters.category) params.set("category", filters.category);
        if (filters.priceRange) params.set("priceRange", filters.priceRange);
        if (filters.rating) params.set("rating", filters.rating);
        if (filters.duration) params.set("duration", filters.duration);
        if (filters.level) params.set("level", filters.level);
        if (filters.sort) params.set("sort", filters.sort);

        const coursesResponse = await fetch(`/api/courses?${params.toString()}`, {
          cache: "no-store",
        });

        if (!coursesResponse.ok) {
          throw new Error(`Failed to fetch courses: ${coursesResponse.status}`);
        }

        const coursesData = await coursesResponse.json();

        const filteredCourses = coursesData.courses || [];

        const transformedCourses = filteredCourses.map(
          (course: {
            id: string;
            title: string;
            description: string;
            price: number;
            originalPrice?: number;
            thumbnail?: string;
            instructor: {
              name: string;
            };
            averageRating: number;
            studentCount: number;
            level: string;
            duration: number;
            language: string;
            isPublished: boolean;
            isFeatured: boolean;
            createdAt: string;
            updatedAt: string;
            category?: {
              id: string;
              name: string;
              slug: string;
            };
          }) => {
            return {
              id: course.id,
              title: course.title,
              instructor: course.instructor?.name || "Unknown Instructor",
              rating: course.averageRating || 0,
              students: course.studentCount || 0,

              price: course.price,
              originalPrice: course.originalPrice || course.price,
              thumbnail: course.thumbnail || "/api/placeholder/300/200",
              duration: `${Math.round(course.duration / 60)} hours`,
              level: course.level,
              category: course.category?.name || "General",
              description: course.description || "",
            };
          }
        );

        setAllCourses(transformedCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setAllCourses([]);
        setCourses([]);
        setPagination({
          page: 1,
          limit: 9,
          total: 0,
          pages: 1,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [search, category, priceRange, rating, duration, level, sort]);

  useEffect(() => {
    if (allCourses.length > 0 && !loading) {
      const page = parseInt(pageParam || "1");
      const limit = parseInt(limitParam || "9");

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedCourses = allCourses.slice(startIndex, endIndex);

      setCourses(paginatedCourses);
      setPagination({
        page,
        limit,
        total: allCourses.length,
        pages: Math.ceil(allCourses.length / limit),
      });
    } else if (allCourses.length === 0 && !loading) {
      setCourses([]);
      setPagination({
        page: 1,
        limit: 9,
        total: 0,
        pages: 1,
      });
    }
  }, [pageParam, limitParam, allCourses, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1C1F2A] to-[#2A2D3A]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
          <CoursesHeader />

          <div className="mt-4 sm:mt-6 lg:mt-8">
            <div className="lg:hidden mb-6">
              <CourseFilters />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              <div className="lg:col-span-1 hidden lg:block">
                <CourseFilters />
              </div>

              <div className="lg:col-span-3">
                <div className="flex items-center justify-center py-20">
                  <div className="text-white">Loading courses...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C1F2A] to-[#2A2D3A]">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        <CoursesHeader />

        <div className="mt-4 sm:mt-6 lg:mt-8">
          {/* Mobile: Search and Filters at top - Always visible */}
          <div className="lg:hidden mb-6">
            <CourseFilters />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {/* Desktop: Filter Sidebar - Hidden on mobile */}
            <div className="lg:col-span-1 hidden lg:block">
              <CourseFilters />
            </div>

            {/* Course Grid - Always visible */}
            <div className="lg:col-span-3">
              <CourseGridClient
                courses={courses}
                currentPage={pagination.page}
                totalPages={pagination.pages}
                totalItems={pagination.total}
                itemsPerPage={pagination.limit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
