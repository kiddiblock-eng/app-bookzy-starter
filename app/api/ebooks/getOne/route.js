export const dynamic = "force-dynamic";
import { dbConnect } from "../../../../lib/db";
import Ebook from "../../../../models/Ebook";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // 🔥 FIX : Valider l'ID AVANT de faire la requête MongoDB
    if (!id || id === "undefined" || id === "null" || id.length !== 24) {
      return NextResponse.json(
        { success: false, message: "ID invalide" },
        { status: 400 }
      );
    }

    const cookie = req.headers.get("cookie") || "";
    const token = cookie.split(";").find(c => c.trim().startsWith("bookzy_token="))?.split("=")[1];
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Non autorisé" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const ebook = await Ebook.findOne({
      _id: id,
      userId: decoded.id
    });

    if (!ebook) {
      return NextResponse.json(
        { success: false, message: "Ebook introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, ebook });
  } catch (err) {
    console.error("Erreur getOne ebook :", err);
    return NextResponse.json(
      { success: false, message: "Erreur interne" },
      { status: 500 }
    );
  }
}