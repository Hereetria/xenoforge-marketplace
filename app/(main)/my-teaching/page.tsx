import MyTeachingHeader from "./_components/MyTeachingHeader";
import CreateCourseForm from "./_components/CreateCourseForm";
import MyCoursesList from "./_components/MyCoursesList";

export default function MyTeachingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C1F2A] to-[#2A2D3A]">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-4 lg:py-8">
        <MyTeachingHeader />

        <div className="mt-4 sm:mt-6 lg:mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Left side - Course Creation Form */}
            <div className="space-y-4 sm:space-y-6 order-1 lg:order-1">
              <CreateCourseForm />
            </div>

            {/* Right side - My Courses List */}
            <div className="space-y-4 sm:space-y-6 order-2 lg:order-2">
              <MyCoursesList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
