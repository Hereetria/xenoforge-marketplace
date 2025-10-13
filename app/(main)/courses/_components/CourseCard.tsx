import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, CreditCard } from "lucide-react";
import { useShoppingCart } from "@/contexts/ShoppingCartContext";
import { getPriceInfo } from "@/lib/discountUtils";
import CourseDetailsDialog from "./CourseDetailsDialog";

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

interface CourseCardProps {
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
}

export default function CourseCard({ course }: CourseCardProps) {
  const { addToCart, isInCart, removeFromCart } = useShoppingCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { status } = useSession();
  const isAuthed = status === "authenticated";

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
    if (!isAuthed) return;

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
    <Card className="bg-[#1C1F2A] border-[#6B7280] hover:border-[#F5B301]/50 transition-colors duration-200 group w-full max-w-sm mx-auto overflow-hidden">
      {/* Course Thumbnail */}
      <div className="relative">
        <div className="w-full h-40 sm:h-48 bg-[#6B7280] flex items-center justify-center overflow-hidden">
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
                  parent.innerHTML = '<span class="text-4xl">📚</span>';
                }
              }}
            />
          ) : (
            <span className="text-4xl">📚</span>
          )}
        </div>
        <div className="absolute top-2 left-2">
          <span className="bg-[#F5B301] text-[#1C1F2A] px-1.5 py-0.5 rounded text-xs font-medium">
            {getLevelDisplay(course.level)}
          </span>
        </div>
        <div className="absolute top-2 right-2">
          <span className="bg-[#2A2D3A] text-white px-1.5 py-0.5 rounded text-xs">
            {course.duration}
          </span>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-3 sm:p-4">
        <div className="space-y-2">
          {/* Category */}
          <div className="text-xs text-[#F5B301] font-medium truncate">
            {course.category}
          </div>

          {/* Title */}
          <h3 className="text-sm sm:text-base font-semibold text-white line-clamp-2 group-hover:text-[#F5B301] transition-colors duration-200 leading-tight">
            {course.title}
          </h3>

          {/* Instructor */}
          <p className="text-xs text-[#6B7280] truncate">by {course.instructor}</p>

          {/* Description */}
          <p className="text-xs text-[#6B7280] line-clamp-2 leading-relaxed">
            {course.description}
          </p>

          {/* Rating and Students */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-[#F5B301]">★</span>
              <span className="text-white">{course.rating}</span>
              <span className="text-[#6B7280] truncate">
                ({course.students.toLocaleString()})
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white">
              ${priceInfo.discountedPrice}
            </span>
            {priceInfo.showDiscount && (
              <span className="text-xs text-[#6B7280] line-through">
                ${priceInfo.originalPrice}
              </span>
            )}
            {priceInfo.showDiscount && (
              <span className="bg-[#F5B301] text-[#1C1F2A] px-1.5 py-0.5 rounded text-xs font-bold">
                40% OFF
              </span>
            )}
          </div>

          {/* Auth notice */}
          {!isAuthed && (
            <div className="mt-2 -mb-1 text-white text-xs sm:text-sm">
              Login to purchase courses. {""}
              <a href="/auth/login" className="text-[#F5B301] hover:text-white">
                Login
              </a>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-1.5 pt-2">
            {/* Primary Action Buttons - Responsive Layout */}
            <div className="flex flex-col sm:flex-row gap-1.5 min-w-0">
              <Button
                onClick={handlePurchaseNow}
                disabled={!isAuthed}
                className="flex-1 min-w-0 bg-[#F5B301] text-[#1C1F2A] hover:bg-[#FFF9E6] transition-colors duration-200 text-xs py-2 px-2 sm:px-3"
                size="sm"
              >
                <CreditCard className="h-3 w-3 mr-1" />
                <span className="truncate">Purchase Now</span>
              </Button>
              <Button
                onClick={handleAddToCart}
                disabled={!isAuthed || isAddingToCart}
                variant={inCart ? "outline" : "default"}
                className={`flex-1 min-w-0 transition-colors duration-200 text-xs py-2 px-2 sm:px-3 ${
                  inCart
                    ? "border-[#F5B301] text-[#F5B301] bg-transparent hover:bg-[#F5B301] hover:text-white"
                    : "bg-[#2A2D3A] text-white hover:bg-[#3A3D4A]"
                }`}
                size="sm"
              >
                <ShoppingCart className="h-3 w-3 mr-1" />
                <span className="truncate">
                  {isAddingToCart ? "Adding..." : inCart ? "Remove" : "Add to Cart"}
                </span>
              </Button>
            </div>

            {/* View Details Button - Compact */}
            <CourseDetailsDialog course={course}>
              <Button
                variant="outline"
                className="w-full border border-[#6B7280] text-[#6B7280] 
             hover:border-[#F5B301] hover:text-[#F5B301] 
             bg-transparent px-2 py-1.5 rounded text-xs truncate"
              >
                View Details
              </Button>
            </CourseDetailsDialog>
          </div>
        </div>
      </div>
    </Card>
  );
}
