export const dynamic = "force-dynamic";
// api/auth/forgot-password/route.js
// ✅ VERSION PRODUCTION avec noreply@bookzy.io

import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { Resend } from "resend";
import jwt from "jsonwebtoken";
import { resetPasswordTemplate } from "@/lib/emailTemplates/resetPasswordTemplate";

// const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ message: "Email requis." }),
        { status: 400 }
      );
    }

    // 🔥 VALIDATION EMAIL FORMAT
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ message: "Format d'email invalide." }),
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    
    // ✅ SECURITY: Ne jamais révéler si l'email existe
    if (!user) {
      return new Response(
        JSON.stringify({ 
          success: true,
          message: "Si cet email existe, un lien a été envoyé."
        }),
        { status: 200 }
      );
    }

    // Génération du token valable 1h
    const token = jwt.sign(
      { uid: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;

    // 🔥 ENVOI EMAIL AVEC TRY/CATCH
    try {
      const html = resetPasswordTemplate({
        firstName: user.firstName || "cher utilisateur",
        resetLink: resetLink,
      });

      // ✅ PRODUCTION : noreply@bookzy.io
      const { data, error } = await resend.emails.send({
        from: "Bookzy <noreply@bookzy.io>",
        to: email,
        subject: "🔐 Réinitialisation de ton mot de passe Bookzy",
        html: html,
      });

      // ✅ Vérifier si erreur Resend
      if (error) {
        console.error("❌ Erreur Resend:", error);
        // On continue quand même pour ne pas révéler si l'email existe
      } else {
        console.log(`✅ Reset password email envoyé à ${email}`);
        console.log(`📧 Resend ID: ${data.id}`);
      }

    } catch (emailError) {
      console.error("❌ Erreur envoi email:", emailError);
      // ⚠️ On retourne quand même success pour ne pas révéler si l'email existe
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Si cet email existe, un lien de réinitialisation a été envoyé."
      }), 
      { status: 200 }
    );
    
  } catch (err) {
    console.error("❌ Erreur forgot-password:", err);
    return new Response(
      JSON.stringify({ message: "Erreur interne du serveur." }),
      { status: 500 }
    );
  }
}