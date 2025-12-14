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
  // SUBDOMAIN APP : app.bookzy.io
  // ============================================================
  if (hostname.includes("app.")) {
    console.log(`📱 App subdomain`);

    // Pages autorisées sur app.bookzy.io
    const appAllowedPaths = [
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

    // Protection dashboard
    if (pathname.startsWith("/dashboard")) {
      const userToken = req.cookies.get("bookzy_token")?.value;
      const adminToken = req.cookies.get("admin_token")?.value;

      if (!userToken && !adminToken) {
        console.log(`🚫 No token - redirect to login`);
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
    }

    // Protection admin
    if (pathname.startsWith("/admin")) {
      const adminToken = req.cookies.get("admin_token")?.value;

      if (!adminToken) {
        console.log(`🚫 No admin token - redirect to login`);
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
    }

    // Racine de app.bookzy.io → redirect dashboard
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  }

  // ============================================================
  // DOMAINE PRINCIPAL : www.bookzy.io ou bookzy.io
  // ============================================================
  console.log(`🌍 Main domain`);

  // Si on essaie d'accéder à dashboard/admin sur www → redirect vers app
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname.startsWith("/auth")) {
    const appUrl = new URL(req.url);
    appUrl.hostname = hostname.includes("www.") 
      ? hostname.replace("www.", "app.")
      : `app.${hostname}`;
    
    console.log(`↪️ Redirect to ${appUrl.hostname}`);
    return NextResponse.redirect(appUrl);
  }

  // Pages marketing autorisées sur www.bookzy.io
  const marketingPaths = [
    "/",
    "/niche-hunter",
    "/tendances",
    "/blog",
    "/legal",
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