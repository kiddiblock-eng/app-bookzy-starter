export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Blog from "@/models/Blog";
import { verifyAdmin } from "@/lib/auth";

export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Non autorisé" },
        { status: 401 }
      );
    }

    const { id } = params;

    const deleted = await Blog.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Blog introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Blog supprimé avec succès",
    });

  } catch (error) {
    console.error("❌ Erreur delete blog:", error);
    return NextResponse.json(
      { success: false, message: "Erreur lors de la suppression du blog" },
      { status: 500 }
    );
  }
}