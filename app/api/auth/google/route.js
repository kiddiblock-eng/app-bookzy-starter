import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const refCode = searchParams.get('ref'); // ✅ NOUVEAU : Lire ?ref=XXX
  
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  
  const clientId = '1033263723818-a8jrj1bgtqs8jegro77qbpcpam82950t.apps.googleusercontent.com';
  const redirectUri = 'https://app.bookzy.io/api/auth/google/callback';
  
  googleAuthUrl.searchParams.set('client_id', clientId);
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'openid email profile');
  googleAuthUrl.searchParams.set('access_type', 'offline');
  googleAuthUrl.searchParams.set('prompt', 'consent');
  googleAuthUrl.searchParams.set('state', refCode || ''); // ✅ NOUVEAU : Passer le code via state

  return NextResponse.redirect(googleAuthUrl.toString());
}