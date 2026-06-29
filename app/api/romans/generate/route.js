export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Roman from "@/models/Roman";
import User from "@/models/User";
import { verifyAuth } from "@/lib/auth";
import { requireToolsUnlocked } from "@/lib/toolGate";
import { getAIText } from "@/lib/ai";

const LONGUEUR_CONFIG = {
  court:  { chapitres: 6,  motsParChapitre: 900,  creditsFull: 20 },
  moyen:  { chapitres: 10, motsParChapitre: 1200, creditsFull: 35 },
  long:   { chapitres: 15, motsParChapitre: 1500, creditsFull: 50 },
};

const GENRE_CONTEXT = {
  thriller:  "suspense intense, danger constant, retournements de situation",
  romance:   "histoire d'amour captivante, émotions profondes, tension romantique",
  aventure:  "action, voyages, découvertes, héros courageux",
  drame:     "conflits humains profonds, émotions complexes, réalisme",
  fantasy:   "monde imaginaire, magie, créatures, quête épique",
  policier:  "enquête, indices, suspects, révélation finale surprenante",
};

export async function POST(req) {
  try {
    await dbConnect();

    const user = await verifyAuth(req);
    if (!user) return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });

    const gate = await requireToolsUnlocked(user.id);
    if (gate.error) return gate.error;

    const body = await req.json();
    const { genre, cadre, longueur, ton, publicCible, template, personnages, decor, epoque, intrigue, twist } = body;

    if (!genre || !longueur) return NextResponse.json({ success: false, message: "Genre et longueur requis." }, { status: 400 });

    const config = LONGUEUR_CONFIG[longueur] || LONGUEUR_CONFIG.moyen;
    const genreDesc = GENRE_CONTEXT[genre] || genre;

    const personnagesDesc = personnages?.length > 0
      ? personnages.filter(p => p.nom).map(p =>
          `${p.nom} (${p.role}${p.age ? ", " + p.age + " ans" : ""}${p.description ? ": " + p.description : ""})`
        ).join(", ")
      : "à définir par l'IA";

    // ── BIBLE DU ROMAN — transmise à chaque chapitre pour la cohérence ──────
    const bible = `=== BIBLE DU ROMAN (À RESPECTER ABSOLUMENT) ===
Genre : ${genre} (${genreDesc})
Cadre : ${cadre || "universel"} — Lieu précis : ${decor || "à définir"}
Époque : ${epoque || "contemporaine"}
Ton : ${ton || "dramatique"}
Personnages FIXES (ne jamais changer leurs noms) : ${personnagesDesc}
Intrigue : ${intrigue || "une histoire captivante dans ce genre"}
${twist ? `Rebondissement prévu : ${twist}` : ""}
=== FIN BIBLE ===`;

    // ── UN SEUL APPEL : Plan + Chapitre 1 (plus rapide) ─────────────────
    const planPrompt = `Tu es un auteur de romans professionnels francophone.

${bible}

Crée un plan de ${config.chapitres} chapitres ET écris le chapitre 1 complet dans le même JSON.
Les noms des personnages doivent être EXACTEMENT ceux de la bible.

JSON STRICT :
{
  "titre": "Titre accrocheur du roman",
  "synopsis": "Résumé captivant de 3-4 phrases",
  "chapitres": [
    { "numero": 1, "titre": "Titre du chapitre", "resume": "Ce qui se passe en 2 phrases, comment ca se termine" }
  ],
  "chapitre1": "Texte complet du chapitre 1 — minimum ${config.motsParChapitre} mots, prose narrative, dialogues entre guillemets français, commence directement"
}`;

    const planRaw = await getAIText("nicheGenerate", planPrompt, 5000);
    if (!planRaw) return NextResponse.json({ success: false, message: "IA indisponible." }, { status: 503 });

    let plan;
    try {
      const jsonMatch = planRaw.match(/\{[\s\S]*\}/);
      plan = JSON.parse(jsonMatch[0]);
    } catch {
      return NextResponse.json({ success: false, message: "Erreur génération plan." }, { status: 500 });
    }

    const ch1Plan = plan.chapitres?.[0] || { numero: 1, titre: "Chapitre 1", resume: "" };
    const ch1Content = plan.chapitre1 || "";

    // ── Sauvegarder en DB ────────────────────────────────────────────────────
    const roman = await Roman.create({
      userId: user.id,
      title: plan.titre,
      genre, cadre, longueur, ton, publicCible, template,
      personnages: personnages?.filter(p => p.nom) || [],
      decor, epoque, intrigue, twist,
      synopsis: plan.synopsis,
      bible,
      chapterPlans: plan.chapitres,
      chapters: [{
        number: 1,
        title: ch1Plan.titre,
        content: ch1Content || "",
        wordCount: ch1Content ? ch1Content.split(/\s+/).length : 0,
      }],
      status: "preview",
      creditsRequired: config.creditsFull,
    });

    console.log(`📖 [ROMAN APERÇU]
  → ID    : ${roman._id}
  → Titre : ${plan.titre}
  → Genre : ${genre} · ${longueur}
  → User  : ${user.id}`);

    return NextResponse.json({
      success: true,
      data: {
        romanId: roman._id,
        title: plan.titre,
        synopsis: plan.synopsis,
        genre,
        template,
        firstChapter: {
          number: 1,
          title: ch1Plan.titre,
          content: ch1Content || "",
        },
        totalChapters: config.chapitres,
        creditsRequired: config.creditsFull,
      },
    });

  } catch (e) {
    console.error("❌ Erreur génération roman:", e);
    return NextResponse.json({ success: false, message: "Erreur: " + e.message }, { status: 500 });
  }
}