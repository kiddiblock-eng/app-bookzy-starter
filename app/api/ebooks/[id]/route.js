import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Projet from "../../../../models/Projet.js";
import jwt from "jsonwebtoken";

async function connectDB() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: "bookzy" });
  }
}

export async function GET(req, { params }) {
  try {
    await connectDB();

    // Auth token
    const cookie = req.headers.get("cookie") || "";
    const token = cookie
      .split(";")
      .map(c => c.trim())
      .find(c => c.startsWith("bookzy_token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return NextResponse.json({ error: "Session expirée" }, { status: 401 });
    }

    const projetId = params.id;

    const projet = await Projet.findOne({
      _id: projetId,
      userId: decoded.id
    }).lean();

    if (!projet) {
      return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      projet
    });

  } catch (e) {
    console.error("❌ GET Projet error:", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}