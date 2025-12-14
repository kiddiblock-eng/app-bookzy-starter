import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    // --- Destinataire ---
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,            // devient optionnel pour les "toAll"
      index: true
    },

    // notification envoyée à tous ?
    sentToAll: {
      type: Boolean,
      default: false,
      index: true
    },

    // --- Contenu ---
    type: {
      type: String,
      enum: ["admin", "purchase", "ebook_ready", "system"],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: "bell"
    },
    color: {
      type: String,
      default: "blue"
    },
    link: {
      type: String,
      default: null
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    // --- Lecture ---
    read: {
      type: Boolean,
      default: false,
      index: true
    },
    readAt: {
      type: Date,
      default: null
    },

    // --- Tracking lecteurs ---
    viewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    viewsCount: {
      type: Number,
      default: 0
    },

    deliveredAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Index optimisés pour les listes
notificationSchema.index({ sentToAll: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ read: 1, createdAt: -1 });

export default mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);