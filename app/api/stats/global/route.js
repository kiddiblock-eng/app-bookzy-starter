import { dbConnect } from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Vente from "@/models/vente";
import Projet from "@/models/Projet";

// Fonction utilitaire pour bornes de dates

export const dynamic = 'force-dynamic';

function getMonthRange(offset = 0) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 0, 23, 59, 59);
  return { start, end };
}

export async function GET() {
  try {
    await dbConnect();

    // Authentification
    const token = cookies().get("bookzy_token")?.value;
    if (!token)
      return new Response(JSON.stringify({ message: "Non connecté" }), { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Mois courant & précédent
    const currentRange = getMonthRange(0);
    const previousRange = getMonthRange(-1);

    // Récupération des ventes (mois courant & précédent)
    const [currentSales, previousSales] = await Promise.all([
      Vente.find({
        userId,
        createdAt: { $gte: currentRange.start, $lte: currentRange.end },
      }),
      Vente.find({
        userId,
        createdAt: { $gte: previousRange.start, $lte: previousRange.end },
      }),
    ]);

    // Récupération des projets
    const [currentProjets, previousProjets] = await Promise.all([
      Projet.find({
        userId,
        createdAt: { $gte: currentRange.start, $lte: currentRange.end },
      }),
      Projet.find({
        userId,
        createdAt: { $gte: previousRange.start, $lte: previousRange.end },
      }),
    ]);

    // 🧮 Calculs
    const currentTotal = currentSales.reduce((s, v) => s + (v.montant || 0), 0);
    const previousTotal = previousSales.reduce((s, v) => s + (v.montant || 0), 0);

    const currentEbooks = currentProjets.length;
    const previousEbooks = previousProjets.length;

    const currentDays = new Set(currentSales.map((v) => v.createdAt.toDateString())).size;
    const previousDays = new Set(previousSales.map((v) => v.createdAt.toDateString())).size;

    // 📈 Calcul des variations (%)
    const calcVar = (curr, prev) => {
      if (prev === 0 && curr === 0) return 0;
      if (prev === 0) return 100;
      return Number((((curr - prev) / prev) * 100).toFixed(1));
    };

    const trends = {
      total: calcVar(currentTotal, previousTotal),
      ebooks: calcVar(currentEbooks, previousEbooks),
      activity: calcVar(currentDays, previousDays),
    };

    // 📊 Prépare la réponse
    return new Response(
      JSON.stringify({
        total: currentTotal,
        ebooks: currentEbooks,
        activity: currentDays,
        trends,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Erreur /api/stats/global :", error);
    return new Response(
      JSON.stringify({ message: "Erreur serveur", error: error.message }),
      { status: 500 }
    );
  }
}
