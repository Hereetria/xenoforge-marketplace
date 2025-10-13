"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function JoinNowBanner() {
  const { data: session } = useSession();
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-r from-[#F5B301] to-[#FFF9E6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1F2A] mb-6">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl text-[#1C1F2A] mb-8 opacity-90">
              Join thousands of students who are already building their future with
              XenoForge
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {!session && (
                <Link
                  href="/auth/signup"
                  className="bg-[#1C1F2A] text-[#F5B301] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#2A2D3A] transition-colors duration-200"
                >
                  Get Started Free
                </Link>
              )}
              <Link
                href="/courses"
                className="border-2 border-[#1C1F2A] text-[#1C1F2A] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#1C1F2A] hover:text-[#F5B301] transition-colors duration-200"
              >
                Browse Courses
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-[#1C1F2A] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span className="text-[#F5B301] text-lg sm:text-xl lg:text-2xl">
                    🎓
                  </span>
                </div>
                <h3 className="text-[#1C1F2A] font-semibold text-base sm:text-lg mb-2">
                  Expert Instructors
                </h3>
                <p className="text-[#1C1F2A] text-xs sm:text-sm opacity-80">
                  Learn from industry professionals with years of experience
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-[#1C1F2A] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span className="text-[#F5B301] text-lg sm:text-xl lg:text-2xl">
                    📱
                  </span>
                </div>
                <h3 className="text-[#1C1F2A] font-semibold text-base sm:text-lg mb-2">
                  Learn Anywhere
                </h3>
                <p className="text-[#1C1F2A] text-xs sm:text-sm opacity-80">
                  Access your courses on any device, anytime
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-[#1C1F2A] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span className="text-[#F5B301] text-lg sm:text-xl lg:text-2xl">
                    🏆
                  </span>
                </div>
                <h3 className="text-[#1C1F2A] font-semibold text-base sm:text-lg mb-2">
                  Get Certified
                </h3>
                <p className="text-[#1C1F2A] text-xs sm:text-sm opacity-80">
                  Earn certificates to showcase your new skills
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
