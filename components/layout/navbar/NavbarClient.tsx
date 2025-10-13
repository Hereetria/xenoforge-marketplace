"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import AuthenticatedUserMenu from "./_components/AuthenticatedUserMenu";
import UnauthenticatedUserMenu from "./_components/UnauthenticatedUserMenu";
import MobileMenuButton from "./_components/MobileMenuButton";
import MobileNavigation from "./_components/MobileNavigation";
import MobileUserMenu from "./_components/MobileUserMenu";
import MobileUnauthenticatedMenu from "./_components/MobileUnauthenticatedMenu";
import NavbarSkeleton, { MobileNavbarSkeleton } from "./_components/NavbarSkeleton";

export default function NavbarClient() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
        {status === "loading" ? (
          <NavbarSkeleton />
        ) : session ? (
          <AuthenticatedUserMenu user={session.user} />
        ) : (
          <UnauthenticatedUserMenu />
        )}
      </div>
      <MobileMenuButton isMenuOpen={isMenuOpen} onToggle={handleMenuToggle} />

      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 md:hidden bg-[#1C1F2A] border-t border-[#6B7280] shadow-lg">
          <div className="px-2 py-3 space-y-1">
            <MobileNavigation onLinkClick={handleLinkClick} />
            {status === "loading" ? (
              <MobileNavbarSkeleton />
            ) : session ? (
              <MobileUserMenu user={session.user} onLinkClick={handleLinkClick} />
            ) : (
              <MobileUnauthenticatedMenu onLinkClick={handleLinkClick} />
            )}
          </div>
        </div>
      )}
    </>
  );
}
