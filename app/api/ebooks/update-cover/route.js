import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
import Projet from "../../../../models/Projet";

export async function POST(req) {
  try {
    await dbConnect();
    const { projetId, coverUrl } = await req.json();

    if (!projetId || !coverUrl) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    // Mise à jour du projet avec la nouvelle URL Cloudinary
    await Projet.findByIdAndUpdate(projetId, { 
      coverUrl: coverUrl 
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}