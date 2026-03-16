export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";

export async function GET(req) {
  try {
    await dbConnect();

    const user = await getUserFromToken(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Non authentifié" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      credits: {
        balance:        user.credits?.balance        ?? 0,
        totalPurchased: user.credits?.totalPurchased ?? 0,
        totalSpent:     user.credits?.totalSpent     ?? 0,
      },
      plan: user.plan ?? null,
    });

  } catch (error) {
    console.error("❌ [Credits Balance] Erreur:", error.message);
    return NextResponse.json(
      { success: false, message: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}