import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
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
      trim: true,
    },

    deviceName: {
      type: String,
      default: "My Device",
    },

    manufacturer: {
      type: String,
      default: null,
    },

    model: {
      type: String,
      default: null,
    },

    platform: {
      type: String,
      enum: ["android", "ios", "windows", "macos"],
      required: true,
    },

    osVersion: {
      type: String,
      default: null,
    },

    appVersion: {
      type: String,
      default: null,
    },

    architecture: {
      type: String,
      default: null,
    },

    processorName: {
      type: String,
      default: null,
    },

    coreCount: {
      type: Number,
      default: null,
      min: 1,
    },

    totalRamBytes: {
      type: Number,
      default: null,
      min: 0,
    },

    availableRamBytes: {
      type: Number,
      default: null,
      min: 0,
    },

    totalStorageBytes: {
      type: Number,
      default: null,
      min: 0,
    },

    freeStorageBytes: {
      type: Number,
      default: null,
      min: 0,
    },

    usedStorageBytes: {
      type: Number,
      default: null,
      min: 0,
    },

    batteryLevel: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },

    isCharging: {
      type: Boolean,
      default: null,
    },

    lastScanAt: {
      type: Date,
      default: null,
    },

    lastCleanedAt: {
      type: Date,
      default: null,
    },

    lastBytesFreed: {
      type: Number,
      default: 0,
      min: 0,
    },

    lastSeenAt: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "REVOKED"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

deviceSchema.index(
  { userId: 1, deviceId: 1 },
  { unique: true }
);

export default mongoose.model("Device", deviceSchema);