import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Crown,
  Star,
  Zap,
  Users,
  BookOpen,
  Award,
  Shield,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";

export default function PremiumOrderSummary() {
  const [demoOpen, setDemoOpen] = useState(false);

  const premiumFeatures = [
    {
      icon: <Crown className="h-4 w-4 text-[#F5B301]" />,
      title: "Access to All Courses",
      highlight: true,
    },
    {
      icon: <Star className="h-4 w-4 text-[#F5B301]" />,
      title: "Premium Content",
      highlight: true,
    },
    {
      icon: <Zap className="h-4 w-4 text-[#F5B301]" />,
      title: "Priority Support",
      highlight: false,
    },
    {
      icon: <Users className="h-4 w-4 text-[#F5B301]" />,
      title: "Community Access",
      highlight: false,
    },
    {
      icon: <BookOpen className="h-4 w-4 text-[#F5B301]" />,
      title: "Offline Downloads",
      highlight: false,
    },
    {
      icon: <Award className="h-4 w-4 text-[#F5B301]" />,
      title: "Certificates",
      highlight: false,
    },
    {
      icon: <Shield className="h-4 w-4 text-[#F5B301]" />,
      title: "Ad-Free Experience",
      highlight: false,
    },
    {
      icon: <Clock className="h-4 w-4 text-[#F5B301]" />,
      title: "Early Access",
      highlight: false,
    },
  ];

  return (
    <div className="lg:col-span-1 order-1">
      <Card className="bg-[#2A2D3A] border-[#6B7280] p-2 xs:p-3 sm:p-4 lg:p-6 sticky top-17 sm:top-17 lg:top-17 transition-all duration-500 ease-in-out transform hover:scale-[1.02] hover:shadow-xl hover:shadow-[#F5B301]/10">
        <CardHeader className="pb-3 xs:pb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 xs:h-6 xs:w-6 text-[#F5B301]" />
              <CardTitle className="text-lg xs:text-xl font-bold text-white">
                <span className="hidden xs:inline">Premium Plan</span>
                <span className="xs:hidden">Premium</span>
              </CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs text-[#F5B301] border-[#F5B301]/40 hover:text-black hover:bg-[#F5B301]"
              onClick={() => setDemoOpen(true)}
            >
              Demo Cards
            </Button>
          </div>
          <p className="text-[#6B7280] text-xs xs:text-sm">
            Unlock unlimited access to all courses and premium features
          </p>
        </CardHeader>

        <CardContent className="space-y-4 xs:space-y-6">
          {/* Pricing */}
          <div className="text-center p-3 xs:p-4 bg-[#1C1F2A] rounded-lg border border-[#6B7280]/30">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-3xl xs:text-4xl font-bold text-white">$29</span>
              <div className="text-left">
                <div className="text-[#6B7280] line-through text-base xs:text-lg">
                  $99
                </div>
                <div className="text-[#F5B301] font-bold text-xs xs:text-sm">
                  70% OFF
                </div>
              </div>
            </div>
            <p className="text-[#6B7280] text-xs xs:text-sm">
              per month • Cancel anytime
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-2 xs:space-y-3">
            <h3 className="text-white font-semibold text-xs xs:text-sm mb-2 xs:mb-3">
              What&apos;s included:
            </h3>
            {premiumFeatures.map((feature, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 xs:gap-3 p-2 rounded-lg transition-all duration-200 ${
                  feature.highlight
                    ? "bg-[#F5B301]/10 border border-[#F5B301]/30"
                    : "bg-[#1C1F2A] border border-[#6B7280]/20"
                }`}
              >
                <div className="flex-shrink-0 h-3 w-3 xs:h-4 xs:w-4">
                  {feature.icon}
                </div>
                <span className="text-white text-xs xs:text-sm font-medium">
                  {feature.title}
                </span>
              </div>
            ))}
          </div>

          {/* Benefits Summary */}
          <div className="space-y-3 pt-4 border-t border-[#6B7280]/30">
            <div className="flex items-center gap-3">
              <div className="bg-[#F5B301]/20 rounded-full w-8 h-8 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-[#F5B301]" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">
                  Unlimited Access
                </div>
                <div className="text-[#6B7280] text-xs">All courses included</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-[#F5B301]/20 rounded-full w-8 h-8 flex items-center justify-center">
                <Zap className="h-4 w-4 text-[#F5B301]" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">Best Value</div>
                <div className="text-[#6B7280] text-xs">
                  70% savings vs individual courses
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-[#F5B301]/20 rounded-full w-8 h-8 flex items-center justify-center">
                <Shield className="h-4 w-4 text-[#F5B301]" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">Risk-Free</div>
                <div className="text-[#6B7280] text-xs">Cancel anytime</div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="pt-4 border-t border-[#6B7280]/30 text-center">
            <p className="text-[#6B7280] text-xs">
              🔒 Secure payment • 💳 All major cards accepted • 🎯 30-day money-back
              guarantee
            </p>
          </div>
        </CardContent>

        {/* Demo Cards Dialog */}
        {demoOpen && (
          <div className="absolute inset-0 z-20">
            {/* Card-scoped backdrop */}
            <div
              className="absolute inset-0 bg-black/40 rounded-lg"
              onClick={() => setDemoOpen(false)}
            />
            {/* Centered container within the card */}
            <div
              className="relative w-full h-full p-2 sm:p-3 flex items-center"
              onClick={() => setDemoOpen(false)}
            >
              <div
                className="w-full bg-[#1C1F2A] text-white border border-[#2E3448] rounded-lg shadow-xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-semibold">Stripe Test Cards</h3>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="h-6 w-6 p-0 leading-none text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-150"
                      onClick={() => setDemoOpen(false)}
                      aria-label="Close"
                      title="Close"
                    >
                      ×
                    </Button>
                  </div>
                  <p className="text-gray-300 text-xs mb-3">
                    Only the card number matters in demo. Use any future expiry, any
                    CVC, any ZIP.
                  </p>
                  <ul className="space-y-2 list-disc pl-5 text-sm">
                    <li>
                      <span className="font-semibold">Success:</span> 4242 4242 4242
                      4242 — Standard successful payment
                    </li>
                    <li>
                      <span className="font-semibold">3D Secure:</span> 4000 0025
                      0000 3155 — SCA challenge required (approve in modal)
                    </li>
                    <li>
                      <span className="font-semibold">Insufficient funds:</span> 4000
                      0000 0000 9995 — Fails with insufficient_funds
                    </li>
                    <li>
                      <span className="font-semibold">Declined:</span> 4000 0000 0000
                      0341 — Generic card_declined
                    </li>
                    <li>
                      <span className="font-semibold">Expired card:</span> 4000 0000
                      0000 0069 — Expired card
                    </li>
                    <li>
                      <span className="font-semibold">Incorrect CVC:</span> 4000 0000
                      0000 0127 — Incorrect CVC
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
