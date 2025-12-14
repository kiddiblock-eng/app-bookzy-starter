import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // 🔥 ID INTERNE (pour retours de paiement)
  internalId: {
    type: String,
    unique: true,
    sparse: true, // Permet null mais unique si défini
  },

  // Le provider utilisé : moneroo | fedapay | kkiapay | pawapay
  provider: {
    type: String,
    enum: ["moneroo", "fedapay", "kkiapay", "pawapay"],
    required: true,
  },

  // ID donné par le provider (Moneroo, KkiaPay, etc.)
  providerTransactionId: {
    type: String,
    default: null,
  },

  amount: {
    type: Number,
    required: true,
  },

  currency: {
    type: String,
    default: "XOF",
  },

  status: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending",
  },

  // 🔥 Purpose plus flexible
  purpose: {
    type: String,
    default: "ebook_kit",
  },

  // 🔥 AJOUT : projetId (référence au projet)
  projetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Projet",
    default: null,
  },

  // 🔥 AJOUT : ebookId (référence à l'ebook généré)
  ebookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ebook",
    default: null,
  },

  // Données du kit (métadonnées)
  kitData: {
    title: String,
    description: String,
    template: String,
    pages: Number,
    chapters: Number,
    tone: String,
    audience: String,
  },

  // Données brutes venant du provider
  providerResponse: {
    type: Object,
    default: {},
  },

  // URL de paiement générée (pour redirection)
  paymentUrl: {
    type: String,
    default: null,
  },

  // Message d'erreur si échec
  errorMessage: {
    type: String,
    default: null,
  },

  // Date de complétion du paiement
  completedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true, // 🔥 Gère automatiquement createdAt et updatedAt
});

// 🔥 INDEX pour performance
TransactionSchema.index({ userId: 1, status: 1 });
TransactionSchema.index({ internalId: 1 });
TransactionSchema.index({ providerTransactionId: 1 });

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);