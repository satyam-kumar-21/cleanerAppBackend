import mongoose from "mongoose";

const cleanupHistorySchema = new mongoose.Schema(
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

    itemsProcessed: {
      type: Number,
      default: 0,
      min: 0,
    },

    itemsCleaned: {
      type: Number,
      default: 0,
      min: 0,
    },

    itemsSkipped: {
      type: Number,
      default: 0,
      min: 0,
    },

    bytesFreed: {
      type: Number,
      default: 0,
      min: 0,
    },

    durationMs: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["IN_PROGRESS", "COMPLETED", "PARTIAL", "FAILED"],
      default: "COMPLETED",
    },

    categories: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

cleanupHistorySchema.index({ userId: 1, createdAt: -1 });
cleanupHistorySchema.index({ deviceId: 1, createdAt: -1 });

export default mongoose.model("CleanupHistory", cleanupHistorySchema);
