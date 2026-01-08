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
    .replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200D\uFEFF]/g, "")
    .trim();
}

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
                const waitTime = (i + 1) * 3000;
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
    const template = projet.template || "modern";
    
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

    console.log("🤖 [PHASE 2] Début génération PAR BATCH (3 par 3) avec décalage");
    
    const chaptersArray = [];
    const batchSize = 3;
    
    for (let i = 0; i < totalChapters; i += batchSize) {
      const batch = [];
      const batchEnd = Math.min(i + batchSize, totalChapters);
      
      console.log(`🤖 [PHASE 2] Batch ${Math.floor(i/batchSize) + 1}: chapitres ${i+1} à ${batchEnd}`);
      
      for (let j = i; j < batchEnd; j++) {
        const chapterNumber = j + 1;
        const chapterTitleMatch = summaryText.match(new RegExp(`Chapitre ${chapterNumber}\\s*[:：]\\s*(.+?)(?=\\n|$)`, 'i'));
        const chapterTitle = chapterTitleMatch ? chapterTitleMatch[1].trim() : `Chapitre ${chapterNumber}`;
        
        const delayMs = (j - i) * 2000;
        
        batch.push(
          (async () => {
            await delay(delayMs);
            
            let chapterText = "";
            let retryCount = 0;
            const MAX_CHAPTER_RETRIES = 3;
            
            while (retryCount < MAX_CHAPTER_RETRIES) {
              try {
                chapterText = await getAIWithRetry(
                  "ebook", 
                  `${EBOOK_SYSTEM_PROMPT}\n\n${getChapterPrompt({ 
                    chapterNumber, 
                    chapterTitle, 
                    title: titre, 
                    description, 
                    summary: summaryText, 
                    totalChapters, 
                    wordsTarget: wordsPerChapter 
                  })}\n\n${FORMAT_INSTRUCTIONS}`, 
                  dynamicMaxTokens
                );
                
                console.log(`✅ [PHASE 2] Chapitre ${chapterNumber} terminé`);
                break;
                
              } catch (err) {
                retryCount++;
                console.error(`❌ [PHASE 2] Chapitre ${chapterNumber} échec (tentative ${retryCount}/${MAX_CHAPTER_RETRIES}):`, err.message);
                
                if (retryCount >= MAX_CHAPTER_RETRIES) {
                  console.warn(`⚠️ [PHASE 2] Chapitre ${chapterNumber} - Utilisation fallback`);
                  chapterText = `<h2>${chapterTitle}</h2><p>Ce chapitre explore en profondeur les concepts clés et stratégies essentielles pour réussir dans ce domaine.</p><p>Les points principaux abordés permettent de comprendre les enjeux et d'appliquer les meilleures pratiques.</p>`;
                  break;
                }
                
                await delay(3000);
              }
            }
            
            return { index: chapterNumber - 1, content: cleanMarkdown(chapterText) };
          })()
        );
      }
      
      const batchResults = await Promise.all(batch);
      
      batchResults.forEach(({ index, content }) => {
        chaptersArray[index] = content;
      });
      
      const newProgress = 30 + Math.floor(((i + batchSize) / totalChapters) * 40);
      await Projet.findByIdAndUpdate(projetId, { progress: Math.min(newProgress, 70) });
      
      if (i + batchSize < totalChapters) {
        console.log("⏸️ [PHASE 2] Pause 3s avant batch suivant...");
        await delay(3000);
      }
    }
    
    console.log(`✅ [PHASE 2] ${chaptersArray.length}/${totalChapters} chapitres générés`);

    console.log("🤖 [PHASE 2] Génération conclusion");
    await delay(2000);
    
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

    console.log("🤖 [PHASE 2] Génération ads");
    await delay(2000);
    
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
      adsTexts = {
        facebook: `🚀 Découvrez "${titre}" - Le guide complet pour réussir !`,
        whatsapp: `Bonjour ! Notre nouveau guide "${titre}" est disponible. Commandez maintenant !`,
        long: `Vous cherchez à maîtriser ce sujet ? "${titre}" est le guide qu'il vous faut.`,
        landing: `Transformez vos connaissances avec "${titre}". Téléchargez maintenant !`
      };
    }

    console.log(`✅ [PHASE 2] ${chaptersArray.length}/${totalChapters} chapitres générés avec succès`);
    
    projet.chapters = chaptersArray.join("\n\n");
    projet.conclusion = cleanMarkdown(conclusionText);
    projet.adsTexts = adsTexts;
    projet.progress = 80;
    projet.status = "generated_text";
    await projet.save();
    console.log("💾 [PHASE 2] Texte sauvegardé");

    // ============================================================================
    // 🚀 PDF ULTRA-ROBUSTE - VERSION FINALE SANS ERREUR
    // ============================================================================
    console.log("📄 [PHASE 2] Génération PDF - DÉBUT");
    console.log(`⏰ [PHASE 2] Timestamp: ${new Date().toISOString()}`);

    // ✅ Log RAM avant génération
    try {
      const memUsage = process.memoryUsage();
      console.log(`💾 [PHASE 2] RAM avant PDF: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB / ${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`);
    } catch(e) {}

    const chaptersStruct = chaptersArray.map((c, i) => {
        const titleMatch = summaryText.match(new RegExp(`Chapitre ${i+1}\\s*[:：]\\s*(.+?)(?=\\n|$)`, 'i'));
        return { 
          title: titleMatch ? titleMatch[1].trim() : `Chapitre ${i+1}`, 
          content: c 
        };
    });

    const html = generateStyledHTML({
      title: titre || "Mon Ebook",
      author: authorName, 
      subtitle: description || "", 
      intro: projet.introduction,
      conclusion: cleanMarkdown(conclusionText),
      chaptersData: chaptersStruct,
      coverImage: null 
    }, template);

    const htmlWithEmoji = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap');
      * { 
        font-family: inherit, "Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji", sans-serif !important; 
      }
    </style>
    ${html}
    `;

    console.log(`🌐 [PHASE 2] HTML généré (${Math.round(htmlWithEmoji.length / 1024)}KB) - Template: ${template}`);

    let browser = null;
    let pdfBuffer = null;
    const MAX_PDF_RETRIES = 3;

    for (let pdfAttempt = 1; pdfAttempt <= MAX_PDF_RETRIES; pdfAttempt++) {
      try {
        console.log(`🔄 [PHASE 2] Tentative PDF ${pdfAttempt}/${MAX_PDF_RETRIES}`);
        console.log(`⏰ [PHASE 2] Timestamp tentative: ${new Date().toISOString()}`);
        
        // ✅ Options Chromium ultra-optimisées
        const launchOptions = {
          headless: 'new',
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage', // ✅ CRITIQUE
            '--disable-gpu',
            '--no-zygote',
            '--single-process', // ✅ CRITIQUE pour économiser RAM
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
            '--js-flags=--max-old-space-size=1024', // ✅ 1Go Chromium
            '--disable-web-security',
            '--disable-accelerated-2d-canvas', // ✅ Économise GPU/RAM
            '--disable-dev-tools', // ✅ Économise RAM
          ],
          executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
          timeout: 90000, // ✅ 90s
          protocolTimeout: 90000,
        };
        
        console.log(`🚀 [PHASE 2] Lancement Chromium...`);
        browser = await puppeteer.launch(launchOptions);
        console.log("✅ [PHASE 2] Browser lancé avec succès");

        const page = await browser.newPage();
        console.log("✅ [PHASE 2] Page créée");
        
        await page.setViewport({ width: 800, height: 600 });
        console.log("✅ [PHASE 2] Viewport configuré");
        
        console.log(`📝 [PHASE 2] Chargement HTML...`);
        await page.setContent(htmlWithEmoji, { 
          waitUntil: "networkidle0",
          timeout: 60000 // ✅ 60s pour Google Fonts
        });
        console.log("✅ [PHASE 2] HTML chargé dans le navigateur");

        // ✅ Pause pour stabilisation
        console.log("⏳ [PHASE 2] Pause 2s pour stabilisation...");
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log("🖨️ [PHASE 2] Génération du PDF...");
        pdfBuffer = await page.pdf({
          format: "A4",
          printBackground: true,
          margin: { top: "0mm", bottom: "0mm" },
          timeout: 45000 // ✅ 45s max
        });
        console.log(`✅ [PHASE 2] PDF généré (${Math.round(pdfBuffer.length / 1024)}KB)`);

        // ✅ CRITIQUE : Fermer immédiatement
        console.log("🔒 [PHASE 2] Fermeture browser...");
        await browser.close();
        browser = null;
        console.log("✅ [PHASE 2] Browser fermé avec succès");
        
        // ✅ Log RAM après génération réussie
        try {
          const memUsage = process.memoryUsage();
          console.log(`💾 [PHASE 2] RAM après PDF: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`);
        } catch(e) {}
        
        break; // ✅ Sortir de la boucle retry

      } catch (pdfError) {
        console.error(`❌ [PHASE 2] Tentative ${pdfAttempt} ÉCHOUÉE`);
        console.error(`❌ [PHASE 2] Type d'erreur: ${pdfError.name}`);
        console.error(`❌ [PHASE 2] Message: ${pdfError.message}`);
        console.error(`❌ [PHASE 2] Stack: ${pdfError.stack}`);
        
        // ✅ Log RAM en cas d'erreur
        try {
          const memUsage = process.memoryUsage();
          console.log(`💾 [PHASE 2] RAM après erreur: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB / ${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`);
        } catch(e) {}
        
        // ✅ CRITIQUE : Toujours fermer le browser
        if (browser) {
          try { 
            console.log("🔒 [PHASE 2] Tentative fermeture browser après erreur...");
            await browser.close(); 
            console.log("✅ [PHASE 2] Browser fermé");
          } catch(closeErr) {
            console.error("⚠️ [PHASE 2] Impossible de fermer browser:", closeErr.message);
          }
          browser = null;
        }
        
        // ✅ Si dernière tentative, throw
        if (pdfAttempt >= MAX_PDF_RETRIES) {
          console.error(`🚨 [PHASE 2] ÉCHEC FINAL après ${MAX_PDF_RETRIES} tentatives`);
          throw new Error(`PDF échoué après ${MAX_PDF_RETRIES} tentatives: ${pdfError.message}`);
        }
        
        // ✅ Pause progressive avant retry
        const pauseTime = pdfAttempt * 5000; // 5s, 10s, 15s
        console.log(`⏸️ [PHASE 2] Pause ${pauseTime/1000}s avant retry ${pdfAttempt + 1}...`);
        await new Promise(resolve => setTimeout(resolve, pauseTime));
      }
    }

    // ✅ Vérification finale
    if (!pdfBuffer) {
      throw new Error("PDF buffer vide après toutes les tentatives");
    }

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
        
        let { titre, description, tone, audience, pages, chapters, template: bodyTemplate, outline: bodyOutline } = body;
        
        let templateFinal; 
        let outlineFinal = bodyOutline;

        console.log("📥 [POST] Body reçu - bodyTemplate:", bodyTemplate);

        if (transactionId) {
            const tx = await Transaction.findById(transactionId);
            if (tx?.kitData) {
                console.log("📦 [POST] Transaction trouvée - kitData:", tx.kitData);
                console.log("🎨 [POST] kitData.template:", tx.kitData.template);
                
                titre = tx.kitData.title || titre;
                description = tx.kitData.description || description;
                tone = tx.kitData.tone || tone;
                audience = tx.kitData.audience || audience;
                pages = tx.kitData.pages || pages;
                chapters = tx.kitData.chapters || chapters;
                outlineFinal = tx.kitData.outline || bodyOutline;
                
                templateFinal = tx.kitData.template || bodyTemplate;
                
                console.log("🎨 [POST] Template FINAL (de la transaction):", templateFinal);
            } else {
                templateFinal = bodyTemplate;
                console.log("🎨 [POST] Template FINAL (du body, pas de kitData):", templateFinal);
            }
        } else {
            templateFinal = bodyTemplate;
            console.log("🎨 [POST] Template FINAL (du body, pas de transaction):", templateFinal);
        }

        const validTemplates = ["modern", "luxe", "educatif", "energie", "minimal", "creative"];
        const validatedTemplate = validTemplates.includes(templateFinal) ? templateFinal : "modern";
        
        console.log("✅ [POST] Template validé pour création:", validatedTemplate);

        projet = await Projet.create({
            userId,
            transactionId,
            titre,
            description,
            tone,
            audience, 
            pages: pages || 20,
            chapters: chapters || 5,
            template: validatedTemplate,
            isPaid: true,
            status: "processing",
            progress: 5
        });
        
        projetId = projet._id.toString();
        outline = outlineFinal;
        
        console.log(`✅ [POST] Projet créé avec succès - Template: ${validatedTemplate}`);
    }
    
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