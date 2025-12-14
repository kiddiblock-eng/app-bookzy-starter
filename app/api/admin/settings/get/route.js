import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Settings from "@/models/settings"; 
import { verifyAdmin } from "@/lib/auth";

export async function GET(req) {
  try {
    await dbConnect();

    const { authorized } = await verifyAdmin(req);
    if (!authorized) {
      return NextResponse.json(
        { success: false, message: "Non autorisé" },
        { status: 403 }
      );
    }

    // 📌 Charger les settings
    let settingsData = await Settings.findOne({ key: "global" }).lean();

    // 📌 Si aucun settings n'existe -> créer par défaut
    if (!settingsData) {
      const created = await Settings.create({
        key: "global",
        appName: "Bookzy",

        payment: {
          moneroo: {
            enabled: false,
            environment: "test",
            defaultCurrency: "XOF",
          },
        },
      });

      settingsData = created.toObject();
    }

    return NextResponse.json({
      success: true,
      settings: settingsData,
    });

  } catch (error) {
    console.error("❌ Erreur /api/admin/settings/get :", error);
    return NextResponse.json(
      { success: false, message: "Erreur interne" },
      { status: 500 }
    );
  }
}