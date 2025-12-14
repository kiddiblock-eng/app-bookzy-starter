import { NextResponse } from "next/server";
import User from "@/models/User";
import { dbConnect } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";

export async function GET(req) {
  await dbConnect();

  const { authorized } = await verifyAdmin(req);
  if (!authorized) {
    return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 403 });
  }

  const users = await User.find().sort({ createdAt: -1 }).lean();

  return NextResponse.json({ 
    success: true, 
    users // ✅ CORRIGÉ : retourne "users" comme avant
  });
}