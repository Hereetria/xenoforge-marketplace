"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface CheckoutHeaderProps {
  onBack: () => void;
}

export default function CheckoutHeader({ onBack }: CheckoutHeaderProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
      <Button
        onClick={onBack}
        variant="outline"
        className="border-[#6B7280] text-[#6B7280] hover:border-[#F5B301] hover:text-[#F5B301] hover:border-2 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 transition-all duration-100 ease-out"
      >
        <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
        <span className="hidden xs:inline">Back to Courses</span>
        <span className="xs:hidden">Back</span>
      </Button>
      <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white truncate">
        Secure Checkout
      </h1>
    </div>
  );
}
