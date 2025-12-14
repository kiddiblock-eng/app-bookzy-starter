import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import Projet from "@/models/Projet"; // ✅ AJOUTÉ

export async function GET(req) {
  try {
    await dbConnect();

    const totalUsers = await User.countDocuments();

    // 1. Score Ventes (basé sur les utilisateurs actifs des 30 derniers jours)
    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    
    const salesScore = totalUsers > 0 
      ? Math.min(Math.round((activeUsers / totalUsers) * 100), 100)
      : 0;

    // 2. Score Engagement (basé sur les connexions des 7 derniers jours)
    const veryActiveUsers = await User.countDocuments({
      lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });
    
    const engagementScore = totalUsers > 0
      ? Math.min(Math.round((veryActiveUsers / totalUsers) * 100), 100)
      : 0;

    // 3. Score Conversion (basé sur le ratio users avec ebooks COMPLÉTÉS)
    // ✅ CORRIGÉ - Calcul depuis Projet au lieu du champ inexistant ebooksCreated
    const usersWithEbooksAgg = await Projet.aggregate([
      {
        $match: {
          status: "COMPLETED"
        }
      },
      {
        $group: {
          _id: "$userId"
        }
      }
    ]);
    
    const usersWithEbooks = usersWithEbooksAgg.length;
    
    const conversionScore = totalUsers > 0
      ? Math.min(Math.round((usersWithEbooks / totalUsers) * 100), 100)
      : 0;

    // 4. Score Rétention (users anciens qui reviennent)
    const oldUsers = await User.countDocuments({
      createdAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    
    const returningUsers = await User.countDocuments({
      createdAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });
    
    const retentionScore = oldUsers > 0 
      ? Math.min(Math.round((returningUsers / oldUsers) * 100), 100)
      : 0;

    // 5. Score Satisfaction (basé sur la croissance)
    const usersLastMonth = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    
    const usersPreviousMonth = await User.countDocuments({
      createdAt: { 
        $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      }
    });
    
    const growthRate = usersPreviousMonth > 0
      ? ((usersLastMonth - usersPreviousMonth) / usersPreviousMonth) * 100
      : 100;
    
    // Score de satisfaction basé sur la croissance (50 = base, +/- selon croissance)
    const satisfactionScore = Math.min(Math.max(50 + growthRate, 0), 100);

    const performanceData = [
      { metric: "Ventes", value: salesScore || 0 },
      { metric: "Engagement", value: engagementScore || 0 },
      { metric: "Conversion", value: conversionScore || 0 },
      { metric: "Rétention", value: retentionScore || 0 },
      { metric: "Satisfaction", value: Math.round(satisfactionScore) || 0 }
    ];

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