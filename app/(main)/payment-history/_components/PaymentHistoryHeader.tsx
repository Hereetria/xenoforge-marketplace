export default function PaymentHistoryHeader() {
  return (
    <div className="text-center space-y-3 sm:space-y-4 px-2">
      <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white">
        Payment
        <span className="text-[#F5B301] block">History</span>
      </h1>
      <p className="text-sm sm:text-lg lg:text-xl text-[#6B7280] max-w-3xl mx-auto leading-relaxed">
        View all your payment transactions, track refunds, and manage your billing
        history.
      </p>
    </div>
  );
}
