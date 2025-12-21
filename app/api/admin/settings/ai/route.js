export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Settings from "@/models/settings";
import { verifyAdmin } from "@/lib/auth";

// FIX: Force le rendu dynamique pour éviter la mise en cache de l'API

function deepMerge(target, source) {
  const output = { ...target };

  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      output[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      output[key] = source[key];
    }
  }

  return output;
}

export async function GET(req) {
  try {
    await dbConnect();
    const { authorized } = await verifyAdmin(req);
    if (!authorized) {
      return NextResponse.json(
        { success: false, message: "Non autorisé" },
        { status: 403 }
      );
    }

    const settings = await Settings.findOne({ key: "global" }).lean();
    
    const response = NextResponse.json({ success: true, ai: settings?.ai || {} });
    
    // FIX ULTIME : Définir les en-têtes pour désactiver absolument tout cache client/proxy
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;

  } catch (error) {
    console.error("❌ GET error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const { authorized } = await verifyAdmin(req);
    if (!authorized) {
      return NextResponse.json(
        { success: false, message: "Non autorisé" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const newAI = body.ai;

    // Récupérer les anciens settings pour préserver les sous-champs existants de l'IA
    const existing = await Settings.findOne({ key: "global" }).lean();

    // Si les settings n’existent pas encore
    const currentAI = existing?.ai || {};

    // Merge profond pour ne pas perdre des configs IA partielles
    const mergedAI = deepMerge(currentAI, newAI);

    // LOG DÉBUG
    console.log("🔥 AI ADMIN POST LOG: Mise à jour sécurisée de la config IA...");

    // ✅ FIX CORRIGÉ : On utilise findOneAndUpdate avec $set
    // On NE SUPPRIME PLUS le document entier. On met juste à jour le champ "ai".
    // Les champs "payment", "general", etc. ne sont pas touchés.
    
    const updated = await Settings.findOneAndUpdate(
      { key: "global" },
      { $set: { ai: mergedAI } },
      { new: true, upsert: true } // Crée le document global s'il n'existe pas
    ).lean();

    return NextResponse.json({ success: true, ai: updated.ai });
  } catch (error) {
    console.error("❌ POST error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}