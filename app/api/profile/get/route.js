import { dbConnect} from "../../../../lib/db.js";
import User from "../../../../models/User.js";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// 🔹 Génère un avatar dynamique avec UI-Avatars
const generateAvatar = (user) => {
  const baseName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    user?.name ||
    (user?.email ? user.email.split("@")[0] : "Utilisateur");
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    baseName
  )}&background=3b82f6&color=fff&bold=true&size=256`;
};

export async function GET() {
  try {
    await dbConnect();

    // 🔐 Lire le token JWT depuis les cookies
    const token = cookies().get("bookzy_token")?.value;
    if (!token) {
      return new Response(JSON.stringify({ error: "Non connecté" }), { status: 401 });
    }

    // 🧠 Décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // 🔍 Récupérer le profil utilisateur
    const user = await User.findById(userId).select(
      "firstName lastName name email avatar country lang"
    );

    if (!user) {
      return new Response(JSON.stringify({ error: "Utilisateur non trouvé" }), { status: 404 });
    }

    // ✅ Utiliser 'avatar' au lieu de 'photo'
    let photo = user.avatar;

    // 🧩 Si pas d'avatar → avatar dynamique
    if (!photo) {
      photo = generateAvatar(user);
    }

    // ✅ Préparer la réponse avec les bons champs
    const responseUser = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      name: user.name,
      email: user.email,
      photo: photo, // ← Pour le frontend qui attend 'photo'
      avatar: photo, // ← Pour la cohérence
      displayName: user.name, // ← Mapper 'name' vers 'displayName'
      country: user.country,
      lang: user.lang
    };

    console.log('✅ Profil chargé:', responseUser.name, responseUser.country);

    return new Response(JSON.stringify({ success: true, user: responseUser }), { status: 200 });
  } catch (error) {
    console.error("❌ Erreur GET profil :", error);
    return new Response(
      JSON.stringify({ error: "Erreur serveur" }),
      { status: 500 }
    );
  }
}