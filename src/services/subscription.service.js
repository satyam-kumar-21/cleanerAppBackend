import { env } from "../config/environment.js";
import { getStripeClient } from "../integrations/stripe/index.js";
import Subscription from "../models/Subscription.js";
import User from "../models/User.js";

const PREMIUM_STATUSES = new Set(["active", "trialing"]);

export const getSubscriptionPlans = () => [
  {
    id: "six-month",
    name: "6 months",
    durationMonths: 6,
    currency: "USD",
    referencePrice: 99,
    features: [
      "Unlimited scanning",
      "Low-level deep scans",
      "Deleted image recovery",
      "Ad-free experience",
    ],
  },
  {
    id: "annual",
    name: "1 year",
    durationMonths: 12,
    currency: "USD",
    referencePrice: 179,
    features: [
      "Unlimited scanning",
      "Low-level deep scans",
      "Deleted image recovery",
      "Ad-free experience",
    ],
  },
];

function createServiceError(message, statusCode = 500) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function getPlanById(planId) {
  return getSubscriptionPlans().find((plan) => plan.id === planId);
}

function getCheckoutReturnUrl() {
  if (!env.stripeReturnUrl) {
    throw createServiceError("Set STRIPE_RETURN_URL to the app deep link used for checkout returns.", 503);
  }
  return env.stripeReturnUrl;
}

function getBackendPublicUrl() {
  if (!env.backendPublicUrl) {
    throw createServiceError("Set BACKEND_PUBLIC_URL to this backend's public HTTPS URL.", 503);
  }

  let backendUrl;
  try {
    backendUrl = new URL(env.backendPublicUrl);
  } catch {
    throw createServiceError("BACKEND_PUBLIC_URL must be a valid HTTPS URL.", 503);
  }

  if (backendUrl.protocol !== "https:" || backendUrl.username || backendUrl.password) {
    throw createServiceError("BACKEND_PUBLIC_URL must be a public HTTPS URL.", 503);
  }
  return backendUrl.origin;
}

function validateAppReturnUrl(returnUrl) {
  if (typeof returnUrl !== "string" || returnUrl.length > 500) {
    throw createServiceError("A valid app return URL is required.", 400);
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(returnUrl);
  } catch {
    throw createServiceError("The app return URL is invalid.", 400);
  }

  const configuredProtocol = new URL(getCheckoutReturnUrl()).protocol;
  const isConfiguredAppScheme = parsedUrl.protocol === configuredProtocol
    && parsedUrl.hostname === new URL(getCheckoutReturnUrl()).hostname
    && !parsedUrl.username
    && !parsedUrl.password;
  const isNativeAppUrl = parsedUrl.protocol === "myapp:"
    && !parsedUrl.username
    && !parsedUrl.password
    && !parsedUrl.port
    && ((parsedUrl.hostname === "upgrade" && parsedUrl.pathname === "")
      || (!parsedUrl.hostname && parsedUrl.pathname === "/upgrade"));
  const isExpoGoUrl = parsedUrl.protocol === "exp:"
    && Boolean(parsedUrl.hostname)
    && !parsedUrl.username
    && !parsedUrl.password
    && /^\/--\/upgrade\/?$/.test(parsedUrl.pathname);

  if (!isConfiguredAppScheme && !isNativeAppUrl && !isExpoGoUrl) {
    throw createServiceError("The app return URL must use the configured app scheme or Expo Go.", 400);
  }
  return parsedUrl;
}

export function createAppCheckoutReturnUrl(checkout, sessionId, returnUrl = getCheckoutReturnUrl()) {
  if (checkout !== "success" && checkout !== "cancelled") {
    throw createServiceError("The Stripe checkout return status is invalid.", 400);
  }
  if (checkout === "success" && (typeof sessionId !== "string" || !sessionId.startsWith("cs_"))) {
    throw createServiceError("A valid Stripe checkout session ID is required.", 400);
  }

  const appUrl = validateAppReturnUrl(returnUrl);
  appUrl.searchParams.set("checkout", checkout);
  if (checkout === "success") appUrl.searchParams.set("session_id", sessionId);
  return appUrl.toString();
}

function getSubscriptionId(subscription) {
  return typeof subscription === "string" ? subscription : subscription?.id;
}

function getStripeCustomerId(subscription) {
  return typeof subscription.customer === "string"
    ? subscription.customer
    : subscription.customer?.id;
}

function toDate(unixSeconds) {
  return Number.isFinite(unixSeconds) ? new Date(unixSeconds * 1000) : null;
}

export function getStripeSubscriptionPeriodEnd(stripeSubscription) {
  const periodEnd = stripeSubscription.current_period_end
    ?? stripeSubscription.items?.data?.find((item) => item.current_period_end)?.current_period_end;
  return toDate(periodEnd);
}

async function saveStripeSubscription(stripeSubscription, metadataFallback = {}) {
  let verifiedSubscription = stripeSubscription;
  let metadata = { ...stripeSubscription.metadata };
  if (metadataFallback.userId && !metadata.userId) metadata.userId = metadataFallback.userId;
  if (metadataFallback.planId && !metadata.planId) metadata.planId = metadataFallback.planId;

  if (
    metadataFallback.userId
    && metadataFallback.planId
    && (!stripeSubscription.metadata?.userId || !stripeSubscription.metadata?.planId)
  ) {
    verifiedSubscription = await getStripeClient().subscriptions.update(
      getSubscriptionId(stripeSubscription),
      { metadata }
    );
    metadata = verifiedSubscription.metadata;
  }

  const userId = metadata.userId;
  const planId = metadata.planId;
  const plan = getPlanById(planId);
  const expiresAt = getStripeSubscriptionPeriodEnd(verifiedSubscription);
  if (!userId || !plan || !expiresAt || Number.isNaN(expiresAt.getTime())) {
    throw createServiceError("Stripe subscription is missing valid account, plan, or expiry metadata.", 400);
  }

  const user = await User.findById(userId);
  if (!user) throw createServiceError("User account was not found for this Stripe subscription.", 404);

  const subscriptionId = getSubscriptionId(verifiedSubscription);
  const existing = await Subscription.findOne({ stripeSubscriptionId: subscriptionId });
  if (existing && existing.userId.toString() !== user._id.toString()) {
    throw createServiceError("This Stripe subscription is already linked to another account.", 409);
  }

  const stripeStatus = verifiedSubscription.status;
  const isPremium = PREMIUM_STATUSES.has(stripeStatus) && expiresAt > new Date();
  const subscription = await Subscription.findOneAndUpdate(
    { userId: user._id },
    {
      $set: {
        planId: plan.id,
        provider: "stripe",
        stripeCustomerId: getStripeCustomerId(verifiedSubscription),
        stripeSubscriptionId: subscriptionId,
        status: isPremium ? stripeStatus : "expired",
        storeState: stripeStatus,
        startedAt: toDate(
          verifiedSubscription.current_period_start
          ?? verifiedSubscription.items?.data?.find((item) => item.current_period_start)?.current_period_start
        ) ?? new Date(),
        expiresAt,
        autoRenewing: !verifiedSubscription.cancel_at_period_end && !verifiedSubscription.cancel_at,
        latestOrderId: getSubscriptionId(verifiedSubscription.latest_invoice) ?? null,
      },
    },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  user.plan = isPremium ? "premium" : "free";
  user.subscriptionPlanId = isPremium ? plan.id : null;
  user.subscriptionExpiresAt = expiresAt;
  await user.save();
  return subscription;
}

export async function createStripeCheckoutSession({ userId, planId, returnUrl }) {
  const plan = getPlanById(planId);
  if (!plan) throw createServiceError("This Premium plan is not available.", 400);

  const user = await User.findById(userId);
  if (!user) throw createServiceError("User account was not found.", 404);

  const status = await getCurrentSubscription(userId);
  if (status.plan === "premium") {
    throw createServiceError("This account already has an active Premium subscription.", 409);
  }

  const appReturnUrl = validateAppReturnUrl(returnUrl || getCheckoutReturnUrl()).toString();
  const backendReturnUrl = `${getBackendPublicUrl()}/api/v1/subscriptions/stripe/return`;
  const stripe = getStripeClient();
  const previousSubscription = await Subscription.findOne({ userId: user._id });
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    client_reference_id: user._id.toString(),
    ...(previousSubscription?.stripeCustomerId
      ? { customer: previousSubscription.stripeCustomerId }
      : { customer_email: user.email }),
    line_items: [
      {
        price_data: {
          currency: plan.currency.toLowerCase(),
          unit_amount: Math.round(plan.referencePrice * 100),
          recurring: { interval: "month", interval_count: plan.durationMonths },
          product_data: { name: `Cleaner Premium - ${plan.name}` },
        },
        quantity: 1,
      },
    ],
    metadata: { userId: user._id.toString(), planId: plan.id },
    subscription_data: {
      metadata: { userId: user._id.toString(), planId: plan.id },
    },
    success_url: `${backendReturnUrl}?checkout=success&session_id={CHECKOUT_SESSION_ID}&return_uri=${encodeURIComponent(appReturnUrl)}`,
    cancel_url: `${backendReturnUrl}?checkout=cancelled&return_uri=${encodeURIComponent(appReturnUrl)}`,
  });

  if (!session.url) throw createServiceError("Stripe did not provide a checkout URL.", 502);
  return { checkoutUrl: session.url, sessionId: session.id };
}

export async function confirmStripeCheckout({ userId, sessionId }) {
  if (typeof sessionId !== "string" || !sessionId.startsWith("cs_")) {
    throw createServiceError("A valid Stripe checkout session ID is required.", 400);
  }

  const session = await getStripeClient().checkout.sessions.retrieve(sessionId);
  if (session.metadata?.userId !== userId) {
    throw createServiceError("This Stripe checkout session is not linked to the signed-in account.", 403);
  }
  if (
    session.status !== "complete"
    || !["paid", "no_payment_required"].includes(session.payment_status)
  ) {
    throw createServiceError("Stripe has not confirmed payment for this checkout.", 402);
  }

  const subscriptionId = getSubscriptionId(session.subscription);
  if (!subscriptionId) {
    throw createServiceError("Stripe checkout did not create a subscription.", 402);
  }
  const stripeSubscription = await getStripeClient().subscriptions.retrieve(subscriptionId);
  const subscription = await saveStripeSubscription(stripeSubscription, session.metadata);
  if (!PREMIUM_STATUSES.has(subscription.status) || subscription.expiresAt <= new Date()) {
    throw createServiceError("Stripe received the checkout, but the subscription is not active yet.", 402);
  }
  return subscription;
}

export async function getCurrentSubscription(userId) {
  const subscription = await Subscription.findOne({ userId });
  if (!subscription?.stripeSubscriptionId) {
    await User.updateOne(
      { _id: userId },
      { $set: { plan: "free", subscriptionPlanId: null, subscriptionExpiresAt: null } }
    );
    return { plan: "free", planId: null, expiresAt: null, subscription: null };
  }

  try {
    const stripeSubscription = await getStripeClient().subscriptions.retrieve(
      subscription.stripeSubscriptionId
    );
    const refreshedSubscription = await saveStripeSubscription(stripeSubscription);
    const isPremium = PREMIUM_STATUSES.has(refreshedSubscription.status)
      && refreshedSubscription.expiresAt > new Date();
    return {
      plan: isPremium ? "premium" : "free",
      planId: isPremium ? refreshedSubscription.planId : null,
      expiresAt: refreshedSubscription.expiresAt,
      subscription: isPremium ? refreshedSubscription : null,
    };
  } catch (error) {
    if (error.code !== "resource_missing") throw error;
    subscription.status = "expired";
    subscription.storeState = "canceled";
    await subscription.save();
    await User.updateOne(
      { _id: userId },
      { $set: { plan: "free", subscriptionPlanId: null } }
    );
    return {
      plan: "free",
      planId: null,
      expiresAt: subscription.expiresAt,
      subscription: null,
    };
  }
}

export function constructStripeWebhookEvent(payload, signature) {
  if (!env.stripeWebhookSecret) {
    throw createServiceError("Stripe webhook is not configured. Set STRIPE_WEBHOOK_SECRET on the server.", 503);
  }
  return getStripeClient().webhooks.constructEvent(payload, signature, env.stripeWebhookSecret);
}

export async function processStripeWebhookEvent(event) {
  const subscriptionEventTypes = new Set([
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
  ]);

  if (subscriptionEventTypes.has(event.type)) {
    const subscription = await getStripeClient().subscriptions.retrieve(event.data.object.id);
    await saveStripeSubscription(subscription);
    return;
  }

  if (event.type === "checkout.session.completed") {
    const checkoutSession = event.data.object;
    const subscriptionId = getSubscriptionId(checkoutSession.subscription);
    if (subscriptionId) {
      const subscription = await getStripeClient().subscriptions.retrieve(subscriptionId);
      await saveStripeSubscription(subscription, checkoutSession.metadata);
    }
  }
}

export default {
  getSubscriptionPlans,
  getStripeSubscriptionPeriodEnd,
  createAppCheckoutReturnUrl,
  createStripeCheckoutSession,
  confirmStripeCheckout,
  getCurrentSubscription,
  constructStripeWebhookEvent,
  processStripeWebhookEvent,
};
