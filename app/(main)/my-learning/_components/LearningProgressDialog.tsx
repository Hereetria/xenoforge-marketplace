"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Play, Award, CheckCircle, Clock, BookOpen, Trophy, X } from "lucide-react";

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

interface LearningProgressDialogProps {
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
    hasCertificateEver?: boolean;
  };
  onSaved?: (update: {
    progress: number;
    isCompleted: boolean;
    lastAccessed: string;
  }) => void;
  children: React.ReactNode;
}

export default function LearningProgressDialog({
  course,
  onSaved,
  children,
}: LearningProgressDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentProgress, setCurrentProgress] = useState(course.progress);
  const [hasCertificate, setHasCertificate] = useState(course.isCompleted);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCertificateAlert, setShowCertificateAlert] = useState(false);
  const [certificateSaved, setCertificateSaved] = useState(course.isCompleted);
  const [hasEarnedCertificate, setHasEarnedCertificate] = useState(
    course.isCompleted
  );

  const [certificateEverEarned, setCertificateEverEarned] = useState(
    course.hasCertificateEver ?? course.isCompleted
  );

  useEffect(() => {
    setCurrentProgress(course.progress);
    setHasCertificate(course.isCompleted);
    setCertificateSaved(course.isCompleted);

    setHasEarnedCertificate((prev) => prev || course.isCompleted);

    setCertificateEverEarned(
      (prev) => prev || !!course.hasCertificateEver || course.isCompleted
    );
  }, [course.progress, course.isCompleted]);

  useEffect(() => {
    const progressId = searchParams?.get("progress");
    if (progressId === course.id) {
      setOpen(true);
    } else if (open && progressId !== course.id) {
      setOpen(false);
    }
  }, [searchParams, course.id]);

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

  const handleProgressChange = (newProgress: number) => {
    setCurrentProgress(newProgress);

    if (certificateEverEarned) {
      setHasCertificate(true);
      setShowCertificateAlert(false);
      return;
    }

    if (newProgress >= 100 && !certificateEverEarned) {
      setShowCertificateAlert(true);
      setHasCertificate(true);
    } else if (newProgress < 100 && !certificateEverEarned) {
      setShowCertificateAlert(false);
      setHasCertificate(false);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.round((x / rect.width) * 100);
    const clampedPercentage = Math.max(0, Math.min(100, percentage));
    handleProgressChange(clampedPercentage);
  };

  const handleSaveProgress = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/enrollments/${course.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          progress: currentProgress,
          isCompleted: currentProgress >= 100,
          lastAccessed: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        if (currentProgress >= 100) {
          setCertificateSaved(true);
          setHasEarnedCertificate(true);
          setCertificateEverEarned(true);
          setShowCertificateAlert(false);
        }

        const lastAccessedIso = new Date().toISOString();
        onSaved?.({
          progress: currentProgress,
          isCompleted: currentProgress >= 100,
          lastAccessed: lastAccessedIso,
        });

        setOpen(false);
        const params = new URLSearchParams(searchParams?.toString());
        const current = params.get("progress");
        if (current === course.id) {
          params.delete("progress");
          const query = params.toString();
          router.replace(query ? `${pathname}?${query}` : pathname, {
            scroll: false,
          });
        }
      } else {
        console.error("Failed to update progress");
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getProgressColor = () => {
    if (currentProgress >= 100) return "bg-green-600";
    if (currentProgress >= 75) return "bg-blue-600";
    if (currentProgress >= 50) return "bg-yellow-600";
    return "bg-[#D4A017]";
  };

  const getProgressText = () => {
    if (certificateEverEarned) {
      if (currentProgress >= 100)
        return "Course Completed! You've earned your certificate! 🎉🏆";
      if (currentProgress >= 75)
        return "Great progress! You've earned your certificate! 🏆";
      if (currentProgress >= 50)
        return "Good progress! You've earned your certificate! 🏆";
      if (currentProgress >= 25)
        return "Keep learning! You've earned your certificate! 🏆";
      return "You've earned your certificate! 🏆";
    }
    if (currentProgress >= 100) return "Course Completed! 🎉";
    if (currentProgress >= 75) return "Almost there! Keep going! 💪";
    if (currentProgress >= 50) return "Great progress! Halfway done! 🚀";
    if (currentProgress >= 25) return "Good start! Keep learning! 📚";
    return "Ready to begin your learning journey! 🌟";
  };

  const calculateTotalLessons = () => {
    const hoursMatch = course.duration.match(/(\d+)\s*hours?/i);
    if (hoursMatch) {
      const hours = parseInt(hoursMatch[1]);
      return Math.round(hours * 3);
    }
    return course.totalLessons;
  };

  const totalLessons = calculateTotalLessons();
  const completedLessons = Math.round((currentProgress / 100) * totalLessons);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          updateQuery("progress", course.id);
        } else {
          const current = searchParams?.get("progress");
          if (current === course.id) updateQuery("progress");
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl bg-[#1C1F2A] border-2 border-[#F5B301]/30 shadow-2xl text-white p-3 sm:p-6 lg:p-8 mx-2 sm:mx-4">
        <DialogHeader className="pb-2 sm:pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 leading-tight">
              <Play className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="truncate">Learning Progress - {course.title}</span>
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

        <div className="space-y-4 sm:space-y-6">
          {/* Course Info */}
          <div className="bg-[#2A2D3A] rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-12 h-9 sm:w-16 sm:h-12 bg-[#6B7280] rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
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
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm sm:text-lg leading-tight truncate">
                  {course.title}
                </h3>
                <p className="text-[#6B7280] text-xs sm:text-sm">
                  by {course.instructor}
                </p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs text-[#6B7280]">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {getLevelDisplay(course.level)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    {totalLessons} lessons
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-[#2A2D3A] rounded-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2">
              <h3 className="font-semibold text-white text-sm sm:text-lg">
                Your Learning Progress
              </h3>
              <div className="flex items-center gap-2">
                {certificateEverEarned ? (
                  <div className="flex items-center gap-1 text-green-400">
                    <Trophy className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm font-medium">
                      Certificate Earned!
                    </span>
                  </div>
                ) : showCertificateAlert ? (
                  <div className="flex items-center gap-1 text-yellow-400 animate-pulse">
                    <Trophy className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm font-medium">
                      Certificate Ready!
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-[#6B7280]">
                    <Award className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm">
                      Complete to earn certificate
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-[#6B7280]">Progress</span>
                <span className="text-sm sm:text-lg font-bold text-white">
                  {currentProgress}%
                </span>
              </div>

              <div className="relative">
                <div
                  className="relative cursor-pointer"
                  onClick={handleProgressBarClick}
                >
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={currentProgress}
                    onChange={(e) => handleProgressChange(parseInt(e.target.value))}
                    onInput={(e) =>
                      handleProgressChange(
                        parseInt((e.target as HTMLInputElement).value)
                      )
                    }
                    className="w-full h-3 sm:h-4 bg-[#1A1D2A] rounded-lg appearance-none cursor-grab active:cursor-grabbing slider focus:outline-none focus:ring-2 focus:ring-[#F5B301]/50"
                    style={{
                      background: `linear-gradient(to right, ${getProgressColor()} 0%, ${getProgressColor()} ${currentProgress}%, #1A1D2A ${currentProgress}%, #1A1D2A 100%)`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-[#6B7280] mt-1 sm:mt-2">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-xs sm:text-sm text-[#6B7280] mb-2">
                  {getProgressText()}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <span className="text-[#6B7280]">Lessons completed:</span>
                  <span className="text-white font-medium">
                    {completedLessons}/{totalLessons}
                  </span>
                </div>
                <div className="text-xs text-[#6B7280] mt-1">
                  ({course.duration} total • 20 min per lesson)
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Section - Show if certificate was earned OR if progress is 100% */}
          {(certificateEverEarned ||
            showCertificateAlert ||
            currentProgress >= 100) && (
            <div
              className={`rounded-lg p-4 ${
                certificateEverEarned
                  ? "bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30"
                  : "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    certificateEverEarned ? "bg-green-500" : "bg-yellow-500"
                  }`}
                >
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4
                    className={`font-semibold text-lg ${
                      certificateEverEarned ? "text-green-400" : "text-yellow-400"
                    }`}
                  >
                    {certificateEverEarned
                      ? "Certificate Earned!"
                      : "Certificate Ready!"}
                  </h4>
                  <p className="text-sm text-[#6B7280]">
                    {certificateEverEarned
                      ? `Congratulations! You've completed ${course.title} and earned your certificate. Your certificate remains earned even if you adjust your progress.`
                      : `You've reached 100% completion! Save your progress to earn your certificate for ${course.title}.`}
                  </p>
                </div>
                {certificateEverEarned && (
                  <CheckCircle className="h-8 w-8 text-green-400" />
                )}
                {!certificateEverEarned && (
                  <Award className="h-8 w-8 text-yellow-400" />
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              onClick={handleSaveProgress}
              disabled={isUpdating}
              className="flex-1 bg-[#F5B301] text-[#1C1F2A] hover:bg-[#FFF9E6] transition-colors duration-200 text-xs sm:text-sm py-2"
            >
              {isUpdating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1C1F2A] mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Save Progress
                </>
              )}
            </Button>
            <Button
              onClick={() => setOpen(false)}
              variant="outline"
              className="flex-1 border-[#6B7280] text-[#6B7280] hover:border-[#F5B301] hover:text-[#F5B301] transition-colors duration-200"
            >
              Close
            </Button>
          </div>
        </div>

        <style jsx>{`
          .slider {
            -webkit-appearance: none;
            appearance: none;
            background: transparent;
            cursor: pointer;
          }

          .slider::-webkit-slider-track {
            background: #1a1d2a;
            height: 8px;
            border-radius: 4px;
          }

          .slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            height: 24px;
            width: 24px;
            border-radius: 50%;
            background: #d4a017;
            cursor: grab;
            border: 3px solid #1c1f2a;
            box-shadow: 0 4px 8px rgba(212, 160, 23, 0.4),
              0 2px 4px rgba(0, 0, 0, 0.3);
            transition: all 0.2s ease;
          }

          .slider::-webkit-slider-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 12px rgba(212, 160, 23, 0.5),
              0 4px 8px rgba(0, 0, 0, 0.3);
          }

          .slider::-webkit-slider-thumb:active {
            cursor: grabbing;
            transform: scale(1.2);
            box-shadow: 0 8px 16px rgba(212, 160, 23, 0.6),
              0 6px 12px rgba(0, 0, 0, 0.3);
          }

          .slider::-moz-range-track {
            background: #1a1d2a;
            height: 8px;
            border-radius: 4px;
            border: none;
          }

          .slider::-moz-range-thumb {
            height: 24px;
            width: 24px;
            border-radius: 50%;
            background: #d4a017;
            cursor: grab;
            border: 3px solid #1c1f2a;
            box-shadow: 0 4px 8px rgba(212, 160, 23, 0.4),
              0 2px 4px rgba(0, 0, 0, 0.3);
            transition: all 0.2s ease;
          }

          .slider::-moz-range-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 12px rgba(212, 160, 23, 0.5),
              0 4px 8px rgba(0, 0, 0, 0.3);
          }

          .slider::-moz-range-thumb:active {
            cursor: grabbing;
            transform: scale(1.2);
            box-shadow: 0 8px 16px rgba(212, 160, 23, 0.6),
              0 6px 12px rgba(0, 0, 0, 0.3);
          }

          .slider:focus {
            outline: none;
          }

          .slider:focus::-webkit-slider-thumb {
            box-shadow: 0 0 0 4px rgba(212, 160, 23, 0.3),
              0 4px 8px rgba(212, 160, 23, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3);
          }

          .slider:focus::-moz-range-thumb {
            box-shadow: 0 0 0 4px rgba(212, 160, 23, 0.3),
              0 4px 8px rgba(212, 160, 23, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3);
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}
