"use client";

interface FooterSectionProps {
  title: string;
  links: Array<{
    href: string;
    label: string;
  }>;
}

export default function FooterSection({ title, links }: FooterSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold text-lg">{title}</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <span
              className="text-[#6B7280] hover:text-[#F5B301] transition-colors duration-200 text-sm cursor-pointer"
              onClick={(e) => e.preventDefault()}
            >
              {link.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
