export const dynamic = "force-dynamic";
export const maxDuration = 300;
import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
import Projet from "../../../../models/Projet";
import User from "../../../../models/User";
import Transaction from "../../../../models/Transaction"; 
import { Resend } from "resend";
import { ebookReadyTemplate } from "../../../../lib/emailTemplates/ebookReadyTemplate";
import { getAIText } from "../../../../lib/ai";
import { generateStyledHTML } from "../../../../lib/pdf/htmlGenerator"; 
import { generateDocx } from "../../../../lib/pdf/docxGenerator";
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

// ✅ AJOUT : Import middleware crédits
import { checkCredits } from "../../../../middleware/checkCredits";

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

async function getAIWithRetry(context, prompt, maxTokens, retries = 5) {
    // Backoff exponentiel avec jitter : 5s, 10s, 20s, 30s, 45s
    const BACKOFF = [5000, 10000, 20000, 30000, 45000];

    for (let i = 0; i < retries; i++) {
        try {
            const result = await getAIText(context, prompt, maxTokens);
            return result;
        } catch (error) {
            const isOverloaded = error.message.includes("503") || 
                                 error.message.includes("Overloaded") || 
                                 error.message.includes("fetch failed") ||
                                 error.message.includes("429") ||
                                 error.message.includes("ECONNRESET") ||
                                 error.message.includes("network");
            
            if (isOverloaded && i < retries - 1) {
                // Jitter : +/- 20% du délai pour éviter les appels simultanés
                const base = BACKOFF[i] || 45000;
                const jitter = Math.floor(base * 0.2 * (Math.random() * 2 - 1));
                const waitTime = base + jitter;
                console.warn(`⚠️ IA Surchargée (Essai ${i+1}/${retries}). Pause ${Math.round(waitTime/1000)}s...`);
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

    const { titre, description, tone, audience, pages, chapters, template, youbookContext, langue = 'français' } = projet;
    
    projet.status = "processing";
    projet.progress = 10;
    await projet.save();

    const totalChapters = Math.max(1, Number(chapters) || 5);
    const WORDS_PER_PAGE = 220;
    const totalWordsTarget = Math.max(10, Number(pages)) * WORDS_PER_PAGE;
    const chapterWordsTotal = Math.floor(totalWordsTarget * 0.80);
    const wordsPerChapter = Math.floor((chapterWordsTotal / totalChapters) * 1.2);

    console.log(`📊 [PHASE 1] Config: ${totalChapters} chapitres, ${wordsPerChapter} mots/chapitre, Template: ${template}`);

    let summaryText = "";

    // ✅ Réutiliser le summary exact de l'aperçu si disponible en DB
    const projetForSummary = await Projet.findById(projetId);
    if (projetForSummary?.summary && projetForSummary.summary.length > 10) {
      console.log("✅ [PHASE 1] Réutilisation summary de l'aperçu");
      summaryText = projetForSummary.summary;
    } else if (providedOutline && Array.isArray(providedOutline) && providedOutline.length > 0) {
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
        const summaryPrompt = getSummaryPrompt({ title: titre, totalChapters: chapters, description, langue });
        summaryText = await getAIWithRetry("ebook", `${EBOOK_SYSTEM_PROMPT}\n\n${summaryPrompt}`, 2000);
    }
    
    projet.summary = cleanMarkdown(summaryText);
    projet.progress = 20;
    await projet.save();
    console.log("✅ [PHASE 1] Outline sauvegardé");

    console.log("🤖 [PHASE 1] Génération introduction");
    const introWords = Math.floor(totalWordsTarget * 0.10);
    const youbookExtra = youbookContext ? `
CONTEXTE VIDÉO YOUTUBE (utilise ces informations pour enrichir le contenu) :
- Accroche : ${youbookContext.hook || ""}
- Problème résolu : ${youbookContext.probleme || ""}
- Transformation promise : ${youbookContext.transformation || ""}
- Points clés : ${(youbookContext.key_insights || []).join(", ")}
- Citation forte : "${youbookContext.verbatim || ""}"
Intègre naturellement ces éléments dans le contenu pour rester fidèle à la vidéo originale.
` : "";

    // ✅ Réutiliser l'intro de l'aperçu si elle existe déjà
    const projetForIntro = await Projet.findById(projetId);
    let introText;
    if (projetForIntro?.introduction && projetForIntro.introduction.length > 50) {
      console.log("✅ [PHASE 1] Réutilisation intro de l'aperçu");
      introText = projetForIntro.introduction;
    } else {
      introText = await getAIWithRetry(
        "ebook",
        `${EBOOK_SYSTEM_PROMPT}\n\n${getIntroPrompt({ title: titre, description, tone, audience, langue })}\n\nFais environ ${introWords} mots.${youbookExtra}`,
        2000
      );
    }
    
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
    const audience = projet.audience || "grand public francophone";  
    const tone = projet.tone || "professionnel et motivant";
    const youbookContext = projet.youbookContext || null;
    const langue = projet.langue || 'français';

    // Contexte Youbook à injecter dans tous les prompts
    const youbookExtra = youbookContext ? `

IMPORTANT — CET EBOOK EST BASÉ SUR UNE VIDÉO YOUTUBE. Reste fidèle à son contenu :
- Accroche de la vidéo : ${youbookContext.hook || ""}
- Problème traité : ${youbookContext.probleme || ""}
- Transformation promise : ${youbookContext.transformation || ""}
- Points clés : ${(youbookContext.key_insights || []).join(", ")}
- Citation forte à réutiliser : "${youbookContext.verbatim || ""}"
Intègre naturellement ces éléments dans le contenu pour rester fidèle à la vidéo originale.
` : "";

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

            // ✅ Réutiliser le début du chapitre 1 depuis l'aperçu
            const ch1PreviewText = chapterNumber === 1 ? projet.ch1Preview : null;
            
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
                    wordsTarget: wordsPerChapter,
                    langue 
                  })}${ch1PreviewText ? `\n\nIMPORTANT: Ne génère PAS le début de ce chapitre, commence directement à la suite de ce texte déjà écrit (continue à partir du milieu de la phrase) :\n"...${ch1PreviewText.slice(-300)}"\nContinue naturellement sans répéter ni reformuler ce qui précède.` : ""}\n\nINTERDIT: Ne commence PAS ce chapitre par une phrase du type "Vouloir changer", "Le désir de changement", "Vous avez probablement déjà" ou toute autre intro générique similaire aux autres chapitres. Ce chapitre doit avoir une accroche UNIQUE et différente des autres.\n\n${FORMAT_INSTRUCTIONS}${youbookExtra}`, 
                  dynamicMaxTokens
                );
                
                // ✅ Concaténer manuellement le ch1Preview avec la suite générée
                if (ch1PreviewText) {
                  chapterText = ch1PreviewText + "\n" + cleanMarkdown(chapterText);
                }
                
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
        `${EBOOK_SYSTEM_PROMPT}\n\n${getConclusionPrompt({ title: titre, description, summary: summaryText, langue })}${youbookExtra}`, 
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
  Tu es un Copywriter Expert spécialisé en marketing digital. 
  
  Rédige 4 contenus marketing distincts pour vendre l'ebook : "${titre}".
  Description : ${description}
  Audience cible : ${audience}
  Ton : ${tone}
  
  CONTEXTE : Adapte le contenu en fonction du sujet de l'ebook. Si le sujet concerne l'Afrique, mentionne-le naturellement. Sinon, reste générique et universel.
  
  CONTENUS À CRÉER :
  
  1. FACEBOOK_INSTA : 
     - Publicité courte et percutante (max 150 mots)
     - Commence par un hook captivant
     - Utilise des emojis pertinents
     - Termine par un CTA clair
  
  2. WHATSAPP : 
     - Message de diffusion directe (max 100 mots)
     - Ton personnel et conversationnel
     - Crée l'urgence ou la curiosité
     - CTA direct et actionnable
  
  3. LONG_COPY : 
     - Post LinkedIn/Blog avec storytelling (max 300 mots)
     - Commence par une accroche émotionnelle ou un problème
     - Développe la transformation promise
     - Preuve sociale ou autorité (sans inventer de chiffres)
     - CTA professionnel
  
  4. LANDING_PAGE :
     - Titre percutant (promesse claire)
     - Sous-titre (contexte/problème)
     - 3 bénéfices concrets et spécifiques
     - CTA irrésistible
     - Max 200 mots au total
  
  RÈGLES STRICTES :
  - Pas de Markdown (*, #, **, etc.)
  - Pas de mentions génériques comme "mon ebook" ou "ce guide"
  - Utilise le titre exact : "${titre}"
  - Adapte le vocabulaire à l'audience : ${audience}
  - Reste authentique et crédible (pas de chiffres inventés)
  - Si le sujet ne concerne PAS l'Afrique, n'en parle PAS
  
  FORMAT DE SORTIE OBLIGATOIRE :
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
    
    projet.chaptersText = chaptersArray.filter(c => c).join("\n\n\n");
    projet.conclusion = cleanMarkdown(conclusionText);
    projet.adsTexts = adsTexts;
    projet.progress = 80;
    projet.status = "generated_text";
    await projet.save();
    console.log("💾 [PHASE 2] Texte sauvegardé");

    // ============================================================================
    // 🚀 PDF ULTRA-OPTIMISÉ - VERSION CORRIGÉE
    // ============================================================================
    console.log("📄 [PHASE 2] Génération PDF - DÉBUT");
    console.log(`⏰ [PHASE 2] Timestamp: ${new Date().toISOString()}`);

    // ✅ Log RAM avant génération
    try {
      const memUsage = process.memoryUsage();
      console.log(`💾 [PHASE 2] RAM avant PDF: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB / ${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`);
    } catch(e) {}

    // ✅ NOUVEAU CODE - Extraction depuis HTML
const chaptersStruct = chaptersArray.map((c, i) => {
  let chapterTitle = `Chapitre ${i+1}`;
  
  if (c && c.length > 10) {
    const h2Match = c.match(/<h2[^>]*>(.+?)<\/h2>/i);
    const h3Match = c.match(/<h3[^>]*>(.+?)<\/h3>/i);
    
    if (h2Match && h2Match[1]) {
      chapterTitle = h2Match[1]
        .replace(/<[^>]+>/g, '')
        .replace(/Chapitre\s+\d+\s*[:\-]?\s*/i, '')
        .trim();
    } else if (h3Match && h3Match[1]) {
      chapterTitle = h3Match[1]
        .replace(/<[^>]+>/g, '')
        .trim();
    }
    
    if (chapterTitle.length < 3 || chapterTitle.length > 150) {
      chapterTitle = `Chapitre ${i+1}`;
    }
  }
  
  console.log(`📖 [PHASE 2] Ch.${i+1}: "${chapterTitle}"`);
  
  return { title: chapterTitle, content: c };
});

    const html = generateStyledHTML({
      title: titre || "Mon Ebook",
      author: authorName, 
      subtitle: description || "", 
      intro: projet.introduction,
      conclusion: cleanMarkdown(conclusionText),
      chaptersData: chaptersStruct,
      coverImage: null 
    }, template, langue);

    console.log(`🌐 [PHASE 2] HTML généré (${Math.round(html.length / 1024)}KB) - Template: ${template}`);

    let browser = null;
    let pdfBuffer = null;
    const MAX_PDF_RETRIES = 3;

    for (let pdfAttempt = 1; pdfAttempt <= MAX_PDF_RETRIES; pdfAttempt++) {
      try {
        console.log(`🔄 [PHASE 2] Tentative PDF ${pdfAttempt}/${MAX_PDF_RETRIES}`);
        console.log(`⏰ [PHASE 2] Timestamp tentative: ${new Date().toISOString()}`);
        
        // ✅ OPTIONS CHROMIUM ULTRA-OPTIMISÉES
        const launchOptions = {
          headless: 'new',
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--no-zygote',
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
            '--disable-accelerated-2d-canvas',
            '--disable-dev-tools',
            '--disable-web-security',
            '--font-render-hinting=none',
          ],
executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
          timeout: 180000,
          protocolTimeout: 180000,
          dumpio: false,
        };
        
        console.log(`🚀 [PHASE 2] Lancement Chromium...`);
        browser = await puppeteer.launch(launchOptions);
        console.log("✅ [PHASE 2] Browser lancé");

        const page = await browser.newPage();
        console.log("✅ [PHASE 2] Page créée");
        
        // ✅ BLOQUER RESSOURCES INUTILES (-50% RAM)
        await page.setRequestInterception(true);
        page.on('request', (req) => {
          const resourceType = req.resourceType();
          if (['image', 'media', 'websocket', 'manifest'].includes(resourceType)) {
            req.abort();
          } else {
            req.continue();
          }
        });
        console.log("✅ [PHASE 2] Interception activée");
        
        await page.setViewport({ width: 794, height: 1123 });
        console.log("✅ [PHASE 2] Viewport A4 configuré");
        
        console.log(`📝 [PHASE 2] Chargement HTML...`);
        
        // ✅ CHARGEMENT OPTIMISÉ (3x plus rapide)
        await page.setContent(html, { 
          waitUntil: "domcontentloaded",
          timeout: 120000
        });
        console.log("✅ [PHASE 2] HTML chargé");

        // ✅ Attendre fonts Google uniquement
        await page.evaluate(() => document.fonts.ready);
        console.log("✅ [PHASE 2] Fonts chargées");

        console.log("🖨️ [PHASE 2] Génération du PDF...");
        pdfBuffer = await page.pdf({
          format: "A4",
          printBackground: true,
          margin: { top: "0mm", bottom: "0mm" },
          preferCSSPageSize: true,
          timeout: 120000
        });
        console.log(`✅ [PHASE 2] PDF généré (${Math.round(pdfBuffer.length / 1024)}KB)`);

        // ✅ Fermer immédiatement
        console.log("🔒 [PHASE 2] Fermeture browser...");
        await browser.close();
        browser = null;
        console.log("✅ [PHASE 2] Browser fermé");
        
        // Libérer mémoire Node.js
        if (global.gc) { try { global.gc(); } catch(e) {} }
        
        // Log RAM (heapUsed Node — pas RAM totale Chromium)
        try {
          const memUsage = process.memoryUsage();
          console.log(`💾 [PHASE 2] RAM heap Node: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB / RSS total: ${Math.round(memUsage.rss / 1024 / 1024)}MB`);
        } catch(e) {}
        
        break;

      } catch (pdfError) {
        console.error(`❌ [PHASE 2] Tentative ${pdfAttempt} ÉCHOUÉE`);
        console.error(`❌ [PHASE 2] Type: ${pdfError.name}`);
        console.error(`❌ [PHASE 2] Message: ${pdfError.message}`);
        
        // ✅ Log RAM après erreur
        try {
          const memUsage = process.memoryUsage();
          console.log(`💾 [PHASE 2] RAM après erreur: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`);
        } catch(e) {}
        
        // ✅ Toujours fermer le browser
        if (browser) {
          try { 
            console.log("🔒 [PHASE 2] Fermeture browser après erreur...");
            await browser.close(); 
            console.log("✅ [PHASE 2] Browser fermé");
          } catch(closeErr) {
            console.error("⚠️ [PHASE 2] Erreur fermeture:", closeErr.message);
          }
          browser = null;
        }
        
        // ✅ Si dernière tentative, throw
        if (pdfAttempt >= MAX_PDF_RETRIES) {
          console.error(`🚨 [PHASE 2] ÉCHEC FINAL après ${MAX_PDF_RETRIES} tentatives`);
          throw new Error(`PDF échoué après ${MAX_PDF_RETRIES} tentatives: ${pdfError.message}`);
        }
        
        // ✅ Pause avant retry
        const pauseTime = pdfAttempt * 3000;
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

    // ✅ Génération DOCX (non bloquant — PDF livré même si DOCX fail)
    console.log("📝 [PHASE 2] Génération DOCX...");
    let docxUrl = null;
    try {
      const docxBuffer = await generateDocx({
        title: titre || "Mon Ebook",
        author: authorName || "",
        subtitle: projet.description || "",
        intro: projet.introduction || "",
        conclusion: cleanMarkdown(conclusionText),
        chaptersData: chaptersStruct,
      });
      const docxUpload = await uploadBufferToCloudinary(docxBuffer, {
        folder: "bookzy/ebooks",
        publicId: `${titre || "ebook"}-${projetId}-docx`,
        resourceType: "raw",
        extension: "docx",
        timeout: 120000
      });
      docxUrl = docxUpload.secure_url;
      console.log("✅ [PHASE 2] DOCX uploadé:", docxUrl);
    } catch (docxErr) {
      console.error("⚠️ [PHASE 2] DOCX échoué (non bloquant):", docxErr.message);
    }

    const pdfUpload = await uploadBufferToCloudinary(pdfBuffer, {
      folder: "bookzy/ebooks",
      publicId: `${titre || "ebook"}-${projetId}`,
      resourceType: "raw",
      extension: "pdf",
      timeout: 180000
    });

    console.log(`✅ [PHASE 2] Upload terminé en ${Date.now() - uploadStartTime}ms`);

    projet.pdfUrl = pdfUpload.secure_url;
    if (docxUrl) projet.docxUrl = docxUrl;
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
              projectId: projetId.toString(),
              pdfUrl: projet.pdfUrl || null,
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
      // ✅ Rembourser les crédits automatiquement si PDF échoue
      const projetFailed = await Projet.findById(projetId);
      const refundUserId = userId || projetFailed?.userId?.toString();
      if (projetFailed?.isPaid && refundUserId) {
        try {
          const userToRefund = await User.findById(refundUserId);
          if (userToRefund) {
            userToRefund.credits.balance = (userToRefund.credits.balance || 0) + 20;
            await userToRefund.save();
            console.log(`💰 [PHASE 2] 20 crédits remboursés → user ${userId} solde: ${userToRefund.credits.balance}`);
          }
        } catch(refundErr) {
          console.error("❌ [PHASE 2] Erreur remboursement:", refundErr.message);
        }
      }
      await Projet.findByIdAndUpdate(projetId, {
        status: "ERROR",
        isPaid: false,
        progress: 0,
        errorMessage: `Phase 2: ${err.message}`,
        $inc: { retryCount: 1 }
      });
      console.log("✅ [PHASE 2] ERROR sauvegardé + crédits remboursés + isPaid reset");
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
    let { projetId, transactionId, outline, force, youbookContext } = body;
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
      
      // ✅ Relancer UNIQUEMENT le PDF si bloqué à 80%
      if (projet.status === "generated_text" && projet.progress >= 80) {
        console.log(`♻️ [RETRY] Reprise génération PDF pour ${projetId}`);
        const chaptersArray = projet.chaptersText ? projet.chaptersText.split("\n\n\n") : [];
        const totalChapters = chaptersArray.length || 5;
        const wordsPerChapter = 250;
        generatePhase2(projet._id, userId, projet.summary, wordsPerChapter, totalChapters);
        return NextResponse.json({ 
          success: true, 
          message: "Relance génération PDF",
          projetId: projet._id.toString()
        });
      }

      // ✅ RETRY depuis ERROR — re-débiter les crédits et relancer Phase 2
      // isPaid a été reset à false lors du remboursement automatique
      if (projet.status === "ERROR" && !projet.isPaid) {
        console.log(`🔁 [RETRY] Projet ERROR → relance Phase 2 pour ${projetId}`);
        // Vérifier et débiter les crédits
        const { user: userWithCredits, error: creditError } = await checkCredits(req, "ebook");
        if (creditError) return creditError;
        await userWithCredits.spendCredits("ebook");
        userId = userWithCredits._id;
        console.log(`💳 [RETRY] 20 crédits déduits pour retry — solde: ${userWithCredits.credits.balance}`);
        // Reset le projet pour la relance
        projet.status = "generated_text";
        projet.isPaid = true;
        projet.progress = 75;
        projet.errorMessage = null;
        await projet.save();
        // Relancer uniquement Phase 2 (contenu déjà en base)
        const chaptersArray = projet.chaptersText ? projet.chaptersText.split("\n\n\n") : [];
        const totalChapters = chaptersArray.length || projet.chapters || 5;
        const wordsPerChapter = 250;
        generatePhase2(projet._id, userId, projet.summary, wordsPerChapter, totalChapters);
        return NextResponse.json({
          success: true,
          message: "Relance PDF en cours",
          projetId: projet._id.toString()
        });
      }
      
      // ✅ Autoriser force retry
      if (!force && projet.status === "processing") {
        return NextResponse.json({ 
          success: true, 
          message: "Déjà en cours",
          projetId: projet._id.toString()
        });
      }
      
      // ✅ Log si force retry
      if (force && projet.status === "processing") {
        console.log(`🔥 [FORCE] Régénération forcée du projet ${projetId}`);
      }

      // ✅ Débiter les crédits si projet DRAFT ou PREVIEW_READY et pas encore payé
      if ((projet.status === "DRAFT" || projet.status === "PREVIEW_READY") && !projet.isPaid) {
        const { user: userWithCredits, error: creditError } = await checkCredits(req, "ebook");
        if (creditError) return creditError;
        await userWithCredits.spendCredits("ebook");
        projet.isPaid = true;
        await projet.save();
        userId = userWithCredits._id;
        console.log(`💳 [Generate] 20 crédits déduits (DRAFT→processing) — solde: ${userWithCredits.credits.balance}`);

        // ✅ Annuler les EmailJobs de relance en attente pour ce projet
        try {
          const EmailJob = (await import("@/models/EmailJob")).default;
          await EmailJob.updateMany(
            { "payload.projetId": projet._id.toString(), type: "ebook_relance", status: "pending" },
            { $set: { status: "cancelled" } }
          );
          console.log(`📧 [Generate] EmailJobs relance annulés pour projet ${projet._id}`);
        } catch(e) {
          console.warn("⚠️ [Generate] Erreur annulation EmailJobs:", e.message);
        }
      } else {
        userId = projet.userId?._id || projet.userId;
      }

    } else {
      // ─── NOUVEAU PROJET ────────────────────────────────────────────────────

      // ✅ AJOUT : Vérifier et déduire 20 crédits avant tout
      const { user: userWithCredits, error: creditError } = await checkCredits(req, "ebook");
      if (creditError) return creditError;
      await userWithCredits.spendCredits("ebook");
      userId = userWithCredits._id;
      console.log(`💳 [Generate] 20 crédits déduits — solde restant: ${userWithCredits.credits.balance}`);

      // ✅ SÉCURITÉ : Vérifier que le transactionId existe (garde compatibilité anciennes transactions)
      if (!transactionId) {
        // Nouveau flow crédits — pas de transactionId requis
        console.log("✅ [POST] Nouveau flow crédits — pas de transactionId");
      } else {
        // Ancien flow — vérifier la transaction existante
        const tx = await Transaction.findById(transactionId);
        if (!tx) {
          return NextResponse.json({ success: false, message: "Transaction introuvable" }, { status: 404 });
        }
        if (tx.status !== "completed") {
          return NextResponse.json({ success: false, message: "Paiement non confirmé" }, { status: 403 });
        }

        // ✅ Vérifier si un projet existe déjà pour cette transaction
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

      let { titre, description, tone, audience, pages, chapters, template: bodyTemplate, outline: bodyOutline, langue: bodyLangue } = body;
      let templateFinal; 
      let outlineFinal = bodyOutline;

      console.log("📥 [POST] Body reçu - bodyTemplate:", bodyTemplate);

      // ✅ Récupérer kitData depuis la transaction si elle existe
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

      const validTemplates = ["modern", "luxe", "educatif", "energie", "minimal", "creative", "tech", "nature", "fashion", "corporate", "retro", "futuriste", "afrique", "sport", "wellness", "business"];
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
        langue: bodyLangue || 'français',
        isPaid: true,
        status: "processing",
        progress: 5,
        youbookContext: youbookContext || null,
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