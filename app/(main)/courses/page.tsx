import CoursesPageClient from "@/app/(main)/courses/_components/CoursesPageClient";

interface BrowseCoursesPageProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    category?: string;
    priceRange?: string;
    rating?: string;
    duration?: string;
    sort?: string;
  };
}

export default function BrowseCoursesPage({ searchParams }: BrowseCoursesPageProps) {
  return <CoursesPageClient searchParams={searchParams} />;
}
