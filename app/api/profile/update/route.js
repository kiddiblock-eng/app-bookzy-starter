export const dynamic = "force-dynamic";
import { dbConnect } from "@/lib/db.js";
import User from "@/models/User.js";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { displayName, country, lang } = body;

    // Vérifie le token JWT
    const token = cookies().get("bookzy_token")?.value;
    if (!token) {
      return new Response(JSON.stringify({ error: "Non autorisé" }), { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // ✅ CORRECTION : Mettre à jour name, firstName ET lastName
    const updateData = {};
    
    if (displayName) {
      updateData.name = displayName;
      
      // Séparer le nom complet en firstName et lastName
      const [firstName, ...lastNameParts] = displayName.trim().split(' ');
      updateData.firstName = firstName || '';
      updateData.lastName = lastNameParts.join(' ') || '';
    }
    
    if (country) updateData.country = country;
    if (lang) updateData.lang = lang;

    console.log('🔄 Mise à jour profil:', updateData);

    // Mise à jour de l'utilisateur
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: false }
    ).select("-password");

    if (!user) {
      return new Response(JSON.stringify({ error: "Utilisateur introuvable" }), { status: 404 });
    }

    console.log('✅ Profil mis à jour:', user.name, user.firstName, user.lastName, user.country, user.lang);

    // ✅ Retourner displayName pour le frontend
    const responseUser = {
      ...user.toObject(),
      displayName: user.name
    };

    return new Response(JSON.stringify({ success: true, user: responseUser }), { status: 200 });
  } catch (error) {
    console.error("❌ Erreur /api/profile/update :", error);
    return new Response(JSON.stringify({ error: "Erreur serveur interne" }), { status: 500 });
  }
}