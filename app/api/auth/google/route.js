import { NextResponse } from 'next/server';

export async function GET(request) {
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  
  // ✅ HARDCODÉ TEMPORAIREMENT
  const clientId = '1033263723818-a8jrj1bgtqs8jegro77qbpcpam82950t.apps.googleusercontent.com';
  const redirectUri = 'https://app.bookzy.io/api/auth/google/callback';
  
  console.log('🔑 Using hardcoded Client ID');
  console.log('🔗 Redirect URI:', redirectUri);
  
  googleAuthUrl.searchParams.set('client_id', clientId);
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'openid email profile');
  googleAuthUrl.searchParams.set('access_type', 'offline');
  googleAuthUrl.searchParams.set('prompt', 'consent');

  return NextResponse.redirect(googleAuthUrl.toString());
}