// models/ShopSale.js
// Modèle pour les ventes effectuées sur Smart Shop

import mongoose from "mongoose";

const ShopSaleSchema = new mongoose.Schema(
  {
    // Boutique
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },

    // Vendeur
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Produit vendu
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShopProduct",
      required: true,
    },

    // Snapshot du produit au moment de l'achat
    productSnapshot: {
      title: String,
      price: Number,
      cover: String,
      type: String,
    },

    // Infos acheteur
    buyer: {
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },
      name: {
        type: String,
        default: "",
      },
      phone: {
        type: String,
        default: "",
      },
      country: {
        type: String,
        default: "CI", // Côte d'Ivoire par défaut
      },
    },

    // Montants
    amount: {
      type: Number,
      required: true,
    },

    // Commission Bookzy
    commission: {
      rate: {
        type: Number,
        default: 10, // 10%
      },
      amount: {
        type: Number,
        default: 0,
      },
    },

    // Montant net pour le vendeur
    netAmount: {
      type: Number,
      default: 0,
    },

    // Paiement
    payment: {
      provider: {
        type: String,
        enum: ["moneroo", "kkiapay", "stripe"],
        default: "moneroo",
      },
      method: {
        type: String, // wave, orange_money, mtn_momo, card
        default: "",
      },
      transactionId: {
        type: String,
        default: "",
      },
      providerTransactionId: {
        type: String,
        default: "",
      },
    },

    // Statut
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },

    // Livraison
    delivery: {
      status: {
        type: String,
        enum: ["pending", "sent", "downloaded"],
        default: "pending",
      },
      sentAt: Date,
      downloadedAt: Date,
      downloadCount: {
        type: Number,
        default: 0,
      },
      downloadLink: {
        type: String,
        default: "",
      },
      // Lien expire après X heures
      linkExpiresAt: Date,
    },

    // Métadonnées
    metadata: {
      ip: String,
      userAgent: String,
      source: String, // direct, instagram, twitter, etc.
    },

    // Date de completion du paiement
    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Index
ShopSaleSchema.index({ shopId: 1, status: 1 });
ShopSaleSchema.index({ sellerId: 1, status: 1 });
ShopSaleSchema.index({ productId: 1 });
ShopSaleSchema.index({ "buyer.email": 1 });
ShopSaleSchema.index({ "payment.transactionId": 1 });
ShopSaleSchema.index({ createdAt: -1 });

// Calculer la commission et le montant net avant save
ShopSaleSchema.pre("save", function (next) {
  if (this.amount && this.commission.rate) {
    this.commission.amount = Math.round(this.amount * (this.commission.rate / 100));
    this.netAmount = this.amount - this.commission.amount;
  }
  next();
});

export default mongoose.models.ShopSale || mongoose.model("ShopSale", ShopSaleSchema);