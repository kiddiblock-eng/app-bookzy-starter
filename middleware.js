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
      console.warn(`🚨 Rate limit: ${ip}`);
      return new NextResponse("Too Many Requests", { 
        status: 429,
        headers: { "Retry-After": "60" }
      });
    }
  }

  // ============================================================
  // 🔒 SÉCURITÉ 2 : VALIDATION URL
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
  // 🔒 SÉCURITÉ 3 : HEADERS
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
  // 1. HOSTNAME & CONFIG
  // ============================================================
  let hostname = req.headers.get("host") || "";
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "bookzy.io";
  const JWT_SECRET = process.env.JWT_SECRET;

  console.log(`🌐 ${hostname}${pathname}`);

  // ============================================================
  // 2. API ROUTES - PASS THROUGH
  // ============================================================
  if (pathname.startsWith("/api")) {
    return response;
  }

  // ============================================================
  // 3. PUBLIC PAGES
  // ============================================================
  const publicPaths = [
    "/", "/auth/login", "/auth/register", "/auth/forgot-password", 
    "/auth/reset-password", "/auth/verify-email", "/niche-hunter", 
    "/tendances", "/blog", "/legal",
  ];
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // ============================================================
  // 4. FONCTION HELPER : Vérification JWT
  // ============================================================
  async function verifyToken(token) {
    if (!token || !JWT_SECRET) return null;
    try {
      const encoder = new TextEncoder();
      return await jwtVerify(token, encoder.encode(JWT_SECRET));
    } catch (err) {
      console.warn(`⚠️ JWT error:`, err.message);
      return null;
    }
  }

  // ============================================================
  // 5. PROTECTION AUTH (Admin & Dashboard)
  // ============================================================
  async function checkAuth() {
    if (isPublicPath) return null;
    if (!pathname.startsWith("/admin") && !pathname.startsWith("/dashboard")) return null;

    const userToken = req.cookies.get("bookzy_token")?.value;
    const adminToken = req.cookies.get("admin_token")?.value;

    if (!JWT_SECRET) {
      console.error("❌ JWT_SECRET manquant");
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    if (!userToken && !adminToken) {
      console.log(`🚫 No token (${ip})`);
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Protection ADMIN
    if (pathname.startsWith("/admin")) {
      if (!adminToken) {
        console.warn(`🚫 Admin denied - no admin token`);
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
      const decoded = await verifyToken(adminToken);
      if (!decoded || !["admin", "super_admin"].includes(decoded.payload.role)) {
        console.warn(`🚫 Admin denied - invalid role`);
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
      console.log(`✅ Admin: ${decoded.payload.email}`);
    }

    // Protection DASHBOARD
    if (pathname.startsWith("/dashboard")) {
      const token = userToken || adminToken;
      const verified = await verifyToken(token);
      if (!verified) {
        console.warn(`🚫 Dashboard denied - invalid token`);
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
      console.log(`✅ Dashboard: ${verified.payload.email}`);
    }

    return null;
  }

  // ============================================================
  // 6. LOCALHOST : Logique simplifiée
  // ============================================================
  if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
    console.log(`🏠 Localhost mode`);
    const authRedirect = await checkAuth();
    if (authRedirect) return authRedirect;
    return response;
  }

  // ============================================================
  // 7. PRODUCTION : Multi-domaines
  // ============================================================

  // SUBDOMAIN: app.bookzy.io
  if (hostname.includes("app.")) {
    console.log(`📱 App subdomain`);
    
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    
    const authRedirect = await checkAuth();
    if (authRedirect) return authRedirect;
    
    return response;
  }

  // MAIN DOMAIN: www.bookzy.io or bookzy.io
  console.log(`🌍 Main domain`);
  
  if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
    const appUrl = new URL(req.url);
    appUrl.hostname = hostname.includes("www.") 
      ? hostname.replace("www.", "app.")
      : `app.${hostname}`;
    console.log(`↪️ Redirect to ${appUrl.hostname}`);
    return NextResponse.redirect(appUrl);
  }
  
  return response;
}