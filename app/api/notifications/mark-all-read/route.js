import { dbConnect } from "@/lib/db";
import Notification from "@/models/Notification";
import { verifyAuth } from "@/lib/auth";

export async function POST(req) {
  try {
    await dbConnect();
    
    const user = await verifyAuth(req);
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "Non authentifié" }),
        { status: 401 }
      );
    }

    await Notification.updateMany(
      { userId: user.id, read: false },
      { 
        read: true,
        readAt: new Date()
      }
    );

    return new Response(
      JSON.stringify({ success: true, message: "Toutes les notifications marquées comme lues" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Erreur POST mark-all-read:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Erreur serveur" }),
      { status: 500 }
    );
  }
}