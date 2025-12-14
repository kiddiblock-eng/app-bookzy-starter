import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Projet from "../../../../../models/Projet.js";
import jwt from "jsonwebtoken";

async function connectDB() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: "bookzy" });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();

    // Auth
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
    const updateData = await req.json();

    const projet = await Projet.findOneAndUpdate(
      { _id: projetId, userId: decoded.id },
      updateData,
      { new: true }
    );

    if (!projet) {
      return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      projet
    });

  } catch (e) {
    console.error("❌ UPDATE Projet error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}