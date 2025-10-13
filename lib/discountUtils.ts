/**
 * Discount utility functions
 */

export const DISCOUNT_PERCENTAGE = 40; // 40% discount

/**
 * Calculate discounted price
 * @param originalPrice - The original price
 * @returns The discounted price
 */
export function calculateDiscountedPrice(originalPrice: number): number {
  return Math.round(originalPrice * (1 - DISCOUNT_PERCENTAGE / 100) * 100) / 100;
}

/**
 * Check if discount is enabled from environment variables
 * @returns boolean indicating if discount is enabled
 */
export function isDiscountEnabled(): boolean {
  return process.env.NEXT_PUBLIC_DISCOUNT_ENABLED === "true";
}

/**
 * Get price display information
 * @param originalPrice - The original price
 * @returns Object with original, discounted prices and savings
 */
export function getPriceInfo(originalPrice: number) {
  const isEnabled = isDiscountEnabled();
  
  if (!isEnabled) {
    return {
      originalPrice,
      discountedPrice: originalPrice,
      savings: 0,
      showDiscount: false,
    };
  }

  const discountedPrice = calculateDiscountedPrice(originalPrice);
  const savings = originalPrice - discountedPrice;

  return {
    originalPrice,
    discountedPrice,
    savings,
    showDiscount: true,
  };
}
