"use client";

import { useRouter, useSearchParams } from "next/navigation";
import CourseGrid from "./CourseGrid";

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

interface CourseGridClientProps {
  courses: Course[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export default function CourseGridClient({
  courses,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
}: CourseGridClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`/courses?${params.toString()}`);
  };

  return (
    <CourseGrid
      courses={courses}
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      itemsPerPage={itemsPerPage}
      onPageChange={handlePageChange}
    />
  );
}
