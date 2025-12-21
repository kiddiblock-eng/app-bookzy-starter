export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { verifyAdmin } from "@/lib/auth";

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

    const { twoFAEnabled, twoFAMethod, twoFAPhone } = await req.json();

    const validMethods = ["none", "email", "sms", "app"];
    if (!validMethods.includes(twoFAMethod)) {
      return NextResponse.json(
        { success: false, message: "Méthode 2FA invalide" },
        { status: 400 }
      );
    }

    await User.findByIdAndUpdate(user._id, {
      security: {
        twoFAEnabled,
        twoFAMethod,
        twoFAPhone: twoFAPhone || "",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Paramètres 2FA mis à jour",
    });

  } catch (error) {
    console.error("❌ Erreur update security:", error);
    return NextResponse.json(
      { success: false, message: "Erreur interne" },
      { status: 500 }
    );
  }
}