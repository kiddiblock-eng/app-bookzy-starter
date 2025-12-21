export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Blog from "@/models/Blog";
import { verifyAdmin } from "@/lib/auth";

export async function PUT(req, { params }) {
  try {
    await dbConnect();

    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();

    const updateData = {
      title: body.title,
      slug: body.slug,
      coverImage: body.coverImage,
      excerpt: body.excerpt,
      content: body.content,
      updatedAt: new Date(),
    };

    const updated = await Blog.findByIdAndUpdate(id, updateData, { new: true });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Article introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, blog: updated });
  } catch (err) {
    console.error("❌ UPDATE BLOG ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}