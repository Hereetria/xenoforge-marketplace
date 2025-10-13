"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CartPaginationProps {
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
}

export default function CartPagination({
  currentPage,
  totalPages,
  goToPage,
  goToPreviousPage,
  goToNextPage,
}: CartPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 sm:mt-8">
      <div className="flex sm:hidden flex-col items-center gap-3">
        <div className="flex items-center justify-between w-full">
          <Button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
            className="border-[#6B7280] text-[#6B7280] hover:border-[#F5B301] hover:text-[#F5B301] hover:border-2 disabled:opacity-50 flex-1 mr-2 transition-all duration-100 ease-out"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span className="text-sm">Prev</span>
          </Button>

          <div className="flex items-center gap-1 px-2">
            <span className="text-xs text-[#6B7280] min-w-0">
              {currentPage} of {totalPages}
            </span>
          </div>

          <Button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
            className="border-[#6B7280] text-[#6B7280] hover:border-[#F5B301] hover:text-[#F5B301] hover:border-2 disabled:opacity-50 flex-1 ml-2 transition-all duration-100 ease-out"
          >
            <span className="text-sm">Next</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full justify-center px-2">
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <Button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                variant={currentPage === pageNum ? "default" : "outline"}
                className={
                  currentPage === pageNum
                    ? "bg-[#F5B301] text-[#1C1F2A] hover:bg-[#FFF9E6] hover:border-yellow-400 hover:border-2 min-w-[32px] h-8 transition-all duration-100 ease-out"
                    : "border-[#6B7280] text-[#6B7280] hover:border-[#F5B301] hover:text-[#F5B301] hover:border-2 min-w-[32px] h-8 transition-all duration-100 ease-out"
                }
                size="sm"
              >
                <span className="text-xs">{pageNum}</span>
              </Button>
            );
          })}
        </div>
      </div>

      <div className="hidden sm:flex items-center justify-center gap-4">
        <Button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
          className="border-[#6B7280] text-[#6B7280] hover:border-[#F5B301] hover:text-[#F5B301] hover:border-2 disabled:opacity-50 transition-all duration-100 ease-out"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          <span className="text-sm">Previous</span>
        </Button>

        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              onClick={() => goToPage(page)}
              variant={currentPage === page ? "default" : "outline"}
              className={
                currentPage === page
                  ? "bg-[#F5B301] text-[#1C1F2A] hover:bg-[#FFF9E6] hover:border-yellow-400 hover:border-2 transition-all duration-100 ease-out"
                  : "border-[#6B7280] text-[#6B7280] hover:border-[#F5B301] hover:text-[#F5B301] hover:border-2 transition-all duration-100 ease-out"
              }
              size="sm"
            >
              <span className="text-sm">{page}</span>
            </Button>
          ))}
        </div>

        <Button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
          className="border-[#6B7280] text-[#6B7280] hover:border-[#F5B301] hover:text-[#F5B301] hover:border-2 disabled:opacity-50 transition-all duration-100 ease-out"
        >
          <span className="text-sm">Next</span>
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
