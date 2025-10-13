"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Star, Send, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface CourseRatingDialogProps {
  course: {
    id: string;
    courseId: string;
    title: string;
    instructor: string;
    progress: number;
    isCompleted: boolean;
    hasCertificateEver?: boolean;
  };
  onRated?: (isRated?: boolean) => void;
  children: React.ReactNode;
}

export default function CourseRatingDialog({
  course,
  onRated,
  children,
}: CourseRatingDialogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [existingReview, setExistingReview] = useState<{
    rating: number;
  } | null>(null);

  useEffect(() => {
    if (searchParams.get("rate") === course.id) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [searchParams, course.id]);

  useEffect(() => {
    const fetchExistingReview = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/test-courses/${course.courseId}/reviews`);
        if (response.ok) {
          const data = await response.json();
          const userReview = data.reviews?.find(
            (r: { userId: string }) => r.userId === data.currentUserId
          );
          if (userReview) {
            setExistingReview({
              rating: userReview.rating,
            });
            setRating(userReview.rating);
          } else {
            setExistingReview(null);
            setRating(0);
          }
        }
      } catch (error) {
        console.error("Error fetching existing review:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (open) {
      fetchExistingReview();
    }
  }, [open, course.courseId]);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      router.push(`?rate=${course.id}`, { scroll: false });
    } else {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("rate");
      router.push(`?${newSearchParams.toString()}`, { scroll: false });
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/test-courses/${course.courseId}/reviews`, {
        method: existingReview ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
        }),
      });

      if (response.ok) {
        setOpen(false);
        onRated?.(true);
      } else {
        const errorData = await response.json();
        console.error("Failed to submit review:", response.status, errorData);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!existingReview) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/test-courses/${course.courseId}/reviews`, {
        method: "DELETE",
      });

      if (response.ok) {
        setRating(0);
        setExistingReview(null);
        setOpen(false);
        onRated?.(false);
      } else {
        console.error("Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md bg-[#1C1F2A] border-2 border-[#F5B301]/30 shadow-2xl text-white p-3 sm:p-6 lg:p-8 mx-2 sm:mx-4">
        <DialogHeader className="pb-2 sm:pb-4">
          <DialogTitle className="text-lg sm:text-xl font-bold text-white leading-tight">
            Rate Course: {course.title}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <div
              className="h-8 w-8 border-2 border-[#F5B301] border-t-transparent rounded-full animate-spin"
              aria-label="Loading"
            />
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {/* Course Info */}
            <div className="bg-[#2A2D3A] rounded-lg p-3 sm:p-4">
              <h3 className="font-semibold text-white text-sm sm:text-lg leading-tight">
                {course.title}
              </h3>
              <p className="text-[#6B7280] text-xs sm:text-sm">
                by {course.instructor}
              </p>
              <div className="mt-2 flex flex-wrap gap-1 sm:gap-2">
                <span className="text-xs px-2 py-1 bg-[#F5B301]/20 text-[#F5B301] rounded">
                  {course.hasCertificateEver
                    ? "100% Complete"
                    : `${course.progress}% Complete`}
                </span>
                {course.hasCertificateEver && (
                  <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">
                    Certificate Earned
                  </span>
                )}
              </div>
            </div>

            {/* Rating Section */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-white mb-2 sm:mb-3">
                How would you rate this course?
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-colors duration-200"
                  >
                    <Star
                      className={`h-6 w-6 sm:h-8 sm:w-8 ${
                        star <= (hoverRating || rating)
                          ? "text-[#F5B301] fill-current"
                          : "text-[#6B7280]"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 sm:ml-3 text-xs sm:text-sm text-[#6B7280]">
                  {rating > 0 && `${rating} star${rating > 1 ? "s" : ""}`}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                onClick={handleSubmit}
                disabled={rating === 0 || isSubmitting}
                className="flex-1 bg-[#F5B301] text-[#1C1F2A] hover:bg-[#FFF9E6] transition-colors duration-200 text-xs sm:text-sm py-2"
              >
                <Send className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                {isSubmitting
                  ? "Submitting..."
                  : existingReview
                  ? "Update Review"
                  : "Submit Review"}
              </Button>
              {existingReview && (
                <Button
                  onClick={handleDelete}
                  variant="outline"
                  size="sm"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 text-xs sm:text-sm py-2"
                  disabled={isSubmitting}
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Delete Review
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
