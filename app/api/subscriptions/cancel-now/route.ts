import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";
import { handleError } from "@/lib/errors/errorHandler";
import { getStripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { user } = await requireAuth();
    const body = await req.json();
    
    const { paymentId } = body;
    
    if (!paymentId) {
      return NextResponse.json(
        { error: "Payment ID is required" },
        { status: 400 }
      );
    }

    // Find the payment and subscription
    const payment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        buyerId: user.id,
        status: "REFUNDED", // Only allow for refunded payments
        stripeSubscriptionId: { not: null },
      },
      select: {
        id: true,
        stripeSubscriptionId: true,
        subscription: {
          select: {
            id: true,
            active: true,
            cancelAtPeriodEnd: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Refunded subscription not found" },
        { status: 404 }
      );
    }

    if (!payment.subscription) {
      return NextResponse.json(
        { error: "No subscription found for this payment" },
        { status: 404 }
      );
    }

    if (!payment.subscription.active) {
      return NextResponse.json(
        { error: "Subscription is already inactive" },
        { status: 400 }
      );
    }

    // Cancel subscription immediately in Stripe
    if (payment.stripeSubscriptionId) {
      const isRealSubscription = payment.stripeSubscriptionId.startsWith('sub_') && payment.stripeSubscriptionId.length > 20;
      
      if (isRealSubscription) {
        try {
          const stripe = getStripe();
          await stripe.subscriptions.cancel(payment.stripeSubscriptionId);
          console.log("Stripe subscription cancelled immediately:", payment.stripeSubscriptionId);
        } catch (stripeError: any) {
          console.error("Stripe cancellation error:", stripeError);
          // Continue with database update even if Stripe fails
        }
      } else {
        console.log("Simulated instant cancellation for test subscription");
      }
    }

    // Update subscription in database to inactive
    await prisma.subscription.update({
      where: { id: payment.subscription.id },
      data: {
        active: false,
        cancelAtPeriodEnd: false, // Since we're cancelling immediately
      },
    });

    console.log("Subscription cancelled immediately in database");

    return NextResponse.json({
      success: true,
      message: "Subscription cancelled immediately",
    });

  } catch (error) {
    console.error("Instant cancellation error:", error);
    return handleError(error);
  }
}
