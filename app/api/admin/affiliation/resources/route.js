export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import MarketingAsset from "@/models/MarketingAsset";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// 🛡️ SÉCURITÉ : Version Blindée & Bavarde (Debug)
async function checkAdmin() {
  const cookieStore = cookies();
  
  // 1. On cherche le token partout (bookzy_token OU admin_token OU token)
  const token = cookieStore.get("bookzy_token")?.value || 
                cookieStore.get("admin_token")?.value || 
                cookieStore.get("token")?.value;

  if (!token) {
    console.log("❌ API Admin: Aucun token trouvé dans les cookies.");
    return false;
  }

  try {
    // 2. On décrypte le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. On va chercher le User FRAIS dans la DB (au cas où le token est vieux)
    await dbConnect();
    const user = await User.findById(decoded.id);

    if (!user) {
      console.log("❌ API Admin: Utilisateur introuvable en DB.");
      return false;
    }

    console.log(`👤 API Check: User ${user.email} | Rôle: ${user.role}`);

    // 4. Vérification du rôle
    if (user.role === "admin" || user.role === "super_admin") {
      return true; // ✅ C'est bon !
    } else {
      console.log("⛔ API Admin: Rôle insuffisant.");
      return false;
    }

  } catch (error) {
    console.log("❌ API Admin Error:", error.message);
    return false;
  }
}

// --- 1. POST : Ajouter une ressource ---
export async function POST(req) {
  try {
    await dbConnect();
    
    // Vérification Admin
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Accès refusé. Vous n'êtes pas Admin." }, { status: 403 });
    }

    const body = await req.json();
    const { title, type, imageUrl, textContent, format } = body;

    if (!title || !type) {
      return NextResponse.json({ error: "Titre et Type obligatoires" }, { status: 400 });
    }

    const newAsset = await MarketingAsset.create({
      title,
      type,
      imageUrl,
      textContent,
      format,
      active: true
    });

    console.log("✅ Ressource ajoutée avec succès !");
    return NextResponse.json({ success: true, data: newAsset });

  } catch (error) {
    console.error("❌ Erreur Serveur POST:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// --- 2. DELETE : Supprimer une ressource ---
export async function DELETE(req) {
  try {
    await dbConnect();
    
    const isAdmin = await checkAdmin();
    if (!isAdmin) return NextResponse.json({ error: "Interdit" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

    await MarketingAsset.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Supprimé" });

  } catch (error) {
    console.error("❌ Erreur Serveur DELETE:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}