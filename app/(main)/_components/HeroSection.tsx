"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import PremiumDialog from "@/components/ui/premium-dialog";
import { Crown } from "lucide-react";

export default function HeroSection() {
  const { data: session, status } = useSession();
  const { hasActiveSubscription } = useSubscription();
  const isAuthed = status === "authenticated" && !!session?.user;
  return (
    <section className="bg-gradient-to-br from-[#1C1F2A] to-[#2A2D3A] py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Learn without
                <span className="text-[#F5B301] block">limits</span>
              </h1>
              <p className="text-xl text-[#6B7280] leading-relaxed max-w-2xl">
                Discover thousands of courses from expert instructors. Build new
                skills, advance your career, and achieve your goals with XenoForge.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {isAuthed ? (
                <>
                  <Link
                    href="/my-learning"
                    className="bg-[#F5B301] text-[#1C1F2A] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#FFF9E6] transition-colors duration-200 text-center"
                  >
                    Continue Learning
                  </Link>
                  <Link
                    href="/courses"
                    className="border-2 border-[#6B7280] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:border-[#F5B301] hover:text-[#F5B301] transition-colors duration-200 text-center"
                  >
                    Explore Courses
                  </Link>
                  {!hasActiveSubscription && (
                    <PremiumDialog>
                      <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#F5B301] to-[#FFD700] text-[#1C1F2A] px-8 py-4 rounded-lg font-bold text-lg hover:from-[#FFF9E6] hover:to-[#F5B301] transition-all duration-200 shadow-lg cursor-pointer">
                        <Crown className="h-5 w-5" />
                        Go Premium
                      </button>
                    </PremiumDialog>
                  )}
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signup"
                    className="bg-[#F5B301] text-[#1C1F2A] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#FFF9E6] transition-colors duration-200 text-center"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    href="/courses"
                    className="border-2 border-[#6B7280] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:border-[#F5B301] hover:text-[#F5B301] transition-colors duration-200 text-center"
                  >
                    Browse Courses
                  </Link>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-[#6B7280]">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#F5B301] rounded-full"></div>
                <span className="text-xs sm:text-sm">10,000+ Students</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#F5B301] rounded-full"></div>
                <span className="text-xs sm:text-sm">500+ Courses</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#F5B301] rounded-full"></div>
                <span className="text-xs sm:text-sm">4.8/5 Rating</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-[#2A2D3A] rounded-2xl p-4 sm:p-6 lg:p-8 border border-[#6B7280]">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
                    <Image
                      src="/xenoforge-logo.png"
                      alt="XenoForge Logo"
                      width={64}
                      height={64}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm sm:text-base">
                      XenoForge Learning
                    </h3>
                    <p className="text-[#6B7280] text-xs sm:text-sm">
                      Next-Gen Course Platform
                    </p>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="bg-[#1C1F2A] rounded-lg p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-xs sm:text-sm font-medium">
                        Course Progress
                      </span>
                      <span className="text-[#F5B301] text-xs sm:text-sm">75%</span>
                    </div>
                    <div className="w-full bg-[#6B7280] rounded-full h-1.5 sm:h-2">
                      <div
                        className="bg-[#F5B301] h-1.5 sm:h-2 rounded-full"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    <div className="bg-[#1C1F2A] rounded-lg p-2 sm:p-3 text-center">
                      <div className="text-[#F5B301] font-bold text-sm sm:text-lg">
                        12
                      </div>
                      <div className="text-[#6B7280] text-xs">Lessons</div>
                    </div>
                    <div className="bg-[#1C1F2A] rounded-lg p-2 sm:p-3 text-center">
                      <div className="text-[#F5B301] font-bold text-sm sm:text-lg">
                        3.5h
                      </div>
                      <div className="text-[#6B7280] text-xs">Duration</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
