import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
import Activity from "../../../../models/Activity";
import { verifyAdmin } from "../../../../lib/auth";

export async function GET(req) {
  try {
    await dbConnect();

    const { authorized, user } = await verifyAdmin(req);
    if (!authorized)
      return NextResponse.json({ success: false }, { status: 403 });

    const logs = await Activity.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    return NextResponse.json({ success: true, logs });

  } catch (error) {
    console.error("ACTIVITY LIST ERROR:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}