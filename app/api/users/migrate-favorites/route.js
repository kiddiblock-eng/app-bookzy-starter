export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";
import User from "@/models/User";

// ✅ Change POST en GET
export async function GET(req) {
  try {
    await dbConnect();

    const admin = await verifyAdmin(req);
    if (!admin?.authorized) {
      return NextResponse.json(
        { success: false, message: "Non autorisé" },
        { status: 403 }
      );
    }

    // Mettre à jour TOUS les users sans favorites
    const result = await User.updateMany(
      { favorites: { $exists: false } },
      { $set: { favorites: [] } }
    );

    console.log("✅ Migration terminée:", result);

    return Response.json({
      success: true,
      message: `${result.modifiedCount} utilisateurs migrés`,
    });
  } catch (error) {
    console.error("❌ Erreur migration:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
