"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getPriceInfo } from "@/lib/discountUtils";

const getLevelDisplay = (level: string): string => {
  switch (level) {
    case "BEGINNER":
      return "Beginner";
    case "INTERMEDIATE":
      return "Intermediate";
    case "EXPERT":
      return "Expert";
    default:
      return level;
  }
};

interface Course {
  id: string;
  title: string;
  instructor: {
    id?: string;
    name: string;
  };
  averageRating: number;
  studentCount: number;
  price: number;
  originalPrice?: number;
  thumbnail?: string;
  duration: number;
  level: string;
}

export default function FeaturedCourses() {
  const { data: session, status } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);

        const coursesResponse = await fetch("/api/courses?limit=50", {
          cache: "no-store",
        });

        if (!coursesResponse.ok) {
          throw new Error("Failed to fetch courses");
        }

        const coursesData = await coursesResponse.json();
        let allCourses: Course[] = coursesData.courses || [];

        console.log(`Courses before any filtering: ${allCourses.length}`);
        const currentUserId = session?.user?.id;

        if (currentUserId) {
          try {
            const enrollmentsResponse = await fetch("/api/enrollments", {
              cache: "no-store",
            });

            if (enrollmentsResponse.ok) {
              const enrollmentsData = await enrollmentsResponse.json();
              const enrolledCourseIds =
                enrollmentsData.enrollments?.map(
                  (e: { courseId: string }) => e.courseId
                ) || [];

              allCourses = allCourses.filter((course: Course) => {
                const courseId = course.id.toString();
                const isEnrolled = enrolledCourseIds.includes(courseId);
                const isOwn =
                  currentUserId && course?.instructor?.id
                    ? course.instructor.id === currentUserId
                    : false;

                return !isEnrolled && !isOwn;
              });
            }
          } catch (enrollmentError) {
            console.error("Error fetching enrollments:", enrollmentError);
          }
        }

        for (let i = allCourses.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [allCourses[i], allCourses[j]] = [allCourses[j], allCourses[i]];
        }
        const finalCourses = allCourses.slice(0, 6);

        setCourses(finalCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    if (status !== "loading") {
      fetchCourses();
    }
  }, [status, session]);

  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-[#1C1F2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Featured Courses
            </h2>
            <p className="text-xl text-[#6B7280] max-w-3xl mx-auto">
              Discover our most popular courses taught by industry experts
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-[#2A2D3A] rounded-xl overflow-hidden border border-[#6B7280] animate-pulse"
              >
                <div className="aspect-video bg-[#6B7280]"></div>
                <div className="p-4 sm:p-6">
                  <div className="h-4 bg-[#6B7280] rounded mb-2"></div>
                  <div className="h-3 bg-[#6B7280] rounded mb-3 w-2/3"></div>
                  <div className="h-3 bg-[#6B7280] rounded mb-4 w-1/2"></div>
                  <div className="h-8 bg-[#6B7280] rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (courses.length === 0) {
    return (
      <section className="py-16 lg:py-24 bg-[#1C1F2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Featured Courses
            </h2>
            <p className="text-xl text-[#6B7280] max-w-3xl mx-auto">
              Discover our most popular courses taught by industry experts
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-[#6B7280] text-lg">
              No featured courses available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-[#1C1F2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Featured Courses
          </h2>
          <p className="text-xl text-[#6B7280] max-w-3xl mx-auto">
            Discover our most popular courses taught by industry experts
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {courses.map((course) => {
            const priceInfo = getPriceInfo(course.price);

            return (
              <div
                key={course.id}
                className="bg-[#2A2D3A] rounded-xl overflow-hidden border border-[#6B7280] hover:border-[#F5B301] transition-colors duration-200"
              >
                <div className="aspect-video bg-[#6B7280] relative">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-sm">Course Preview</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className="bg-[#F5B301] text-[#1C1F2A] px-2 py-1 rounded text-xs font-semibold">
                      {getLevelDisplay(course.level)}
                    </span>
                  </div>
                  {priceInfo.showDiscount && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                        40% OFF
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 sm:p-6">
                  <h3 className="text-white font-semibold text-base sm:text-lg mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-[#6B7280] text-xs sm:text-sm mb-3">
                    by {course.instructor.name}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      <div className="flex text-[#F5B301]">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={
                              i < Math.floor(course.averageRating)
                                ? "text-[#F5B301]"
                                : "text-[#6B7280]"
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-[#6B7280] text-xs sm:text-sm">
                        {course.averageRating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-[#6B7280] text-xs sm:text-sm">
                      ({course.studentCount.toLocaleString()} students)
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-[#F5B301] font-bold text-lg sm:text-xl">
                        ${priceInfo.discountedPrice}
                      </span>
                      {priceInfo.showDiscount && (
                        <span className="text-[#6B7280] line-through text-xs sm:text-sm">
                          ${priceInfo.originalPrice}
                        </span>
                      )}
                    </div>
                    <span className="text-[#6B7280] text-xs sm:text-sm">
                      {Math.round(course.duration / 60)}h
                    </span>
                  </div>

                  <Link
                    href={`/courses?search=${encodeURIComponent(course.title)}`}
                    className="w-full bg-[#F5B301] text-[#1C1F2A] py-2 px-3 sm:px-4 rounded-lg font-semibold hover:bg-[#FFF9E6] transition-colors duration-200 text-center block text-sm sm:text-base"
                  >
                    View Course
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/courses"
            className="bg-transparent border-2 border-[#F5B301] text-[#F5B301] px-8 py-3 rounded-lg font-semibold hover:bg-[#F5B301] hover:text-[#1C1F2A] transition-colors duration-200"
          >
            View All Courses
          </Link>
        </div>
      </div>
    </section>
  );
}
