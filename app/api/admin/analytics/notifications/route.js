export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { withCache } from "@/lib/miniCache";

export async function GET(req) {
  try {
    await dbConnect();

    const notifications = await withCache("admin:notifications", 30000, async () => {
      const list = [];

      // Les 3 comptages en parallèle
      const [newUsersToday, activeUsers, totalUsers] = await Promise.all([
        User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
        User.countDocuments({ lastLogin: { $gte: new Date(Date.now() - 60 * 60 * 1000) } }),
        User.countDocuments(),
      ]);

      if (newUsersToday > 0) {
        list.push({
          id: `new-users-${Date.now()}`,
          message: `${newUsersToday} nouveau${newUsersToday > 1 ? 'x' : ''} utilisateur${newUsersToday > 1 ? 's' : ''} inscrit${newUsersToday > 1 ? 's' : ''}`,
          time: "Aujourd'hui",
          type: "success",
          read: false,
        });
      }

      if (activeUsers > 5) {
        list.push({
          id: `active-users-${Date.now()}`,
          message: `Pic d'activité : ${activeUsers} utilisateurs en ligne`,
          time: "Il y a 1h",
          type: "info",
          read: false,
        });
      }

      if (totalUsers >= 1000 && totalUsers % 100 === 0) {
        list.push({
          id: `milestone-${Date.now()}`,
          message: `🎉 Jalon atteint : ${totalUsers} utilisateurs !`,
          time: "Il y a 2h",
          type: "success",
          read: true,
        });
      }

      if (list.length === 0) {
        list.push({
          id: `welcome-${Date.now()}`,
          message: "Bienvenue sur votre tableau de bord admin",
          time: "Il y a 5 min",
          type: "info",
          read: true,
        });
      }

      return list;
    });

    return NextResponse.json({
      success: true,
      data: notifications
    });

  } catch (error) {
    console.error("Erreur notifications:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur", data: [] },
      { status: 500 }
    );
  }
}