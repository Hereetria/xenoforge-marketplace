"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Subscription {
  id: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  provider: string;
  amount: number;
  currency: string;
  createdAt: string;
}

interface SubscriptionContextType {
  hasActiveSubscription: boolean;
  subscription: Subscription | null;
  isLoading: boolean;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();

  const fetchSubscriptionStatus = async () => {
    if (status === "loading") return;
    if (!session?.user) {
      setHasActiveSubscription(false);
      setSubscription(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/subscriptions/status");
      const data = await response.json();

      if (response.ok) {
        setHasActiveSubscription(data.hasActiveSubscription);
        setSubscription(data.subscription);
      } else {
        setHasActiveSubscription(false);
        setSubscription(null);
      }
    } catch (error) {
      console.error("Failed to fetch subscription status:", error);
      setHasActiveSubscription(false);
      setSubscription(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionStatus();
  }, [session, status]);

  const refreshSubscription = async () => {
    setIsLoading(true);
    await fetchSubscriptionStatus();
  };

  return (
    <SubscriptionContext.Provider
      value={{
        hasActiveSubscription,
        subscription,
        isLoading,
        refreshSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
}
