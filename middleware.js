import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|_static|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

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
  const isDev = process.env.NODE_ENV === 'development';
  const APP_URL = isDev ? "http://localhost:3000" : process.env.NEXT_PUBLIC_APP_URL;

  // 1. DÉFINITION DES HEADERS CORS (Pour éviter l'erreur de tes captures)
  const origin = req.headers.get("origin") || "";
  const allowedOrigins = [APP_URL, "https://www.bookzy.io", "https://bookzy.io"];
  
  const response = NextResponse.next();

  if (allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }

  const isAppSubdomain = 
    hostname === "app.bookzy.io" || 
    hostname.startsWith("app-bookzy-starter") ||
    (isDev && (hostname === "localhost" || hostname === "127.0.0.1"));

  // ============================================================
  // ZONE A : APP.BOOKZY.IO (L'APPLICATION)
  // ============================================================
  if (isAppSubdomain) {
    const userToken = req.cookies.get("bookzy_token")?.value;
    const adminToken = req.cookies.get("admin_token")?.value;
    const userPayload = await getVerifiedPayload(userToken);
    const adminPayload = await getVerifiedPayload(adminToken);
    const hasValidToken = !!(userPayload || adminPayload);

    if (pathname.startsWith("/setup")) return NextResponse.next();

    if (pathname.startsWith("/admin")) {
      if (!adminPayload || (adminPayload.role !== "admin" && adminPayload.role !== "super_admin")) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
      return NextResponse.next();
    }

    if (pathname.startsWith("/auth")) {
      if (hasValidToken) return NextResponse.redirect(new URL("/dashboard", req.url));
      return NextResponse.next();
    }

    if (pathname.startsWith("/dashboard") && !hasValidToken) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (pathname === "/") {
      if (hasValidToken) return NextResponse.redirect(new URL("/dashboard", req.url));
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    const forbiddenOnApp = ["/blog", "/tendances", "/niche-hunter", "/legal"];
    if (forbiddenOnApp.some(path => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    const appFolders = ["/auth", "/dashboard", "/admin", "/setup"];
    if (!appFolders.some(folder => pathname.startsWith(folder)) && pathname !== "/") {
      return NextResponse.rewrite(new URL("/404", req.url));
    }

    return response;
  }

  // ============================================================
  // ZONE B : MARKETING (www.bookzy.io)
  // ============================================================
  const authRoutes = ["/dashboard", "/admin", "/auth", "/setup"];
  if (authRoutes.some(route => pathname.startsWith(route))) {
    // 🚩 On utilise une redirection 307 (Temporary Redirect) pour mieux gérer le CORS
    return NextResponse.redirect(new URL(pathname + search, APP_URL), { status: 307 });
  }

  return response;
}