import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { verifyAdmin } from "@/lib/auth";
import speakeasy from "speakeasy";

export async function POST(req) {
  try {
    await dbConnect();

    const { authorized, user } = await verifyAdmin(req);
    if (!authorized) {
      return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 403 });
    }

    const { code } = await req.json();

    if (!code || code.length < 6) {
      return NextResponse.json(
        { success: false, message: "Code manquant" },
        { status: 400 }
      );
    }

    const dbUser = await User.findById(user._id);

    if (!dbUser.security?.twoFASecret) {
      return NextResponse.json(
        { success: false, message: "Aucun secret enregistré" },
        { status: 400 }
      );
    }

    // Vérification TOTP
    const isValid = speakeasy.totp.verify({
      secret: dbUser.security.twoFASecret,
      encoding: "base32",
      token: code,
      window: 1,
    });

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Code invalide" },
        { status: 400 }
      );
    }

    // OK
    dbUser.security.twoFAVerified = true;
    dbUser.security.twoFAEnabled = true;
    await dbUser.save();

    return NextResponse.json({
      success: true,
      message: "2FA activé avec succès",
    });

  } catch (err) {
    console.error("2FA VERIFY ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}