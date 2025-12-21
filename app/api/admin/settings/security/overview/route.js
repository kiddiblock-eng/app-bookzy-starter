export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import UserActivity from "@/models/UserActivity";
import { verifyAdmin } from "@/lib/auth";

export async function GET(req) {
  try {
    await dbConnect();

    const { authorized, user } = await verifyAdmin(req);
    if (!authorized || !user?._id) {
      return NextResponse.json(
        { success: false, message: "Non autorisé" },
        { status: 403 }
      );
    }

    const admin = await User.findById(user._id).select(
      "name email role security lastLogin createdAt"
    );

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin introuvable" },
        { status: 404 }
      );
    }

    const activity = await UserActivity.findOne({ userId: admin._id }).select(
      "lastSeen ip userAgent updatedAt"
    );

    return NextResponse.json({
      success: true,
      security: {
        name: admin.name,
        email: admin.email,
        role: admin.role,
        twoFAEnabled: admin.security?.twoFAEnabled || false,
        twoFAMethod: admin.security?.twoFAMethod || "none",
        lastLogin: admin.lastLogin,
        accountCreatedAt: admin.createdAt,
        activity: activity
          ? {
              lastSeen: activity.lastSeen,
              ip: activity.ip,
              userAgent: activity.userAgent,
              updatedAt: activity.updatedAt,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("❌ Erreur GET /admin/settings/security/overview :", error);
    return NextResponse.json(
      { success: false, message: "Erreur interne" },
      { status: 500 }
    );
  }
}