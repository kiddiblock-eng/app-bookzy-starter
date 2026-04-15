export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Roman from "@/models/Roman";
import { verifyAuth } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const user = await verifyAuth(req);
    if (!user) return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });

    const roman = await Roman.findOne({ _id: params.id, userId: user.id });
    if (!roman) return NextResponse.json({ success: false, message: "Roman introuvable." }, { status: 404 });

    return NextResponse.json({ success: true, data: roman });
  } catch (e) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}