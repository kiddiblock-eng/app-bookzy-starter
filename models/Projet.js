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
    langue: { type: String, default: "français" },

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
        "PREVIEW_READY",
      ],
      default: "DRAFT",
    },

    progress: { type: Number, default: 0 },
    errorMessage: { type: String },
    retryCount: { type: Number, default: 0 },

    // ————————————————————————
    // 🟩 CONTENU TEXTE
    // ————————————————————————
    summary: { type: String },
    introduction: { type: String },
    ch1Preview: { type: String },
    chaptersText: { type: String },
    conclusion: { type: String },

    // ————————————————————————
    // ✨ BOOKZY EXPRESS
    // ————————————————————————
    expressMode: { type: Boolean, default: false },
    expressChapters: [{
      number: { type: Number },
      title: { type: String },
      content: { type: String }
    }],
    aiImprovementsUsed: { type: Number, default: 0 },
    aiIncluded: { type: Number, default: 5 },
    aiExtraCost: { type: Number, default: 0 },

    // ————————————————————————
    // 🎬 YOUBOOK CONTEXT
    // Données extraites de la vidéo YouTube pour enrichir la génération
    // ————————————————————————
    youbookContext: {
      hook:           { type: String },
      probleme:       { type: String },
      transformation: { type: String },
      key_insights:   [{ type: String }],
      verbatim:       { type: String },
    },

    // ————————————————————————
    // 🟨 ASSETS GÉNÉRÉS
    // ————————————————————————
    pdfUrl: { type: String },
    docxUrl: { type: String },
    previewPdfUrl: { type: String },
    previewImages: [{ type: String }],
    coverUrl: { type: String },

    adsImages: [{ type: String }],

    adsTexts: {
      facebook: { type: String },
      whatsapp: { type: String },
      long: { type: String },
      landing: { type: String }
    },

    marketingDescription: { type: String },

    contenu: [
      {
        nom: String,
        url: String,
        format: String,
        taille: String
      },
    ],

    isPaid: { type: Boolean, default: false },
    transactionId: { type: String },
    paymentId: { type: String },
    paidAt: { type: Date },
    completedAt: { type: Date },

    kitUrl: { type: String },
  },
  { timestamps: true }
);

ProjetSchema.index({ userId: 1, createdAt: -1 });
ProjetSchema.index({ userId: 1, status: 1 });
ProjetSchema.index({ transactionId: 1 });

export default mongoose.models.Projet || mongoose.model("Projet", ProjetSchema);