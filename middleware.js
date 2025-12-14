import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// On exclut les fichiers statiques et l'API globale (sauf admin)
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export default async function middleware(req) {
  const url = req.nextUrl;
  const { pathname } = url;

  // 1. GESTION DU DOMAINE
  let hostname = req.headers.get("host") || "";
  hostname = hostname.replace(":3000", ""); // Enlever le port en local
  
  // Ton domaine (en local = localhost)
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "bookzy.io";

  // ============================================================
  // 2. SÉCURITÉ (USER / ADMIN) - TA LOGIQUE INTACTE
  // ============================================================
  
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin") || pathname.startsWith("/dashboard")) {
    const userToken = req.cookies.get("bookzy_token")?.value;
    const adminToken = req.cookies.get("admin_token")?.value;
    const JWT_SECRET = process.env.JWT_SECRET;
    const encoder = new TextEncoder();

    async function verify(token) {
      if (!token) return null;
      try {
        return await jwtVerify(token, encoder.encode(JWT_SECRET));
      } catch (err) {
        return null;
      }
    }

    // A. ADMIN
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
      if (!adminToken) return NextResponse.redirect(new URL("/auth/login", req.url));
      try {
        const decoded = await verify(adminToken);
        if (!decoded || !["admin", "super_admin"].includes(decoded.payload.role)) {
          return NextResponse.redirect(new URL("/auth/login", req.url));
        }
      } catch (err) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
    }

    // B. DASHBOARD
    if (pathname.startsWith("/dashboard")) {
      const token = userToken || adminToken;
      if (!token) return NextResponse.redirect(new URL("/auth/login", req.url));
      try {
        const verified = await verify(token);
        if (!verified) throw new Error("Token invalide");
      } catch (err) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
    }
  }

  // ============================================================
  // 3. ROUTAGE MULTI-DOMAINES SIMPLIFIÉ
  // ============================================================

  // Ne jamais toucher aux API
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // SCÉNARIO A : Sous-domaine "app" (app.bookzy.io ou app.localhost)
  if (hostname === `app.${rootDomain}`) {
    // Si l'utilisateur arrive sur la racine "/" de l'app, on l'envoie au Dashboard (ou Login)
    // Car il n'y a pas de page d'accueil dans (platform)
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    // Pour tout le reste (/dashboard, /auth, etc.), on laisse passer
    return NextResponse.next();
  }

  // SCÉNARIO B : Domaine Principal (bookzy.io ou localhost)
  // On laisse Next.js gérer. Il affichera naturellement (marketing)/page.js car c'est la racine.
  // Pas besoin de rewrite compliqué.
  return NextResponse.next();
}