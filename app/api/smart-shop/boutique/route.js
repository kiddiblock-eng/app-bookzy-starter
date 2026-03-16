// app/api/smart-shop/boutique/route.js
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Shop from "@/models/Shop";
import jwt from "jsonwebtoken";
import { checkCredits } from "@/middleware/checkCredits";

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

// GET - Récupérer la boutique
export async function GET(req) {
  try {
    await dbConnect();
    const userId = getUserIdFromCookie(req);
    if (!userId) return NextResponse.json({ success: false, error: "Non authentifié" }, { status: 401 });

    const shop = await Shop.findOne({ userId }).lean();
    return NextResponse.json({ success: true, shop: shop || null });
  } catch (error) {
    console.error("❌ [Smart Shop] Erreur GET:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) { return handleCreateOrUpdate(req); }
export async function PUT(req)  { return handleCreateOrUpdate(req); }

async function handleCreateOrUpdate(req) {
  try {
    await dbConnect();

    const userId = getUserIdFromCookie(req);
    if (!userId) return NextResponse.json({ success: false, error: "Non authentifié" }, { status: 401 });

    const data = await req.json();
    const { name, slug, bio, logo, banner, theme, socials, paymentInfo, currency, action } = data;

    // ─── ACTION PUBLIER ───────────────────────────────────────────────────────
    // Appelé séparément quand l'utilisateur clique "Publier"
    if (action === "publish") {
      const shop = await Shop.findOne({ userId });
      if (!shop) return NextResponse.json({ success: false, error: "Boutique introuvable" }, { status: 404 });

      // Déjà publié → gratuit, on ne redébite pas
      if (shop.isPublished) {
        return NextResponse.json({ success: true, shop, alreadyPublished: true });
      }

      // Première publication → 5 crédits
      const { user: userWithCredits, error: creditError } = await checkCredits(req, "smart_shop");
      if (creditError) {
        return NextResponse.json(
          { success: false, insufficientCredits: true, message: "5 crédits requis pour publier ta boutique" },
          { status: 402 }
        );
      }
      await userWithCredits.spendCredits("smart_shop");
      shop.isPublished = true;
      await shop.save();
      console.log(`🚀 [Smart Shop] Boutique publiée — user: ${userId}`);
      return NextResponse.json({ success: true, shop, newBalance: userWithCredits.credits.balance, message: "Boutique publiée !" });
    }

    // ─── CRÉATION / MISE À JOUR (toujours gratuit) ───────────────────────────
    if (!name || name.trim().length < 2)
      return NextResponse.json({ success: false, error: "Nom requis (min 2 caractères)" }, { status: 400 });

    if (!slug || slug.trim().length < 3)
      return NextResponse.json({ success: false, error: "Lien requis (min 3 caractères)" }, { status: 400 });

    const cleanSlug = slug.toLowerCase().trim();
    if (!/^[a-z0-9_-]+$/.test(cleanSlug))
      return NextResponse.json({ success: false, error: "Lien invalide (lettres minuscules, chiffres, tirets)" }, { status: 400 });

    const slugTaken = await Shop.findOne({ slug: cleanSlug, userId: { $ne: userId } });
    if (slugTaken)
      return NextResponse.json({ success: false, error: "Ce lien est déjà pris" }, { status: 400 });

    const existingShop = await Shop.findOne({ userId });
    const isNew = !existingShop;

    // ─── CRÉATION ────────────────────────────────────────────────────────────
    if (isNew) {
      const shop = await Shop.create({
        userId,
        name:        name.trim(),
        slug:        cleanSlug,
        bio:         bio?.trim() || "",
        logo:        logo        || "",
        banner:      banner      || "",
        theme:       theme       || {},
        socials:     socials     || {},
        paymentInfo: paymentInfo || {},
        currency:    currency    || "XOF",
        isPublished: false,
      });
      console.log(`✅ [Smart Shop] Boutique créée: ${shop.slug}`);
      return NextResponse.json({ success: true, shop, message: "Boutique créée" });
    }

    // ─── MISE À JOUR ─────────────────────────────────────────────────────────
    existingShop.name = name.trim();
    existingShop.slug = cleanSlug;
    existingShop.bio  = bio?.trim() || "";

    if (logo        !== undefined) existingShop.logo        = logo;
    if (banner      !== undefined) existingShop.banner      = banner;
    if (theme)                     existingShop.theme       = { ...existingShop.theme, ...theme };
    if (socials)                   existingShop.socials     = { ...existingShop.socials, ...socials };
    if (paymentInfo)               existingShop.paymentInfo = { ...existingShop.paymentInfo, ...paymentInfo };
    if (currency)                  existingShop.currency    = currency;

    await existingShop.save();
    console.log(`✅ [Smart Shop] Boutique mise à jour: ${existingShop.slug}`);
    return NextResponse.json({ success: true, shop: existingShop, message: "Boutique mise à jour" });

  } catch (error) {
    console.error("❌ [Smart Shop] Erreur:", error);
    if (error.code === 11000)
      return NextResponse.json({ success: false, error: "Ce lien est déjà pris" }, { status: 400 });
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}