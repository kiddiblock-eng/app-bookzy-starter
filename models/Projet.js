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

    // Progression affichée à l'utilisateur
    progress: { type: Number, default: 0 },
    
    // Message d'erreur si statut ERROR
    errorMessage: { type: String },

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
      landing: { type: String } // ✅ Ajouté
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
    transactionId: { type: String }, // ✅ AJOUTÉ
    paymentId: { type: String },
    paidAt: { type: Date },
    completedAt: { type: Date }, // ✅ AJOUTÉ

    kitUrl: { type: String },
  },
  { timestamps: true }
);

ProjetSchema.index({ userId: 1, createdAt: -1 });
ProjetSchema.index({ userId: 1, status: 1 });
ProjetSchema.index({ transactionId: 1 }); // ✅ AJOUTÉ pour recherche rapide

export default mongoose.models.Projet || mongoose.model("Projet", ProjetSchema);