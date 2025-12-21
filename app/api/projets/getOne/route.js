export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db.js";
import Projet from "@/models/Projet.js";



export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Paramètre 'id' manquant" },
        { status: 400 }
      );
    }

    await dbConnect();

    const projet = await Projet.findById(id).lean();

    if (!projet) {
      return NextResponse.json(
        { success: false, message: "Projet introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, projet });
  } catch (error) {
    console.error("❌ Erreur GET /api/projets/getOne :", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur", error: error.message },
      { status: 500 }
    );
  }
}
