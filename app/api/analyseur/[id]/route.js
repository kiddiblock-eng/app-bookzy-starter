export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import ProductAnalysis from "@/models/ProductAnalysis";
import User from "@/models/User";
import { verifyAuth } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const user = await verifyAuth(req);
    if (!user) return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });

    const [analysis, userDoc] = await Promise.all([
      ProductAnalysis.findOne({ _id: params.id, userId: user.id }),
      User.findById(user.id).select("plan"),
    ]);

    if (!analysis) return NextResponse.json({ success: false, message: "Analyse introuvable." }, { status: 404 });

    const isPremium = ["solo", "createur", "agence"].includes(userDoc?.plan);

    return NextResponse.json({ success: true, isPremium, data: analysis });
  } catch (e) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}