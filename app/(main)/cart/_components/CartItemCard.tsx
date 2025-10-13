"use client";

import { Button } from "@/components/ui/button";
import {
  ThemedCard,
  ThemedCardHeader,
  ThemedCardTitle,
  ThemedCardContent,
} from "@/components/ui/themed-card";
import { Trash2 } from "lucide-react";
import { isDiscountEnabled } from "@/lib/discountUtils";

export interface CartItemData {
  id: string | number;
  title: string;
  instructor: string;
  price: number;
  originalPrice?: number;
  thumbnail?: string;
  duration: string;
  level: string;
}

interface CartItemCardProps {
  item: CartItemData;
  onRemove: (courseId: string | number) => void;
}

export default function CartItemCard({ item, onRemove }: CartItemCardProps) {
  const discountOn = isDiscountEnabled();
  const hasOriginal =
    typeof item.originalPrice === "number" && (item.originalPrice as number) > 0;

  const showDiscount =
    discountOn && hasOriginal && (item.originalPrice as number) > item.price;
  const displayOriginal = showDiscount ? (item.originalPrice as number) : item.price;
  const displayDiscounted = showDiscount ? item.price : item.price;
  return (
    <ThemedCard
      key={item.id}
      variant="elevated"
      className="hover:border-[#F5B301] hover:border-2 transition-all duration-100 ease-out"
    >
      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#6B7280] rounded-lg flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0 hover:bg-[#F5B301] transition-colors duration-100 ease-out">
          {item.thumbnail && item.thumbnail.startsWith("http") ? (
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span className="text-xl sm:text-2xl">📚</span>
          )}
        </div>

        <div className="flex-1 min-w-0 w-full sm:w-auto">
          <ThemedCardHeader className="p-0">
            <ThemedCardTitle size="sm" className="line-clamp-2 text-sm sm:text-base">
              {item.title}
            </ThemedCardTitle>
            <p className="text-[#6B7280] text-xs sm:text-sm">by {item.instructor}</p>
          </ThemedCardHeader>

          <ThemedCardContent className="p-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
              <div className="flex items-center gap-2">
                <span className="text-[#F5B301] font-bold text-base sm:text-lg">
                  ${displayDiscounted}
                </span>
                {showDiscount && (
                  <span className="text-[#6B7280] line-through text-xs sm:text-sm">
                    ${displayOriginal}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-[#6B7280]">
                <span>{item.duration}</span>
                <span>•</span>
                <span>{item.level}</span>
              </div>
            </div>
          </ThemedCardContent>
        </div>

        <Button
          onClick={() => onRemove(item.id)}
          variant="outline"
          size="sm"
          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:border-yellow-400 hover:border-2 w-full sm:w-auto transition-all duration-100 ease-out"
        >
          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-0" />
          <span className="sm:hidden">Remove</span>
        </Button>
      </div>
    </ThemedCard>
  );
}
