import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export async function GET(req) {
  try {
    await dbConnect();

    const adminCheck = await verifyAdmin(req);
    if (!adminCheck.authorized) {
      return NextResponse.json(
        { success: false, message: adminCheck.message },
        { status: 401 }
      );
    }

    const now = new Date();

    // 🔥 utilisateurs actifs (moins de 5 minutes)
    const activeUsers = await User.countDocuments({
      lastActiveAt: {
        $gte: new Date(now.getTime() - 5 * 60 * 1000)
      }
    });

    // 🔥 actifs aujourd’hui
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const activeToday = await User.countDocuments({
      lastActiveAt: { $gte: todayStart }
    });

    // 🔥 actifs cette semaine
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);

    const activeWeek = await User.countDocuments({
      lastActiveAt: { $gte: weekStart }
    });

    // 🔥 actifs ce mois
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const activeMonth = await User.countDocuments({
      lastActiveAt: { $gte: monthStart }
    });

    return NextResponse.json({
      success: true,
      data: {
        activeNow: activeUsers,
        today: activeToday,
        week: activeWeek,
        month: activeMonth
      }
    });

  } catch (error) {
    console.error("❌ Erreur active-users:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}