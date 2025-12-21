// api/auth/send-verification/route.js
// ✅ VERSION PRODUCTION avec noreply@bookzy.io

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
import { verifyEmailTemplate } from "@/lib/emailTemplates/verifyEmailTemplate";
export const dynamic = 'force-dynamic';
// const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    await dbConnect();
    const { userId, email } = await req.json();

    // Validation
    if (!userId || !email) {
      return NextResponse.json(
        { error: "userId et email requis." },
        { status: 400 }
      );
    }

    // Validation format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Format d'email invalide." },
        { status: 400 }
      );
    }

    // Recherche utilisateur
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur introuvable." },
        { status: 404 }
      );
    }

    // Vérifier si déjà vérifié
    if (user.emailVerified) {
      return NextResponse.json({
        success: true,
        message: "Email déjà vérifié."
      });
    }

    // Génération du token de vérification (24h)
    const token = jwt.sign(
      { uid: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const verifyLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${token}`;

    // Envoi email
    try {
      const html = verifyEmailTemplate({
        firstName: user.firstName || "cher utilisateur",
        verifyLink: verifyLink
      });

      // ✅ PRODUCTION : noreply@bookzy.io
      const { data, error } = await resend.emails.send({
        from: "Bookzy <noreply@bookzy.io>",
        to: email,
        subject: "✉️ Vérifie ton email Bookzy",
        html: html
      });

      // ✅ Vérifier si erreur Resend
      if (error) {
        console.error("❌ Erreur Resend:", error);
        throw new Error(error.message || "Erreur Resend");
      }

      console.log(`✅ Verification email envoyé à ${email}`);
      console.log(`📧 Resend ID: ${data.id}`);

      // Mise à jour de la date d'envoi
      user.emailVerificationSentAt = new Date();
      await user.save();

    } catch (emailError) {
      console.error("❌ Erreur envoi verification email:", emailError);
      return NextResponse.json(
        { error: "Erreur lors de l'envoi de l'email." },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: "Email de vérification envoyé avec succès."
    });

  } catch (error) {
    console.error("❌ Erreur send-verification:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne." },
      { status: 500 }
    );
  }
}