import EnrolledCourses from "@/app/(main)/my-learning/_components/EnrolledCourses";
import LearningStats from "@/app/(main)/my-learning/_components/LearningStats";
import MyLearningHeader from "@/app/(main)/my-learning/_components/MyLearningHeader";
import RecommendedCourses from "@/app/(main)/my-learning/_components/RecommendedCourses";
import { LearningStatsProvider } from "@/contexts/LearningStatsContext";

export default function MyLearningPage() {
  return (
    <LearningStatsProvider>
      <div className="min-h-screen bg-gradient-to-br from-[#1C1F2A] to-[#2A2D3A]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
          <MyLearningHeader />

          <div className="mt-6 sm:mt-8 space-y-6 sm:space-y-8">
            <LearningStats />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                <EnrolledCourses />
              </div>

              <div className="space-y-6 sm:space-y-8">
                <RecommendedCourses />
              </div>
            </div>
          </div>
        </div>
      </div>
    </LearningStatsProvider>
  );
}
