// app/api/admin/express/route.js
// API Admin pour lister les mises en page (Express)

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Projet from "@/models/Projet";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { withCache } from "@/lib/miniCache";

function getUserFromCookie(req) {
  const cookie = req.headers.get("cookie") || "";
  
  // Essayer admin_token d'abord, puis bookzy_token
  const adminToken = cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("admin_token="))
    ?.split("=")[1];
    
  const userToken = cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("bookzy_token="))
    ?.split("=")[1];

  const token = adminToken || userToken;

  try {
    return jwt.verify(token, process.env.JWT_SECRET) || null;
  } catch {
    return null;
  }
}

// GET - Lister les mises en page (expressMode: true)
export async function GET(req) {
  try {
    await dbConnect();

    const userData = getUserFromCookie(req);
    if (!userData) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Vérifier que c'est un admin
    const user = await User.findById(userData.id);
    if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
      return NextResponse.json(
        { success: false, error: "Accès non autorisé" },
        { status: 403 }
      );
    }

    // Paramètres
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status"); // COMPLETED, processing, DRAFT, ERROR

    const data = await withCache(
      `admin:express:${page}:${limit}:${search}:${status}`,
      30000,
      async () => {
        // Construire le filtre - uniquement expressMode: true
        const filter = { expressMode: true };

        if (search) {
          // Recherche par titre ou email utilisateur
          const users = await User.find({
            $or: [
              { email: { $regex: search, $options: "i" } },
              { firstName: { $regex: search, $options: "i" } },
            ]
          }).select("_id");

          const userIds = users.map(u => u._id);

          filter.$or = [
            { titre: { $regex: search, $options: "i" } },
            { userId: { $in: userIds } },
          ];
        }

        if (status) {
          filter.status = status;
        }

        // Récupérer les projets avec les infos utilisateur
        const projets = await Projet.find(filter)
          .populate("userId", "email firstName lastName")
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean();

        // Reformater pour le frontend
        const formattedProjets = projets.map(p => ({
          ...p,
          user: p.userId ? {
            email: p.userId.email,
            firstName: p.userId.firstName,
            lastName: p.userId.lastName,
          } : null
        }));

        const totalCount = await Projet.countDocuments(filter);

        // Stats globales pour Express
        const total = await Projet.countDocuments({ expressMode: true });
        const paid = await Projet.countDocuments({ expressMode: true, isPaid: true });
        const completed = await Projet.countDocuments({ expressMode: true, status: "COMPLETED" });
        const pending = await Projet.countDocuments({
          expressMode: true,
          status: { $in: ["DRAFT", "processing", "PREVIEW_READY"] }
        });
        const errors = await Projet.countDocuments({ expressMode: true, status: "ERROR" });

        // Calculer le revenue (1000 FCFA par projet payé + IA extra)
        const paidProjets = await Projet.find({ expressMode: true, isPaid: true }).select("aiExtraCost").lean();
        const revenue = paidProjets.reduce((sum, p) => {
          return sum + 1000 + (p.aiExtraCost || 0);
        }, 0);

        const globalStats = {
          total,
          paid,
          completed,
          pending,
          errors,
          revenue,
        };

        return {
          projets: formattedProjets,
          globalStats,
          pagination: {
            page,
            limit,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
          },
        };
      }
    );

    return NextResponse.json({
      success: true,
      ...data,
    });
  } catch (error) {
    console.error("❌ [Admin Express] Erreur:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}