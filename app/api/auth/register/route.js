export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { Resend } from "resend";
import { welcomeEmailTemplate } from "@/lib/emailTemplates/welcomeEmailTemplate";
import { verifyEmailTemplate } from "@/lib/emailTemplates/verifyEmailTemplate";
import { createAffiliateCode } from "@/utils/affiliation";
import crypto from 'crypto'; // ✅ NOUVEAU

export async function POST(req) { 
  const resend = new Resend(process.env.RESEND_API_KEY); 

  try {
    await dbConnect();

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

    // --- LOGIQUE AFFILIATION ---
    const myAffiliateCode = await createAffiliateCode(cleanFirstName);

    let sponsorId = null;
    const cookieStore = cookies();
    const refCookie = cookieStore.get("bookzy_ref");
    const codeToFind = referralCode || (refCookie ? refCookie.value : null);

    if (codeToFind) {
      const sponsor = await User.findOne({ affiliateCode: codeToFind });
      if (sponsor) {
        sponsorId = sponsor._id;
        console.log(`✅ Parrain trouvé : ${sponsor.firstName} (${sponsor._id}) pour ${cleanEmail}`);
      }
    }

    // 3. CRÉATION
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      `${cleanFirstName} ${cleanLastName}`
    )}&background=random&color=fff&bold=true&size=256`;

    const user = await User.create({
      firstName: cleanFirstName,
      lastName: cleanLastName,
      name: `${cleanFirstName} ${cleanLastName}`,
      email: cleanEmail,
      password: password,
      avatar: avatarUrl,
      country: country || "",
      lang: lang || "fr",
      lastLogin: new Date(),
      emailVerified: false,
      emailVerifiedAt: null,
      emailVerificationSentAt: null,
      affiliateCode: myAffiliateCode,
      referredBy: sponsorId,
      wallet: { balance: 0, totalEarned: 0 },
      credits: { balance: 4 } // 4 crédits offerts à l'inscription

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

    // 5. EMAILS
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

    // ✅ 6. FACEBOOK PIXEL - Track CompleteRegistration
    if (process.env.FACEBOOK_ACCESS_TOKEN) {
      try {
        const eventId = `registration_${user._id}_${Date.now()}`;
        
        await fetch(`https://graph.facebook.com/v18.0/9384354691604798/events?access_token=${process.env.FACEBOOK_ACCESS_TOKEN}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: [{
              event_name: 'CompleteRegistration',
              event_id: eventId,
              event_time: Math.floor(Date.now() / 1000),
              event_source_url: 'https://app.bookzy.io',
              user_data: {
                em: crypto.createHash('sha256').update(cleanEmail).digest('hex'),
                fn: crypto.createHash('sha256').update(cleanFirstName.toLowerCase().trim()).digest('hex'),
                ln: crypto.createHash('sha256').update(cleanLastName.toLowerCase().trim()).digest('hex'),
                ct: country ? crypto.createHash('sha256').update(country.toLowerCase().trim()).digest('hex') : null,
              },
              action_source: 'website'
            }]
          })
        });
        console.log(`✅ [Facebook] CompleteRegistration envoyé (event_id: ${eventId})`);
      } catch (fbErr) {
        console.error('❌ [Facebook] Erreur registration pixel:', fbErr.message);
      }
    }

    return NextResponse.json(
      { 
        success: true,
        message: "Compte créé avec succès !",
        user: {
          id: user._id,
          email: user.email,
          emailVerified: user.emailVerified,
          affiliateCode: user.affiliateCode
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