"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, Filter } from "lucide-react";
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

interface CourseFilterSidebarProps {
  onFiltersChange?: (filters: CourseFilters) => void;
  className?: string;
  categories?: Category[];
  loading?: boolean;
  showMobileButton?: boolean;
}

export interface CourseFilters {
  priceRange: string;
  rating: string;
  duration: string;
  level: string;
}

const priceRanges = [
  { label: "Free", value: "free" },
  { label: "Under $25", value: "under-25" },
  { label: "$25 – $50", value: "25-50" },
  { label: "$50 – $100", value: "50-100" },
  { label: "Over $100", value: "over-100" },
];

const ratings = [
  { label: "4.5 & up", value: "4.5" },
  { label: "4.0 & up", value: "4.0" },
  { label: "3.5 & up", value: "3.5" },
  { label: "3.0 & up", value: "3.0" },
];

const durations = [
  { label: "Under 2 hours", value: "under-2h" },
  { label: "2–10 hours", value: "2-10h" },
  { label: "10–30 hours", value: "10-30h" },
  { label: "30+ hours", value: "30h-plus" },
];

const levels = [
  { label: "Beginner", value: "BEGINNER" },
  { label: "Intermediate", value: "INTERMEDIATE" },
  { label: "Expert", value: "EXPERT" },
  { label: "All Levels", value: "all" },
];

export default function CourseFilterSidebar({
  onFiltersChange,
  className = "",
  categories = [],
  loading = false,
  showMobileButton = true,
}: CourseFilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [filters, setFilters] = useState<CourseFilters>({
    priceRange: searchParams.get("priceRange") || "",
    rating: searchParams.get("rating") || "",
    duration: searchParams.get("duration") || "",
    level: searchParams.get("level") || "",
  });

  const updateURL = (newFilters: CourseFilters) => {
    const params = new URLSearchParams();

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== "all") {
        params.set(key, value);
      }
    });

    params.delete("page");

    const queryString = params.toString();
    router.push(`/courses${queryString ? `?${queryString}` : ""}`);
  };

  const handleFilterChange = (filterType: keyof CourseFilters, value: string) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    updateURL(newFilters);
    onFiltersChange?.(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: CourseFilters = {
      priceRange: "",
      rating: "",
      duration: "",
      level: "",
    };
    setFilters(clearedFilters);
    router.push("/courses");
    onFiltersChange?.(clearedFilters);
  };

  const FilterSection = ({
    title,
    filterType,
    options,
    currentValue,
  }: {
    title: string;
    filterType: keyof CourseFilters;
    options: { label: string; value: string }[];
    currentValue: string;
  }) => (
    <div className="space-y-3">
      <Label className="text-sm font-semibold text-white">{title}</Label>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <input
              type="radio"
              name={filterType}
              value={option.value}
              checked={currentValue === option.value}
              onChange={(e) => handleFilterChange(filterType, e.target.value)}
              id={`${filterType}-${option.value}`}
              className="text-[#F5B301] border-[#6B7280] focus:ring-[#F5B301] focus:ring-2"
            />
            <Label
              htmlFor={`${filterType}-${option.value}`}
              className="text-sm text-[#6B7280] cursor-pointer hover:text-white transition-colors duration-200"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );

  const sidebarContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Filters</h2>
        <div className="flex items-center gap-2">
          <Button
            onClick={clearFilters}
            variant="outline"
            size="sm"
            className="text-xs border-[#6B7280] text-[#6B7280] hover:border-[#F5B301] hover:text-[#F5B301] transition-colors duration-200"
          >
            Clear All
          </Button>
          {/* Mobile close button */}
          <Button
            onClick={() => setIsMobileOpen(false)}
            variant="ghost"
            size="sm"
            className="md:hidden text-[#6B7280] hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Category Filter - Always render to prevent layout shift */}
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-white">Category</Label>
            <div className="h-10 bg-[#2A2D3A] border border-[#6B7280] rounded-md animate-pulse"></div>
          </div>
        ) : (
          <CategoryFilter categories={categories} />
        )}
      </div>

      {/* Filter Sections */}
      <FilterSection
        title="Price Range"
        filterType="priceRange"
        options={priceRanges}
        currentValue={filters.priceRange}
      />

      <FilterSection
        title="Rating"
        filterType="rating"
        options={ratings}
        currentValue={filters.rating}
      />

      <FilterSection
        title="Duration"
        filterType="duration"
        options={durations}
        currentValue={filters.duration}
      />

      <FilterSection
        title="Level"
        filterType="level"
        options={levels}
        currentValue={filters.level}
      />
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      {showMobileButton && (
        <Button
          onClick={() => setIsMobileOpen(true)}
          variant="outline"
          className="md:hidden mb-4 w-full border-[#6B7280] text-[#6B7280] hover:border-[#F5B301] hover:text-[#F5B301]"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      )}

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 md:hidden">
          <div className="fixed inset-y-0 right-0 w-80 bg-[#1C1F2A] border-l border-[#6B7280] p-6 overflow-y-auto">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className={`hidden md:block ${className}`}>
        <div className="bg-[#1C1F2A] border border-[#6B7280] rounded-lg p-6 sticky top-20">
          {sidebarContent}
        </div>
      </div>
    </>
  );
}
