import mongoose from "mongoose";

const nicheAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    // 📌 Pays de l'utilisateur (pour stats admin)
    country: {
      type: String,
      default: ""
    },

    theme: {
      type: String,
      required: true,
      trim: true
    },

    niches: [
      {
        nicheId: {
          type: String,
          required: true,
          unique: true
        },
        title: { type: String, required: true },
        description: { type: String, required: true },

        difficulty: { type: Number, min: 1, max: 10, required: true },
        competition: { type: Number, min: 1, max: 10, required: true },
        potential: { type: Number, min: 1, max: 10, required: true },

        keywords: [String],

        analyzed: { type: Boolean, default: false },

        analysis: {
          volumeEstime: String,
          tendance: String,
          difficulteSEO: Number,
          concurrenceDetailed: String,
          opportunites: [String],
          anglesUniques: [String],
          structureSuggeree: [String],
          recommendationIA: String,
          cpcMoyen: String,
          topConcurrents: [
            {
              nom: String,
              pointsForts: String
            }
          ],
          forces: [String],
          pointsAttention: [String],
          conseilsDiff: [String],
          titreOptimise: String,
          publicCible: String
        }
      }
    ],

    aiUsed: { type: Number, default: 0 },
    aiTokens: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);

// Index utiles pour le Dashboard Admin
nicheAnalysisSchema.index({ userId: 1, createdAt: -1 });
nicheAnalysisSchema.index({ country: 1 }); // 📌 pour le graph des pays

export default mongoose.models.NicheAnalysis ||
  mongoose.model("NicheAnalysis", nicheAnalysisSchema);