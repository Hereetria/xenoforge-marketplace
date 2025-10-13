"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function DesktopNavigation() {
  const { status } = useSession();
  const isAuthed = status === "authenticated";
  const isLoading = status === "loading";

  if (isLoading) {
    return (
      <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
        <div className="h-4 w-20 bg-[#6B7280]/40 rounded animate-pulse"></div>
        <div className="h-4 w-24 bg-[#6B7280]/40 rounded animate-pulse"></div>
        <div className="h-4 w-20 bg-[#6B7280]/40 rounded animate-pulse"></div>
        <div className="h-4 w-28 bg-[#6B7280]/40 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
      {isAuthed && (
        <Link
          href="/my-learning"
          className="text-white hover:text-[#F5B301] transition-colors duration-200 font-medium text-sm lg:text-base"
        >
          My Learning
        </Link>
      )}

      <Link
        href="/courses"
        className="text-white hover:text-[#F5B301] transition-colors duration-200 font-medium text-sm lg:text-base"
      >
        Browse Courses
      </Link>

      {isAuthed && (
        <Link
          href="/my-teaching"
          className="text-white hover:text-[#F5B301] transition-colors duration-200 font-medium text-sm lg:text-base"
        >
          My Teaching
        </Link>
      )}

      {isAuthed && (
        <Link
          href="/payment-history"
          className="text-white hover:text-[#F5B301] transition-colors duration-200 font-medium text-sm lg:text-base"
        >
          Payment History
        </Link>
      )}
    </div>
  );
}
