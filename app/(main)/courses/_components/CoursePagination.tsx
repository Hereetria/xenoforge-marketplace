"use client";

import { Button } from "@/components/ui/button";

interface CoursePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function CoursePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: CoursePaginationProps) {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-8 space-y-4">
      {/* Results info - always visible */}
      <div className="text-sm text-[#6B7280] text-center sm:text-left">
        Showing {startItem} to {endItem} of {totalItems} results
      </div>

      {/* Pagination controls */}
      <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-4">
        {/* Mobile: Simple prev/next */}
        <div className="flex items-center gap-2 sm:hidden">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="border-[#6B7280] text-[#6B7280] hover:border-[#F5B301] hover:text-[#F5B301] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 px-4 py-2"
          >
            Previous
          </Button>

          <span className="text-sm text-[#6B7280] px-2">
            {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="border-[#6B7280] text-[#6B7280] hover:border-[#F5B301] hover:text-[#F5B301] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 px-4 py-2"
          >
            Next
          </Button>
        </div>

        {/* Desktop: Full pagination */}
        <div className="hidden sm:flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="border-[#6B7280] text-[#6B7280] hover:border-[#F5B301] hover:text-[#F5B301] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 ${
                    page === currentPage
                      ? "bg-[#F5B301] text-[#1C1F2A] hover:bg-[#FFF9E6]"
                      : "border-[#6B7280] text-[#6B7280] hover:border-[#F5B301] hover:text-[#F5B301]"
                  } transition-colors duration-200`}
                >
                  {page}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="border-[#6B7280] text-[#6B7280] hover:border-[#F5B301] hover:text-[#F5B301] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
