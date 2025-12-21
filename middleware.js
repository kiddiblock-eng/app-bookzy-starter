import { NextResponse } from "next/server";

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export default async function middleware(req) {
  const { pathname } = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  console.log(`🌐 ${hostname}${pathname}`);

  // Laisser passer les routes API
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // ============================================================
  // SUBDOMAIN APP : app.bookzy.io + localhost (dev) + Railway
  // ============================================================
  const isAppSubdomain = 
    hostname.includes("app.") ||  // app.bookzy.io
    hostname.startsWith("app-") ||  // ✅ app-bookzy-starter-env.up.railway.app
    (hostname.startsWith("localhost") && (
      pathname.startsWith("/dashboard") || 
      pathname.startsWith("/admin") || 
      pathname.startsWith("/auth")
    ));
  
  if (isAppSubdomain) {
    console.log(`📱 App subdomain (or localhost dashboard)`);

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

    // Si on essaie d'accéder à une page marketing sur app → 404
    if (!isAppPath) {
      console.log(`❌ Marketing page on app subdomain - 404`);
      return NextResponse.rewrite(new URL("/404", req.url));
    }

    // ✅ FIX : Vérifier les tokens AVANT de protéger les routes
    const userToken = req.cookies.get("bookzy_token")?.value;
    const adminToken = req.cookies.get("admin_token")?.value;

    // ✅ FIX : Si sur une page d'auth ET déjà connecté → redirect dashboard
    if (pathname.startsWith("/auth/")) {
      if (userToken || adminToken) {
        console.log(`✅ Already logged in - redirect to dashboard`);
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      // ✅ Sinon laisser passer (afficher la page de login)
      return NextResponse.next();
    }

    // Protection dashboard
    if (pathname.startsWith("/dashboard")) {
      if (!userToken && !adminToken) {
        console.log(`🚫 No token - redirect to login`);
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
    }

    // Protection admin
    if (pathname.startsWith("/admin")) {
      if (!adminToken) {
        console.log(`🚫 No admin token - redirect to admin login`);
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
  console.log(`🌍 Main domain`);

  // Si on essaie d'accéder à dashboard/admin/auth sur www → redirect vers app
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname.startsWith("/auth")) {
    // ✅ FIX : Ne rediriger QUE si on n'est PAS déjà sur app subdomain
    if (!hostname.includes("app.") && !hostname.startsWith("app-") && !hostname.startsWith("localhost")) {
      const appUrl = new URL(req.url);
      appUrl.hostname = hostname.includes("www.") 
        ? hostname.replace("www.", "app.")
        : `app.${hostname}`;
      
      console.log(`↪️ Redirect to ${appUrl.hostname}`);
      return NextResponse.redirect(appUrl);
    }
    // Si déjà sur app subdomain, laisser passer (sera géré par la section app subdomain plus haut)
    return NextResponse.next();
  }

  const marketingPaths = [
    "/",
    "/niche-hunter",
    "/tendances",
    "/blog",
    "/legal",
    "/sitemap.xml",
    "/robots.txt",
  ];

  const isMarketingPath = marketingPaths.some(path => 
    pathname === path || pathname.startsWith(path + "/")
  );

  // Si ce n'est pas une page marketing → 404
  if (!isMarketingPath) {
    console.log(`❌ Unknown page on main domain - 404`);
    return NextResponse.rewrite(new URL("/404", req.url));
  }

  return NextResponse.next();
}