"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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

export interface RefundRequest {
  provider: "stripe";
  paymentIntentId?: string;
  orderId?: string;
  amount: number;
  currency: string;
  reason?: string;
}

interface RefundDialogProps {
  payment: Payment;
  refundDetails: RefundDetails | null;
  onClose: () => void;
  onRefundSuccess: (paymentId: string) => void;
}

export default function RefundDialog({
  payment,
  refundDetails,
  onClose,
  onRefundSuccess,
}: RefundDialogProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const getRefundStatusBadge = (status: string) => {
    const statusConfig = {
      succeeded: {
        variant: "default" as const,
        className: "bg-green-600 hover:bg-green-700",
      },
      pending: {
        variant: "secondary" as const,
        className: "bg-yellow-600 hover:bg-yellow-700",
      },
      failed: {
        variant: "destructive" as const,
        className: "bg-red-600 hover:bg-red-700",
      },
      cancelled: {
        variant: "outline" as const,
        className: "border-gray-500 text-gray-500",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <Badge
        variant={config.variant}
        className={`${config.className} text-xs px-2 py-1`}
      >
        {status.toUpperCase()}
      </Badge>
    );
  };

  const handleRefund = async () => {
    try {
      console.log("Payment data for refund:", payment);

      const refundRequest: RefundRequest = {
        provider: payment.provider as "stripe",
        paymentIntentId: payment.stripePaymentIntentId || undefined,
        amount: payment.amount,
        currency: payment.currency,
        reason: "requested_by_customer",
      };

      console.log("Refund request data:", refundRequest);
      const response = await axios.post("/api/payments/refund", refundRequest);

      if (response.data.success) {
        toast.success("Refund processed successfully!");
        onRefundSuccess(payment.id);
        onClose();
      } else {
        toast.error(response.data.error || "Refund failed");
      }
    } catch (error: unknown) {
      console.error("Refund error:", error);
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || "Refund failed");
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[#2A2D3A] border-[#6B7280] text-white p-4 sm:p-6 lg:p-8 mx-2 sm:mx-4">
        <DialogHeader className="pb-4 sm:pb-6">
          <DialogTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center space-x-2">
            <span>🔄</span>
            <span>Refund Details</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Payment Information */}
          <Card className="bg-[#1C1F2A] border-[#6B7280] p-3 sm:p-4 lg:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
              Original Payment
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm">
              <div className="space-y-1">
                <span className="text-[#6B7280]">Payment ID:</span>
                <div className="text-white font-mono">{payment.id}</div>
              </div>
              <div className="space-y-1">
                <span className="text-[#6B7280]">Amount:</span>
                <div className="text-white font-semibold">
                  {formatAmount(payment.amount, payment.currency)}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[#6B7280]">Item:</span>
                <div className="text-white">
                  {payment.subscription
                    ? "Premium Subscription"
                    : payment.courseTitle || "N/A"}
                </div>
                {payment.subscription && (
                  <div className="text-xs text-[#F5B301] mt-1">
                    📅 Subscription -{" "}
                    {payment.subscription.active ? "Active" : "Inactive"}
                    {payment.subscription.cancelAtPeriodEnd && " (Cancelling)"}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <span className="text-[#6B7280]">Date:</span>
                <div className="text-white">{formatDate(payment.createdAt)}</div>
              </div>
            </div>
          </Card>

          {/* Refund Status */}
          {refundDetails ? (
            <Card className="bg-[#1C1F2A] border-[#6B7280] p-3 sm:p-4 lg:p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">✓</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-white">
                    Refund Processed
                  </h3>
                  <p className="text-[#6B7280] text-sm">
                    Your refund has been successfully processed
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {getRefundStatusBadge(refundDetails.status)}
                </div>
              </div>

              <div className="bg-[#2A2D3A] rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[#6B7280] text-sm">Refund Amount</span>
                  <span className="text-white font-semibold text-lg">
                    {formatAmount(refundDetails.amount, refundDetails.currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6B7280] text-sm">Processed On</span>
                  <span className="text-white text-sm">
                    {formatDate(refundDetails.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6B7280] text-sm">Refund ID</span>
                  <span className="text-white font-mono text-xs bg-[#1C1F2A] px-2 py-1 rounded">
                    {refundDetails.id.slice(-8)}
                  </span>
                </div>
                {refundDetails.reason && (
                  <div className="pt-2 border-t border-[#6B7280]">
                    <span className="text-[#6B7280] text-sm block mb-1">Reason</span>
                    <span className="text-white text-sm capitalize">
                      {refundDetails.reason.replace(/_/g, " ")}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card className="bg-[#1C1F2A] border-[#6B7280] p-3 sm:p-4 lg:p-6">
              <div className="text-center py-6 sm:py-8 lg:py-10">
                <div className="w-16 h-16 bg-[#2A2D3A] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💳</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  No Refund Yet
                </h3>
                <p className="text-[#6B7280] text-sm sm:text-base mb-4">
                  This payment hasn&apos;t been refunded yet.
                </p>
                <div className="bg-[#2A2D3A] rounded-lg p-3 text-xs text-[#6B7280]">
                  💡 You can request a refund using the button below
                </div>
              </div>
            </Card>
          )}

          {/* Subscription Cancellation Info */}
          {payment.subscription && payment.subscription.cancelAtPeriodEnd && (
            <Card className="bg-[#1C1F2A] border-orange-500 p-3 sm:p-4 lg:p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">⚠️</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-orange-400">
                    Subscription Cancellation
                  </h3>
                  <p className="text-[#6B7280] text-sm">
                    Your subscription will be cancelled at the end of the current
                    billing period
                  </p>
                </div>
              </div>

              <div className="bg-[#2A2D3A] rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#6B7280] text-sm">Cancellation Date</span>
                  <span className="text-orange-400 font-semibold">
                    {formatDate(payment.subscription.currentPeriodEnd)}
                  </span>
                </div>
                <div className="mt-2 text-xs text-[#6B7280]">
                  You will retain access to premium features until this date
                </div>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 sm:pt-6 border-t border-[#6B7280]">
            <Button
              onClick={onClose}
              variant="outline"
              className="border-[#6B7280] text-[#6B7280] hover:bg-[#6B7280] hover:text-white text-sm sm:text-base w-full sm:w-auto"
            >
              Close
            </Button>
            {!refundDetails && (
              <Button
                onClick={handleRefund}
                className="bg-orange-600 hover:bg-orange-700 text-white text-sm sm:text-base w-full sm:w-auto"
              >
                Request Refund
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
