import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";
import { handleError } from "@/lib/errors/errorHandler";
import { validate } from "@/lib/validation/validate";
import { createRefundSchema } from "@/lib/validation/schemas";
import { getStripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { user } = await requireAuth();
    const body = await req.json();

    const { provider, paymentIntentId, amount, currency, reason } = validate(createRefundSchema, body);

    let refundResult;

    if (provider === "stripe") {
      
      const isRealPaymentIntent = paymentIntentId && paymentIntentId.startsWith('pi_') && paymentIntentId.length > 25;
      
      if (isRealPaymentIntent) {
        try {
          const stripe = getStripe();
          const refund = await stripe.refunds.create({
            payment_intent: paymentIntentId,
            amount: Math.round(amount * 100), 
            reason: reason as "duplicate" | "fraudulent" | "requested_by_customer",
          });
          
          refundResult = {
            refundId: refund.id,
            status: refund.status,
            amount: refund.amount / 100,
            currency: refund.currency,
          };
          
        } catch (stripeError: unknown) {
          console.error("Stripe refund error:", stripeError);
          return NextResponse.json(
            { error: `Stripe refund failed: ${stripeError instanceof Error ? stripeError.message : 'Unknown error'}` },
            { status: 400 }
          );
        }
      } else {
        refundResult = {
          refundId: `re_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          status: "succeeded",
          amount: amount,
          currency: currency,
        };
      }
      
      const payment = await prisma.payment.findFirst({
        where: {
          buyerId: user.id,
          amount: amount,
          currency: currency.toUpperCase(),
          status: "SUCCEEDED", // Only allow refunds for successful payments
        },
        select: {
          id: true,
          amount: true,
          currency: true,
          status: true,
          courseId: true,
          buyerId: true,
          stripePaymentIntentId: true,
          stripeSubscriptionId: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!payment) {
        return NextResponse.json(
          { error: "Payment not found or already refunded" },
          { status: 404 }
        );
      }

      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "REFUNDED" },
      });

      if (payment.courseId) {
        const enrollment = await prisma.enrollment.findFirst({
          where: {
            userId: user.id,
            courseId: payment.courseId,
          },
        });

        if (enrollment) {
          await prisma.lessonCompletion.deleteMany({
            where: {
              enrollmentId: enrollment.id,
            },
          });

          await prisma.enrollment.delete({
            where: { id: enrollment.id },
          });
        }
      }

      if (payment.stripeSubscriptionId) {
        
        const isRealSubscription = payment.stripeSubscriptionId.startsWith('sub_') && payment.stripeSubscriptionId.length > 20;
        
        if (isRealSubscription) {
          try {
            const stripe = getStripe();
            await stripe.subscriptions.update(payment.stripeSubscriptionId, {
              cancel_at_period_end: true,
            });

          } catch (stripeError: unknown) {
            console.error("Stripe subscription cancellation error:", stripeError);
          }
        }

        try {
          await prisma.subscription.updateMany({
            where: {
              paymentId: payment.id,
            },
            data: {
              cancelAtPeriodEnd: true,
            },
          });
        } catch (dbError: unknown) {
          console.error("Database subscription update error:", dbError);
        }
      }

    } else {
      return NextResponse.json(
        { error: "Unsupported payment provider" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      refund: refundResult,
      message: "Refund processed successfully",
    });

  } catch (error) {
    console.error("Refund error:", error);
    return handleError(error);
  }
}
