"use client";

import { useEffect, useState } from "react";
import PaymentHistoryHeader from "./PaymentHistoryHeader";
import PaymentHistoryTable from "./PaymentHistoryTable";
import RefundDialog from "./RefundDialog";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  provider: string;
  courseTitle?: string;
  courseId?: string;
  createdAt: string;
  stripePaymentIntentId?: string;
  subscription?: {
    id: string;
    currentPeriodEnd: string;
    active: boolean;
    cancelAtPeriodEnd: boolean;
    updatedAt: string;
  };
}

interface RefundDetails {
  id: string;
  amount: number;
  currency: string;
  status: string;
  reason?: string;
  createdAt: string;
  paymentIntentId: string;
}

export default function PaymentHistoryClient() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [refundDetails, setRefundDetails] = useState<RefundDetails | null>(null);
  const [showRefundDialog, setShowRefundDialog] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/payments", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch payments: ${response.status}`);
        }

        const data = await response.json();
        setPayments(data.payments || []);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handleRefundClick = async (payment: Payment) => {
    setSelectedPayment(payment);

    try {
      if (payment.stripePaymentIntentId) {
        const response = await fetch(
          `/api/payments/refund-details?paymentIntentId=${payment.stripePaymentIntentId}`,
          {
            cache: "no-store",
          }
        );

        if (response.ok) {
          const refundData = await response.json();
          setRefundDetails(refundData);
        }
      }
    } catch (error) {
      console.error("Error fetching refund details:", error);
    }

    setShowRefundDialog(true);
  };

  const handleCloseRefundDialog = () => {
    setShowRefundDialog(false);
    setSelectedPayment(null);
    setRefundDetails(null);
  };

  const handleRefundSuccess = (paymentId: string) => {
    setPayments((prevPayments) =>
      prevPayments.map((payment) =>
        payment.id === paymentId ? { ...payment, status: "refunded" } : payment
      )
    );
  };

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <PaymentHistoryHeader />
        <div className="flex justify-center items-center py-8 sm:py-12">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-[#F5B301]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <PaymentHistoryHeader />
      <PaymentHistoryTable payments={payments} onRefundClick={handleRefundClick} />

      {showRefundDialog && selectedPayment && (
        <RefundDialog
          payment={selectedPayment}
          refundDetails={refundDetails}
          onClose={handleCloseRefundDialog}
          onRefundSuccess={handleRefundSuccess}
        />
      )}
    </div>
  );
}
