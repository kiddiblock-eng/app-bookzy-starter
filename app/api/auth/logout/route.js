import { cookies } from "next/headers";

export async function POST() {
  try {
    // Supprimer le cookie JWT
    cookies().set("bookzy_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
      path: "/",
    });

    return new Response(
      JSON.stringify({ message: "Déconnexion réussie ✅" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la déconnexion :", error);
    return new Response(
      JSON.stringify({ message: "Erreur serveur lors de la déconnexion." }),
      { status: 500 }
    );
  }
}