export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import WithdrawalRequest from "@/models/WithdrawalRequest"; // ✅ Modèle synchronisé
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// 🛡️ SÉCURITÉ ADMIN
async function checkAdmin() {
  const cookieStore = cookies();
  const token = cookieStore.get("bookzy_token")?.value || 
                cookieStore.get("admin_token")?.value || 
                cookieStore.get("token")?.value;

  if (!token) return false;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await dbConnect();
    const user = await User.findById(decoded.id);
    
    if (user && (user.role === "admin" || user.role === "super_admin")) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

// 1. GET : Lister les demandes (AVEC CORRECTION AFFICHAGE NUMÉRO)
export async function GET(req) {
  try {
    await dbConnect();
    
    if (!await checkAdmin()) {
      return NextResponse.json({ error: "Interdit" }, { status: 403 });
    }

    // On récupère tout, trié par date
    const rawPayouts = await WithdrawalRequest.find({})
      .populate("userId", "firstName lastName email")
      .sort({ createdAt: -1 });

    // 🪄 MAGIE : On reformate les données pour que l'Admin voie le numéro
    const formattedPayouts = rawPayouts.map(payout => {
      const p = payout.toObject();
      return {
        ...p,
        // 👇 C'est ici qu'on sort le numéro de la boîte "details"
        phoneNumber: p.details?.phoneNumber || p.phoneNumber || "Non spécifié",
        country: p.details?.country || p.country || "N/A",
        // Sécurisation de l'email au cas où le user est supprimé
        userEmail: p.userId?.email || "Utilisateur supprimé"
      };
    });

    return NextResponse.json({ success: true, data: formattedPayouts });

  } catch (error) {
    console.error("Admin Payouts GET Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// 2. PUT : Valider ou Rejeter (AVEC REMBOURSEMENT AUTO)
export async function PUT(req) {
  try {
    await dbConnect();

    if (!await checkAdmin()) {
      return NextResponse.json({ error: "Interdit" }, { status: 403 });
    }

    const body = await req.json();
    const { payoutId, status } = body; // status = 'PAID' ou 'REJECTED'

    if (!payoutId || !status) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    const request = await WithdrawalRequest.findById(payoutId);
    if (!request) {
      return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });
    }

    if (request.status !== "PENDING") {
      return NextResponse.json({ error: "Cette demande a déjà été traitée" }, { status: 400 });
    }

    // --- LOGIQUE DE TRAITEMENT ---

    if (status === "REJECTED") {
      // 💸 REMBOURSEMENT : Si on refuse, on rend l'argent à l'utilisateur
      const user = await User.findById(request.userId);
      if (user) {
        user.wallet.balance += request.amount; // On recrédite le solde
        await user.save();
        console.log(`↩️ Remboursement de ${request.amount} effectué pour ${user.email}`);
      }
    }

    // On met à jour le statut de la demande
    request.status = status;
    request.processedAt = new Date();
    await request.save();

    return NextResponse.json({ success: true, message: `Statut mis à jour: ${status}` });

  } catch (error) {
    console.error("Admin Payouts PUT Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}