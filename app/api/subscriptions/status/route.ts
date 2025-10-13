import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";
import { handleError } from "@/lib/errors/errorHandler";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const { user } = await requireAuth();

    // Check if user has an active subscription
    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        payment: {
          buyerId: user.id,
        },
        active: true,
        currentPeriodEnd: {
          gt: new Date(), // Subscription hasn't expired
        },
      },
      include: {
        payment: {
          select: {
            provider: true,
            amount: true,
            currency: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!activeSubscription) {
      return NextResponse.json({
        hasActiveSubscription: false,
        subscription: null,
      });
    }

    return NextResponse.json({
      hasActiveSubscription: true,
      subscription: {
        id: activeSubscription.id,
        currentPeriodStart: activeSubscription.currentPeriodStart,
        currentPeriodEnd: activeSubscription.currentPeriodEnd,
        cancelAtPeriodEnd: activeSubscription.cancelAtPeriodEnd,
        provider: activeSubscription.payment.provider,
        amount: activeSubscription.payment.amount,
        currency: activeSubscription.payment.currency,
        createdAt: activeSubscription.payment.createdAt,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
