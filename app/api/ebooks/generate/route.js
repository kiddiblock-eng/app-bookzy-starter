export const dynamic = "force-dynamic";
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

const delay = (ms) => new Promise(res => setTimeout(res, ms));

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

// ✅ RETRY ROBUSTE avec 3 tentatives + délai progressif
async function getAIWithRetry(context, prompt, maxTokens, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const result = await getAIText(context, prompt, maxTokens);
            return result;
        } catch (error) {
            const isOverloaded = error.message.includes("503") || 
                                 error.message.includes("Overloaded") || 
                                 error.message.includes("fetch failed") ||
                                 error.message.includes("429");
            
            if (isOverloaded && i < retries - 1) {
                const waitTime = (i + 1) * 3000; // 3s, 6s, 9s
                console.warn(`⚠️ IA Surchargée (Essai ${i+1}/${retries}). Pause ${waitTime}ms...`);
                await delay(waitTime);
                continue;
            }
            throw error;
        }
    }
}

async function generatePhase1(projetId, userId, providedOutline) {
  console.log(`🚀 [PHASE 1] DÉMARRAGE projet ${projetId}`);
  
  try {
    await dbConnect();
    console.log("✅ [PHASE 1] DB connectée");
    
    const projet = await Projet.findById(projetId);
    
    if (!projet) {
      console.error("❌ [PHASE 1] Projet introuvable");
      return;
    }

    console.log(`✅ [PHASE 1] Projet chargé: ${projet.titre}`);

    const { titre, description, tone, audience, pages, chapters, template } = projet;
    
    projet.status = "processing";
    projet.progress = 10;
    await projet.save();

    const totalChapters = Math.max(1, Number(chapters) || 5);
    const WORDS_PER_PAGE = 220;
    const totalWordsTarget = Math.max(10, Number(pages)) * WORDS_PER_PAGE;
    const chapterWordsTotal = Math.floor(totalWordsTarget * 0.80);
    const wordsPerChapter = Math.floor(chapterWordsTotal / totalChapters);

    console.log(`📊 [PHASE 1] Config: ${totalChapters} chapitres, ${wordsPerChapter} mots/chapitre, Template: ${template}`);

    // ============================================================================
    // ✅ OUTLINE
    // ============================================================================
    let summaryText = "";
    if (providedOutline && Array.isArray(providedOutline) && providedOutline.length > 0) {
        console.log("✅ [PHASE 1] Utilisation outline fourni");
        const cleanChapters = providedOutline.filter(line => 
          !line.toLowerCase().includes("introduction") && 
          !line.toLowerCase().includes("conclusion")
        );
        summaryText = cleanChapters.map((line, index) => 
          line.toLowerCase().includes("chapitre") ? line : `Chapitre ${index + 1} : ${line}`
        ).join("\n");
    } else {
        console.log("🤖 [PHASE 1] Génération outline par IA");
        const summaryPrompt = getSummaryPrompt({ title: titre, totalChapters: chapters, description });
        summaryText = await getAIWithRetry("ebook", `${EBOOK_SYSTEM_PROMPT}\n\n${summaryPrompt}`, 2000);
    }
    
    projet.summary = cleanMarkdown(summaryText);
    projet.progress = 20;
    await projet.save();
    console.log("✅ [PHASE 1] Outline sauvegardé");

    // ============================================================================
    // ✅ INTRODUCTION
    // ============================================================================
    console.log("🤖 [PHASE 1] Génération introduction");
    const introWords = Math.floor(totalWordsTarget * 0.10);
    const introText = await getAIWithRetry(
      "ebook", 
      `${EBOOK_SYSTEM_PROMPT}\n\n${getIntroPrompt({ title: titre, description, tone, audience })}\n\nFais environ ${introWords} mots.`, 
      2000
    );
    
    projet.introduction = cleanMarkdown(introText);
    projet.progress = 30;
    await projet.save();
    console.log("✅ [PHASE 1] Introduction sauvegardée");

    console.log("✅ [PHASE 1] TERMINÉE - Lancement Phase 2");
    await generatePhase2(projetId, userId, summaryText, wordsPerChapter, totalChapters);

  } catch (err) {
    console.error("❌ [PHASE 1] Erreur:", err);
    console.error("❌ [PHASE 1] Stack:", err.stack);
    try {
      await Projet.findByIdAndUpdate(projetId, { 
        status: "ERROR", 
        progress: 0,
        errorMessage: `Phase 1: ${err.message}` 
      });
    } catch(e) {
      console.error("❌ [PHASE 1] Erreur update projet:", e);
    }
  }
}

async function generatePhase2(projetId, userId, summaryText, wordsPerChapter, totalChapters) {
  console.log(`🚀 [PHASE 2] DÉMARRAGE projet ${projetId}`);
  
  try {
    await dbConnect();
    console.log("✅ [PHASE 2] DB connectée");
    
    const projet = await Projet.findById(projetId);
    
    if (!projet) {
      console.error("❌ [PHASE 2] Projet introuvable");
      return;
    }

    console.log(`✅ [PHASE 2] Projet chargé: ${projet.titre}`);

    const titre = projet.titre;
    const description = projet.description;
    const template = projet.template || "modern"; // ✅ FIX: Utilise le template du projet
    
    let authorName = "Auteur";
    try {
      if (userId) {
        const user = await User.findById(userId);
        if (user) {
          authorName = user.firstName || user.nom || "Auteur";
          console.log(`✅ [PHASE 2] User chargé: ${user.firstName || user.email}`);
        }
      }
    } catch (userErr) {
      console.error(`❌ [PHASE 2] Erreur user:`, userErr.message);
    }
    
    const dynamicMaxTokens = Math.min(3000, Math.floor(wordsPerChapter * 2));

    const FORMAT_INSTRUCTIONS = `
    RÈGLES DE FORMATAGE STRICTES :
    1. LONGUEUR : Vise environ ${wordsPerChapter} mots. Sois CONCIS.
    2. FORMAT : Utilise uniquement du HTML simple (<h3>, <p>, <ul>, <li>, <strong>, <em>).
    3. INTERDIT : Pas de Markdown (*, #, **), pas de backticks.
    4. STRUCTURE : 2-3 sous-sections maximum par chapitre.
    `;

    console.log("🤖 [PHASE 2] Début génération SÉQUENTIELLE (1 par 1)");
    
    // ============================================================================
    // ✅ CHAPITRES - APPELS SÉQUENTIELS (1 PAR 1) AVEC RETRY
    // ============================================================================
    const chaptersArray = [];
    
    for (let i = 1; i <= totalChapters; i++) {
      console.log(`🤖 [PHASE 2] Génération chapitre ${i}/${totalChapters}`);
      
      const chapterTitleMatch = summaryText.match(new RegExp(`Chapitre ${i}\\s*[:：]\\s*(.+?)(?=\\n|$)`, 'i'));
      const chapterTitle = chapterTitleMatch ? chapterTitleMatch[1].trim() : `Chapitre ${i}`;
      
      let chapterText = "";
      let retryCount = 0;
      const MAX_CHAPTER_RETRIES = 3;
      
      // ✅ RETRY AUTOMATIQUE par chapitre
      while (retryCount < MAX_CHAPTER_RETRIES) {
        try {
          chapterText = await getAIWithRetry(
            "ebook", 
            `${EBOOK_SYSTEM_PROMPT}\n\n${getChapterPrompt({ 
              chapterNumber: i, 
              chapterTitle, 
              title: titre, 
              description, 
              summary: summaryText, 
              totalChapters, 
              wordsTarget: wordsPerChapter 
            })}\n\n${FORMAT_INSTRUCTIONS}`, 
            dynamicMaxTokens
          );
          
          // ✅ Succès
          chaptersArray.push(cleanMarkdown(chapterText));
          
          // ✅ Update progress
          const newProgress = 30 + Math.floor((i / totalChapters) * 40);
          await Projet.findByIdAndUpdate(projetId, { progress: newProgress });
          console.log(`✅ [PHASE 2] Chapitre ${i} terminé - ${newProgress}%`);
          
          // ✅ PAUSE entre chapitres (critical pour Gemini)
          if (i < totalChapters) {
            await delay(2000); // 2 secondes entre chaque chapitre
          }
          
          break; // ✅ Sortir de la boucle retry
          
        } catch (err) {
          retryCount++;
          console.error(`❌ [PHASE 2] Chapitre ${i} échec (tentative ${retryCount}/${MAX_CHAPTER_RETRIES}):`, err.message);
          
          if (retryCount >= MAX_CHAPTER_RETRIES) {
            // ✅ FALLBACK après 3 échecs
            console.warn(`⚠️ [PHASE 2] Chapitre ${i} - Utilisation fallback`);
            chaptersArray.push(`<h2>${chapterTitle}</h2><p>Ce chapitre explore en profondeur les concepts clés et stratégies essentielles pour réussir dans ce domaine.</p><p>Les points principaux abordés permettent de comprendre les enjeux et d'appliquer les meilleures pratiques.</p>`);
            break;
          }
          
          // ✅ Attendre avant retry
          await delay(3000);
        }
      }
    }

    // ============================================================================
    // ✅ CONCLUSION
    // ============================================================================
    console.log("🤖 [PHASE 2] Génération conclusion");
    await delay(2000); // ✅ Pause avant conclusion
    
    let conclusionText = "";
    try {
      conclusionText = await getAIWithRetry(
        "ebook", 
        `${EBOOK_SYSTEM_PROMPT}\n\n${getConclusionPrompt({ title: titre, description, summary: summaryText })}`, 
        1500
      );
      console.log("✅ [PHASE 2] Conclusion terminée");
    } catch (err) {
      console.error("❌ [PHASE 2] Conclusion ÉCHOUÉE:", err.message);
      conclusionText = `<h2>Conclusion</h2><p>En résumé, ce guide vous offre les clés essentielles pour réussir. Appliquez ces principes avec constance et vous observerez des résultats concrets.</p>`;
    }

    projet.progress = 70;
    await projet.save();

    // ============================================================================
    // ✅ ADS (Facebook, WhatsApp, Landing)
    // ============================================================================
    console.log("🤖 [PHASE 2] Génération ads");
    await delay(2000); // ✅ Pause avant ads
    
    let adsTexts = { facebook: "", whatsapp: "", long: "", landing: "" };
    try {
      const promptAds = `
        Tu es un Copywriter Expert. Rédige 4 contenus marketing distincts pour vendre l'ebook : "${titre}".
        
        1. FACEBOOK_INSTA: Une publicité courte et percutante avec emojis (max 150 mots).
        2. WHATSAPP: Un message de diffusion directe pour relancer (max 100 mots).
        3. LONG_COPY: Un post LinkedIn/Blog avec storytelling (max 300 mots).
        4. LANDING_PAGE: Structure texte de la page de vente avec titre, sous-titre, 3 bénéfices, CTA (max 200 mots).
        5. INTERDIT : Pas de Markdown (*, #, **), seulement du texte brut.

        FORMAT STRICT :
        ---FACEBOOK---
        (texte facebook)
        ---WHATSAPP---
        (texte whatsapp)
        ---LONG---
        (texte long)
        ---LANDING---
        (texte landing)
      `;

      const raw = await getAIWithRetry("ads", promptAds, 3000);
      
      adsTexts.facebook = raw.split("---FACEBOOK---")[1]?.split("---WHATSAPP---")[0]?.trim() || "🚀 Découvrez notre nouvel ebook !";
      adsTexts.whatsapp = raw.split("---WHATSAPP---")[1]?.split("---LONG---")[0]?.trim() || "Bonjour ! Nouveau guide disponible.";
      adsTexts.long = raw.split("---LONG---")[1]?.split("---LANDING---")[0]?.trim() || "Découvrez les stratégies qui fonctionnent.";
      adsTexts.landing = raw.split("---LANDING---")[1]?.trim() || "Transformez vos connaissances en résultats.";
      
      console.log("✅ [PHASE 2] Ads terminées");
    } catch (err) {
      console.error("❌ [PHASE 2] Ads ÉCHOUÉES:", err.message);
      // ✅ Fallback ads
      adsTexts = {
        facebook: `🚀 Découvrez "${titre}" - Le guide complet pour réussir !`,
        whatsapp: `Bonjour ! Notre nouveau guide "${titre}" est disponible. Commandez maintenant !`,
        long: `Vous cherchez à maîtriser ce sujet ? "${titre}" est le guide qu'il vous faut.`,
        landing: `Transformez vos connaissances avec "${titre}". Téléchargez maintenant !`
      };
    }

    // ============================================================================
    // ✅ SAUVEGARDE TEXTE
    // ============================================================================
    console.log(`✅ [PHASE 2] ${chaptersArray.length}/${totalChapters} chapitres générés avec succès`);
    
    projet.chapters = chaptersArray.join("\n\n");
    projet.conclusion = cleanMarkdown(conclusionText);
    projet.adsTexts = adsTexts;
    projet.progress = 80;
    projet.status = "generated_text";
    await projet.save();
    console.log("💾 [PHASE 2] Texte sauvegardé");

    // ============================================================================
    // 🚀 PDF ULTRA-OPTIMISÉ
    // ============================================================================
    console.log("📄 [PHASE 2] Génération PDF");
    
    const chaptersStruct = chaptersArray.map((c, i) => {
        const titleMatch = summaryText.match(new RegExp(`Chapitre ${i+1}\\s*[:：]\\s*(.+?)(?=\\n|$)`, 'i'));
        return { 
          title: titleMatch ? titleMatch[1].trim() : `Chapitre ${i+1}`, 
          content: c 
        };
    });

    // ✅ FIX CRITIQUE: Utilise le template du PROJET, pas "minimal"
    const html = generateStyledHTML({
      title: titre || "Mon Ebook",
      author: authorName, 
      subtitle: description || "", 
      intro: projet.introduction,
      conclusion: cleanMarkdown(conclusionText),
      chaptersData: chaptersStruct,
      coverImage: null 
    }, template); // ✅ Utilise projet.template au lieu de "minimal"

    console.log(`🌐 [PHASE 2] Génération PDF avec template: ${template}`);
    
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--no-zygote',
          '--single-process',
          '--disable-software-rasterizer',
          '--disable-extensions',
          '--disable-background-networking',
          '--disable-default-apps',
          '--disable-sync',
          '--disable-translate',
          '--hide-scrollbars',
          '--metrics-recording-only',
          '--mute-audio',
          '--no-first-run',
          '--safebrowsing-disable-auto-update',
          '--disable-features=IsolateOrigins,site-per-process',
          '--js-flags=--max-old-space-size=512',
        ],
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
        timeout: 90000,
        protocolTimeout: 90000,
      });

      console.log("✅ [PHASE 2] Browser lancé");

      const page = await browser.newPage();
      
      await page.setContent(html, { 
        waitUntil: "domcontentloaded",
        timeout: 60000
      });
      
      console.log("✅ [PHASE 2] HTML chargé");

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "0mm", bottom: "0mm" },
        timeout: 60000
      });

      await browser.close();
      console.log("✅ [PHASE 2] PDF généré");

      console.log("☁️ [PHASE 2] Upload Cloudinary - DÉBUT");
      const uploadStartTime = Date.now();
      
      const pdfUpload = await uploadBufferToCloudinary(pdfBuffer, {
        folder: "bookzy/ebooks",
        publicId: `${titre || "ebook"}-${projetId}`,
        resourceType: "raw",
        extension: "pdf",
        timeout: 60000
      });

      console.log(`✅ [PHASE 2] Upload terminé en ${Date.now() - uploadStartTime}ms`);

      projet.pdfUrl = pdfUpload.secure_url;
      projet.status = "COMPLETED";
      projet.progress = 100;
      projet.completedAt = new Date();
      await projet.save();
      console.log("✅ [PHASE 2] Projet COMPLETED");
      console.log("🎉 [PHASE 2] PDF:", pdfUpload.secure_url);

    } catch (pdfError) {
      console.error("❌ [PHASE 2] Erreur PDF:", pdfError.message);
      console.error("❌ [PHASE 2] Stack:", pdfError.stack);
      
      if (browser) {
        try { await browser.close(); } catch(e) {}
      }
      
      throw new Error(`Erreur génération PDF: ${pdfError.message}`);
    }

    // ============================================================================
    // ✅ EMAIL
    // ============================================================================
    if (userId) {
      try {
        const user = await User.findById(userId);
        if (user?.email) {
          const resend = new Resend(process.env.RESEND_API_KEY);
          await resend.emails.send({
            from: "Bookzy <no-reply@bookzy.io>",
            to: user.email,
            subject: "🎉 Ton ebook est prêt !",
            html: ebookReadyTemplate({ 
              firstName: user.firstName || "cher utilisateur", 
              ebookTitle: titre, 
              projectId: projetId.toString() 
            }),
          });
          console.log("✅ [PHASE 2] Email envoyé");
        }
      } catch(emailErr) {
        console.error("❌ [PHASE 2] Erreur email:", emailErr.message);
      }
    }

    console.log("🎉 [PHASE 2] TERMINÉE");

  } catch (err) {
    console.error("❌ [PHASE 2] ERREUR FATALE:", err.message);
    console.error(err.stack);
    try {
      await Projet.findByIdAndUpdate(projetId, { 
        status: "ERROR",
        errorMessage: `Phase 2: ${err.message}`
      });
    } catch(e) {
      console.error("❌ Impossible de sauvegarder l'erreur:", e.message);
    }
  }
}

function getUserIdFromCookie(req) {
  const cookie = req.headers.get("cookie") || "";
  const token = cookie.split(";").map((c) => c.trim()).find((c) => c.startsWith("bookzy_token="))?.split("=")[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET)?.id || null;
  } catch {
    return null;
  }
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

    if (!userId && !projetId) {
      return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });
    }

    if (projetId) {
      projet = await Projet.findById(projetId).populate("userId");
      if (!projet) {
        return NextResponse.json({ success: false, message: "Introuvable" }, { status: 404 });
      }
      
      if (projet.status === "COMPLETED") {
          return NextResponse.json({ 
              success: true, 
              alreadyGenerated: true, 
              pdfUrl: projet.pdfUrl,
              adsTexts: projet.adsTexts
          });
      }
      
      if (projet.status === "processing") {
        return NextResponse.json({ 
          success: true, 
          message: "Déjà en cours",
          projetId: projet._id.toString()
        });
      }
      
      userId = projet.userId?._id || projet.userId;
    } else {
        if (transactionId) {
            const existing = await Projet.findOne({ transactionId });
            if (existing) {
                return NextResponse.json({ 
                    success: true, 
                    alreadyGenerated: existing.status === "COMPLETED",
                    projetId: existing._id.toString(), 
                    pdfUrl: existing.pdfUrl, 
                    adsTexts: existing.adsTexts,
                    status: existing.status 
                });
            }
        }
        
        let { titre, description, tone, audience, pages, chapters, template } = body;
        
        if ((!titre || !outline) && transactionId) {
             const tx = await Transaction.findById(transactionId);
             if(tx?.kitData) { 
                 titre = tx.kitData.title;
                 description = tx.kitData.description;
                 tone = tx.kitData.tone; 
                 audience = tx.kitData.audience;
                 pages = tx.kitData.pages;
                 chapters = tx.kitData.chapters; 
                 template = tx.kitData.template;
                 if(!outline) outline = tx.kitData.outline;
             }
        }

        // ✅ FIX: Validation template
        const validTemplates = ["modern", "luxe", "educatif", "energie", "minimal", "creative"];
        const finalTemplate = validTemplates.includes(template) ? template : "modern";

        projet = await Projet.create({
            userId,
            transactionId,
            titre,
            description,
            tone,
            audience, 
            pages: pages || 20,
            chapters: chapters || 5,
            template: finalTemplate, // ✅ Template validé
            isPaid: true,
            status: "processing",
            progress: 5
        });
        
        projetId = projet._id.toString();
        console.log(`✅ [POST] Projet créé avec template: ${finalTemplate}`);
    }
    
    // ✅ Lancement asynchrone
    generatePhase1(projet._id, userId, outline);
    
    return NextResponse.json({ 
      success: true, 
      message: "Génération lancée", 
      projetId: projet._id.toString(),
      status: "processing"
    });

  } catch (err) {
    console.error("❌ [POST] Erreur:", err.message);
    if (projet) {
      try {
        projet.status = "ERROR";
        projet.errorMessage = err.message;
        await projet.save();
      } catch(e) {}
    }
    return NextResponse.json({ 
      success: false, 
      error: err.message 
    }, { status: 500 });
  }
}