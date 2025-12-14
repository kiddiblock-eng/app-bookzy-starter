import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Notification from "@/models/Notification";
import User from "@/models/User";
import { verifyAdmin } from "@/lib/auth";
import { pushNotificationToClients } from '@/app/api/notifications/stream/route';

export async function POST(req) {
  try {
    await dbConnect();

    const admin = await verifyAdmin(req);
    if (!admin?.authorized) {
      return NextResponse.json(
        { success: false, message: "Non autorisé." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      userId,
      title,
      message,
      type,
      icon,
      color,
      link,
      metadata,
      toAll
    } = body;

    // Champs obligatoires
    if (!title || !message || !type) {
      return NextResponse.json(
        {
          success: false,
          message: "Les champs 'title', 'message' et 'type' sont obligatoires."
        },
        { status: 400 }
      );
    }

    const validTypes = ["admin", "purchase", "ebook_ready", "system"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, message: "Type de notification invalide." },
        { status: 400 }
      );
    }

    // 🔵🔵🔵 1️⃣ ENVOI À TOUS LES UTILISATEURS
    if (toAll === true) {
      const users = await User.find({}, "_id");

      if (users.length === 0) {
        return NextResponse.json(
          { success: false, message: "Aucun utilisateur trouvé." },
          { status: 404 }
        );
      }

      const notifTemplate = {
        type,
        title,
        message,
        icon: icon || "bell",
        color: color || "blue",
        link: link || null,
        metadata: metadata || {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const allNotifs = users.map((u) => ({
        ...notifTemplate,
        userId: u._id,
      }));

      await Notification.insertMany(allNotifs);

      // ⚡ PUSH LIVE (1 seul event pour tout le monde)
      pushNotificationToClients({
        ...notifTemplate,
        read: false,
        broadcast: true, // pour afficher l'étiquette "Tous les utilisateurs"
      });

      return NextResponse.json({
        success: true,
        message: `Notification envoyée à ${users.length} utilisateurs.`,
        history: {
          type,
          title,
          message,
          count: users.length,
          toAll: true,
          createdAt: new Date()
        }
      });
    }

    // 🔴🔴🔴 2️⃣ ENVOI À UN SEUL USER
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId obligatoire pour un envoi ciblé." },
        { status: 400 }
      );
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: "Utilisateur introuvable." },
        { status: 404 }
      );
    }

    const notif = await Notification.create({
      userId,
      type,
      title,
      message,
      icon: icon || "bell",
      color: color || "blue",
      link: link || null,
      metadata: metadata || {},
    });

    // ⚡ PUSH LIVE instantané
    pushNotificationToClients(notif);

    return NextResponse.json({
      success: true,
      message: "Notification envoyée.",
      history: {
        type,
        title,
        message,
        toAll: false,
        recipients: [targetUser.email],
        createdAt: new Date()
      }
    });

  } catch (error) {
    console.error("❌ Erreur API notifications/send:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur." },
      { status: 500 }
    );
  }
}