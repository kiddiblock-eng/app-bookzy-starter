import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";
import Transaction from "@/models/Transaction";

export async function POST(req) {
  await dbConnect();
  
  const { authorized } = await verifyAdmin(req);
  if (!authorized)
    return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 403 });

  const { startDate, endDate, country } = await req.json();

  const filter = {
    status: "completed", // ✅ AJOUTÉ - Filtre uniquement les transactions complétées
    amount: { $gt: 0 }   // ✅ AJOUTÉ - Exclut les montants négatifs ou nuls
  };

  if (startDate && endDate) {
    filter.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  if (country) {
    filter.country = country;
  }

  const sales = await Transaction.find(filter).sort({ createdAt: -1 });

  const revenue = sales.reduce((acc, s) => acc + s.amount, 0);

  return NextResponse.json({
    success: true,
    data: {
      sales,
      count: sales.length,
      revenue
    }
  });
}