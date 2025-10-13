"use client";

import React from "react";
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent error={this.state.error} resetError={this.resetError} />
        );
      }

      return (
        <DefaultErrorFallback
          error={this.state.error}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({
  error,
  resetError,
}: {
  error?: Error;
  resetError: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F23] via-[#1C1F2A] to-[#2D1B69] flex items-center justify-center p-4">
      <Card className="bg-[#1C1F2A] border-[#6B7280] p-8 max-w-md w-full text-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="p-4 bg-red-500/10 rounded-full">
            <AlertTriangle className="h-12 w-12 text-red-400" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-400">
              We encountered an unexpected error. Don&apos;t worry, our team has been
              notified.
            </p>
          </div>

          {process.env.NODE_ENV === "development" && error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-md p-4 w-full text-left">
              <p className="text-red-400 text-sm font-mono">{error.message}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              onClick={resetError}
              className="flex-1 bg-[#F5B301] hover:bg-[#F5B301]/90 text-black font-semibold"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="flex-1 border-[#6B7280] text-white hover:bg-[#6B7280]/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Button
              onClick={() => (window.location.href = "/")}
              variant="outline"
              className="flex-1 border-[#6B7280] text-white hover:bg-[#6B7280]/20"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ErrorBoundary;
