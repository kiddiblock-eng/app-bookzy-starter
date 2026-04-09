import mongoose from "mongoose";

const nicheAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    country: {
      type: String,
      default: ""
    },

    theme: {
      type: String,
      required: true,
      trim: true
    },

    targetMarket: {
      type: String,
      default: "africa"
    },

    niches: [
      {
        nicheId: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        difficulty: { type: Number, min: 1, max: 10, required: true },
        competition: { type: Number, min: 1, max: 10, required: true },
        potential: { type: Number, min: 1, max: 10, required: true },
        keywords: [String],
        formatRecommande: { type: String, default: "ebook" },
        why_sells: { type: String, default: "" },
        prixMin: { type: Number, default: 2000 },
        prixMax: { type: Number, default: 6000 },
        publicCible: { type: String, default: "" },
        tendance2026: { type: String, default: "" },
        badge: { type: String, default: "fire" },
        adsContext: { type: mongoose.Schema.Types.Mixed, default: [] },
        analyzed: { type: Boolean, default: false },
        analysisCompletedAt: { type: Date },
        // ✅ Mixed — accepte tous les champs sans restriction
        analysis: { type: mongoose.Schema.Types.Mixed, default: {} },
      }
    ],

    generatedAt: { type: Date },
    totalNiches: { type: Number, default: 0 },
    generationTime: { type: String, default: "" },
    ip: { type: String, default: null },
    aiUsed: { type: Number, default: 0 },
    aiTokens: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);

nicheAnalysisSchema.index({ userId: 1, createdAt: -1 });
nicheAnalysisSchema.index({ country: 1 });

export default mongoose.models.NicheAnalysis ||
  mongoose.model("NicheAnalysis", nicheAnalysisSchema);