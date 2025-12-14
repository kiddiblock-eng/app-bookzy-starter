// app/api/ebooks/progress/[id]/route.js

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Projet from "../../../../../models/Projet.js";

async function connectDB() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: "bookzy" });
  }
}

export async function GET(req, { params }) {
  try {
    await connectDB();

    const projetId = params.id;

    if (!projetId) {
      return NextResponse.json(
        { error: "ID projet requis" },
        { status: 400 }
      );
    }

    const projet = await Projet.findById(projetId).lean();

    if (!projet) {
      return NextResponse.json(
        { error: "Projet introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      status: projet.status,
      progress: projet.progress || 0,
      summary: projet.summary,
      introduction: projet.introduction,
      chapters: projet.chapters,
      conclusion: projet.conclusion,
      pdfUrl: projet.pdfUrl,
      coverUrl: projet.coverUrl,
      kitUrl: projet.kitUrl,
      adsTexts: projet.adsTexts,
      adsImages: projet.adsImages,
    });
  } catch (e) {
    console.error("Progress error:", e);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
