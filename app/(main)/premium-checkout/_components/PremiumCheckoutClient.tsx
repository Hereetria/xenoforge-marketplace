"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import axios from "axios";
import PremiumCheckoutHeader from "./PremiumCheckoutHeader";
import PremiumCheckoutProgress from "./PremiumCheckoutProgress";
import PremiumOrderSummary from "./PremiumOrderSummary";
import PremiumPaymentMethodSelection from "./PremiumPaymentMethodSelection";
import StripeSubscriptionForm from "./StripeSubscriptionForm";
import PremiumCheckoutSkeleton from "./PremiumCheckoutSkeleton";

interface StripeSubscriptionRequest {
  plan: string;
  price: number;
}

interface StripeSubscriptionResponse {
  sessionId: string;
  url: string;
  error?: string;
  hasActiveSubscription?: boolean;
}

export default function PremiumCheckoutClient() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "stripe" | null
  >(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { status } = useSession();
  const { hasActiveSubscription, isLoading: subscriptionLoading } =
    useSubscription();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && status !== "loading" && !subscriptionLoading) {
      if (hasActiveSubscription) {
        router.push("/");
        return;
      }
    }
  }, [mounted, status, subscriptionLoading, hasActiveSubscription, router]);

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

  const handleStripeSubscription = async () => {
    setIsProcessing(true);
    try {
      const requestData: StripeSubscriptionRequest = {
        plan: "premium",
        price: 29,
      };

      const response = await axios.post<StripeSubscriptionResponse>(
        "/api/subscriptions/stripe",
        requestData,
        {
          timeout: 30000,
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = response.data;

      if (data.url) {
        window.location.href = data.url;
      } else if (data.hasActiveSubscription) {
        alert(
          data.error ||
            "You already have an active subscription. Please cancel your current subscription before subscribing again."
        );
      } else {
        console.error("Missing Stripe session URL:", data);
        alert(data.error || "Failed to start subscription session.");
      }
    } catch (error) {
      console.error("Stripe subscription error:", error);
      alert("Subscription failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!mounted || status === "loading" || subscriptionLoading) {
    return <PremiumCheckoutSkeleton />;
  }

  if (hasActiveSubscription) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[#1C1F2A] to-[#2A2D3A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#F5B301] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✓</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Already Premium!</h1>
          <p className="text-gray-400 mb-6">
            You already have an active premium subscription
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-[#F5B301] text-[#1C1F2A] px-6 py-3 rounded-lg font-semibold hover:bg-[#FFF9E6] transition-colors duration-200"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <PremiumCheckoutSkeleton />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[#1C1F2A] to-[#2A2D3A]">
      <div className="max-w-6xl mx-auto px-1 xs:px-2 sm:px-4 py-2 xs:py-4 sm:py-6">
        <PremiumCheckoutHeader onBack={handleBack} />
        <PremiumCheckoutProgress currentStep={currentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 xs:gap-4 sm:gap-6 lg:gap-8">
          <PremiumOrderSummary />

          <div className="lg:col-span-2 order-2">
            {currentStep === 1 && (
              <div className="sticky top-17 sm:top-17 lg:top-17 transition-all duration-500 ease-in-out">
                <PremiumPaymentMethodSelection
                  onPaymentMethodSelect={handlePaymentMethodSelect}
                />
              </div>
            )}

            {currentStep === 2 && selectedPaymentMethod === "stripe" && (
              <div className="sticky top-17 sm:top-17 lg:top-17 transition-all duration-500 ease-in-out">
                <StripeSubscriptionForm
                  amount={29}
                  isProcessing={isProcessing}
                  onBack={handleStepBack}
                  onSubscription={handleStripeSubscription}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
