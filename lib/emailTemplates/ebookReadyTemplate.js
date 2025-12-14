// lib/emailTemplates/ebookReadyTemplate.js

export function ebookReadyTemplate({ firstName, ebookTitle, projectId }) {
  const downloadLink = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/projects/${projectId}`;
  
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ton ebook est prêt ! - Bookzy</title>
  <style>
    /* Reset & Base */
    body { margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #334155; }
    table { border-spacing: 0; width: 100%; }
    td { padding: 0; }
    img { border: 0; }
    
    /* Container */
    .wrapper { width: 100%; table-layout: fixed; background-color: #f8fafc; padding-bottom: 40px; }
    .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05); }
    
    /* Header */
    .header { padding: 32px 40px; text-align: center; border-bottom: 1px solid #f1f5f9; }
    .header a { text-decoration: none; }

    /* --- LOGO TEXTE (STYLE BOOKZY) --- */
    .logo-text {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 26px;
      font-weight: 800; /* Extra Bold */
      color: #0f172a;   /* Slate-900 */
      margin: 0;
      letter-spacing: -0.5px;
      text-transform: none;
      display: inline-block;
    }
    .logo-dot { color: #3b82f6; } /* Le point bleu */
    
    /* Content */
    .content-box { padding: 40px 40px; }
    .h2 { font-size: 24px; font-weight: 700; color: #0f172a; margin: 0 0 16px; letter-spacing: -0.5px; text-align: center; }
    .text { font-size: 16px; line-height: 26px; color: #475569; margin: 0 0 24px; }
    
    /* Button (Primary: Slate-900) */
    .btn-container { text-align: center; margin: 32px 0; }
    .btn { background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 700; font-size: 16px; display: inline-block; mso-padding-alt: 0; text-align: center; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.2); }
    
    /* Callout Box (Produits Inclus) */
    .included-box { background-color: #f1f5f9; border-radius: 12px; padding: 24px; margin-bottom: 32px; }
    .included-list { margin: 0; padding-left: 20px; color: #475569; line-height: 1.8; font-size: 15px; }

    /* Conseil Box (Jaune) */
    .tip-box { background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px 20px; border-radius: 8px; margin-bottom: 24px; }
    .tip-text { margin: 0; font-size: 14px; color: #92400e; line-height: 1.6; }

    /* Footer Link Box */
    .footer-link-box { background: #f1f5f9; border-radius: 12px; padding: 20px; text-align: center; }
    .footer-link { color: #0f172a; font-weight: 600; text-decoration: none; }

    /* Footer */
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
                <div style="font-size: 60px; line-height: 1; margin-bottom: 16px;">
                  🥳
                </div>
                <h2 class="h2">
                  C'est prêt !
                </h2>
                <p style="margin: 0; font-size: 17px; color: #64748b;">
                  Salut ${firstName}, ton ebook est terminé ! 
                </p>
              </td>
            </tr>

            <tr>
              <td class="content-box" style="padding-top: 0;">
                <p class="text">
                  Félicitations ! L'IA a terminé la génération de ton projet <strong>"${ebookTitle}"</strong>.
                  Ton pack complet est maintenant disponible sur ton tableau de bord.
                </p>

                <div class="included-box">
                  <h3 style="margin: 0 0 16px; font-size: 16px; font-weight: 700; color: #1f2937;">
                    📦 Ce qui t'attend :
                  </h3>
                  <ul class="included-list">
                    <li style="margin-bottom: 8px;">📄 Ebook PDF professionnel et mis en page.
                    <li style="margin-bottom: 0;">✍️ Fichiers marketing & description de vente optimisée.</li>
                  </ul>
                </div>

                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td align="center" style="padding-bottom: 24px;">
                      <a href="${downloadLink}" class="btn">
                        Télécharger mon pack complet
                      </a>
                    </td>
                  </tr>
                </table>

                <div class="tip-box">
                  <p class="tip-text">
                    <strong>💡 Conseil :</strong> Tu peux modifier le contenu, la couverture, ou le texte marketing de ton projet directement dans l'éditeur Bookzy.
                  </p>
                </div>

                <div class="footer-link-box">
                  <p style="margin: 0 0 12px; font-size: 14px; color: #6b7280;">
                    Un nouveau projet en tête ?
                  </p>
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="footer-link">
                    Lancer une nouvelle génération →
                  </a>
                </div>
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
            © ${new Date().getFullYear()} <strong>Bookzy</strong>. Tous droits réservés.
          </p>
        </td>
      </tr>

    </table>
  </center>

</body>
</html>
  `;
}