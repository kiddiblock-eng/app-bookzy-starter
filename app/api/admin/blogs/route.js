import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Blog from "@/models/Blog";
 import { verifyAdmin } from "../../../../lib/auth"; // Décommente si tu as l'auth

// GET — Liste des blogs
export async function GET() {
  try {
    await dbConnect();
    const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, blogs });
  } catch (err) {
    console.error("❌ GET BLOGS ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Erreur lors du chargement" },
      { status: 500 }
    );
  }
}

// POST — Créer un blog
export async function POST(req) {
  try {
    await dbConnect();

    // Vérification admin (décommente si nécessaire)
     const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
     }

    const body = await req.json();

    // Validation des champs obligatoires
    if (!body.title || !body.slug) {
      return NextResponse.json(
        { success: false, message: "Titre et slug requis" },
        { status: 400 }
      );
    }

    // Vérifier si le slug existe déjà
    const existing = await Blog.findOne({ slug: body.slug });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Ce slug existe déjà. Modifiez-le." },
        { status: 400 }
      );
    }

    // Créer le blog avec TOUS les champs SEO
    const blog = await Blog.create({
      title: body.title,
      slug: body.slug,
      cover: body.cover || "",
      excerpt: body.excerpt || "",
      content: body.content || "",
      seoTitle: body.seoTitle || body.title, // Fallback au titre
      seoDescription: body.seoDescription || body.excerpt, // Fallback à l'excerpt
      seoKeywords: body.seoKeywords || "",
    });

    return NextResponse.json({
      success: true,
      blog,
      message: "✅ Blog créé avec succès !"
    });

  } catch (err) {
    console.error("❌ CREATE BLOG ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Erreur serveur: " + err.message },
      { status: 500 }
    );
  }
}