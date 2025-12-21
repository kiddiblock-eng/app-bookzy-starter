export const dynamic = "force-dynamic";
import { dbConnect } from "@/lib/db";
import Notification from "@/models/Notification";
import { verifyAuth } from "@/lib/auth";

export async function GET(req) {
  try {
    await dbConnect();

    const user = await verifyAuth(req);
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "Non authentifié" }),
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit")) || 20;
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    /* --------------------------------------------------------
       🔍 Récupère deux types de notifs :
        1. Celles envoyées à cet user (userId == user.id)
        2. Celles envoyées à tout le monde (sentToAll == true)
    -------------------------------------------------------- */
    const baseQuery = {
      $or: [
        { userId: user.id },
        { sentToAll: true }
      ]
    };

    // Filtre si seulement les non lues
    if (unreadOnly) {
      baseQuery.read = false;
    }

    const notifications = await Notification.find(baseQuery)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    /* --------------------------------------------------------
       🔢 Compter les NON LUES pour cet user uniquement
    -------------------------------------------------------- */
    const unreadCount = await Notification.countDocuments({
      $or: [
        { userId: user.id, read: false },
        { sentToAll: true, read: false }
      ]
    });

    /* --------------------------------------------------------
       🟣 Ajouter info viewerCount + hasViewed pour le user
    -------------------------------------------------------- */
    const enhanced = notifications.map((n) => ({
      ...n,
      viewerCount: n?.viewsCount || 0,
      hasViewed: n?.viewers?.includes(user.id) || false
    }));

    return new Response(
      JSON.stringify({
        success: true,
        notifications: enhanced,
        unreadCount
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Erreur GET notifications:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Erreur serveur" }),
      { status: 500 }
    );
  }
}