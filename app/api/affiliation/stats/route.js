export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import Commission from "@/models/Commission";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { createAffiliateCode } from "@/utils/affiliation";

async function getUserIdFromToken() {
  const token = cookies().get("bookzy_token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch (error) {
    return null;
  }
}

export async function GET(req) {
  try {
    await dbConnect();
    const userId = await getUserIdFromToken();

    if (!userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

    // 🔧 AUTO-RÉPARATION 1 : Code Parrain manquant
    let hasChanges = false; // On va traquer s'il faut sauvegarder
    if (!user.affiliateCode) {
      user.affiliateCode = await createAffiliateCode(user.firstName || "User");
      if (!user.wallet) user.wallet = { balance: 0, totalEarned: 0 };
      hasChanges = true;
    }

    // 🔧 AUTO-RÉPARATION 2 : Compteur manquant (Ton problème actuel)
    // On recompte TOUJOURS le vrai nombre de filleuls dans la base
    const realReferralCount = await User.countDocuments({ referredBy: userId });

    // Si le chiffre stocké dans le user est différent du vrai chiffre (ou s'il n'existe pas)
    if (user.referralCount !== realReferralCount) {
      console.log(`🔄 Mise à jour compteur pour ${user.email} : ${user.referralCount || 0} -> ${realReferralCount}`);
      user.referralCount = realReferralCount;
      hasChanges = true;
    }

    // Si on a fait des modifs (Code ou Compteur), on sauvegarde !
    if (hasChanges) {
      await user.save();
    }

    // --- 📊 CALCULS GRAPHIQUES ---
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0,0,0,0);

    const commissionsLast7Days = await Commission.find({
      affiliateId: userId,
      status: "VALIDATED",
      createdAt: { $gte: sevenDaysAgo }
    });

    const referralsLast7Days = await User.find({
      referredBy: userId,
      createdAt: { $gte: sevenDaysAgo }
    });

    let earningsChart = [];
    let referralsChart = [];
    const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayLabel = days[d.getDay()];
      const startOfDay = new Date(d); startOfDay.setHours(0,0,0,0);
      const endOfDay = new Date(d); endOfDay.setHours(23,59,59,999);

      const dailyEarnings = commissionsLast7Days
        .filter(c => c.createdAt >= startOfDay && c.createdAt <= endOfDay)
        .reduce((sum, c) => sum + c.amount, 0);

      const dailyReferrals = referralsLast7Days
        .filter(u => u.createdAt >= startOfDay && u.createdAt <= endOfDay)
        .length;

      earningsChart.push({ date: dayLabel, montant: dailyEarnings });
      referralsChart.push({ date: dayLabel, inscrits: dailyReferrals });
    }

    const recentCommissions = await Commission.find({ affiliateId: userId })
      .sort({ createdAt: -1 }).limit(10).populate("referredUserId", "firstName");

    return NextResponse.json({
      success: true,
      data: {
        affiliateCode: user.affiliateCode,
        referralLink: `${process.env.NEXT_PUBLIC_URL}?ref=${user.affiliateCode}`,
        wallet: {
          balance: user.wallet?.balance || 0,
          totalEarned: user.wallet?.totalEarned || 0,
        },
        stats: {
          totalReferrals: realReferralCount, // ✅ On envoie le vrai chiffre calculé
        },
        charts: {
          earnings: earningsChart,
          referrals: referralsChart
        },
        history: recentCommissions
      }
    });

  } catch (error) {
    console.error("❌ Erreur API Stats:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}