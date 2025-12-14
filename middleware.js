import { NextResponse } from "next/server";

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export default async function middleware(req) {
  const url = req.nextUrl;
  const { pathname } = url;
  
  // Récupère le domaine (ex: app.bookzy.io ou www.bookzy.io)
  const hostname = req.headers.get("host")?.replace(":3000", "").replace(":3001", "") || "";
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "bookzy.io";

  // 1. EXCLUSIONS (On ne touche pas aux API ni aux fichiers internes)
  if (pathname.startsWith("/api") || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  // =========================================================
  // 🟦 SCÉNARIO 1 : PLATEFORME (app.bookzy.io) -> vers (platform)
  // =========================================================
  if (hostname === `app.${rootDomain}`) {
    
    // A. Si on arrive sur la racine "/", on envoie vers le Dashboard
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // B. SÉCURITÉ : Vérification du Token
    // Si ce n'est PAS une page d'authentification (login/register)...
    if (!pathname.startsWith("/auth")) {
      const userToken = req.cookies.get("bookzy_token")?.value;
      const adminToken = req.cookies.get("admin_token")?.value;
      
      // ...et qu'on a aucun token -> DEHORS vers le Login !
      if (!userToken && !adminToken) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
    }

    // C. LE ROUTAGE (Rewrite)
    // On dit à Next.js : "Va chercher ce fichier dans le dossier (platform)"
    if (!pathname.startsWith("/(platform)")) {
      return NextResponse.rewrite(new URL(`/(platform)${pathname}`, req.url));
    }
  }

  // =========================================================
  // 🟧 SCÉNARIO 2 : MARKETING (bookzy.io) -> vers (marketing)
  // =========================================================
  if (hostname === rootDomain || hostname === `www.${rootDomain}`) {
    
    // Si quelqu'un essaie d'aller sur /dashboard ici -> redirection vers app.bookzy.io
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/auth") || pathname.startsWith("/admin")) {
      const newUrl = new URL(pathname, `https://app.${rootDomain}`);
      return NextResponse.redirect(newUrl);
    }

    // LE ROUTAGE (Rewrite)
    // On dit à Next.js : "Va chercher ce fichier dans le dossier (marketing)"
    if (pathname === "/") {
      return NextResponse.rewrite(new URL(`/(marketing)`, req.url));
    }
    if (!pathname.startsWith("/(marketing)")) {
      return NextResponse.rewrite(new URL(`/(marketing)${pathname}`, req.url));
    }
  }

  return NextResponse.next();
}