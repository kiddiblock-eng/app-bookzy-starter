export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import ProductAnalysis from "@/models/ProductAnalysis";
import { verifyAuth } from "@/lib/auth";

export async function GET(req) {
  try {
    await dbConnect();
    const user = await verifyAuth(req);
    if (!user) return NextResponse.json({ count: 0 });

    const count = await ProductAnalysis.countDocuments({ userId: user.id });
    return NextResponse.json({ success: true, count });
  } catch (e) {
    console.error("❌ [analyseur/count]", e.message);
    return NextResponse.json({ count: 0 });
  }
}