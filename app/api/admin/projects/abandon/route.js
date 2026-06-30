export const dynamic = "force-dynamic";
import { dbConnect } from "@/lib/db";
import { withCache } from "@/lib/miniCache";
import Projet from "@/models/Projet";
import { verifyAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  await dbConnect();

  const { authorized } = await verifyAdmin(req);
  if (!authorized) {
    return NextResponse.json(
      { success: false, message: "Non autorisé" },
      { status: 403 }
    );
  }

  const abandonStats = await withCache(`admin:projects-abandon`, 30000, async () => {
    // ✅ Compter TOUS les status possibles
    const drafts = await Projet.countDocuments({ status: "DRAFT" });
    const processing = await Projet.countDocuments({ status: "processing" }); // ✅ AJOUTÉ
    const generatedText = await Projet.countDocuments({ status: "generated_text" }); // ✅ AJOUTÉ
    const assembling = await Projet.countDocuments({ status: "ASSEMBLING" }); // ✅ AJOUTÉ
    const completed = await Projet.countDocuments({ status: "COMPLETED" });
    const error = await Projet.countDocuments({ status: "ERROR" });

    // ✅ Total inclut TOUS les status
    const total = drafts + processing + generatedText + assembling + completed + error;

    return {
      drafts,
      processing, // ✅ AJOUTÉ
      generatedText, // ✅ AJOUTÉ
      assembling, // ✅ AJOUTÉ
      completed,
      error,
      total, // ✅ AJOUTÉ pour le frontend
      abandonRate: total ? Math.floor((drafts / total) * 100) : 0,
    };
  });

  return NextResponse.json({
    success: true,
    abandonStats,
  });
}