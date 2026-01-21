import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import WithdrawalRequest from "@/models/WithdrawalRequest"; // ✅ On utilise le bon modèle synchronisé avec l'Admin
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic"; // Force le non-cache pour éviter les bugs de solde

// 🛠️ Helper : Récupérer l'ID User depuis le cookie
async function getUserIdFromToken(req) {
  const token = req.cookies.get("bookzy_token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch (error) {
    return null;
  }
}

// 📤 POST : Faire une demande de retrait
export async function POST(req) {
  try {
    await dbConnect();
    const userId = await getUserIdFromToken(req);

    if (!userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { amount, method, phoneNumber, country } = await req.json();

    // 1. Validation des champs
    if (!amount || !method || !phoneNumber || !country) {
      return NextResponse.json({ error: "Tous les champs (montant, méthode, numéro, pays) sont requis." }, { status: 400 });
    }

    // 2. Récupérer l'utilisateur
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

    // 3. Vérifier le solde
    const currentBalance = user.wallet?.balance || 0;
    if (amount > currentBalance) {
      return NextResponse.json({ error: "Solde insuffisant." }, { status: 400 });
    }

    // 🛡️ ANTI-SPAM : Vérifier s'il a déjà une demande "En attente"
    const existingPending = await WithdrawalRequest.findOne({
        userId: userId,
        status: "PENDING"
    });
    
    if (existingPending) {
        return NextResponse.json({ error: "Vous avez déjà une demande en cours. Attendez qu'elle soit traitée." }, { status: 400 });
    }

    // 🔥 4. RÈGLE INTELLIGENTE : 600 FCFA vs 5000 FCFA
    // On compte combien de retraits ont DÉJÀ été payés
    const countPaid = await WithdrawalRequest.countDocuments({ 
      userId: userId, 
      status: "PAID" 
    });

    let minThreshold = 5000; // Seuil standard
    
    // Si c'est son TOUT PREMIER retrait validé (compteur à 0), on baisse la limite
    if (countPaid === 0) {
      minThreshold = 500; // On met 500 pour que tes 600 FCFA passent large !
    }

    if (amount < minThreshold) {
      return NextResponse.json({ 
        error: `Le montant minimum est de ${minThreshold} FCFA ${countPaid === 0 ? "(Offre spéciale 1er retrait !)" : ""}` 
      }, { status: 400 });
    }

    // 5. TRANSACTION (Débit + Création)
    
    // A. On retire l'argent du solde
    user.wallet.balance -= amount;
    await user.save();

    // B. On crée la demande (Correction "Country" appliquée ici 👇)
    const payout = await WithdrawalRequest.create({
      userId,
      amount,
      method,
      country: country, // ✅ OBLIGATOIRE à la racine selon ton modèle
      details: { 
        phoneNumber: phoneNumber,
        country: country 
      },
      status: "PENDING",
      createdAt: new Date()
    });

    return NextResponse.json({
      success: true,
      message: "Demande de retrait envoyée avec succès !",
      newBalance: user.wallet.balance,
      data: payout
    });

  } catch (error) {
    console.error("❌ Erreur Payout:", error);
    return NextResponse.json({ error: "Erreur serveur lors de la demande." }, { status: 500 });
  }
}

// 📥 GET : Voir l'historique des retraits
export async function GET(req) {
  try {
    await dbConnect();
    const userId = await getUserIdFromToken(req);
    if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    // Récupérer tous les retraits du user, du plus récent au plus vieux
    const payouts = await WithdrawalRequest.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: payouts });

  } catch (error) {
    console.error("❌ Erreur History:", error);
    return NextResponse.json({ error: "Erreur serveur historique" }, { status: 500 });
  }
}