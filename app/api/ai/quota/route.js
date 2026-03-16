// app/api/ai/quota/route.js
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import Projet from "@/models/Projet";
import jwt from "jsonwebtoken";

function getUserIdFromCookie(req) {
  const cookie = req.headers.get("cookie") || "";
  const token = cookie.split(";")
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

    const userId = getUserIdFromCookie(req);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Non authentifié" }, { status: 401 });
    }

    const url = new URL(req.url);
    const projetId = url.searchParams.get("projetId");

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "Utilisateur introuvable" }, { status: 404 });
    }

    // Reset quota si besoin
    const today = new Date().setHours(0, 0, 0, 0);
    const lastReset = new Date(user.aiUsage.lastResetDate).setHours(0, 0, 0, 0);
    if (today > lastReset) {
      user.aiUsage.usedToday = 0;
      user.aiUsage.lastResetDate = new Date();
      await user.save();
    }

    const quotaData = {
      dailyUsed: user.aiUsage.usedToday,
      dailyLimit: user.aiUsage.dailyLimit,
      dailyRemaining: user.aiUsage.dailyLimit - user.aiUsage.usedToday,
      creditsBalance: user.credits?.balance ?? 0,
      extraCreditCost: 0.5 // coût par amélioration hors quota
    };

    // Si projetId fourni, ajouter infos du projet
    if (projetId) {
      const projet = await Projet.findById(projetId);
      if (projet) {
        quotaData.project = {
          aiUsed: projet.aiImprovementsUsed || 0,
        };
      }
    }

    return NextResponse.json({ success: true, ...quotaData });

  } catch (error) {
    console.error("❌ [AI Quota] Erreur:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}