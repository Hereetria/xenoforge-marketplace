"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  _count: {
    courses: number;
  };
}

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-[#2A2D3A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Explore by Category
            </h2>
            <p className="text-xl text-[#6B7280] max-w-3xl mx-auto">
              Find the perfect course in your area of interest
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-[#1C1F2A] rounded-xl p-3 sm:p-4 lg:p-6 border border-[#6B7280] animate-pulse"
              >
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-[#6B7280] rounded-full mx-auto mb-3 sm:mb-4"></div>
                  <div className="h-4 bg-[#6B7280] rounded mb-2"></div>
                  <div className="h-3 bg-[#6B7280] rounded w-16 mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-[#2A2D3A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Explore by Category
          </h2>
          <p className="text-xl text-[#6B7280] max-w-3xl mx-auto">
            Find the perfect course in your area of interest
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/courses?category=${encodeURIComponent(category.name)}`}
              className="group bg-[#1C1F2A] rounded-xl p-3 sm:p-4 lg:p-6 border border-[#6B7280] hover:border-[#F5B301] transition-all duration-200 hover:transform hover:scale-105"
            >
              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-[#F5B301] to-[#FFF9E6] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-200">
                  <span className="text-lg sm:text-xl lg:text-2xl">
                    {category.icon || "📚"}
                  </span>
                </div>
                <h3 className="text-white font-semibold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2 group-hover:text-[#F5B301] transition-colors duration-200">
                  {category.name}
                </h3>
                <p className="text-[#6B7280] text-xs sm:text-sm">
                  {category._count.courses} courses
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/courses"
            className="bg-transparent border-2 border-[#F5B301] text-[#F5B301] px-8 py-3 rounded-lg font-semibold hover:bg-[#F5B301] hover:text-[#1C1F2A] transition-colors duration-200"
          >
            Browse All Courses
          </Link>
        </div>
      </div>
    </section>
  );
}
