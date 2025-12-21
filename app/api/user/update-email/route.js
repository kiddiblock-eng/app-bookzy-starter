export const dynamic = "force-dynamic";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
import { confirmEmailTemplate } from "@/lib/emailTemplates/confirmEmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function PUT(req) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    await dbConnect();

    const { email } = await req.json();
    if (!email) {
      return new Response(
        JSON.stringify({ message: "Adresse e-mail manquante." }),
        { status: 400 }
      );
    }

    // Vérifie le cookie JWT
    const cookieHeader = req.headers.get("cookie");
    const tokenCookie = cookieHeader
      ?.split("; ")
      .find((c) => c.startsWith("bookzy_token="))
      ?.split("=")[1];

    if (!tokenCookie) {
      return new Response(
        JSON.stringify({ message: "Utilisateur non connecté." }),
        { status: 401 }
      );
    }

    // Vérifie et décode le token
    const decoded = jwt.verify(tokenCookie, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return new Response(
        JSON.stringify({ message: "Utilisateur introuvable." }),
        { status: 404 }
      );
    }

    // Crée un token temporaire de vérification (valable 1h)
    const verifyToken = jwt.sign(
      { uid: user._id, newEmail: email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const confirmUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/user/confirm-email?token=${verifyToken}`;

    // Enregistre l’e-mail en attente
    user.pendingEmail = email;
    await user.save();

    // ✉️ Envoi de l’e-mail de confirmation via Resend
    await resend.emails.send({
      from: "Bookzy <no-reply@bookzy.io>",
      to: email,
      subject: "📩 Confirme ton adresse e-mail sur Bookzy",
      html: confirmEmailTemplate(user.firstName || "créateur", confirmUrl),
    });

    return new Response(
      JSON.stringify({ success: true, message: "E-mail de confirmation envoyé !" }),
      { status: 200 }
    );

  } catch (err) {
    console.error("❌ Erreur update-email :", err);
    return new Response(
      JSON.stringify({ message: "Erreur interne du serveur." }),
      { status: 500 }
    );
  }
}
