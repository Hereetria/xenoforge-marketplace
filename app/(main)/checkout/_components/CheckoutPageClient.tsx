"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import CheckoutHeader from "./CheckoutHeader";
import CheckoutProgress from "./CheckoutProgress";
import OrderSummary, { OrderItem } from "./OrderSummary";
import PaymentMethodSelection from "./PaymentMethodSelection";
import StripePaymentForm from "./StripePaymentForm";
import EmptyCheckout from "./EmptyCheckout";
import {
  isDiscountEnabled,
  calculateDiscountedPrice,
  DISCOUNT_PERCENTAGE,
} from "@/lib/discountUtils";
import CheckoutSkeleton from "./CheckoutSkeleton";
import { useShoppingCart } from "@/contexts/ShoppingCartContext";

interface CartItem {
  id: string | number;
  title: string;
  price: number;
  originalPrice?: number;
  thumbnail: string;
  instructor: string;
  [key: string]: unknown;
}

export interface StripeCheckoutRequest {
  courses: { id: string }[];
  couponDiscountPercentage?: number;
  source: "direct" | "cart";
}

export default function CheckoutPageClient() {
  const [courseData, setCourseData] = useState<OrderItem | null>(null);
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "stripe" | null
  >(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountPercentage: number;
  } | null>(null);

  const router = useRouter();
  const { items: cartContextItems, isReady: isCartReady } = useShoppingCart();
  const SHOW_TAX = false;

  const normalizeItem = (item: CartItem): OrderItem => {
    const discountOn = isDiscountEnabled();
    const hasOriginal =
      typeof item.originalPrice === "number" && item.originalPrice > 0;
    const base = hasOriginal ? item.originalPrice : item.price;

    if (discountOn && base) {
      const discounted = Math.round(calculateDiscountedPrice(base) * 100) / 100;
      return {
        ...item,
        originalPrice: base,
        price: discounted,
      } as OrderItem;
    } else {
      return {
        ...item,
        price: base,
        originalPrice: undefined,
      } as OrderItem;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const directPurchase = sessionStorage.getItem("direct-purchase-course");
      if (directPurchase) {
        const course = JSON.parse(directPurchase);
        setCourseData(normalizeItem(course));
        sessionStorage.removeItem("direct-purchase-course");
      } else {
        const normalized = (cartContextItems as unknown as OrderItem[]).map(
          normalizeItem
        );
        setCartItems(normalized);
      }
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [cartContextItems]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleStepBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      if (currentStep === 2) {
        setSelectedPaymentMethod(null);
      }
    }
  };

  const handlePaymentMethodSelect = (method: "stripe") => {
    setSelectedPaymentMethod(method);
    setCurrentStep(2);
  };

  const handleStripePayment = async () => {
    setIsProcessing(true);

    try {
      const checkoutItems = courseData ? [courseData] : cartItems;

      const requestData: StripeCheckoutRequest = {
        courses: checkoutItems.map((item: OrderItem) => ({
          id: item.id.toString(),
        })),
        couponDiscountPercentage: appliedCoupon?.discountPercentage,
        source: courseData ? "direct" : "cart",
      };

      const response = await axios.post("/api/payments/stripe", requestData, {
        timeout: 30000,
        headers: { "Content-Type": "application/json" },
      });

      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        console.error("Missing Stripe session URL:", response.data);
        alert("Failed to start checkout session.");
      }
    } catch (error: unknown) {
      console.error(error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!mounted || isLoading || !isCartReady) {
    return <CheckoutSkeleton />;
  }

  if (!courseData && cartItems.length === 0) {
    return <EmptyCheckout />;
  }

  const checkoutItems = courseData ? [courseData] : cartItems;

  const originalSubtotalCents = checkoutItems.reduce((sum, item: OrderItem) => {
    const base =
      typeof item.originalPrice === "number" && item.originalPrice > 0
        ? item.originalPrice
        : item.price;
    return sum + Math.round(base * 100);
  }, 0);
  const originalSubtotal = originalSubtotalCents / 100;

  const subtotalCents = checkoutItems.reduce((sum, item: OrderItem) => {
    const base =
      typeof item.originalPrice === "number" && item.originalPrice > 0
        ? item.originalPrice
        : item.price;
    const effective = appliedCoupon
      ? Math.round(base * (1 - appliedCoupon.discountPercentage / 100) * 100) / 100
      : item.price;
    return sum + Math.round(effective * 100);
  }, 0);
  const subtotal = subtotalCents / 100;

  const discountAmount = Math.max(0, originalSubtotal - subtotal);

  const discountInfo: {
    type: "coupon" | "default";
    code: string;
    percentage: number;
  } | null = appliedCoupon
    ? {
        type: "coupon" as const,
        code: appliedCoupon.code,
        percentage: appliedCoupon.discountPercentage,
      }
    : isDiscountEnabled() && originalSubtotal - subtotal > 0
    ? { type: "default" as const, code: "DEFAULT", percentage: DISCOUNT_PERCENTAGE }
    : null;

  const taxAmount = 0;
  const totalPrice = subtotal;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[#1C1F2A] to-[#2A2D3A]">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <CheckoutHeader onBack={handleBack} />
        <CheckoutProgress currentStep={currentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <OrderSummary
            items={checkoutItems}
            subtotal={subtotal}
            originalSubtotal={originalSubtotal}
            discountAmount={discountAmount}
            discountInfo={discountInfo}
            taxAmount={taxAmount}
            totalPrice={totalPrice}
            appliedCoupon={appliedCoupon}
            onCouponApplied={setAppliedCoupon}
          />

          <div className="lg:col-span-2 order-2">
            {currentStep === 1 && (
              <PaymentMethodSelection
                onPaymentMethodSelect={handlePaymentMethodSelect}
              />
            )}

            {currentStep === 2 && selectedPaymentMethod === "stripe" && (
              <StripePaymentForm
                totalPrice={totalPrice}
                isProcessing={isProcessing}
                onBack={handleStepBack}
                onPayment={handleStripePayment}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
