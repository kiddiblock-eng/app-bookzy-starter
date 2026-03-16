// models/Shop.js
import mongoose from "mongoose";

const ShopSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: [/^[a-z0-9_-]+$/, "Le slug ne peut contenir que des lettres, chiffres, tirets et underscores"],
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    
    bio: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },

    logo: {
      type: String,
      default: "",
    },

    banner: {
      type: String,
      default: "",
    },

    theme: {
      primaryColor: {
        type: String,
        default: "#6366f1",
      },
      accentColor: {
        type: String,
        default: "#8b5cf6",
      },
      style: {
        type: String,
        default: "clean",
      },
    },

    socials: {
      instagram: { type: String, default: "" },
      twitter: { type: String, default: "" },
      tiktok: { type: String, default: "" },
      youtube: { type: String, default: "" },
      website: { type: String, default: "" },
    },

    paymentInfo: {
      method: {
        type: String,
        enum: ["wave", "orange_money", "mtn_momo", "moov_money", "bank"],
        default: "wave",
      },
      phoneNumber: {
        type: String,
        default: "",
      },
      accountName: {
        type: String,
        default: "",
      },
      bankName: { type: String, default: "" },
      bankAccount: { type: String, default: "" },
    },

    stats: {
      totalProducts: { type: Number, default: 0 },
      totalSales: { type: Number, default: 0 },
      totalRevenue: { type: Number, default: 0 },
      totalViews: { type: Number, default: 0 },
    },

    balance: {
      type: Number,
      default: 0,
    },

    currency: {
      type: String,
      enum: ["XOF", "XAF", "EUR", "USD", "GBP"],
      default: "XOF",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // ✅ AJOUT : Boutique publiée publiquement (coûte 5 crédits)
    isPublished: {
      type: Boolean,
      default: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    commissionRate: {
      type: Number,
      default: 10,
      min: 0,
      max: 50,
    },
  },
  {
    timestamps: true,
  }
);

ShopSchema.index({ isActive: 1 });
ShopSchema.index({ isPublished: 1 });

export default mongoose.models.Shop || mongoose.model("Shop", ShopSchema);