// models/Suggestion.js
import mongoose from "mongoose";

const SuggestionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Infos utilisateur au moment de la soumission
    userSnapshot: {
      name: String,
      photo: String,
    },
    // true = l'user autorise l'affichage de son nom/photo en public
    isPublic: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "planned", "delivered"],
      default: "pending",
    },
    // Array des userIds qui ont voté
    votes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// Index pour trier par votes
SuggestionSchema.index({ votes: 1, createdAt: -1 });

export default mongoose.models.Suggestion ||
  mongoose.model("Suggestion", SuggestionSchema);