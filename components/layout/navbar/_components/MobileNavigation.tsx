"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useShoppingCart } from "@/contexts/ShoppingCartContext";
import { useSession } from "next-auth/react";

interface MobileNavigationProps {
  onLinkClick: () => void;
}

export default function MobileNavigation({ onLinkClick }: MobileNavigationProps) {
  const { getItemCount } = useShoppingCart();
  const itemCount = getItemCount();
  const { status } = useSession();
  const isAuthed = status === "authenticated";

  return (
    <div className="flex flex-col space-y-0.5">
      {isAuthed && (
        <Link
          href="/my-learning"
          className="text-white hover:text-[#F5B301] transition-colors duration-200 px-2 py-2 font-medium text-sm block w-full text-left"
          onClick={onLinkClick}
        >
          My Learning
        </Link>
      )}
      <Link
        href="/courses"
        className="text-white hover:text-[#F5B301] transition-colors duration-200 px-2 py-2 font-medium text-sm block w-full text-left"
        onClick={onLinkClick}
      >
        Browse Courses
      </Link>
      {isAuthed && (
        <>
          <Link
            href="/my-teaching"
            className="text-white hover:text-[#F5B301] transition-colors duration-200 px-2 py-2 font-medium text-sm block w-full text-left"
            onClick={onLinkClick}
          >
            My Teaching
          </Link>
          <Link
            href="/payment-history"
            className="text-white hover:text-[#F5B301] transition-colors duration-200 px-2 py-2 font-medium text-sm block w-full text-left"
            onClick={onLinkClick}
          >
            Payment History
          </Link>
          <Link
            href="/cart"
            className="text-white hover:text-[#F5B301] transition-colors duration-200 px-2 py-2 font-medium text-sm w-full text-left flex items-center space-x-2"
            onClick={onLinkClick}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Shopping Cart</span>
            {itemCount > 0 && (
              <span className="bg-[#F5B301] text-[#1C1F2A] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ml-auto">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>
        </>
      )}
    </div>
  );
}
