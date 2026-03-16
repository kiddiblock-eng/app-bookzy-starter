// app/api/suggestions/[id]/vote/route.js
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Suggestion from "@/models/Suggestion";
import { verifyAuth } from "@/lib/auth";

export async function POST(req, { params }) {
  try {
    await dbConnect();

    const payload = await verifyAuth(req);
    if (!payload?.id) {
      return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });
    }

    // Sans filtre status — on vote sur n'importe quelle suggestion visible
    const suggestion = await Suggestion.findById(params.id);
    if (!suggestion) {
      return NextResponse.json({ success: false, message: "Suggestion introuvable" }, { status: 404 });
    }

    const userId = payload.id.toString();
    const alreadyVoted = suggestion.votes.some((v) => v.toString() === userId);

    if (alreadyVoted) {
      suggestion.votes = suggestion.votes.filter((v) => v.toString() !== userId);
    } else {
      suggestion.votes.push(payload.id);
    }

    await suggestion.save();

    return NextResponse.json({
      success: true,
      voted: !alreadyVoted,
      votesCount: suggestion.votes.length,
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}