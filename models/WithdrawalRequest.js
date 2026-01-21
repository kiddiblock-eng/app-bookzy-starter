import mongoose from "mongoose";

const WithdrawalRequestSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true, 
    min: 500 // 👇 CORRIGÉ : On met 500 pour autoriser le premier retrait "Offre de bienvenue"
  },
  
  country: {
    type: String,
    required: true, 
    enum: ['CI', 'SN', 'BJ', 'TG', 'ML', 'BF', 'NE', 'GN']
  },

  method: { 
    type: String, 
    required: true,
    enum: [
      'WAVE', 'ORANGE_MONEY', 'MTN_MOMO', 'MOOV_MONEY', 
      'AIRTEL_MONEY', 'FREE_MONEY', 'CELTIIS', 'TMONEY'
    ] 
  },

  // On regroupe souvent les infos techniques dans un objet "details" pour être flexible,
  // mais on peut aussi garder phoneNumber à plat. 
  // Pour être compatible avec mon code API précédent, je le garde ici, 
  // mais l'API Admin devra lire "phoneNumber" ou "details.phoneNumber".
  // 👉 Pour simplifier, je te conseille de mapper ça proprement dans l'API.
  details: {
    phoneNumber: { type: String, required: true },
    country: { type: String } // Optionnel si déjà en haut
  },

  status: { 
    type: String, 
    enum: ['PENDING', 'PAID', 'REJECTED'], 
    default: 'PENDING' 
  },
  
  adminNote: { type: String, default: "" },
  processedAt: { type: Date } 
}, { timestamps: true });

// 👇 TRÈS IMPORTANT : Le nom doit être "WithdrawalRequest" pour matcher l'Admin
export default mongoose.models.WithdrawalRequest || mongoose.model("WithdrawalRequest", WithdrawalRequestSchema);