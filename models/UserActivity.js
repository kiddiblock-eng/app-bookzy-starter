import mongoose from "mongoose";

/**
 * PRÉSENCE EN LIGNE (1 document par utilisateur, mis à jour en continu).
 * Distinct du journal d'événements `Activity` (append-only, collection "activities").
 * Utilisé par : activity/track (upsert lastSeen), admin dashboard (actifs maintenant),
 * admin security/overview (dernière activité de l'admin), dev/seed.
 */
const userActivitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    lastSeen: { type: Date, default: Date.now },
    ip: { type: String },
    userAgent: { type: String },
    path: { type: String },
    seed: { type: Boolean }, // marqueur pour le nettoyage du seed de dev
  },
  { timestamps: true }
);

// Admin dashboard : "utilisateurs actifs maintenant" (lastSeen >= now-5min)
userActivitySchema.index({ lastSeen: 1 });

export default mongoose.models.UserActivity ||
  mongoose.model("UserActivity", userActivitySchema);
