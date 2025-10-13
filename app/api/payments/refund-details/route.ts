import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";
import { handleError } from "@/lib/errors/errorHandler";
import { getStripe } from "@/lib/stripe";

export async function GET(req: NextRequest) {
  try {
    const { user } = await requireAuth();
    const { searchParams } = new URL(req.url);
    const paymentIntentId = searchParams.get("paymentIntentId");

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "Payment Intent ID is required" },
        { status: 400 }
      );
    }

    const stripe = getStripe();

    try {
      // Retrieve the payment intent
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      // Check if the payment intent belongs to the user
      if (paymentIntent.metadata?.buyerId !== user.id) {
        return NextResponse.json(
          { error: "Unauthorized access to payment intent" },
          { status: 403 }
        );
      }

      // Get refunds for this payment intent
      const refunds = await stripe.refunds.list({
        payment_intent: paymentIntentId,
        limit: 1, // Get the most recent refund
      });

      if (refunds.data.length === 0) {
        return NextResponse.json({
          refundDetails: null,
          message: "No refunds found for this payment",
        });
      }

      const refund = refunds.data[0];

      return NextResponse.json({
        id: refund.id,
        amount: refund.amount / 100, // Convert from cents
        currency: refund.currency,
        status: refund.status,
        reason: refund.reason,
        createdAt: new Date(refund.created * 1000).toISOString(),
        paymentIntentId: refund.payment_intent as string,
      });
    } catch (stripeError: any) {
      console.error("Stripe error:", stripeError);
      return NextResponse.json(
        { error: "Failed to retrieve refund details from Stripe" },
        { status: 500 }
      );
    }
  } catch (error) {
    return handleError(error);
  }
}

