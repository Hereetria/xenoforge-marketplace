"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Trophy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import EnrolledCourseDetailsDialog from "./EnrolledCourseDetailsDialog";
import LearningProgressDialog from "./LearningProgressDialog";
import CourseRatingDialog from "./CourseRatingDialog";
import { useLearningStats } from "@/contexts/LearningStatsContext";

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

interface EnrolledCourse {
  id: string;
  courseId: string;
  title: string;
  instructor: string;
  instructorAvatar?: string;
  progress: number;
  thumbnail?: string;
  lastAccessed?: Date;
  duration: string;
  lessonsCompleted: number;
  totalLessons: number;
  level: string;
  category: string;
  isCompleted: boolean;
  completedAt?: Date;
  hasCertificateEver?: boolean;
  hasRated?: boolean;
}

export default function EnrolledCourses() {
  const { refreshStats } = useLearningStats();
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await fetch("/api/enrollments");
        if (response.ok) {
          const data = await response.json();
          const enrollments = data.enrollments || [];

          const enrollmentsWithRatingStatus = await Promise.all(
            enrollments.map(
              async (enrollment: { courseId: string; [key: string]: any }) => {
                try {
                  const reviewResponse = await fetch(
                    `/api/courses/${enrollment.courseId}/reviews`
                  );
                  if (reviewResponse.ok) {
                    const reviewData = await reviewResponse.json();
                    const hasRated =
                      reviewData.reviews?.some(
                        (review: { userId: string }) =>
                          review.userId === reviewData.currentUserId
                      ) || false;
                    return { ...enrollment, hasRated };
                  }
                } catch (error) {
                  console.error("Error checking rating status:", error);
                }
                return { ...enrollment, hasRated: false };
              }
            )
          );

          setCourses(enrollmentsWithRatingStatus);
        }
      } catch (error) {
        console.error("Error fetching enrollments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  const formatLastAccessed = (date?: Date) => {
    if (!date) return "Never";

    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;
  };

  const calculateTotalLessons = (duration: string) => {
    const hoursMatch = duration.match(/(\d+)\s*hours?/i);
    if (hoursMatch) {
      const hours = parseInt(hoursMatch[1]);
      return Math.round(hours * 3);
    }
    return 0;
  };

  const totalPages = Math.ceil(courses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCourses = courses.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <Card className="bg-[#1C1F2A] border-[#6B7280] p-4 sm:p-6">
        <CardContent className="p-0">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">My Courses</h2>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="bg-[#2A2D3A] border-[#6B7280] p-3 sm:p-4 animate-pulse"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <div className="w-16 h-12 sm:w-24 sm:h-16 bg-[#6B7280] rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-[#6B7280] rounded w-3/4"></div>
                      <div className="h-3 bg-[#6B7280] rounded w-1/2"></div>
                      <div className="h-3 bg-[#6B7280] rounded w-1/3"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#1C1F2A] border-[#6B7280] p-4 sm:p-6">
      <CardContent className="p-0">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">My Courses</h2>
          {courses.length > 0 && (
            <p className="text-sm text-[#6B7280] mt-1">
              Showing {startIndex + 1}-{Math.min(endIndex, courses.length)} of{" "}
              {courses.length} courses
            </p>
          )}
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-lg font-semibold text-white mb-2">No courses yet</h3>
            <p className="text-[#6B7280] mb-4">
              Start your learning journey by enrolling in courses
            </p>
            <Link
              href="/courses"
              className="bg-[#F5B301] text-[#1C1F2A] px-6 py-3 rounded-lg font-medium hover:bg-[#FFF9E6] transition-colors duration-200"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {currentCourses.map((course) => (
                <Card
                  key={course.id}
                  className={`bg-[#2A2D3A] border-[#6B7280] p-3 sm:p-4 hover:border-[#F5B301]/50 transition-colors duration-200 ${
                    course.hasRated
                      ? "ring-2 ring-[#F5B301]/30 bg-gradient-to-r from-[#2A2D3A] to-[#2A2D3A]/80"
                      : ""
                  }`}
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-12 sm:w-24 sm:h-16 bg-[#6B7280] rounded-lg flex items-center justify-center overflow-hidden">
                          {course.thumbnail ? (
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-lg sm:text-2xl">📖</span>
                          )}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="text-sm sm:text-lg font-semibold text-white line-clamp-2">
                              {course.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-[#6B7280]">
                              by {course.instructor}
                            </p>
                            <p className="text-xs text-[#6B7280] mt-1">
                              Last accessed:{" "}
                              {formatLastAccessed(course.lastAccessed)}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs px-2 py-1 bg-[#6B7280]/20 text-[#6B7280] rounded">
                                {getLevelDisplay(course.level)}
                              </span>
                              <span className="text-xs px-2 py-1 bg-[#F5B301]/20 text-[#F5B301] rounded">
                                {course.category}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col sm:items-end gap-1 sm:gap-2">
                            <div className="text-xs sm:text-sm text-[#6B7280]">
                              {Math.round(
                                (course.progress / 100) *
                                  calculateTotalLessons(course.duration)
                              )}
                              /{calculateTotalLessons(course.duration)} lessons
                            </div>
                            <div className="text-xs sm:text-sm text-[#6B7280]">
                              {course.duration}
                            </div>
                            <div className="flex flex-col gap-1">
                              {course.hasCertificateEver ? (
                                <div className="flex items-center gap-1 text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">
                                  <Trophy className="h-3 w-3" />
                                  Certificate Earned
                                </div>
                              ) : (
                                course.isCompleted && (
                                  <div className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">
                                    ✓ Completed
                                  </div>
                                )
                              )}
                              {course.hasRated && (
                                <div className="text-xs px-2 py-1 bg-[#F5B301]/20 text-[#F5B301] rounded flex items-center gap-1">
                                  <Star className="h-3 w-3" /> Rated
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs sm:text-sm text-[#6B7280] mb-1">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <div className="w-full bg-[#1C1F2A] rounded-full h-1.5 sm:h-2">
                            <div
                              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                                course.isCompleted ? "bg-green-500" : "bg-[#F5B301]"
                              }`}
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2">
                          <LearningProgressDialog
                            course={{
                              id: course.id,
                              courseId: course.courseId,
                              title: course.title,
                              instructor: course.instructor,
                              progress: course.progress,
                              thumbnail: course.thumbnail,
                              duration: course.duration,
                              level: course.level,
                              category: course.category,
                              lessonsCompleted: course.lessonsCompleted,
                              totalLessons: course.totalLessons,
                              isCompleted: course.isCompleted,
                              lastAccessed:
                                course.lastAccessed instanceof Date
                                  ? course.lastAccessed.toISOString()
                                  : course.lastAccessed || new Date().toISOString(),
                              hasCertificateEver: course.hasCertificateEver || false,
                            }}
                            onSaved={({ progress, isCompleted, lastAccessed }) => {
                              setCourses((prev) => {
                                const updatedCourses = prev.map((c) =>
                                  c.id === course.id
                                    ? {
                                        ...c,
                                        progress,
                                        isCompleted,
                                        lastAccessed: new Date(lastAccessed),
                                      }
                                    : c
                                );

                                const wasCompleted = course.isCompleted;
                                const nowCompleted = isCompleted;

                                if (!wasCompleted && nowCompleted) {
                                  refreshStats().catch(() => {});
                                }

                                const moved = updatedCourses.find(
                                  (c) => c.id === course.id
                                );
                                const others = updatedCourses.filter(
                                  (c) => c.id !== course.id
                                );
                                return moved ? [moved, ...others] : updatedCourses;
                              });
                            }}
                          >
                            <Button className="bg-[#F5B301] text-[#1C1F2A] px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-[#FFF9E6] transition-colors duration-200 text-xs sm:text-sm text-center flex-1">
                              {course.isCompleted
                                ? "Review Course"
                                : "Continue Learning"}
                            </Button>
                          </LearningProgressDialog>
                          <EnrolledCourseDetailsDialog
                            course={{
                              id: course.id,
                              courseId: course.courseId,
                              title: course.title,
                              instructor: course.instructor,
                              progress: course.progress,
                              thumbnail: course.thumbnail,
                              duration: course.duration,
                              level: course.level,
                              category: course.category,
                              lessonsCompleted: course.lessonsCompleted,
                              totalLessons: course.totalLessons,
                              isCompleted: course.isCompleted,
                              lastAccessed:
                                course.lastAccessed instanceof Date
                                  ? course.lastAccessed.toISOString()
                                  : course.lastAccessed || new Date().toISOString(),
                            }}
                          >
                            <Button
                              variant="outline"
                              className="border border-[#6B7280] text-[#6B7280] px-3 sm:px-4 py-2 rounded-lg font-medium hover:border-[#F5B301] hover:text-[#F5B301] transition-colors duration-200 text-xs sm:text-sm text-center flex-1"
                            >
                              View Details
                            </Button>
                          </EnrolledCourseDetailsDialog>
                          <CourseRatingDialog
                            course={{
                              id: course.id,
                              courseId: course.courseId,
                              title: course.title,
                              instructor: course.instructor,
                              progress: course.progress,
                              isCompleted: course.isCompleted,
                              hasCertificateEver: course.hasCertificateEver,
                            }}
                            onRated={(isRated = true) => {
                              setCourses((prev) =>
                                prev.map((c) =>
                                  c.id === course.id
                                    ? { ...c, hasRated: isRated }
                                    : c
                                )
                              );
                            }}
                          >
                            <Button
                              variant="outline"
                              className="border border-[#6B7280] text-[#6B7280] px-3 sm:px-4 py-2 rounded-lg font-medium hover:border-[#F5B301] hover:text-[#F5B301] transition-colors duration-200 text-xs sm:text-sm text-center flex-1"
                            >
                              <Star className="h-4 w-4 mr-1" />
                              Rate
                            </Button>
                          </CourseRatingDialog>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-6 sm:mt-8">
                {/* Mobile Layout */}
                <div className="flex sm:hidden flex-col items-center gap-3">
                  <div className="flex items-center justify-between w-full">
                    <Button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      variant="outline"
                      size="sm"
                      className="border-[#6B7280] text-[#6B7280] hover:border-[#F5B301] hover:text-[#F5B301] disabled:opacity-50 flex-1 mr-2"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      <span className="text-sm">Prev</span>
                    </Button>

                    <div className="flex items-center gap-1 px-2">
                      <span className="text-xs text-[#6B7280] min-w-0">
                        {currentPage} of {totalPages}
                      </span>
                    </div>

                    <Button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      variant="outline"
                      size="sm"
                      className="border-[#6B7280] text-[#6B7280] hover:border-[#F5B301] hover:text-[#F5B301] disabled:opacity-50 flex-1 ml-2"
                    >
                      <span className="text-sm">Next</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>

                  {/* Page Numbers for Mobile */}
                  <div className="flex items-center gap-1 overflow-x-auto w-full justify-center px-2">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          className={`min-w-[32px] h-8 ${
                            currentPage === pageNum
                              ? "bg-[#F5B301] text-[#1C1F2A] hover:bg-[#FFF9E6]"
                              : "border-[#6B7280] text-[#6B7280] hover:border-[#F5B301] hover:text-[#F5B301]"
                          }`}
                        >
                          <span className="text-xs">{pageNum}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex items-center justify-center gap-4">
                  <Button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    variant="outline"
                    className="border-[#6B7280] text-[#6B7280] hover:border-[#F5B301] hover:text-[#F5B301] disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    <span>Previous</span>
                  </Button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 7) {
                        pageNum = i + 1;
                      } else if (currentPage <= 4) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 3) {
                        pageNum = totalPages - 6 + i;
                      } else {
                        pageNum = currentPage - 3 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          className={`${
                            currentPage === pageNum
                              ? "bg-[#F5B301] text-[#1C1F2A] hover:bg-[#FFF9E6]"
                              : "border-[#6B7280] text-[#6B7280] hover:border-[#F5B301] hover:text-[#F5B301]"
                          }`}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    className="border-[#6B7280] text-[#6B7280] hover:border-[#F5B301] hover:text-[#F5B301] disabled:opacity-50"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
