import mongoose from "mongoose";

const CommissionSchema = new mongoose.Schema({
  affiliateId: { // Le Parrain (qui reçoit l'argent)
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  referredUserId: { // Le Filleul (qui a acheté)
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  amount: { type: Number, required: true }, // Montant de la com (ex: 2000)
  sourceAmount: { type: Number, required: true }, // Montant de l'achat (ex: 10000)
  status: { 
    type: String, 
    enum: ['PENDING', 'VALIDATED', 'REFUNDED'], 
    default: 'VALIDATED' 
  },
  description: { type: String, default: "Commission sur abonnement" }
}, { timestamps: true });

export default mongoose.models.Commission || mongoose.model("Commission", CommissionSchema);