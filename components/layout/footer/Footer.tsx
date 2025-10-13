import FooterBrand from "./_components/FooterBrand";
import FooterSection from "./_components/FooterSection";
import FooterBottom from "./_components/FooterBottom";

export default function Footer() {
  const learningLinks = [
    { href: "/courses", label: "Browse Courses" },
    { href: "/my-learning", label: "My Learning" },
    { href: "/payment-history", label: "Payment History" },
    { href: "/categories", label: "Categories" },
    { href: "/instructors", label: "Top Instructors" },
  ];

  const teachingLinks = [
    { href: "/my-teaching", label: "My Teaching" },
    { href: "/create-course", label: "Create Course" },
    { href: "/instructor-guide", label: "Instructor Guide" },
    { href: "/earnings", label: "Earnings" },
  ];

  const supportLinks = [
    { href: "/help", label: "Help Center" },
    { href: "/contact", label: "Contact Us" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ];

  return (
    <footer className="bg-[#1C1F2A] border-t border-[#6B7280] mt-auto">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <FooterBrand />
          <FooterSection title="Learning" links={learningLinks} />
          <FooterSection title="Teaching" links={teachingLinks} />
          <FooterSection title="Support" links={supportLinks} />
        </div>
        <FooterBottom />
      </div>
    </footer>
  );
}
