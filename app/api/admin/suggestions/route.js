// app/api/admin/suggestions/route.js
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Suggestion from "@/models/Suggestion";
import User from "@/models/User";
import { verifyAdmin } from "@/lib/auth";

export async function GET(req) {
  try {
    await dbConnect();

    const admin = await verifyAdmin(req);
    if (!admin?.authorized) {
      return NextResponse.json({ success: false, message: "Accès refusé" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "pending";
    const sort  = searchParams.get("sort")   || "votes"; // "votes" | "recent"
    const filter = status === "all" ? {} : { status };

    const sortStage = sort === "votes"
      ? { $sort: { votesCount: -1, createdAt: -1 } }
      : { $sort: { createdAt: -1 } };

    const suggestions = await Suggestion.aggregate([
      { $match: filter },
      { $addFields: { votesCount: { $size: "$votes" } } },
      sortStage,
      // Populate les votants (nom + photo)
      {
        $lookup: {
          from: "users",
          localField: "votes",
          foreignField: "_id",
          as: "voters",
          pipeline: [
            { $project: { _id: 1, name: 1, firstName: 1, lastName: 1, photo: 1, avatar: 1, displayName: 1 } }
          ]
        }
      },
    ]);

    return NextResponse.json({ success: true, suggestions });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}