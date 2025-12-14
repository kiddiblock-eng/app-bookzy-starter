import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { verifyAdmin } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await dbConnect();

    const { authorized, user } = await verifyAdmin(req);
    if (!authorized) {
      return NextResponse.json(
        { success: false, message: "Non autorisé" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Champs manquants" },
        { status: 400 }
      );
    }

    const dbUser = await User.findById(user._id);

    const isMatch = await bcrypt.compare(currentPassword, dbUser.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Mot de passe actuel incorrect" },
        { status: 400 }
      );
    }

    dbUser.password = newPassword;
    await dbUser.save();

    return NextResponse.json({
      success: true,
      message: "Mot de passe mis à jour",
    });

  } catch (error) {
    console.error("❌ Erreur update-password:", error);
    return NextResponse.json(
      { success: false, message: "Erreur interne" },
      { status: 500 }
    );
  }
}