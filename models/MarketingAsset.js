import mongoose from "mongoose";

const MarketingAssetSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Ex: "Story Instagram"
  type: { 
    type: String, 
    enum: ["IMAGE", "TEXT"], 
    default: "IMAGE" 
  },
  // Pour une image :
  imageUrl: { type: String }, // Lien Cloudinary
  format: { type: String },   // Ex: "9:16", "Carré", "Bannière"
  
  // Pour un texte :
  textContent: { type: String }, // Le texte à copier
  
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.MarketingAsset || mongoose.model("MarketingAsset", MarketingAssetSchema);