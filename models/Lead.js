// models/Lead.js
// Modèle pour stocker les leads collectés via Smart Shop

import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    // Boutique propriétaire
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      index: true,
    },

    // Propriétaire (pour requêtes directes)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Produit concerné
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShopProduct",
      required: true,
    },

    // Contact du lead (email ou téléphone)
    contact: {
      type: String,
      required: true,
      trim: true,
    },

    // Type de contact
    contactType: {
      type: String,
      enum: ["email", "whatsapp", "phone"],
      default: "email",
    },

    // Source (comment le lead est arrivé)
    source: {
      type: String,
      enum: ["free", "whatsapp", "link", "checkout"],
      required: true,
    },

    // Infos du produit au moment de la capture (pour historique)
    productTitle: {
      type: String,
      required: true,
    },

    productPrice: {
      type: Number,
      default: 0,
    },

    // Statut
    status: {
      type: String,
      enum: ["new", "contacted", "converted", "lost"],
      default: "new",
    },

    // Notes du vendeur
    notes: {
      type: String,
      maxlength: 500,
      default: "",
    },

    // Métadonnées
    metadata: {
      ip: String,
      userAgent: String,
      referrer: String,
      country: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index composés pour les requêtes fréquentes
LeadSchema.index({ userId: 1, createdAt: -1 });
LeadSchema.index({ shopId: 1, createdAt: -1 });
LeadSchema.index({ productId: 1, createdAt: -1 });

export default mongoose.models.Lead || mongoose.model("Lead", LeadSchema);