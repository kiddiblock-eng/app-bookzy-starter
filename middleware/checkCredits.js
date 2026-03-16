import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User, { CREDIT_COSTS } from "@/models/User";
import jwt from "jsonwebtoken";

/**
 * Middleware checkCredits
 * Vérifie que l'utilisateur est authentifié et a assez de crédits pour une action.
 *
 * Usage dans une API :
 *   const { user, error } = await checkCredits(req, "ebook");
 *   if (error) return error;
 *   await user.spendCredits("ebook");
 *
 * Actions disponibles (définies dans CREDIT_COSTS du User model) :
 *   - "ebook"        → 20 crédits
 *   - "mise_en_page" → 10 crédits
 *   - "smart_shop"   → 5 crédits
 */
export async function checkCredits(req, action) {
  try {
    await dbConnect();

    // 1. Récupérer le token depuis les cookies
    const cookie = req.headers.get("cookie") || "";
    const token = cookie
      .split(";")
      .map(c => c.trim())
      .find(c => c.startsWith("bookzy_token="))
      ?.split("=")[1];

    if (!token) {
      return {
        user: null,
        error: NextResponse.json(
          { success: false, message: "Non authentifié" },
          { status: 401 }
        ),
      };
    }

    // 2. Vérifier le token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return {
        user: null,
        error: NextResponse.json(
          { success: false, message: "Session expirée" },
          { status: 401 }
        ),
      };
    }

    const userId = decoded.id || decoded.userId || decoded._id;

    if (!userId) {
      return {
        user: null,
        error: NextResponse.json(
          { success: false, message: "Session invalide" },
          { status: 401 }
        ),
      };
    }

    // 3. Charger le user
    const user = await User.findById(userId);

    if (!user) {
      return {
        user: null,
        error: NextResponse.json(
          { success: false, message: "Utilisateur introuvable" },
          { status: 404 }
        ),
      };
    }

    // 4. Vérifier les crédits
    if (!user.hasCredits(action)) {
      const cost = CREDIT_COSTS[action] || 0;

      return {
        user: null,
        error: NextResponse.json(
          {
            success: false,
            insufficientCredits: true,
            message: `Crédits insuffisants. Cette action coûte ${cost} crédits. Votre solde : ${user.credits.balance} crédits.`,
            balance: user.credits.balance,
            required: cost,
            redirectTo: "/dashboard/tarifs",
          },
          { status: 402 }
        ),
      };
    }

    // 5. Tout bon → retourner le user
    return { user, error: null };

  } catch (err) {
    console.error("❌ [checkCredits] Erreur:", err.message);
    return {
      user: null,
      error: NextResponse.json(
        { success: false, message: "Erreur serveur" },
        { status: 500 }
      ),
    };
  }
}