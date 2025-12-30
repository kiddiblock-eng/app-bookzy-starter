import { NextResponse } from 'next/server';

export async function GET(request) {
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.bookzy.io';
  const redirectUri = `${baseUrl}/api/auth/google/callback`;
  
  console.log('🔑 GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Défini ✅' : '❌ MANQUANT');
  console.log('🔗 Redirect URI:', redirectUri);
  
  googleAuthUrl.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID);
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'openid email profile');
  googleAuthUrl.searchParams.set('access_type', 'offline');
  googleAuthUrl.searchParams.set('prompt', 'consent');

  return NextResponse.redirect(googleAuthUrl.toString());
}