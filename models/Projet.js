import mongoose from "mongoose";

const ProjetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // Infos basiques
    titre: { type: String, required: true },
    description: { type: String },

    pages: { type: Number },
    chapters: { type: Number },
    tone: { type: String },
    audience: { type: String },
    template: { type: String, default: "modern" },
    country: { type: String },

    // ————————————————————————
    // 🟦 ÉTAT DE LA GÉNÉRATION
    // ————————————————————————
    status: {
      type: String,
      enum: [
        "DRAFT",
        "processing",
        "generated_text",
        "ASSEMBLING",
        "COMPLETED",
        "ERROR",
      ],
      default: "DRAFT",
    },

    // Progression affichée à l’utilisateur
    progress: { type: Number, default: 0 },

    // ————————————————————————
    // 🟩 CONTENU TEXTE (4 étapes IA)
    // ————————————————————————
    summary: { type: String },
    introduction: { type: String },
    chapters: { type: String },      // 🔥 OK — Unifié
    conclusion: { type: String },

    // ————————————————————————
    // 🟨 ASSETS GÉNÉRÉS
    // ————————————————————————
    pdfUrl: { type: String },
    coverUrl: { type: String },

    adsImages: [{ type: String }],

    adsTexts: {
      facebook: { type: String },
      whatsapp: { type: String },
      long: { type: String },
    },

    marketingDescription: { type: String },

    contenu: [
      {
        nom: String,
        url: String,
      },
    ],

    isPaid: { type: Boolean, default: false },
    paymentId: { type: String },
    paidAt: { type: Date },

    kitUrl: { type: String },
  },
  { timestamps: true }
);
ProjetSchema.index({ userId: 1, createdAt: -1 });
ProjetSchema.index({ userId: 1, status: 1 });

export default mongoose.models.Projet || mongoose.model("Projet", ProjetSchema);