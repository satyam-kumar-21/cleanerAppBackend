import mongoose from "mongoose";

const supportTicketSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 120,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 5000,
    },
    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "RESOLVED"],
      default: "OPEN",
    },
    priority: {
      type: String,
      enum: ["STANDARD", "PRIORITY"],
      default: "PRIORITY",
    },
  },
  { timestamps: true }
);

supportTicketSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.SupportTicket
  || mongoose.model("SupportTicket", supportTicketSchema);
