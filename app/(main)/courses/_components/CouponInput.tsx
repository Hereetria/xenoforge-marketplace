"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CouponInputProps {
  onCouponApplied: (coupon: {
    valid: boolean;
    discountPercentage?: number;
    code?: string;
    message?: string;
  }) => void;
  className?: string;
}

export default function CouponInput({
  onCouponApplied,
  className = "",
}: CouponInputProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const applyCoupon = async () => {
    if (!code.trim()) {
      onCouponApplied({ valid: false, message: "Please enter a coupon code" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: code.trim() }),
      });

      const result = await response.json();
      onCouponApplied(result);
    } catch {
      onCouponApplied({ valid: false, message: "Failed to validate coupon" });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      applyCoupon();
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <Label className="text-sm font-medium text-white">Coupon Code</Label>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter coupon code (e.g., DEMO20)"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyPress={handleKeyPress}
          className="bg-[#2A2D3A] border-[#6B7280] text-white placeholder-[#6B7280] focus:border-[#F5B301] focus:ring-[#F5B301]/20"
          disabled={loading}
        />
        <Button
          onClick={applyCoupon}
          disabled={loading || !code.trim()}
          className="bg-[#F5B301] text-[#1C1F2A] hover:bg-[#FFF9E6] transition-colors duration-200 whitespace-nowrap"
        >
          {loading ? "Checking..." : "Apply"}
        </Button>
      </div>
    </div>
  );
}
