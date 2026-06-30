export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Projet from "@/models/Projet";
import { getUserFromToken } from "@/lib/auth";

export async function POST(req, { params }) {
  try {
    await dbConnect();

    const { id } = params;
    const { transactionId } = await req.json();

    const user = await getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });
    }

    // 🔍 Vérification du projet
    const projet = await Projet.findById(id);
    if (!projet) {
      return NextResponse.json(
        { success: false, message: "Projet introuvable" },
        { status: 404 }
      );
    }

    // 🔒 Propriété : on ne débloque que SON propre projet
    if (String(projet.userId) !== String(user._id)) {
      return NextResponse.json({ success: false, message: "Accès refusé" }, { status: 403 });
    }

    // ✅ Mise à jour du paiement
    projet.isPaid = true;
    projet.transactionId = transactionId || null;
    projet.updatedAt = new Date();
    await projet.save();

    console.log("💳 Paiement confirmé :", {
      projetId: id,
      transactionId,
      titre: projet.titre,
    });

    return NextResponse.json({
      success: true,
      message: "Paiement confirmé et projet débloqué 🎉",
      projet: {
        id: projet._id.toString(),
        titre: projet.titre,
        isPaid: true,
        transactionId: projet.transactionId,
      },
    });
  } catch (error) {
    console.error("❌ Erreur /api/projets/[id]/pay :", error);
    return NextResponse.json(
      { success: false, message: "Erreur lors de la validation du paiement" },
      { status: 500 }
    );
  }
}
