// app/api/upload/route.js
// API pour upload d'images et fichiers vers Cloudinary

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    // Auth
    const cookieStore = await cookies();
    const token = cookieStore.get("bookzy_token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Non connecté" },
        { status: 401 }
      );
    }
    
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id || decoded.userId || decoded._id;
    } catch {
      return NextResponse.json(
        { success: false, error: "Token invalide" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const type = formData.get("type") || "image"; // "avatar", "cover", "logo", "product"

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Aucun fichier fourni" },
        { status: 400 }
      );
    }

    // Types valides selon le type d'upload
    const imageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const documentTypes = ["application/pdf", "application/epub+zip"];
    
    const isImage = imageTypes.includes(file.type);
    const isDocument = documentTypes.includes(file.type) || file.name?.endsWith('.pdf') || file.name?.endsWith('.epub');
    
    // Pour les produits, on accepte images ET documents
    if (type === "product") {
      if (!isImage && !isDocument) {
        return NextResponse.json(
          { success: false, error: "Type de fichier non supporté (PDF, EPUB, JPG, PNG)" },
          { status: 400 }
        );
      }
      // Limite 50MB pour les produits
      if (file.size > 50 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: "Fichier trop volumineux (max 50MB)" },
          { status: 400 }
        );
      }
    } else {
      // Pour les autres types (avatar, cover, logo), seulement images
      if (!isImage) {
        return NextResponse.json(
          { success: false, error: "Type de fichier non supporté (JPG, PNG, WebP, GIF)" },
          { status: 400 }
        );
      }
      // Limite 5MB pour les images
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: "Fichier trop volumineux (max 5MB)" },
          { status: 400 }
        );
      }
    }

    // Convertir en buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Config selon le type
    let folder = "bookzy/images";
    let resourceType = "image";
    let transformation = [
      { width: 1200, height: 1200, crop: "limit" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ];

    if (type === "avatar" || type === "logo") {
      folder = "bookzy/avatars";
      transformation = [
        { width: 400, height: 400, crop: "fill", gravity: "face" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ];
    } else if (type === "cover") {
      folder = "bookzy/covers";
      transformation = [
        { width: 800, height: 1200, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ];
    } else if (type === "product") {
      folder = "bookzy/products";
      // Pour les documents (PDF, EPUB), pas de transformation
      if (isDocument) {
        resourceType = "raw";
        transformation = undefined;
      }
    }

    // Upload vers Cloudinary
    const uploadOptions = {
      folder,
      public_id: `${type}_${userId}_${Date.now()}`,
      resource_type: resourceType,
    };
    
    // Ajouter transformation seulement pour les images
    if (transformation && resourceType === "image") {
      uploadOptions.transformation = transformation;
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(uploadOptions, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(buffer);
    });

    console.log(`✅ [Upload] ${type} uploadé:`, result.secure_url);

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });

  } catch (error) {
    console.error("❌ [Upload] Erreur:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de l'upload" },
      { status: 500 }
    );
  }
}