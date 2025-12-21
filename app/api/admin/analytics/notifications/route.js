export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export async function GET(req) {
  try {
    await dbConnect();

    const notifications = [];

    // 1. Nouveaux utilisateurs (dernières 24h)
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    if (newUsersToday > 0) {
      notifications.push({
        id: `new-users-${Date.now()}`,
        message: `${newUsersToday} nouveau${newUsersToday > 1 ? 'x' : ''} utilisateur${newUsersToday > 1 ? 's' : ''} inscrit${newUsersToday > 1 ? 's' : ''}`,
        time: "Aujourd'hui",
        type: "success",
        read: false
      });
    }

    // 2. Utilisateurs actifs (dernière heure)
    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: new Date(Date.now() - 60 * 60 * 1000) }
    });

    if (activeUsers > 5) {
      notifications.push({
        id: `active-users-${Date.now()}`,
        message: `Pic d'activité : ${activeUsers} utilisateurs en ligne`,
        time: "Il y a 1h",
        type: "info",
        read: false
      });
    }

    // 3. Jalon utilisateurs
    const totalUsers = await User.countDocuments();
    if (totalUsers >= 1000 && totalUsers % 100 === 0) {
      notifications.push({
        id: `milestone-${Date.now()}`,
        message: `🎉 Jalon atteint : ${totalUsers} utilisateurs !`,
        time: "Il y a 2h",
        type: "success",
        read: true
      });
    }

    // 4. Notification par défaut
    if (notifications.length === 0) {
      notifications.push({
        id: `welcome-${Date.now()}`,
        message: "Bienvenue sur votre tableau de bord admin",
        time: "Il y a 5 min",
        type: "info",
        read: true
      });
    }

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