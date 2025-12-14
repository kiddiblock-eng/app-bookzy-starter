import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Projet from "@/models/Projet";
import { verifyAdmin } from "@/lib/auth";

export async function GET(req) {
  try {
    await dbConnect();

    const { authorized } = await verifyAdmin(req);
    if (!authorized) {
      return NextResponse.json(
        { success: false, message: "Non autorisé" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const ebooks = await Projet.find(
      { status: "COMPLETED" },
      {
        titre: 1,
        template: 1,
        pages: 1,
        createdAt: 1,
        pdfUrl: 1,
        userId: 1
      }
    )
      .populate("userId", "name email country")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const cleaned = ebooks.map(e => ({
      _id: e._id,
      title: e.titre,
      template: e.template,
      pages: e.pages,
      createdAt: e.createdAt,
      fileUrl: e.pdfUrl,
      userId: e.userId
    }));

    return NextResponse.json({
      success: true,
      data: cleaned
    });

  } catch (error) {
    console.error("❌ Erreur API list ebook:", error);
    return NextResponse.json(
      { success: false, message: "Erreur interne" },
      { status: 500 }
    );
  }
}