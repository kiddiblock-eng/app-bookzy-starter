import mongoose from "mongoose";

const emailJobSchema = new mongoose.Schema(
  {
    userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    email:     { type: String, required: true },
    firstName: { type: String, default: "" },
    type:      { type: String, required: true }, // "analyseur_relance" | "youbook_relance" | "ebook_relance"
    payload:   { type: mongoose.Schema.Types.Mixed, default: {} },
    sendAt:    { type: Date, required: true },
    sentAt:    { type: Date, default: null },
    status:    { type: String, enum: ["pending", "sent", "failed", "cancelled"], default: "pending" },
    error:     { type: String, default: "" },
  },
  { timestamps: true }
);

emailJobSchema.index({ status: 1, sendAt: 1 });

export default mongoose.models.EmailJob || mongoose.model("EmailJob", emailJobSchema);