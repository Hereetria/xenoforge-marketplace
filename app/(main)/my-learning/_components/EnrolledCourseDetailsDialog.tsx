"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Users, Clock, BookOpen, Award, Play, CheckCircle, X } from "lucide-react";

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

interface EnrolledCourseDetailsDialogProps {
  course: {
    id: string;
    courseId: string;
    title: string;
    instructor: string;
    progress: number;
    thumbnail?: string;
    duration: string;
    level: string;
    category: string;
    lessonsCompleted: number;
    totalLessons: number;
    isCompleted: boolean;
    lastAccessed: string;
  };
  children: React.ReactNode;
}

export default function EnrolledCourseDetailsDialog({
  course,
  children,
}: EnrolledCourseDetailsDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const detailsId = searchParams?.get("details");
    if (detailsId === course.id) {
      setOpen(true);
    } else if (open && detailsId !== course.id) {
      setOpen(false);
    }
  }, [searchParams, course.id, open]);

  const updateQuery = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const handleContinueLearning = () => {
    const params = new URLSearchParams(searchParams?.toString());
    params.delete("details");
    params.set("progress", course.id);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const handleExploreCourses = () => {
    setOpen(false);

    window.location.href = `/courses`;
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          updateQuery("details", course.id);
        } else {
          const current = searchParams?.get("details");
          if (current === course.id) updateQuery("details");
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl bg-[#1C1F2A] border-2 border-[#F5B301]/30 shadow-2xl text-white p-6 sm:p-8">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-white">
              {course.title}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-7 w-7 p-0 text-gray-300 hover:text-white hover:bg-white/10"
              aria-label="Close"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Course Image */}
          <div className="relative">
            <div className="w-full h-48 bg-[#2A2D3A] rounded-lg flex items-center justify-center overflow-hidden">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-6xl">📖</span>
              )}
            </div>
            {course.isCompleted && (
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                Completed
              </div>
            )}
          </div>

          {/* Course Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm text-[#6B7280]">
              <Users className="h-4 w-4" />
              <span>by {course.instructor}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#6B7280]">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#6B7280]">
              <BookOpen className="h-4 w-4" />
              <span>{getLevelDisplay(course.level)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#6B7280]">
              <Award className="h-4 w-4" />
              <span>{course.category}</span>
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-[#2A2D3A] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-white">Learning Progress</h3>
              <span className="text-sm text-[#6B7280]">
                {course.lessonsCompleted}/{course.totalLessons} lessons
              </span>
            </div>
            <div className="w-full bg-[#1C1F2A] rounded-full h-2 mb-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  course.isCompleted ? "bg-green-500" : "bg-[#F5B301]"
                }`}
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6B7280]">Progress: {course.progress}%</span>
              <span className="text-[#6B7280]">
                Last accessed: {new Date(course.lastAccessed).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Course Description */}
          <div>
            <h3 className="font-semibold text-white mb-2">About This Course</h3>
            <p className="text-[#6B7280] text-sm leading-relaxed">
              Continue your learning journey with {course.title}. This course is
              designed for {getLevelDisplay(course.level)} level students and covers
              essential topics in {course.category}. You&apos;ve already made great
              progress with {course.progress}% completion!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleContinueLearning}
              className="flex-1 bg-[#F5B301] text-[#1C1F2A] hover:bg-[#FFF9E6] transition-colors duration-200"
            >
              <Play className="h-4 w-4 mr-2" />
              {course.isCompleted ? "Review Course" : "Continue Learning"}
            </Button>
            <Button
              onClick={handleExploreCourses}
              variant="outline"
              className="flex-1 border-[#6B7280] text-[#6B7280] hover:border-[#F5B301] hover:text-[#F5B301] transition-colors duration-200"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Explore More Courses
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
