export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";
import Notification from "@/models/Notification";

export async function POST(req) {
  await dbConnect();
  const { authorized } = await verifyAdmin(req);

  if (!authorized) return NextResponse.json({ success: false }, { status: 403 });

  const { title, message } = await req.json();

  if (!title || !message) {
    return NextResponse.json({ success: false, message: "Champs manquants" }, { status: 400 });
  }

  await Notification.create({
    title,
    message,
    createdAt: new Date()
  });

  return NextResponse.json({ success: true, message: "Notification envoyée" });
}