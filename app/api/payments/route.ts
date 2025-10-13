import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";
import { handleError } from "@/lib/errors/errorHandler";
import prisma from "@/lib/prisma";
import { PaymentWithDetails } from "@/types/api";

export async function GET(req: NextRequest) {
  try {
    const { user } = await requireAuth();

    const payments = await prisma.payment.findMany({
      where: {
        buyerId: user.id,
      },
      select: {
        id: true,
        amount: true,
        currency: true,
        status: true,
        provider: true,
        courseId: true,
        buyerId: true,
        createdAt: true,
        updatedAt: true,
        stripePaymentIntentId: true,
        stripeSubscriptionId: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const paymentsWithDetails = await Promise.all(
      payments.map(async (payment) => {
        let course = null;
        let subscription = null;
        
        if (payment.courseId) {
          try {
            course = await prisma.course.findUnique({
              where: { id: payment.courseId },
              select: {
                id: true,
                title: true,
              },
            });
          } catch (courseError) {
            console.error("Error fetching course:", courseError);
          }
        }
        
        if (payment.stripeSubscriptionId) {
          try {
            subscription = await prisma.subscription.findFirst({
              where: { 
                payment: { 
                  stripeSubscriptionId: payment.stripeSubscriptionId 
                } 
              },
              select: {
                id: true,
                currentPeriodEnd: true,
                active: true,
                cancelAtPeriodEnd: true,
                updatedAt: true,
              },
            });
          } catch (subscriptionError) {
            console.error("Error fetching subscription:", subscriptionError);
          }
        }
        
        return { ...payment, course, subscription };
      })
    );

    // Transform payments for frontend
    const transformedPayments = paymentsWithDetails.map((payment) => ({
      id: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status.toLowerCase(),
      provider: payment.provider.toLowerCase(),
      courseTitle: payment.course?.title || null,
      courseId: payment.course?.id || payment.courseId || null,
      createdAt: payment.createdAt.toISOString(),
      stripePaymentIntentId: payment.stripePaymentIntentId || null,
      subscription: payment.subscription ? {
        id: payment.subscription.id,
        currentPeriodEnd: payment.subscription.currentPeriodEnd.toISOString(),
        active: payment.subscription.active,
        cancelAtPeriodEnd: payment.subscription.cancelAtPeriodEnd,
      } : null,
    }));

    return NextResponse.json({
      payments: transformedPayments,
    });
  } catch (error) {
    console.error("Payments API error:", error);
    console.error("Error details:", {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    return handleError(error);
  }
}