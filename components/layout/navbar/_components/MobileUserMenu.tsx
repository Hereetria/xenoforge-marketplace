"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { Role } from "@prisma/client";
import { Crown, BookOpen } from "lucide-react";
import UserAvatar from "./UserAvatar";
import UserInfo from "./UserInfo";
import { useSubscription } from "@/contexts/SubscriptionContext";
import PremiumDialog from "@/components/ui/premium-dialog";
import { MobileNavbarSkeleton } from "./NavbarSkeleton";

interface MobileUserMenuProps {
  user: {
    name?: string | null;
    email: string;
    role: Role;
  };
  onLinkClick: () => void;
}

export default function MobileUserMenu({ user, onLinkClick }: MobileUserMenuProps) {
  const { hasActiveSubscription, isLoading: subscriptionLoading } =
    useSubscription();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  if (subscriptionLoading) {
    return <MobileNavbarSkeleton />;
  }

  return (
    <div className="px-2 py-2 border-t border-[#6B7280] space-y-2">
      {hasActiveSubscription ? (
        <Link
          href="/all-courses"
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-lg font-bold hover:from-green-600 hover:to-green-700 transition-all duration-200 text-sm w-full shadow-lg"
        >
          <BookOpen className="h-4 w-4" />
          All Courses
        </Link>
      ) : (
        <PremiumDialog>
          <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#F5B301] to-[#FFD700] text-[#1C1F2A] px-3 py-1.5 rounded-lg font-bold hover:from-[#FFF9E6] hover:to-[#F5B301] transition-all duration-200 text-sm w-full shadow-lg cursor-pointer">
            <Crown className="h-4 w-4" />
            Premium
          </button>
        </PremiumDialog>
      )}
      <div className="flex items-center space-x-2">
        <UserAvatar name={user.name} email={user.email} />
        <UserInfo name={user.name} role={user.role} />
      </div>
      <button
        onClick={handleSignOut}
        className="w-full bg-[#F5B301] text-[#1C1F2A] px-3 py-1.5 rounded-lg font-medium hover:bg-[#FFF9E6] transition-colors duration-200 text-sm"
      >
        Logout
      </button>
    </div>
  );
}
