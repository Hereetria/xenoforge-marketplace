import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function PremiumCheckoutSkeleton() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[#1C1F2A] to-[#2A2D3A]">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <div className="h-8 w-16 bg-[#2A2D3A] rounded animate-pulse"></div>
          <div className="h-6 w-48 bg-[#2A2D3A] rounded animate-pulse"></div>
        </div>

        {/* Progress Skeleton */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-[#2A2D3A] rounded-full animate-pulse"></div>
            <div className="w-16 h-4 bg-[#2A2D3A] rounded animate-pulse"></div>
          </div>
          <div className="w-16 h-0.5 bg-[#2A2D3A] rounded animate-pulse"></div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-[#2A2D3A] rounded-full animate-pulse"></div>
            <div className="w-16 h-4 bg-[#2A2D3A] rounded animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Order Summary Skeleton */}
          <Card className="bg-[#2A2D3A] border-[#6B7280] p-4 sm:p-6">
            <CardHeader className="pb-4">
              <div className="h-6 w-32 bg-[#1C1F2A] rounded animate-pulse mb-2"></div>
              <div className="h-4 w-48 bg-[#1C1F2A] rounded animate-pulse"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-20 bg-[#1C1F2A] rounded animate-pulse"></div>
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-4 bg-[#1C1F2A] rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Skeleton */}
          <div className="lg:col-span-2">
            <Card className="bg-[#2A2D3A] border-[#6B7280] p-4 sm:p-6">
              <CardHeader className="pb-4">
                <div className="h-6 w-40 bg-[#1C1F2A] rounded animate-pulse mb-2"></div>
                <div className="h-4 w-64 bg-[#1C1F2A] rounded animate-pulse"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-20 bg-[#1C1F2A] rounded animate-pulse"></div>
                <div className="h-20 bg-[#1C1F2A] rounded animate-pulse"></div>
                <div className="h-16 bg-[#1C1F2A] rounded animate-pulse"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
