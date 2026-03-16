export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

// KkiaPay désactivé — Moneroo uniquement
export async function POST(req) {
  return NextResponse.json({ success: true });
}