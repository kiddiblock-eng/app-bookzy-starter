import { NextResponse } from "next/server";
import { dbConnect } from "../../../../../lib/db";
import Projet from "../../../../../models/Projet";
import Transaction from "../../../../../models/Transaction";
import jwt from "jsonwebtoken";

// ✅ Fonction pour récupérer userId depuis le cookie
function getUserIdFromCookie(req) {
  const cookie = req.headers.get("cookie") || "";
  const token = cookie.split(";").map((c) => c.trim()).find((c) => c.startsWith("bookzy_token="))?.split("=")[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET)?.id || null;
  } catch {
    return null;
  }
}

export async function POST(req, { params }) {
  try {
    // ✅ Authentification
    const userId = getUserIdFromCookie(req);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Non authentifié" }, { status: 401 });
    }

    await dbConnect();
    const { id } = params;
    
    const projet = await Projet.findOne({ _id: id, userId: userId });
    if (!projet) {
      return NextResponse.json({ success: false, error: "Projet introuvable" }, { status: 404 });
    }

    if (projet.isPaid) {
      return NextResponse.json({ success: false, error: "Projet déjà payé" }, { status: 400 });
    }

    // ✅ Si le projet a déjà un transactionId, le récupérer
    if (projet.transactionId) {
      const existingTx = await Transaction.findById(projet.transactionId);
      if (existingTx && existingTx.paymentUrl) {
        return NextResponse.json({
          success: true,
          paymentUrl: existingTx.paymentUrl,
          useWidget: existingTx.paymentProvider === "kkiapay",
          widgetConfig: existingTx.widgetConfig || null
        });
      }
    }

    // ✅ Préparer les données du kit
    const kitData = {
      title: projet.titre,
      description: projet.description,
      pages: projet.pages,
      chapters: projet.chapters,
      template: projet.template,
      tone: projet.tone,
      audience: projet.audience,
      outline: projet.outline
    };

    // ✅ Appel interne à /api/payments/create
    const paymentRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/payments/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": req.headers.get("cookie") || ""
      },
      body: JSON.stringify({
        kitData: kitData,
        projetId: projet._id.toString()
      })
    });

    const paymentData = await paymentRes.json();

    if (!paymentData.success) {
      return NextResponse.json({ 
        success: false, 
        error: paymentData.message || "Erreur création paiement" 
      }, { status: 500 });
    }

    // ✅ Lier le projet à la transaction créée
    if (paymentData.transactionId) {
      projet.transactionId = paymentData.transactionId;
      await projet.save();
    }

    return NextResponse.json({
      success: true,
      paymentUrl: paymentData.paymentUrl,
      transactionId: paymentData.transactionId,
      useWidget: paymentData.useWidget,
      widgetConfig: paymentData.widgetConfig
    });

  } catch (error) {
    console.error("❌ Erreur create-transaction:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}