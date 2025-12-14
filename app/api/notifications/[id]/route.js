import { dbConnect } from "@/lib/db";
import Notification from "@/models/Notification";
import { verifyAuth } from "@/lib/auth";

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    
    const user = await verifyAuth(req);
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "Non authentifié" }),
        { status: 401 }
      );
    }

    const { id } = params;

    const notification = await Notification.findOneAndDelete({
      _id: id,
      userId: user.id
    });

    if (!notification) {
      return new Response(
        JSON.stringify({ success: false, message: "Notification non trouvée" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Notification supprimée" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Erreur DELETE notification:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Erreur serveur" }),
      { status: 500 }
    );
  }
}