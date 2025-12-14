import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";
import Transaction from "@/models/Transaction";
import User from "@/models/User";

export async function GET(req) {
  try {
    await dbConnect();

    const admin = await verifyAdmin(req);
    if (!admin?.authorized) {
      return NextResponse.json(
        { success: false, message: admin.message || "Non autorisé" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const periodParam = parseInt(searchParams.get("period") || "30", 10);

    // On limite aux valeurs classiques : 7, 30, 90
    const allowed = [7, 30, 90];
    const period = allowed.includes(periodParam) ? periodParam : 30;

    const now = new Date();
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - period);

    // 👤 Inscriptions par jour
    const usersAgg = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: fromDate, $lte: now },
        },
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$createdAt" },
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 }, // nb d’inscriptions
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
          "_id.day": 1,
        },
      },
    ]);

    // 💳 Ventes + revenu par jour
    const salesAgg = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: fromDate, $lte: now },
          status: "completed",
          amount: { $gt: 0 },
        },
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$createdAt" },
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          sales: { $sum: 1 },   // nb de ventes
          total: { $sum: "$amount" }, // revenu du jour
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
          "_id.day": 1,
        },
      },
    ]);

    // 🔗 On fusionne les deux tableaux (users + sales) par date
    const map = new Map();

    for (const u of usersAgg) {
      const key = `${u._id.year}-${u._id.month}-${u._id.day}`;
      map.set(key, {
        _id: u._id,
        users: u.count,  // pour ton chart : d.users
        count: u.count,  // fallback si tu utilises d.count
        sales: 0,
        total: 0,
      });
    }

    for (const s of salesAgg) {
      const key = `${s._id.year}-${s._id.month}-${s._id.day}`;
      const existing = map.get(key);

      if (existing) {
        existing.sales = s.sales;
        existing.total = s.total;
      } else {
        map.set(key, {
          _id: s._id,
          users: 0,
          count: 0,
          sales: s.sales,
          total: s.total,
        });
      }
    }

    const timeline = Array.from(map.values()).sort((a, b) => {
      if (a._id.year !== b._id.year) return a._id.year - b._id.year;
      if (a._id.month !== b._id.month) return a._id.month - b._id.month;
      return a._id.day - b._id.day;
    });

    return NextResponse.json({
      success: true,
      data: timeline,
    });
  } catch (err) {
    console.error("Erreur timeline:", err);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}