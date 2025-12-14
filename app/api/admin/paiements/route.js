import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { dbConnect } from "@/lib/db";
import Transaction from "@/models/Transaction";

export async function GET(req) {
  try {
    await dbConnect();

    // ✅ Méthode 1 : JWT Token (via cookie)
    const adminToken = req.cookies.get("admin_token")?.value;
    
    // ✅ Méthode 2 : Admin Secret (via header)
    const adminSecret = req.headers.get("x-admin-secret");

    let isAuthorized = false;

    // Vérifier JWT token
    if (adminToken) {
      try {
        const decoded = await jwtVerify(
          adminToken,
          new TextEncoder().encode(process.env.JWT_SECRET)
        );

        if (
          decoded.payload.role === "admin" ||
          decoded.payload.role === "super_admin"
        ) {
          isAuthorized = true;
          console.log("✅ Auth JWT réussie");
        }
      } catch (error) {
        console.error("❌ JWT invalide:", error.message);
      }
    }

    // Fallback : vérifier le secret
    if (!isAuthorized && adminSecret === process.env.ADMIN_SECRET) {
      isAuthorized = true;
      console.log("✅ Auth SECRET réussie");
    }

    if (!isAuthorized) {
      console.log("❌ Non autorisé - Aucune méthode valide");
      return NextResponse.json(
        { success: false, message: "Non autorisé" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "7d";

    // Déterminer la date de début
    const now = new Date();
    let startDate = new Date();

    switch (range) {
      case "24h":
        startDate.setHours(now.getHours() - 24);
        break;
      case "7d":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    console.log(`📊 Recherche transactions depuis: ${startDate.toISOString()}`);

    // ✅ Récupération des transactions (avec filtre optimisé)
    const transactions = await Transaction.find({
      createdAt: { $gte: startDate },
      amount: { $gt: 0 }, // ✅ AJOUTÉ - Exclut les transactions à montant nul/négatif
    })
      .populate("userId", "email name country")
      .sort({ createdAt: -1 })
      .lean();

    console.log(`📦 Transactions trouvées: ${transactions.length}`);

    // Statistiques
    const successful = transactions.filter((t) => t.status === "completed");
    const failed = transactions.filter((t) => t.status === "failed");
    
    const totalRevenue = successful.reduce((sum, t) => sum + (t.amount || 0), 0);

    console.log(`✅ Complétées: ${successful.length}, ❌ Échouées: ${failed.length}`);
    console.log(`💰 Revenus: ${totalRevenue} FCFA`);

    // Revenus du jour
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayRevenue = successful
      .filter((t) => new Date(t.createdAt) >= today)
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    // Top pays
    const countryStats = {};
    successful.forEach((t) => {
      const c = t.userId?.country || "Inconnu";
      countryStats[c] = (countryStats[c] || 0) + 1;
    });

    const topCountries = Object.entries(countryStats)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top utilisateurs
    const userStats = {};
    successful.forEach((t) => {
      const email = t.userId?.email;
      if (email) {
        userStats[email] = (userStats[email] || 0) + 1;
      }
    });

    const topUsers = Object.entries(userStats)
      .map(([email, count]) => ({ email, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        todayRevenue,
        totalTransactions: transactions.length,
        successfulTransactions: successful.length,
        failedTransactions: failed.length,
        topCountries,
        topUsers,
      },
      transactions,
    });
  } catch (error) {
    console.error("❌ Erreur stats paiements :", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}