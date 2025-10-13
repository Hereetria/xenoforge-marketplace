import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { getEnvVar } from "@/lib/getEnvVar";
import { getStripe } from "@/lib/stripe";
import { handleError } from "@/lib/errors/errorHandler";
import { Role } from "@/lib/constants/roles";
import { logError, logInfo } from "@/lib/logger";
import { badRequestError, notFoundError } from "@/lib/errors/httpErrors";
import { requireAuth } from "@/lib/auth/requireAuth";
import { requireRole } from "@/lib/auth/requireRole";

const stripe = getStripe();

export async function POST(req: NextRequest) {
    try {
        const { user } = await requireAuth();
        requireRole(user.role, [Role.USER]);

        const { subscriptionId } = await req.json();
        if (!subscriptionId) return badRequestError("Missing subscriptionId");

        const subscription = await prisma.subscription.findUnique({
            where: { id: subscriptionId },
            include: { payment: true }
        });

        if (!subscription) return notFoundError("Subscription not found");

        const payment = subscription.payment;
        const stripeSubId = payment.stripeSubscriptionId;
        if (!stripeSubId) return notFoundError("Stripe subscription ID not found");

        await stripe.subscriptions.update(stripeSubId, {
            cancel_at_period_end: true,
          })

          await prisma.subscription.update({
            where: { id: subscription.id },
            data: { cancelAtPeriodEnd: true },
          });
          
        logInfo("Subscription cancelled:", subscription.id);

        return NextResponse.json({
            message: "Subscription will end at the current period end.",
        }, { status: 200 });
    } catch(error) {
        const e = error as Error;
        logError("Subscription cancel failed:", e.message);
        return handleError(error);
    }
}