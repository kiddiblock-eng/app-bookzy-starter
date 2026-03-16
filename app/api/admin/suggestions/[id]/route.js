// app/api/admin/suggestions/[id]/route.js
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Suggestion from "@/models/Suggestion";
import { verifyAdmin } from "@/lib/auth";

export async function PATCH(req, { params }) {
  try {
    await dbConnect();

    const admin = await verifyAdmin(req);
    if (!admin?.authorized) {
      return NextResponse.json({ success: false, message: "Accès refusé" }, { status: 403 });
    }

    const { status } = await req.json();
    const validStatuses = ["pending", "approved", "rejected", "planned", "delivered"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, message: "Status invalide" }, { status: 400 });
    }

    const suggestion = await Suggestion.findByIdAndUpdate(params.id, { status }, { new: true });
    if (!suggestion) {
      return NextResponse.json({ success: false, message: "Suggestion introuvable" }, { status: 404 });
    }

    return NextResponse.json({ success: true, suggestion });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    const admin = await verifyAdmin(req);
    if (!admin?.authorized) {
      return NextResponse.json({ success: false, message: "Accès refusé" }, { status: 403 });
    }

    await Suggestion.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}