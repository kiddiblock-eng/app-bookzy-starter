export const dynamic = "force-dynamic";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";



export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return new Response("Lien invalide", { status: 400 });
    }

    // ✅ Vérifie et décode le JWT
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return new Response("Lien expiré ou invalide", { status: 400 });
    }

    const { uid, newEmail } = payload;

    // 🔍 Vérifie l’utilisateur
    const user = await User.findById(uid);
    if (!user) {
      return new Response("Utilisateur introuvable", { status: 404 });
    }

    // 🔒 Vérifie que le pendingEmail correspond
    if (!user.pendingEmail || user.pendingEmail !== newEmail) {
      return new Response("Aucune demande de changement d’e-mail correspondante", { status: 400 });
    }

    // ✅ Met à jour l’e-mail
    user.email = newEmail;
    user.pendingEmail = null;
    user.emailVerified = true;
    await user.save();

    // 🎉 Redirige vers la page visuelle de confirmation
    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/parametre/email/confirmed`;
    return Response.redirect(successUrl, 302);
  } catch (err) {
    console.error("Erreur confirmation e-mail :", err);
    return new Response("Erreur serveur interne", { status: 500 });
  }
}
