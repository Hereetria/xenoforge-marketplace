"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { Role } from "@prisma/client";
import { ShoppingCart, Crown, BookOpen } from "lucide-react";
import UserAvatar from "./UserAvatar";
import UserInfo from "./UserInfo";
import { useShoppingCart } from "@/contexts/ShoppingCartContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import PremiumDialog from "@/components/ui/premium-dialog";
import NavbarSkeleton from "./NavbarSkeleton";

interface AuthenticatedUserMenuProps {
  user: {
    name?: string | null;
    email: string;
    role: Role;
  };
}

export default function AuthenticatedUserMenu({ user }: AuthenticatedUserMenuProps) {
  const { getItemCount } = useShoppingCart();
  const { hasActiveSubscription, isLoading: subscriptionLoading } =
    useSubscription();
  const itemCount = getItemCount();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  if (subscriptionLoading) {
    return <NavbarSkeleton />;
  }

  return (
    <div className="flex items-center space-x-2 lg:space-x-6">
      {/* Premium Button */}
      {hasActiveSubscription ? (
        <Link
          href="/all-courses"
          className="flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg font-bold hover:from-green-600 hover:to-green-700 transition-all duration-200 text-xs lg:text-sm shadow-lg"
        >
          <BookOpen className="h-3 w-3 lg:h-4 lg:w-4" />
          <span className="hidden sm:inline">All Courses</span>
        </Link>
      ) : (
        <PremiumDialog>
          <button className="flex items-center gap-1.5 bg-gradient-to-r from-[#F5B301] to-[#FFD700] text-[#1C1F2A] px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg font-bold hover:from-[#FFF9E6] hover:to-[#F5B301] transition-all duration-200 text-xs lg:text-sm shadow-lg cursor-pointer">
            <Crown className="h-3 w-3 lg:h-4 lg:w-4" />
            <span className="hidden sm:inline">Premium</span>
          </button>
        </PremiumDialog>
      )}

      {/* Shopping Cart Icon */}
      <Link
        href="/cart"
        className="relative text-white hover:text-[#F5B301] transition-colors duration-200 p-2"
        title="Shopping Cart"
      >
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#F5B301] text-[#1C1F2A] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount > 9 ? "9+" : itemCount}
          </span>
        )}
      </Link>

      <UserAvatar name={user.name} email={user.email} />
      <UserInfo name={user.name} role={user.role} />
      <button
        onClick={handleSignOut}
        className="bg-[#F5B301] text-[#1C1F2A] px-2 lg:px-4 py-1.5 lg:py-2 rounded-lg font-medium hover:bg-[#FFF9E6] transition-colors duration-200 text-xs lg:text-sm cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
}
