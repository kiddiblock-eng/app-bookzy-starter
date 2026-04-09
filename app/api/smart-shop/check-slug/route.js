// app/api/smart-shop/check-slug/route.js
// Vérifier si un slug de boutique est disponible
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Shop from "@/models/Shop";
import jwt from "jsonwebtoken";

function getUserIdFromCookie(req) {
  const cookie = req.headers.get("cookie") || "";
  const token = cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("bookzy_token="))
    ?.split("=")[1];

  try {
    return jwt.verify(token, process.env.JWT_SECRET)?.id || null;
  } catch {
    return null;
  }
}

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Slug requis" },
        { status: 400 }
      );
    }

    // Validation du format
    const slugRegex = /^[a-z0-9_-]{3,30}$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json({
        success: true,
        available: false,
        reason: "Format invalide (3-30 caractères, lettres minuscules, chiffres, - et _)"
      });
    }

    // Vérifier si le slug est réservé
    const reservedSlugs = [
      "admin", "api", "dashboard", "shop", "login", "register", 
      "settings", "profile", "help", "support", "about", "contact",
      "terms", "privacy", "bookzy", "checkout", "payment", "webhook"
    ];

    if (reservedSlugs.includes(slug)) {
      return NextResponse.json({
        success: true,
        available: false,
        reason: "Ce nom est réservé"
      });
    }

    // Vérifier si le slug existe déjà
    const userId = getUserIdFromCookie(req);
    const existingShop = await Shop.findOne({ slug });

    if (existingShop) {
      // Si c'est la boutique de l'utilisateur actuel, c'est OK
      if (userId && existingShop.userId.toString() === userId) {
        return NextResponse.json({
          success: true,
          available: true,
          reason: "C'est ton slug actuel"
        });
      }

      return NextResponse.json({
        success: true,
        available: false,
        reason: "Ce lien est déjà pris"
      });
    }

    return NextResponse.json({
      success: true,
      available: true
    });

  } catch (error) {
    console.error("❌ [Smart Shop] Erreur check-slug:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}