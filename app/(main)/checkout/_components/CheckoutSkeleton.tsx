"use client";

import { Card } from "@/components/ui/card";

export default function CheckoutSkeleton() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[#1C1F2A] to-[#2A2D3A]">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Header Skeleton */}
        <div className="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
          <div className="h-8 w-20 bg-[#6B7280] rounded animate-pulse"></div>
          <div className="h-8 w-48 bg-[#6B7280] rounded animate-pulse"></div>
        </div>

        {/* Progress Steps Skeleton */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-center space-x-2 sm:space-x-4 lg:space-x-8">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#6B7280] rounded-full animate-pulse"></div>
              <div className="h-4 w-16 bg-[#6B7280] rounded animate-pulse"></div>
            </div>
            <div className="h-4 w-4 bg-[#6B7280] rounded animate-pulse"></div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#6B7280] rounded-full animate-pulse"></div>
              <div className="h-4 w-20 bg-[#6B7280] rounded animate-pulse"></div>
            </div>
            <div className="h-4 w-4 bg-[#6B7280] rounded animate-pulse"></div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#6B7280] rounded-full animate-pulse"></div>
              <div className="h-4 w-24 bg-[#6B7280] rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Order Summary Skeleton */}
          <div className="lg:col-span-1 order-1">
            <Card className="bg-[#2A2D3A] border-[#6B7280] p-3 sm:p-4 lg:p-6 sticky top-17 sm:top-17 lg:top-17">
              <div className="h-6 w-32 bg-[#6B7280] rounded animate-pulse mb-6"></div>

              {/* Course Items Skeleton */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3 p-3 bg-[#1C1F2A] rounded-lg">
                  <div className="w-12 h-12 bg-[#6B7280] rounded-lg animate-pulse"></div>
                  <div className="flex-1 min-w-0">
                    <div className="h-4 w-full bg-[#6B7280] rounded animate-pulse mb-2"></div>
                    <div className="h-3 w-24 bg-[#6B7280] rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-16 bg-[#6B7280] rounded animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Price Breakdown Skeleton */}
              <div className="space-y-3 border-t border-[#6B7280] pt-4">
                <div className="flex justify-between items-center">
                  <div className="h-4 w-16 bg-[#6B7280] rounded animate-pulse"></div>
                  <div className="h-4 w-12 bg-[#6B7280] rounded animate-pulse"></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-4 w-20 bg-[#6B7280] rounded animate-pulse"></div>
                  <div className="h-4 w-12 bg-[#6B7280] rounded animate-pulse"></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-4 w-24 bg-[#6B7280] rounded animate-pulse"></div>
                  <div className="h-4 w-12 bg-[#6B7280] rounded animate-pulse"></div>
                </div>
                <div className="border-t border-[#6B7280] pt-3">
                  <div className="flex justify-between items-center">
                    <div className="h-5 w-12 bg-[#6B7280] rounded animate-pulse"></div>
                    <div className="h-5 w-16 bg-[#6B7280] rounded animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Security Badges Skeleton */}
              <div className="mt-6 pt-4 border-t border-[#6B7280]">
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <div className="h-4 w-4 bg-[#6B7280] rounded animate-pulse"></div>
                    <div className="h-3 w-20 bg-[#6B7280] rounded animate-pulse"></div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="h-4 w-4 bg-[#6B7280] rounded animate-pulse"></div>
                    <div className="h-3 w-16 bg-[#6B7280] rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Payment Section Skeleton */}
          <div className="lg:col-span-2 order-2">
            <Card className="bg-[#2A2D3A] border-[#6B7280] p-6 sticky top-17 sm:top-17 lg:top-17">
              <div className="h-6 w-48 bg-[#6B7280] rounded animate-pulse mb-6"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Stripe Payment Skeleton */}
                <div className="p-6 border-2 border-[#6B7280] rounded-lg bg-[#1C1F2A]">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-[#6B7280] rounded-lg animate-pulse"></div>
                    <div>
                      <div className="h-5 w-32 bg-[#6B7280] rounded animate-pulse mb-2"></div>
                      <div className="h-4 w-24 bg-[#6B7280] rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="h-4 w-full bg-[#6B7280] rounded animate-pulse mb-4"></div>
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-8 bg-[#6B7280] rounded animate-pulse"></div>
                    <div className="h-3 w-1 bg-[#6B7280] rounded animate-pulse"></div>
                    <div className="h-3 w-16 bg-[#6B7280] rounded animate-pulse"></div>
                    <div className="h-3 w-1 bg-[#6B7280] rounded animate-pulse"></div>
                    <div className="h-3 w-20 bg-[#6B7280] rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
