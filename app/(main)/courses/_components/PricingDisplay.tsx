"use client";

interface PricingDisplayProps {
  originalPrice: number;
  finalPrice: number;
  coupon?: {
    valid: boolean;
    discountPercentage?: number;
    code?: string;
    message?: string;
  };
  className?: string;
}

export default function PricingDisplay({
  originalPrice,
  finalPrice,
  coupon,
  className = "",
}: PricingDisplayProps) {
  const savings = originalPrice - finalPrice;
  const hasDiscount = coupon?.valid && savings > 0;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Original Price */}
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold text-white">
          ${finalPrice.toFixed(2)}
        </span>
        {hasDiscount && (
          <span className="text-sm text-[#6B7280] line-through">
            ${originalPrice.toFixed(2)}
          </span>
        )}
      </div>

      {/* Discount Info */}
      {hasDiscount && (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-[#F5B301] text-[#1C1F2A] px-2 py-1 rounded text-xs font-semibold">
              {coupon.discountPercentage}% OFF
            </span>
            <span className="text-xs text-[#6B7280]">Code: {coupon.code}</span>
          </div>
          <div className="text-sm text-[#F5B301] font-medium">
            You save ${savings.toFixed(2)}
          </div>
        </div>
      )}

      {/* Error Message */}
      {coupon && !coupon.valid && coupon.message && (
        <div className="text-sm text-red-400">{coupon.message}</div>
      )}
    </div>
  );
}
