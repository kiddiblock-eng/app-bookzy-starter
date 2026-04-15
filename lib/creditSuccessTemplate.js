// lib/emailTemplates/creditSuccessTemplate.js

export function creditSuccessTemplate({ firstName, amount, transactionId, credits, plan, isRecharge }) {
  const planLabels = {
    solo: "Pass Solo",
    createur: "Pack Créateur",
    agence: "Pack Agence",
  };

  const produit = isRecharge
    ? `Recharge ${credits} crédits`
    : `${planLabels[plan] || plan} — ${credits} crédits`;

  const message = isRecharge
    ? `Tes <strong>${credits} crédits</strong> ont été ajoutés à ton compte. Tu peux maintenant générer tes ebooks.`
    : `Bienvenue sur le <strong>${planLabels[plan] || plan}</strong> ! Tes <strong>${credits} crédits</strong> sont disponibles immédiatement.`;

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Crédits ajoutés - Bookzy</title>
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

          <!-- ICONE -->
          <div style="text-align:center;margin-bottom:20px;">
            <div style="display:inline-block;width:60px;height:60px;background:#eef2ff;border-radius:14px;line-height:60px;font-size:28px;border:1px solid #c7d2fe;">
              ✅
            </div>
          </div>

          <!-- TITRE -->
          <h1 style="font-size:24px;font-weight:900;color:#0f172a;margin:0 0 8px;text-align:center;line-height:1.3;">
            Paiement confirmé !
          </h1>
          <p style="font-size:15px;color:#64748b;text-align:center;margin:0 0 28px;">
            Merci <strong>${firstName}</strong> — tes crédits sont disponibles.
          </p>

          <!-- MESSAGE -->
          <p style="font-size:14px;color:#374151;margin:0 0 24px;line-height:1.7;">
            ${message}
          </p>

          <!-- CRÉDITS BADGE -->
          <div style="background:#0f172a;border-radius:12px;padding:20px 24px;margin-bottom:24px;text-align:center;">
            <p style="font-size:12px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 8px;">Crédits ajoutés</p>
            <p style="font-size:48px;font-weight:900;color:white;margin:0;line-height:1;">
              +${credits}
              <span style="font-size:16px;color:#64748b;font-weight:500;"> crédits</span>
            </p>
          </div>

          <!-- DÉTAILS -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;margin-bottom:24px;">
            <tr><td style="padding:16px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:7px 0;border-bottom:1px solid #e2e8f0;">
                    <span style="font-size:13px;color:#64748b;">Produit</span>
                  </td>
                  <td style="padding:7px 0;border-bottom:1px solid #e2e8f0;text-align:right;">
                    <span style="font-size:13px;font-weight:700;color:#0f172a;">${produit}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:7px 0;border-bottom:1px solid #e2e8f0;">
                    <span style="font-size:13px;color:#64748b;">Montant</span>
                  </td>
                  <td style="padding:7px 0;border-bottom:1px solid #e2e8f0;text-align:right;">
                    <span style="font-size:13px;font-weight:700;color:#0f172a;">${amount} FCFA</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:7px 0;">
                    <span style="font-size:13px;color:#64748b;">Transaction</span>
                  </td>
                  <td style="padding:7px 0;text-align:right;">
                    <span style="font-size:11px;color:#94a3b8;font-family:monospace;">${transactionId}</span>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>

          <!-- CTA -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
            <tr><td style="text-align:center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/projets/nouveau" style="display:inline-block;background:#6366f1;color:white;font-size:14px;font-weight:800;padding:14px 32px;border-radius:12px;text-decoration:none;">
                Générer mon ebook maintenant →
              </a>
            </td></tr>
          </table>
          <p style="font-size:11px;color:#94a3b8;text-align:center;margin:0;">
            1 ebook = 20 crédits
          </p>

        </td></tr>

        <!-- FOOTER -->
        <tr><td style="padding:24px 0;text-align:center;">
          <p style="font-size:12px;color:#94a3b8;margin:0 0 6px;">
            Questions ? <a href="mailto:support@bookzy.io" style="color:#94a3b8;">support@bookzy.io</a>
          </p>
          <p style="font-size:12px;color:#94a3b8;margin:0;">
            © 2026 Bookzy · <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="color:#94a3b8;">Accéder à mon compte</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
  `;
}