import { dbConnect } from "../../../../lib/db";
import Notification from "../../../../models/Notification";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();

    const { id } = await req.json();

    await Notification.updateOne(
      { _id: id },
      { $set: { read: true, readAt: new Date() } }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}