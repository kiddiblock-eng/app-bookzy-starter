export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { getAIText } from "@/lib/ai";
import { dailyLessonEmail } from "@/lib/emailTemplates/dailyLesson";
import { Resend } from "resend";

// ── THÈMES PAR JOUR ──────────────────────────────────────────────────────────
const THEMES = {
  1: {
    label: "Lundi — Trouver un sujet winner",
    theme: "comment trouver un sujet d'ebook qui se vend bien en Afrique francophone en 2026",
    cta: "Trouver mon sujet winner",
    ctaUrl: "https://app.bookzy.io/dashboard/niche-hunter",
  },
  2: {
    label: "Mardi — Fixer le bon prix",
    theme: "comment fixer le prix idéal d'un ebook pour maximiser les ventes en Afrique francophone",
    cta: "Créer mon ebook",
    ctaUrl: "https://app.bookzy.io/dashboard/projets/nouveau",
  },
  3: {
    label: "Mercredi — Vendre sur WhatsApp",
    theme: "stratégies concrètes pour vendre des ebooks via WhatsApp et augmenter ses conversions",
    cta: "Voir mes ebooks",
    ctaUrl: "https://app.bookzy.io/dashboard/mes-ebooks",
  },
  4: {
    label: "Jeudi — Promouvoir sur les réseaux",
    theme: "comment promouvoir et vendre ses ebooks sur Instagram, TikTok et Facebook en 2026",
    cta: "Analyser une niche",
    ctaUrl: "https://app.bookzy.io/dashboard/niche-hunter",
  },
  5: {
    label: "Vendredi — Produit winner de la semaine",
    theme: "quel type d'ebook cartonne le plus en ce moment sur le marché francophone africain et pourquoi",
    cta: "Espionner les pubs",
    ctaUrl: "https://app.bookzy.io/dashboard/radar-cash",
  },
  6: {
    label: "Samedi — Stratégie avancée",
    theme: "une stratégie avancée pour créer une source de revenus passifs avec des ebooks numériques",
    cta: "Créer un roman IA",
    ctaUrl: "https://app.bookzy.io/dashboard/romans",
  },
  0: {
    label: "Dimanche — Rapport de la semaine",
    theme: "pourquoi créer et vendre des ebooks est l'une des meilleures opportunités business en Afrique en 2026",
    cta: "Voir mes opportunités",
    ctaUrl: "https://app.bookzy.io/dashboard/radar-cash",
  },
};

export async function GET(req) {
  // ✅ Instancié dans la fonction — pas au niveau module
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const secret = req.headers.get("x-cron-secret");
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    await dbConnect();

    const now = new Date();
    const dayOfWeek = now.getDay();
    const isDimanche = dayOfWeek === 0;
    const config = THEMES[dayOfWeek];

    const prompt = `Tu es un expert en marketing digital et vente d'ebooks en Afrique francophone.

Écris une leçon email quotidienne sur : "${config.theme}"

RÈGLES :
- Ton conversationnel, direct, motivant
- 3 paragraphes maximum
- Concret et actionnable, pas théorique
- Exemples réels du marché africain francophone
- Pas d'emojis dans le texte principal
- Terminer sur une note inspirante

Réponds en JSON STRICT :
{
  "subject": "Titre accrocheur de l'email (max 50 caractères)",
  "lesson": "3 paragraphes séparés par \\n\\n",
  "tip": "1 astuce concrète à appliquer aujourd'hui (max 100 mots)"
}`;

    const raw = await getAIText("nicheGenerate", prompt, 1500);
    if (!raw) return NextResponse.json({ error: "IA indisponible" }, { status: 503 });

    let content;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      content = JSON.parse(jsonMatch[0]);
    } catch {
      return NextResponse.json({ error: "Erreur parsing IA" }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const testEmail = searchParams.get("email");
    const isTest = searchParams.get("test") === "true" && testEmail;

    let users;
    if (isTest) {
      users = [{ name: "Roddy", firstName: "Roddy", email: testEmail, plan: "agence", ebooksCreated: 10, credits: { balance: 60 } }];
      console.log(`🧪 [DAILY EMAIL TEST] Envoi uniquement à ${testEmail}`);
    } else {
      users = await User.find({
        isActive: true,
        emailVerified: true,
        email: { $exists: true, $ne: "" },
      }).select("name firstName email plan ebooksCreated credits").lean();
    }

    if (!users.length) {
      return NextResponse.json({ success: true, sent: 0, message: "Aucun user actif" });
    }

    console.log(`📧 [DAILY EMAIL] ${config.label} — ${users.length} users`);

    let sent = 0;
    let errors = 0;

    const BATCH_SIZE = 50;
    for (let i = 0; i < users.length; i += BATCH_SIZE) {
      const batch = users.slice(i, i + BATCH_SIZE);

      await Promise.all(batch.map(async (user) => {
        try {
          const userName = user.firstName || user.name?.split(" ")[0] || "toi";

          const reportData = isDimanche ? {
            potentielFCFA: `${Math.floor(Math.random() * 200 + 100)}k FCFA`,
            nichesActives: Math.floor(Math.random() * 20 + 5),
            ebooksCreated: user.ebooksCreated || 0,
          } : null;

          const html = dailyLessonEmail({
            userName,
            subject: content.subject,
            lesson: content.lesson,
            tip: content.tip,
            ctaText: config.cta,
            ctaUrl: config.ctaUrl,
            dayLabel: config.label,
            reportData,
          });

          await resend.emails.send({
            from: "Bookzy <tips@bookzy.io>",
            to: user.email,
            subject: content.subject,
            html,
          });

          sent++;
        } catch (err) {
          errors++;
          console.warn(`⚠️ Email non envoyé à ${user.email}:`, err.message);
        }
      }));

      if (i + BATCH_SIZE < users.length) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    console.log(`✅ [DAILY EMAIL] Envoyé: ${sent} | Erreurs: ${errors}`);

    return NextResponse.json({
      success: true,
      day: config.label,
      subject: content.subject,
      sent,
      errors,
      total: users.length,
    });

  } catch (e) {
    console.error("❌ Erreur daily email:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}