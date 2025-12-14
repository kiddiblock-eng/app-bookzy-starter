import { NextResponse } from "next/server";
import { dbConnect } from "../../../../../../lib/db";
import User from "../../../../../../models/User";
import { verifyAdmin } from "../../../../../../lib/auth";

export async function POST(req) {
  try {
    await dbConnect();

    const { authorized, user } = await verifyAdmin(req);
    if (!authorized) {
      return NextResponse.json(
        { success: false, message: "Non autorisé" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { newEmail } = body;

    if (!newEmail) {
      return NextResponse.json(
        { success: false, message: "Nouvel email manquant" },
        { status: 400 }
      );
    }

    await User.findByIdAndUpdate(user._id, {
      email: newEmail.toLowerCase(),
    });

    return NextResponse.json({
      success: true,
      message: "Email mis à jour",
    });

  } catch (error) {
    console.error("❌ Erreur update-email:", error);
    return NextResponse.json(
      { success: false, message: "Erreur interne" },
      { status: 500 }
    );
  }
}