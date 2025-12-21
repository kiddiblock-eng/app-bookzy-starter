export const dynamic = "force-dynamic";
import { dbConnect } from "@/lib/db";
import Notification from "@/models/Notification";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await dbConnect();

    const cookie = req.headers.get("cookie") || "";
    const token = cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("bookzy_token="))
      ?.split("=")[1];

    if (!token) {
      return new Response(
        JSON.stringify({ success: false, notifications: [] }),
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const notifications = await Notification.find({ userId: decoded.id })
      .sort({ read: 1, createdAt: -1 }) // non lues en haut
      .limit(100);

    return new Response(JSON.stringify({ success: true, notifications }));
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ success: false, notifications: [] }),
      { status: 500 }
    );
  }
}