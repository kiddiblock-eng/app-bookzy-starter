// app/api/admin/analytics/leaderboard/route.js
// ✅ VERSION CORRIGÉE - Utilise Projet avec aggregate

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import Projet from "@/models/Projet"; // ✅ CHANGÉ

export async function GET(req) {
  try {
    await dbConnect();

    // ✅ On récupère les 3 meilleurs créateurs depuis Projet
    const top = await Projet.aggregate([
      {
        $match: {
          status: "COMPLETED" // ✅ AJOUTÉ - Filtre les projets terminés
        }
      },
      {
        $group: {
          _id: "$userId",
          ebooks: { $sum: 1 }
        }
      },
      { $sort: { ebooks: -1 } },
      { $limit: 3 }
    ]);

    // On enrichit avec les infos utilisateur
    const users = await User.find({
      _id: { $in: top.map(t => t._id) }
    }).lean();

    // MERGE user + ebooks count
    const formatted = top.map(t => {
      const user = users.find(u => u._id.toString() === t._id.toString());
      return {
        name: user ? user.name : "Utilisateur inconnu",
        email: user?.email || "",
        avatar: user?.avatar || "",
        ebooks: t.ebooks
      };
    });

    return NextResponse.json({
      success: true,
      data: formatted
    });

  } catch (error) {
    console.error("Erreur leaderboard:", error);
    return NextResponse.json(
      { success: false, data: [] },
      { status: 500 }
    );
  }
}