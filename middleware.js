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
      const filtered = requests.filter(time => now - time < RATE_LIMIT_WINDOW);
      if (filtered.length === 0) {
        rateLimitMap.delete(ip);
      } else {
        rateLimitMap.set(ip, filtered);
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
  
  if (!pathname.startsWith("/_next") && !pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|webp)$/)) {
    if (!checkRateLimit(ip)) {
      console.warn(`🚨 Rate limit dépassé: ${ip}`);
      return new NextResponse("Too Many Requests", { 
        status: 429,
        headers: { "Retry-After": "60" }
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
      console.warn(`🚨 URL suspecte: ${ip} - ${fullUrl}`);
      return new NextResponse("Bad Request", { status: 400 });
    }
  }

  // ============================================================
  // 🔒 SÉCURITÉ 3 : HEADERS DE SÉCURITÉ
  // ============================================================
  const response = NextResponse.next();
  
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  
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
  hostname = hostname.replace(":3000", "").replace(":3001", "");
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "bookzy.io";

  console.log(`🌐 ${hostname}${pathname}`);

  // ============================================================
  // 2. EXCLUSION DES ROUTES API
  // ============================================================
  if (pathname.startsWith("/api")) {
    return response;
  }

  // ============================================================
  // 3. PAGES PUBLIQUES
  // ============================================================
  const publicPaths = [
    "/", "/auth/login", "/auth/register", "/auth/forgot-password", 
    "/auth/reset-password", "/auth/verify-email", "/niche-hunter", 
    "/tendances", "/blog", "/legal",
  ];
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // ============================================================
  // 4. PROTECTION ZONES PRIVÉES (Auth Check)
  // ============================================================
  if (!isPublicPath && (pathname.startsWith("/admin") || pathname.startsWith("/dashboard"))) {
    const userToken = req.cookies.get("bookzy_token")?.value;
    const adminToken = req.cookies.get("admin_token")?.value;
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      console.error("❌ JWT_SECRET manquant");
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Si pas de token → login
    if (!userToken && !adminToken) {
      console.log(`🚫 No token (${ip}) - redirect to login`);
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Vérification JWT pour admin
    if (pathname.startsWith("/admin") && adminToken) {
      const encoder = new TextEncoder();
      try {
        const decoded = await jwtVerify(adminToken, encoder.encode(JWT_SECRET));
        if (!decoded || !["admin", "super_admin"].includes(decoded.payload.role)) {
          console.warn(`🚫 Token admin invalide (${ip})`);
          return NextResponse.redirect(new URL("/auth/login", req.url));
        }
        console.log(`✅ Admin access granted (${ip})`);
      } catch (err) {
        console.warn(`⚠️ JWT error (${ip}):`, err.message);
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
    }
  }

  // ============================================================
  // 5. ROUTAGE MULTI-DOMAINES
  // ============================================================
  
  // --- SCÉNARIO A : Sous-domaine "app" (app.bookzy.io) ---
  if (hostname === `app.${rootDomain}`) {
    console.log(`📱 App subdomain`);
    
    // Si racine → redirect dashboard
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // ✅ NE PAS rewriter /auth (accès direct à app/(platform)/auth/)
    if (pathname.startsWith('/auth')) {
      console.log(`✅ Auth page - direct access`);
      return response;
    }

    // Rewrite dashboard et admin vers (platform)
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
      if (!pathname.startsWith('/(platform)')) {
        console.log(`↪️ Rewrite to (platform)${pathname}`);
        return NextResponse.rewrite(new URL(`/(platform)${pathname}`, req.url));
      }
    }

    return response;
  }

  // --- SCÉNARIO B : Domaine Principal (bookzy.io / www.bookzy.io) ---
  if (hostname === rootDomain || hostname === `www.${rootDomain}`) {
    console.log(`🌍 Main domain`);
    
    // Redirect admin/dashboard vers app.bookzy.io
    if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
      const appUrl = new URL(req.url);
      appUrl.hostname = `app.${rootDomain}`;
      console.log(`↪️ Redirect to app subdomain`);
      return NextResponse.redirect(appUrl);
    }

    // Rewrite vers (marketing)
    if (pathname === "/") {
      if (!pathname.startsWith('/(marketing)')) {
        return NextResponse.rewrite(new URL(`/(marketing)`, req.url));
      }
    }

    if (!pathname.startsWith('/(marketing)') && !pathname.startsWith('/auth')) {
      return NextResponse.rewrite(new URL(`/(marketing)${pathname}`, req.url));
    }
  }

  return response;
}