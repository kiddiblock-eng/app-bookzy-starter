export const dynamic = "force-dynamic";
// app/api/payments/create/route.js
// ✅ VERSION CORRIGÉE : Détection automatique du provider actif

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Transaction from "@/models/Transaction";
import Settings from "@/models/settings"; 
import User from "@/models/User";
import { verifyAuth } from "@/lib/auth";
import PaymentProviderService from "@/lib/payment/PaymentProviderService";

export async function POST(req) {
  try {
    await dbConnect();

    // 1) Vérifier authentification
    const authUser = await verifyAuth(req);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Non authentifié" },
        { status: 401 }
      );
    }

    // 2) Charger l'utilisateur complet
    const user = await User.findById(authUser.id).lean();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Utilisateur introuvable" },
        { status: 404 }
      );
    }

    // 3) Recevoir les données
    const body = await req.json();
    const { projetId, kitData } = body;

    // 4) Charger settings
    const settings = await Settings.findOne({ key: "global" }).lean();
    
    if (!settings || !settings.payment) {
      return NextResponse.json(
        { success: false, message: "Configuration de paiement manquante" },
        { status: 500 }
      );
    }

    // 5) 🎯 DÉTECTION AUTOMATIQUE DU PROVIDER ACTIF
    let activeProviderName = settings.payment.activeProvider;
    let providerConfig = null;

    // Si activeProvider n'est pas défini, chercher le premier provider actif
    if (!activeProviderName) {
      const providers = ["fedapay", "moneroo", "kkiapay", "pawapay"];
      for (const provName of providers) {
        if (settings.payment[provName]?.enabled) {
          activeProviderName = provName;
          providerConfig = settings.payment[provName];
          console.log(`✅ Provider actif détecté automatiquement: ${provName}`);
          break;
        }
      }
    } else {
      providerConfig = settings.payment[activeProviderName];
    }

    // Vérifier qu'on a bien un provider actif
    if (!activeProviderName || !providerConfig || !providerConfig.enabled) {
      return NextResponse.json(
        {
          success: false,
          message: "Aucun provider de paiement activé. Veuillez activer FedaPay, Moneroo, KkiaPay ou PawaPay dans les paramètres.",
        },
        { status: 500 }
      );
    }

    console.log(`💳 Utilisation du provider: ${activeProviderName}`);

    // Prix GLOBAL depuis settings.payment.ebookPrice
    const PRICE = settings.payment.ebookPrice || 2100;
    const CURRENCY = providerConfig.defaultCurrency || "XOF";

    console.log(`💰 Montant: ${PRICE} ${CURRENCY}`);

    // 6) Générer ID interne
    const internalId = `BKZ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // 7) ✅ NE PAS créer le projet ici - sera créé par /api/ebooks/generate
    // On stocke juste les données dans kitData pour plus tard

    // 8) Créer la transaction
    const tx = await Transaction.create({
      userId: authUser.id,
      provider: activeProviderName,
      amount: PRICE,
      currency: CURRENCY,
      status: "pending",
      purpose: "ebook_kit",
      projetId: projetId || null, // ✅ null si pas encore de projet
      kitData: kitData || {},
      internalId,
      providerResponse: {},
    });

    console.log("✅ Transaction créée:", tx._id.toString(), "Provider:", activeProviderName);

    // 9) Récupérer le provider via le service
    let provider;
    try {
      provider = await PaymentProviderService.getActiveProvider();
    } catch (error) {
      console.error("❌ Erreur récupération provider:", error);
      return NextResponse.json(
        { success: false, message: "Aucun provider de paiement actif" },
        { status: 500 }
      );
    }

    // 10) Préparer les données pour le provider
    const callbackBase = settings.appDomain || "http://localhost:3000";
    const returnUrl = `${callbackBase.replace(/\/$/, "")}/dashboard/projets/nouveau?tx=${tx._id.toString()}`;

    const firstName = user.firstName || user.name?.split(" ")[0] || "Client";
    const lastName = user.lastName || user.name?.split(" ")[1] || "Bookzy";

    // Créer l'objet data au bon format pour le provider
    const paymentData = {
      amount: PRICE,
      currency: CURRENCY,
      description: kitData?.title ? `Kit eBook : ${kitData.title}` : "Kit eBook Bookzy",
      customerEmail: user.email,
      customerName: `${firstName} ${lastName}`,
      returnUrl: returnUrl,
      cancelUrl: returnUrl,
      
      // Métadonnées supplémentaires (optionnelles)
      metadata: {
        transactionId: internalId,
        userId: authUser.id,
        projetId: projetId || null,
        title: kitData?.title || "",
        template: kitData?.template || "modern",
      }
    };

    console.log("📤 Création paiement avec", activeProviderName);
    console.log("📧 Email:", user.email);
    console.log("🔗 Return URL:", returnUrl);

    // 11) Créer le paiement avec le provider
    let paymentResult;
    
    try {
      paymentResult = await provider.createPayment(paymentData);
      
      // Mettre à jour la transaction avec les infos du provider
      tx.providerTransactionId = paymentResult.transactionId || paymentResult.id;
      tx.providerResponse = paymentResult.rawResponse || paymentResult;
      tx.paymentUrl = paymentResult.paymentUrl;
      await tx.save();

      console.log(`✅ Paiement créé avec ${activeProviderName}:`, paymentResult.transactionId);

    } catch (error) {
      console.error(`❌ Erreur création paiement ${activeProviderName}:`, error);
      
      // Marquer la transaction comme failed
      tx.status = "failed";
      tx.errorMessage = error.message;
      tx.providerResponse = {
        error: error.message,
        timestamp: new Date(),
      };
      await tx.save();

      return NextResponse.json(
        {
          success: false,
          message: `Erreur lors de l'initialisation du paiement ${activeProviderName}.`,
          details: error.message,
        },
        { status: 500 }
      );
    }

    // 12) Vérifier qu'on a bien une URL de paiement (sauf PawaPay)
    if (!paymentResult.paymentUrl && activeProviderName !== 'pawapay') {
      console.error("❌ Aucune URL de paiement trouvée:", paymentResult);
      return NextResponse.json(
        {
          success: false,
          message: "Impossible de récupérer l'URL de paiement.",
          details: paymentResult,
        },
        { status: 500 }
      );
    }

    // 13) Succès ✔
    return NextResponse.json({
      success: true,
      paymentUrl: paymentResult.paymentUrl,
      transactionId: tx._id.toString(),
      provider: activeProviderName,
      amount: PRICE,
      currency: CURRENCY,
    });

  } catch (error) {
    console.error("❌ Erreur create payment:", error);
    return NextResponse.json(
      { success: false, message: "Erreur interne", error: error.message },
      { status: 500 }
    );
  }
}