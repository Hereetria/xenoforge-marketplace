import Logo from "./_components/Logo";
import DesktopNavigation from "./_components/DesktopNavigation";
import NavbarClient from "./NavbarClient";

export default function Navbar() {
  return (
    <nav
      className="bg-[#1C1F2A] border-b border-[#6B7280] sticky top-0 z-50 h-16"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16 min-w-0 relative">
          <Logo />
          <DesktopNavigation />
          <NavbarClient />
        </div>
      </div>
    </nav>
  );
}
