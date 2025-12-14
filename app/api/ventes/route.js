import { connectDB } from "../../../lib/db.js";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Vente from "../../../models/Vente.js";

export async function GET(req) {
  try {
    await connectDB();

    const token = cookies().get("bookzy_token")?.value;
    if (!token)
      return new Response(JSON.stringify({ message: "Utilisateur non authentifié" }), { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Récupérer les dates
    const { searchParams } = new URL(req.url);
    const from = new Date(searchParams.get("from"));
    const to = new Date(searchParams.get("to"));

    // Chercher les ventes du user
    const ventes = await Vente.find({ userId, date: { $gte: from, $lte: to } });

    const total = ventes.reduce((sum, v) => sum + (v.montant || 0), 0);
    const transactions = ventes.length;

    return new Response(
      JSON.stringify({
        total,
        ebooks: transactions,
        data: ventes.map((v) => ({
          date: v.date.toISOString().split("T")[0],
          montant: v.montant,
        })),
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Erreur GET /ventes :", error);
    return new Response(JSON.stringify({ message: "Erreur serveur interne" }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const token = cookies().get("bookzy_token")?.value;
    if (!token)
      return new Response(JSON.stringify({ message: "Utilisateur non authentifié" }), { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const body = await req.json();
    const { montant, produit, devise, meta } = body;

    if (!montant || isNaN(montant))
      return new Response(JSON.stringify({ message: "Montant invalide" }), { status: 400 });

    const vente = await Vente.create({
      userId,
      montant,
      produit: produit || "Ebook",
      devise: devise || "EUR",
      meta: meta || {},
      date: new Date(),
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Vente enregistrée avec succès ✅",
        vente,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Erreur POST /ventes :", error);
    return new Response(
      JSON.stringify({ message: "Erreur serveur interne", error: error.message }),
      { status: 500 }
    );
  }
}