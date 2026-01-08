export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db.js";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Projet from "@/models/Projet.js";

export async function POST(req, { params }) {
  try {
    await dbConnect();

    // 🔒 Authentification
    const token = cookies().get("bookzy_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { id } = params;
    const projet = await Projet.findById(id);

    if (!projet) {
      return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
    }

    // ✅ SÉCURITÉ 1 : Vérifier que c'est bien SON projet
    if (projet.userId.toString() !== userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    // ✅ SÉCURITÉ 2 : Vérifier qu'il a payé
    if (!projet.isPaid) {
      return NextResponse.json({ 
        error: "Ce projet nécessite un paiement" 
      }, { status: 403 });
    }

    // ✅ SÉCURITÉ 3 : Vérifier que c'est en erreur ou bloqué
    if (projet.status === "COMPLETED") {
      return NextResponse.json({ 
        error: "Ce projet est déjà terminé" 
      }, { status: 400 });
    }

    // ✅ SÉCURITÉ 4 : Limite de retries
    if (projet.retryCount >= 3) {
      return NextResponse.json({ 
        error: "Nombre maximum de tentatives atteint. Contacte le support à support@bookzy.io" 
      }, { status: 400 });
    }

    // ✅ Réinitialiser et incrémenter retry
    projet.status = "processing";
    projet.progress = 5;
    projet.errorMessage = null;
    projet.retryCount = (projet.retryCount || 0) + 1;
    await projet.save();

    console.log(`🔄 [RETRY] Projet ${id} relancé par user ${userId} (tentative ${projet.retryCount}/3)`);

    // ✅ CORRIGÉ : URL dynamique selon l'environnement
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://app.bookzy.io' 
      : 'http://localhost:3000';

    console.log(`🚀 [RETRY] Appel génération sur ${baseUrl}/api/ebooks/generate`);

    // ✅ Relancer la génération (sans attendre la réponse)
fetch(`${baseUrl}/api/ebooks/generate`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ projetId: id, force: true }) // ✅ AJOUTÉ force: true
})
.then(res => {
  console.log(`✅ [RETRY] Génération lancée, status: ${res.status}`);
  return res.json();
})
.then(data => {
  console.log(`✅ [RETRY] Réponse génération:`, data);
})
.catch(err => {
  console.error("❌ [RETRY] Erreur relance génération:", err.message);
});

    return NextResponse.json({ 
      success: true,
      message: "Génération relancée",
      retryCount: projet.retryCount
    });

  } catch (error) {
    console.error("❌ Erreur /api/projets/[id]/retry:", error);
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}
