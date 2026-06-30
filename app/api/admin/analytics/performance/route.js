export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import Projet from "@/models/Projet"; // ✅ AJOUTÉ
import { withCache } from "@/lib/miniCache";
import { verifyAdmin } from "@/lib/auth";

export async function GET(req) {
  try {
    await dbConnect();

    const { authorized } = await verifyAdmin(req);
    if (!authorized) return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 403 });

    const performanceData = await withCache("admin:performance", 30000, async () => {
    const d30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const d7 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const d60 = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

    // Toutes les mesures EN PARALLÈLE (avant : 8 requêtes séquentielles)
    const [
      totalUsers,
      activeUsers,
      veryActiveUsers,
      usersWithEbooksAgg,
      oldUsers,
      returningUsers,
      usersLastMonth,
      usersPreviousMonth,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ lastLogin: { $gte: d30 } }),
      User.countDocuments({ lastLogin: { $gte: d7 } }),
      Projet.aggregate([{ $match: { status: "COMPLETED" } }, { $group: { _id: "$userId" } }]),
      User.countDocuments({ createdAt: { $lt: d30 } }),
      User.countDocuments({ createdAt: { $lt: d30 }, lastLogin: { $gte: d7 } }),
      User.countDocuments({ createdAt: { $gte: d30 } }),
      User.countDocuments({ createdAt: { $gte: d60, $lt: d30 } }),
    ]);

    // 1. Ventes (actifs 30j)
    const salesScore = totalUsers > 0 ? Math.min(Math.round((activeUsers / totalUsers) * 100), 100) : 0;
    // 2. Engagement (actifs 7j)
    const engagementScore = totalUsers > 0 ? Math.min(Math.round((veryActiveUsers / totalUsers) * 100), 100) : 0;
    // 3. Conversion (users avec ebooks complétés)
    const usersWithEbooks = usersWithEbooksAgg.length;
    const conversionScore = totalUsers > 0 ? Math.min(Math.round((usersWithEbooks / totalUsers) * 100), 100) : 0;
    // 4. Rétention (anciens qui reviennent)
    const retentionScore = oldUsers > 0 ? Math.min(Math.round((returningUsers / oldUsers) * 100), 100) : 0;
    // 5. Satisfaction (croissance)
    const growthRate = usersPreviousMonth > 0 ? ((usersLastMonth - usersPreviousMonth) / usersPreviousMonth) * 100 : 100;
    const satisfactionScore = Math.min(Math.max(50 + growthRate, 0), 100);

      return [
        { metric: "Ventes", value: salesScore || 0 },
        { metric: "Engagement", value: engagementScore || 0 },
        { metric: "Conversion", value: conversionScore || 0 },
        { metric: "Rétention", value: retentionScore || 0 },
        { metric: "Satisfaction", value: Math.round(satisfactionScore) || 0 },
      ];
    });

    return NextResponse.json({
      success: true,
      data: performanceData
    });

  } catch (error) {
    console.error("Erreur performance:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur", data: [] },
      { status: 500 }
    );
  }
}