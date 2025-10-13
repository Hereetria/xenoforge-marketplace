"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CourseFilterSidebar from "./CourseFilterSidebar";
import CategoryFilter from "./CategoryFilter";

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

export default function CourseFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
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

  const handleSearchChange = (value: string) => {
    setSearch(value);
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    params.delete("page");
    router.push(`/courses${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar - Full Width */}
      <div className="bg-[#1C1F2A] border border-[#6B7280] rounded-lg p-3 sm:p-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-white">Search Courses</Label>
          <Input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="bg-[#2A2D3A] border-[#6B7280] text-white placeholder-[#6B7280] focus:border-[#F5B301] focus:ring-[#F5B301]/20 w-full h-12 text-base"
          />
        </div>
      </div>

      {/* Mobile Filter Button - Always render to prevent layout shift */}
      <div className="md:hidden">
        <CourseFilterSidebar
          categories={categories}
          loading={loading}
          showMobileButton={true}
        />
      </div>

      {/* Desktop Filter Sidebar - Always render to prevent layout shift */}
      <div className="hidden md:block">
        <CourseFilterSidebar
          categories={categories}
          loading={loading}
          showMobileButton={false}
        />
      </div>
    </div>
  );
}
