import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { dbConnect } from "@/lib/db.js";
import User from "@/models/User.js";

// ✅ 1. Forcer le mode dynamique (Pas de cache serveur)
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();

    // Récupération des cookies
    const userToken = cookies().get("bookzy_token")?.value;
    const adminToken = cookies().get("admin_token")?.value;
    const token = userToken || adminToken;

    if (!token) {
      return new Response(JSON.stringify({ message: "Token non trouvé." }), {
        status: 401,
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return new Response(JSON.stringify({ message: "Token invalide." }), {
        status: 403,
      });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return new Response(
        JSON.stringify({ message: "Utilisateur introuvable." }),
        { status: 404 }
      );
    }

    // Auto-migration
    let needsSave = false;
    if (user.emailVerified === undefined) { user.emailVerified = false; needsSave = true; }
    if (user.emailVerifiedAt === undefined) { user.emailVerifiedAt = null; needsSave = true; }
    if (user.emailVerificationSentAt === undefined) { user.emailVerificationSentAt = null; needsSave = true; }
    if (needsSave) { await user.save(); }

    // ✅ 2. Structure de réponse unifiée
    return new Response(
      JSON.stringify({
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            avatar: user.avatar || user.photo || "", 
            photo: user.avatar || user.photo || "", 
            emailVerified: user.emailVerified,
            role: user.role,
            
            // 🔥 C'EST ICI LA CORRECTION 🔥
            // On lit 'user.name' (base de données) et on l'envoie comme 'displayName'
            displayName: user.name || user.displayName || "", 
            
            country: user.country || "",
            lang: user.lang || "fr"
        }
      }),
      { 
        status: 200,
        // ✅ 3. Headers anti-cache explicites
        headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            "Pragma": "no-cache",
            "Expires": "0",
        }
      }
    );
  } catch (error) {
    console.error("❌ Erreur /api/profile/get :", error);
    return new Response(
      JSON.stringify({ message: "Erreur serveur interne." }),
      { status: 500 }
    );
  }
}