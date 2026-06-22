import { getBrowser } from "./puppeteer.js";
import { v2 as cloudinary } from "cloudinary";
import { PDFDocument } from "pdf-lib";
import { generateExpressHTML } from "./pdf/expressHtmlGenerator.js"; // ✅ IMPORT TON GÉNÉRATEUR

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function generateExpressPDF({
  titre,
  introduction,
  conclusion,
  chapters,
  template = "modern",
  watermark = false
}) {
  try {
    console.log(`📄 [EXPRESS PDF] Génération PDF : "${titre}" (template: ${template}, watermark: ${watermark})`);

    // ✅ GÉNÉRER LE HTML AVEC TON SYSTÈME DE TEMPLATES
    const htmlContent = generateExpressHTML(
      {
        title: titre,
        author: "Expert", // Tu peux ajouter l'auteur si nécessaire
        introduction: introduction || "",
        conclusion: conclusion || "",
        chapters: chapters
      },
      template
    );

    // ✅ AJOUTER LE WATERMARK SI NÉCESSAIRE
    let finalHTML = htmlContent;
    
    if (watermark) {
      // Injecter le watermark dans le HTML avant </body>
      const watermarkHTML = `
        <div style="
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 100px;
          font-weight: bold;
          color: rgba(0, 0, 0, 0.08);
          pointer-events: none;
          z-index: 99999;
          white-space: nowrap;
          font-family: Arial, sans-serif;
        ">
          APERÇU BOOKZY
        </div>
      `;
      
      finalHTML = htmlContent.replace('</body>', watermarkHTML + '</body>');
    }

    // ✅ GÉNÉRER LE PDF AVEC PUPPETEER
    const browser = await getBrowser();

    const page = await browser.newPage();

    await page.setContent(finalHTML, { 
      waitUntil: 'domcontentloaded',
      timeout: 60000 
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      preferCSSPageSize: true
    });

    await browser.close();

    // ✅ UPLOAD VERS CLOUDINARY
    console.log(`📤 [EXPRESS PDF] Upload vers Cloudinary...`);

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'bookzy-express',
          resource_type: 'raw',
          format: 'pdf',
          public_id: `${Date.now()}-${titre.substring(0, 30).replace(/[^a-z0-9]/gi, '-')}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(pdfBuffer);
    });

    console.log(`✅ [EXPRESS PDF] PDF généré avec succès : ${uploadResult.secure_url}`);

    return {
      success: true,
      pdfUrl: uploadResult.secure_url
    };

  } catch (error) {
    console.error("❌ [EXPRESS PDF] Erreur:", error);
    return {
      success: false,
      error: error.message
    };
  }
}