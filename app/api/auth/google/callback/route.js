import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  console.log('🔵 Callback reçu avec code:', code ? 'OUI' : 'NON');

  if (!code) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=no_code`);
  }

  try {
    // 1. Échanger le code contre un access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenResponse.json();
    console.log('🔵 Tokens reçus:', tokens);

    if (!tokens.access_token) {
      throw new Error('No access token received');
    }

    // 2. Récupérer les infos utilisateur de Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const googleUser = await userInfoResponse.json();
    console.log('🔵 User Google:', googleUser.email);

    // 3. Créer ou récupérer l'utilisateur dans MongoDB
    await dbConnect();

    let user = await User.findOne({ email: googleUser.email });
    let isNewUser = false;

    if (!user) {
      // Créer un nouvel utilisateur
      user = await User.create({
        email: googleUser.email,
        firstName: googleUser.given_name || '',
        lastName: googleUser.family_name || '',
        name: googleUser.name || `${googleUser.given_name} ${googleUser.family_name}`,
        emailVerified: true,
        authProvider: 'google',
        googleId: googleUser.id,
        avatar: googleUser.picture,
      });

      isNewUser = true;
      console.log('✅ Nouvel utilisateur Google créé:', user.email);
    } else if (!user.googleId) {
      // Lier le compte Google à un compte existant
      user.googleId = googleUser.id;
      user.authProvider = 'google';
      user.emailVerified = true;
      if (googleUser.picture && !user.avatar) {
        user.avatar = googleUser.picture;
      }
      await user.save();

      console.log('✅ Compte Google lié à:', user.email);
    } else {
      console.log('✅ Utilisateur Google existant connecté:', user.email);
    }

    // 4. Créer un JWT pour la session
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 5. Déterminer la redirection
    // ✅ CORRECTION : SEULEMENT les nouveaux users vont au setup
    const redirectPath = isNewUser ? '/auth/callback-success' : '/dashboard';

    console.log('🔵 isNewUser:', isNewUser);
    console.log('🔵 Redirection vers:', redirectPath);

    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}${redirectPath}`);
    
    // 6. Créer le cookie de session
    response.cookies.set('bookzy_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: '/',
    });

    console.log('✅ Cookie créé et redirection effectuée');
    return response;

  } catch (error) {
    console.error('❌ Erreur OAuth Google:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=oauth_failed`);
  }
}