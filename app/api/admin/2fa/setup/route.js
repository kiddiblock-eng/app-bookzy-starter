import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { verifyAdmin } from "@/lib/auth";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

export async function POST(req) {
  try {
    await dbConnect();

    const { authorized, user } = await verifyAdmin(req);
    if (!authorized) {
      return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 403 });
    }

    const dbUser = await User.findById(user._id);

    // Générer un UNIQUE secret si pas encore créé
    let secret;
    if (!dbUser.security.twoFASecret) {
      const gen = speakeasy.generateSecret({
        name: "Bookzy Admin",
        length: 20,
      });
      dbUser.security.twoFASecret = gen.base32;
      await dbUser.save();
      secret = gen;
    } else {
      // Si déjà généré = regénérer l'URL correcte
      secret = {
        base32: dbUser.security.twoFASecret,
        otpauth_url: `otpauth://totp/Bookzy Admin?secret=${dbUser.security.twoFASecret}&issuer=Bookzy`,
      };
    }

    // Générer QR Code
    const qr = await QRCode.toDataURL(secret.otpauth_url);

    return NextResponse.json({
      success: true,
      qrCode: qr,
      secret: secret.base32,
    });

  } catch (err) {
    console.error("2FA SETUP ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}