export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import MarketingAsset from "@/models/MarketingAsset";

export async function GET(req) {
  try {
    await dbConnect();

    // On récupère tout ce qui est actif, trié par date (les plus récents en premier)
    const assets = await MarketingAsset.find({ active: true }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: assets });
  } catch (error) {
    console.error("❌ Erreur Resources:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}