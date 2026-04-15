export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import NicheAnalysis from "@/models/NicheAnalysis";
import { verifyAuth } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const user = await verifyAuth(req);
    if (!user) return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });

    const analysis = await NicheAnalysis.findOne({
      _id: params.id,
      userId: user.id,
    }).lean();

    if (!analysis) return NextResponse.json({ success: false, message: "Analyse introuvable." }, { status: 404 });

    return NextResponse.json({ success: true, data: analysis });

  } catch (e) {
    console.error("❌ Erreur récupération analyse:", e);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}