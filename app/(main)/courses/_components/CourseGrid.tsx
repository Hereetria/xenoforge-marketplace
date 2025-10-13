import CourseCard from "./CourseCard";
import SortControls from "./SortControls";
import CoursePagination from "./CoursePagination";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus } from "lucide-react";
import Link from "next/link";

interface Course {
  id: number | string;
  title: string;
  instructor: string;
  rating: number;
  students: number;
  price: number;
  originalPrice?: number;
  thumbnail: string;
  duration: string;
  level: string;
  category: string;
  description: string;
}

interface CourseGridProps {
  courses: Course[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function CourseGrid({
  courses,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: CourseGridProps) {
  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">All Courses</h2>
          <p className="text-[#6B7280] text-sm mt-1">
            {courses.length > 0
              ? `Showing ${courses.length} of ${totalItems} courses`
              : `No courses found`}
          </p>
        </div>

        {courses.length > 0 && <SortControls />}
      </div>

      {/* Course Grid or No Courses Found */}
      {courses.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {/* Pagination */}
          <CoursePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={onPageChange}
          />
        </>
      ) : (
        /* No Courses Found */
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="text-center max-w-md">
            <div className="mx-auto w-24 h-24 bg-[#6B7280]/20 rounded-full flex items-center justify-center mb-6">
              <BookOpen className="w-12 h-12 text-[#6B7280]" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-3">No Courses Found</h3>

            <p className="text-[#6B7280] text-lg mb-8">
              There are no courses available at the moment. Be the first to create
              and share your knowledge!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/my-teaching">
                <Button className="bg-[#F5B301] hover:bg-[#F5B301]/90 text-black font-semibold px-6 py-3">
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Course
                </Button>
              </Link>

              <Link href="/my-teaching">
                <Button
                  variant="outline"
                  className="border-white/30 !text-black hover:bg-white/10 hover:border-white/50 hover:!text-white px-6 py-3"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Go to My Teaching
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
