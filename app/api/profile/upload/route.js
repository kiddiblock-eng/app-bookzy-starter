import { v2 as cloudinary } from "cloudinary";
import { dbConnect } from "../../../../lib/db.js";
import User from "../../../../models/User.js";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// ✅ Configuration Cloudinary (sans NEXT_PUBLIC)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔍 Debug configuration
console.log('🔧 Cloudinary config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '❌ MANQUANT',
  api_key: process.env.CLOUDINARY_API_KEY ? '✅ Présente' : '❌ Manquante',
  api_secret: process.env.CLOUDINARY_API_SECRET ? '✅ Présente' : '❌ Manquante',
});

export async function POST(req) {
  try {
    await dbConnect();

    // Lire et décoder le token
    const token = cookies().get("bookzy_token")?.value;
    if (!token) {
      return new Response(JSON.stringify({ error: "Non connecté" }), { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const data = await req.formData();
    const file = data.get("file");

    if (!file) {
      return new Response(JSON.stringify({ error: "Aucun fichier envoyé" }), { status: 400 });
    }

    console.log('📤 Upload avatar pour userId:', userId);

    // ✅ Convertir le fichier en Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ✅ Upload vers Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "bookzy/avatars",
          public_id: `avatar_${userId}_${Date.now()}`,
          transformation: [
            { width: 400, height: 400, crop: "fill", gravity: "face" },
            { quality: "auto" },
            { fetch_format: "auto" }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    const imageUrl = uploadResult.secure_url;
    console.log('✅ Image uploadée:', imageUrl);

    // ✅ Mise à jour du profil avec 'avatar' au lieu de 'photo'
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: imageUrl }, // ← Utilise 'avatar' (champ qui existe dans ton modèle)
      { new: true, runValidators: false }
    ).select("-password");

    if (!user) {
      return new Response(JSON.stringify({ error: "Utilisateur introuvable" }), { status: 404 });
    }

    console.log('✅ Avatar mis à jour en base:', user.avatar);

    return new Response(JSON.stringify({ success: true, imageUrl }), { status: 200 });
  } catch (error) {
    console.error("❌ Erreur upload :", error);
    return new Response(JSON.stringify({ error: "Erreur serveur: " + error.message }), { status: 500 });
  }
}