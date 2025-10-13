"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface CartHeaderProps {
  itemCount: number;
  currentPage?: number;
  totalPages?: number;
}

export default function CartHeader({
  itemCount,
  currentPage,
  totalPages,
}: CartHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
      <div className="flex items-center gap-2 sm:gap-4">
        <Link
          href="/courses"
          className="text-[#6B7280] hover:text-[#F5B301] hover:border-[#F5B301] hover:border-2 rounded p-1 transition-all duration-100 ease-out flex-shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
          Shopping Cart
        </h1>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm">
        <span className="text-[#6B7280]">({itemCount} items)</span>
        {totalPages && totalPages > 1 && currentPage && (
          <span className="text-[#6B7280] text-xs sm:text-sm">
            Page {currentPage} of {totalPages}
          </span>
        )}
      </div>
    </div>
  );
}
