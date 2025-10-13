"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useShoppingCart } from "@/contexts/ShoppingCartContext";
import CartHeader from "./CartHeader";
import EmptyCart from "./EmptyCart";
import CartItemsSection from "./CartItemsSection";
import CartPagination from "./CartPagination";
import OrderSummary from "./OrderSummary";

export default function CartPageClient() {
  const { items, removeFromCart, clearCart } = useShoppingCart();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (items.length === 0) {
    return <EmptyCart />;
  }

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const goToPage = (page: number) => setCurrentPage(page);
  const goToPreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  const handleCheckout = () => {
    if (items.length === 0) return;
    router.push("/checkout");
  };

  const handleContinue = () => router.push("/courses");

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[#1C1F2A] to-[#2A2D3A] py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-2 sm:px-4">
        <CartHeader
          itemCount={items.length}
          currentPage={currentPage}
          totalPages={totalPages}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <CartItemsSection
            currentItems={currentItems}
            onRemoveItem={removeFromCart}
            onClearCart={clearCart}
          />

          <OrderSummary
            items={currentItems}
            onCheckout={handleCheckout}
            onContinueShopping={handleContinue}
          />
        </div>

        <CartPagination
          currentPage={currentPage}
          totalPages={totalPages}
          goToPage={goToPage}
          goToPreviousPage={goToPreviousPage}
          goToNextPage={goToNextPage}
        />
      </div>
    </div>
  );
}
