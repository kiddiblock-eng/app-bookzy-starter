export const dynamic = "force-dynamic";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
export async function GET() {
  await dbConnect();

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