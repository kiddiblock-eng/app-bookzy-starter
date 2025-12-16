import { dbConnect} from "@/lib/db.js";
import User from "@/models/User.js";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

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

    const token = cookies().get("bookzy_token")?.value;
    if (!token) {
      return new Response(JSON.stringify({ error: "Non connecté" }), { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // ✅ OPTIMISATION: .lean() + .select()
    const user = await User.findById(userId)
      .select("firstName lastName name email avatar country lang")
      .lean()
      .exec();

    if (!user) {
      return new Response(JSON.stringify({ error: "Utilisateur non trouvé" }), { status: 404 });
    }

    let photo = user.avatar;

    if (!photo) {
      photo = generateAvatar(user);
    }

    const responseUser = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      name: user.name,
      email: user.email,
      photo: photo,
      avatar: photo,
      displayName: user.name,
      country: user.country,
      lang: user.lang
    };

    return new Response(
      JSON.stringify({ success: true, user: responseUser }), 
      { 
        status: 200,
        headers: {
          'Cache-Control': 'private, max-age=300',
        }
      }
    );
  } catch (error) {
    console.error("❌ Erreur GET profil :", error);
    return new Response(
      JSON.stringify({ error: "Erreur serveur" }),
      { status: 500 }
    );
  }
}