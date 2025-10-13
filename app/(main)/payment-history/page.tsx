import PaymentHistoryClient from "./_components/PaymentHistoryClient";

export default function PaymentHistoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C1F2A] to-[#2A2D3A]">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-3 sm:py-6 lg:py-8">
        <PaymentHistoryClient />
      </div>
    </div>
  );
}
