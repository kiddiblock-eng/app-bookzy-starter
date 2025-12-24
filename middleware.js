import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|_static|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

async function getVerifiedPayload(token) {
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    return null;
  }
}

export default async function middleware(req) {
  const { pathname, search } = req.nextUrl;
  const hostHeader = req.headers.get("host") || "";
  const hostname = hostHeader.split(":")[0];
  const origin = req.headers.get("origin") || "";
  
  const isDev = process.env.NODE_ENV === "development";
  const APP_URL = isDev ? "http://localhost:3000" : "https://app.bookzy.io";

  // 🔥 EN DEV : Détection par PATH au lieu de hostname
  if (isDev) {
    const userToken = req.cookies.get("bookzy_token")?.value;
    const adminToken = req.cookies.get("admin_token")?.value;
    const userPayload = await getVerifiedPayload(userToken);
    const adminPayload = await getVerifiedPayload(adminToken);
    const hasValidToken = !!(userPayload || adminPayload);

    // Pages marketing : libre accès
    const marketingPaths = ["/blog", "/tendances", "/niche-hunter", "/legal"];
    if (marketingPaths.some(path => pathname.startsWith(path)) || pathname === "/") {
      return NextResponse.next();
    }

    // Setup : toujours accessible
    if (pathname.startsWith("/setup")) {
      return NextResponse.next();
    }

    // Admin : protection
    if (pathname.startsWith("/admin")) {
      if (!adminPayload || (adminPayload.role !== "admin" && adminPayload.role !== "super_admin")) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
      return NextResponse.next();
    }

    // Auth : redirect si déjà connecté
    if (pathname.startsWith("/auth")) {
      if (hasValidToken) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return NextResponse.next();
    }

    // Dashboard : protection
    if (pathname.startsWith("/dashboard")) {
      if (!hasValidToken) {
        const loginUrl = new URL("/auth/login", req.url);
        loginUrl.searchParams.set("from", pathname);
        return NextResponse.redirect(loginUrl);
      }
      return NextResponse.next();
    }

    // Reste : libre accès
    return NextResponse.next();
  }

  // 🔥 EN PRODUCTION : Détection par hostname
  const isAppSubdomain = hostname === "app.bookzy.io" || hostname.startsWith("app-bookzy-starter");

  let response;

  if (isAppSubdomain) {
    const userToken = req.cookies.get("bookzy_token")?.value;
    const adminToken = req.cookies.get("admin_token")?.value;
    const userPayload = await getVerifiedPayload(userToken);
    const adminPayload = await getVerifiedPayload(adminToken);
    const hasValidToken = !!(userPayload || adminPayload);

    if (pathname.startsWith("/setup")) {
      response = NextResponse.next();
    } 
    else if (pathname.startsWith("/admin")) {
      if (!adminPayload || (adminPayload.role !== "admin" && adminPayload.role !== "super_admin")) {
        response = NextResponse.redirect(new URL("/auth/login", req.url));
      } else {
        response = NextResponse.next();
      }
    } 
    else if (pathname.startsWith("/auth")) {
      response = hasValidToken 
        ? NextResponse.redirect(new URL("/dashboard", req.url)) 
        : NextResponse.next();
    } 
    else if (pathname.startsWith("/dashboard") && !hasValidToken) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      response = NextResponse.redirect(loginUrl);
    } 
    else if (pathname === "/") {
      response = hasValidToken 
        ? NextResponse.redirect(new URL("/dashboard", req.url)) 
        : NextResponse.redirect(new URL("/auth/login", req.url));
    } 
    else {
      const forbiddenOnApp = ["/blog", "/tendances", "/niche-hunter", "/legal"];
      if (forbiddenOnApp.some(path => pathname.startsWith(path))) {
        response = NextResponse.redirect(new URL("/auth/login", req.url));
      } else {
        response = NextResponse.next();
      }
    }
  } 
  else {
    const authRoutes = ["/dashboard", "/admin", "/auth", "/setup"];
    
    if (authRoutes.some(route => pathname.startsWith(route))) {
      response = NextResponse.redirect(new URL(pathname + search, APP_URL), { status: 307 });
    } 
    else {
      response = NextResponse.next();
    }
  }

  if (response) {
    const allowedOrigins = [
      APP_URL, 
      "https://www.bookzy.io", 
      "https://bookzy.io",
      ...(isDev ? ["http://localhost:3000"] : [])
    ];
    
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, x-nextjs-data, x-rsc, x-nextjs-rsc");
      response.headers.set("Access-Control-Allow-Credentials", "true");
    }
  }

  return response || NextResponse.next();
}