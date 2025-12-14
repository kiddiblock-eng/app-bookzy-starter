import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function PUT(req) {
  try {
    await dbConnect();

    const token = cookies().get("bookzy_token")?.value;
    if (!token) {
      return new Response(JSON.stringify({ message: "Utilisateur non authentifié" }), { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const body = await req.json();
    const { firstName, lastName, photo, langue, pays } = body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, photo, langue, pays },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return new Response(JSON.stringify({ message: "Utilisateur introuvable" }), { status: 404 });
    }

    return new Response(
      JSON.stringify({
        message: "Profil mis à jour avec succès ✅",
        user: updatedUser,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur dans /api/auth/update :", error);
    return new Response(JSON.stringify({ message: "Erreur serveur interne" }), { status: 500 });
  }
}