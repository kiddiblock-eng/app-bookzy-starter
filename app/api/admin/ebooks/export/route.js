import { NextResponse } from "next/server";
import { dbConnect } from "../../../../../lib/db";
import Projet from "../../../../../models/Projet"; // ✅ CHANGÉ
import { verifyAdmin } from "../../../../../lib/auth";

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

    const ebooks = await Projet.find( // ✅ CHANGÉ
      { status: "COMPLETED" }, // ✅ AJOUTÉ - Exporte uniquement les ebooks complétés
      {
        titre: 1,    // ✅ CHANGÉ
        template: 1,
        pages: 1,
        createdAt: 1,
        pdfUrl: 1,   // ✅ CHANGÉ
        userId: 1
      }
    )
      .populate("userId", "name email country")
      .sort({ createdAt: -1 })
      .lean();

    const cleaned = ebooks.map(e => ({
      id: e._id,
      title: e.titre,   // ✅ CHANGÉ
      template: e.template,
      pages: e.pages,
      createdAt: e.createdAt,
      fileUrl: e.pdfUrl, // ✅ CHANGÉ
      user: {
        name: e.userId?.name || "",
        email: e.userId?.email || "",
        country: e.userId?.country || ""
      }
    }));

    return NextResponse.json({
      success: true,
      ebooks: cleaned
    });

  } catch (error) {
    console.error("❌ Erreur API export ebook:", error);
    return NextResponse.json(
      { success: false, message: "Erreur interne" },
      { status: 500 }
    );
  }
}