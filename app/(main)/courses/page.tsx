import { Suspense } from "react";
import CoursesPageClient from "@/app/(main)/courses/_components/CoursesPageClient";

export default function BrowseCoursesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CoursesPageClient />
    </Suspense>
  );
}
