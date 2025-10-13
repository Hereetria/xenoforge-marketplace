interface PremiumCheckoutProgressProps {
  currentStep: number;
}

export default function PremiumCheckoutProgress({
  currentStep,
}: PremiumCheckoutProgressProps) {
  const steps = [
    {
      number: 1,
      title: "Payment Method",
      description: "Choose your payment provider",
    },
    { number: 2, title: "Complete Payment", description: "Subscribe to premium" },
  ];

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-bold transition-all duration-200 ${
                  currentStep >= step.number
                    ? "bg-[#F5B301] text-[#1C1F2A]"
                    : "bg-[#2A2D3A] text-[#6B7280] border border-[#6B7280]/30"
                }`}
              >
                {step.number}
              </div>
              <div className="mt-2 text-center">
                <div
                  className={`text-xs sm:text-sm font-medium ${
                    currentStep >= step.number ? "text-white" : "text-[#6B7280]"
                  }`}
                >
                  {step.title}
                </div>
                <div className="text-xs text-[#6B7280] mt-1 hidden sm:block">
                  {step.description}
                </div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 transition-all duration-200 ${
                  currentStep > step.number ? "bg-[#F5B301]" : "bg-[#6B7280]/30"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
