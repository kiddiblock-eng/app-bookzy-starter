import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import { dbConnect } from "../../../../lib/db";
import UserActivity from "../../../../models/UserActivity";
import Activity from "../../../../models/Activity";

export async function POST(req) {
  try {
    await dbConnect();

    // Récupérer le token (user ou admin)
    const cookieStore = cookies();
    const token = cookieStore.get("bookzy_token")?.value 
      || cookieStore.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json({ success: false });
    }

    // Vérifier le JWT
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json({ success: false });
    }

    const userId = payload.id;

    // Infos du client
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "0.0.0.0";
    const userAgent = req.headers.get("user-agent") || "unknown";

    // ➤ 1 — Mettre à jour la dernière activité
    await UserActivity.findOneAndUpdate(
      { userId },
      {
        $set: {
          lastSeen: new Date(),
          ip,
          userAgent,
        },
      },
      { upsert: true }
    );

    // ➤ 2 — Ajouter un vrai log d'activité pour remplir la timeline
    await Activity.create({
      userId,
      type: "heartbeat",
      message: "Utilisateur actif sur la plateforme",
      ip,
      userAgent,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("❌ Erreur activity/track :", error);
    return NextResponse.json({ success: false });
  }
}