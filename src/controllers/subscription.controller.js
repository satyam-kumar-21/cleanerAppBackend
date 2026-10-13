import {
  confirmStripeCheckout as confirmCheckout,
  constructStripeWebhookEvent,
  createStripeCheckoutSession as createCheckoutSession,
  getCurrentSubscription as findCurrentSubscription,
  processStripeWebhookEvent,
} from "../services/subscription.service.js";

export const getSubscription = async (req, res, next) => {
  try {
    const subscription = await findCurrentSubscription(req.user.id);
    return res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    return next(error);
  }
};

export const createStripeCheckout = async (req, res, next) => {
  try {
    const checkout = await createCheckoutSession({
      userId: req.user.id,
      planId: req.body.planId,
    });
    return res.status(200).json({
      success: true,
      message: "Stripe checkout session created.",
      data: checkout,
    });
  } catch (error) {
    return next(error);
  }
};

export const confirmStripeCheckout = async (req, res, next) => {
  try {
    const subscription = await confirmCheckout({
      userId: req.user.id,
      sessionId: req.body.sessionId,
    });
    return res.status(200).json({
      success: true,
      message: "Stripe subscription verified.",
      data: {
        plan: "premium",
        planId: subscription.planId,
        expiresAt: subscription.expiresAt,
        subscription,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const handleStripeWebhook = async (req, res, next) => {
  let event;
  try {
    event = constructStripeWebhookEvent(req.body, req.headers["stripe-signature"]);
  } catch (error) {
    if (error.statusCode) return next(error);
    if (error.type === "StripeSignatureVerificationError") {
      return res.status(400).json({ success: false, message: "Invalid Stripe webhook signature." });
    }
    return next(error);
  }

  try {
    await processStripeWebhookEvent(event);
    return res.status(200).json({ received: true });
  } catch (error) {
    return next(error);
  }
};

export default { getSubscription, createStripeCheckout, confirmStripeCheckout, handleStripeWebhook };
