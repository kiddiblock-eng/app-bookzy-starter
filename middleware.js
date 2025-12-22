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
  // SUBDOMAIN APP : app.bookzy.io + Railway app subdomain
  // ============================================================
  const isAppSubdomain = 
    hostname === "app.bookzy.io" ||  // ✅ Domaine personnalisé STRICT
    hostname.startsWith("app-bookzy-starter") ||  // ✅ Railway STRICT
    (hostname.startsWith("localhost") && (
      pathname.startsWith("/dashboard") || 
      pathname.startsWith("/admin") || 
      pathname.startsWith("/auth")
    ));
  
  if (isAppSubdomain) {
    console.log(`📱 App subdomain detected: ${hostname}`);

    // ✅ VÉRIFIER LES PAGES MARKETING EN PREMIER (priorité haute)
    const marketingPaths = ["/blog", "/tendances", "/niche-hunter", "/legal"];
    const isMarketingPath = marketingPaths.some(path => pathname.startsWith(path));
    
    if (isMarketingPath) {
      console.log(`↪️ BLOCKED: Marketing page ${pathname} on app → Redirect to /auth/login`);
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // ✅ ENSUITE : Pages AUTORISÉES uniquement sur app (dashboard/auth)
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

    // Si la page n'est ni marketing ni app → 404
    if (!isAppPath) {
      console.log(`❌ Unknown page on app subdomain → 404`);
      return NextResponse.rewrite(new URL("/404", req.url));
    }

    // ✅ Vérifier les tokens
    const userToken = req.cookies.get("bookzy_token")?.value;
    const adminToken = req.cookies.get("admin_token")?.value;

    // Si sur une page d'auth ET déjà connecté → redirect dashboard
    if (pathname.startsWith("/auth/")) {
      if (userToken || adminToken) {
        console.log(`✅ Already logged in - redirect to dashboard`);
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
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
  console.log(`🌍 Main domain detected: ${hostname}`);

  // ✅ Si on essaie d'accéder à dashboard/admin/auth → redirect vers app.bookzy.io
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname.startsWith("/auth")) {
    const appUrl = new URL(req.url);
    
    // ✅ REDIRECT STRICT vers le bon subdomain
    if (hostname === "www.bookzy.io" || hostname === "bookzy.io") {
      appUrl.hostname = "app.bookzy.io";
    } else if (hostname.includes("railway.app")) {
      // Pour Railway, construire le bon subdomain app
      if (hostname.includes("app-bookzy-starter")) {
        // Déjà sur le bon subdomain Railway
        return NextResponse.next();
      }
      // Sinon rediriger vers app-bookzy-starter-env.up.railway.app
      appUrl.hostname = "app-bookzy-starter-env.up.railway.app";
    } else {
      // Autre cas → Ajouter app.
      appUrl.hostname = hostname.includes("www.") 
        ? hostname.replace("www.", "app.")
        : `app.${hostname}`;
    }
    
    console.log(`↪️ Redirect to ${appUrl.hostname}${pathname}`);
    return NextResponse.redirect(appUrl);
  }

  // ✅ Pages AUTORISÉES sur www.bookzy.io (marketing)
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