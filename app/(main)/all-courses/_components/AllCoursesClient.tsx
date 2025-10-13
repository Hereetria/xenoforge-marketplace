"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BookOpen, Clock, Users, Play, CheckCircle, Crown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/contexts/SubscriptionContext";
import toast from "react-hot-toast";
import Image from "next/image";

interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string | null;
  price: number;
  thumbnail: string | null;
  level: string;
  duration: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
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
  };
  modules: Array<{
    id: string;
    title: string;
    order: number;
  }>;
  isEnrolled: boolean;
  enrollmentId: string | null;
  enrolledAt: string | null;
  _count: {
    enrollments: number;
    lessons: number;
  };
}

export default function AllCoursesClient() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const coursesPerPage = 9;
  const { data: session } = useSession();
  const { hasActiveSubscription, isLoading: subscriptionLoading } =
    useSubscription();
  const router = useRouter();

  const fetchCourses = useCallback(async () => {
    try {
      const response = await fetch("/api/courses/all");
      if (response.ok) {
        const data = await response.json();
        setAllCourses(data.courses);
        setTotalPages(Math.ceil(data.courses.length / coursesPerPage));
        updateDisplayedCourses(data.courses, 1);
      } else {
        toast.error("Failed to fetch courses");
      }
    } catch {
      toast.error("Failed to fetch courses");
    } finally {
      setIsLoading(false);
    }
  }, [coursesPerPage]);

  useEffect(() => {
    if (session?.user && !subscriptionLoading) {
      if (!hasActiveSubscription) {
        router.push("/");
        toast.error("Premium subscription required to access all courses");
        return;
      }
      fetchCourses();
    }
  }, [session, hasActiveSubscription, subscriptionLoading, router, fetchCourses]);

  const updateDisplayedCourses = (coursesList: Course[], page: number) => {
    const startIndex = (page - 1) * coursesPerPage;
    const endIndex = startIndex + coursesPerPage;
    const paginatedCourses = coursesList.slice(startIndex, endIndex);
    setCourses(paginatedCourses);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateDisplayedCourses(allCourses, page);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEnroll = async (courseId: string) => {
    if (!hasActiveSubscription) {
      toast.error("Premium subscription required");
      return;
    }

    try {
      setEnrollingCourseId(courseId);

      const response = await fetch(`/api/enrollments/${courseId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success("Successfully enrolled in course!");

        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course.id === courseId
              ? { ...course, isEnrolled: true, enrollmentId: "temp-id" }
              : course
          )
        );
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to enroll in course");
      }
    } catch {
      toast.error("Failed to enroll in course");
    } finally {
      setEnrollingCourseId(null);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-green-500";
      case "intermediate":
        return "bg-yellow-500";
      case "advanced":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (subscriptionLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1C1F2A] to-[#2A2D3A]">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            {/* Header Skeleton */}
            <div className="mb-8">
              <div className="text-center space-y-4">
                <div className="h-12 bg-[#6B7280]/30 rounded w-80 mx-auto"></div>
                <div className="h-6 bg-[#6B7280]/20 rounded w-96 mx-auto"></div>
                <div className="flex justify-center gap-4 mt-4">
                  <div className="h-8 bg-[#6B7280]/30 rounded w-32"></div>
                  <div className="h-8 bg-[#6B7280]/20 rounded w-24"></div>
                </div>
              </div>
            </div>

            {/* Courses Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="bg-[#2A2D3A] border border-[#6B7280]/30 rounded-lg overflow-hidden"
                >
                  {/* Thumbnail Skeleton */}
                  <div className="h-48 bg-[#6B7280]/20"></div>

                  {/* Content Skeleton */}
                  <div className="p-4 sm:p-6 space-y-3">
                    <div className="h-4 bg-[#6B7280]/20 rounded w-20"></div>
                    <div className="h-6 bg-[#6B7280]/30 rounded w-full"></div>
                    <div className="h-4 bg-[#6B7280]/20 rounded w-3/4"></div>
                    <div className="h-4 bg-[#6B7280]/20 rounded w-1/2"></div>

                    {/* Instructor Skeleton */}
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-[#6B7280]/30 rounded-full"></div>
                      <div className="h-4 bg-[#6B7280]/20 rounded w-24"></div>
                    </div>

                    {/* Stats Skeleton */}
                    <div className="flex gap-4">
                      <div className="h-4 bg-[#6B7280]/20 rounded w-16"></div>
                      <div className="h-4 bg-[#6B7280]/20 rounded w-12"></div>
                      <div className="h-4 bg-[#6B7280]/20 rounded w-14"></div>
                    </div>

                    {/* Price and Button Skeleton */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="h-6 bg-[#6B7280]/30 rounded w-20"></div>
                      <div className="h-10 bg-[#6B7280]/30 rounded w-full sm:w-24"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Skeleton */}
            <div className="flex justify-center items-center mt-8 sm:mt-12 space-x-2">
              <div className="h-8 bg-[#6B7280]/20 rounded w-16"></div>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-8 bg-[#6B7280]/20 rounded w-8"></div>
                ))}
              </div>
              <div className="h-8 bg-[#6B7280]/20 rounded w-12"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hasActiveSubscription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1C1F2A] to-[#2A2D3A] flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-16 h-16 text-[#F5B301] mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-4">Premium Required</h1>
          <p className="text-gray-400 mb-6">
            You need a premium subscription to access all courses
          </p>
          <Button
            onClick={() => router.push("/premium-checkout")}
            className="bg-[#F5B301] text-[#1C1F2A] hover:bg-[#FFF9E6]"
          >
            Get Premium
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C1F2A] to-[#2A2D3A]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="w-8 h-8 text-[#F5B301]" />
            <h1 className="text-4xl font-bold text-white">All Courses</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Explore our complete catalog of courses with your premium subscription
          </p>
          <div className="mt-4 flex items-center gap-4">
            <Badge className="bg-[#F5B301] text-[#1C1F2A] px-3 py-1 hover:bg-[#FFF9E6] hover:text-[#1C1F2A] transition-colors duration-200">
              Premium Access
            </Badge>
          </div>
        </div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              No courses available
            </h3>
            <p className="text-gray-500">Check back later for new courses!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {courses.map((course) => (
              <Card
                key={course.id}
                className="bg-[#2A2D3A] border-[#6B7280] hover:border-[#F5B301] transition-all duration-200 overflow-hidden group"
              >
                {/* Course Thumbnail */}
                <div
                  className={`relative h-48 flex items-center justify-center overflow-hidden ${
                    course.thumbnail && course.thumbnail.startsWith("http")
                      ? "bg-[#6B7280]"
                      : "bg-gradient-to-br from-[#F5B301] to-[#FFD700]"
                  }`}
                >
                  {course.thumbnail && course.thumbnail.startsWith("http") ? (
                    <>
                      <Image
                        src={course.thumbnail}
                        alt={course.title}
                        width={300}
                        height={200}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const nextElement = e.currentTarget
                            .nextElementSibling as HTMLElement;
                          if (nextElement) {
                            nextElement.style.display = "flex";
                          }
                        }}
                      />
                      <div className="w-full h-full items-center justify-center hidden">
                        <BookOpen className="w-16 h-16 text-[#1C1F2A]" />
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-[#1C1F2A]" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <Badge className={`${getLevelColor(course.level)} text-white`}>
                      {course.level}
                    </Badge>
                  </div>
                  {course.isEnrolled && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-green-500 text-white">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Enrolled
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Course Content */}
                <div className="p-4 sm:p-6">
                  <div className="mb-3">
                    <Badge
                      variant="outline"
                      className="border-[#6B7280] text-[#6B7280] text-xs"
                      style={{
                        borderColor: course.category?.color || "#6B7280",
                        color: course.category?.color || "#6B7280",
                      }}
                    >
                      {course.category?.name || "Uncategorized"}
                    </Badge>
                  </div>

                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 line-clamp-2 group-hover:text-[#F5B301] transition-colors">
                    {course.title}
                  </h3>

                  <p className="text-gray-400 text-xs sm:text-sm mb-4 line-clamp-2">
                    {course.shortDescription || course.description}
                  </p>

                  {/* Instructor */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 bg-[#F5B301] rounded-full flex items-center justify-center">
                      <span className="text-[#1C1F2A] text-xs font-bold">
                        {course.instructor.name?.charAt(0) ||
                          course.instructor.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-gray-400 text-sm">
                      {course.instructor.name || course.instructor.email}
                    </span>
                  </div>

                  {/* Course Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDuration(course.duration)}
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {course._count.lessons} modules
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {course._count.enrollments}
                    </div>
                  </div>

                  {/* Price and Action */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                    <div className="text-xl sm:text-2xl font-bold text-[#F5B301]">
                      Free
                      <span className="text-xs sm:text-sm text-gray-400 line-through ml-1 sm:ml-2">
                        ${course.price}
                      </span>
                    </div>
                    <Button
                      onClick={() => {
                        if (course.isEnrolled) {
                          toast.error(
                            "Not allowed in demo mode. This feature is for demonstration purposes only."
                          );
                        } else {
                          handleEnroll(course.id);
                        }
                      }}
                      disabled={enrollingCourseId === course.id}
                      className="bg-[#F5B301] text-[#1C1F2A] hover:bg-[#FFF9E6] transition-colors duration-200 w-full sm:w-auto text-sm sm:text-base px-4 py-2"
                    >
                      {enrollingCourseId === course.id ? (
                        "Enrolling..."
                      ) : course.isEnrolled ? (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Continue
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-4 h-4 mr-2" />
                          Enroll Free
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && courses.length > 0 && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-center items-center mt-8 sm:mt-12 space-y-4 sm:space-y-0 sm:space-x-2">
            {/* Previous Button */}
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
              className="px-3 py-2 text-xs sm:text-sm border-[#6B7280] text-[#6B7280] hover:bg-[#F5B301] hover:text-[#1C1F2A] hover:border-[#F5B301] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </Button>

            {/* Page Numbers */}
            <div className="flex flex-wrap justify-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                const shouldShow =
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1);

                if (!shouldShow) {
                  if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="px-2 py-2 text-[#6B7280]">
                        ...
                      </span>
                    );
                  }
                  return null;
                }

                return (
                  <Button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    variant={currentPage === page ? "default" : "outline"}
                    className={`px-2 sm:px-3 py-2 text-xs sm:text-sm ${
                      currentPage === page
                        ? "bg-[#F5B301] text-[#1C1F2A] border-[#F5B301]"
                        : "border-[#6B7280] text-[#6B7280] hover:bg-[#F5B301] hover:text-[#1C1F2A] hover:border-[#F5B301]"
                    }`}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>

            {/* Next Button */}
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
              className="px-3 py-2 text-xs sm:text-sm border-[#6B7280] text-[#6B7280] hover:bg-[#F5B301] hover:text-[#1C1F2A] hover:border-[#F5B301] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </Button>
          </div>
        )}

        {/* Page Info */}
        {!isLoading && courses.length > 0 && (
          <div className="text-center mt-4 sm:mt-6">
            <p className="text-sm text-[#6B7280]">
              Showing {(currentPage - 1) * coursesPerPage + 1} to{" "}
              {Math.min(currentPage * coursesPerPage, allCourses.length)} of{" "}
              {allCourses.length} courses
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
