import HeroSection from "@/app/(main)/_components/HeroSection";
import FeaturedCourses from "@/app/(main)/_components/FeaturedCourses";
import CategoriesSection from "@/app/(main)/_components/CategoriesSection";
import TestimonialsSection from "@/app/(main)/_components/TestimonialsSection";
import JoinNowBanner from "@/app/(main)/_components/JoinNowBanner";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <FeaturedCourses />
      <CategoriesSection />
      <TestimonialsSection />
      <JoinNowBanner />
    </div>
  );
}
