"use client";

import { Button } from "@/components/ui/button";
import CartItemCard, { CartItemData } from "./CartItemCard";

interface CartItemsSectionProps {
  currentItems: CartItemData[];
  onRemoveItem: (courseId: string | number) => void;
  onClearCart: () => void;
}

export default function CartItemsSection({
  currentItems,
  onRemoveItem,
  onClearCart,
}: CartItemsSectionProps) {
  return (
    <div className="lg:col-span-2 space-y-3 sm:space-y-4">
      <div className="flex justify-end mb-3 sm:mb-4">
        <Button
          onClick={onClearCart}
          variant="outline"
          size="sm"
          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:border-yellow-400 hover:border-2 text-xs sm:text-sm transition-all duration-100 ease-out"
        >
          Clear Cart
        </Button>
      </div>

      {currentItems.map((item) => (
        <CartItemCard key={item.id} item={item} onRemove={onRemoveItem} />
      ))}
    </div>
  );
}
