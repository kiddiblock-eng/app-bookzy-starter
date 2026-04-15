export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Roman from "@/models/Roman";
import User from "@/models/User";
import { verifyAuth } from "@/lib/auth";
import { getAIText } from "@/lib/ai";
import { generateRomanHTML } from "@/lib/romanTemplates";
import puppeteer from "puppeteer";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadPdfToCloudinary(pdfBuffer, filename) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "raw", folder: "bookzy/romans", public_id: filename, format: "pdf" },
      (error, result) => error ? reject(error) : resolve(result.secure_url)
    );
    stream.end(pdfBuffer);
  });
}

const LONGUEUR_CONFIG = {
  court:  { chapitres: 6,  motsParChapitre: 900  },
  moyen:  { chapitres: 10, motsParChapitre: 1200 },
  long:   { chapitres: 15, motsParChapitre: 1500 },
};

export async function POST(req, { params }) {
  try {
    await dbConnect();

    const user = await verifyAuth(req);
    if (!user) return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });

    const roman = await Roman.findOne({ _id: params.id, userId: user.id });
    if (!roman) return NextResponse.json({ success: false, message: "Roman introuvable." }, { status: 404 });

    const userDoc = await User.findById(user.id);
    if (!userDoc) return NextResponse.json({ success: false, message: "Introuvable." }, { status: 404 });

    // Déjà complété → retourner URL Cloudinary si disponible
    if (roman.status === "completed" && roman.chapters?.length > 1) {
      if (roman.pdfUrl) {
        console.log(`🔄 [ROMAN RETÉLÉCHARGÉ via Cloudinary] ${roman.title} — ${userDoc.email}`);
        return NextResponse.json({ success: true, pdfUrl: roman.pdfUrl });
      }
      // Pas d'URL → regénérer et uploader
      const html = generateRomanHTML(roman.toObject());
      const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"] });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });
      const pdfBuffer = await page.pdf({ format: "A5", printBackground: true, margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" } });
      await browser.close();
      try {
        const filename = `${roman._id}-${roman.title.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}`;
        const pdfUrl = await uploadPdfToCloudinary(pdfBuffer, filename);
        roman.pdfUrl = pdfUrl;
        await roman.save();
        return NextResponse.json({ success: true, pdfUrl });
      } catch {
        const filename = `${roman.title.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "-").toLowerCase()}.pdf`;
        return new NextResponse(pdfBuffer, { status: 200, headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${filename}"` } });
      }
    }

    // ── Vérifier crédits ─────────────────────────────────────────────────────
    const balance = userDoc.credits?.balance ?? 0;
    const creditsRequired = roman.creditsRequired || 20;

    if (balance < creditsRequired) {
      return NextResponse.json({
        success: false,
        insufficientCredits: true,
        required: creditsRequired,
        balance,
        message: `Crédits insuffisants. Il vous faut ${creditsRequired} crédits.`,
      }, { status: 402 });
    }

    // ── Déduire crédits immédiatement ────────────────────────────────────────
    userDoc.credits.balance -= creditsRequired;
    userDoc.credits.totalSpent = (userDoc.credits.totalSpent || 0) + creditsRequired;
    await userDoc.save();

    // ── Générer chapitres 2 à N en séquence ──────────────────────────────────
    const config = LONGUEUR_CONFIG[roman.longueur] || LONGUEUR_CONFIG.moyen;
    const chapterPlans = roman.chapterPlans || [];
    const existingChapters = roman.chapters || [];
    const allChapters = [...existingChapters];

    // Résumé cumulatif des chapitres précédents
    let previousSummary = `Chapitre 1 "${existingChapters[0]?.title}": ${existingChapters[0]?.content?.substring(0, 300)}...`;

    for (let i = 1; i < chapterPlans.length; i++) {
      const chPlan = chapterPlans[i];

      const prompt = `Tu es l'auteur du roman "${roman.title}" (${roman.genre}).

${roman.bible}

Synopsis : ${roman.synopsis}

RÉSUMÉ DE CE QUI S'EST PASSÉ AVANT (à respecter pour la continuité) :
${previousSummary}

Plan du chapitre suivant :
${chapterPlans.slice(i).map(c => `CH${c.numero} "${c.titre}": ${c.resume}`).join("\n")}

Écris maintenant le CHAPITRE ${chPlan.numero} : "${chPlan.titre}"
Ce qui doit se passer : ${chPlan.resume}

RÈGLES ABSOLUES :
- Minimum ${config.motsParChapitre} mots
- Utilise EXACTEMENT les mêmes noms que dans la bible et les chapitres précédents
- Continue EXACTEMENT là où le chapitre précédent s'est arrêté
- Prose narrative fluide, dialogues entre guillemets français « »
- ${i < chapterPlans.length - 1 ? "Termine avec du suspense pour donner envie de lire la suite" : "Termine l'histoire de façon satisfaisante et mémorable"}
- Commence directement le texte narratif

Écris uniquement le contenu narratif.`;

      const content = await getAIText("nicheGenerate", prompt, 3000);

      const chapter = {
        number: chPlan.numero,
        title: chPlan.titre,
        content: content || `[Chapitre ${chPlan.numero}]`,
        wordCount: content ? content.split(/\s+/).length : 0,
      };

      allChapters.push(chapter);

      // Mettre à jour le résumé cumulatif
      previousSummary += `\n\nChapitre ${chPlan.numero} "${chPlan.titre}": ${content?.substring(0, 300)}...`;
    }

    // ── Générer le PDF ────────────────────────────────────────────────────────
    const romanData = {
      ...roman.toObject(),
      chapters: allChapters,
    };

    const html = generateRomanHTML(romanData);

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A5",
      printBackground: true,
      margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
    });

    await browser.close();

    // ── Sauvegarder chapitres complets ───────────────────────────────────────
    const totalWords = allChapters.reduce((s, c) => s + (c.wordCount || 0), 0);
    roman.chapters = allChapters;
    roman.totalWords = totalWords;
    roman.totalPages = Math.round(totalWords / 250);
    roman.status = "completed";
    roman.creditsUsed = creditsRequired;

    // ── Upload PDF sur Cloudinary ─────────────────────────────────────────────
    try {
      const filename = `${roman._id}-${roman.title.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}`;
      const pdfUrl = await uploadPdfToCloudinary(pdfBuffer, filename);
      roman.pdfUrl = pdfUrl;
      console.log(`☁️ PDF uploadé sur Cloudinary: ${pdfUrl}`);
    } catch (uploadErr) {
      console.warn("⚠️ Upload Cloudinary échoué:", uploadErr.message);
    }

    await roman.save();

    console.log(`✅ [ROMAN GÉNÉRÉ]
  → ID       : ${roman._id}
  → Titre    : ${roman.title}
  → Genre    : ${roman.genre}
  → Template : ${roman.template}
  → Longueur : ${roman.longueur} (${allChapters.length} chapitres)
  → Mots     : ${totalWords}
  → Pages    : ${Math.round(totalWords / 250)}
  → User     : ${userDoc.email}
  → Crédits  : -${creditsRequired} (solde: ${userDoc.credits.balance})
  → Personnages : ${roman.personnages?.map(p => p.nom).join(", ") || "IA"}`);

    // ── Envoyer email notification ────────────────────────────────────────────
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "Bookzy <noreply@bookzy.io>",
        to: userDoc.email,
        subject: `Votre roman "${roman.title}" est prêt`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; color: #1a1a1a;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="width: 56px; height: 56px; background: #0f172a; border-radius: 14px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                <span style="color: white; font-size: 24px;">📖</span>
              </div>
              <h1 style="font-size: 24px; font-weight: 700; color: #0f172a; margin: 0 0 8px;">Votre roman est prêt !</h1>
              <p style="color: #64748b; font-size: 14px; margin: 0;">Il a été généré avec succès par Bookzy</p>
            </div>
            <div style="background: #f8fafc; border-radius: 12px; padding: 20px 24px; margin-bottom: 24px;">
              <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 4px; font-style: italic;">${roman.title}</h2>
              <p style="font-size: 13px; color: #64748b; margin: 0 0 16px; text-transform: capitalize;">${roman.genre} · ${allChapters.length} chapitres · ${Math.round(totalWords / 1000)}k mots</p>
              <p style="font-size: 14px; color: #374151; line-height: 1.6; margin: 0; font-style: italic;">${roman.synopsis}</p>
            </div>
            <p style="font-size: 13px; color: #64748b; text-align: center; margin: 0;">
              Connectez-vous à votre dashboard Bookzy pour retrouver et télécharger votre roman.
            </p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.warn("⚠️ Email non envoyé:", emailErr.message);
    }

    // ── Retourner le PDF ──────────────────────────────────────────────────────
    const filename = `${roman.title.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "-").toLowerCase()}.pdf`;

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": pdfBuffer.length.toString(),
        "X-New-Balance": String(userDoc.credits.balance),
      },
    });

  } catch (e) {
    console.error("❌ Erreur download roman:", e);
    return NextResponse.json({ success: false, message: "Erreur: " + e.message }, { status: 500 });
  }
}