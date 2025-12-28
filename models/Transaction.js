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
    // On retire "unique: true" ici car l'index est défini plus bas
    // pour éviter le "Duplicate schema index"
    sparse: true, 
  },

  // Le provider : moneroo | fedapay | kkiapay | pawapay
  provider: {
    type: String,
    enum: ["moneroo", "fedapay", "kkiapay", "pawapay"],
    required: true,
  },

  // ID réel généré par Kkiapay (ex: 222689...)
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
    template: String, // Crucial pour le design choisi par l'utilisateur
    pages: Number,
    chapters: Number,
    tone: String,
    audience: String,
  },

  providerResponse: { type: Object, default: {} },
  paymentUrl: { type: String, default: null }, // Stocke le lien de redirection Kkiapay
  errorMessage: { type: String, default: null },
  completedAt: { type: Date, default: null },
}, {
  timestamps: true,
});

// 🔥 INDEXATION UNIQUE (Correction du Warning)
// On définit l'index unique ici proprement une seule fois
TransactionSchema.index({ internalId: 1 }, { unique: true, sparse: true });
TransactionSchema.index({ userId: 1, status: 1 });
TransactionSchema.index({ providerTransactionId: 1 });

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);