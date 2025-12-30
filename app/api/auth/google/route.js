import { NextResponse } from 'next/server';

export async function GET(request) {
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  
  // ✅ Fallback si NEXT_PUBLIC_APP_URL n'est pas défini
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.bookzy.io';
  const redirectUri = `${baseUrl}/api/auth/google/callback`;
  
  googleAuthUrl.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID);
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'openid email profile');
  googleAuthUrl.searchParams.set('access_type', 'offline');
  googleAuthUrl.searchParams.set('prompt', 'consent');

  console.log('🔗 Google OAuth Redirect URI:', redirectUri); // ✅ Debug log

  return NextResponse.redirect(googleAuthUrl.toString());
}