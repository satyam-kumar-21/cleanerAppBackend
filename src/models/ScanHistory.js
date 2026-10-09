import mongoose from "mongoose";

const scanHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    deviceId: {
      type: String,
      required: true,
      index: true,
    },

    platform: {
      type: String,
      enum: ["android", "ios", "windows", "macos"],
      required: true,
    },

    scanType: {
      type: String,
      enum: ["FULL", "QUICK", "CUSTOM", "SCHEDULED"],
      default: "FULL",
    },

    totalScanned: {
      type: Number,
      default: 0,
      min: 0,
    },

    itemsFound: {
      type: Number,
      default: 0,
      min: 0,
    },

    cleanableSizeBytes: {
      type: Number,
      default: 0,
      min: 0,
    },

    durationMs: {
      type: Number,
      default: 0,
      min: 0,
    },

    categoryCounts: {
      type: Map,
      of: Number,
      default: {},
    },

    startedAt: {
      type: Date,
      required: true,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["IN_PROGRESS", "COMPLETED", "FAILED", "CANCELLED"],
      default: "COMPLETED",
    },
  },
  {
    timestamps: true,
  }
);

scanHistorySchema.index({ userId: 1, createdAt: -1 });
scanHistorySchema.index({ deviceId: 1, createdAt: -1 });

export default mongoose.model("ScanHistory", scanHistorySchema);
