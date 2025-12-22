import { NextResponse } from "next/server";

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

// ✅ Log conditionnel (seulement en dev)
const log = (...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
};

export default async function middleware(req) {
  const { pathname } = req.nextUrl;
  const hostname = req.headers.get("host") || "";
  const isDev = process.env.NODE_ENV === 'development';

  log(`🌐 ${hostname}${pathname}`);

  // Laisser passer les routes API
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // ============================================================
  // SUBDOMAIN APP : app.bookzy.io + localhost (dev uniquement)
  // ============================================================
  const isLocalhost = hostname.startsWith("localhost") || hostname.startsWith("127.0.0.1");
  
  const isAppSubdomain = hostname.includes("app.") || 
    (isDev && isLocalhost && (
      pathname.startsWith("/dashboard") || 
      pathname.startsWith("/admin") || 
      pathname.startsWith("/auth")
    ));
  
  if (isAppSubdomain) {
    log(`📱 App subdomain (or localhost dashboard)`);

    // Pages autorisées sur app.bookzy.io
    const appAllowedPaths = [
      "/",
      "/auth/login",
      "/auth/register",
      "/auth/forgot-password",
      "/auth/reset-password",
      "/auth/verify-email",
      "/dashboard",
      "/admin",
    ];

    const isAppPath = appAllowedPaths.some(path => pathname.startsWith(path));

    // Si on essaie d'accéder à une page marketing sur app → redirect login
    if (!isAppPath) {
      log(`❌ Marketing page on app subdomain - redirect to login`);
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Vérifier les tokens
    const userToken = req.cookies.get("bookzy_token")?.value;
    const adminToken = req.cookies.get("admin_token")?.value;

    // Si sur une page d'auth ET déjà connecté → redirect dashboard
    if (pathname.startsWith("/auth/")) {
      if (userToken || adminToken) {
        log(`✅ Already logged in - redirect to dashboard`);
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return NextResponse.next();
    }

    // Protection dashboard
    if (pathname.startsWith("/dashboard")) {
      if (!userToken && !adminToken) {
        log(`🚫 No token - redirect to login`);
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
    }

    // Protection admin
    if (pathname.startsWith("/admin")) {
      if (!adminToken) {
        log(`🚫 No admin token - redirect to admin login`);
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
    }

    // Racine de app.bookzy.io → redirect selon état de connexion
    if (pathname === "/") {
      if (userToken || adminToken) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      } else {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
    }

    return NextResponse.next();
  }

  // ============================================================
  // DOMAINE PRINCIPAL : www.bookzy.io ou bookzy.io
  // ============================================================
  log(`🌍 Main domain`);

  // Si on essaie d'accéder à dashboard/admin/auth sur www → redirect vers app
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname.startsWith("/auth")) {
    // ✅ FIX : URL correcte selon environnement
    const appBaseUrl = isDev ? 'http://localhost:3000' : 'https://app.bookzy.io';
    const targetUrl = new URL(pathname + req.nextUrl.search, appBaseUrl);
    
    log(`↪️ Redirect to ${targetUrl.href}`);
    return NextResponse.redirect(targetUrl);
  }

  const marketingPaths = [
    "/",
    "/niche-hunter",
    "/tendances",
    "/blog",
    "/legal",
     "/sitemap.xml",    // ← AJOUTE
  "/robots.txt",     // ← AJOUTE
  ];


  const isMarketingPath = marketingPaths.some(path => 
    pathname === path || pathname.startsWith(path + "/")
  );

  // Si ce n'est pas une page marketing → 404
  if (!isMarketingPath) {
    log(`❌ Unknown page on main domain - 404`);
    return NextResponse.rewrite(new URL("/404", req.url));
  }

  return NextResponse.next();
}