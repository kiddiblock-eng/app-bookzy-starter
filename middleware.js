import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export const config = {
  matcher: [
    /*
     * Match toutes les routes sauf les fichiers statiques (images, etc.)
     */
    "/((?!api|_next/static|_next/image|_static|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

// ✅ FONCTION DE VÉRIFICATION DU TOKEN
async function getVerifiedPayload(token) {
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    return null;
  }
}

export default async function middleware(req) {
  const { pathname, search } = req.nextUrl;
  const hostHeader = req.headers.get("host") || "";
  const hostname = hostHeader.split(":")[0];
  const origin = req.headers.get("origin") || "";
  
  const isDev = process.env.NODE_ENV === 'development';
  const APP_URL = isDev ? "http://localhost:3000" : process.env.NEXT_PUBLIC_APP_URL;

  // 1. DÉTECTION DU DOMAINE
  const isAppSubdomain = 
    hostname === "app.bookzy.io" || 
    hostname.startsWith("app-bookzy-starter") ||
    (isDev && (hostname === "localhost" || hostname === "127.0.0.1"));

  let response;

  // ============================================================
  // ZONE A : APP.BOOKZY.IO (L'APPLICATION)
  // ============================================================
  if (isAppSubdomain) {
    const userToken = req.cookies.get("bookzy_token")?.value;
    const adminToken = req.cookies.get("admin_token")?.value;
    const userPayload = await getVerifiedPayload(userToken);
    const adminPayload = await getVerifiedPayload(adminToken);
    const hasValidToken = !!(userPayload || adminPayload);

    // Priorité Onboarding
    if (pathname.startsWith("/setup")) {
      response = NextResponse.next();
    } 
    // Sécurité Admin
    else if (pathname.startsWith("/admin")) {
      if (!adminPayload || (adminPayload.role !== "admin" && adminPayload.role !== "super_admin")) {
        response = NextResponse.redirect(new URL("/auth/login", req.url));
      } else {
        response = NextResponse.next();
      }
    } 
    // Pages d'Auth (Redirige vers Dashboard si déjà connecté)
    else if (pathname.startsWith("/auth")) {
      response = hasValidToken 
        ? NextResponse.redirect(new URL("/dashboard", req.url)) 
        : NextResponse.next();
    } 
    // Protection Dashboard
    else if (pathname.startsWith("/dashboard") && !hasValidToken) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      response = NextResponse.redirect(loginUrl);
    } 
    // Racine de l'App
    else if (pathname === "/") {
      response = hasValidToken 
        ? NextResponse.redirect(new URL("/dashboard", req.url)) 
        : NextResponse.redirect(new URL("/auth/login", req.url));
    } 
    // Sécurité : Interdire le marketing sur l'App
    else {
      const forbiddenOnApp = ["/blog", "/tendances", "/niche-hunter", "/legal"];
      if (forbiddenOnApp.some(path => pathname.startsWith(path))) {
        response = NextResponse.redirect(new URL("/auth/login", req.url));
      } else {
        response = NextResponse.next();
      }
    }
  } 
  // ============================================================
  // ZONE B : MARKETING (www.bookzy.io ou bookzy.io)
  // ============================================================
  else {
    const authRoutes = ["/dashboard", "/admin", "/auth", "/setup"];
    if (authRoutes.some(route => pathname.startsWith(route))) {
      // 🚩 Utilisation de 307 pour une redirection propre qui conserve les headers
      response = NextResponse.redirect(new URL(pathname + search, APP_URL), { status: 307 });
    } else {
      // ✅ ICI : On laisse passer /tendances et /niche-hunter librement
      response = NextResponse.next();
    }
  }

  // ============================================================
  // GESTION DU CORS (Corrige tes erreurs de console)
  // ============================================================
  const allowedOrigins = [APP_URL, "https://www.bookzy.io", "https://bookzy.io"];
  
  if (allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, x-nextjs-data, x-rsc, x-nextjs-rsc");
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }

  return response;
}