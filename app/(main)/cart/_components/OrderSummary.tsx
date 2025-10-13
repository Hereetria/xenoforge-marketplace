"use client";

import { Button } from "@/components/ui/button";
import { CartItemData } from "./CartItemCard";
import { isDiscountEnabled, DISCOUNT_PERCENTAGE } from "@/lib/discountUtils";
import {
  ThemedCard,
  ThemedCardHeader,
  ThemedCardTitle,
  ThemedCardContent,
  ThemedCardFooter,
} from "@/components/ui/themed-card";
import { CreditCard } from "lucide-react";

interface OrderSummaryProps {
  items: CartItemData[];
  onCheckout: () => void;
  onContinueShopping: () => void;
}

export default function OrderSummary({
  items,
  onCheckout,
  onContinueShopping,
}: OrderSummaryProps) {
  const discountOn = isDiscountEnabled();
  const factor = 1 - DISCOUNT_PERCENTAGE / 100;

  const { originalSubtotal, subtotal } = items.reduce(
    (acc, item) => {
      const hasOriginal =
        typeof item.originalPrice === "number" && (item.originalPrice as number) > 0;

      if (discountOn && hasOriginal) {
        acc.originalSubtotal += item.originalPrice as number;
        acc.subtotal += item.price;
      } else if (discountOn && !hasOriginal) {
        acc.originalSubtotal += item.price;
        acc.subtotal += item.price;
      } else {
        acc.originalSubtotal += item.price;
        acc.subtotal += item.price;
      }
      return acc;
    },
    { originalSubtotal: 0, subtotal: 0 }
  );

  const total = subtotal;
  const savings = Math.max(0, originalSubtotal - subtotal);

  return (
    <div className="lg:col-span-1">
      <ThemedCard
        variant="elevated"
        className="sticky top-4 hover:border-[#F5B301] hover:border-2 transition-all duration-100 ease-out"
      >
        <ThemedCardHeader>
          <ThemedCardTitle className="text-base sm:text-lg">
            Order Summary
          </ThemedCardTitle>
        </ThemedCardHeader>

        <ThemedCardContent>
          <div className="space-y-2 sm:space-y-3">
            {discountOn && savings > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-[#6B7280] text-sm sm:text-base">
                  Original Subtotal:
                </span>
                <span className="text-[#6B7280] text-sm sm:text-base line-through">
                  ${originalSubtotal.toFixed(2)}
                </span>
              </div>
            )}
            {discountOn && savings > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-[#F5B301] text-sm sm:text-base">
                  You save:
                </span>
                <span className="text-[#F5B301] text-sm sm:text-base">
                  -${savings.toFixed(2)}
                </span>
              </div>
            )}
            <div className="border-t border-[#6B7280] pt-2 sm:pt-3">
              <div className="flex justify-between items-center">
                <span className="text-base sm:text-lg font-bold text-white">
                  Total:
                </span>
                <span className="text-base sm:text-lg font-bold text-[#F5B301]">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </ThemedCardContent>

        <ThemedCardFooter className="flex-col space-y-2 sm:space-y-3">
          <Button
            onClick={onCheckout}
            className="w-full bg-[#F5B301] text-[#1C1F2A] hover:bg-[#FFF9E6] hover:border-yellow-400 hover:border-2 py-2 sm:py-3 text-sm sm:text-base transition-all duration-100 ease-out"
            size="sm"
          >
            <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm">Proceed to Checkout</span>
          </Button>
          <Button
            onClick={onContinueShopping}
            variant="outline"
            size="sm"
            className="w-full border-[#6B7280] text-[#6B7280] hover:border-[#F5B301] hover:text-[#F5B301] hover:border-2 text-sm sm:text-base transition-all duration-100 ease-out"
          >
            <span className="text-xs sm:text-sm">Continue Shopping</span>
          </Button>
        </ThemedCardFooter>
      </ThemedCard>
    </div>
  );
}
