"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  X,
} from "lucide-react";

interface PremiumDialogProps {
  children: React.ReactNode;
}

export default function PremiumDialog({ children }: PremiumDialogProps) {
  const [open, setOpen] = useState(false);

  const premiumFeatures = [
    {
      icon: <Crown className="h-5 w-5 text-[#F5B301]" />,
      title: "Access to All Courses",
      description: "Unlimited access to our entire course library",
      highlight: true,
    },
    {
      icon: <Star className="h-5 w-5 text-[#F5B301]" />,
      title: "Premium Content",
      description: "Exclusive courses and advanced materials",
      highlight: true,
    },
    {
      icon: <Zap className="h-5 w-5 text-[#F5B301]" />,
      title: "Priority Support",
      description: "24/7 priority customer support",
      highlight: false,
    },
    {
      icon: <Users className="h-5 w-5 text-[#F5B301]" />,
      title: "Community Access",
      description: "Join exclusive premium community forums",
      highlight: false,
    },
    {
      icon: <BookOpen className="h-5 w-5 text-[#F5B301]" />,
      title: "Offline Downloads",
      description: "Download courses for offline learning",
      highlight: false,
    },
    {
      icon: <Award className="h-5 w-5 text-[#F5B301]" />,
      title: "Certificates",
      description: "Get verified certificates for all courses",
      highlight: false,
    },
    {
      icon: <Shield className="h-5 w-5 text-[#F5B301]" />,
      title: "Ad-Free Experience",
      description: "Learn without any interruptions",
      highlight: false,
    },
    {
      icon: <Clock className="h-5 w-5 text-[#F5B301]" />,
      title: "Early Access",
      description: "Get early access to new courses and features",
      highlight: false,
    },
  ];

  const handleSubscribe = () => {
    window.location.href = "/premium-checkout";
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl bg-[#1C1F2A] border-2 border-[#F5B301]/30 shadow-2xl text-white p-0 mx-2 sm:mx-4">
        <div className="relative">
          {/* Close Button */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 z-10 text-[#6B7280] hover:text-white transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Header */}
          <div className="bg-gradient-to-r from-[#F5B301] to-[#FFD700] p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-[#1C1F2A] p-4 rounded-full">
                <Crown className="h-12 w-12 text-[#F5B301]" />
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1C1F2A] mb-2">
              Upgrade to Premium
            </h2>
            <p className="text-lg text-[#1C1F2A]/80 max-w-2xl mx-auto">
              Unlock unlimited access to all courses and premium features
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {/* Pricing Section */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-5xl sm:text-6xl font-bold text-white">
                  $29
                </span>
                <div className="text-left">
                  <div className="text-[#6B7280] line-through text-xl">$99</div>
                  <div className="text-[#F5B301] font-bold text-sm">70% OFF</div>
                </div>
              </div>
              <p className="text-[#6B7280] text-sm">per month • Cancel anytime</p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {premiumFeatures.map((feature, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-4 rounded-lg transition-all duration-200 ${
                    feature.highlight
                      ? "bg-[#F5B301]/10 border border-[#F5B301]/30"
                      : "bg-[#2A2D3A] border border-[#6B7280]/20"
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">{feature.icon}</div>
                  <div>
                    <h3 className="font-semibold text-white text-sm sm:text-base mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-[#6B7280] text-xs sm:text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Benefits Summary */}
            <Card className="bg-[#2A2D3A] border-[#6B7280] mb-8">
              <CardHeader className="pb-4">
                <CardTitle className="text-white text-center text-lg">
                  Why Choose Premium?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="space-y-2">
                    <div className="bg-[#F5B301]/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                      <CheckCircle className="h-6 w-6 text-[#F5B301]" />
                    </div>
                    <h4 className="font-semibold text-white">Unlimited Access</h4>
                    <p className="text-[#6B7280] text-sm">All courses included</p>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-[#F5B301]/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                      <Zap className="h-6 w-6 text-[#F5B301]" />
                    </div>
                    <h4 className="font-semibold text-white">Best Value</h4>
                    <p className="text-[#6B7280] text-sm">
                      70% savings vs individual courses
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-[#F5B301]/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                      <Shield className="h-6 w-6 text-[#F5B301]" />
                    </div>
                    <h4 className="font-semibold text-white">Risk-Free</h4>
                    <p className="text-[#6B7280] text-sm">Cancel anytime</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => setOpen(false)}
                variant="outline"
                className="flex-1 border-[#6B7280] text-[#6B7280] hover:bg-[#6B7280] hover:text-white transition-colors duration-200 text-lg py-3 cursor-pointer"
                size="lg"
              >
                Maybe Later
              </Button>
              <Button
                onClick={handleSubscribe}
                className="flex-1 bg-[#F5B301] text-[#1C1F2A] hover:bg-[#FFF9E6] transition-colors duration-200 text-lg py-3 font-bold cursor-pointer"
                size="lg"
              >
                <Crown className="h-5 w-5 mr-2" />
                Subscribe to Premium
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-6 text-center">
              <p className="text-[#6B7280] text-sm">
                🔒 Secure payment • 💳 All major cards accepted • 🎯 30-day
                money-back guarantee
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
