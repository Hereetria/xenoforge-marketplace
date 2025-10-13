import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[#1C1F2A] to-[#2A2D3A]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#2A2D3A] border border-[#6B7280] mb-6">
            <span className="text-3xl font-bold text-[#F5B301]">404</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Page not found
          </h1>
          <p className="text-[#6B7280] text-base sm:text-lg max-w-2xl mx-auto mb-8">
            The page you’re looking for doesn’t exist or was moved. Try heading back
            to the homepage or explore our latest courses.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="bg-[#F5B301] text-[#1C1F2A] px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-[#FFF9E6] transition-colors duration-200 text-sm sm:text-base"
            >
              Go to Home
            </Link>
            <Link
              href="/courses"
              className="border-2 border-[#6B7280] text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:border-[#F5B301] hover:text-[#F5B301] transition-colors duration-200 text-sm sm:text-base"
            >
              Browse Courses
            </Link>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#2A2D3A] border border-[#6B7280] rounded-lg p-4 sm:p-6">
            <h2 className="text-white font-semibold text-base sm:text-lg mb-2">
              Popular categories
            </h2>
            <div className="flex flex-wrap gap-2">
              {[
                "Development",
                "Design",
                "Business",
                "IT & Software",
                "Marketing",
                "Data Science",
              ].map((c) => (
                <Link
                  key={c}
                  href={`/courses?category=${encodeURIComponent(c)}`}
                  className="text-xs sm:text-sm px-3 py-1 rounded bg-[#1C1F2A] border border-[#6B7280] text-white hover:text-[#F5B301] hover:border-[#F5B301]"
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>
          <div className="bg-[#2A2D3A] border border-[#6B7280] rounded-lg p-4 sm:p-6">
            <h2 className="text-white font-semibold text-base sm:text-lg mb-2">
              Need help?
            </h2>
            <p className="text-[#6B7280] text-sm mb-3">
              Check your URL, or reach out if you think this is a mistake.
            </p>
            <Link
              href="/"
              className="inline-block text-xs sm:text-sm px-3 py-2 rounded border border-[#6B7280] text-white hover:border-[#F5B301] hover:text-[#F5B301]"
            >
              Return to homepage
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
