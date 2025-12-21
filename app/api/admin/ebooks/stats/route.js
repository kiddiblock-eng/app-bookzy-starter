export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Projet from "@/models/Projet"; // ✅ CHANGÉ
import { verifyAdmin } from "@/lib/auth";

export async function GET(req) {
  try {
    await dbConnect();

    // 🔐 Sécurité maximale : vérification admin via cookie HTTP-only
    const { authorized } = await verifyAdmin(req);
    if (!authorized) {
      return NextResponse.json(
        { success: false, message: "Accès non autorisé." },
        { status: 403 }
      );
    }

    // Récup range
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "7d";

    const now = new Date();
    let startDate = new Date();

    if (range === "24h") startDate.setDate(now.getDate() - 1);
    if (range === "7d") startDate.setDate(now.getDate() - 7);
    if (range === "30d") startDate.setDate(now.getDate() - 30);
    if (range === "90d") startDate.setDate(now.getDate() - 90);

    // 🧩 Charge allégée (évite les crash mémoire)
    const ebooks = await Projet.find( // ✅ CHANGÉ
      { 
        status: "COMPLETED", // ✅ AJOUTÉ - Filtre uniquement les projets terminés
        createdAt: { $gte: startDate } 
      },
      {
        titre: 1, // ✅ CHANGÉ (title → titre)
        template: 1,
        pages: 1,
        pdfUrl: 1, // ✅ CHANGÉ (fileUrl → pdfUrl)
        createdAt: 1,
        userId: 1,
      }
    )
      .populate("userId", "name email country")
      .sort({ createdAt: -1 })
      .lean();

    // 📊 Statistiques
    const totalEbooks = ebooks.length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const ebooksToday = ebooks.filter(e => new Date(e.createdAt) >= today).length;

    const totalPages = ebooks.reduce((sum, e) => sum + (e.pages || 0), 0);

    const totalUsers = new Set(
      ebooks.map(e => e.userId?._id?.toString())
    ).size;

    // 📈 Usage over time
    const usageMap = {};
    ebooks.forEach(e => {
      const key = e.createdAt.toISOString().split("T")[0];
      usageMap[key] = (usageMap[key] || 0) + 1;
    });

    const usageOverTime = Object.entries(usageMap).map(([date, count]) => ({
      date,
      count,
    }));

    // 🌍 Top pays
    const countryMap = {};
    ebooks.forEach(e => {
      const c = e.userId?.country || "Inconnu";
      countryMap[c] = (countryMap[c] || 0) + 1;
    });

    const topCountries = Object.entries(countryMap)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count);

    // 👑 Top users
    const userMap = {};
    ebooks.forEach(e => {
      if (!e.userId) return;
      const id = e.userId._id.toString();
      const name = e.userId.name || "Inconnu";
      const email = e.userId.email;

      if (!userMap[id]) userMap[id] = { name, email, count: 0 };
      userMap[id].count++;
    });

    const topUsers = Object.values(userMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // 🚀 Retour final optimisé
    return NextResponse.json({
      success: true,
      stats: {
        totalEbooks,
        ebooksToday,
        totalPages,
        totalUsers,
        usageOverTime,
        topCountries,
        topUsers,
      },
      ebooks: ebooks.map(e => ({
        id: e._id,
        title: e.titre, // ✅ CHANGÉ
        template: e.template,
        pages: e.pages,
        fileUrl: e.pdfUrl, // ✅ CHANGÉ
        createdAt: e.createdAt,
        user: {
          id: e.userId?._id || null,
          name: e.userId?.name || "Inconnu",
          email: e.userId?.email || "inconnu",
          country: e.userId?.country || "Inconnu",
        },
      })),
    });

  } catch (err) {
    console.error("❌ Erreur API admin ebooks:", err);
    return NextResponse.json(
      { success: false, message: "Erreur interne" },
      { status: 500 }
    );
  }
}