import { dbConnect } from "../../../../../lib/db";
import Notification from "../../../../../models/Notification";
import { verifyAuth } from "../../../../../lib/auth";

/* ------------------------------------------------------
   GET — Récupérer une notification
------------------------------------------------------ */
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const user = await verifyAuth(req);

    if (!user) {
      return new Response(JSON.stringify({ success: false, message: "Non authentifié" }), {
        status: 401,
      });
    }

    const notif = await Notification.findOne({
      _id: params.id,
      $or: [{ userId: user.id }, { sentToAll: true }],
    });

    if (!notif) {
      return new Response(
        JSON.stringify({ success: false, message: "Notification introuvable" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ success: true, notification: notif }), {
      status: 200,
    });
  } catch (error) {
    console.error("❌ GET notification error:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Erreur serveur" }),
      { status: 500 }
    );
  }
}

/* ------------------------------------------------------
   PATCH — Marquer une notification comme lue
   + tracking des lecteurs
   + compteur
------------------------------------------------------ */
export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    const user = await verifyAuth(req);

    if (!user) {
      return new Response(JSON.stringify({ success: false, message: "Non authentifié" }), {
        status: 401,
      });
    }

    const notif = await Notification.findOne({
      _id: params.id,
      $or: [{ userId: user.id }, { sentToAll: true }],
    });

    if (!notif) {
      return new Response(
        JSON.stringify({ success: false, message: "Notification introuvable" }),
        { status: 404 }
      );
    }

    // 🔵 Ajouter l’utilisateur dans viewers si pas déjà dedans
    const alreadyViewed = notif.viewers?.some((v) => String(v) === String(user.id));

    if (!alreadyViewed) {
      notif.viewers.push(user.id);
      notif.viewsCount = notif.viewsCount + 1;
    }

    // 🔵 Marquer comme lue (si notif personnelle)
    if (!notif.read && String(notif.userId) === String(user.id)) {
      notif.read = true;
      notif.readAt = new Date();
    }

    await notif.save();

    return new Response(JSON.stringify({ success: true, notification: notif }), {
      status: 200,
    });
  } catch (error) {
    console.error("❌ PATCH notification error:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Erreur serveur" }),
      { status: 500 }
    );
  }
}

/* ------------------------------------------------------
   DELETE — Supprimer une notification
------------------------------------------------------ */
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const user = await verifyAuth(req);

    if (!user) {
      return new Response(JSON.stringify({ success: false, message: "Non authentifié" }), {
        status: 401,
      });
    }

    const deleted = await Notification.findOneAndDelete({
      _id: params.id,
      $or: [{ userId: user.id }, { sentToAll: true }],
    });

    if (!deleted) {
      return new Response(
        JSON.stringify({ success: false, message: "Notification introuvable" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Notification supprimée" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ DELETE notification error:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Erreur serveur" }),
      { status: 500 }
    );
  }
}