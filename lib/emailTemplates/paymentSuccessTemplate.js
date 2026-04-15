// lib/emailTemplates/paymentSuccessTemplate.js

export function paymentSuccessTemplate({ firstName, amount, transactionId, ebookTitle }) {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Paiement confirmé - Bookzy</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #334155; }
    table { border-spacing: 0; width: 100%; }
    td { padding: 0; }
    img { border: 0; }
    .wrapper { width: 100%; table-layout: fixed; background-color: #f8fafc; padding-bottom: 40px; }
    .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05); }
    .header { padding: 32px 40px; text-align: center; border-bottom: 1px solid #f1f5f9; }
    .header a { text-decoration: none; }
    .logo-text { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 26px; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -0.5px; text-transform: none; display: inline-block; }
    .logo-dot { color: #3b82f6; }
    .content-box { padding: 40px 40px; }
    .h2 { font-size: 24px; font-weight: 700; color: #0f172a; margin: 0 0 16px; letter-spacing: -0.5px; text-align: center; }
    .text { font-size: 16px; line-height: 26px; color: #475569; margin: 0 0 24px; }
    .center { text-align: center; }
    .btn-container { text-align: center; margin: 32px 0; }
    .btn { background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 700; font-size: 16px; display: inline-block; mso-padding-alt: 0; text-align: center; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.2); }
    .status-box { background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 16px 20px; border-radius: 8px; margin-bottom: 24px; }
    .status-text { margin: 0; font-size: 14px; color: #065f46; line-height: 1.6; }
    .detail-box { background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
    .footer { background-color: #f8fafc; padding: 32px 40px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
    .footer a { color: #64748b; font-weight: 600; text-decoration: underline; }
  </style>
</head>
<body>
  
  <center class="wrapper">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" class="main">
      
      <tr>
        <td class="header">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}" target="_blank">
            <span class="logo-text">Bookzy<span class="logo-dot">.</span></span>
          </a>
        </td>
      </tr>

      <tr>
        <td>
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            
            <tr>
              <td class="content-box" style="text-align: center; padding-bottom: 20px;">
                <div style="display: inline-block; width: 60px; height: 60px; background: #ecfdf5; border-radius: 12px; margin-bottom: 16px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2); font-size: 32px; line-height: 60px; color: #10b981; border: 1px solid #d1fae5;">
                  ✓
                </div>
                <h2 style="margin: 0 0 12px; font-size: 32px; font-weight: 800; color: #1f2937;">
                  Paiement confirmé !
                </h2>
                <p style="margin: 0; font-size: 17px; color: #64748b;">
                  Merci <strong>${firstName}</strong> 🎉
                </p>
              </td>
            </tr>

            <tr>
              <td class="content-box" style="padding-top: 0;">
                
                <p class="text">
                  Ton paiement a été traité avec succès. Ton ebook est en cours de génération ! Tu trouveras ci-dessous les détails de ta commande.
                </p>

                <div class="detail-box">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                        <p style="margin: 0; font-size: 14px; color: #6b7280;">Produit</p>
                      </td>
                      <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
                        <p style="margin: 0; font-size: 14px; color: #1f2937; font-weight: 600;">${ebookTitle || 'Pack complet Bookzy'}</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                        <p style="margin: 0; font-size: 14px; color: #6b7280;">Montant total</p>
                      </td>
                      <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
                        <p style="margin: 0; font-size: 14px; color: #1f2937; font-weight: 700;">${amount} FCFA</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0;">
                        <p style="margin: 0; font-size: 14px; color: #6b7280;">Transaction ID</p>
                      </td>
                      <td style="padding: 8px 0; text-align: right;">
                        <p style="margin: 0; font-size: 12px; color: #9ca3af; font-family: monospace;">${transactionId}</p>
                      </td>
                    </tr>
                  </table>
                </div>

                <div class="status-box">
                  <p class="status-text">
                    <strong>⏱️ Temps de génération :</strong> 1 minutes. Tu recevras un email dès que ton ebook sera prêt !
                  </p>
                </div>

                <div class="btn-container">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/projects" class="btn">
                    Voir mes projets
                  </a>
                </div>

                <!-- BLOC TALIOPAY -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 8px;">
                  <tr>
                    <td style="background: linear-gradient(135deg, #0f172a, #1e293b); border-radius: 12px; padding: 24px 28px;">
                      <p style="margin: 0 0 4px; font-size: 11px; font-weight: 700; letter-spacing: 2px; color: #94a3b8; text-transform: uppercase;">💰 Monétise ton ebook</p>
                      <p style="margin: 0 0 6px; font-size: 18px; font-weight: 800; color: #ffffff;">Vends cet ebook et encaisse par Mobile Money</p>
                      <p style="margin: 0 0 20px; font-size: 14px; color: #94a3b8; line-height: 1.6;">Crée ta boutique en ligne, fixe ton prix et reçois tes paiements directement sur ton mobile — en FCFA, partout en Afrique.</p>
                      <a href="https://taliopay.com" target="_blank"
                        style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4);">
                        Vendre sur Taliopay →
                      </a>
                    </td>
                  </tr>
                </table>

              </td>
            </tr>

          </table>
        </td>
      </tr>

      <tr>
        <td class="footer">
          <p style="margin: 0 0 8px;">
            Questions ? <a href="mailto:support@bookzy.io" style="color: #64748b;">support@bookzy.io</a>
          </p>
          <p style="margin: 0;">
            Siège Social: New Jersey, USA • <a href="https://bookzy.io">www.bookzy.io</a>
          </p>
        </td>
      </tr>

    </table>
  </center>

</body>
</html>
  `;
}