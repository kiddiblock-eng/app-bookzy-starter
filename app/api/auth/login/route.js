import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
import User from "../../../../models/User";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";

export async function POST(req) {
  try {
    await dbConnect();

    const { email, password, twoFA } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, message: "Compte désactivé. Contactez le support." },
        { status: 403 }
      );
    }

    const valid = await user.comparePassword(password);

    if (!valid) {
      return NextResponse.json(
        { success: false, message: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    // 🔐 2FA ADMIN
    const isAdmin = user.role === "admin" || user.role === "super_admin";

    if (isAdmin && user.security?.twoFAEnabled) {
      if (!twoFA) {
        return NextResponse.json({
          require2FA: true,
          message: "Code 2FA requis",
        });
      }

      const ok = speakeasy.totp.verify({
        secret: user.security.twoFASecret,
        encoding: "base32",
        token: twoFA,
        window: 1,
      });

      if (!ok) {
        return NextResponse.json(
          { success: false, message: "Code 2FA incorrect" },
          { status: 401 }
        );
      }
    }

    // Update login metadata
    const ua = req.headers.get("user-agent") || "";
    user.lastLogin = new Date();
    user.lastDevice = ua;
    await user.save();

    // JWT
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    let redirectTo = "/dashboard";
    if (isAdmin) redirectTo = "/admin";

    const response = NextResponse.json({
      success: true,
      message: "Connexion réussie",
      redirectTo,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      },
    });

    // 🔥 Toujours nettoyer les anciens tokens
    response.cookies.set("admin_token", "", { maxAge: 0 });
    response.cookies.set("bookzy_token", "", { maxAge: 0 });

    // 🔥 Définition du nouveau token
    response.cookies.set(isAdmin ? "admin_token" : "bookzy_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("❌ LOGIN ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}