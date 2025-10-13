const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Software Engineer",
    company: "Google",
    avatar: "/api/placeholder/60/60",
    rating: 5,
    text: "XenoForge transformed my career. The web development course was comprehensive and practical. I landed my dream job at Google within 6 months of completing the course.",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Data Scientist",
    company: "Microsoft",
    avatar: "/api/placeholder/60/60",
    rating: 5,
    text: "The machine learning course was exceptional. The instructors were knowledgeable and the hands-on projects helped me understand complex concepts easily. Highly recommended!",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "UX Designer",
    company: "Apple",
    avatar: "/api/placeholder/60/60",
    rating: 5,
    text: "As a complete beginner in design, XenoForge's UI/UX course gave me the confidence and skills to pursue my passion. The community support was amazing.",
  },
  {
    id: 4,
    name: "David Kim",
    role: "Marketing Manager",
    company: "Tesla",
    avatar: "/api/placeholder/60/60",
    rating: 5,
    text: "The digital marketing course provided real-world strategies that I could implement immediately. My campaigns' performance improved by 300% after applying what I learned.",
  },
  {
    id: 5,
    name: "Lisa Wang",
    role: "Product Manager",
    company: "Amazon",
    avatar: "/api/placeholder/60/60",
    rating: 5,
    text: "XenoForge's business courses helped me transition from engineering to product management. The case studies and practical exercises were invaluable.",
  },
  {
    id: 6,
    name: "Alex Thompson",
    role: "Freelance Developer",
    company: "Self-Employed",
    avatar: "/api/placeholder/60/60",
    rating: 5,
    text: "The flexibility of learning at my own pace while having access to expert instructors made all the difference. I now run a successful freelance business.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 lg:py-24 bg-[#1C1F2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            What Our Students Say
          </h2>
          <p className="text-xl text-[#6B7280] max-w-3xl mx-auto">
            Join thousands of successful learners who have transformed their careers
            with XenoForge
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-[#2A2D3A] rounded-xl p-4 sm:p-6 border border-[#6B7280] hover:border-[#F5B301] transition-colors duration-200"
            >
              <div className="flex items-center space-x-1 mb-3 sm:mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-[#F5B301] text-sm sm:text-lg">
                    ★
                  </span>
                ))}
              </div>

              <blockquote className="text-[#6B7280] mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                &ldquo;{testimonial.text}&rdquo;
              </blockquote>

              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#6B7280] rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-xs sm:text-sm">
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <div className="text-white font-semibold text-sm sm:text-base">
                    {testimonial.name}
                  </div>
                  <div className="text-[#6B7280] text-xs sm:text-sm">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <div className="bg-[#2A2D3A] rounded-xl p-4 sm:p-6 lg:p-8 border border-[#6B7280] max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-8 mb-4 sm:mb-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-[#F5B301]">
                  50,000+
                </div>
                <div className="text-[#6B7280] text-xs sm:text-sm">
                  Happy Students
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-[#F5B301]">
                  4.8/5
                </div>
                <div className="text-[#6B7280] text-xs sm:text-sm">
                  Average Rating
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-[#F5B301]">
                  95%
                </div>
                <div className="text-[#6B7280] text-xs sm:text-sm">Success Rate</div>
              </div>
            </div>
            <p className="text-[#6B7280] text-sm sm:text-base lg:text-lg">
              Join our community of successful learners and start your journey today
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
