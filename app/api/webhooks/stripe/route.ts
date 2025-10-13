import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { handleError } from "@/lib/errors/errorHandler";
import { getEnvVar } from "@/lib/getEnvVar";
import { getStripe } from "@/lib/stripe";
import { logError, logInfo } from "@/lib/logger";
import { badRequestError } from "@/lib/errors/httpErrors";
import { PaymentProvider, PaymentStatus } from "@prisma/client";

const stripe = getStripe();


export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  logInfo("Stripe webhook request", { hasSignature: Boolean(sig) });
  if (!sig) return badRequestError("Missing Stripe signature header");

  let event: Stripe.Event;

  try {
    const webhookSecret = getEnvVar("STRIPE_WEBHOOK_SECRET");

    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

    logInfo("Stripe event received", event.type);
  } catch (err) {
    const e = err as Error;
    logError(e, "StripeWebhook signature verification failed");
    return badRequestError("Invalid signature");
  }

  try {
    await prisma.webhookLog.create({
      data: {
        provider: "stripe",
        event: event.type,
        payload: JSON.parse(JSON.stringify(event.data.object)),
      },
    });

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case "customer.created": {
        const customer = event.data.object as Stripe.Customer;
        await handleCustomerCreated(customer);
        break;
      }

      default: {
        logInfo("Unhandled event type:", event.type);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    const e = error as Error;
    logError("Webhook handling failed:", e.message);
    return handleError(error);
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {

    const { courseIds, buyerId, type } = session.metadata || {};
    if (!buyerId) {
      logError("Missing buyerId in checkout session:", session.id);
      return;
    }

    
    if (session.mode === "subscription" && type === "subscription") {
      
      if (!session.subscription) {
        logError("No subscription found in subscription checkout session:", session.id);
        return;
      }

      try {
        const existingPayment = await prisma.payment.findFirst({
          where: {
            stripeSubscriptionId: session.subscription as string,
            buyerId,
          },
        });

        if (!existingPayment) {
          
          
          const paymentRecord = await prisma.payment.create({
            data: {
              provider: PaymentProvider.STRIPE,
              status: PaymentStatus.SUCCEEDED,
              amount: 29, 
              currency: (session.currency || "usd").toUpperCase(),
              courseId: null, 
              buyerId,
              stripeSubscriptionId: session.subscription as string,
            },
          });

          await prisma.subscription.create({
            data: {
              paymentId: paymentRecord.id,
              currentPeriodStart: new Date(), 
              currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 
              active: true,
              cancelAtPeriodEnd: false,
            },
          });
        }

      } catch (subscriptionProcessingError) {
        console.error("Error processing subscription checkout:", subscriptionProcessingError);
        logError(subscriptionProcessingError as Error, "Subscription checkout processing failed");
        return;
      }
      return;
    }
    
    if (!courseIds) {
      console.error("❌ Missing courseIds in course checkout session:", session.id);
      logError("Missing courseIds in course checkout session:", session.id);
      return;
    }

    const courseIdArray = JSON.parse(courseIds) as string[];

    const paymentIntentId = session.payment_intent as string;

    
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

    
    const courses = await prisma.course.findMany({
      where: { id: { in: courseIdArray } },
      select: { id: true, title: true, price: true }
    });


    if (courses.length !== courseIdArray.length) {
      console.error("❌ Some courses not found. Expected:", courseIdArray, "Found:", courses.map(c => c.id));
      const missingCourses = courseIdArray.filter(id => !courses.find(c => c.id === id));
      console.error("Missing course IDs:", missingCourses);
    }

    const payments: { id: string }[] = [];
    for (let i = 0; i < courseIdArray.length; i++) {
      const courseId = courseIdArray[i];
      
      
      const course = courses.find(c => c.id === courseId);
      if (!course) {
        console.error(`❌ Course not found in database: ${courseId}`);
        logError(`Course not found: ${courseId}`);
        continue;
      }


      const individualPrice = lineItems.data[i] 
        ? lineItems.data[i].amount_total / 100 
        : course.price;
      
      const existingPayment = await prisma.payment.findFirst({
        where: {
          courseId: courseId,
          buyerId,
          provider: PaymentProvider.STRIPE,
        },
      });

      let paymentRecord = existingPayment;
      if (!paymentRecord) {
        try {
          paymentRecord = await prisma.payment.create({
            data: {
              provider: PaymentProvider.STRIPE,
              status: PaymentStatus.SUCCEEDED,
              amount: individualPrice,
              currency: (session.currency || "usd").toUpperCase(),
              courseId: courseId,
              buyerId,
              stripePaymentIntentId: paymentIntentId,
              stripeSubscriptionId: (session.subscription as string) || null,
            },
          });
        } catch (paymentError) {
          console.error(`❌ Payment creation failed for course ${courseId}:`, paymentError);
          continue;
        }
      }
      payments.push({ id: paymentRecord.id });

      
      try {
        const existingEnrollment = await prisma.enrollment.findUnique({
          where: {
            userId_courseId: {
              userId: buyerId,
              courseId: courseId,
            },
          },
        });
        
        if (!existingEnrollment) {
          await prisma.enrollment.create({
            data: {
              userId: buyerId,
              courseId: courseId,
              paymentId: paymentRecord.id,
            },
          });
          logInfo("Enrollment created for course:", courseId);
        }
      } catch (enrollmentError) {
        console.error(`❌ Enrollment creation failed for course ${courseId} (${course.title}):`, enrollmentError);
      }
    }
  
    
    if (session.subscription && payments.length > 0) {
      await prisma.subscription.create({
        data: {
          paymentId: payments[0].id,
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          active: true,
        },
      });
    }
  
    logInfo("Payments created:", payments.map(p => p.id));
  } catch (error) {
    const e = error as Error;
    logError("Checkout completion failed:", e.message);
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const subRef = invoice.lines?.data?.[0]?.subscription;
  const stripeSubId = typeof subRef === "string" ? subRef : subRef?.id ?? null;

  if (!stripeSubId) {
    logError("No subscription found in invoice:", invoice.id);
    return;
  }

  const subscription = await prisma.subscription.findFirst({
    where: { payment: { stripeSubscriptionId: stripeSubId } },
  });

  if (!subscription) {
    logError("Subscription not found for invoice:", invoice.id);
    return;
  }

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: { active: true },
  });

  logInfo("Subscription payment succeeded:", subscription.id);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subRef = invoice.lines?.data?.[0]?.subscription;
  const stripeSubId = typeof subRef === "string" ? subRef : subRef?.id ?? null;

  if (!stripeSubId) {
    logError("No subscription found in invoice:", invoice.id);
    return;
  }

  const subscription = await prisma.subscription.findFirst({
    where: { payment: { stripeSubscriptionId: stripeSubId } },
  });

  if (!subscription) {
    logError("Subscription not found for invoice:", invoice.id);
    return;
  }

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: { active: false },
  });

  logInfo("Subscription payment failed:", subscription.id);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const stripeSubId = subscription.id;

  const dbSubscription = await prisma.subscription.findFirst({
    where: { payment: { stripeSubscriptionId: stripeSubId } },
  });

  if (!dbSubscription) {
    logError("Subscription not found for deletion:", stripeSubId);
    return;
  }

  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: { active: false },
  });

  logInfo("Subscription deleted:", dbSubscription.id);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const stripeSubId = subscription.id;

  const dbSubscription = await prisma.subscription.findFirst({
    where: { payment: { stripeSubscriptionId: stripeSubId } },
  });

  if (!dbSubscription) {
    logError("Subscription not found for update:", stripeSubId);
    return;
  }

  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: { active: subscription.status === "active" },
  });

  logInfo("Subscription updated:", dbSubscription.id);
}

async function handleCustomerCreated(customer: Stripe.Customer) {
  if (customer.metadata?.userId) {
    await prisma.user.update({
      where: { id: customer.metadata.userId },
      data: { stripeCustomerId: customer.id }
    });
    logInfo("Customer linked to user:", customer.metadata.userId);
  }
}


