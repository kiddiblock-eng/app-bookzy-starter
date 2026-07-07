export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";

// Marque le product tour comme vu pour l'utilisateur connecté.
export async function POST() {
  try {
    const user = await getUserFromToken();
    if (!user) return NextResponse.json({ success: false }, { status: 401 });

    user.tourDone = true;
    await user.save();

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("❌ [tour-done]", e);
    return NextResponse.json({ success: false, message: "Erreur" }, { status: 500 });
  }
}
