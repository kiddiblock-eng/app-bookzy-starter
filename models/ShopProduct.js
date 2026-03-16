// models/ShopProduct.js
// Modèle pour les produits vendus dans une boutique Smart Shop

import mongoose from "mongoose";

const ShopProductSchema = new mongoose.Schema(
  {
    // Boutique propriétaire
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },

    // Propriétaire (pour requêtes directes)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Référence vers l'ebook Bookzy (stocké comme String pour compatibilité)
    ebookId: {
      type: String,
      default: null,
      index: true,
    },

    // Référence vers un projet Bookzy
    projetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Projet",
      default: null,
      index: true,
    },

    // Infos produit
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    // Description (supporte HTML pour le formatage rich text)
    description: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: "",
    },

    // Prix en FCFA
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // Prix barré (pour promos)
    comparePrice: {
      type: Number,
      default: null,
    },

    // Type de produit
    type: {
      type: String,
      enum: ["ebook", "pdf", "template", "video", "audio", "other"],
      default: "ebook",
    },

    // Fichier à télécharger
    file: {
      url: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        default: "",
      },
      size: {
        type: Number,
        default: 0,
      },
      type: {
        type: String,
        default: "",
      },
    },

    // Image de couverture
    cover: {
      type: String,
      default: "",
    },

    // Images additionnelles (galerie)
    images: [{
      type: String,
    }],

    // Catégorie/Tag
    category: {
      type: String,
      trim: true,
      default: "",
    },

    // Stats
    stats: {
      views: { type: Number, default: 0 },
      sales: { type: Number, default: 0 },
      revenue: { type: Number, default: 0 },
    },

    // Statut
    isActive: {
      type: Boolean,
      default: true,
    },

    // Produit mis en avant
    isFeatured: {
      type: Boolean,
      default: false,
    },

    // Ordre d'affichage
    order: {
      type: Number,
      default: 0,
    },

    // Limite de ventes (null = illimité)
    stockLimit: {
      type: Number,
      default: null,
    },

    // Slug pour URL propre
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },

    // === OPTIONS DE CHECKOUT ===
    
    checkoutType: {
      type: String,
      enum: ["checkout", "whatsapp", "link", "free"],
      default: "checkout",
    },

    whatsappNumber: {
      type: String,
      default: "",
    },

    whatsappMessage: {
      type: String,
      default: "Bonjour, je suis intéressé par : {product}",
    },

    externalLink: {
      type: String,
      default: "",
    },

    buttonText: {
      type: String,
      default: "Acheter maintenant",
      maxlength: 30,
    },

    // === NOUVEAUX CHAMPS POUR PAGE PRODUIT ===

    // FOMO - Nombre de personnes (optionnel, si vide = pas affiché)
    fomo: {
      type: Number,
      default: null,
    },

    // FAQ - Questions/Réponses
    faqs: [{
      question: {
        type: String,
        required: true,
        maxlength: 200,
      },
      answer: {
        type: String,
        required: true,
        maxlength: 1000,
      },
    }],

    // Témoignages
    testimonials: [{
      name: {
        type: String,
        required: true,
        maxlength: 50,
      },
      text: {
        type: String,
        required: true,
        maxlength: 500,
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 5,
      },
    }],
  },
  {
    timestamps: true,
  }
);

// Index
ShopProductSchema.index({ shopId: 1, isActive: 1 });
ShopProductSchema.index({ userId: 1 });
ShopProductSchema.index({ slug: 1, shopId: 1 });

// Générer slug avant save
ShopProductSchema.pre("save", function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .substring(0, 50);
  }
  next();
});

export default mongoose.models.ShopProduct || mongoose.model("ShopProduct", ShopProductSchema);