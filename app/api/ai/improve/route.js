export const dynamic = "force-dynamic";
export const maxDuration = 60;

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Projet from "@/models/Projet";
import User from "@/models/User";
import jwt from "jsonwebtoken";

function getUserIdFromCookie(req) {
  const cookie = req.headers.get("cookie") || "";
  const token = cookie.split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("bookzy_token="))
    ?.split("=")[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET)?.id || null;
  } catch {
    return null;
  }
}

const PROMPTS = {
  améliorer: (text) => `
Tu es un expert en rédaction professionnelle.

TÂCHE : Améliore ce texte pour le rendre plus professionnel, fluide et engageant.

RÈGLES STRICTES :
- Ne change PAS le sens du texte
- Garde le même ton général
- Corrige les fautes
- Rends le texte plus fluide
- Retourne UNIQUEMENT le texte amélioré
- AUCUN formatage : pas de gras, pas d'italique, pas de markdown
- PAS de ** ou * ou _ ou __ 
- PAS de <strong> ou <b> ou <em> ou <i>
- PAS d'introduction type "Voici le texte amélioré"
- PAS d'explications
- GARDE la même structure de paragraphes
- Sépare les paragraphes par des retours à la ligne

TEXTE À AMÉLIORER :
${text}

TEXTE AMÉLIORÉ (sans aucun formatage) :
`,

  corriger: (text) => `
Tu es un correcteur professionnel.

TÂCHE : Corrige UNIQUEMENT les fautes d'orthographe et de grammaire.

RÈGLES STRICTES :
- Ne change PAS le style
- Ne change PAS les mots (sauf fautes)
- Garde les mêmes phrases
- Retourne UNIQUEMENT le texte corrigé
- AUCUN formatage : pas de gras, pas d'italique, pas de markdown
- PAS de ** ou * ou _ ou __
- PAS de <strong> ou <b> ou <em> ou <i>
- PAS d'introduction
- PAS d'explications
- GARDE la même structure de paragraphes

TEXTE À CORRIGER :
${text}

TEXTE CORRIGÉ (sans aucun formatage) :
`,

  reformuler: (text) => `
Tu es un expert en reformulation.

TÂCHE : Reformule ce texte avec d'autres mots.

RÈGLES STRICTES :
- Garde EXACTEMENT le même sens
- Change la structure des phrases
- Utilise des synonymes
- Retourne UNIQUEMENT le texte reformulé
- AUCUN formatage : pas de gras, pas d'italique, pas de markdown
- PAS de ** ou * ou _ ou __
- PAS de <strong> ou <b> ou <em> ou <i>
- PAS d'introduction
- PAS d'explications
- GARDE la même structure de paragraphes

TEXTE À REFORMULER :
${text}

TEXTE REFORMULÉ (sans aucun formatage) :
`
};

function cleanAIResponse(text) {
  if (!text) return "";
  return text
    .replace(/^(Voici|Voilà|Ici|Here is|Here's)[\s\S]*?:\s*/i, "")
    .replace(/^(Texte|Text) (amélioré|corrigé|reformulé|improved|corrected)[\s\S]*?:\s*/i, "")
    .replace(/^```[\w]*\n?/gm, "")
    .replace(/\n?```$/gm, "")
    .replace(/\*\*\*/g, "")
    .replace(/\*\*/g, "")
    .replace(/(?<!\S)\*(?!\s)/g, "")
    .replace(/(?<!\s)\*(?!\S)/g, "")
    .replace(/__/g, "")
    .replace(/(?<!\S)_(?!\s)/g, " ")
    .replace(/(?<!\s)_(?!\S)/g, " ")
    .replace(/<strong>/gi, "").replace(/<\/strong>/gi, "")
    .replace(/<b>/gi, "").replace(/<\/b>/gi, "")
    .replace(/<em>/gi, "").replace(/<\/em>/gi, "")
    .replace(/<i>/gi, "").replace(/<\/i>/gi, "")
    .replace(/<u>/gi, "").replace(/<\/u>/gi, "")
    .replace(/<mark>/gi, "").replace(/<\/mark>/gi, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .replace(/^ +/gm, "")
    .replace(/ +$/gm, "")
    .trim();
}

// Coût en crédits par amélioration hors quota
const AI_EXTRA_CREDIT_COST = 0.5;

export async function POST(req) {
  try {
    await dbConnect();

    const userId = getUserIdFromCookie(req);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Non authentifié" }, { status: 401 });
    }

    const { text, action, projetId } = await req.json();

    if (!text || !action || !PROMPTS[action]) {
      return NextResponse.json({ success: false, error: "Paramètres invalides" }, { status: 400 });
    }

    if (text.length > 5000) {
      return NextResponse.json({ success: false, error: "Texte trop long (max 5000 caractères)" }, { status: 400 });
    }

    console.log(`🤖 [AI Improve] Action: ${action} | User: ${userId} | Texte: ${text.length} chars`);

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "Utilisateur introuvable" }, { status: 404 });
    }

    // Initialiser aiUsage si n'existe pas
    if (!user.aiUsage) {
      user.aiUsage = { usedToday: 0, dailyLimit: 3, lastResetDate: new Date() };
      await user.save();
      console.log("✅ [AI Improve] aiUsage créé pour l'utilisateur");
    }

    // Reset quota quotidien si besoin
    const today = new Date().setHours(0, 0, 0, 0);
    const lastReset = user.aiUsage.lastResetDate
      ? new Date(user.aiUsage.lastResetDate).setHours(0, 0, 0, 0) : 0;

    if (today > lastReset) {
      user.aiUsage.usedToday = 0;
      user.aiUsage.dailyLimit = 3;
      user.aiUsage.lastResetDate = new Date();
      await user.save();
      console.log("✅ [AI Improve] Quota quotidien réinitialisé");
    }

    const canUseDaily = user.aiUsage.usedToday < user.aiUsage.dailyLimit;
    let usedDailyQuota = false;
    let usedExtraCredit = false;

    if (canUseDaily) {
      // Dans le quota gratuit
      user.aiUsage.usedToday += 1;
      await user.save();
      usedDailyQuota = true;
      console.log(`✅ [AI Improve] Quota gratuit utilisé (${user.aiUsage.usedToday}/${user.aiUsage.dailyLimit})`);
    } else {
      // ✅ Hors quota — déduire 0.5 crédit (plus de FCFA)
      const currentBalance = user.credits?.balance ?? 0;

      if (currentBalance < AI_EXTRA_CREDIT_COST) {
        return NextResponse.json(
          {
            success: false,
            insufficientCredits: true,
            error: `Crédits insuffisants. Il vous faut ${AI_EXTRA_CREDIT_COST} crédit pour cette amélioration.`
          },
          { status: 402 }
        );
      }

      user.credits.balance = Math.round((currentBalance - AI_EXTRA_CREDIT_COST) * 10) / 10;
      await user.save();
      usedExtraCredit = true;
      console.log(`💳 [AI Improve] 0.5 crédit déduit — solde: ${user.credits.balance}`);

      // Mettre à jour le compteur sur le projet si fourni
      if (projetId) {
        const projet = await Projet.findById(projetId);
        if (projet) {
          projet.aiImprovementsUsed = (projet.aiImprovementsUsed || 0) + 1;
          await projet.save();
        }
      }
    }

    // Nettoyer le texte d'entrée
    const cleanInputText = text
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();

    const prompt = PROMPTS[action](cleanInputText);

    let improvedText;
    try {
      console.log("🤖 [AI Improve] Appel Gemini 2.5 Flash...");
      const { GoogleGenerativeAI } = require("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(prompt);
      improvedText = cleanAIResponse(result.response.text());
      console.log(`✅ [AI Improve] Texte amélioré (${improvedText.length} chars)`);
    } catch (aiError) {
      console.error("❌ [AI Improve] Erreur Gemini:", aiError);

      // Rembourser le crédit si l'IA a planté après déduction
      if (usedExtraCredit) {
        user.credits.balance = Math.round((user.credits.balance + AI_EXTRA_CREDIT_COST) * 10) / 10;
        await user.save();
        console.log(`↩️ [AI Improve] 0.5 crédit remboursé suite à erreur Gemini`);
      }

      if (aiError.status === 429) {
        return NextResponse.json(
          { success: false, error: "Trop de requêtes. Réessayez dans quelques secondes." },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { success: false, error: "Erreur lors de l'amélioration du texte" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      improvedText,
      usedDailyQuota,
      usedExtraCredit,
      remainingDailyQuota: usedDailyQuota ? user.aiUsage.dailyLimit - user.aiUsage.usedToday : 0,
      newBalance: usedExtraCredit ? user.credits.balance : undefined
    });

  } catch (error) {
    console.error("❌ [AI Improve] Erreur:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}