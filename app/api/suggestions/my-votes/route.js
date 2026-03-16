// app/api/suggestions/my-votes/route.js
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Suggestion from "@/models/Suggestion";
import { verifyAuth } from "@/lib/auth";

export async function GET(req) {
  try {
    await dbConnect();

    const payload = await verifyAuth(req);
    if (!payload?.id) {
      // Non connecté — retourne tableau vide, pas d'erreur
      return NextResponse.json({ success: true, votedIds: [], isLoggedIn: false });
    }

    // Chercher toutes les suggestions où l'user a voté
    const voted = await Suggestion.find(
      { votes: payload.id },
      { _id: 1 }
    ).lean();

    const votedIds = voted.map((s) => s._id.toString());

    return NextResponse.json({ success: true, votedIds, isLoggedIn: true });
  } catch (err) {
    return NextResponse.json({ success: true, votedIds: [], isLoggedIn: false });
  }
}