// api/auth/verify-email/route.js

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    // Validation token présent
    if (!token) {
      return NextResponse.json(
        { error: "Token manquant." },
        { status: 400 }
      );
    }

    // Vérification du token JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("❌ Erreur JWT verification:", err.message);
      
      if (err.name === 'TokenExpiredError') {
        return NextResponse.json(
          { error: "Le lien a expiré. Demande un nouveau lien de vérification." },
          { status: 401 }
        );
      }
      if (err.name === 'JsonWebTokenError') {
        return NextResponse.json(
          { error: "Lien invalide." },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { error: "Erreur d'authentification." },
        { status: 401 }
      );
    }

    // Recherche utilisateur
    const user = await User.findById(decoded.uid);
    
    if (!user) {
      console.error("❌ Utilisateur introuvable:", decoded.uid);
      return NextResponse.json(
        { error: "Utilisateur introuvable." },
        { status: 404 }
      );
    }

    // Vérifier si déjà vérifié
    if (user.emailVerified) {
      console.log(`ℹ️ Email déjà vérifié pour ${user.email}`);
      return NextResponse.json({
        success: true,
        alreadyVerified: true,
        message: "Email déjà vérifié."
      });
    }

    // Marquer comme vérifié
    user.emailVerified = true;
    user.emailVerifiedAt = new Date();
    await user.save();

    console.log(`✅ Email vérifié avec succès pour ${user.email}`);

    return NextResponse.json({
      success: true,
      message: "Email vérifié avec succès ! Tu peux maintenant profiter de toutes les fonctionnalités."
    });

  } catch (error) {
    console.error("❌ Erreur verify-email:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne." },
      { status: 500 }
    );
  }
}

// Support POST aussi (pour les clients qui ne peuvent pas faire de GET avec fetch)
export async function POST(req) {
  try {
    await dbConnect();
    
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Token manquant." },
        { status: 400 }
      );
    }

    // Vérification du token JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("❌ Erreur JWT verification:", err.message);
      
      if (err.name === 'TokenExpiredError') {
        return NextResponse.json(
          { error: "Le lien a expiré. Demande un nouveau lien de vérification." },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { error: "Lien invalide." },
        { status: 401 }
      );
    }

    const user = await User.findById(decoded.uid);
    
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur introuvable." },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json({
        success: true,
        alreadyVerified: true,
        message: "Email déjà vérifié."
      });
    }

    user.emailVerified = true;
    user.emailVerifiedAt = new Date();
    await user.save();

    console.log(`✅ Email vérifié avec succès pour ${user.email}`);

    return NextResponse.json({
      success: true,
      message: "Email vérifié avec succès !"
    });

  } catch (error) {
    console.error("❌ Erreur verify-email:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne." },
      { status: 500 }
    );
  }
}