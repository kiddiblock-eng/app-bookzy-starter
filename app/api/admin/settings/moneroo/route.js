// app/api/admin/settings/moneroo/route.js

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Settings from "@/models/settings";
import { verifyAdmin } from "@/lib/auth";

// GET - Récupérer config Moneroo
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

    let settings = await Settings.findOne({ key: "global" });

    if (!settings) {
      // Créer avec valeurs par défaut
      settings = await Settings.create({
        key: "global",
        payment: {
          moneroo: {
            enabled: false,
            environment: "test",
            secretKey: "",
            publicKey: "",
            defaultCurrency: "XOF",
            webhookSecret: "",
            ebookPrice: 2100,
          },
        },
      });
    }

    const moneroo = settings.payment?.moneroo || {};

    return NextResponse.json({
      success: true,
      moneroo: {
        enabled: moneroo.enabled ?? false,
        environment: moneroo.environment ?? "test",
        secretKey: moneroo.secretKey ?? "",
        publicKey: moneroo.publicKey ?? "",
        defaultCurrency: moneroo.defaultCurrency ?? "XOF",
        webhookSecret: moneroo.webhookSecret ?? "",
        ebookPrice: moneroo.ebookPrice ?? 2100,
      },
    });
  } catch (error) {
    console.error("❌ GET Moneroo settings error:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour config Moneroo
export async function PUT(req) {
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
    const {
      enabled,
      environment,
      secretKey,
      publicKey,
      defaultCurrency,
      webhookSecret,
      ebookPrice,
    } = body;

    let settings = await Settings.findOne({ key: "global" });

    if (!settings) {
      settings = new Settings({ key: "global" });
    }

    // Initialiser payment.moneroo si inexistant
    if (!settings.payment) {
      settings.payment = { moneroo: {} };
    }
    if (!settings.payment.moneroo) {
      settings.payment.moneroo = {};
    }

    // Mise à jour des champs
    if (enabled !== undefined) settings.payment.moneroo.enabled = enabled;
    if (environment !== undefined) settings.payment.moneroo.environment = environment;
    if (secretKey !== undefined) settings.payment.moneroo.secretKey = secretKey;
    if (publicKey !== undefined) settings.payment.moneroo.publicKey = publicKey;
    if (defaultCurrency !== undefined) settings.payment.moneroo.defaultCurrency = defaultCurrency;
    if (webhookSecret !== undefined) settings.payment.moneroo.webhookSecret = webhookSecret;
    if (ebookPrice !== undefined) settings.payment.moneroo.ebookPrice = ebookPrice;

    await settings.save();

    console.log("✅ Settings Moneroo mis à jour");

    return NextResponse.json({
      success: true,
      message: "Configuration Moneroo mise à jour avec succès",
      moneroo: settings.payment.moneroo,
    });
  } catch (error) {
    console.error("❌ PUT Moneroo settings error:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}