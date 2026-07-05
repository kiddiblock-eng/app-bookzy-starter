export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Marque le product tour comme vu pour l'utilisateur connecté.
export async function POST() {
  try {
    await dbConnect();
    const token = cookies().get("bookzy_token")?.value;
    if (!token) return NextResponse.json({ success: false }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await User.updateOne({ _id: decoded.id }, { $set: { tourDone: true } });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, message: "Erreur" }, { status: 500 });
  }
}
