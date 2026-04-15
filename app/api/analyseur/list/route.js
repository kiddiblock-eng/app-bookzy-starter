export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import ProductAnalysis from "@/models/ProductAnalysis";
import { verifyAuth } from "@/lib/auth";

export async function GET(req) {
  try {
    await dbConnect();
    const user = await verifyAuth(req);
    if (!user) return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });

    const analyses = await ProductAnalysis.find({ userId: user.id })
      .select("sujet scoreGlobal verdict verdictTexte revenus saturation createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: analyses });
  } catch (e) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}