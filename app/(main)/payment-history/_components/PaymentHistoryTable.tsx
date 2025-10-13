"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import axios from "axios";
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

interface PaymentHistoryTableProps {
  payments: Payment[];
  onRefundClick: (payment: Payment) => void;
}

export default function PaymentHistoryTable({
  payments,
  onRefundClick,
}: PaymentHistoryTableProps) {
  console.log(
    "Payment statuses:",
    payments.map((p) => ({ id: p.id, status: p.status }))
  );

  const handleCancelNow = async (paymentId: string) => {
    try {
      const response = await axios.post("/api/subscriptions/cancel-now", {
        paymentId,
      });

      if (response.data.success) {
        toast.success("Subscription cancelled immediately!");

        window.location.reload();
      } else {
        toast.error(response.data.error || "Cancellation failed");
      }
    } catch (error: unknown) {
      console.error("Cancel now error:", error);
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || "Cancellation failed");
    }
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
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

  const getStatusBadge = (status: string) => {
    const upperStatus = status.toUpperCase();
    const statusConfig = {
      SUCCEEDED: {
        variant: "default" as const,
        className: "bg-green-600 hover:bg-green-700",
      },
      PENDING: {
        variant: "secondary" as const,
        className: "bg-yellow-600 hover:bg-yellow-700",
      },
      FAILED: {
        variant: "destructive" as const,
        className: "bg-red-600 hover:bg-red-700",
      },
      REFUNDED: {
        variant: "outline" as const,
        className: "border-orange-500 text-orange-500",
      },
      CANCELLED: {
        variant: "destructive" as const,
        className: "bg-gray-600 hover:bg-gray-700",
      },
    };

    const config =
      statusConfig[upperStatus as keyof typeof statusConfig] || statusConfig.PENDING;

    return (
      <Badge
        variant={config.variant}
        className={`${config.className} text-xs px-2 py-1`}
      >
        {upperStatus}
      </Badge>
    );
  };

  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case "stripe":
        return "💳";
      default:
        return "💳";
    }
  };

  const getSubscriptionInfo = (payment: Payment) => {
    if (!payment.subscription) return null;

    const endDate = new Date(payment.subscription.currentPeriodEnd);
    const isActive = payment.subscription.active;
    const isCancelled = payment.subscription.cancelAtPeriodEnd;
    const isRefunded = payment.status.toLowerCase() === "refunded";

    let cancellationDate: Date;
    if (isRefunded && !isActive) {
      if (payment.subscription.updatedAt) {
        const updatedAt = new Date(payment.subscription.updatedAt);
        if (!isNaN(updatedAt.getTime())) {
          cancellationDate = updatedAt;
        } else {
          cancellationDate = new Date(payment.createdAt);
        }
      } else {
        cancellationDate = new Date(payment.createdAt);
      }
    } else if (!isActive) {
      cancellationDate = endDate;
    } else {
      cancellationDate = endDate;
    }

    return {
      endDate: endDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      cancellationDate: !isNaN(cancellationDate.getTime())
        ? cancellationDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "Unknown Date",
      status: isRefunded
        ? `Cancelled on ${
            !isNaN(cancellationDate.getTime())
              ? cancellationDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "Unknown Date"
          }`
        : isCancelled
        ? "Cancelling"
        : isActive
        ? "Active"
        : "Inactive",
      isCancelled,
      isRefunded,
    };
  };

  if (payments.length === 0) {
    return (
      <Card className="bg-[#2A2D3A] border-[#6B7280] p-4 sm:p-6 lg:p-8">
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="text-4xl sm:text-6xl">💳</div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white">
            No Payments Found
          </h3>
          <p className="text-sm sm:text-base text-[#6B7280] px-2">
            You haven&apos;t made any payments yet. Start by exploring our courses!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-[#2A2D3A] border-[#6B7280] overflow-hidden">
      <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-[#6B7280]">
        <h2 className="text-lg sm:text-xl font-semibold text-white">
          Payment Transactions
        </h2>
        <p className="text-[#6B7280] text-xs sm:text-sm">
          {payments.length} payment{payments.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Mobile Card Layout */}
      <div className="block sm:hidden">
        <div className="space-y-3 p-3">
          {payments.map((payment) => (
            <Card key={payment.id} className="bg-[#1C1F2A] border-[#6B7280] p-3">
              <div className="space-y-3">
                {/* Header with Provider and Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">
                      {getProviderIcon(payment.provider)}
                    </span>
                    <div>
                      <div className="text-sm font-medium text-white">
                        {payment.provider.toUpperCase()}
                      </div>
                      <div className="text-xs text-[#6B7280]">
                        ID: {payment.id.slice(0, 8)}...
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(payment.status)}
                </div>

                {/* Item Info */}
                <div>
                  <div className="text-sm text-white font-medium">
                    {payment.subscription
                      ? "Premium Subscription"
                      : payment.courseTitle || "N/A"}
                  </div>
                  {payment.courseId && (
                    <div className="text-xs text-[#6B7280]">
                      Course ID: {payment.courseId.slice(0, 8)}...
                    </div>
                  )}
                  {payment.subscription && (
                    <div className="text-xs text-[#F5B301] mt-1">
                      📅 Subscription - {getSubscriptionInfo(payment)?.status}
                      {payment.subscription.cancelAtPeriodEnd &&
                        !getSubscriptionInfo(payment)?.isRefunded && (
                          <div className="text-orange-400 mt-1">
                            ⚠️ Cancelling on{" "}
                            {new Date(
                              payment.subscription.currentPeriodEnd
                            ).toLocaleDateString()}
                          </div>
                        )}
                    </div>
                  )}
                </div>

                {/* Amount and Date */}
                <div className="flex justify-between items-center">
                  <div className="text-sm font-semibold text-white">
                    {formatAmount(payment.amount, payment.currency)}
                  </div>
                  <div className="text-xs text-[#6B7280]">
                    {formatDate(payment.createdAt)}
                  </div>
                </div>

                {/* Action Button */}
                {payment.status.toLowerCase() === "succeeded" && (
                  <div className="pt-2 border-t border-[#6B7280]">
                    <Button
                      onClick={() => onRefundClick(payment)}
                      variant="outline"
                      size="sm"
                      className="w-full border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white text-xs"
                    >
                      Refund
                    </Button>
                  </div>
                )}
                {payment.status.toLowerCase() === "refunded" &&
                  payment.subscription &&
                  payment.subscription.active && (
                    <div className="pt-2 border-t border-[#6B7280]">
                      <Button
                        onClick={() => handleCancelNow(payment.id)}
                        variant="outline"
                        size="sm"
                        className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-xs flex flex-col gap-0"
                      >
                        <span>Cancel Now</span>
                        <span className="text-xs opacity-75 -mt-1">for Demo</span>
                      </Button>
                    </div>
                  )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#1C1F2A] border-b border-[#6B7280]">
            <tr>
              <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                Payment
              </th>
              <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                Item
              </th>
              <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                Amount
              </th>
              <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                Date
              </th>
              <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#6B7280]">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-[#1C1F2A] transition-colors">
                <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2 lg:space-x-3">
                    <span className="text-xl lg:text-2xl">
                      {getProviderIcon(payment.provider)}
                    </span>
                    <div>
                      <div className="text-sm font-medium text-white">
                        {payment.provider.toUpperCase()}
                      </div>
                      <div className="text-xs text-[#6B7280]">
                        ID: {payment.id.slice(0, 8)}...
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-3 lg:px-6 py-4">
                  <div className="text-sm text-white">
                    {payment.subscription
                      ? "Premium Subscription"
                      : payment.courseTitle || "N/A"}
                  </div>
                  {payment.courseId && (
                    <div className="text-xs text-[#6B7280]">
                      Course ID: {payment.courseId.slice(0, 8)}...
                    </div>
                  )}
                  {payment.subscription && (
                    <div className="text-xs text-[#F5B301] mt-1">
                      📅 Subscription - {getSubscriptionInfo(payment)?.status}
                      {payment.subscription.cancelAtPeriodEnd &&
                        !getSubscriptionInfo(payment)?.isRefunded && (
                          <div className="text-orange-400 mt-1">
                            ⚠️ Cancelling on{" "}
                            {new Date(
                              payment.subscription.currentPeriodEnd
                            ).toLocaleDateString()}
                          </div>
                        )}
                    </div>
                  )}
                </td>
                <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">
                    {formatAmount(payment.amount, payment.currency)}
                  </div>
                </td>
                <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(payment.status)}
                </td>
                <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                  {formatDate(payment.createdAt)}
                </td>
                <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm">
                  {payment.status.toLowerCase() === "succeeded" && (
                    <Button
                      onClick={() => onRefundClick(payment)}
                      variant="outline"
                      size="sm"
                      className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white text-xs"
                    >
                      Refund
                    </Button>
                  )}
                  {payment.status.toLowerCase() === "refunded" &&
                    payment.subscription &&
                    payment.subscription.active && (
                      <div className="flex flex-col items-center space-y-1">
                        <Button
                          onClick={() => handleCancelNow(payment.id)}
                          variant="outline"
                          size="sm"
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-xs flex flex-col gap-0"
                        >
                          <span>Cancel Now</span>
                          <span className="text-xs opacity-75 -mt-1">for Demo</span>
                        </Button>
                      </div>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
