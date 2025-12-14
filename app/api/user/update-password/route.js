import { dbConnect } from "../../../../lib/db";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function PUT(req) {
  try {
    await dbConnect();

    // 🔒 Authentification par token
    const token = cookies().get("bookzy_token")?.value;
    if (!token)
      return new Response(JSON.stringify({ message: "Non connecté" }), { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { ancien, nouveau } = await req.json();
    if (!ancien || !nouveau)
      return new Response(JSON.stringify({ message: "Champs manquants" }), { status: 400 });

    // 🧍‍♂️ Vérifie que l'utilisateur existe
    const user = await User.findById(userId);
    if (!user)
      return new Response(JSON.stringify({ message: "Utilisateur introuvable" }), { status: 404 });

    // 🔑 Vérifie l'ancien mot de passe
    const isMatch = await bcrypt.compare(ancien, user.password);
    if (!isMatch)
      return new Response(JSON.stringify({ message: "Ancien mot de passe incorrect" }), { status: 400 });

    // 🔐 Hash le nouveau mot de passe
    const hashed = await bcrypt.hash(nouveau, 10);
    user.password = hashed;
    await user.save();

    // 📧 Envoi du mail de notification
    try {
      await resend.emails.send({
        from: "Bookzy Sécurité <noreply@bookzy.io>",
        to: user.email,
        subject: "🔐 Changement de mot de passe sur ton compte Bookzy",
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 40px;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 30px; border: 1px solid #eee;">
              <img src="https://sucesspro.io/wp-content/uploads/2025/11/logo-horizontal-4.svg" width="140" alt="Bookzy" style="margin-bottom: 20px;" />
              <h2 style="color: #111827;">Ton mot de passe a été modifié avec succès 🔒</h2>
              <p style="color: #374151; font-size: 15px;">
                Bonjour ${user.firstName || "cher utilisateur"},<br><br>
                Nous te confirmons que ton mot de passe vient d’être mis à jour sur ton compte <b>Bookzy</b>.
              </p>
              <p style="color: #374151; font-size: 15px;">
                Si tu es à l’origine de cette modification, tu n’as rien à faire ✅.<br>
                <b>Mais si ce n’est pas toi</b>, change immédiatement ton mot de passe et contacte notre support via ton espace client.
              </p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
                 style="display:inline-block; margin-top:25px; background:#3b82f6; color:white; padding:12px 20px; border-radius:8px; text-decoration:none; font-weight:500;">
                 Accéder à mon compte
              </a>
              <p style="font-size:13px; color:#6b7280; margin-top:40px;">
                Cet e-mail a été envoyé automatiquement. Merci de ne pas y répondre.<br>
                © ${new Date().getFullYear()} Bookzy. Tous droits réservés.
              </p>
            </div>
          </div>
        `,
      });
    } catch (mailErr) {
      console.error("Erreur envoi email Resend :", mailErr);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Mot de passe mis à jour avec succès" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Erreur update-password:", err);
    return new Response(JSON.stringify({ message: "Erreur serveur" }), { status: 500 });
  }
}
