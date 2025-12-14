import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

// 🔒 RATE LIMITING
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; 
const MAX_REQUESTS = 150; 

function checkRateLimit(ip) {
  const now = Date.now();
  const userRequests = rateLimitMap.get(ip) || [];
  const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);
  if (recentRequests.length >= MAX_REQUESTS) return false;
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return true;
}

// Nettoyage Map
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, requests] of rateLimitMap.entries()) {
      if (requests.filter(time => now - time < RATE_LIMIT_WINDOW).length === 0) {
        rateLimitMap.delete(ip);
      }
    }
  }, 5 * 60 * 1000);
}

export default async function middleware(req) {
  const url = req.nextUrl;
  const { pathname } = url;

  // 1. SÉCURITÉ BASE (Rate Limit, Headers, URL)
  const ip = req.headers.get("x-forwarded-for")?.split(',')[0]?.trim() || "unknown";
  
  if (!pathname.startsWith("/_next") && !pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|webp)$/)) {
    if (!checkRateLimit(ip)) {
      return new NextResponse("Too Many Requests", { status: 429, headers: { "Retry-After": "60" } });
    }
  }

  // 2. HEADERS SÉCURITÉ
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  
  // 3. GESTION DU DOMAINE
  let hostname = req.headers.get("host") || "";
  hostname = hostname.replace(":3000", "").replace(":3001", "");
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "bookzy.io";

  // 4. EXCLUSION DES ROUTES API
  if (pathname.startsWith("/api")) return response;

  // 5. PAGES PUBLIQUES
  const publicPaths = [
    "/", "/auth/login", "/auth/register", "/auth/forgot-password", 
    "/auth/reset-password", "/auth/verify-email", "/niche-hunter", 
    "/tendances", "/blog", "/legal",
  ];
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // ============================================================
  // 6. PROTECTION ZONES PRIVÉES (Auth Check)
  // ============================================================
  // On ne vérifie l'auth QUE si ce n'est PAS une page publique
  // Et on ne retourne PAS "response" tout de suite, on laisse couler vers le Rewrite plus bas
  
  if (!isPublicPath && (pathname.startsWith("/admin") || pathname.startsWith("/dashboard"))) {
    const userToken = req.cookies.get("bookzy_token")?.value;
    const adminToken = req.cookies.get("admin_token")?.value;
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) return NextResponse.next(); 
    
    // Logique Auth simplifiée pour middleware
    if (!userToken && !adminToken) {
       return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    
    // Note: La vérification JWT complète est lourde ici, 
    // on fait confiance au cookie présent pour la redirection, 
    // la API/Page vérifiera la validité réelle.
  }

  // ============================================================
  // 7. ROUTAGE MULTI-DOMAINES (LA CORRECTION EST ICI) 🚨
  // ============================================================
  
  // --- SCÉNARIO A : Sous-domaine "app" (app.bookzy.io) ---
  if (hostname === `app.${rootDomain}`) {
    
    // Si l'utilisateur arrive sur la racine /, on le redirige vers le dashboard
    if (pathname === "/") {
       return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // IMPORTANT : Si le chemin n'est pas déjà dans (platform), on fait un REWRITE
    // Cela force Next.js à utiliser le dossier app/(platform)/...
    // Assurez-vous que votre dossier s'appelle bien (platform) dans VS Code !
    if (!pathname.startsWith('/(platform)')) {
        return NextResponse.rewrite(new URL(`/(platform)${pathname}`, req.url));
    }
  }

  // --- SCÉNARIO B : Domaine Principal (bookzy.io) ---
  if (hostname === rootDomain || hostname === `www.${rootDomain}`) {
    // On force l'utilisation du dossier (marketing) pour la page d'accueil
    if (pathname === "/") {
        return NextResponse.rewrite(new URL(`/(marketing)`, req.url));
    }
    // Pour toutes les autres pages (blog, legal...), on rewrite vers (marketing)
    if (!pathname.startsWith('/(marketing)')) {
        return NextResponse.rewrite(new URL(`/(marketing)${pathname}`, req.url));
    }
  }

  return response;
}