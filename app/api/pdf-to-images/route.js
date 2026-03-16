// /app/api/pdf-to-images/route.js
// 
// VERSION CLOUDINARY - Haute qualité
// Convertit PDF en images via Cloudinary
//
// Qualité améliorée : 1200px de large (au lieu de 800px)
// Format : PNG pour plus de netteté sur le texte

import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const { pdfUrl, maxPages = 12 } = await request.json();

    if (!pdfUrl) {
      return NextResponse.json({ success: false, error: "URL PDF requise" }, { status: 400 });
    }

    console.log("📄 [PDF-to-Images] Début conversion Cloudinary:", pdfUrl);

    // Télécharger le PDF
    console.log("⬇️ [PDF-to-Images] Téléchargement PDF...");
    const pdfResponse = await fetch(pdfUrl);
    if (!pdfResponse.ok) {
      throw new Error(`Impossible de télécharger le PDF: ${pdfResponse.status}`);
    }
    const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer());
    const base64Pdf = pdfBuffer.toString("base64");
    console.log("✅ [PDF-to-Images] PDF téléchargé:", pdfBuffer.length, "bytes");

    // Upload le PDF sur Cloudinary
    console.log("⬆️ [PDF-to-Images] Upload PDF sur Cloudinary...");
    const uploadResult = await cloudinary.uploader.upload(
      `data:application/pdf;base64,${base64Pdf}`,
      {
        folder: "bookzy-express/pdf-temp",
        resource_type: "image",
        format: "pdf",
        pages: true,
      }
    );

    console.log("✅ [PDF-to-Images] PDF uploadé:", uploadResult.public_id);
    
    // Récupérer le nombre de pages
    const totalPages = uploadResult.pages || 1;
    const pagesToConvert = Math.min(totalPages, maxPages);
    
    console.log(`📚 [PDF-to-Images] ${totalPages} pages détectées, conversion de ${pagesToConvert}`);

    // Générer les URLs des images pour chaque page
    // HAUTE QUALITÉ : 1200px, PNG, qualité 100
    const imageUrls = [];
    
    for (let pageNum = 1; pageNum <= pagesToConvert; pageNum++) {
      const imageUrl = cloudinary.url(uploadResult.public_id, {
        resource_type: "image",
        format: "png", // PNG pour texte net
        page: pageNum,
        transformation: [
          { width: 1200, crop: "limit" }, // 1200px pour bonne qualité
          { quality: 100 }, // Qualité maximale
          { dpr: "auto" }, // Adapte au device pixel ratio
        ]
      });
      
      imageUrls.push({
        page: pageNum,
        url: imageUrl,
        width: 1200,
        height: null
      });
      
      console.log(`📷 [PDF-to-Images] Page ${pageNum} générée`);
    }

    console.log("✅ [PDF-to-Images] Conversion terminée:", imageUrls.length, "images");

    // Supprimer le PDF temporaire après 2 minutes
    setTimeout(async () => {
      try {
        await cloudinary.uploader.destroy(uploadResult.public_id, { resource_type: "image" });
        console.log("🗑️ [PDF-to-Images] PDF temp supprimé");
      } catch (e) {
        // Ignorer
      }
    }, 120000);

    return NextResponse.json({
      success: true,
      images: imageUrls,
      totalPages: pagesToConvert
    });

  } catch (error) {
    console.error("❌ [PDF-to-Images] Erreur:", error);

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}