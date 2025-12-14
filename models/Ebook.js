// models/Ebook.js
import mongoose from "mongoose";

const EbookSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    template: { type: String },
    description: { type: String },
    pages: { type: Number },
    chapters: { type: Number },
    fileUrl: { type: String, required: true },

    // ✅ NOUVEAU : Contenu HTML éditable (pour l'éditeur)
    content: { 
      type: String, 
      default: "" 
    },

    // 🧠 Champs IA marketing
    coverUrl: { type: String },
    marketingDescription: { type: String },
    adsTexts: {
      type: mongoose.Schema.Types.Mixed, // { facebook, longform, whatsapp }
      default: {},
    },
    adsImages: {
      type: [String], // liste d'URLs d'images
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Ebook || mongoose.model("Ebook", EbookSchema);