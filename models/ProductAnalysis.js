import mongoose from "mongoose";

const productAnalysisSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sujet:  { type: String, required: true },

    // Score & verdict
    scoreGlobal:   { type: Number, default: 0 },
    verdict:       { type: String, default: "" }, // "fonce" | "attends" | "evite"
    verdictTexte:  { type: String, default: "" },
    raisonVerdict: { type: String, default: "" }, // Explication honnête du verdict

    // Timing
    timing: {
      statut:      { type: String, default: "bon" }, // "excellent" | "bon" | "attendre" | "risque"
      label:       { type: String, default: "" },
      explication: { type: String, default: "" },
    },

    // Titres suggérés par l'IA
    titresSuggeres: [String],

    // Angle gagnant pour battre la concurrence
    angleGagnant: {
      titre:           { type: String, default: "" },
      strategie:       { type: String, default: "" },
      positionnemment: { type: String, default: "" },
      sujetReformule:  { type: String, default: "" },
    },

    // Calendrier de lancement 4 semaines
    calendrierLancement: [{
      semaine: Number,
      titre:   String,
      actions: [String],
    }],

    // Facebook Ads
    fbAds: {
      totalAnnonceurs: { type: Number, default: 0 },
      dureemoyenne:    { type: String, default: "" },
      annonceurs:      [{ nom: String, photo: String, duree: String }],
      tendance:        { type: String, default: "" },
    },

    // Google Trends
    tendanceGoogle: { type: String, default: "stable" },

    // Pays
    pays: [{ nom: String, flag: String, score: Number, raison: String }],

    // Concurrents
    concurrents: {
      niveau:      { type: String, default: "" },
      description: { type: String, default: "" },
      strategies:  [String],
      angleUnique: { type: String, default: "" },
    },

    // Revenus
    revenus: {
      prixRecommande:  { type: Number, default: 0 },
      ventesParSemaine:{ type: Number, default: 0 },
      semaine:         { type: Number, default: 0 },
      mois:            { type: Number, default: 0 },
      annee:           { type: Number, default: 0 },
      hypothese:       { type: String, default: "" },
    },

    // Saturation
    saturation: {
      score:       { type: Number, default: 0 },
      label:       { type: String, default: "" },
      description: { type: String, default: "" },
    },

    // Pratiques
    pratiques: [{ titre: String, description: String }],

    // Alternatives si mauvais verdict
    alternativesSiMauvais: [{ sujet: String, raison: String }],

    // Mots-clés & audience
    keywords: [String],
    audience: { type: String, default: "" },
  },
  { timestamps: true }
);

productAnalysisSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.ProductAnalysis || mongoose.model("ProductAnalysis", productAnalysisSchema);