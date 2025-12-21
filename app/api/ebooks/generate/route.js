import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
import Projet from "../../../../models/Projet";
import User from "../../../../models/User";
import Transaction from "../../../../models/Transaction"; 
import { Resend } from "resend";
import { ebookReadyTemplate } from "../../../../lib/emailTemplates/ebookReadyTemplate";
import { getAIText } from "../../../../lib/ai";
import { generateStyledHTML } from "../../../../lib/pdf/htmlGenerator"; 
import { uploadBufferToCloudinary } from "../../../../lib/cloudinary";
import {
  getSummaryPrompt,
  getIntroPrompt,
  getChapterPrompt,
  getConclusionPrompt,
  EBOOK_SYSTEM_PROMPT
} from "../../../../lib/prompts/ebookPrompts";
import jwt from "jsonwebtoken";
import puppeteer from "puppeteer";

// Augmentation du temps max pour Vercel (5 minutes)
export const maxDuration = 300;
export const memory = 1024;    
export const dynamic = 'force-dynamic';
const resend = new Resend(process.env.RESEND_API_KEY);
const delay = (ms) => new Promise(res => setTimeout(res, ms));

// Nettoyage du Markdown pour éviter les astérisques dans le PDF
function cleanMarkdown(text) {
  if (!text) return "";
  return text
    .replace(/\*\*/g, "")   
    .replace(/\*/g, "")     
    .replace(/#{1,6}\s?/g, "") 
    .replace(/```html/g, "") 
    .replace(/```/g, "")
    .replace(/---/g, "")    
    .trim();
}

// Fonction Retry pour la stabilité de l'IA
async function getAIWithRetry(context, prompt, maxTokens, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            return await getAIText(context, prompt, maxTokens);
        } catch (error) {
            const isOverloaded = error.message.includes("503") || error.message.includes("Overloaded") || error.message.includes("fetch failed");
            if (isOverloaded && i < retries - 1) {
                console.warn(`⚠️ IA Surchargée (Essai ${i+1}). Pause...`);
                await delay(4000); 
                continue;
            }
            throw error;
        }
    }
}

// --- TÂCHE DE FOND : GÉNÉRATION DE A à Z ---
async function generateEbookBackgroundTask(projetId, userId, providedOutline = null) {
  console.log(`🚀 [BACKGROUND] Démarrage projet ${projetId}`);
  
  try {
    await dbConnect();
    const projet = await Projet.findById(projetId);
    
    // Récupération sécurisée de l'utilisateur
    let finalUserId = userId;
    if (!finalUserId && projet.userId) finalUserId = projet.userId;
    if (!finalUserId && projet.transactionId) {
       const tx = await Transaction.findById(projet.transactionId);
       if (tx) finalUserId = tx.userId;
    }
    
    const user = await User.findById(finalUserId);
    if (!projet) return;

    const { titre, description, tone, audience, pages, chapters, template } = projet;
    const authorName = user?.firstName || user?.nom || "Auteur"; 
    
    // --- 1. CALCUL STRICT DES MOTS (ANTI-DÉBORDEMENT) ---
    const totalChapters = Math.max(1, Number(chapters) || 5);
    // On limite : 1 page standard = ~220 mots pour un ebook aéré
    const WORDS_PER_PAGE = 220; 
    
    // Total théorique
    const totalWordsTarget = Math.max(10, Number(pages)) * WORDS_PER_PAGE;
    
    // Répartition : 80% pour les chapitres, 20% pour intro/conclu
    const chapterWordsTotal = Math.floor(totalWordsTarget * 0.80);
    const wordsPerChapter = Math.floor(chapterWordsTotal / totalChapters);
    
    // Limitation des tokens pour l'IA (Safety cap)
    const dynamicMaxTokens = Math.min(3000, Math.floor(wordsPerChapter * 2)); 

    console.log(`📊 Cible : ${wordsPerChapter} mots/chapitre (Total Pages: ${pages})`);

    // Mise à jour statut
    projet.status = "processing";
    projet.progress = 10;
    await projet.save();

    const FORMAT_INSTRUCTIONS = `
    RÈGLES DE FORMATAGE STRICTES :
    1. LONGUEUR : Vise environ ${wordsPerChapter} mots. Sois CONCIS. Ne fais pas de remplissage.
    2. FORMAT : Utilise uniquement du HTML simple (<h3>, <p>, <ul>, <table>).
    3. INTERDIT : Pas de Markdown (*, #), pas de gras (**).
    `;

    // --- 2. SOMMAIRE (Outline) ---
    let summaryText = "";
    if (providedOutline && Array.isArray(providedOutline) && providedOutline.length > 0) {
        // Utilisation du plan validé par le client (Nettoyage Intro/Conclu car gérés à part)
        const cleanChapters = providedOutline.filter(line => !line.toLowerCase().includes("introduction") && !line.toLowerCase().includes("conclusion"));
        summaryText = cleanChapters.map((line, index) => line.toLowerCase().includes("chapitre") ? line : `Chapitre ${index + 1} : ${line}`).join("\n");
        
        projet.summary = summaryText;
        projet.progress = 15;
        await projet.save();
    } else {
        // Fallback IA si pas de plan fourni (rare)
        const summaryPrompt = getSummaryPrompt({ title: titre, totalChapters: chapters, description });
        summaryText = await getAIWithRetry("ebook", `${EBOOK_SYSTEM_PROMPT}\n\n${summaryPrompt}`, 2000);
        projet.summary = cleanMarkdown(summaryText);
        projet.progress = 15;
        await projet.save();
    }

    // --- 3. RÉDACTION CONTENU (PARALLÈLE) ---
    const parallelCalls = [];
    const introWords = Math.floor(totalWordsTarget * 0.10);
    
    // A. Introduction
    parallelCalls.push((async () => {
          return getAIWithRetry("ebook", `${EBOOK_SYSTEM_PROMPT}\n\n${getIntroPrompt({ title: titre, description, tone, audience })}\n\nFais environ ${introWords} mots.`, 2000)
            .then(text => ({ type: "intro", content: cleanMarkdown(text) }));
    })());

    // B. Chapitres
    for (let i = 1; i <= totalChapters; i++) {
      const chapterTitleMatch = summaryText.match(new RegExp(`Chapitre ${i}\\s*[:：]\\s*(.+?)(?=\\n|$)`, 'i'));
      const chapterTitle = chapterTitleMatch ? chapterTitleMatch[1].trim() : `Chapitre ${i}`;
      
      parallelCalls.push((async () => {
            // Petit délai pour éviter de spammer l'API
            await delay(i * 1000); 
            const text = await getAIWithRetry("ebook", `${EBOOK_SYSTEM_PROMPT}\n\n${getChapterPrompt({ chapterNumber: i, chapterTitle, title: titre, description, summary: summaryText, totalChapters: chapters, wordsTarget: wordsPerChapter })}\n\n${FORMAT_INSTRUCTIONS}`, dynamicMaxTokens);
            return { type: "chapter", index: i, content: cleanMarkdown(text) };
      })());
    }

    // C. Conclusion
    parallelCalls.push((async () => {
          await delay((totalChapters + 1) * 1000);
          return getAIWithRetry("ebook", `${EBOOK_SYSTEM_PROMPT}\n\n${getConclusionPrompt({ title: titre, description, summary: summaryText })}`, 1500)
            .then(text => ({ type: "conclusion", content: cleanMarkdown(text) }));
    })());

    // D. ADS TEXTES (MARKETING)
    parallelCalls.push((async () => {
          await delay(500); 
          const promptAds = `
            Tu es un Copywriter Expert. Rédige 4 contenus marketing distincts pour vendre l'ebook : "${titre}".
            
            1. FACEBOOK_INSTA: Une publicité courte et percutante avec emojis.
            2. WHATSAPP: Un message de diffusion directe pour une liste de contact (Ton amical).
            3. LONG_COPY: Un post type LinkedIn/Blog avec du storytelling (AIDA).
            4. LANDING_PAGE: La structure texte de la page de vente (Accroche, Problème, Solution, Appel à l'action).Pas de Markdown (*, #), pas de gras (**)
            5. INTERDIT : Pas de Markdown (*, #), pas de gras (**).

            FORMAT DE RÉPONSE OBLIGATOIRE (Utilise ces séparateurs exacts) :
            ---FACEBOOK---
            (Ton texte ici)
            ---WHATSAPP---
            (Ton texte ici)
            ---LONG---
            (Ton texte ici)
            ---LANDING---
            (Ton texte ici)
          `;

          return getAIWithRetry("ads", promptAds, 3000)
            .then(raw => {
              // Extraction robuste
              const facebook = raw.split("---FACEBOOK---")[1]?.split("---WHATSAPP---")[0]?.trim() || "";
              const whatsapp = raw.split("---WHATSAPP---")[1]?.split("---LONG---")[0]?.trim() || "";
              const long = raw.split("---LONG---")[1]?.split("---LANDING---")[0]?.trim() || "";
              const landing = raw.split("---LANDING---")[1]?.trim() || "";
              
              return { type: "ads", content: { facebook, whatsapp, long, landing } };
            });
    })());

    // Attente de toutes les générations
    const results = await Promise.all(parallelCalls);

    // Assemblage
    let introText = "";
    let conclusionText = "";
    let adsTexts = { facebook: "", whatsapp: "", long: "", landing: "" };
    const chaptersArray = [];

    results.forEach(result => {
        if (result.type === "intro") introText = result.content;
        else if (result.type === "conclusion") conclusionText = result.content;
        else if (result.type === "ads") adsTexts = result.content; // On stocke les ads
        else if (result.type === "chapter") chaptersArray[result.index - 1] = result.content;
    });
    
    // --- 4. SAUVEGARDE DB ---
    projet.introduction = introText;
    projet.chapters = chaptersArray.filter(Boolean).join("\n\n");
    projet.conclusion = conclusionText;
    projet.adsTexts = adsTexts; // Sauvegarde des textes marketing pour le Dashboard
    
    projet.progress = 80;
    projet.status = "generated_text";
    await projet.save();

    // --- 5. GÉNÉRATION PDF (LIVRE UNIQUEMENT) ---
    console.log("📄 Génération PDF Ebook...");
    const chaptersStruct = chaptersArray.map((c, i) => {
        const titleMatch = summaryText.match(new RegExp(`Chapitre ${i+1}\\s*[:：]\\s*(.+?)(?=\\n|$)`, 'i'));
        return { title: titleMatch ? titleMatch[1].trim() : `Chapitre ${i+1}`, content: c || "<p>Contenu indisponible.</p>" };
    });

    const html = generateStyledHTML({
      title: titre || "Mon Ebook",
      author: authorName, 
      subtitle: description || "", 
      intro: introText,
      conclusion: conclusionText,
      chaptersData: chaptersStruct,
      coverImage: null 
    }, template || "minimal");

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
    });

    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(120000); 
    await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 120000 });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0mm", bottom: "0mm" }
    });

    await browser.close();

    // Upload Cloudinary
    const pdfUpload = await uploadBufferToCloudinary(pdfBuffer, {
      folder: "bookzy/ebooks",
      publicId: `${titre || "ebook"}-${projetId}`,
      resourceType: "raw",
      extension: "pdf",
    });

    projet.pdfUrl = pdfUpload.secure_url;
    projet.status = "COMPLETED";
    projet.progress = 100;
    projet.completedAt = new Date();
    await projet.save();

    // Envoi Email
    if (user?.email) {
       try {
        await resend.emails.send({
          from: "Bookzy <no-reply@bookzy.io>",
          to: user.email,
          subject: "🎉 Ton ebook est prêt !",
          html: ebookReadyTemplate({ firstName: user.firstName, ebookTitle: titre, projectId: projetId.toString() }),
        });
       } catch(e){}
    }

  } catch (err) {
    console.error("❌ Erreur Background:", err);
    try { await Projet.findByIdAndUpdate(projetId, { status: "ERROR" }); } catch(e) {}
  }
}

// --- ROUTE POST PRINCIPALE ---
function getUserIdFromCookie(req) {
  const cookie = req.headers.get("cookie") || "";
  const token = cookie.split(";").map((c) => c.trim()).find((c) => c.startsWith("bookzy_token="))?.split("=")[1];
  try { return jwt.verify(token, process.env.JWT_SECRET)?.id || null; } catch { return null; }
}

export async function POST(req) {
  let projet = null;
  try {
    await dbConnect();
    const body = await req.json();
    let { projetId, transactionId, outline } = body;
    let userId = getUserIdFromCookie(req);
    
    if (!userId && transactionId) {
        const tx = await Transaction.findById(transactionId);
        if (tx) userId = tx.userId;
    }

    if (!userId && !projetId) return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });

    if (projetId) {
      projet = await Projet.findById(projetId).populate("userId");
      if (!projet) return NextResponse.json({ success: false, message: "Introuvable" }, { status: 404 });
      
      // Si déjà complet, on renvoie tout (PDF + Ads)
      if (projet.status === "COMPLETED") {
          return NextResponse.json({ 
              success: true, 
              alreadyGenerated: true, 
              pdfUrl: projet.pdfUrl,
              adsTexts: projet.adsTexts // Important pour le front
          });
      }
      
      if (projet.status === "processing") return NextResponse.json({ success: true, message: "Déjà en cours" }, { status: 409 });
      userId = projet.userId?._id || projet.userId;
    } else {
        if (transactionId) {
            const existing = await Projet.findOne({ transactionId });
            if (existing) {
                return NextResponse.json({ 
                    success: true, 
                    alreadyGenerated: true, 
                    projetId: existing._id.toString(), 
                    pdfUrl: existing.pdfUrl, 
                    adsTexts: existing.adsTexts, // Important
                    status: existing.status 
                });
            }
        }
        
        let { titre, description, tone, audience, pages, chapters, template } = body;
        
        // Récupération depuis Transaction si infos manquantes
        if ((!titre || !outline) && transactionId) {
             const tx = await Transaction.findById(transactionId);
             if(tx?.kitData) { 
                 titre = tx.kitData.title; description = tx.kitData.description; tone = tx.kitData.tone; 
                 audience = tx.kitData.audience; pages = tx.kitData.pages; chapters = tx.kitData.chapters; 
                 template = tx.kitData.template;
                 if(!outline) outline = tx.kitData.outline;
             }
        }

        projet = await Projet.create({
            userId, transactionId, titre, description, tone, audience, 
            pages: pages || 20, chapters: chapters || 5, template: template || "minimal", 
            isPaid: true, status: "processing", progress: 0
        });
        projetId = projet._id.toString();
        
        // Lancement génération
        generateEbookBackgroundTask(projet._id, userId, outline).catch(err => console.error("Back Error:", err));
        return NextResponse.json({ success: true, message: "Lancé", projetId: projet._id.toString() });
    }
    
    // Cas de relance sur projet existant (rare)
    generateEbookBackgroundTask(projet._id, userId, outline).catch(err => console.error("Back Error:", err));
    return NextResponse.json({ success: true, message: "Lancé", projetId: projet._id.toString() });

  } catch (err) {
    if (projet) { try { projet.status = "ERROR"; await projet.save(); } catch(e){} }
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}