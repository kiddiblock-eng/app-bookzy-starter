export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";
import User from "@/models/User";

// Réinitialise la roue promo d'un compte (pour tests / SAV) : il pourra re-tourner.
export async function POST(req) {
  const admin = await verifyAdmin(req);
  if (!admin?.authorized) return NextResponse.json({ success: false }, { status: 403 });

  await dbConnect();
  const { email } = await req.json().catch(() => ({}));
  if (!email) return NextResponse.json({ success: false, message: "Email requis" }, { status: 400 });

  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) return NextResponse.json({ success: false, message: "Compte introuvable" }, { status: 404 });

  user.promo = { spun: false, percent: null, code: null, wonAt: null, expiresAt: null, used: false, usedAt: null };
  user.markModified("promo");
  await user.save();

  return NextResponse.json({ success: true, message: `Roue réinitialisée pour ${user.email}` });
}
