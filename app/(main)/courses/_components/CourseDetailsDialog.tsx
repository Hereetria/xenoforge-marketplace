"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ShoppingCart,
  CreditCard,
  Star,
  Users,
  Clock,
  BookOpen,
  Award,
  X,
} from "lucide-react";
import { useShoppingCart } from "@/contexts/ShoppingCartContext";
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

interface CourseDetailsDialogProps {
  course: {
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
  };
  children: React.ReactNode;
}

export default function CourseDetailsDialog({
  course,
  children,
}: CourseDetailsDialogProps) {
  const { addToCart, isInCart, removeFromCart } = useShoppingCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [open, setOpen] = useState(false);

  const priceInfo = getPriceInfo(course.price);

  const handleAddToCart = async () => {
    if (inCart) {
      removeFromCart(course.id);
    } else {
      setIsAddingToCart(true);
      try {
        const cartItem = {
          id: course.id,
          title: course.title,
          instructor: course.instructor,
          price: priceInfo.discountedPrice,
          originalPrice: priceInfo.originalPrice,
          thumbnail: course.thumbnail,
          duration: course.duration,
          level: course.level,
        };
        addToCart(cartItem);
      } finally {
        setIsAddingToCart(false);
      }
    }
  };

  const handlePurchaseNow = () => {
    setOpen(false);

    const courseData = {
      id: course.id,
      title: course.title,
      instructor: course.instructor,
      price: priceInfo.discountedPrice,
      originalPrice: priceInfo.originalPrice,
      thumbnail: course.thumbnail,
      duration: course.duration,
      level: course.level,
    };

    sessionStorage.setItem("direct-purchase-course", JSON.stringify(courseData));
    window.location.href = "/checkout";
  };

  const inCart = isInCart(course.id);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#1C1F2A] border-2 border-[#F5B301]/30 shadow-2xl text-white p-4 sm:p-6 lg:p-8">
        <DialogHeader className="px-2 sm:px-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl sm:text-2xl font-bold text-white">
              Course Details
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

        <div className="space-y-4 sm:space-y-6 px-2 sm:px-4">
          {/* Course Header */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Course Image */}
            <div className="relative">
              <div className="w-full h-48 sm:h-64 lg:h-80 bg-[#6B7280] rounded-lg flex items-center justify-center overflow-hidden">
                {course.thumbnail && course.thumbnail.startsWith("http") ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<span class="text-6xl">📚</span>';
                      }
                    }}
                  />
                ) : (
                  <span className="text-6xl">📚</span>
                )}
              </div>

              {/* Level Badge */}
              <div className="absolute top-3 left-3">
                <span className="bg-[#F5B301] text-[#1C1F2A] px-3 py-1 rounded-full text-sm font-semibold">
                  {getLevelDisplay(course.level)}
                </span>
              </div>

              {/* Duration Badge */}
              <div className="absolute top-3 right-3">
                <span className="bg-[#2A2D3A] text-white px-3 py-1 rounded-full text-sm">
                  {course.duration}
                </span>
              </div>
            </div>

            {/* Course Info */}
            <div className="space-y-3 sm:space-y-4">
              {/* Category */}
              <div className="text-sm text-[#F5B301] font-medium">
                {course.category}
              </div>

              {/* Title */}
              <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white leading-tight">
                {course.title}
              </h1>

              {/* Instructor */}
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-[#6B7280]" />
                <span className="text-sm sm:text-base lg:text-lg text-[#6B7280]">
                  by {course.instructor}
                </span>
              </div>

              {/* Rating and Students */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 text-[#F5B301] fill-current" />
                    <span className="text-sm sm:text-base lg:text-lg font-semibold text-white">
                      {course.rating && course.rating > 0 ? course.rating : "-"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-[#6B7280]" />
                  <span className="text-sm sm:text-base lg:text-lg text-[#6B7280]">
                    {course.students.toLocaleString()} students
                  </span>
                </div>
              </div>

              {/* Price Section */}
              <Card className="bg-[#2A2D3A] border-[#6B7280] p-3 sm:p-4">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="text-2xl sm:text-3xl font-bold text-white">
                      ${priceInfo.discountedPrice}
                    </span>
                    {priceInfo.showDiscount && (
                      <span className="text-base sm:text-lg text-[#6B7280] line-through">
                        ${priceInfo.originalPrice}
                      </span>
                    )}
                    {priceInfo.showDiscount && (
                      <span className="bg-[#F5B301] text-[#1C1F2A] px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-bold">
                        40% OFF
                      </span>
                    )}
                  </div>

                  {priceInfo.showDiscount && (
                    <div className="text-xs sm:text-sm text-[#F5B301] font-medium">
                      You save $
                      {(priceInfo.originalPrice - priceInfo.discountedPrice).toFixed(
                        2
                      )}
                    </div>
                  )}
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-2 sm:space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <Button
                    onClick={handlePurchaseNow}
                    className="w-full bg-[#F5B301] text-[#1C1F2A] hover:bg-[#FFF9E6] transition-colors duration-200 py-2 sm:py-3 text-sm sm:text-base"
                    size="lg"
                  >
                    <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                    Purchase Now
                  </Button>
                  <Button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    variant={inCart ? "outline" : "default"}
                    className={`w-full transition-colors duration-200 py-2 sm:py-3 text-sm sm:text-base ${
                      inCart
                        ? "border-[#F5B301] text-[#F5B301] bg-transparent hover:bg-[#F5B301] hover:text-white"
                        : "bg-[#2A2D3A] text-white hover:bg-[#3A3D4A]"
                    }`}
                    size="lg"
                  >
                    <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                    {isAddingToCart
                      ? "Adding..."
                      : inCart
                      ? "Remove"
                      : "Add to Cart"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Course Description */}
          <Card className="bg-[#2A2D3A] border-[#6B7280] p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 sm:h-6 sm:w-6 text-[#F5B301]" />
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  About This Course
                </h2>
              </div>
              <p className="text-[#6B7280] leading-relaxed text-sm sm:text-base lg:text-lg">
                {course.description}
              </p>
            </div>
          </Card>

          {/* Course Features */}
          <Card className="bg-[#2A2D3A] border-[#6B7280] p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                What You&apos;ll Get
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-[#F5B301]" />
                  <span className="text-sm sm:text-base text-[#6B7280]">
                    Duration: {course.duration}
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Award className="h-4 w-4 sm:h-5 sm:w-5 text-[#F5B301]" />
                  <span className="text-sm sm:text-base text-[#6B7280]">
                    Level: {getLevelDisplay(course.level)}
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 text-[#F5B301]" />
                  <span className="text-sm sm:text-base text-[#6B7280]">
                    Rating:{" "}
                    {course.rating && course.rating > 0 ? course.rating : "-"}/5
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-[#F5B301]" />
                  <span className="text-sm sm:text-base text-[#6B7280]">
                    {course.students.toLocaleString()} enrolled
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
