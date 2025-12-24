import { NextResponse } from "next/server";
import { jwtVerify } from "jose"; // ✅ Optimisé pour Next.js Edge

export const config = {
  matcher: [
    /*
     * Match toutes les routes sauf :
     * 1. /api (les routes API ont leur propre logique)
     * 2. _next/static, _next/image (fichiers système Next.js)
     * 3. Images, favicons, svg, etc.
     */
    "/((?!api|_next/static|_next/image|_static|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

// ✅ FONCTION DE VÉRIFICATION DE LA SIGNATURE DU TOKEN
async function getVerifiedPayload(token) {
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    // Si le token est invalide ou expiré, on ne bloque pas tout, on renvoie null
    return null;
  }
}

export default async function middleware(req) {
  const { pathname, search } = req.nextUrl;
  
  const hostHeader = req.headers.get("host") || "";
  const hostname = hostHeader.split(":")[0];
  
  // Utilise tes variables .env
  const isDev = process.env.NODE_ENV === 'development';
  const APP_URL = isDev ? "http://localhost:3000" : process.env.NEXT_PUBLIC_APP_URL;

  // ✅ DÉTECTION DU DOMAINE APP (Local ou Production Railway)
  const isAppSubdomain = 
    hostname === "app.bookzy.io" || 
    hostname.startsWith("app-bookzy-starter") || // Pour les domaines temporaires Railway
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

    // 🚩 PRIORITÉ 1 : ONBOARDING / SETUP
    // On autorise toujours l'accès aux étapes d'onboarding
    if (pathname.startsWith("/setup")) {
      return NextResponse.next();
    }

    // 🚩 PRIORITÉ 2 : SÉCURITÉ ADMIN
    if (pathname.startsWith("/admin")) {
      if (!adminPayload || (adminPayload.role !== "admin" && adminPayload.role !== "super_admin")) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
      return NextResponse.next();
    }

    // 🚩 PRIORITÉ 3 : PAGES D'AUTHENTIFICATION (/auth)
    if (pathname.startsWith("/auth")) {
      if (hasValidToken) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return NextResponse.next();
    }

    // 🚩 PRIORITÉ 4 : PAGES PROTÉGÉES (Dashboard)
    if (pathname.startsWith("/dashboard") && !hasValidToken) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("from", pathname); // Pour revenir ici après login
      return NextResponse.redirect(loginUrl);
    }

    // 🚩 PRIORITÉ 5 : LA RACINE (/) DU SOUS-DOMAINE APP
    if (pathname === "/") {
      if (hasValidToken) return NextResponse.redirect(new URL("/dashboard", req.url));
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // 🚩 PRIORITÉ 6 : BLOCAGE DES PAGES MARKETING SUR L'APP
    const forbiddenOnApp = ["/blog", "/tendances", "/niche-hunter", "/legal"];
    if (forbiddenOnApp.some(path => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // 🚩 PRIORITÉ 7 : 404 POUR LES ROUTES INCONNUES SUR L'APP
    const appFolders = ["/auth", "/dashboard", "/admin", "/setup"];
    if (!appFolders.some(folder => pathname.startsWith(folder)) && pathname !== "/") {
      return NextResponse.rewrite(new URL("/404", req.url));
    }

    return NextResponse.next();
  }

  // ============================================================
  // ZONE B : WWW.BOOKZY.IO (MARKETING)
  // ============================================================
  
  // Rediriger les tentatives d'accès aux pages App depuis le site marketing
  const authRoutes = ["/dashboard", "/admin", "/auth", "/setup"];
  if (authRoutes.some(route => pathname.startsWith(route))) {
    // On propulse l'utilisateur vers le domaine APP défini dans APP_URL
    return NextResponse.redirect(new URL(pathname + search, APP_URL));
  }

  // Seules ces pages sont autorisées sur le site marketing
  const marketingAllowed = ["/", "/niche-hunter", "/tendances", "/blog", "/legal", "/sitemap.xml", "/robots.txt"];
  const isMarketingPath = marketingAllowed.some(path => pathname === path || pathname.startsWith(path + "/"));

  if (!isMarketingPath) {
    return NextResponse.rewrite(new URL("/404", req.url));
  }

  return NextResponse.next();
}