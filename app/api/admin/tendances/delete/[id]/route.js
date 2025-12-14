import { dbConnect } from "@/lib/db";
import Trend from "@/models/Trend";
import { verifyAdmin } from "@/lib/auth";
import mongoose from "mongoose";

export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    // Vérification admin
    const admin = await verifyAdmin(req);
    if (!admin) {
      return new Response(
        JSON.stringify({ success: false, message: "Accès non autorisé" }),
        { status: 403 }
      );
    }

    const { id } = params;

    // Vérifier l'ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "ID de tendance invalide",
        }),
        { status: 400 }
      );
    }

    // Suppression
    const deleted = await Trend.findByIdAndDelete(id);

    if (!deleted) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Tendance introuvable",
        }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Tendance supprimée",
        deletedId: id,
        deletedTrend: deleted,
      }),
      { status: 200 }
    );

  } catch (err) {
    console.error("❌ Erreur DELETE tendance:", err);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Erreur serveur",
      }),
      { status: 500 }
    );
  }
}