import { Card } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

interface PremiumPaymentMethodSelectionProps {
  onPaymentMethodSelect: (method: "stripe") => void;
}

export default function PremiumPaymentMethodSelection({
  onPaymentMethodSelect,
}: PremiumPaymentMethodSelectionProps) {
  return (
    <Card className="bg-[#2A2D3A] border-[#6B7280] p-3 xs:p-4 sm:p-6 sticky top-17 sm:top-17 lg:top-17 transition-all duration-500 ease-in-out hover:shadow-xl hover:shadow-[#F5B301]/10 transform hover:scale-[1.01]">
      <h2 className="text-lg xs:text-xl font-bold text-white mb-4 xs:mb-6 transition-all duration-300 ease-in-out">
        Choose Payment Method
      </h2>

      <div className="flex justify-center">
        {/* Stripe Payment */}
        <div
          onClick={() => onPaymentMethodSelect("stripe")}
          className="p-3 xs:p-4 sm:p-6 border-2 border-[#6B7280] rounded-lg cursor-pointer hover:border-[#F5B301] hover:border-2 transition-all duration-100 ease-out bg-[#1C1F2A] hover:bg-[#2A2D3A] hover:scale-[1.02] hover:shadow-lg hover:shadow-[#F5B301]/20 transform max-w-md w-full"
          style={{
            animation: "slideInLeft 0.6s ease-out forwards",
          }}
        >
          <div className="flex items-center space-x-2 xs:space-x-3 mb-3 xs:mb-4">
            <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 bg-[#635BFF] rounded-lg flex items-center justify-center">
              <CreditCard className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm xs:text-base">
                Credit/Debit Card
              </h3>
              <p className="text-[#6B7280] text-xs xs:text-sm">Powered by Stripe</p>
            </div>
          </div>
          <p className="text-[#6B7280] text-xs xs:text-sm mb-3 xs:mb-4">
            Subscribe securely with your credit or debit card. All major cards
            accepted.
          </p>
          <div className="flex items-center space-x-1 xs:space-x-2 text-xs text-[#6B7280]">
            <span>Visa</span>
            <span>•</span>
            <span>Mastercard</span>
            <span>•</span>
            <span className="hidden xs:inline">American Express</span>
            <span className="xs:hidden">Amex</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
