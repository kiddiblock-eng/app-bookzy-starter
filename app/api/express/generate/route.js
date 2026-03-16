export const dynamic = "force-dynamic";
export const maxDuration = 300;

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Projet from "@/models/Projet";
import User from "@/models/User";
import { Resend } from "resend";
import { ebookReadyTemplate } from "@/lib/emailTemplates/ebookReadyTemplate";
import { generateExpressHTML } from "@/lib/pdf/expressHtmlGenerator";
import { uploadBufferToCloudinary } from "@/lib/cloudinary";
import puppeteer from "puppeteer";
import { PDFDocument } from "pdf-lib";

// ✅ AJOUT : Import middleware crédits
import { checkCredits } from "@/middleware/checkCredits";

const delay = (ms) => new Promise(res => setTimeout(res, ms));

export async function POST(req) {
  let browser = null;
  
  try {
    await dbConnect();

    // ✅ AJOUT : Vérifier et déduire 10 crédits (mise en page)
    const { user: userWithCredits, error: creditError } = await checkCredits(req, "mise_en_page");
    if (creditError) return creditError;
    await userWithCredits.spendCredits("mise_en_page");
    console.log(`💳 [Express Generate] 10 crédits déduits — solde restant: ${userWithCredits.credits.balance}`);
    
    const { projetId, transactionId } = await req.json();
    
    if (!projetId) {
      return NextResponse.json(
        { success: false, error: "ProjetId manquant" },
        { status: 400 }
      );
    }
    
    console.log(`🚀 [Express Generate] Début pour projet ${projetId}`);
    
    const projet = await Projet.findById(projetId);
    
    if (!projet) {
      return NextResponse.json(
        { success: false, error: "Projet introuvable" },
        { status: 404 }
      );
    }
    
    if (projet.status === "COMPLETED" && projet.pdfUrl) {
      console.log(`✅ [Express Generate] Déjà généré`);
      return NextResponse.json({
        success: true,
        alreadyGenerated: true,
        pdfUrl: projet.pdfUrl
      });
    }
    
    projet.status = "processing";
    projet.progress = 10;
    await projet.save();
    
    console.log(`📖 [Express Generate] Titre: ${projet.titre}`);
    console.log(`📚 [Express Generate] Chapitres: ${projet.expressChapters?.length || 0}`);
    console.log(`📝 [Express Generate] Intro: ${projet.introduction ? 'Oui' : 'Non'}`);
    console.log(`📝 [Express Generate] Conclusion: ${projet.conclusion ? 'Oui' : 'Non'}`);
    
    let authorName = "Auteur";
    try {
      if (projet.userId) {
        const user = await User.findById(projet.userId);
        if (user) {
          authorName = user.firstName || user.nom || "Auteur";
        }
      }
    } catch (e) {
      console.error("⚠️ [Express Generate] Erreur user:", e.message);
    }
    
    projet.progress = 20;
    await projet.save();
    
    // ✅ NETTOYAGE INTELLIGENT - SPLIT SUR NUMÉROS + PHRASES
    const cleanHTMLContent = (html) => {
      if (!html) return "";
      
      const trimmed = html.trim().replace(/\r\n/g, '\n');
      
      // Si déjà formaté en HTML, garder tel quel
      if (trimmed.includes('<p>') || trimmed.includes('<div>')) {
        return trimmed;
      }
      
      // ✅ SPLIT INTELLIGENT : Numéros (1., 2.) OU double saut OU point + majuscule
      const paragraphs = trimmed
        .split(/(?:\n{2,})|(?=\n\d+\.)|(?<=\.)(\s+)(?=[A-Z])/g)
        .map(p => p?.trim())
        .filter(p => p && p.length > 15);
      
      // Si on a trouvé des paragraphes, les wrapper
      if (paragraphs.length > 1) {
        return paragraphs.map(p => `<p>${p.replace(/\n/g, ' ')}</p>`).join('\n');
      }
      
      // Fallback : split basique sur retours simples
      return trimmed
        .split('\n')
        .map(p => p.trim())
        .filter(p => p.length > 15)
        .map(p => `<p>${p}</p>`)
        .join('\n');
    };

    const chaptersData = (projet.expressChapters || []).map(ch => ({
      title: ch.title,
      content: cleanHTMLContent(ch.content)
    }));

    const introHTML = cleanHTMLContent(projet.introduction);
    const conclusionHTML = cleanHTMLContent(projet.conclusion);
    
    console.log(`🎨 [Express Generate] Template: ${projet.template}`);
    
    projet.progress = 40;
    await projet.save();
    
    const html = generateExpressHTML({
      title: projet.titre || "Mon eBook",
      author: authorName,
      introduction: introHTML,
      conclusion: conclusionHTML,
      chapters: chaptersData
    }, projet.template || "modern");
    
    console.log(`✅ [Express Generate] HTML généré (${Math.round(html.length / 1024)}KB)`);
    
    projet.progress = 60;
    await projet.save();
    
    console.log(`🖨️ [Express Generate] Génération PDF...`);
    
    const launchOptions = {
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-zygote',
        '--single-process',
      ],
      timeout: 180000,
    };

    if (process.env.NODE_ENV === 'production') {
      launchOptions.executablePath = '/usr/bin/chromium';
    }
    
    browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
    
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const resourceType = req.resourceType();
      if (['image', 'media', 'websocket', 'manifest'].includes(resourceType)) {
        req.abort();
      } else {
        req.continue();
      }
    });
    
    await page.setViewport({ width: 794, height: 1123 });
    
    await page.setContent(html, { waitUntil: "networkidle0", timeout: 120000 });
    await page.evaluate(() => document.fonts.ready);
    
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0mm", bottom: "0mm" },
      preferCSSPageSize: true,
      timeout: 120000
    });
    
    await browser.close();
    browser = null;
    
    console.log(`✅ [Express Generate] PDF généré (${Math.round(pdfBuffer.length / 1024)}KB)`);
    
    const loadedPdf = await PDFDocument.load(pdfBuffer);
    const pageCount = loadedPdf.getPageCount();
    console.log(`📄 [Express Generate] PDF: ${pageCount} pages`);
    
    projet.progress = 80;
    await projet.save();
    
    console.log(`☁️ [Express Generate] Upload Cloudinary...`);
    
    const pdfUpload = await uploadBufferToCloudinary(pdfBuffer, {
      folder: "bookzy/express",
      publicId: `${projet.titre || "ebook"}-${projetId}`,
      resourceType: "raw",
      extension: "pdf",
      timeout: 180000
    });
    
    console.log(`✅ [Express Generate] Upload terminé`);
    
    projet.pdfUrl = pdfUpload.secure_url;
    projet.pages = pageCount;
    projet.status = "COMPLETED";
    projet.progress = 100;
    projet.completedAt = new Date();
    await projet.save();
    
    console.log(`🎉 [Express Generate] TERMINÉ`);
    console.log(`📄 [Express Generate] PDF: ${pdfUpload.secure_url}`);
    
    if (projet.userId) {
      try {
        const user = await User.findById(projet.userId);
        if (user?.email) {
          const resend = new Resend(process.env.RESEND_API_KEY);
          await resend.emails.send({
            from: "Bookzy <no-reply@bookzy.io>",
            to: user.email,
            subject: "🎉 Votre eBook Express est prêt !",
            html: ebookReadyTemplate({
              firstName: user.firstName || "cher utilisateur",
              ebookTitle: projet.titre,
              projectId: projetId.toString()
            }),
          });
          console.log(`✅ [Express Generate] Email envoyé`);
        }
      } catch (emailErr) {
        console.error("❌ [Express Generate] Erreur email:", emailErr.message);
      }
    }
    
    return NextResponse.json({
      success: true,
      pdfUrl: projet.pdfUrl,
      projetId: projetId.toString()
    });
    
  } catch (error) {
    console.error("❌ [Express Generate] ERREUR:", error);
    
    if (browser) {
      try {
        await browser.close();
      } catch (e) {
        console.error("⚠️ [Express Generate] Erreur fermeture browser:", e.message);
      }
    }
    
    try {
      if (projetId) {
        await Projet.findByIdAndUpdate(projetId, {
          status: "ERROR",
          errorMessage: `Express Generate: ${error.message}`
        });
      }
    } catch (e) {
      console.error("❌ [Express Generate] Erreur update projet:", e.message);
    }
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}