import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import User from "../models/User";
import { dbConnect } from "./db";

// ---------------------------------------------
// ✔ Vérification ADMIN 100% compatible Next.js 14
// ---------------------------------------------
export async function verifyAdmin(req) {
  try {
    await dbConnect();

    // 1️⃣ Vérification via x-admin-secret (temporaire)
    const headerSecret = req.headers.get("x-admin-secret");
    if (headerSecret && headerSecret === process.env.ADMIN_SECRET) {
      return {
        authorized: true,
        user: { role: "admin", mode: "secret" }
      };
    }

    // 2️⃣ Vérification via cookie admin_token (authentification réelle)
    const cookieStore = cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return { authorized: false, message: "Token admin manquant" };
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    if (!payload || !payload.id) {
      return { authorized: false, message: "Token invalide" };
    }

    const adminUser = await User.findById(payload.id).lean();

    if (!adminUser || (adminUser.role !== "admin" && adminUser.role !== "super_admin")) {
      return {
        authorized: false,
        message: "Vous n'êtes pas administrateur"
      };
    }

    return {
      authorized: true,
      user: adminUser
    };

  } catch (error) {
    console.error("❌ Erreur verifyAdmin:", error);
    return { authorized: false, message: "Erreur de vérification" };
  }
}

// ---------------------------------------------
// ✔ Vérification USER (user_token)
// ---------------------------------------------
export async function verifyAuth(req) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("bookzy_token")?.value;

    if (!token) return null;

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    return payload || null;
  } catch {
    return null;
  }
}

// ---------------------------------------------
// ✔ Récupérer l'utilisateur
// ---------------------------------------------
export async function getUserFromToken(req) {
  try {
    await dbConnect();

    const cookieStore = cookies();
    const token = cookieStore.get("bookzy_token")?.value;

    if (!token) return null;

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    const user = await User.findById(payload.id).lean();
    return user || null;
  } catch (error) {
    console.error("❌ Erreur getUserFromToken:", error);
    return null;
  }
}