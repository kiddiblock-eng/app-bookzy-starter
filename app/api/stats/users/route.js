import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

// Réponse mise en cache 5 min (léger pour la DB, se met à jour tout seul).
export const revalidate = 300;

// Socle marketing : mets un nombre ici pour partir plus haut (ex: 14000 → ~25 600 aujourd'hui).
// 0 = on affiche le VRAI nombre d'inscrits, qui monte à chaque inscription.
const BASE = 0;

export async function GET() {
  try {
    await dbConnect();
    const real = await User.countDocuments({});
    return NextResponse.json(
      { count: BASE + real },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
    );
  } catch {
    return NextResponse.json({ count: null }, { status: 200 });
  }
}
