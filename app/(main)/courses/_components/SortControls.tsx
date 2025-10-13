"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortControls() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sortBy = searchParams.get("sort") || "popular";

  const sortOptions = [
    { value: "popular", label: "Most Popular" },
    { value: "newest", label: "Newest" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Rating" },
  ];

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    params.delete("page");
    router.push(`/courses${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-[#6B7280]">Sort by:</span>
      <select
        value={sortBy}
        onChange={(e) => handleSortChange(e.target.value)}
        className="bg-[#2A2D3A] border border-[#6B7280] text-white rounded-md px-3 py-1 text-sm focus:border-[#F5B301] focus:ring-[#F5B301]/20 focus:outline-none cursor-pointer"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
