import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  try {
    await dbConnect();

    const cookieStore = cookies();
    const token = cookieStore.get("bookzy_token")?.value;
    if (!token) return NextResponse.json({ success: false }, { status: 401 });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    await User.findByIdAndUpdate(decoded.id, {
      whatsNewSeenAt: new Date()
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}