export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Activity from "@/models/Activity";
import { withCache } from "@/lib/miniCache";
export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get("days") || "7");

    const activityData = await withCache(`admin:activity:${days}`, 30000, async () => {
      // Les N jours sont comptés EN PARALLÈLE
      const dayTasks = [];
      for (let i = days - 1; i >= 0; i--) {
        const start = new Date();
        start.setDate(start.getDate() - i);
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setDate(end.getDate() + 1);

        dayTasks.push(
          Activity.countDocuments({ createdAt: { $gte: start, $lt: end } })
            .then((count) => ({ date: start.toLocaleDateString("fr-FR"), count }))
        );
      }
      return Promise.all(dayTasks);
    });

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