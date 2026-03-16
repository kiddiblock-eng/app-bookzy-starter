export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Transaction from "@/models/Transaction";
import Projet from "@/models/Projet";
import User from "@/models/User";
import Settings from "@/models/settings";
import MonerooProvider from "@/lib/payment/providers/MonerooProvider";
import jwt from "jsonwebtoken";
import crypto from "crypto";

function getUserIdFromCookie(req) {
  const cookie = req.headers.get("cookie") || "";
  const token = cookie.split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("bookzy_token="))
    ?.split("=")[1];
  
  try {
    return jwt.verify(token, process.env.JWT_SECRET)?.id || null;
  } catch {
    return null;
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    
    const userId = getUserIdFromCookie(req);
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      );
    }
    
    const { projetId, titre } = await req.json();
    
    if (!projetId) {
      return NextResponse.json(
        { success: false, error: "ProjetId manquant" },
        { status: 400 }
      );
    }
    
    // Vérifier que le projet existe
    const projet = await Projet.findById(projetId);
    
    if (!projet) {
      return NextResponse.json(
        { success: false, error: "Projet introuvable" },
        { status: 404 }
      );
    }
    
    // Vérifier que le projet appartient à l'user
    if (projet.userId.toString() !== userId) {
      return NextResponse.json(
        { success: false, error: "Non autorisé" },
        { status: 403 }
      );
    }
    
    // Charger l'utilisateur
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Utilisateur introuvable" },
        { status: 404 }
      );
    }
    
    console.log(`💰 [Express Payment] Init pour user ${user.email}`);
    
    // Charger les settings de paiement
    const settings = await Settings.findOne({ key: "global" }).lean();
    const monerooConfig = settings?.payment?.moneroo;
    
    if (!monerooConfig?.apiKey) {
      return NextResponse.json(
        { success: false, error: "Moneroo non configuré" },
        { status: 500 }
      );
    }
    
    const provider = new MonerooProvider(monerooConfig);
    
    // ✅ CALCUL PRIX DYNAMIQUE - 5 IA INCLUSES
    const BASE_PRICE = 1000; // Prix de base Express
    const AI_IMPROVEMENTS_USED = projet.aiImprovementsUsed || 0;
    const AI_INCLUDED = projet.aiIncluded || 5; // ✅ 5 incluses par défaut
    const AI_EXTRA_USED = Math.max(0, AI_IMPROVEMENTS_USED - AI_INCLUDED);
    const AI_EXTRA_COST = AI_EXTRA_USED * 50; // 50 FCFA par amélioration supplémentaire
    const TOTAL_PRICE = BASE_PRICE + AI_EXTRA_COST;
    
    console.log(`💰 [Express Payment] Calcul prix:`);
    console.log(`   - Prix de base: ${BASE_PRICE} FCFA`);
    console.log(`   - Améliorations IA utilisées: ${AI_IMPROVEMENTS_USED}`);
    console.log(`   - Améliorations IA incluses: ${AI_INCLUDED}`);
    console.log(`   - Améliorations IA supplémentaires: ${AI_EXTRA_USED}`);
    console.log(`   - Coût IA supplémentaire: ${AI_EXTRA_COST} FCFA`);
    console.log(`   - TOTAL À PAYER: ${TOTAL_PRICE} FCFA`);
    
    // Mettre à jour le projet avec le coût final
    projet.aiExtraCost = AI_EXTRA_COST;
    await projet.save();
    
    const CURRENCY = "XOF";
    
    // Créer la transaction
    const internalId = `EXP_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
    
    const transaction = await Transaction.create({
      userId,
      internalId,
      provider: "moneroo",
      amount: TOTAL_PRICE, // ✅ Prix dynamique
      currency: CURRENCY,
      status: "pending",
      purpose: "express_formatting",
      projetId: projet._id,
      kitData: {
        title: titre,
        template: projet.template,
        expressMode: true,
        aiImprovementsUsed: AI_IMPROVEMENTS_USED,
        aiIncluded: AI_INCLUDED,
        aiExtraUsed: AI_EXTRA_USED,
        aiExtraCost: AI_EXTRA_COST,
        basePrice: BASE_PRICE,
        totalPrice: TOTAL_PRICE
      }
    });
    
    console.log(`✅ [Express Payment] Transaction créée: ${transaction._id}`);
    
    // Créer le paiement Moneroo
    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/projets`;
    
    // Description avec détail si IA supplémentaire
    let description = `Bookzy Express - ${titre}`;
    if (AI_EXTRA_USED > 0) {
      description += ` (+${AI_EXTRA_USED} amélioration${AI_EXTRA_USED > 1 ? 's' : ''} IA)`;
    }
    
    const paymentResult = await provider.createPayment({
      amount: TOTAL_PRICE, // ✅ Prix dynamique
      currency: CURRENCY,
      customerEmail: user.email,
      customerName: user.firstName || user.nom || "Client Bookzy",
      customerPhone: user.telephone || "",
      description,
      returnUrl,
      userId: userId,
      projetId: projet._id.toString(),
      transactionId: transaction._id.toString()
    });
    
    if (!paymentResult.success) {
      throw new Error("Erreur création paiement Moneroo");
    }
    
    // Mettre à jour la transaction
    transaction.providerTransactionId = paymentResult.transactionId;
    transaction.paymentUrl = paymentResult.paymentUrl;
    await transaction.save();
    
    console.log(`✅ [Express Payment] Paiement Moneroo créé (${TOTAL_PRICE} FCFA)`);
    
    return NextResponse.json({
      success: true,
      paymentUrl: paymentResult.paymentUrl,
      transactionId: transaction._id.toString(),
      pricing: {
        basePrice: BASE_PRICE,
        aiImprovementsUsed: AI_IMPROVEMENTS_USED,
        aiIncluded: AI_INCLUDED,
        aiExtraUsed: AI_EXTRA_USED,
        aiExtraCost: AI_EXTRA_COST,
        totalPrice: TOTAL_PRICE
      }
    });
    
  } catch (error) {
    console.error("❌ [Express Payment] Erreur:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}