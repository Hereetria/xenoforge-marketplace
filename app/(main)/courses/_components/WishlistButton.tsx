"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface WishlistButtonProps {
  courseId: number | string;
}

export default function WishlistButton({ courseId }: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <Button
      onClick={toggleWishlist}
      variant="outline"
      className={`border-[#6B7280] text-[#6B7280] hover:border-[#F5B301] hover:text-[#F5B301] transition-colors duration-200 ${
        isWishlisted ? "text-[#F5B301] border-[#F5B301]" : ""
      }`}
    >
      {isWishlisted ? "❤️" : "♡"}
    </Button>
  );
}
