import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Blog from "@/models/Blog";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { slug } = params;

    const blog = await Blog.findOne({ slug }).lean();

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Article introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      blog,
    });

  } catch (err) {
    console.error("❌ GET BLOG BY SLUG ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}