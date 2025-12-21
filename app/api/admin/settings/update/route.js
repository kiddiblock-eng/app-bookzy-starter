export const dynamic = "force-dynamic";
// app/api/admin/settings/update/route.js

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Settings from "@/models/settings"; 
import { verifyAdmin } from "@/lib/auth";

export async function POST(req) {
  try {
    await dbConnect();

    const { authorized } = await verifyAdmin(req);
    if (!authorized) {
      return NextResponse.json(
        { success: false, message: "Non autorisé" },
        { status: 403 }
      );
    }

    const body = await req.json();
    
    // ✅ Utiliser Settings avec majuscule
    let settingsData = await Settings.findOne({ key: "global" });

    if (!settingsData) {
      settingsData = new Settings({ key: "global" });
    }

    // 🔥 GENERAL
    if (body.appName !== undefined) settingsData.appName = body.appName;
    if (body.appDomain !== undefined) settingsData.appDomain = body.appDomain;
    if (body.supportEmail !== undefined) settingsData.supportEmail = body.supportEmail;

    // 🔥 PAYMENTS → MONEROO
    if (body.payment?.moneroo) {
      const m = body.payment.moneroo;

      // Initialiser si inexistant
      if (!settingsData.payment) {
        settingsData.payment = { moneroo: {} };
      }
      if (!settingsData.payment.moneroo) {
        settingsData.payment.moneroo = {};
      }

      if (m.environment !== undefined) {
        settingsData.payment.moneroo.environment = m.environment;
      }
      if (m.secretKey !== undefined) {
        settingsData.payment.moneroo.secretKey = m.secretKey;
      }
      if (m.defaultCurrency !== undefined) {
        settingsData.payment.moneroo.defaultCurrency = m.defaultCurrency;
      }
      if (m.webhookSecret !== undefined) {
        settingsData.payment.moneroo.webhookSecret = m.webhookSecret;
      }

      // ➕ PRIX DYNAMIQUE
      if (m.ebookPrice !== undefined) {
        const price = Number(m.ebookPrice);
        if (price >= 0) {
          settingsData.payment.moneroo.ebookPrice = price;
        }
      }
    }

    await settingsData.save();

    console.log("✅ Settings mis à jour avec succès");

    return NextResponse.json({
      success: true,
      message: "Paramètres mis à jour",
      settings: settingsData,
    });
  } catch (error) {
    console.error("❌ settings/update:", error);
    return NextResponse.json(
      { success: false, message: "Erreur interne" },
      { status: 500 }
    );
  }
}