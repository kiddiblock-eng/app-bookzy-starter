export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import User from "@/models/User";
import { verifyAdmin } from "@/lib/auth";

export async function GET(req) {
  try {
    const { authorized, user } = await verifyAdmin(req);
    if (!authorized) {
      return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 403 });
    }

    const dbUser = await User.findById(user._id).lean();

    return NextResponse.json({
      success: true,
      account: dbUser
    });

  } catch (err) {
    console.error("Erreur GET account:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { authorized, user } = await verifyAdmin(req);
    if (!authorized) {
      return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 403 });
    }

    const body = await req.json();
    const dbUser = await User.findById(user._id);

    // update email
    if (body.email) dbUser.email = body.email;

    // update password
    if (body.currentPassword && body.newPassword) {
      const match = await dbUser.comparePassword(body.currentPassword);
      if (!match) {
        return NextResponse.json({ success: false, message: "Mot de passe actuel incorrect" }, { status: 400 });
      }
      dbUser.password = body.newPassword;
    }

    // update 2FA
    if (body.twoFA) {
      dbUser.security.twoFAEnabled = body.twoFA.enabled;
      dbUser.security.twoFAMethod = body.twoFA.method;
      dbUser.security.twoFAPhone = body.twoFA.phone;
    }

    await dbUser.save();

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Erreur POST account:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}