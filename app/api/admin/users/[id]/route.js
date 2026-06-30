export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import Projet from "@/models/Projet"; // ✅ CHANGÉ
import { verifyAdmin } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const admin = await verifyAdmin(req);
    if (!admin?.authorized) {
      return NextResponse.json(
        { success: false, message: "Non autorisé" },
        { status: 403 }
      );
    }

    const userId = params?.id;
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "ID manquant" },
        { status: 400 }
      );
    }

    // 🔍 Récupérer l'utilisateur
    const user = await User.findById(userId).select("-password -security.twoFASecret").lean();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Utilisateur introuvable" },
        { status: 404 }
      );
    }

    // 📚 Récupérer ses eBooks (projets complétés)
    const ebooks = await Projet.find({ 
      userId,
      status: "COMPLETED" // ✅ AJOUTÉ
    }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      user,
      ebooks,
    });
  } catch (error) {
    console.error("❌ /admin/users/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}