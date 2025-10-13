import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2, Shield, CheckCircle } from "lucide-react";

interface StripeSubscriptionFormProps {
  isProcessing: boolean;
  onBack: () => void;
  onSubscription: () => void;
}

export default function StripeSubscriptionForm({
  isProcessing,
  onBack,
  onSubscription,
}: StripeSubscriptionFormProps) {
  return (
    <Card className="bg-[#2A2D3A] border-[#6B7280] p-6 sticky top-17 sm:top-17 lg:top-17 transition-all duration-500 ease-in-out hover:shadow-xl hover:shadow-[#F5B301]/10 transform hover:scale-[1.01]">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-[#635BFF] rounded-lg flex items-center justify-center">
          <CreditCard className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Subscribe with Stripe</h2>
          <p className="text-[#6B7280] text-sm">
            Secure subscription processing by Stripe
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Subscription Details */}
        <div className="bg-[#1C1F2A] rounded-lg p-4 border border-[#4B5563]">
          <h3 className="font-semibold text-white mb-3 flex items-center">
            <Shield className="h-4 w-4 mr-2 text-[#F5B301]" />
            Subscription Details
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[#9CA3AF] text-sm">Plan</span>
              <span className="text-white text-sm font-medium">Premium Monthly</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#9CA3AF] text-sm">Price</span>
              <div className="text-right">
                <span className="text-white text-sm font-medium">$29.00</span>
                <span className="text-[#9CA3AF] text-xs ml-2 line-through">
                  $99.00
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#9CA3AF] text-sm">Billing</span>
              <span className="text-white text-sm font-medium">Monthly</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#9CA3AF] text-sm">Next billing date</span>
              <span className="text-white text-sm font-medium">
                {new Date(
                  Date.now() + 30 * 24 * 60 * 60 * 1000
                ).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* What happens next */}
        <div className="bg-[#1C1F2A] rounded-lg p-4 border border-[#4B5563]">
          <h3 className="font-semibold text-white mb-3 flex items-center">
            <Shield className="h-4 w-4 mr-2 text-[#F5B301]" />
            What happens next?
          </h3>
          <ul className="text-sm text-[#9CA3AF] space-y-2">
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
              You&apos;ll be redirected to Stripe&apos;s secure checkout page
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
              Enter your payment details on Stripe&apos;s platform
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
              Complete your subscription securely
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
              Get instant access to premium features
            </li>
          </ul>
        </div>

        {/* Security Features */}
        <div className="bg-[#1C1F2A] rounded-lg p-4 border border-[#4B5563]">
          <h3 className="font-semibold text-white mb-3 flex items-center">
            <Shield className="h-4 w-4 mr-2 text-[#F5B301]" />
            Security Features
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#9CA3AF]">
            <div className="flex items-center">
              <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
              PCI DSS Compliant
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
              256-bit SSL Encryption
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
              Fraud Protection
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
              No Card Data Stored
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col xs:flex-row gap-2 xs:gap-4 pt-4">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex-1 border-[#6B7280] text-[#6B7280] hover:border-[#F5B301] hover:text-[#F5B301] hover:border-2 transition-all duration-100 ease-out text-sm xs:text-base px-2 xs:px-4"
            disabled={isProcessing}
          >
            <span className="text-sm font-medium">Back</span>
          </Button>
          <Button
            onClick={onSubscription}
            disabled={isProcessing}
            className="flex-1 bg-[#635BFF] text-white hover:bg-[#5A52E5] disabled:opacity-50 transition-all duration-100 ease-out text-sm xs:text-base px-2 xs:px-4"
          >
            {isProcessing ? (
              <div className="flex items-center space-x-1 xs:space-x-2">
                <div className="w-3 h-3 xs:w-4 xs:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs xs:text-sm">Redirecting...</span>
              </div>
            ) : (
              <>
                <CreditCard className="h-3 w-3 xs:h-4 xs:w-4 mr-1 xs:mr-2" />
                <span className="hidden xs:inline">Subscribe with Stripe</span>
                <span className="xs:hidden">Stripe</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
