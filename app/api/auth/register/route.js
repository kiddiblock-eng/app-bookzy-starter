export const dynamic = "force-dynamic";
// api/auth/register/route.js

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { Resend } from "resend";
import { welcomeEmailTemplate } from "@/lib/emailTemplates/welcomeEmailTemplate";
import { verifyEmailTemplate } from "@/lib/emailTemplates/verifyEmailTemplate";
// ✅ IMPORT AFFILIATION
import { createAffiliateCode } from "@/utils/affiliation"; 

export async function POST(req) { 
  const resend = new Resend(process.env.RESEND_API_KEY); 

  try {
    await dbConnect();

    // ✅ On récupère aussi "referralCode" s'il est envoyé par le frontend
    const { firstName, lastName, email, password, country, lang, referralCode } = await req.json();

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

    // --- 🚀 LOGIQUE AFFILIATION (START) ---
    
    // A. Générer le code unique pour ce nouvel utilisateur (ex: PAUL-K92)
    const myAffiliateCode = await createAffiliateCode(cleanFirstName);

    // B. Chercher le parrain (S'il vient d'un lien affilié)
    let sponsorId = null;
    
    // On cherche le code soit dans le body (JSON), soit dans les cookies (bookzy_ref)
    const cookieStore = cookies();
    const refCookie = cookieStore.get("bookzy_ref"); // On lira ce cookie
    const codeToFind = referralCode || (refCookie ? refCookie.value : null);

    if (codeToFind) {
      // On cherche qui possède ce code
      const sponsor = await User.findOne({ affiliateCode: codeToFind });
      if (sponsor) {
        sponsorId = sponsor._id; // On a trouvé le parrain !
        console.log(`✅ Parrain trouvé : ${sponsor.firstName} (${sponsor._id}) pour ${cleanEmail}`);
      }
    }
    // --- 🚀 LOGIQUE AFFILIATION (END) ---


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
      emailVerificationSentAt: null,

      // ✅ AJOUT DES CHAMPS AFFILIATION
      affiliateCode: myAffiliateCode, // Son code à lui
      referredBy: sponsorId,          // L'ID de son parrain (ou null)
      wallet: { balance: 0, totalEarned: 0 }
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
          emailVerified: user.emailVerified,
          affiliateCode: user.affiliateCode // On renvoie le code au front si besoin
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