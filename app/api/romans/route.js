export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Roman from "@/models/Roman";
import { verifyAuth } from "@/lib/auth";

export async function GET(req) {
  try {
    await dbConnect();
    const user = await verifyAuth(req);
    if (!user) return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });

    const romans = await Roman.find({ userId: user.id })
      .select("title genre template longueur status creditsRequired totalWords totalPages chapterPlans chapters createdAt synopsis")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: romans });
  } catch (e) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}