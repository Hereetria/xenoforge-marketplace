"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  BookOpen,
  Lock,
  Shield,
  Tag,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { getPriceInfo } from "@/lib/discountUtils";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface OrderItem {
  id: number | string;
  title: string;
  instructor: string;
  price: number;
  originalPrice?: number;
  thumbnail: string;
  duration: string;
  level: string;
}

interface OrderSummaryProps {
  items: OrderItem[];
  subtotal: number;
  originalSubtotal: number;
  discountAmount: number;
  discountInfo?: {
    type: "coupon" | "default";
    code: string;
    percentage: number;
  } | null;
  taxAmount: number;
  totalPrice: number;
  appliedCoupon?: { code: string; discountPercentage: number } | null;
  onCouponApplied?: (
    coupon: { code: string; discountPercentage: number } | null
  ) => void;
}

export default function OrderSummary({
  items,
  subtotal,
  originalSubtotal,
  discountAmount,
  discountInfo,
  taxAmount,
  totalPrice,
  appliedCoupon,
  onCouponApplied,
}: OrderSummaryProps) {
  const [couponCode, setCouponCode] = useState("");
  const [couponStatus, setCouponStatus] = useState<
    "idle" | "validating" | "valid" | "invalid"
  >("idle");

  const validateCoupon = async (code: string) => {
    if (!code.trim()) return;

    setCouponStatus("validating");
    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await response.json();

      if (data.valid) {
        setCouponStatus("valid");
        onCouponApplied?.({
          code: data.code,
          discountPercentage: data.discountPercentage,
        });
      } else {
        setCouponStatus("invalid");
        onCouponApplied?.(null);
      }
    } catch (error) {
      console.error("Coupon validation error:", error);
      setCouponStatus("invalid");
      onCouponApplied?.(null);
    }
  };

  const removeCoupon = () => {
    setCouponCode("");
    setCouponStatus("idle");
    onCouponApplied?.(null);
  };
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="lg:col-span-1 order-1">
      <Card className="bg-[#2A2D3A] border-[#6B7280] p-3 sm:p-4 lg:p-6 sticky top-17 sm:top-17 lg:top-17 transition-all duration-500 ease-in-out transform hover:scale-[1.02] hover:shadow-xl hover:shadow-[#F5B301]/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Order Summary</h2>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs text-[#F5B301] border-[#F5B301]/40 hover:text-black hover:bg-[#F5B301]"
            onClick={() => setDemoOpen(true)}
          >
            Demo Cards
          </Button>
        </div>
        {demoOpen && (
          <div className="absolute inset-0 z-20">
            {/* Card-scoped backdrop */}
            <div
              className="absolute inset-0 bg-black/40 rounded-lg"
              onClick={() => setDemoOpen(false)}
            />
            {/* Centered container within the card */}
            <div
              className="relative w-full h-full p-2 sm:p-3 flex items-center"
              onClick={() => setDemoOpen(false)}
            >
              <div
                className="w-full bg-[#1C1F2A] text-white border border-[#2E3448] rounded-lg shadow-xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-semibold">Stripe Test Cards</h3>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="h-6 w-6 p-0 leading-none text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-150"
                      onClick={() => setDemoOpen(false)}
                      aria-label="Close"
                      title="Close"
                    >
                      ×
                    </Button>
                  </div>
                  <p className="text-gray-300 text-xs mb-3">
                    Only the card number matters in demo. Use any future expiry, any
                    CVC, any ZIP.
                  </p>
                  <ul className="space-y-2 list-disc pl-5 text-sm">
                    <li>
                      <span className="font-semibold">Success:</span> 4242 4242 4242
                      4242 — Standard successful payment
                    </li>
                    <li>
                      <span className="font-semibold">3D Secure:</span> 4000 0025
                      0000 3155 — SCA challenge required (approve in modal)
                    </li>
                    <li>
                      <span className="font-semibold">Insufficient funds:</span> 4000
                      0000 0000 9995 — Fails with insufficient_funds
                    </li>
                    <li>
                      <span className="font-semibold">Declined:</span> 4000 0000 0000
                      0341 — Generic card_declined
                    </li>
                    <li>
                      <span className="font-semibold">Expired card:</span> 4000 0000
                      0000 0069 — Expired card
                    </li>
                    <li>
                      <span className="font-semibold">Incorrect CVC:</span> 4000 0000
                      0000 0127 — Incorrect CVC
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Course Items */}
        <div className="space-y-4 mb-6">
          {items.map((item, index) => {
            const hasExplicitOriginal =
              typeof item.originalPrice === "number" &&
              item.originalPrice > item.price;
            const displayDiscount = hasExplicitOriginal
              ? {
                  originalPrice: item.originalPrice!,
                  discountedPrice: item.price,
                  showDiscount: true,
                }
              : getPriceInfo(item.price);
            return (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-[#1C1F2A] rounded-lg transition-all duration-300 ease-in-out hover:bg-[#2A2D3A] hover:scale-[1.02] hover:shadow-md"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: "slideInUp 0.5s ease-out forwards",
                }}
              >
                <div className="w-12 h-12 bg-[#6B7280] rounded-lg flex items-center justify-center flex-shrink-0">
                  {item.thumbnail && item.thumbnail.startsWith("http") ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <BookOpen className="h-6 w-6 text-[#6B7280]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-[#6B7280] text-xs mt-1">by {item.instructor}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[#F5B301] font-bold text-sm">
                      ${displayDiscount.discountedPrice}
                    </span>
                    {displayDiscount.showDiscount && (
                      <span className="text-[#6B7280] line-through text-xs">
                        ${displayDiscount.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Price Breakdown */}
        <div className="space-y-3 border-t border-[#6B7280] pt-4 transition-all duration-500 ease-in-out">
          <div className="flex justify-between items-center transition-all duration-300 ease-in-out hover:bg-[#1C1F2A] hover:px-2 hover:py-1 hover:rounded">
            <span className="text-[#6B7280]">Subtotal:</span>
            <span className="text-white font-medium">
              ${originalSubtotal.toFixed(2)}
            </span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between items-center transition-all duration-300 ease-in-out hover:bg-[#1C1F2A] hover:px-2 hover:py-1 hover:rounded">
              <span className="text-[#F5B301]">
                Discount{" "}
                {discountInfo
                  ? discountInfo.type === "coupon"
                    ? `(${discountInfo.code})`
                    : `(${discountInfo.percentage}% off)`
                  : ""}
                :
              </span>
              <span className="text-[#F5B301] font-medium">
                -${discountAmount.toFixed(2)}
              </span>
            </div>
          )}
          {/* Hide tax on checkout: we will calculate tax on the payment screen */}
          <div className="p-2 bg-[#0F1320] border border-[#2E3448] rounded text-xs text-gray-300">
            Tax will be calculated on the payment screen.
          </div>
          <div className="p-2 bg-[#2E3448]/30 border border-[#2E3448] rounded text-[11px] text-gray-400">
            Note: Taxes are not calculated in demo mode.
          </div>
          <div className="border-t border-[#6B7280] pt-3 transition-all duration-500 ease-in-out hover:border-[#F5B301]/50">
            <div className="flex justify-between items-center transition-all duration-300 ease-in-out hover:bg-[#1C1F2A] hover:px-2 hover:py-1 hover:rounded">
              <span className="text-lg font-bold text-white">Total:</span>
              <span className="text-lg font-bold text-[#F5B301] animate-pulse">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Coupon Section */}
        <div className="mt-4 pt-4 border-t border-[#6B7280]">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="h-4 w-4 text-[#F5B301]" />
            <h3 className="font-medium text-white text-sm">Coupon Code</h3>
          </div>

          {/* Coupon Alert */}
          <div className="mb-3 p-2 bg-[#F5B301]/10 border border-[#F5B301]/30 rounded text-xs">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-3 w-3 text-[#F5B301] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[#F5B301] font-medium">Use DEMO60 for 60% off!</p>
              </div>
            </div>
          </div>

          {!appliedCoupon ? (
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1 bg-[#1C1F2A] border-[#6B7280] text-white placeholder:text-[#6B7280] focus:border-[#F5B301] focus:ring-[#F5B301]/20 text-sm h-8"
                onKeyPress={(e) => e.key === "Enter" && validateCoupon(couponCode)}
              />
              <Button
                onClick={() => validateCoupon(couponCode)}
                disabled={!couponCode.trim() || couponStatus === "validating"}
                className="bg-[#F5B301] text-black hover:bg-[#F5B301]/90 disabled:opacity-50 disabled:cursor-not-allowed h-8 px-3 text-xs"
              >
                {couponStatus === "validating" ? (
                  <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Apply"
                )}
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-2 bg-[#F5B301]/10 border border-[#F5B301]/30 rounded">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#F5B301]" />
                <span className="text-white font-medium text-sm">
                  {appliedCoupon.code} - {appliedCoupon.discountPercentage}% off
                </span>
              </div>
              <Button
                onClick={removeCoupon}
                variant="outline"
                size="sm"
                className="border-[#6B7280] text-[#6B7280] hover:border-[#F5B301] hover:text-[#F5B301] h-6 w-6 p-0"
              >
                <XCircle className="h-3 w-3" />
              </Button>
            </div>
          )}

          {couponStatus === "invalid" && (
            <div className="mt-2 flex items-center gap-2 text-red-400 text-xs">
              <XCircle className="h-3 w-3" />
              <span>Invalid code</span>
            </div>
          )}
        </div>

        {/* Security Badges */}
        <div className="mt-6 pt-4 border-t border-[#6B7280] transition-all duration-500 ease-in-out">
          <div className="flex items-center justify-center space-x-4 text-[#6B7280]">
            <div className="flex items-center space-x-1 transition-all duration-300 ease-in-out hover:text-[#F5B301] hover:scale-110">
              <Lock className="h-4 w-4 transition-all duration-300 ease-in-out" />
              <span className="text-xs font-medium">SSL Secured</span>
            </div>
            <div className="flex items-center space-x-1 transition-all duration-300 ease-in-out hover:text-[#F5B301] hover:scale-110">
              <Shield className="h-4 w-4 transition-all duration-300 ease-in-out" />
              <span className="text-xs font-medium">Protected</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
