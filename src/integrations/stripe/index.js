import Stripe from "stripe";
import { env } from "../../config/environment.js";

let stripeClient;

export function getStripeClient() {
  if (stripeClient) return stripeClient;
  if (!env.stripeSecretKey || !env.stripeSecretKey.startsWith("sk_")) {
    const error = new Error("Stripe is not configured. Set a valid STRIPE_SECRET_KEY on the server.");
    error.statusCode = 503;
    throw error;
  }
  stripeClient = new Stripe(env.stripeSecretKey);
  return stripeClient;
}

export default { getStripeClient };
