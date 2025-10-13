"use client";

import { Card } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

interface PaymentMethodSelectionProps {
  onPaymentMethodSelect: (method: "stripe") => void;
}

export default function PaymentMethodSelection({
  onPaymentMethodSelect,
}: PaymentMethodSelectionProps) {
  return (
    <Card className="bg-[#2A2D3A] border-[#6B7280] p-6 sticky top-17 sm:top-17 lg:top-17 transition-all duration-500 ease-in-out hover:shadow-xl hover:shadow-[#F5B301]/10 transform hover:scale-[1.01]">
      <h2 className="text-xl font-bold text-white mb-6 transition-all duration-300 ease-in-out">
        Choose Payment Method
      </h2>

      <div className="flex justify-center">
        {/* Stripe Payment */}
        <div
          onClick={() => onPaymentMethodSelect("stripe")}
          className="p-6 border-2 border-[#6B7280] rounded-lg cursor-pointer hover:border-[#F5B301] hover:border-2 transition-all duration-100 ease-out bg-[#1C1F2A] hover:bg-[#2A2D3A] hover:scale-[1.02] hover:shadow-lg hover:shadow-[#F5B301]/20 transform max-w-md w-full"
          style={{
            animation: "slideInLeft 0.6s ease-out forwards",
          }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-[#635BFF] rounded-lg flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">Credit/Debit Card</h3>
              <p className="text-[#6B7280] text-sm">Powered by Stripe</p>
            </div>
          </div>
          <p className="text-[#6B7280] text-sm mb-4">
            Pay securely with your credit or debit card. All major cards accepted.
          </p>
          <div className="flex items-center space-x-2 text-xs text-[#6B7280]">
            <span>Visa</span>
            <span>•</span>
            <span>Mastercard</span>
            <span>•</span>
            <span>American Express</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
