// app/api/smart-shop/retraits/route.js
// API pour gérer les demandes de retrait

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Shop from "@/models/Shop";
import ShopWithdrawal from "@/models/ShopWithdrawal";
import jwt from "jsonwebtoken";

function getUserIdFromCookie(req) {
  const cookie = req.headers.get("cookie") || "";
  const token = cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("bookzy_token="))
    ?.split("=")[1];

  try {
    return jwt.verify(token, process.env.JWT_SECRET)?.id || null;
  } catch {
    return null;
  }
}

// GET - Historique des retraits
export async function GET(req) {
  try {
    await dbConnect();

    const userId = getUserIdFromCookie(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Vérifier que l'utilisateur a une boutique
    const shop = await Shop.findOne({ userId });
    if (!shop) {
      return NextResponse.json({
        success: true,
        withdrawals: [],
        stats: {
          balance: 0,
          totalWithdrawn: 0,
          pendingWithdrawals: 0,
        },
      });
    }

    // Paramètres de pagination
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;

    // Récupérer les retraits
    const withdrawals = await ShopWithdrawal.find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const totalCount = await ShopWithdrawal.countDocuments({ userId });

    // Stats
    const completedWithdrawals = await ShopWithdrawal.find({
      userId,
      status: "completed",
    }).lean();

    const pendingWithdrawals = await ShopWithdrawal.find({
      userId,
      status: { $in: ["pending", "processing"] },
    }).lean();

    const stats = {
      balance: shop.balance || 0,
      totalWithdrawn: completedWithdrawals.reduce((sum, w) => sum + w.netAmount, 0),
      pendingAmount: pendingWithdrawals.reduce((sum, w) => sum + w.amount, 0),
      pendingCount: pendingWithdrawals.length,
    };

    return NextResponse.json({
      success: true,
      withdrawals,
      stats,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("❌ [Smart Shop] Erreur GET retraits:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Demander un retrait
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

    // Vérifier que l'utilisateur a une boutique
    const shop = await Shop.findOne({ userId });
    if (!shop) {
      return NextResponse.json(
        { success: false, error: "Vous devez d'abord créer votre boutique" },
        { status: 400 }
      );
    }

    const data = await req.json();
    const { amount, paymentMethod, paymentDetails } = data;

    // Validation
    if (!amount || amount < 1000) {
      return NextResponse.json(
        { success: false, error: "Le montant minimum de retrait est de 1 000 FCFA" },
        { status: 400 }
      );
    }

    if (amount > shop.balance) {
      return NextResponse.json(
        { success: false, error: `Solde insuffisant. Votre solde est de ${shop.balance.toLocaleString()} FCFA` },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { success: false, error: "La méthode de paiement est requise" },
        { status: 400 }
      );
    }

    // Vérifier les infos de paiement
    if (paymentMethod !== "bank" && !paymentDetails?.phoneNumber) {
      return NextResponse.json(
        { success: false, error: "Le numéro de téléphone est requis" },
        { status: 400 }
      );
    }

    if (paymentMethod === "bank" && (!paymentDetails?.bankName || !paymentDetails?.bankAccount)) {
      return NextResponse.json(
        { success: false, error: "Les informations bancaires sont requises" },
        { status: 400 }
      );
    }

    // Vérifier qu'il n'y a pas déjà un retrait en attente
    const pendingWithdrawal = await ShopWithdrawal.findOne({
      userId,
      status: { $in: ["pending", "processing"] },
    });

    if (pendingWithdrawal) {
      return NextResponse.json(
        { success: false, error: "Vous avez déjà un retrait en cours de traitement" },
        { status: 400 }
      );
    }

    // Calculer les frais (1% avec minimum 100 FCFA)
    const fees = Math.max(100, Math.round(amount * 0.01));

    // Créer la demande de retrait
    const withdrawal = await ShopWithdrawal.create({
      userId,
      shopId: shop._id,
      amount,
      fees,
      paymentMethod,
      paymentDetails: {
        phoneNumber: paymentDetails?.phoneNumber || "",
        accountName: paymentDetails?.accountName || shop.name,
        bankName: paymentDetails?.bankName || "",
        bankAccount: paymentDetails?.bankAccount || "",
      },
    });

    // Déduire du solde (le solde sera restauré si rejeté)
    shop.balance -= amount;
    await shop.save();

    console.log(`✅ [Smart Shop] Demande de retrait créée: ${withdrawal.reference} - ${amount} FCFA`);

    return NextResponse.json({
      success: true,
      withdrawal,
      message: `Demande de retrait de ${amount.toLocaleString()} FCFA envoyée`,
    });
  } catch (error) {
    console.error("❌ [Smart Shop] Erreur POST retrait:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}