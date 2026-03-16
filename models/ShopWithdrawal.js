// models/ShopWithdrawal.js
// Modèle pour les demandes de retrait des vendeurs

import mongoose from "mongoose";

const ShopWithdrawalSchema = new mongoose.Schema(
  {
    // Vendeur
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Boutique
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },

    // Montant demandé
    amount: {
      type: Number,
      required: true,
      min: 1000, // Minimum 1000 FCFA
    },

    // Frais de transfert
    fees: {
      type: Number,
      default: 0,
    },

    // Montant net reçu
    netAmount: {
      type: Number,
      default: 0,
    },

    // Méthode de paiement
    paymentMethod: {
      type: String,
      enum: ["wave", "orange_money", "mtn_momo", "moov_money", "bank"],
      required: true,
    },

    // Infos du compte destinataire
    paymentDetails: {
      phoneNumber: {
        type: String,
        default: "",
      },
      accountName: {
        type: String,
        default: "",
      },
      // Pour virement bancaire
      bankName: {
        type: String,
        default: "",
      },
      bankAccount: {
        type: String,
        default: "",
      },
    },

    // Statut
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "rejected"],
      default: "pending",
    },

    // Référence unique
    reference: {
      type: String,
      unique: true,
    },

    // Notes admin
    adminNote: {
      type: String,
      default: "",
    },

    // Raison de rejet
    rejectionReason: {
      type: String,
      default: "",
    },

    // Traité par (admin)
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Dates
    processedAt: Date,
    completedAt: Date,

    // Preuve de transfert (screenshot, référence)
    proofOfPayment: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Index
ShopWithdrawalSchema.index({ userId: 1, status: 1 });
ShopWithdrawalSchema.index({ shopId: 1 });
ShopWithdrawalSchema.index({ status: 1, createdAt: -1 });
ShopWithdrawalSchema.index({ reference: 1 });

// Générer référence unique avant save
ShopWithdrawalSchema.pre("save", function (next) {
  if (!this.reference) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.reference = `WD-${timestamp}-${random}`;
  }
  
  // Calculer montant net
  if (this.amount && this.fees >= 0) {
    this.netAmount = this.amount - this.fees;
  }
  
  next();
});

export default mongoose.models.ShopWithdrawal || mongoose.model("ShopWithdrawal", ShopWithdrawalSchema);