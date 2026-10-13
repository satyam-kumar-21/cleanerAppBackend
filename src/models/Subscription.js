import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    planId: {
      type: String,
      enum: ["six-month", "annual"],
      required: true,
    },
    provider: {
      type: String,
      enum: ["stripe"],
      required: true,
    },
    stripeCustomerId: {
      type: String,
      required: true,
    },
    stripeSubscriptionId: { type: String, required: true },
    status: {
      type: String,
      enum: [
        "active",
        "trialing",
        "past_due",
        "canceled",
        "unpaid",
        "incomplete",
        "incomplete_expired",
        "paused",
        "expired",
      ],
      required: true,
    },
    storeState: {
      type: String,
      required: true,
    },
    startedAt: {
      type: Date,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    autoRenewing: {
      type: Boolean,
      default: false,
    },
    latestOrderId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

subscriptionSchema.index({ stripeSubscriptionId: 1 }, { unique: true });

export default mongoose.models.Subscription || mongoose.model("Subscription", subscriptionSchema);
