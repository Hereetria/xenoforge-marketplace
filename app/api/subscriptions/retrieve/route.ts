import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { getEnvVar } from "@/lib/getEnvVar";
import { getStripe } from "@/lib/stripe";
import { handleError } from "@/lib/errors/errorHandler";
import { Role } from "@/lib/constants/roles";
import { logError, logInfo } from "@/lib/logger";
import { notFoundError } from "@/lib/errors/httpErrors";
import { requireAuth } from "@/lib/auth/requireAuth";
import { requireRole } from "@/lib/auth/requireRole";

const stripe = getStripe();

export async function GET(req: NextRequest) {
    try {
        const { user } = await requireAuth();
        requireRole(user.role, [Role.USER]);

        const subscription = await prisma.subscription.findFirst({
            where: { payment: { buyerId: user.id } },
            include: { 
              payment: { 
                include: { 
                  offer: true,
                  course: true,
                } 
              } 
            },
        });

        if (!subscription) return notFoundError("No active subscription found");

        const payment = subscription.payment;
        const stripeSubId = payment?.stripeSubscriptionId;

        let stripeSubscription: Stripe.Subscription | null = null;

        if (stripeSubId) {
            stripeSubscription = await stripe.subscriptions.retrieve(stripeSubId);
        }

        const responseData = {
            id: subscription.id,
            active: subscription.active,
            currentPeriodEnd: stripeSubscription?.billing_cycle_anchor ?? null,
            cancelAtPeriodEnd: stripeSubscription?.cancel_at_period_end ?? false,
            status: stripeSubscription?.status ?? "unknown",
            plan: {
                name:
                  stripeSubscription?.items?.data?.[0]?.plan?.nickname ??
                  subscription.payment.offer?.title ??
                  subscription.payment.course?.title ??
                  "Unknown Plan",
                price:
                  stripeSubscription?.items?.data?.[0]?.plan?.amount ??
                  subscription.payment.offer?.price ??
                  subscription.payment.course?.price ??
                  0,
                interval:
                  stripeSubscription?.items?.data?.[0]?.plan?.interval ?? "month",
              },
          };
      
          logInfo("Subscription retrieved:", subscription.id);
      
          return NextResponse.json(responseData, { status: 200 });
    } catch(error) {
        const e = error as Error;
        logError("Subscription retrieve failed:", e.message);
        return handleError(error);
    }
}


