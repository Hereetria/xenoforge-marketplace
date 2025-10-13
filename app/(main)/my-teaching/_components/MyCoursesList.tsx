"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, BarChart2, Eye, EyeOff } from "lucide-react";
import RestrictedPopup from "@/components/ui/restricted-popup";

interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  thumbnail?: string;
  price: number;
  level: "BEGINNER" | "INTERMEDIATE" | "EXPERT";
  language: string;
  duration: number;
  isPublished: boolean;
  isFeatured: boolean;
  enrollments: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export default function MyCoursesList() {
  const { data: session, status } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRestrictedPopup, setShowRestrictedPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 3;

  const handleRestrictedAction = () => {
    setShowRestrictedPopup(true);
  };

  const totalPages = Math.ceil(courses.length / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;
  const currentCourses = courses.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const fetchCourses = useCallback(async () => {
    try {
      console.log("Starting to fetch courses...");

      if (status === "loading") {
        console.log("Session is still loading...");
        return;
      }

      if (!session?.user) {
        console.log("User not authenticated, showing empty state");
        setCourses([]);
        setLoading(false);
        return;
      }

      const dbHealthResponse = await fetch("/api/health/db");
      if (!dbHealthResponse.ok) {
        console.error("Database health check failed:", dbHealthResponse.status);
        setCourses([]);
        setLoading(false);
        return;
      }

      const response = await fetch("/api/courses/my-courses");

      if (response.ok) {
        const data = await response.json();
        setCourses(Array.isArray(data) ? data : []);
        setCurrentPage(1);
      } else {
        console.error("Failed to fetch courses, status:", response.status);

        let errorData: { error?: string; message?: string; code?: string } = {};
        try {
          errorData = await response.json();
          console.error("Error response data:", errorData);

          if (errorData.code === "USER_NOT_SYNCED") {
            console.error("User not synced with database - user needs to register");
            alert(
              "You need to register an account first. Redirecting to signup page..."
            );
            window.location.href = "/auth/signup";
            return;
          }
        } catch (jsonError) {
          console.error("Failed to parse error response as JSON:", jsonError);
        }

        console.error("Failed to fetch courses:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        });

        setCourses([]);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [status, session]);

  useEffect(() => {
    if (status !== "loading") {
      fetchCourses();
    }
  }, [status, session, fetchCourses]);

  useEffect(() => {
    const handleCourseCreated = () => {
      fetchCourses();
    };

    window.addEventListener("courseCreated", handleCourseCreated);
    return () => window.removeEventListener("courseCreated", handleCourseCreated);
  }, [fetchCourses]);

  const formatDuration = (minutes: number) => {
    const hours = minutes / 60;
    if (hours >= 1) {
      return `${hours}h`;
    }
    return `${minutes}m`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "BEGINNER":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "INTERMEDIATE":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "EXPERT":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  if (loading) {
    return (
      <Card className="bg-[#1C1F2A] border-[#6B7280] p-6">
        <h2 className="text-2xl font-bold text-white mb-6">My Courses</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-[#2A2D3A] rounded-lg p-4">
                <div className="flex gap-4">
                  <div className="w-24 h-16 bg-[#3A3D4A] rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[#3A3D4A] rounded w-3/4"></div>
                    <div className="h-3 bg-[#3A3D4A] rounded w-1/2"></div>
                    <div className="h-3 bg-[#3A3D4A] rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <>
      <RestrictedPopup
        isVisible={showRestrictedPopup}
        onClose={() => setShowRestrictedPopup(false)}
      />
      <Card className="bg-[#1C1F2A] border-[#6B7280] p-3 sm:p-4 lg:p-6">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
            My Courses
          </h2>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-[#6B7280] text-lg mb-4">No courses created yet</div>
            <p className="text-[#6B7280] text-sm">
              Create your first course using the form on the left
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3 sm:space-y-4">
              {currentCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-[#2A2D3A] border border-[#6B7280] rounded-lg p-3 sm:p-4 hover:border-[#F5B301]/50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    {/* Thumbnail */}
                    <div className="w-full sm:w-24 h-32 sm:h-16 bg-[#3A3D4A] rounded-lg overflow-hidden flex-shrink-0">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#6B7280] text-xs">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Course Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
                        <h3 className="text-base sm:text-lg font-semibold text-white">
                          {course.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`text-xs ${getLevelColor(course.level)}`}
                          >
                            {course.level}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-[#6B7280] text-sm mb-3 line-clamp-2">
                        {course.shortDescription || course.description}
                      </p>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm gap-2">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[#6B7280]">
                          <span className="text-xs sm:text-sm">
                            {formatDuration(course.duration)}
                          </span>
                          <span className="text-xs sm:text-sm">
                            {course.language}
                          </span>
                          {course.enrollments > 0 && (
                            <span className="text-xs sm:text-sm">
                              {course.enrollments} students
                            </span>
                          )}
                          {course.rating > 0 && (
                            <span className="flex items-center gap-1 text-xs sm:text-sm">
                              ⭐ {course.rating}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold text-sm sm:text-base">
                            {formatPrice(course.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Published Status */}
                  <div className="flex items-center gap-2 mb-2 mt-2 lg:mt-4">
                    <span className="text-sm text-[#6B7280]">Status:</span>
                    <Badge
                      className={
                        course.isPublished
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      }
                    >
                      {course.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap justify-center sm:justify-end gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[#6B7280]/30">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#6B7280] text-[#6B7280] hover:bg-[#3A3D4A]"
                      onClick={handleRestrictedAction}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#6B7280] text-[#6B7280] hover:bg-[#3A3D4A]"
                      onClick={handleRestrictedAction}
                    >
                      <BarChart2 className="h-4 w-4 mr-2" />
                      Analytics
                    </Button>
                    {course.isPublished ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                        onClick={handleRestrictedAction}
                      >
                        <EyeOff className="h-4 w-4 mr-2" />
                        Unpublish
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="bg-[#F5B301] text-[#1C1F2A] hover:bg-[#FFF9E6]"
                        onClick={handleRestrictedAction}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Publish
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-[#6B7280]/30 gap-3">
                <div className="text-xs sm:text-sm text-[#6B7280] text-center sm:text-left">
                  Showing {startIndex + 1}-{Math.min(endIndex, courses.length)} of{" "}
                  {courses.length} courses
                </div>

                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="border-[#6B7280] text-[#6B7280] hover:bg-[#3A3D4A] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToPage(page)}
                          className={
                            currentPage === page
                              ? "bg-[#F5B301] text-[#1C1F2A] hover:bg-[#FFF9E6]"
                              : "border-[#6B7280] text-[#6B7280] hover:bg-[#3A3D4A]"
                          }
                        >
                          {page}
                        </Button>
                      )
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="border-[#6B7280] text-[#6B7280] hover:bg-[#3A3D4A] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </>
  );
}
