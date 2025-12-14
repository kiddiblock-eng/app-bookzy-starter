import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// On exclut les fichiers statiques
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

// 🔒 RATE LIMITING (Simple mais efficace)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 150; // 150 requêtes/minute (augmenté pour dev)

function checkRateLimit(ip) {
  const now = Date.now();
  const userRequests = rateLimitMap.get(ip) || [];
  
  const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= MAX_REQUESTS) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return true;
}

// Nettoyage automatique toutes les 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, requests] of rateLimitMap.entries()) {
      const recentRequests = requests.filter(time => now - time < RATE_LIMIT_WINDOW);
      if (recentRequests.length === 0) {
        rateLimitMap.delete(ip);
      } else {
        rateLimitMap.set(ip, recentRequests);
      }
    }
  }, 5 * 60 * 1000);
}

export default async function middleware(req) {
  const url = req.nextUrl;
  const { pathname } = url;

  // ============================================================
  // 🔒 SÉCURITÉ 1 : RATE LIMITING
  // ============================================================
  const ip = req.headers.get("x-forwarded-for")?.split(',')[0]?.trim() || 
             req.headers.get("x-real-ip") || 
             "unknown";
  
  // Seulement pour les routes sensibles (pas les assets)
  if (!pathname.startsWith("/_next") && !pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|webp)$/)) {
    if (!checkRateLimit(ip)) {
      console.warn(`🚨 Rate limit dépassé pour ${ip}`);
      return new NextResponse("Too Many Requests", { 
        status: 429,
        headers: {
          "Retry-After": "60",
          "Content-Type": "text/plain"
        }
      });
    }
  }

  // ============================================================
  // 🔒 SÉCURITÉ 2 : VALIDATION URL (Anti-injection)
  // ============================================================
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+=/i,
    /\.\.\//,
    /union.*select/i,
    /drop.*table/i,
  ];

  const fullUrl = pathname + url.search;
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(fullUrl)) {
      console.warn(`🚨 URL suspecte détectée depuis ${ip}: ${fullUrl}`);
      return new NextResponse("Bad Request", { status: 400 });
    }
  }

  // ============================================================
  // 🔒 SÉCURITÉ 3 : HEADERS DE SÉCURITÉ
  // ============================================================
  const response = NextResponse.next();
  
  // Protection XSS
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  
  // Content Security Policy (Adapté pour Next.js + Anthropic)
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://vercel.live;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: https: blob:;
    font-src 'self' https://fonts.gstatic.com data:;
    connect-src 'self' https://api.anthropic.com https://*.vercel.app wss://*.vercel.app;
    frame-src 'self';
    worker-src 'self' blob:;
  `.replace(/\s{2,}/g, ' ').trim();
  
  response.headers.set("Content-Security-Policy", cspHeader);

  // ============================================================
  // 1. GESTION DU DOMAINE
  // ============================================================
  let hostname = req.headers.get("host") || "";
  hostname = hostname.replace(":3000", "").replace(":3001", ""); // Support multi-ports
  
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "bookzy.io";

  // ============================================================
  // 2. EXCLUSION DES ROUTES API (Pas de redirect)
  // ============================================================
  if (pathname.startsWith("/api")) {
    return response;
  }

  // ============================================================
  // 3. PAGES PUBLIQUES (Accessibles sans auth)
  // ============================================================
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

  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // Si page publique, laisser passer
  if (isPublicPath) {
    return response;
  }

  // ============================================================
  // 4. PROTECTION ZONES PRIVÉES (/admin, /dashboard)
  // ============================================================
  
  if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
    const userToken = req.cookies.get("bookzy_token")?.value;
    const adminToken = req.cookies.get("admin_token")?.value;
    const JWT_SECRET = process.env.JWT_SECRET;
    
    if (!JWT_SECRET) {
      console.error("❌ JWT_SECRET manquant ! Vérifier les variables d'environnement.");
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    
    const encoder = new TextEncoder();

    async function verify(token) {
      if (!token) return null;
      try {
        const result = await jwtVerify(token, encoder.encode(JWT_SECRET));
        return result;
      } catch (err) {
        console.warn(`⚠️ Token invalide (${ip}):`, err.code);
        return null;
      }
    }

    // A. PROTECTION ADMIN
    if (pathname.startsWith("/admin")) {
      if (!adminToken) {
        console.warn(`🚫 Tentative accès admin sans token (${ip})`);
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
      
      const decoded = await verify(adminToken);
      if (!decoded || !["admin", "super_admin"].includes(decoded.payload.role)) {
        console.warn(`🚫 Token admin invalide ou rôle insuffisant (${ip})`);
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
      
      // Log accès admin (optionnel mais recommandé)
      console.log(`✅ Accès admin accordé à ${decoded.payload.email} (${ip})`);
    }

    // B. PROTECTION DASHBOARD (User OU Admin)
    if (pathname.startsWith("/dashboard")) {
      const token = userToken || adminToken;
      if (!token) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
      
      const verified = await verify(token);
      if (!verified) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
    }
  }

  // ============================================================
  // 5. ROUTAGE MULTI-DOMAINES
  // ============================================================

  // SCÉNARIO A : Sous-domaine "app" (app.bookzy.io)
  if (hostname === `app.${rootDomain}`) {
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return response;
  }

  // SCÉNARIO B : Domaine Principal (bookzy.io)
  return response;
}