import { NextResponse } from "next/server";
import { getCookieDomain } from "@/lib/cookies";

export async function POST(req) {
  try {
    const isProd = process.env.NODE_ENV === "production";
    const cookieDomain = getCookieDomain(req);

    const response = NextResponse.json({ 
      success: true, 
      message: "Déconnexion réussie ✅" 
    });

    // 🔥 CONFIGURATION DE SUPPRESSION
    const logoutOptions = {
      httpOnly: true,
      secure: isProd,
      path: "/",
      domain: cookieDomain,
      maxAge: 0,  // Expire immédiatement
      sameSite: "lax",
    };

    // Supprimer les deux tokens avec domain
    response.cookies.set("bookzy_token", "", logoutOptions);
    response.cookies.set("admin_token", "", logoutOptions);

    // 🔥 AUSSI SANS DOMAIN (double sécurité pour production)
    if (isProd) {
      response.cookies.set("bookzy_token", "", { 
        ...logoutOptions, 
        domain: undefined 
      });
      response.cookies.set("admin_token", "", { 
        ...logoutOptions, 
        domain: undefined 
      });
    }

    return response;
  } catch (error) {
    console.error("❌ Erreur logout:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}