"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronDown, X } from "lucide-react";

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

interface CategoryFilterProps {
  categories: Category[];
  className?: string;
}

export default function CategoryFilter({
  categories,
  className = "",
}: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      const category = categories.find((cat) => cat.name === categoryParam);
      if (category) {
        setSelectedCategory(category);
      }
    } else {
      setSelectedCategory(null);
    }
  }, [searchParams, categories]);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setIsOpen(false);

    const params = new URLSearchParams(searchParams);
    params.set("category", category.name);
    params.delete("page");
    router.push(`/courses?${params.toString()}`);
  };

  const clearCategory = () => {
    setSelectedCategory(null);
    const params = new URLSearchParams(searchParams);
    params.delete("category");
    params.delete("page");
    router.push(`/courses?${params.toString()}`);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-white">Category</Label>

        {/* Category Selector */}
        <div className="relative">
          <Button
            onClick={() => setIsOpen(!isOpen)}
            variant="outline"
            className="w-full justify-between bg-[#2A2D3A] border-[#6B7280] text-white hover:border-[#F5B301] hover:text-[#F5B301] transition-colors duration-200"
          >
            <span className="flex items-center gap-2 min-w-0 flex-1">
              {selectedCategory ? (
                <>
                  {selectedCategory.icon && (
                    <span className="flex-shrink-0">{selectedCategory.icon}</span>
                  )}
                  <span className="truncate">{selectedCategory.name}</span>
                  <span className="text-xs text-[#6B7280] flex-shrink-0 hidden sm:inline">
                    ({selectedCategory._count.courses} courses)
                  </span>
                </>
              ) : (
                <span className="truncate">All Categories</span>
              )}
            </span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </Button>

          {/* Clear button */}
          {selectedCategory && (
            <Button
              onClick={clearCategory}
              variant="ghost"
              size="sm"
              className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-[#6B7280] hover:text-white flex-shrink-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-[#1C1F2A] border border-[#6B7280] rounded-lg shadow-lg max-h-60 overflow-y-auto">
            <div className="p-2">
              {/* All Categories Option */}
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setIsOpen(false);
                  clearCategory();
                }}
                className="w-full text-left px-3 py-2 rounded-md text-sm text-[#6B7280] hover:bg-[#2A2D3A] hover:text-white transition-colors duration-200"
              >
                All Categories
              </button>

              {/* Category Options */}
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category)}
                  className="w-full text-left px-3 py-2 rounded-md text-sm text-[#6B7280] hover:bg-[#2A2D3A] hover:text-white transition-colors duration-200 flex items-center gap-2 min-w-0"
                >
                  {category.icon && (
                    <span className="flex-shrink-0">{category.icon}</span>
                  )}
                  <span className="flex-1 truncate">{category.name}</span>
                  <span className="text-xs text-[#6B7280] flex-shrink-0">
                    {category._count.courses}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
