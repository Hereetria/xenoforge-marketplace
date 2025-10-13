"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getPriceInfo } from "@/lib/discountUtils";
import Image from "next/image";

interface ApiCourse {
  id: string;
  title: string;
  instructor?: { name?: string } | null;
  averageRating?: number;
  studentCount?: number;
  price: number;
  thumbnail?: string | null;
  category?: { name?: string } | null;
}

export default function RecommendedCourses() {
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        let enrolledCourseIds: string[] = [];
        try {
          const enrollmentsRes = await fetch("/api/enrollments");
          if (enrollmentsRes.ok) {
            const enrollmentsData = await enrollmentsRes.json();
            enrolledCourseIds =
              enrollmentsData.enrollments?.map(
                (e: { courseId: string }) => e.courseId
              ) || [];
          }
        } catch (error) {
          console.error("Error fetching enrollments:", error);
        }

        let res = await fetch(
          `/api/courses?featured=true&limit=20&_t=${Date.now()}`
        );
        let list: ApiCourse[] = [];
        if (res.ok) {
          const json = await res.json();
          list = json.courses || [];
        }

        if (!list.length) {
          res = await fetch(`/api/courses?page=1&limit=100&_t=${Date.now()}`);
          if (res.ok) {
            const json = await res.json();
            list = json.courses || [];
          }
        }

        const unenrolledCourses = list.filter(
          (course) => !enrolledCourseIds.includes(course.id)
        );

        setCourses(unenrolledCourses);
      } catch (e) {
        console.error("Failed to load recommendations", e);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const randomThree = useMemo(() => {
    if (courses.length === 0) return [] as ApiCourse[];

    const shuffled = [...courses].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }, [courses]);

  const getCourseSearchHref = (courseTitle: string) => {
    return `/courses?search=${encodeURIComponent(courseTitle)}`;
  };

  return (
    <div className="bg-[#1C1F2A] border border-[#6B7280] rounded-lg p-4 sm:p-6 sticky top-17 sm:top-17 lg:top-17 transition-all duration-500 ease-in-out transform hover:scale-[1.02] hover:shadow-xl hover:shadow-[#F5B301]/10">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-white">
          Recommended for You
        </h2>
        <Link
          href="/courses"
          className="text-[#F5B301] hover:text-[#FFF9E6] transition-colors duration-200 text-xs sm:text-sm font-medium"
        >
          See All
        </Link>
      </div>

      <div className="space-y-4">
        {loading && (
          <div className="text-xs text-[#6B7280]">Loading recommendations...</div>
        )}

        {!loading && randomThree.length === 0 && (
          <div className="text-xs text-[#6B7280]">
            No recommendations available.{" "}
            <Link href="/courses" className="underline text-[#F5B301]">
              Browse all courses
            </Link>
          </div>
        )}

        {randomThree.map((course) => {
          const priceInfo = getPriceInfo(course.price);
          const displayPrice = `$${priceInfo.discountedPrice.toFixed(2)}`;
          const instructorName = course.instructor?.name || "Unknown Instructor";
          const categoryName = course.category?.name || "General";

          return (
            <div
              key={course.id}
              className="bg-[#2A2D3A] border border-[#6B7280] rounded-lg p-3 sm:p-4 hover:border-[#F5B301]/50 transition-colors duration-200"
            >
              <div className="flex gap-2 sm:gap-3">
                <div className="flex-shrink-0">
                  <div className="w-12 h-10 sm:w-16 sm:h-12 bg-[#6B7280] rounded-lg flex items-center justify-center overflow-hidden">
                    {course.thumbnail ? (
                      <Image
                        src={course.thumbnail}
                        alt={course.title}
                        width={64}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm sm:text-lg">🎓</span>
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-xs sm:text-sm font-semibold text-white line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-[#6B7280] mt-1">by {instructorName}</p>

                  <div className="flex items-center gap-1 sm:gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-[#F5B301]">★</span>
                      <span className="text-xs text-[#6B7280]">
                        {course.averageRating ?? 0}
                      </span>
                    </div>
                    <div className="text-xs text-[#6B7280] hidden sm:block">
                      ({(course.studentCount ?? 0).toLocaleString()} students)
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex gap-1">
                      <span className="text-xs bg-[#1C1F2A] text-[#6B7280] px-1 sm:px-2 py-1 rounded">
                        {categoryName}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-[#F5B301]">
                      {displayPrice}
                    </div>
                  </div>

                  <Link
                    href={getCourseSearchHref(course.title)}
                    className="block mt-2 sm:mt-3 text-xs bg-[#F5B301] text-[#1C1F2A] px-2 sm:px-3 py-1 rounded font-medium hover:bg-[#FFF9E6] transition-colors duration-200 text-center"
                  >
                    View Course
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
