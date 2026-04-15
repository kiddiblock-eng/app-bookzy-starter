export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import NicheAnalysis from "@/models/NicheAnalysis";
import { verifyAuth } from "@/lib/auth";

export async function GET(req) {
  try {
    await dbConnect();

    const user = await verifyAuth(req);
    if (!user) return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 10;
    const skip = (page - 1) * limit;

    const [analyses, total] = await Promise.all([
      NicheAnalysis.find({ userId: user.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("theme targetMarket niches generatedAt createdAt totalNiches generationTime")
        .lean(),
      NicheAnalysis.countDocuments({ userId: user.id }),
    ]);

    // Résumé par analyse
    const data = analyses.map(a => ({
      id: a._id,
      theme: a.theme,
      targetMarket: a.targetMarket || "africa",
      totalNiches: a.niches?.length || 0,
      analyzedCount: a.niches?.filter(n => n.analyzed).length || 0,
      generationTime: a.generationTime,
      createdAt: a.createdAt,
      // Top 3 niches pour aperçu
      topNiches: (a.niches || [])
        .sort((x, y) => (y.potential || 0) - (x.potential || 0))
        .slice(0, 3)
        .map(n => ({
          nicheId: n.nicheId,
          title: n.title,
          potential: n.potential,
          badge: n.badge || "fire",
          analyzed: n.analyzed,
        })),
    }));

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (e) {
    console.error("❌ Erreur historique niches:", e);
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}