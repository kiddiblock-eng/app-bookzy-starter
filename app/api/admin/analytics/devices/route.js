export const dynamic = "force-dynamic";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
export async function GET(req) {
  await dbConnect();

  const { authorized } = await verifyAdmin(req);
  if (!authorized) return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 403 });

  const stats = await User.aggregate([
    {
      $group: {
        _id: "$lastDevice",
        count: { $sum: 1 },
      },
    },
  ]);

  const devices = stats.map((d) => ({
    device: d._id || "unknown",
    count: d.count,
  }));

  return NextResponse.json({
    success: true,
    data: devices,
  });
}