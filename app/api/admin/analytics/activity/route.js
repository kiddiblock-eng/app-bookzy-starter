import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import UserActivity from "@/models/UserActivity";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get("days") || "7");

    const activityData = [];

    for (let i = days - 1; i >= 0; i--) {
      const start = new Date();
      start.setDate(start.getDate() - i);
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      const count = await UserActivity.countDocuments({
        createdAt: { $gte: start, $lt: end }
      });

      activityData.push({
        date: start.toLocaleDateString("fr-FR"),
        count
      });
    }

    return NextResponse.json({
      success: true,
      data: activityData
    });

  } catch (error) {
    console.error("Erreur activity:", error);
    return NextResponse.json(
      { success: false, data: [] },
      { status: 500 }
    );
  }
}