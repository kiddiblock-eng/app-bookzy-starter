import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  internalId: {
    type: String,
    sparse: true, 
  },

  provider: {
    type: String,
    enum: ["moneroo", "fedapay", "kkiapay", "pawapay"],
    required: true,
  },

  providerTransactionId: {
    type: String,
    default: null,
  },

  amount: { type: Number, required: true },
  currency: { type: String, default: "XOF" },

  status: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending",
  },

  purpose: { type: String, default: "ebook_kit" },

  // ─── SYSTÈME DE CRÉDITS ──────────────────────────────────────────────────
  // Accepte les packs fixes ET les recharges dynamiques (ex: recharge_30_solo)
  packId: {
    type: String,
    default: null,
  },
  // ─────────────────────────────────────────────────────────────────────────

  projetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Projet",
    default: null,
  },

  ebookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ebook",
    default: null,
  },

  kitData: {
    title: String,
    description: String,
    template: String,
    pages: Number,
    chapters: Number,
    tone: String,
    audience: String,
  },

  providerResponse: { type: Object, default: {} },
  paymentUrl: { type: String, default: null },
  errorMessage: { type: String, default: null },
  completedAt: { type: Date, default: null },
}, {
  timestamps: true,
});

// INDEXATION
TransactionSchema.index({ internalId: 1 }, { sparse: true });
TransactionSchema.index({ userId: 1, status: 1 });
TransactionSchema.index({ providerTransactionId: 1 });
TransactionSchema.index({ packId: 1, status: 1 });

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);