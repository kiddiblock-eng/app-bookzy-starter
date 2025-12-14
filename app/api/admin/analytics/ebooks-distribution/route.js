// app/api/admin/analytics/ebooks-distribution/route.js
// ✅ VERSION CORRIGÉE - Utilise Projet au lieu de Ebook

import { dbConnect } from "@/lib/db";
import Projet from "@/models/Projet"; // ✅ CHANGÉ
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  const stats = await Projet.aggregate([ // ✅ CHANGÉ
    {
      $match: {
        status: "COMPLETED" // ✅ AJOUTÉ - Filtre uniquement les projets terminés
      }
    },
    {
      $group: {
        _id: "$userId",
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: "$count",
        users: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const data = stats.map((s) => ({
    ebooks: s._id,
    count: s.users, // ✅ RENOMMÉ de "users" à "count" pour le frontend
  }));

  return NextResponse.json({
    success: true,
    data,
  });
}