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

    // ✅ Renommer la variable
    const globalSettings = await Settings.findOne({ key: "global" }).lean();

    if (!globalSettings?.payment?.moneroo?.secretKey) {
      return NextResponse.json(
        { success: false, message: "Clés Moneroo manquantes. Configurez-les d'abord." },
        { status: 400 }
      );
    }

    const moneroo = globalSettings.payment.moneroo;

    console.log("🧪 Test connexion Moneroo...");
    console.log("Environment:", moneroo.environment);
    console.log("Currency:", moneroo.defaultCurrency);

    // Test API Moneroo
    const response = await fetch("https://api.moneroo.io/v1/payments/initialize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${moneroo.secretKey}`,
      },
      body: JSON.stringify({
        amount: 100, // 100 FCFA pour test
        currency: moneroo.defaultCurrency || "XOF",
        description: "Test connexion Moneroo - Bookzy",
        callbackUrl: `${globalSettings.appDomain || "https://bookzy.io"}/api/webhooks/moneroo/test`,
        metadata: {
          test: true,
          source: "admin-settings-test",
        },
      }),
    });

    const json = await response.json().catch(() => null);

    console.log("Response status:", response.status);
    console.log("Response data:", json);

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: "✅ Connexion Moneroo réussie !",
        details: {
          status: response.status,
          paymentId: json?.id || json?.reference,
          checkoutUrl: json?.payment_url || json?.checkout_url,
        },
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "❌ Erreur de connexion Moneroo",
        details: json,
      });
    }

  } catch (error) {
    console.error("❌ Erreur test Moneroo:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur interne lors du test",
        error: error.message,
      },
      { status: 500 }
    );
  }
}