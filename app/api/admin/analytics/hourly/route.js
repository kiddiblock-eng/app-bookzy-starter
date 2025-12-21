export const dynamic = "force-dynamic";
// app/api/admin/analytics/hourly/route.js
// ✅ VERSION CORRIGÉE - Utilise Projet au lieu de Ebook

import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import Projet from "@/models/Projet"; // ✅ CHANGÉ
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    // Logins groupés par heure
    const logins = await User.aggregate([
      {
        $match: { lastLogin: { $ne: null } }
      },
      {
        $group: {
          _id: { $hour: "$lastLogin" },
          count: { $sum: 1 }
        }
      }
    ]);

    // ✅ eBooks groupés par heure (depuis Projet)
    const ebooks = await Projet.aggregate([ // ✅ CHANGÉ
      {
        $match: {
          status: "COMPLETED" // ✅ AJOUTÉ - Filtre uniquement les projets terminés
        }
      },
      {
        $group: {
          _id: { $hour: "$createdAt" },
          count: { $sum: 1 }
        }
      }
    ]);

    const map = {};

    // Ajout des logins
    logins.forEach((h) => {
      if (h._id !== null) {
        map[h._id] = (map[h._id] || 0) + h.count;
      }
    });

    // Ajout des ebooks créés
    ebooks.forEach((h) => {
      if (h._id !== null) {
        map[h._id] = (map[h._id] || 0) + h.count;
      }
    });

    // Format final
    const result = Object.entries(map)
      .map(([hour, count]) => ({
        hour: hour.toString().padStart(2, "0") + "h",
        count
      }))
      .sort((a, b) => parseInt(a.hour) - parseInt(b.hour)); // ✅ Amélioration du tri

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error("Hourly error:", err);
    return NextResponse.json(
      { success: false, data: [] },
      { status: 500 }
    );
  }
}