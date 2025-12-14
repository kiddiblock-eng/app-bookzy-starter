import { NextResponse } from "next/server";

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export default async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Laisser passer les routes API
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Pages publiques (accessibles sans login)
  const publicPaths = [
    "/",
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/verify-email",
    "/niche-hunter",
    "/tendances",
    "/blog",
    "/legal",
  ];

  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(path + "/")
  );

  // Si page publique → laisser passer
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Protection routes privées (/admin et /dashboard)
  if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
    const userToken = req.cookies.get("bookzy_token")?.value;
    const adminToken = req.cookies.get("admin_token")?.value;

    // Si pas de token → rediriger vers login
    if (!userToken && !adminToken) {
      console.log(`🚫 No token for ${pathname}`);
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Si route admin mais pas de token admin → rediriger vers dashboard
    if (pathname.startsWith("/admin") && !adminToken) {
      console.log(`🚫 Not admin token for ${pathname}`);
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Laisser passer tout le reste
  return NextResponse.next();
}