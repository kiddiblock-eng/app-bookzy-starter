export const dynamic = "force-dynamic";
export const maxDuration = 120;
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Projet from "@/models/Projet";
import { getAIText } from "@/lib/ai";
import {
  getSummaryPrompt,
  getIntroPrompt,
  getChapterPrompt,
  EBOOK_SYSTEM_PROMPT
} from "@/lib/prompts/ebookPrompts";
import { generateStyledHTML } from "@/lib/pdf/htmlGenerator";
import { uploadBufferToCloudinary } from "@/lib/cloudinary";
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
  const BACKOFF = [3000, 6000, 12000];
  for (let i = 0; i < retries; i++) {
    try {
      const result = await getAIText(context, prompt, maxTokens);
      return result;
    } catch (error) {
      if (i < retries - 1) { await delay(BACKOFF[i]); continue; }
      throw error;
    }
  }
}

function getUserIdFromCookie(req) {
  const cookie = req.headers.get("cookie") || "";
  const token = cookie.split(";").map(c => c.trim()).find(c => c.startsWith("bookzy_token="))?.split("=")[1];
  try { return jwt.verify(token, process.env.JWT_SECRET)?.id || null; }
  catch { return null; }
}

export async function POST(req) {
  try {
    await dbConnect();
    const userId = getUserIdFromCookie(req);
    if (!userId) return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });

    const body = await req.json();
    // ✅ langue ajouté
    const { titre, description, tone, audience, pages, chapters, template, outline, projetId, langue } = body;

    if (!titre) return NextResponse.json({ success: false, message: "Titre requis" }, { status: 400 });

    const langueFinale = langue || "français";
    const isEn = langueFinale === "anglais";

    // ✅ Rate limit aperçus
    if (!projetId) {
      const User = (await import("@/models/User")).default;
      const userDoc = await User.findById(userId).select("plan credits");
      const isFree = !userDoc?.plan || userDoc.plan === "free";

      const previewCount = await Projet.countDocuments({
        userId,
        status: "PREVIEW_READY",
        isPaid: false,
      });

      if (isFree && previewCount >= 3) {
        return NextResponse.json({ success: false, limitReached: true, message: "Limite atteinte" }, { status: 429 });
      }

      if (!isFree && previewCount >= 5) {
        const creditCost = 2;
        if ((userDoc.credits?.balance || 0) < creditCost) {
          return NextResponse.json({ success: false, insufficientCredits: true, message: "Crédits insuffisants pour l'aperçu" }, { status: 402 });
        }
        userDoc.credits.balance -= creditCost;
        await userDoc.save();
        console.log(`💳 [PREVIEW] 2 crédits débités (aperçu > 5) — solde: ${userDoc.credits.balance}`);
      }
    }

    let projet;
    if (projetId) {
      projet = await Projet.findById(projetId);
      if (!projet) return NextResponse.json({ success: false, message: "Projet introuvable" }, { status: 404 });
    } else {
      // ✅ langue sauvegardé dans le projet
      projet = await Projet.create({
        userId, titre, description, tone, audience,
        pages: pages || 30, chapters: chapters || 6,
        template: template || "modern",
        langue: langueFinale,
        status: "DRAFT", isPaid: false, progress: 0,
      });
    }

    const projetIdFinal = projet._id.toString();
    const totalChapters = Number(chapters) || 6;

    // 1. SOMMAIRE
    let summaryText = "";
    if (outline && Array.isArray(outline) && outline.length > 0) {
      const chapterWord = isEn ? "Chapter" : "Chapitre";
      const cleanChapters = outline.filter(l =>
        !l.toLowerCase().includes("introduction") && !l.toLowerCase().includes("conclusion")
      );
      summaryText = cleanChapters.map((l, i) =>
        l.toLowerCase().includes("chapitre") || l.toLowerCase().includes("chapter")
          ? l
          : `${chapterWord} ${i + 1} : ${l}`
      ).join("\n");
    } else {
      const summaryPrompt = getSummaryPrompt({ title: titre, totalChapters, description, langue: langueFinale });
      summaryText = await getAIWithRetry("ebook", `${EBOOK_SYSTEM_PROMPT}\n\n${summaryPrompt}`, 1500);
    }
    const cleanSummary = cleanMarkdown(summaryText);

    // 2. INTRODUCTION
    const introText = await getAIWithRetry(
      "ebook",
      `${EBOOK_SYSTEM_PROMPT}\n\n${getIntroPrompt({ title: titre, description, tone, audience, langue: langueFinale })}\n\n${isEn ? "Write approximately 300 words maximum." : "Fais environ 300 mots maximum."}`,
      1200
    );
    const cleanIntro = cleanMarkdown(introText);

    // 3. DÉBUT CHAPITRE 1
    const chapterPattern = isEn
      ? /Chapter 1\s*[:：]\s*(.+?)(?=\n|$)/i
      : /Chapitre 1\s*[:：]\s*(.+?)(?=\n|$)/i;
    const ch1TitleMatch = summaryText.match(chapterPattern);
    const ch1Title = ch1TitleMatch ? ch1TitleMatch[1].trim() : (isEn ? "Chapter 1" : "Chapitre 1");

    const ch1Preview = await getAIWithRetry(
      "ebook",
      `${EBOOK_SYSTEM_PROMPT}\n\n${getChapterPrompt({
        chapterNumber: 1, chapterTitle: ch1Title, title: titre,
        description, summary: summaryText, totalChapters, wordsTarget: 250,
        langue: langueFinale,
      })}\n\n${isEn ? "Generate ONLY the first 250 words. Cut mid-sentence — this is a preview." : "Génère UNIQUEMENT les 250 premiers mots. Coupe au milieu d'une phrase — c'est un aperçu."}`,
      800
    );
    const cleanCh1 = cleanMarkdown(ch1Preview);

    projet.summary = cleanSummary;
    projet.introduction = cleanIntro;
    projet.ch1Preview = cleanCh1;
    projet.status = "PREVIEW_READY";
    projet.progress = 30;
    await projet.save();

    const sommaireLines = cleanSummary
      .replace(/<\/li>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .split("\n")
      .map(l => l.replace(/^\d+[\.\)]\s*/, "").replace(/^[-•*]\s*/, "").trim())
      .filter(l => l.length > 3 && !l.toLowerCase().includes("introduction") && !l.toLowerCase().includes("conclusion"))
      .slice(0, totalChapters + 2);

    // ✅ EmailJobs de relance
    try {
      const User = (await import("@/models/User")).default;
      const EmailJob = (await import("@/models/EmailJob")).default;
      const userDoc = await User.findById(userId).select("email firstName nom name");
      if (userDoc?.email) {
        const now = new Date();
        const delays = [1, 2, 4, 7];
        const jobs = delays.map((days, idx) => ({
          userId,
          email: userDoc.email,
          firstName: userDoc.firstName || userDoc.nom || userDoc.name?.split(" ")[0] || "",
          type: "ebook_relance",
          payload: {
            projetId: projetIdFinal,
            titre,
            sommaire: sommaireLines,
            emailIndex: idx + 1,
          },
          sendAt: new Date(now.getTime() + days * 24 * 60 * 60 * 1000),
          status: "pending",
        }));
        await EmailJob.insertMany(jobs);
        console.log(`📧 [PREVIEW] ${jobs.length} EmailJobs relance créés`);
      }
    } catch (e) {
      console.warn("⚠️ [PREVIEW] EmailJobs non créés:", e.message);
    }

    let authorName = "";
    try {
      const User = (await import("@/models/User")).default;
      const userDoc = await User.findById(userId).select("firstName nom name");
      authorName = userDoc?.firstName || userDoc?.nom || userDoc?.name?.split(" ")[0] || "";
    } catch(e) {}

    // 4. GÉNÉRER SCREENSHOTS PREVIEW AVEC PUPPETEER
    let previewImages = [];
    let previewHTML = "";
    try {
      const chaptersData = sommaireLines.map((title, idx) => ({
        title: title.replace(/^(Chapitre|Chapter) \d+\s*[:：]\s*/i, "").trim() || `${isEn ? "Chapter" : "Chapitre"} ${idx + 1}`,
        content: idx === 0
          ? cleanCh1
          : `<p style="color:#94a3b8;">${isEn ? "Content locked." : "Contenu verrouillé."}</p>`,
      }));

      // ✅ langue passé à generateStyledHTML
      previewHTML = generateStyledHTML({
        title: titre,
        author: authorName,
        subtitle: description || "",
        intro: cleanIntro,
        conclusion: "",
        chaptersData,
      }, template || "modern", langueFinale);

      const browser = await puppeteer.launch({
        headless: "new",
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium",
        args: ["--no-sandbox","--disable-setuid-sandbox","--disable-dev-shm-usage","--disable-gpu","--no-zygote"],
        timeout: 60000,
      });

      const page = await browser.newPage();
      await page.setRequestInterception(true);
      page.on("request", (r) => {
        if (["media","websocket"].includes(r.resourceType())) r.abort();
        else r.continue();
      });

      await page.setViewport({ width: 908, height: 1123, deviceScaleFactor: 1.5 });
      await page.setContent(previewHTML, { waitUntil: "domcontentloaded", timeout: 30000 });
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(() => {
        document.body.style.paddingLeft = "57px";
        document.body.style.paddingRight = "57px";
        document.body.style.paddingTop = "76px";
        const cover = document.querySelector(".cover-page");
        if (cover) {
          cover.style.width = "calc(100% + 114px)";
          cover.style.minHeight = "1123px";
          cover.style.margin = "-76px -57px 0";
          cover.style.padding = "0";
          cover.style.boxSizing = "content-box";
        }
      });
      await delay(500);

      const shot1 = await page.screenshot({ type: "jpeg", quality: 85, clip: { x: 0, y: 0,    width: 908, height: 1123 } });
      const shot2 = await page.screenshot({ type: "jpeg", quality: 85, clip: { x: 0, y: 1123, width: 908, height: 1123 } });
      const shot3 = await page.screenshot({ type: "jpeg", quality: 85, clip: { x: 0, y: 2246, width: 908, height: 1123 } });
      const shot4 = await page.screenshot({ type: "jpeg", quality: 85, clip: { x: 0, y: 3369, width: 908, height: 1123 } });

      await browser.close();

      const uploads = await Promise.all([
        uploadBufferToCloudinary(Buffer.from(shot1), { folder: "bookzy/previews", publicId: `preview-${projetIdFinal}-p1`, resourceType: "image", extension: "jpg" }),
        uploadBufferToCloudinary(Buffer.from(shot2), { folder: "bookzy/previews", publicId: `preview-${projetIdFinal}-p2`, resourceType: "image", extension: "jpg" }),
        uploadBufferToCloudinary(Buffer.from(shot3), { folder: "bookzy/previews", publicId: `preview-${projetIdFinal}-p3`, resourceType: "image", extension: "jpg" }),
        uploadBufferToCloudinary(Buffer.from(shot4), { folder: "bookzy/previews", publicId: `preview-${projetIdFinal}-p4`, resourceType: "image", extension: "jpg" }),
      ]);

      previewImages = uploads.map(u => u.secure_url);
      console.log(`✅ [PREVIEW] ${previewImages.length} screenshots uploadés`);

      projet.previewImages = previewImages;
      await projet.save();

    } catch (e) {
      console.warn("⚠️ [PREVIEW] Puppeteer failed:", e.message);
    }

    return NextResponse.json({
      success: true,
      projetId: projetIdFinal,
      preview: {
        sommaire: sommaireLines,
        introduction: cleanIntro,
        chapitre1Preview: cleanCh1,
        ch1Title,
        previewImages,
        previewHTML,
        authorName,
      },
    });

  } catch (e) {
    console.error("❌ [PREVIEW] Erreur:", e.message);
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}