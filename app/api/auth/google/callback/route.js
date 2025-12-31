export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=no_code`);
    }

    // ✅ Échange du code contre un access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: '1033263723818-a8jrj1bgtqs8jegro77qbpcpam82950t.apps.googleusercontent.com', // ✅ Hardcodé
        client_secret: process.env.GOOGLE_CLIENT_SECRET, // 🔒 Reste en env var
        redirect_uri: 'https://app.bookzy.io/api/auth/google/callback',
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokens.access_token) {
      console.error('❌ Token exchange failed:', tokens);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=token_failed`);
    }

    // ✅ Récupération des infos utilisateur
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const profile = await userInfoResponse.json();

    if (!profile.email) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=no_email`);
    }

    // ✅ Vérifier si l'utilisateur existe
    let user = await User.findOne({ email: profile.email.toLowerCase() });
    let isNewUser = false;

    if (!user) {
      // ✅ Créer un nouvel utilisateur
      isNewUser = true;
      user = new User({
        email: profile.email.toLowerCase(),
        name: profile.name || profile.email.split('@')[0],
        firstName: profile.given_name || profile.name?.split(' ')[0] || '',
        lastName: profile.family_name || profile.name?.split(' ').slice(1).join(' ') || '',
        photo: profile.picture || null,
        authProvider: 'google',
        googleId: profile.id,
        isActive: true,
        emailVerified: true,
      });

      await user.save();
    } else {
      // ✅ Mettre à jour les infos si nécessaire
      if (!user.googleId) {
        user.googleId = profile.id;
        user.authProvider = 'google';
      }
      if (profile.picture && !user.photo) {
        user.photo = profile.picture;
      }
      user.emailVerified = true;
      await user.save();
    }

    // ✅ Ajouter une valeur par défaut pour 'name' si absent
    if (!user.name) {
      user.name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email.split('@')[0];
      await user.save();
    }

    // ✅ Générer le JWT avec 'id' (pas 'userId')
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // ✅ Redirection selon le statut
    const redirectPath = isNewUser ? '/auth/callback-success' : '/dashboard';

    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}${redirectPath}`);

    // ✅ Configuration cookie
    const isProd = process.env.NODE_ENV === 'production';
    const cookieDomain = isProd ? '.bookzy.io' : undefined;

    response.cookies.set('bookzy_token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      domain: cookieDomain,
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('❌ Google OAuth callback error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=server_error`);
  }
}