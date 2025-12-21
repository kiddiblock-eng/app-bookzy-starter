export const dynamic = "force-dynamic";
import { dbConnect } from "@/lib/db";
import Notification from "@/models/Notification";
import { verifyAdmin } from "@/lib/auth";

export async function GET(req) {
  await dbConnect();

  const admin = await verifyAdmin(req);
  if (!admin?.authorized) {
    return new Response(
      JSON.stringify({ success: false, message: "Non autorisé" }),
      { status: 403 }
    );
  }

  // ⚠️ On groupe les notifications identiques
  const history = await Notification.aggregate([
    {
      $group: {
        _id: {
          title: "$title",
          message: "$message",
          type: "$type",
          icon: "$icon",
          color: "$color",
          createdAt: {
            $dateToString: { format: "%Y-%m-%d %H:%M", date: "$createdAt" }
          }
        },
        totalUsers: { $sum: 1 }
      }
    },
    { $sort: { "_id.createdAt": -1 } }
  ]);

  return new Response(
    JSON.stringify({ success: true, history }),
    { status: 200 }
  );
}