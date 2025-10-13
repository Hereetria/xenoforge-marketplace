"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft, Home, RefreshCw } from "lucide-react";
import Link from "next/link";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "There is a problem with the server configuration.";
      case "AccessDenied":
        return "Access denied. You do not have permission to sign in.";
      case "Verification":
        return "The verification token has expired or has already been used.";
      case "Default":
      default:
        return "An error occurred during authentication. Please try again.";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F23] via-[#1C1F2A] to-[#2D1B69] flex items-center justify-center p-4">
      <Card className="bg-[#1C1F2A] border-[#6B7280] p-8 max-w-md w-full text-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="p-4 bg-red-500/10 rounded-full">
            <AlertTriangle className="h-12 w-12 text-red-400" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">Authentication Error</h1>
            <p className="text-gray-400">{getErrorMessage(error)}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="flex-1 border-[#6B7280] text-white hover:bg-[#6B7280]/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Link href="/auth/login">
              <Button className="flex-1 bg-[#F5B301] hover:bg-[#F5B301]/90 text-black font-semibold">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="outline"
                className="flex-1 border-[#6B7280] text-white hover:bg-[#6B7280]/20"
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-[#0F0F23] via-[#1C1F2A] to-[#2D1B69] flex items-center justify-center p-4">
          <Card className="bg-[#1C1F2A] border-[#6B7280] p-8 max-w-md w-full text-center">
            <div className="flex flex-col items-center space-y-6">
              <div className="p-4 bg-red-500/10 rounded-full">
                <AlertTriangle className="h-12 w-12 text-red-400" />
              </div>
              <p className="text-white">Loading...</p>
            </div>
          </Card>
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
