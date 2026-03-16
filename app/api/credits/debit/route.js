import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { checkCredits } from "@/middleware/checkCredits";

export async function POST(req) {
  try {
    await dbConnect();

    const { action } = await req.json();
    if (!action) return NextResponse.json({ success: false, message: "Action requise" }, { status: 400 });

    const { user, error } = await checkCredits(req, action);
    if (error) return error;

    await user.spendCredits(action);

    return NextResponse.json({
      success: true,
      balance: user.credits.balance,
    });

  } catch (e) {
    console.error("[credits/debit]", e);
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}