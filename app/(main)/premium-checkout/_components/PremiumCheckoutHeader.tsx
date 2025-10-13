import { Crown } from "lucide-react";

interface PremiumCheckoutHeaderProps {
  onBack: () => void;
}

export default function PremiumCheckoutHeader({
  onBack,
}: PremiumCheckoutHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6 sm:mb-8">
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onBack}
          className="text-[#6B7280] hover:text-white transition-colors duration-200 p-2 -ml-2"
        >
          <span className="text-sm font-medium">Back</span>
        </button>
        <div className="h-6 w-px bg-[#6B7280]/30" />
        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-[#F5B301]" />
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Premium Subscription
          </h1>
        </div>
      </div>
    </div>
  );
}
