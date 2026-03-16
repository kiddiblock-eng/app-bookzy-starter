// app/api/smart-shop/leads/[id]/route.js
// API pour gérer un lead spécifique

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Lead from "@/models/Lead";
import jwt from "jsonwebtoken";

function getUserIdFromCookie(req) {
  const cookie = req.headers.get("cookie") || "";
  const token = cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("bookzy_token="))
    ?.split("=")[1];

  try {
    return jwt.verify(token, process.env.JWT_SECRET)?.id || null;
  } catch {
    return null;
  }
}

// PUT - Mettre à jour un lead (statut, notes)
export async function PUT(req, { params }) {
  try {
    await dbConnect();

    const userId = getUserIdFromCookie(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    const { id } = params;
    const data = await req.json();

    const lead = await Lead.findOne({ _id: id, userId });
    if (!lead) {
      return NextResponse.json(
        { success: false, error: "Lead non trouvé" },
        { status: 404 }
      );
    }

    // Mise à jour des champs autorisés
    if (data.status !== undefined) lead.status = data.status;
    if (data.notes !== undefined) lead.notes = data.notes;

    await lead.save();

    return NextResponse.json({
      success: true,
      lead,
    });
  } catch (error) {
    console.error("❌ [Lead] Erreur PUT:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un lead
export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    const userId = getUserIdFromCookie(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    const { id } = params;

    const lead = await Lead.findOneAndDelete({ _id: id, userId });
    if (!lead) {
      return NextResponse.json(
        { success: false, error: "Lead non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Lead supprimé",
    });
  } catch (error) {
    console.error("❌ [Lead] Erreur DELETE:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}