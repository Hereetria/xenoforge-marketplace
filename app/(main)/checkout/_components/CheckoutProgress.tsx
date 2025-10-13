"use client";

import { CheckCircle, ChevronRight } from "lucide-react";

interface CheckoutProgressProps {
  currentStep: number;
}

export default function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center justify-center space-x-2 sm:space-x-4 lg:space-x-8">
        <div
          className={`flex items-center space-x-1 sm:space-x-2 ${
            currentStep >= 1 ? "text-[#F5B301]" : "text-[#6B7280]"
          }`}
        >
          <div
            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm ${
              currentStep >= 1
                ? "bg-[#F5B301] text-[#1C1F2A]"
                : "bg-[#2A2D3A] border border-[#6B7280]"
            }`}
          >
            {currentStep > 1 ? (
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
            ) : (
              "1"
            )}
          </div>
          <span className="font-medium text-xs sm:text-sm hidden sm:inline">
            Payment Method
          </span>
          <span className="font-medium text-xs sm:hidden">Method</span>
        </div>
        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-[#6B7280]" />
        <div
          className={`flex items-center space-x-1 sm:space-x-2 ${
            currentStep >= 2 ? "text-[#F5B301]" : "text-[#6B7280]"
          }`}
        >
          <div
            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm ${
              currentStep >= 2
                ? "bg-[#F5B301] text-[#1C1F2A]"
                : "bg-[#2A2D3A] border border-[#6B7280]"
            }`}
          >
            2
          </div>
          <span className="font-medium text-xs sm:text-sm hidden sm:inline">
            Payment Details
          </span>
          <span className="font-medium text-xs sm:hidden">Details</span>
        </div>
        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-[#6B7280]" />
        <div
          className={`flex items-center space-x-1 sm:space-x-2 ${
            currentStep >= 3 ? "text-[#F5B301]" : "text-[#6B7280]"
          }`}
        >
          <div
            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm ${
              currentStep >= 3
                ? "bg-[#F5B301] text-[#1C1F2A]"
                : "bg-[#2A2D3A] border border-[#6B7280]"
            }`}
          >
            3
          </div>
          <span className="font-medium text-xs sm:text-sm hidden sm:inline">
            Confirmation
          </span>
          <span className="font-medium text-xs sm:hidden">Confirm</span>
        </div>
      </div>
    </div>
  );
}
