export const dynamic = "force-dynamic";
// api/auth/reset-password/route.js

import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await dbConnect();
    const { token, password } = await req.json();

    // Validation
    if (!token || !password) {
      return new Response(
        JSON.stringify({ message: "Requête incomplète." }),
        { status: 400 }
      );
    }

    // ✅ Validation du mot de passe côté serveur
    if (password.length < 8) {
      return new Response(
        JSON.stringify({ message: "Le mot de passe doit contenir au moins 8 caractères." }),
        { status: 400 }
      );
    }

    // ✅ Meilleure gestion des erreurs JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return new Response(
          JSON.stringify({ message: "Le lien a expiré. Fais une nouvelle demande." }),
          { status: 401 }
        );
      }
      return new Response(
        JSON.stringify({ message: "Lien invalide." }),
        { status: 401 }
      );
    }

    const user = await User.findById(decoded.uid);
    
    if (!user) {
      return new Response(
        JSON.stringify({ message: "Utilisateur introuvable." }),
        { status: 404 }
      );
    }

    // ✅ CORRECTION : Mettre le mot de passe en clair
    // Le hook pre("save") va automatiquement le hasher
    user.password = password;
    user.lastPasswordChange = new Date();
    await user.save();

    console.log('✅ Mot de passe réinitialisé pour:', user.email);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Mot de passe mis à jour avec succès."
      }), 
      { status: 200 }
    );
    
  } catch (err) {
    console.error("Erreur reset-password:", err);
    return new Response(
      JSON.stringify({ message: "Erreur interne du serveur." }),
      { status: 500 }
    );
  }
}