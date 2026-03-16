export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Transaction from "@/models/Transaction";
import Settings from "@/models/settings";
import Projet from "@/models/Projet";
import User from "@/models/User";
import { Resend } from "resend";
import { paymentSuccessTemplate } from "@/lib/emailTemplates/paymentSuccessTemplate";
import MonerooProvider from "@/lib/payment/providers/MonerooProvider";
import { processCommission } from "@/utils/affiliation";
import crypto from "crypto";

// ─── PACKS FIXES ─────────────────────────────────────────────────────────────

const PACK_PLAN = {
  solo_monthly:       "solo",
  solo_quarterly:     "solo",
  createur_monthly:   "createur",
  createur_quarterly: "createur",
  agence_monthly:     "agence",
  agence_quarterly:   "agence",
};

const PACK_CREDITS = {
  solo_monthly:       60,
  solo_quarterly:     180,
  createur_monthly:   330,
  createur_quarterly: 990,
  agence_monthly:     700,
  agence_quarterly:   2100,
};

// ─── PARSER RECHARGE DYNAMIQUE ───────────────────────────────────────────────
// packId format : "recharge_{credits}_{plan}"  ex: "recharge_50_solo"

const RECHARGE_PRICE_PER_CREDIT = {
  free: 150, solo: 100, createur: 100, agence: 100,
};

function parseRechargePackId(packId) {
  const match = packId?.match(/^recharge_(\d+)_(free|solo|createur|agence)$/);
  if (!match) return null;
  const credits = parseInt(match[1]);
  if (credits < 10 || credits > 3000) return null;
  return { credits, plan: null, isRecharge: true };
}

export async function POST(req) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await dbConnect();

    const settings = await Settings.findOne({ key: "global" }).lean();
    const monerooConfig = settings?.payment?.moneroo;
    const provider = new MonerooProvider(monerooConfig);

    const payload = await req.json();
    console.log("📩 [Moneroo] Webhook reçu.");

    const webhookDataRaw = payload.data || payload;
    const monerooTransactionId = webhookDataRaw.id;

    if (!monerooTransactionId) {
      console.warn("⚠️ Webhook sans ID");
      return NextResponse.json({ success: true });
    }

    console.log(`🔍 [Moneroo] Vérification API pour ${monerooTransactionId}...`);
    const verifiedData = await provider.verifyPayment(monerooTransactionId);

    const isPaid = verifiedData.status === "completed";
    const metadata = verifiedData.metadata || {};

    // ─── CHERCHER OU CRÉER LA TRANSACTION ────────────────────────────────────
    let tx = await Transaction.findOne({ providerTransactionId: monerooTransactionId });

    if (!tx) {
      const internalTxId = metadata.transactionId;
      if (internalTxId) tx = await Transaction.findById(internalTxId);
    }

    if (!tx && metadata.packId) {
      if (!isPaid) {
        console.log(`⏳ [Credits] Paiement non confirmé, rien à créer.`);
        return NextResponse.json({ success: true });
      }

      const existing = await Transaction.findOne({ providerTransactionId: monerooTransactionId });
      if (existing) {
        console.log(`⚠️ [Credits] Transaction déjà créée pour ${monerooTransactionId}`);
        return NextResponse.json({ success: true });
      }

      tx = await Transaction.create({
        userId:                metadata.userId,
        provider:              "moneroo",
        purpose:               "credit_pack",
        packId:                metadata.packId,
        amount:                metadata.amount || verifiedData.amount,
        currency:              "XOF",
        status:                "completed",
        completedAt:           new Date(),
        providerTransactionId: monerooTransactionId,
        providerResponse: {
          webhook:      payload,
          verification: verifiedData.rawResponse,
        },
      });

      console.log(`💾 [Credits] Transaction créée: ${tx._id}`);
    }

    if (!tx) {
      console.error("❌ [Moneroo] Transaction introuvable et aucune metadata pour la créer.");
      return NextResponse.json({ success: true });
    }

    // ─── METTRE À JOUR LE STATUT ─────────────────────────────────────────────
    if (tx.status !== "completed") {
      tx.status = verifiedData.status;
      tx.providerTransactionId = verifiedData.transactionId;
      tx.providerResponse = { webhook: payload, verification: verifiedData.rawResponse };
    }

    if (isPaid && !tx.completedAt) {
      tx.completedAt = new Date();
      await tx.save();
      console.log("💰 [Moneroo] Paiement VALIDÉ pour:", tx._id);
    } else if (isPaid && tx.completedAt) {
      console.log(`⚠️ [Moneroo] Transaction ${tx._id} déjà complétée, skip.`);
      return NextResponse.json({ success: true });
    } else {
      await tx.save();
    }

    if (!isPaid) {
      if (verifiedData.status === "failed") {
        tx.status = "failed";
        await tx.save();
        console.log("❌ [Moneroo] Paiement échoué confirmé par API");
      }
      return NextResponse.json({ success: true });
    }

    // ═══════════════════════════════════════════════════════════════════════
    // ✅ FLOW CRÉDITS (purpose === "credit_pack")
    // ═══════════════════════════════════════════════════════════════════════
    if (tx.purpose === "credit_pack" && tx.packId) {

      let credits, plan, isRecharge = false;

      const recharge = parseRechargePackId(tx.packId);
      if (recharge) {
        // Recharge dynamique — crédits sans changement de plan
        credits    = recharge.credits;
        plan       = null;
        isRecharge = true;
      } else {
        // Pack fixe abonnement
        credits = PACK_CREDITS[tx.packId];
        plan    = PACK_PLAN[tx.packId];
      }

      if (!credits) {
        console.error(`❌ [Credits] Pack inconnu ou crédits invalides: ${tx.packId}`);
        return NextResponse.json({ success: true });
      }

      const user = await User.findById(tx.userId);
      if (!user) {
        console.error(`❌ [Credits] User introuvable: ${tx.userId}`);
        return NextResponse.json({ success: true });
      }

      if (isRecharge) {
        // Recharge : addCredits sans plan → ne change pas le plan actuel
        await user.addCredits(credits);
        console.log(`✅ [Recharge] +${credits} crédits (plan inchangé) — User: ${tx.userId}`);
      } else {
        // Abonnement : crédits + mise à jour du plan
        await user.addCredits(credits, plan);
        console.log(`✅ [Credits] +${credits} crédits — Plan: ${plan} — User: ${tx.userId}`);
      }

      // Email confirmation
      try {
        const label = isRecharge
          ? `Recharge ${credits} crédits`
          : `Pack ${tx.packId.replace(/_/g, " ")} — ${credits} crédits`;

        await resend.emails.send({
          from:    "Bookzy <no-reply@bookzy.io>",
          to:      user.email,
          subject: `✅ ${credits} crédits ajoutés à votre compte Bookzy`,
          html: paymentSuccessTemplate({
            firstName:     user.firstName || "cher utilisateur",
            amount:        tx.amount,
            transactionId: tx.internalId || tx._id.toString(),
            ebookTitle:    label,
          }),
        });
        console.log(`📧 [Credits] Email envoyé à ${user.email}`);
      } catch (e) {
        console.error("❌ [Credits] Erreur email:", e.message);
      }

      // Affiliation
      try {
        await processCommission(tx.userId, tx.amount);
      } catch (affError) {
        console.error("⚠️ Erreur affiliation:", affError.message);
      }

      return NextResponse.json({ success: true });
    }

    // ═══════════════════════════════════════════════════════════════════════
    // ANCIEN FLOW : GÉNÉRATION EBOOK (purpose === "ebook_kit")
    // ═══════════════════════════════════════════════════════════════════════

    if (tx.projetId) {
      await Projet.findByIdAndUpdate(tx.projetId, {
        isPaid:        true,
        status:        "processing",
        progress:      5,
        updatedAt:     new Date(),
        transactionId: tx._id,
      });

      console.log(`🚀 [Moneroo] Démarrage génération pour projet ${tx.projetId}`);

      const projet = await Projet.findById(tx.projetId);
      const isExpress = projet?.expressMode === true;

      const baseUrl = process.env.NODE_ENV === "production"
        ? "https://app.bookzy.io"
        : "http://localhost:3000";

      const generateUrl = isExpress
        ? `${baseUrl}/api/express/generate`
        : `${baseUrl}/api/ebooks/generate`;

      fetch(generateUrl, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projetId:      tx.projetId.toString(),
          transactionId: tx._id.toString(),
          force:         true,
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log("✅ [Moneroo] Réponse génération:", data))
        .catch((err) => console.error("❌ [Moneroo] Erreur génération:", err.message));
    }

    if (tx.userId) {
      try {
        await processCommission(tx.userId, tx.amount);
      } catch (affError) {
        console.error("⚠️ Erreur non-critique Affiliation:", affError.message);
      }
    }

    if (tx.userId) {
      const user = await User.findById(tx.userId);
      if (user) {
        try {
          await resend.emails.send({
            from:    "Bookzy <no-reply@bookzy.io>",
            to:      user.email,
            subject: "🎉 Paiement confirmé - Bookzy",
            html: paymentSuccessTemplate({
              firstName:     user.firstName || "cher utilisateur",
              amount:        tx.amount,
              transactionId: tx.internalId || "Moneroo",
              ebookTitle:    tx.kitData?.title || "Ton eBook",
            }),
          });
        } catch (e) {
          console.error("❌ Erreur Email:", e);
        }
      }
    }

    if (tx.userId && process.env.FACEBOOK_ACCESS_TOKEN) {
      try {
        const user = await User.findById(tx.userId);
        const eventId = `purchase_${tx._id}_${Date.now()}`;

        await fetch(
          `https://graph.facebook.com/v18.0/9384354691604798/events?access_token=${process.env.FACEBOOK_ACCESS_TOKEN}`,
          {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              data: [{
                event_name:       "Purchase",
                event_id:         eventId,
                event_time:       Math.floor(Date.now() / 1000),
                event_source_url: "https://app.bookzy.io",
                user_data: {
                  em: user?.email
                    ? crypto.createHash("sha256").update(user.email.toLowerCase().trim()).digest("hex")
                    : null,
                  fn: user?.firstName
                    ? crypto.createHash("sha256").update(user.firstName.toLowerCase().trim()).digest("hex")
                    : null,
                },
                custom_data: {
                  currency:     "XOF",
                  value:        tx.amount,
                  content_name: tx.kitData?.title || "Ebook Bookzy",
                  content_type: "product",
                },
                action_source: "website",
              }],
            }),
          }
        );
        console.log(`✅ [Facebook] Purchase event envoyé (event_id: ${eventId})`);
      } catch (fbErr) {
        console.error("❌ [Facebook] Erreur pixel:", fbErr.message);
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("❌ [Moneroo] Webhook Crash:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}