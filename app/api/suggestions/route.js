// app/api/suggestions/route.js
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Suggestion from "@/models/Suggestion";
import User from "@/models/User";
import { verifyAuth } from "@/lib/auth";

// GET — liste publique des suggestions approuvées
export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const sort = searchParams.get("sort") || "votes";

    const sortQuery = sort === "recent"
      ? { createdAt: -1 }
      : { votesCount: -1, createdAt: -1 };

    const suggestions = await Suggestion.aggregate([
      { $match: { status: "approved" } },
      { $addFields: { votesCount: { $size: "$votes" } } },
      { $sort: sortQuery },
      {
        $project: {
          title: 1, description: 1, status: 1,
          votesCount: 1, votes: 1, isPublic: 1, createdAt: 1,
          "userSnapshot.name": 1, "userSnapshot.photo": 1,
        },
      },
    ]);

    return NextResponse.json({ success: true, suggestions });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// POST — soumettre une suggestion
export async function POST(req) {
  try {
    await dbConnect();

    // verifyAuth retourne le payload JWT directement (pas { authorized })
    const payload = await verifyAuth(req);
    if (!payload?.id) {
      return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });
    }

    const { title, description, isPublic } = await req.json();

    if (!title?.trim() || !description?.trim()) {
      return NextResponse.json({ success: false, message: "Titre et description requis" }, { status: 400 });
    }

    const user = await User.findById(payload.id).select("name firstName lastName displayName photo avatar");
    if (!user) {
      return NextResponse.json({ success: false, message: "Utilisateur introuvable" }, { status: 404 });
    }

    const displayName = user.displayName
      || user.name
      || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
      || "Anonyme";

    const suggestion = await Suggestion.create({
      title: title.trim(),
      description: description.trim(),
      userId: user._id,
      userSnapshot: {
        name: displayName,
        photo: user.photo || user.avatar || null,
      },
      isPublic: !!isPublic,
      status: "pending",
    });

    return NextResponse.json({ success: true, suggestion }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}