export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// 🛡️ SÉCURITÉ
async function checkAdmin() {
  const cookieStore = cookies();
  const token = cookieStore.get("bookzy_token")?.value || 
                cookieStore.get("admin_token")?.value || 
                cookieStore.get("token")?.value;
  if (!token) return false;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await dbConnect();
    const user = await User.findById(decoded.id);
    return user && (user.role === "admin" || user.role === "super_admin");
  } catch (error) { return false; }
}

export async function GET(req) {
  try {
    await dbConnect();

    // 1. Vérification Admin
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "Interdit" }, { status: 403 });
    }

    // 2. 🚀 AGRÉGATION : Calcul rapide par la base de données
    const topSponsors = await User.aggregate([
      { 
        $project: { 
          firstName: 1, lastName: 1, email: 1, avatar: 1, 
          wallet: 1, referralCount: 1 
        } 
      },
      // Join Filleuls
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "referredBy",
          as: "referralsData"
        }
      },
      // Join Commissions
      {
        $lookup: {
          from: "commissions",
          localField: "_id",
          foreignField: "affiliateId",
          as: "commissionsData"
        }
      },
      // Calculs
      {
        $addFields: {
          calculatedReferrals: { $size: "$referralsData" },
          calculatedEarnings: {
            $reduce: {
              input: {
                $filter: {
                  input: "$commissionsData",
                  as: "c",
                  cond: { $eq: ["$$c.status", "VALIDATED"] }
                }
              },
              initialValue: 0,
              in: { $add: ["$$value", "$$this.amount"] }
            }
          }
        }
      },
      // Filtre (Garde ceux qui ont de l'activité)
      {
        $match: {
          $or: [
            { calculatedReferrals: { $gt: 0 } },
            { calculatedEarnings: { $gt: 0 } },
            { "wallet.totalEarned": { $gt: 0 } }
          ]
        }
      },
      // Tri
      { $sort: { calculatedEarnings: -1 } },
      // Limite
      { $limit: 20 }
    ]);

    // 3. FORMATAGE (C'est ICI qu'on corrige le problème d'affichage du 0)
    const formattedData = topSponsors.map(u => {
      // On prend le maximum entre le calcul et ce qui est dans la DB
      const realTotalEarned = Math.max(u.calculatedEarnings || 0, u.wallet?.totalEarned || 0);
      const realReferralCount = Math.max(u.calculatedReferrals || 0, u.referralCount || 0);

      return {
        _id: u._id,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        avatar: u.avatar,
        
        // Données à plat (pour certains tableaux)
        referralCount: realReferralCount,
        totalReferrals: realReferralCount,
        totalEarned: realTotalEarned,

        // 👇 CORRECTION MAJEURE : On recrée l'objet "wallet"
        // Si ton Admin cherche "user.wallet.totalEarned", il va enfin le trouver !
        wallet: {
            balance: u.wallet?.balance || 0,
            totalEarned: realTotalEarned
        }
      };
    });

    return NextResponse.json({ success: true, data: formattedData });

  } catch (error) {
    console.error("❌ Admin Sponsors Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}