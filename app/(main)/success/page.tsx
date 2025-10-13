"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, BookOpen, ArrowRight, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useShoppingCart } from "@/contexts/ShoppingCartContext";
import { useSubscription } from "@/contexts/SubscriptionContext";

function SuccessPageContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscription, setIsSubscription] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useShoppingCart();
  const { refreshSubscription } = useSubscription();

  useEffect(() => {
    const initializeSuccess = async () => {
      const paymentSource = searchParams.get("source");
      const paymentType = searchParams.get("type");
      const isFromCart = paymentSource === "cart";
      const isSubscription = paymentType === "subscription";

      if (isFromCart) {
        console.log("Payment made from cart, clearing cart...");
        try {
          const keys: string[] = [];
          for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (!k) continue;
            if (k === "shopping-cart" || k.startsWith("shopping-cart:")) {
              keys.push(k);
            }
          }
          keys.forEach((k) => localStorage.removeItem(k));
        } catch {
          // Ignore localStorage errors
        }
        clearCart();
      }

      if (isSubscription) {
        console.log(
          "Subscription payment completed, refreshing subscription status..."
        );
        setIsSubscription(true);
        // Subscription refresh edilirken daha uzun loading göster
        await refreshSubscription();
        // Subscription refresh tamamlandıktan sonra biraz daha bekle
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      const timer = setTimeout(
        () => {
          setIsLoading(false);
        },
        isSubscription ? 2000 : 1500
      );

      return () => clearTimeout(timer);
    };

    initializeSuccess();
  }, [clearCart, refreshSubscription, searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1C1F2A] to-[#2A2D3A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#F5B301] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">
            {isSubscription
              ? "Activating your premium subscription..."
              : "Processing your payment..."}
          </p>
          {isSubscription && (
            <p className="text-[#6B7280] text-sm mt-2">
              Please wait while we update your account...
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C1F2A] to-[#2A2D3A]">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {isSubscription ? "Subscription Active! 🎉" : "Payment Successful! 🎉"}
          </h1>

          <p className="text-xl text-[#6B7280] mb-8 max-w-2xl mx-auto">
            {isSubscription
              ? "Welcome to Premium! You now have unlimited access to all courses and premium features."
              : "Thank you for your purchase! You can now access your courses and start learning."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-[#2A2D3A] border-[#6B7280] p-6 hover:border-[#F5B301] transition-colors duration-200">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-[#F5B301] rounded-lg flex items-center justify-center">
                {isSubscription ? (
                  <Crown className="w-6 h-6 text-[#1C1F2A]" />
                ) : (
                  <BookOpen className="w-6 h-6 text-[#1C1F2A]" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {isSubscription ? "Premium Access" : "Access Your Courses"}
                </h3>
                <p className="text-[#6B7280]">
                  {isSubscription
                    ? "Unlimited access to all courses"
                    : "Start learning immediately"}
                </p>
              </div>
            </div>
            <p className="text-[#6B7280] mb-4">
              {isSubscription
                ? "You now have unlimited access to all courses and premium features. Explore our entire catalog!"
                : "All your purchased courses are now available in your learning dashboard."}
            </p>
            <Button
              onClick={() => router.push("/my-learning")}
              className="w-full bg-[#F5B301] text-[#1C1F2A] hover:bg-[#FFF9E6] transition-colors duration-200"
            >
              Go to My Learning
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>

          <Card className="bg-[#2A2D3A] border-[#6B7280] p-6 hover:border-[#F5B301] transition-colors duration-200">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {isSubscription ? "Explore All Courses" : "Browse More Courses"}
                </h3>
                <p className="text-[#6B7280]">
                  {isSubscription
                    ? "Unlimited access to everything"
                    : "Discover new content"}
                </p>
              </div>
            </div>
            <p className="text-[#6B7280] mb-4">
              {isSubscription
                ? "With your premium subscription, you have unlimited access to all courses in our catalog."
                : "Explore our catalog and find more courses to enhance your skills."}
            </p>
            <Button
              onClick={() => router.push("/courses")}
              variant="outline"
              className="w-full border-[#6B7280] text-[#6B7280] hover:border-[#F5B301] hover:text-[#F5B301] transition-colors duration-200"
            >
              {isSubscription ? "Explore All Courses" : "Browse Courses"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        </div>

        <div className="text-center">
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="border-[#6B7280] text-[#6B7280] hover:border-[#F5B301] hover:text-[#F5B301] transition-colors duration-200"
          >
            {isSubscription ? "Start Learning" : "Back to Home"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-[#1C1F2A] to-[#2A2D3A] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#F5B301] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading...</p>
          </div>
        </div>
      }
    >
      <SuccessPageContent />
    </Suspense>
  );
}
