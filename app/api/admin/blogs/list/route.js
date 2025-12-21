export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Blog from "@/models/Blog";
import { verifyAdmin } from "@/lib/auth";

export async function GET(req) {
  try {
    await dbConnect();

    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Non autorisé" },
        { status: 401 }
      );
    }

    const blogs = await Blog.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      blogs,
    });

  } catch (error) {
    console.error("❌ Erreur list blogs:", error);
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération des blogs" },
      { status: 500 }
    );
  }
}