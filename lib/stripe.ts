import Stripe from "stripe";
import { getEnvVar } from "@/lib/getEnvVar";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (stripeClient) return stripeClient;
  stripeClient = new Stripe(getEnvVar("STRIPE_SECRET_KEY"), {
    apiVersion: "2025-09-30.clover",
  });
  return stripeClient;
}


