export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const CLOSE_DATE = "12 avril 2026"; // ← change cette date

function emailTemplate({ firstName }) {
  const prenom = firstName || "cher utilisateur";
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Importante mise à jour sur ta boutique Bookzy</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

        <!-- LOGO -->
        <tr><td style="padding-bottom:28px;text-align:center;">
          <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
            <tr>
              <td style="width:36px;height:36px;background:#0f172a;border-radius:9px;text-align:center;vertical-align:middle;padding:0 8px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
              </td>
              <td style="padding-left:10px;font-size:20px;font-weight:800;color:#0f172a;vertical-align:middle;">Bookzy</td>
            </tr>
          </table>
        </td></tr>

        <!-- CARD -->
        <tr><td style="background:white;border-radius:16px;padding:36px 32px;border:1px solid #e2e8f0;">

          <!-- BADGE -->
          <table cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
            <tr>
              <td style="background:#eef2ff;border:1px solid #c7d2fe;border-radius:20px;padding:4px 12px;">
                <span style="font-size:11px;font-weight:700;color:#4338ca;text-transform:uppercase;letter-spacing:0.08em;">Collaboration officielle</span>
              </td>
            </tr>
          </table>

          <h1 style="font-size:22px;font-weight:900;color:#0f172a;margin:0 0 16px;line-height:1.3;">
            Bookzy s'associe à Taliopay pour toi
          </h1>

          <p style="font-size:14px;color:#374151;margin:0 0 8px;line-height:1.7;">
            Bonjour ${prenom},
          </p>

          <p style="font-size:14px;color:#374151;margin:0 0 16px;line-height:1.7;">
            On a une grande nouvelle. Bookzy vient de s'associer officiellement avec <strong>Taliopay</strong>  la plateforme de vente de produits digitaux conçue spécialement pour l'Afrique francophone.
          </p>

          <p style="font-size:14px;color:#374151;margin:0 0 24px;line-height:1.7;">
            Grâce à cette collaboration, tu vas pouvoir vendre tes ebooks et produits digitaux avec une boutique professionnelle, encaisser via Mobile Money, et recevoir ton argent instantanément — sans abonnement mensuel.
          </p>

          <!-- TALIOPAY PITCH -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;border-radius:14px;margin-bottom:24px;">
            <tr><td style="padding:24px;">
              <p style="font-size:18px;font-weight:900;color:white;margin:0 0 4px;line-height:1.3;">Boutique en 1 minute.</p>
              <p style="font-size:18px;font-weight:900;color:white;margin:0 0 4px;line-height:1.3;">Retrait instantané.</p>
              <p style="font-size:18px;font-weight:900;color:white;margin:0 0 16px;line-height:1.3;">Vends partout dans le monde.</p>
              <p style="font-size:13px;color:#64748b;margin:0 0 20px;line-height:1.6;">Taliopay est conçu pour les créateurs africains. Mobile Money natif, zéro abonnement, livraison automatique.</p>

              <table width="100%" cellpadding="0" cellspacing="0">
                ${[
                  { emoji: "⚡", title: "Retrait instantané", desc: "Wave, Orange Money, MTN, Moov — dès que tu vends" },
                  { emoji: "🌍", title: "+140 pays", desc: "Mobile Money en Afrique + carte bancaire partout" },
                  { emoji: "🤖", title: "Livraison automatique", desc: "Ton client reçoit son fichier en quelques secondes" },
                  { emoji: "🔁", title: "Relance automatique", desc: "4 emails de relance si un client abandonne son panier" },
                  { emoji: "💰", title: "Zéro abonnement", desc: "10% par vente seulement — tu gardes 90%" },
                ].map(item => `
                <tr>
                  <td style="padding:6px 0;vertical-align:top;width:28px;font-size:16px;">${item.emoji}</td>
                  <td style="padding:6px 0 6px 8px;vertical-align:top;">
                    <span style="font-size:13px;font-weight:700;color:white;display:block;">${item.title}</span>
                    <span style="font-size:12px;color:#64748b;">${item.desc}</span>
                  </td>
                </tr>`).join("")}
              </table>
            </td></tr>
          </table>

          <p style="font-size:14px;color:#374151;margin:0 0 20px;line-height:1.7;">
            Dans le cadre de cette collaboration, Smart Shop sera remplacé par Taliopay à partir du <strong>${CLOSE_DATE}</strong>. Tes données (produits, leads) restent disponibles jusqu'à cette date.
          </p>

          <!-- CTA -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
            <tr><td style="text-align:center;">
              <a href="https://taliopay.com" style="display:inline-block;background:#6366f1;color:white;font-size:15px;font-weight:800;padding:16px 36px;border-radius:12px;text-decoration:none;">
                Créer ma boutique Taliopay →
              </a>
            </td></tr>
          </table>
          <p style="font-size:11px;color:#94a3b8;text-align:center;margin:0 0 16px;">
            Gratuit. Boutique active en moins d'une minute.
          </p>

          <p style="font-size:13px;color:#64748b;text-align:center;margin:0;line-height:1.6;">
            Des questions ? Réponds directement à cet email — on est là pour t'aider à migrer.
          </p>

        </td></tr>

        <!-- FOOTER -->
        <tr><td style="padding:24px 0;text-align:center;">
          <p style="font-size:12px;color:#94a3b8;margin:0 0 6px;">
            Merci de faire partie de l'aventure Bookzy.
          </p>
          <p style="font-size:12px;color:#94a3b8;margin:0;">
            © 2026 Bookzy ·
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="color:#94a3b8;">Accéder à mon compte</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(req) {
  try {
    await dbConnect();
    const { authorized } = await verifyAdmin(req);
    if (!authorized) return NextResponse.json({ success: false }, { status: 403 });

    const { dryRun = true, testEmail = null } = await req.json().catch(() => ({}));

    const Shop = (await import("@/models/Shop")).default;
    const User = (await import("@/models/User")).default;

    // Mode test — envoyer à un seul email
    if (testEmail) {
      const user = await User.findOne({ email: testEmail }).select("email firstName name").lean();
      if (!user) return NextResponse.json({ success: false, message: "User non trouvé" }, { status: 404 });
      await resend.emails.send({
        from: "Bookzy <noreply@bookzy.io>",
        to: user.email,
        subject: "Une grande nouvelle pour ta boutique Bookzy",
        html: emailTemplate({ firstName: user.firstName || user.name?.split(" ")[0] || "" }),
      });
      return NextResponse.json({ success: true, testEmail, message: "Email de test envoyé" });
    }

    // Récupérer toutes les boutiques actives ou publiées
    const shops = await Shop.find({
      $or: [{ isActive: true }, { isPublished: true }],
    }).select("userId").lean();

    const userIds = shops.map(s => s.userId);
    const users = await User.find({ _id: { $in: userIds } }).select("email firstName name").lean();

    if (dryRun) {
      return NextResponse.json({
        success: true,
        dryRun: true,
        count: users.length,
        emails: users.map(u => u.email),
      });
    }

    // Envoi par batch de 10 pour éviter le rate limit Resend
    let sent = 0;
    let failed = 0;
    const errors = [];

    for (let i = 0; i < users.length; i += 10) {
      const batch = users.slice(i, i + 10);
      await Promise.allSettled(batch.map(async (user) => {
        try {
          await resend.emails.send({
            from: "Bookzy <noreply@bookzy.io>",
            to: user.email,
            subject: "Une grande nouvelle pour ta boutique Bookzy",
            html: emailTemplate({
              firstName: user.firstName || user.name?.split(" ")[0] || "",
            }),
          });
          sent++;
        } catch (e) {
          failed++;
          errors.push({ email: user.email, error: e.message });
        }
      }));
      // Pause 500ms entre chaque batch
      if (i + 10 < users.length) await new Promise(r => setTimeout(r, 500));
    }

    console.log(`📧 [MIGRATION] Smart Shop → Taliopay : ${sent} envoyés, ${failed} échoués`);

    return NextResponse.json({ success: true, sent, failed, errors });

  } catch (e) {
    console.error("❌ Migration email error:", e);
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}