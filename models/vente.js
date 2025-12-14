import mongoose from "mongoose";

const VenteSchema = new mongoose.Schema(
  {
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true, required: true },
    date:     { type: Date, required: true, index: true },
    montant:  { type: Number, required: true },
    produit:  { type: String, default: "Ebook" },
    devise:   { type: String, default: "EUR" }, // optionnel
    meta:     { type: Object, default: {} },    // optionnel
  },
  { timestamps: true }
);

export default mongoose.models.Vente || mongoose.model("Vente", VenteSchema);