"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemedCard, ThemedCardContent } from "@/components/ui/themed-card";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EmptyCart() {
  const router = useRouter();
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[#1C1F2A] to-[#2A2D3A] py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-2 sm:px-4">
        <div className="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
          <Link
            href="/courses"
            className="text-[#6B7280] hover:text-[#F5B301] transition-colors duration-200 flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
            Shopping Cart
          </h1>
        </div>

        <ThemedCard className="text-center py-8 sm:py-12 hover:border-[#F5B301] hover:border-2 transition-all duration-100 ease-out">
          <ThemedCardContent>
            <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 text-[#6B7280] mx-auto mb-3 sm:mb-4" />
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4">
              Your cart is empty
            </h2>
            <p className="text-[#6B7280] text-sm sm:text-base mb-4 sm:mb-6 px-4">
              Looks like you haven&apos;t added any courses to your cart yet.
            </p>
            <Button
              onClick={() => router.push("/courses")}
              className="bg-[#F5B301] text-[#1C1F2A] hover:bg-[#FFF9E6] hover:border-yellow-400 hover:border-2 text-sm sm:text-base transition-all duration-100 ease-out"
              size="sm"
            >
              Browse Courses
            </Button>
          </ThemedCardContent>
        </ThemedCard>
      </div>
    </div>
  );
}
