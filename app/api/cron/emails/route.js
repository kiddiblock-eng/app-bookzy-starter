export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Resend } from "resend";
import { youbookRelanceTemplate } from "@/lib/emailTemplates/youbookRelanceTemplate";
import { ebookRelanceTemplate } from "@/lib/emailTemplates/ebookRelanceTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);
const CRON_SECRET = process.env.CRON_SECRET;

function analyseurEmailTemplate({ firstName, sujet }) {
  const prenom = firstName || "toi";
  const lien = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/analyseur/historique`;
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;"><tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
      <tr><td style="background:white;border-radius:16px;padding:36px 32px;border:1px solid #e2e8f0;">
        <h1 style="font-size:22px;font-weight:900;color:#0f172a;margin:0 0 16px;">Le marché de ton sujet a bougé 🔥</h1>
        <p style="font-size:14px;color:#64748b;margin:0 0 20px;">Bonjour ${prenom}, de nouveaux annonceurs investissent sur "${sujet}".</p>
        <a href="${lien}" style="display:inline-block;background:#f59e0b;color:#0f172a;font-size:15px;font-weight:800;padding:14px 28px;border-radius:12px;text-decoration:none;">Voir mon rapport →</a>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

export async function GET(req) {
  const cronSecret = req.headers.get("x-cron-secret") || new URL(req.url).searchParams.get("secret");
  if (cronSecret !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    // ── PLAN EXPIRY ────────────────────────────────────────────────────────
    let expiredCount = 0;
    try {
      const User = (await import("@/models/User")).default;
      const now = new Date();
      const expiredUsers = await User.find({
        plan: { $in: ["solo", "createur", "agence"] },
        planExpiresAt: { $lt: now },
      }).select("email firstName plan credits");

      for (const u of expiredUsers) {
        u.plan = "free";
        await u.save();
        expiredCount++;
        console.log(`⏰ [CRON] Plan ${u.plan} expiré → free — ${u.email}`);

        // Email notification
        try {
          await resend.emails.send({
            from: "Bookzy <noreply@bookzy.io>",
            to: u.email,
            subject: "Votre abonnement Bookzy a expiré",
            html: `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;"><tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
      <tr><td style="background:white;border-radius:16px;padding:36px 32px;border:1px solid #e2e8f0;">
        <h1 style="font-size:22px;font-weight:900;color:#0f172a;margin:0 0 16px;">Votre abonnement a expiré 🔔</h1>
        <p style="font-size:15px;color:#64748b;margin:0 0 12px;">Bonjour ${u.firstName || "cher utilisateur"},</p>
        <p style="font-size:14px;color:#64748b;margin:0 0 16px;">Votre abonnement Bookzy est arrivé à expiration. Votre compte est maintenant en plan gratuit.</p>
        <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:12px;padding:16px;margin:0 0 20px;">
          <p style="font-size:14px;color:#166534;font-weight:700;margin:0 0 4px;">✅ Vos crédits sont conservés</p>
          <p style="font-size:13px;color:#166534;margin:0;">Vous avez encore <strong>${u.credits?.balance || 0} crédits</strong> disponibles. Ils n'expirent jamais.</p>
        </div>
        <p style="font-size:14px;color:#64748b;margin:0 0 24px;">Pour continuer à profiter de tous les avantages Bookzy (quotas gratuits, prix réduits, outils de recherche), renouvelez votre abonnement.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/tarifs" style="display:inline-block;background:#2563eb;color:white;font-size:15px;font-weight:800;padding:14px 28px;border-radius:12px;text-decoration:none;">Renouveler mon abonnement →</a>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`,
          });
          console.log(`📧 [CRON] Email expiration envoyé → ${u.email}`);
        } catch (emailErr) {
          console.error(`❌ [CRON] Email expiration échoué → ${u.email}:`, emailErr.message);
        }
      }
    } catch (e) {
      console.error("❌ [CRON] Erreur plan_expiry:", e.message);
    }

    // ── EMAIL JOBS ─────────────────────────────────────────────────────────
    const EmailJob = (await import("@/models/EmailJob")).default;

    const jobs = await EmailJob.find({
      status: "pending",
      sendAt: { $lte: new Date() },
    }).limit(50);

    if (!jobs.length) {
      return NextResponse.json({ success: true, sent: 0, expired: expiredCount, message: "Aucun job en attente" });
    }

    let sent = 0;
    let failed = 0;

    for (const job of jobs) {
      try {
        if (job.type === "analyseur_relance") {
          await resend.emails.send({
            from: "Bookzy <noreply@bookzy.io>",
            to: job.email,
            subject: `📊 Votre analyse de "${job.payload.sujet}" a évolué`,
            html: analyseurEmailTemplate({ firstName: job.firstName || "", sujet: job.payload.sujet }),
          });
        }

        if (job.type === "youbook_relance") {
          const subjects = [
            `Ton ebook "${job.payload.titre}" attend toujours`,
            `Le marché autour de "${job.payload.titre}" est en mouvement`,
            `Dernière chance — ton ebook "${job.payload.titre}"`,
          ];
          await resend.emails.send({
            from: "Bookzy <noreply@bookzy.io>",
            to: job.email,
            subject: subjects[(job.payload.emailIndex || 1) - 1] || subjects[0],
            html: youbookRelanceTemplate({
              firstName:  job.firstName || "",
              titre:      job.payload.titre,
              sommaire:   job.payload.sommaire || [],
              emailIndex: job.payload.emailIndex || 1,
            }),
          });
        }

        if (job.type === "ebook_relance") {
          const subjects = [
            `Ton ebook "${job.payload.titre}" t'attend`,
            `Le marché de "${job.payload.titre}" est en train de bouger`,
            `Tu n'as pas terminé "${job.payload.titre}"`,
            `Dernière chance — ton ebook "${job.payload.titre}"`,
          ];
          await resend.emails.send({
            from: "Bookzy <noreply@bookzy.io>",
            to: job.email,
            subject: subjects[(job.payload.emailIndex || 1) - 1] || subjects[0],
            html: ebookRelanceTemplate({
              firstName:  job.firstName || "",
              titre:      job.payload.titre,
              sommaire:   job.payload.sommaire || [],
              emailIndex: job.payload.emailIndex || 1,
            }),
          });
        }

        await EmailJob.findByIdAndUpdate(job._id, { status: "sent", sentAt: new Date() });
        sent++;
        console.log(`📧 [CRON] ${job.type} → ${job.email}`);

      } catch (e) {
        await EmailJob.findByIdAndUpdate(job._id, { status: "failed", error: e.message });
        failed++;
        console.error(`❌ [CRON] Échec ${job.email}:`, e.message);
      }
    }

    return NextResponse.json({ success: true, sent, failed, expired: expiredCount });
  } catch (e) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}