import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // 🔥 ID INTERNE (Utilisé pour le suivi avant redirection)
  internalId: {
    type: String,
    sparse: true, 
  },

  // Le provider : moneroo | fedapay | kkiapay | pawapay
  provider: {
    type: String,
    enum: ["moneroo", "fedapay", "kkiapay", "pawapay"],
    required: true,
  },

  // ID réel généré par le provider
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

  // "ebook_kit" = génération ebook | "credit_pack" = achat de crédits
  purpose: { type: String, default: "ebook_kit" },

  // ─── SYSTÈME DE CRÉDITS ──────────────────────────────────────────────────
  // Rempli uniquement si purpose === "credit_pack"
  packId: {
    type: String,
    enum: [
      "solo_monthly",
      "solo_quarterly",
      "createur_monthly",
      "createur_quarterly",
      "agence_monthly",
      "agence_quarterly",
      null
    ],
    default: null,
  },
  // ─────────────────────────────────────────────────────────────────────────

  // Référence au projet pour déclencher la génération après paiement
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

  // Métadonnées pour l'IA
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
TransactionSchema.index({ internalId: 1 }, { unique: true, sparse: true });
TransactionSchema.index({ userId: 1, status: 1 });
TransactionSchema.index({ providerTransactionId: 1 });
TransactionSchema.index({ packId: 1, status: 1 }); // Pour stats par pack

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);