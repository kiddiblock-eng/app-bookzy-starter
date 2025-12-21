export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Notification from "@/models/Notification";
import User from "@/models/User";
import { verifyAdmin } from "@/lib/auth";

export async function GET(req) {
  try {
    await dbConnect();

    const admin = await verifyAdmin(req);
    if (!admin?.authorized) {
      return NextResponse.json(
        { success: false, message: "Non autorisé" },
        { status: 403 }
      );
    }

    // Group by title/message/type to rebuild campaigns
    const stats = await Notification.aggregate([
      {
        $group: {
          _id: {
            title: "$title",
            message: "$message",
            type: "$type",
            createdAt: "$createdAt",
          },
          totalRecipients: { $sum: 1 },
          totalReads: {
            $sum: { $cond: [{ $eq: ["$read", true] }, 1, 0] }
          }
        }
      },
      { $sort: { "_id.createdAt": -1 } }
    ]);

    return NextResponse.json({
      success: true,
      stats: stats.map((item) => ({
        title: item._id.title,
        message: item._id.message,
        type: item._id.type,
        createdAt: item._id.createdAt,
        totalRecipients: item.totalRecipients,
        totalReads: item.totalReads
      })),
    });

  } catch (error) {
    console.error("❌ Stats error:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}