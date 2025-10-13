"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CancelPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1C1F2A] to-[#2A2D3A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Processing cancellation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C1F2A] to-[#2A2D3A]">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Payment Cancelled
          </h1>

          <p className="text-xl text-[#6B7280] mb-8 max-w-2xl mx-auto">
            Your payment was cancelled. No charges have been made to your account.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-[#2A2D3A] border-[#6B7280] p-6 hover:border-[#F5B301] transition-colors duration-200">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-[#F5B301] rounded-lg flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-[#1C1F2A]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Try Again</h3>
                <p className="text-[#6B7280]">Complete your purchase</p>
              </div>
            </div>
            <p className="text-[#6B7280] mb-4">
              Something went wrong? You can try the payment process again.
            </p>
            <Button
              onClick={() => router.back()}
              className="w-full bg-[#F5B301] text-[#1C1F2A] hover:bg-[#FFF9E6] transition-colors duration-200"
            >
              Try Again
              <RefreshCw className="w-4 h-4 ml-2" />
            </Button>
          </Card>

          <Card className="bg-[#2A2D3A] border-[#6B7280] p-6 hover:border-[#F5B301] transition-colors duration-200">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <ArrowLeft className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Browse Courses</h3>
                <p className="text-[#6B7280]">Explore our catalog</p>
              </div>
            </div>
            <p className="text-[#6B7280] mb-4">
              Take your time to explore our courses and find the perfect one for you.
            </p>
            <Button
              onClick={() => router.push("/courses")}
              variant="outline"
              className="w-full border-[#6B7280] text-[#6B7280] hover:border-[#F5B301] hover:text-[#F5B301] transition-colors duration-200"
            >
              Browse Courses
              <ArrowLeft className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        </div>

        <div className="text-center space-y-4">
          <div className="bg-[#2A2D3A] border border-[#6B7280] rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-white mb-2">Need Help?</h3>
            <p className="text-[#6B7280] mb-4">
              If you&apos;re experiencing issues with payments, please contact our
              support team.
            </p>
            <div className="text-sm text-[#6B7280]">
              <p>Common issues:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Insufficient funds</li>
                <li>Card declined by bank</li>
                <li>Incorrect card information</li>
                <li>Network connectivity issues</li>
              </ul>
            </div>
          </div>

          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="border-[#6B7280] text-[#6B7280] hover:border-[#F5B301] hover:text-[#F5B301] transition-colors duration-200"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
