import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { verifyAdmin } from "@/lib/auth";

export async function POST(req) {
  try {
    await dbConnect();

    // Vérification admin
    const admin = await verifyAdmin(req);
    if (!admin?.authorized) {
      return NextResponse.json(
        { success: false, message: "Non autorisé" },
        { status: 403 }
      );
    }

    // Lecture du body
    const { userId, isActive } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId manquant" },
        { status: 400 }
      );
    }

    if (typeof isActive !== "boolean") {
      return NextResponse.json(
        { success: false, message: "Valeur isActive invalide" },
        { status: 400 }
      );
    }

    // Mise à jour
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { isActive } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Utilisateur introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });

  } catch (error) {
    console.error("❌ toggle-active error:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}