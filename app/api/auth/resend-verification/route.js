// api/auth/resend-verification/route.js
// ✅ VERSION PRODUCTION avec noreply@bookzy.io

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { Resend } from "resend";
import { verifyEmailTemplate } from "@/lib/emailTemplates/verifyEmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

// Helper pour récupérer userId depuis cookie
function getUserIdFromCookie(req) {
  const cookie = req.headers.get("cookie") || "";
  const token = cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("bookzy_token="))
    ?.split("=")[1];
  
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded?.id || null;
  } catch {
    return null;
  }
}

export async function POST(req) {
  try {
    await dbConnect();

    // Récupérer userId depuis cookie ou body
    let userId = getUserIdFromCookie(req);
    
    if (!userId) {
      const body = await req.json();
      userId = body.userId;
    }

    if (!userId) {
      return NextResponse.json(
        { error: "Non authentifié. Connecte-toi d'abord." },
        { status: 401 }
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
        message: "Ton email est déjà vérifié."
      });
    }

    // 🔥 RATE LIMITING : Empêcher spam de resend
    const lastSent = user.emailVerificationSentAt;
    if (lastSent) {
      const timeSinceLastSent = Date.now() - new Date(lastSent).getTime();
      const oneMinute = 60 * 1000;
      
      if (timeSinceLastSent < oneMinute) {
        const secondsRemaining = Math.ceil((oneMinute - timeSinceLastSent) / 1000);
        return NextResponse.json(
          { 
            error: `Attends ${secondsRemaining} secondes avant de renvoyer l'email.`,
            remainingSeconds: secondsRemaining
          },
          { status: 429 }
        );
      }
    }

    // Génération du nouveau token (24h)
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
        to: user.email,
        subject: "✉️ Vérifie ton email Bookzy",
        html: html
      });

      // ✅ Vérifier si erreur Resend
      if (error) {
        console.error("❌ Erreur Resend:", error);
        throw new Error(error.message || "Erreur Resend");
      }

      console.log(`✅ Verification email renvoyé à ${user.email}`);
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
      message: "Email de vérification renvoyé avec succès. Vérifie ta boîte mail."
    });

  } catch (error) {
    console.error("❌ Erreur resend-verification:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne." },
      { status: 500 }
    );
  }
}