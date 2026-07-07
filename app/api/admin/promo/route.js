export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";
import PromoConfig from "@/models/PromoConfig";

// Lecture de la config promo (admin).
export async function GET(req) {
  const admin = await verifyAdmin(req);
  if (!admin?.authorized) return NextResponse.json({ success: false }, { status: 403 });

  await dbConnect();
  const config = await PromoConfig.getSingleton();
  return NextResponse.json({
    success: true,
    config: {
      enabled: config.enabled,
      startsAt: config.startsAt,
      endsAt: config.endsAt,
      live: config.isLive(),
    },
  });
}

// Mise à jour : { enabled, startsAt, endsAt } (dates ISO ou null).
export async function POST(req) {
  const admin = await verifyAdmin(req);
  if (!admin?.authorized) return NextResponse.json({ success: false }, { status: 403 });

  await dbConnect();
  const body = await req.json().catch(() => ({}));
  const config = await PromoConfig.getSingleton();

  if (typeof body.enabled === "boolean") config.enabled = body.enabled;
  if ("startsAt" in body) config.startsAt = body.startsAt ? new Date(body.startsAt) : null;
  if ("endsAt" in body) config.endsAt = body.endsAt ? new Date(body.endsAt) : null;
  await config.save();

  return NextResponse.json({
    success: true,
    config: {
      enabled: config.enabled,
      startsAt: config.startsAt,
      endsAt: config.endsAt,
      live: config.isLive(),
    },
  });
}
