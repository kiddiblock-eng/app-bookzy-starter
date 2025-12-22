import { NextResponse } from "next/server";

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export default async function middleware(req) {
  const { pathname, search } = req.nextUrl;
  
  // ✅ NORMALISATION DU HOSTNAME (enlève le port :443, :8080, etc.)
  const hostHeader = req.headers.get("host") || "";
  const hostname = hostHeader.split(":")[0];
  const isDev = process.env.NODE_ENV === 'development';

  // ✅ DÉFINITION DES ZONES (FIX Railway)
  const isAppSubdomain = 
    hostname === "app.bookzy.io" || 
    hostname.startsWith("app-bookzy-starter") ||  // ← FIX Railway
    (isDev && hostname.startsWith("localhost"));
  
  const APP_URL = isDev ? "http://localhost:3000" : "https://app.bookzy.io";

  // ============================================================
  // ZONE A : APP.BOOKZY.IO
  // ============================================================
  if (isAppSubdomain) {
    // 🚩 BLOCAGE MARKETING (Priorité haute)
    const marketingPaths = ["/blog", "/tendances", "/niche-hunter", "/legal"];
    if (marketingPaths.some(path => pathname.startsWith(path))) {
      console.log(`🚫 BLOCKED: ${pathname} → /auth/login`);
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // 🔐 GESTION TOKENS
    const userToken = req.cookies.get("bookzy_token")?.value;
    const adminToken = req.cookies.get("admin_token")?.value;
    const hasToken = userToken || adminToken;

    // Pages autorisées
    const appFolders = ["/auth", "/dashboard", "/admin"];
    const isAppFolder = appFolders.some(folder => pathname.startsWith(folder));

    // 404 pour pages inconnues
    if (pathname !== "/" && !isAppFolder) {
      return NextResponse.rewrite(new URL("/404", req.url));
    }

    // Protection dashboard/admin
    if (!hasToken && (pathname.startsWith("/dashboard") || pathname.startsWith("/admin"))) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Déjà connecté → dashboard
    if (hasToken && pathname.startsWith("/auth")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Racine app.bookzy.io/
    if (pathname === "/") {
      return hasToken 
        ? NextResponse.redirect(new URL("/dashboard", req.url))
        : NextResponse.redirect(new URL("/auth/login", req.url));
    }

    return NextResponse.next();
  }

  // ============================================================
  // ZONE B : WWW.BOOKZY.IO (MARKETING)
  // ============================================================
  
  // Redirection vers app subdomain
  const authRoutes = ["/dashboard", "/admin", "/auth"];
  if (authRoutes.some(route => pathname.startsWith(route))) {
    const targetUrl = new URL(pathname + search, APP_URL);
    console.log(`↪️ Redirect to ${targetUrl.href}`);
    return NextResponse.redirect(targetUrl);
  }

  // Pages marketing autorisées
  const marketingAllowed = [
    "/", 
    "/niche-hunter", 
    "/tendances", 
    "/blog", 
    "/legal", 
    "/sitemap.xml", 
    "/robots.txt"
  ];
  
  const isMarketingPath = marketingAllowed.some(path => 
    pathname === path || pathname.startsWith(path + "/")
  );

  if (!isMarketingPath) {
    return NextResponse.rewrite(new URL("/404", req.url));
  }

  return NextResponse.next();
}