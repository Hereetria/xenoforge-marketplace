"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { ShoppingCartProvider } from "@/contexts/ShoppingCartContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "@/components/ErrorBoundary";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <SessionProvider>
        <ShoppingCartProvider>
          <SubscriptionProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#1C1F2A",
                  color: "#fff",
                  border: "1px solid #6B7280",
                },
                success: {
                  style: {
                    background: "#059669",
                    color: "#fff",
                  },
                },
                error: {
                  style: {
                    background: "#DC2626",
                    color: "#fff",
                  },
                },
              }}
            />
          </SubscriptionProvider>
        </ShoppingCartProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
}
