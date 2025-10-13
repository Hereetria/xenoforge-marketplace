import Link from "next/link";

interface MobileUnauthenticatedMenuProps {
  onLinkClick: () => void;
}

export default function MobileUnauthenticatedMenu({
  onLinkClick,
}: MobileUnauthenticatedMenuProps) {
  return (
    <div className="px-2 py-2 border-t border-[#6B7280] space-y-2">
      <Link
        href="/auth/login"
        className="block text-white hover:text-[#F5B301] transition-colors duration-200 py-1.5 font-medium text-sm w-full text-left"
        onClick={onLinkClick}
      >
        Login
      </Link>
      <Link
        href="/auth/signup"
        className="block bg-[#F5B301] text-[#1C1F2A] px-3 py-1.5 rounded-lg font-medium hover:bg-[#FFF9E6] transition-colors duration-200 text-center text-sm w-full"
        onClick={onLinkClick}
      >
        Sign Up
      </Link>
    </div>
  );
}
