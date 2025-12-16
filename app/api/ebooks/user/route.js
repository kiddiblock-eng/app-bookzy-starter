import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Projet from "@/models/Projet";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await dbConnect();

    const cookie = req.headers.get("cookie") || "";
    const token = cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("bookzy_token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Utilisateur non connecté." },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Session expirée." },
        { status: 401 }
      );
    }

    // ✅ OPTIMISATION: .lean() + .select()
    const projets = await Projet.find({ userId: decoded.id })
      .sort({ createdAt: -1 })
      .select('titre description pages chapters template status isPaid pdfUrl coverUrl adsImages adsTexts createdAt')
      .lean()
      .exec();

    const ebooks = projets.map(p => ({
      _id: p._id.toString(),
      title: p.titre || "Sans titre",
      description: p.description || "",
      pages: p.pages || 20,
      chapters: p.chapters || 5,
      template: p.template || "modern",
      createdAt: p.createdAt,
      status: p.status,
      isPaid: p.isPaid,
      fileUrl: p.pdfUrl || null,
      coverUrl: p.coverUrl || null,
      adsImages: p.adsImages || [],
      adsTexts: p.adsTexts || {},
    }));

    return NextResponse.json(
      {
        success: true,
        ebooks,
        total: ebooks.length,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'private, max-age=60',
        }
      }
    );

  } catch (err) {
    console.error("❌ Erreur récupération projets :", err);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur interne du serveur.",
        error: err.message,
      },
      { status: 500 }
    );
  }
}