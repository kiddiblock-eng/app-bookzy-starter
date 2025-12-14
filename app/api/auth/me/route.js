import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { dbConnect } from "../../../../lib/db.js";
import User from "../../../../models/User.js";

export async function GET() {
  try {
    await dbConnect();

    // 🟢 IMPORTANT : lire les 2 cookies !
    const userToken = cookies().get("bookzy_token")?.value;
    const adminToken = cookies().get("admin_token")?.value;

    const token = userToken || adminToken;

    if (!token) {
      return new Response(JSON.stringify({ message: "Token non trouvé." }), {
        status: 401,
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return new Response(JSON.stringify({ message: "Token invalide." }), {
        status: 403,
      });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return new Response(
        JSON.stringify({ message: "Utilisateur introuvable." }),
        { status: 404 }
      );
    }

    // Auto migration sécurité
    let needsSave = false;

    if (user.emailVerified === undefined) {
      user.emailVerified = false;
      needsSave = true;
    }

    if (user.emailVerifiedAt === undefined) {
      user.emailVerifiedAt = null;
      needsSave = true;
    }

    if (user.emailVerificationSentAt === undefined) {
      user.emailVerificationSentAt = null;
      needsSave = true;
    }

    if (needsSave) {
      await user.save();
    }

    return new Response(
      JSON.stringify({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar || "",
        emailVerified: user.emailVerified,
        role: user.role,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Erreur /api/auth/me :", error);
    return new Response(
      JSON.stringify({ message: "Erreur serveur interne." }),
      { status: 500 }
    );
  }
}