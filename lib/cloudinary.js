// lib/cloudinary.js
import { v2 as cloudinary } from "cloudinary";

// ✅ Configuration lazy - sera appelée au premier upload
let configured = false;

function ensureConfigured() {
  if (configured) return;
  
  if (!process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET) {
    console.warn("⚠️ Cloudinary non configuré dans .env.local");
    throw new Error("Cloudinary credentials manquantes");
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  
  configured = true;
  console.log("✅ Cloudinary configuré:", process.env.CLOUDINARY_CLOUD_NAME);
}

// Helper pour créer un slug propre
function slugify(str = "") {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase()
    .slice(0, 80);
}

// Upload d'un buffer (PDF, ZIP, etc.)
export async function uploadBufferToCloudinary(buffer, {
  folder = "bookzy",
  publicId,
  resourceType = "raw", // pdf, zip…
  extension = "",
} = {}) {
  ensureConfigured(); // ✅ Configurer juste avant l'upload
  
  if (!buffer) throw new Error("Buffer manquant pour upload Cloudinary");

  const public_id = publicId ? slugify(publicId) : undefined;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id,
        resource_type: resourceType,
        format: extension || undefined,
        access_mode: "public",  // ✅ AJOUTER : Débloquer pour livraison publique
        type: "upload",  // ✅ AJOUTER : Type d'upload standard
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
}

// Upload d'une URL (images IA type OpenAI / DALL·E)
export async function uploadUrlToCloudinary(url, {
  folder = "bookzy",
  publicId,
  resourceType = "image",
} = {}) {
  ensureConfigured(); // ✅ Configurer juste avant l'upload
  
  if (!url) return null;

  const public_id = publicId ? slugify(publicId) : undefined;

  const res = await cloudinary.uploader.upload(url, {
    folder,
    public_id,
    resource_type: resourceType,
    access_mode: "public",  // ✅ AJOUTER : Débloquer les images aussi
    type: "upload",  // ✅ AJOUTER
  });

  return res;
}

export default cloudinary;