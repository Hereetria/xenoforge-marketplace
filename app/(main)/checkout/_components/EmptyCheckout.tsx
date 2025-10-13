"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function EmptyCheckout() {
  const router = useRouter();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[#1C1F2A] to-[#2A2D3A] flex items-center justify-center">
      <Card className="bg-[#2A2D3A] border-[#6B7280] p-8 text-center hover:border-[#F5B301] hover:border-2 transition-all duration-100 ease-out">
        <h1 className="text-2xl font-bold text-white mb-4">No Items to Checkout</h1>
        <p className="text-[#6B7280] mb-6">
          Please add some courses to your cart first.
        </p>
        <Button
          onClick={() => router.push("/courses")}
          className="bg-[#F5B301] text-[#1C1F2A] hover:bg-[#FFF9E6] hover:border-yellow-400 hover:border-2 transition-all duration-100 ease-out"
        >
          Browse Courses
        </Button>
      </Card>
    </div>
  );
}
