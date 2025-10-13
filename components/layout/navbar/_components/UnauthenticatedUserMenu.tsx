import Link from "next/link";

export default function UnauthenticatedUserMenu() {
  return (
    <div className="flex items-center space-x-2 lg:space-x-6">
      <Link
        href="/auth/login"
        className="text-white hover:text-[#F5B301] transition-colors duration-200 font-medium text-sm lg:text-base"
      >
        Login
      </Link>
      <Link
        href="/auth/signup"
        className="bg-[#F5B301] text-[#1C1F2A] px-2 lg:px-4 py-1.5 lg:py-2 rounded-lg font-medium hover:bg-[#FFF9E6] transition-colors duration-200 text-xs lg:text-sm"
      >
        Sign Up
      </Link>
    </div>
  );
}
