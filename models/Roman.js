import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  wordCount: { type: Number, default: 0 },
});

const romanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Config
    title: { type: String, required: true },
    genre: { type: String, required: true }, // thriller, romance, aventure, drame, fantasy, policier
    cadre: { type: String, default: "universel" }, // afrique, europe, universel
    longueur: { type: String, default: "moyen" }, // court, moyen, long
    ton: { type: String, default: "dramatique" }, // sombre, leger, dramatique, humoristique
    publicCible: { type: String, default: "adulte" }, // adulte, jeunes_adultes, ados
    template: { type: String, default: "classique" }, // classique, sombre, romance, moderne

    // Personnages
    personnages: [{
      nom: { type: String },
      age: { type: String },
      role: { type: String }, // heros, antagoniste, love_interest, secondaire
      description: { type: String },
    }],

    // Histoire
    decor: { type: String }, // ville/lieu
    epoque: { type: String, default: "contemporaine" },
    intrigue: { type: String }, // description de l'histoire
    twist: { type: String }, // rebondissement optionnel
    synopsis: { type: String },

    // Bible du roman — contexte transmis à chaque chapitre
    bible: { type: String, default: "" },

    // Plan des chapitres
    chapterPlans: [{
      numero: Number,
      titre: String,
      resume: String,
    }],

    // Contenu généré
    chapters: [chapterSchema],
    totalWords: { type: Number, default: 0 },
    totalPages: { type: Number, default: 0 },

    // Fichiers
    pdfUrl: { type: String, default: "" },
    docxUrl: { type: String, default: "" },

    creditsRequired: { type: Number, default: 20 },
    creditsUsed: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["preview", "generating", "completed", "failed"],
      default: "preview",
    },
    generationTime: { type: String, default: "" },
    error: { type: String, default: "" },
  },
  { timestamps: true }
);

romanSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Roman || mongoose.model("Roman", romanSchema);