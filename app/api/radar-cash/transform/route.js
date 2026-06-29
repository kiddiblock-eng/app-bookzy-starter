export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import { requireToolsUnlocked } from "@/lib/toolGate";
import { getAIText } from "@/lib/ai";

export async function POST(req) {
  try {
    await dbConnect();

    const user = await verifyAuth(req);
    if (!user) return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });

    const gate = await requireToolsUnlocked(user.id);
    if (gate.error) return gate.error;

    const { subject, pageName, bodyText } = await req.json();
    if (!subject) return NextResponse.json({ success: false, message: "Sujet requis." }, { status: 400 });

    const prompt = `Tu es un expert en création d'ebooks bestsellers pour le marché africain francophone.

Une publicité Facebook qui cartonne en ce moment :
- Page annonceur : "${pageName || "inconnue"}"
- Contenu : "${subject} — ${String(bodyText || "").substring(0, 150)}"

Ta mission : créer le MEILLEUR titre d'ebook possible sur ce sujet pour le vendre en Afrique francophone.

RÈGLES DU TITRE :
- Doit donner IMMÉDIATEMENT envie d'acheter
- Promesse concrète et atteignable (pas de chiffres irréalistes)
- Ton direct, pas académique
- Max 60 caractères
- Exemples de bons titres : "Devenir Indépendant Financièrement avec le Dropshipping", "Le Guide Complet pour Réussir ton Visa Canada", "Comment Gagner 300 000 FCFA par Mois avec Instagram"

CALCULE le gain estimé réaliste basé sur :
- Prix de vente conseillé : entre 2000 et 5000 FCFA selon le sujet
- 100 ventes en 1 mois = objectif atteignable

JSON STRICT :
{
  "titre": "Titre ultra-vendeur et accrocheur (max 60 caractères)",
  "description": "Ce que le lecteur va apprendre ou accomplir grâce à cet ebook (1 phrase directe)",
  "gainEstime": "Ex: 350 000 FCFA ce mois (100 ventes × 3 500 FCFA)",
  "ouVendre": "Ex: WhatsApp, Telegram, Taliopay"
}`;

    const result = await getAIText("nicheGenerate", prompt, 500);
    if (!result) return NextResponse.json({ success: false, message: "IA indisponible." }, { status: 503 });

    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return NextResponse.json({ success: false, message: "Erreur parsing." }, { status: 500 });

    const parsed = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ success: true, data: parsed });

  } catch (e) {
    console.error("❌ Erreur transform radar cash:", e);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}