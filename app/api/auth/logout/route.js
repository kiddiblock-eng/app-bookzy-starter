// app/api/auth/logout/route.js

import { cookies } from "next/headers";

export async function POST() {
  try {
    // ✅ Supprimer TOUS les tokens (user + admin)
    cookies().set("bookzy_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
      path: "/",
    });

    cookies().set("admin_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
      path: "/",
    });

    return new Response(
      JSON.stringify({ success: true, message: "Déconnexion réussie ✅" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Erreur lors de la déconnexion :", error);
    return new Response(
      JSON.stringify({ success: false, message: "Erreur serveur lors de la déconnexion." }),
      { status: 500 }
    );
  }
}

// ✅ Support GET aussi (au cas où)
export async function GET() {
  return POST();
}