export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Projet from "@/models/Projet";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    
    const { id } = params;
    
    const projet = await Projet.findById(id).select("status progress pdfUrl errorMessage");
    
    if (!projet) {
      return NextResponse.json(
        { success: false, error: "Projet introuvable" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      status: projet.status,
      progress: projet.progress || 0,
      pdfUrl: projet.pdfUrl,
      errorMessage: projet.errorMessage,
    });
    
  } catch (error) {
    console.error("❌ [Status] Erreur:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}