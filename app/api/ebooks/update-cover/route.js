export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
import Projet from "../../../../models/Projet";
import { getUserFromToken } from "../../../../lib/auth";

export async function POST(req) {
  try {
    await dbConnect();
    const { projetId, coverUrl } = await req.json();

    if (!projetId || !coverUrl) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const user = await getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });
    }
    const projet = await Projet.findById(projetId);
    if (!projet) {
      return NextResponse.json({ success: false, message: "Projet introuvable" }, { status: 404 });
    }
    if (String(projet.userId) !== String(user._id)) {
      return NextResponse.json({ success: false, message: "Accès refusé" }, { status: 403 });
    }

    // Mise à jour du projet avec la nouvelle URL Cloudinary
    projet.coverUrl = coverUrl;
    await projet.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}