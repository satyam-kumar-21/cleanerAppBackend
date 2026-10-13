// src/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,

    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    avatar: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: ["USER", "ADMIN", "SUPER_ADMIN", "SUPPORT"],
      default: "USER",
    },

    status: {
      type: String,
      enum: ["ACTIVE", "SUSPENDED", "DELETED"],
      default: "ACTIVE",
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    plan: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },

    subscriptionPlanId: {
      type: String,
      default: null,
    },

    subscriptionExpiresAt: {
      type: Date,
      default: null,
    },

    preferences: {
      language: {
        type: String,
        enum: ["en", "hi", "es", "fr", "de", "zh"],
        default: "en",
      },
      theme: {
        type: String,
        enum: ["light", "dark"],
        default: "light",
      },
      notifications: {
        type: Boolean,
        default: false,
      },
    },

    expoPushTokens: {
      type: [String],
      default: [],
      select: false,
    },

    emailVerificationToken: {
      type: String,
      select: false,
      default: null,
    },

    emailVerificationExpires: {
      type: Date,
      select: false,
      default: null,
    },

    passwordResetToken: {
      type: String,
      select: false,
      default: null,
    },

    passwordResetExpires: {
      type: Date,
      select: false,
      default: null,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },

    lastLoginIp: {
      type: String,
      select: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1, status: 1 });

/*
|--------------------------------------------------------------------------
| JSON Transform
|--------------------------------------------------------------------------
| Remove sensitive fields when sending user data to frontend.
*/

userSchema.methods.toJSON = function () {
  const user = this.toObject();

  delete user.passwordHash;
  delete user.emailVerificationToken;
  delete user.emailVerificationExpires;
  delete user.passwordResetToken;
  delete user.passwordResetExpires;
  delete user.lastLoginIp;
  delete user.expoPushTokens;

  return user;
};

const User = mongoose.model("User", userSchema);
export default User;