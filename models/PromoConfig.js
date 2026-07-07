import mongoose from "mongoose";

// Config globale de la roue promo (singleton, key = "promo").
// enabled : la roue est-elle proposée ? (true par défaut → une fois par nouvel éligible)
// startsAt / endsAt : bornes optionnelles pour une campagne ponctuelle.
const PromoConfigSchema = new mongoose.Schema(
  {
    key: { type: String, default: "promo", unique: true },
    enabled: { type: Boolean, default: true },
    startsAt: { type: Date, default: null },
    endsAt: { type: Date, default: null },
  },
  { timestamps: true }
);

/** Récupère (ou crée) le document de config unique. */
PromoConfigSchema.statics.getSingleton = async function () {
  let doc = await this.findOne({ key: "promo" });
  if (!doc) doc = await this.create({ key: "promo" });
  return doc;
};

/** La campagne est-elle active maintenant ? */
PromoConfigSchema.methods.isLive = function () {
  if (!this.enabled) return false;
  const now = Date.now();
  if (this.startsAt && now < new Date(this.startsAt).getTime()) return false;
  if (this.endsAt && now > new Date(this.endsAt).getTime()) return false;
  return true;
};

export default mongoose.models.PromoConfig || mongoose.model("PromoConfig", PromoConfigSchema);
