import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Projet from "@/models/Projet"; // ✅ CHANGÉ
import { verifyAdmin } from "@/lib/auth";

export async function GET(req) {
  try {
    await dbConnect();

    // 🛡️ VERIFICATION ADMIN SÉCURISÉE
    const { authorized } = await verifyAdmin(req);
    if (!authorized) {
      return NextResponse.json(
        { success: false, message: "Non autorisé" },
        { status: 403 }
      );
    }

    // 📌 RÉCUPÉRATION ID
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID manquant" },
        { status: 400 }
      );
    }

    // 🔍 RÉCUPÉRATION PROJET
    const ebook = await Projet.findById(id) // ✅ CHANGÉ
      .populate("userId", "name email country");

    if (!ebook) {
      return NextResponse.json(
        { success: false, message: "Ebook introuvable" },
        { status: 404 }
      );
    }

    // 🚀 RÉPONSE CLEAN
    return NextResponse.json({
      success: true,
      ebook: {
        ...ebook.toObject(),
        user: ebook.userId, // uniformisation
      },
    });

  } catch (error) {
    console.error("❌ Erreur API get ebook:", error);
    return NextResponse.json(
      { success: false, message: "Erreur interne" },
      { status: 500 }
    );
  }
}