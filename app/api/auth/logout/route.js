import { NextResponse } from "next/server";

export async function POST() {
  try {
    const isProd = process.env.NODE_ENV === "production";
    const cookieDomain = isProd ? ".bookzy.io" : undefined;

    const response = NextResponse.json({ 
      success: true, 
      message: "Déconnexion réussie ✅" 
    });

    // 🚩 CONFIGURATION DE SUPPRESSION (Doit matcher le Login)
    const logoutOptions = {
      httpOnly: true,
      secure: isProd,
      path: "/",
      domain: cookieDomain, // ✅ ESSENTIEL : C'est ce qui te manquait
      expires: new Date(0), // Force l'expiration immédiate
      sameSite: "lax",
    };

    // On supprime les deux types de tokens possibles
    response.cookies.set("bookzy_token", "", logoutOptions);
    response.cookies.set("admin_token", "", logoutOptions);

    return response;
  } catch (error) {
    console.error("❌ Erreur lors de la déconnexion :", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}