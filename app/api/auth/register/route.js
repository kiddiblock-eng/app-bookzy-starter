// api/auth/register/route.js

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { Resend } from "resend";
import { welcomeEmailTemplate } from "@/lib/emailTemplates/welcomeEmailTemplate";
import { verifyEmailTemplate } from "@/lib/emailTemplates/verifyEmailTemplate";

// ⚠️ ON RETIRE L'IMPORT DE BCRYPT ICI CAR LE MODEL S'EN OCCUPE
// import bcrypt from "bcryptjs"; 

// const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    await dbConnect();

    const { firstName, lastName, email, password, country, lang } = await req.json();

    // 1. NETTOYAGE
    const cleanEmail = email.trim().toLowerCase();
    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();

    // 2. VÉRIFICATION
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return NextResponse.json(
        { error: "Cet e-mail est déjà utilisé." },
        { status: 400 }
      );
    }

    // 3. CRÉATION (SANS HACHAGE MANUEL)
    
    // Avatar auto
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      `${cleanFirstName} ${cleanLastName}`
    )}&background=random&color=fff&bold=true&size=256`;

    // 🔥 ICI : On passe "password" en clair. 
    // Le middleware "pre('save')" de ton User.js va le hasher automatiquement !
    const user = await User.create({
      firstName: cleanFirstName,
      lastName: cleanLastName,
      name: `${cleanFirstName} ${cleanLastName}`,
      email: cleanEmail,
      password: password, // <--- EN CLAIR ICI (Le model va le crypter)
      avatar: avatarUrl,
      country: country || "",
      lang: lang || "fr",
      lastLogin: new Date(),
      emailVerified: false,
      emailVerifiedAt: null,
      emailVerificationSentAt: null
    });

    // 4. JWT & COOKIES
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    cookies().set("bookzy_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    // 5. EMAILS (Welcome + Verify)
    try {
      const htmlWelcome = welcomeEmailTemplate({
        firstName: user.firstName
      });
      await resend.emails.send({
        from: "Bookzy <no-reply@bookzy.io>",
        to: user.email,
        subject: "🎉 Bienvenue sur Bookzy !",
        html: htmlWelcome
      });
    } catch (e) { console.error("Welcome email error", e); }

    try {
      const verifyToken = jwt.sign(
        { uid: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      const verifyLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${verifyToken}`;
      const htmlVerify = verifyEmailTemplate({
        firstName: user.firstName,
        verifyLink: verifyLink
      });
      await resend.emails.send({
        from: "Bookzy <no-reply@bookzy.io>",
        to: user.email,
        subject: "✉️ Vérifie ton email Bookzy",
        html: htmlVerify
      });
      user.emailVerificationSentAt = new Date();
      await user.save();
    } catch (e) { console.error("Verify email error", e); }

    return NextResponse.json(
      { 
        success: true,
        message: "Compte créé avec succès !",
        user: {
          id: user._id,
          email: user.email,
          emailVerified: user.emailVerified
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("❌ Erreur inscription:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne." },
      { status: 500 }
    );
  }
}