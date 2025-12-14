// lib/emailTemplates/resetPasswordTemplate.js

export function resetPasswordTemplate({ firstName, resetLink }) {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Réinitialisation de mot de passe - Bookzy</title>
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
    .center { text-align: center; }
    
    /* Button (Primary: Slate-900) */
    .btn-container { text-align: center; margin: 32px 0; }
    .btn { background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 700; font-size: 16px; display: inline-block; mso-padding-alt: 0; text-align: center; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.2); }
    
    /* Callout/Tip Box */
    .tip-box { background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px 20px; border-radius: 8px; margin-bottom: 24px; }
    .tip-text { margin: 0; font-size: 14px; color: #92400e; line-height: 1.6; }

    /* Footer */
    .footer { background-color: #f8fafc; padding: 32px 40px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
    .footer a { color: #64748b; font-weight: 600; text-decoration: underline; }
    
    /* Utilities */
    .link-box { margin: 0; font-size: 12px; color: #9ca3af; word-break: break-all; background: #f1f5f9; padding: 12px; border-radius: 8px; font-family: monospace; }
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
                <div style="display: inline-block; width: 60px; height: 60px; background: #f1f5f9; border-radius: 12px; margin-bottom: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); font-size: 32px; line-height: 60px;">
                  🔐
                </div>
                <h2 class="h2">
                  Réinitialisation de mot de passe
                </h2>
                <p style="margin: 0; font-size: 17px; color: #64748b;">
                  Salut ${firstName} 👋
                </p>
              </td>
            </tr>

            <tr>
              <td class="content-box" style="padding-top: 0;">
                
                <p class="text">
                  Tu as demandé à réinitialiser ton mot de passe Bookzy. Pour mettre à jour ton mot de passe, clique sur le bouton sécurisé ci-dessous :
                </p>

                <div class="btn-container">
                  <a href="${resetLink}" class="btn">
                    Réinitialiser mon mot de passe
                  </a>
                </div>

                <div class="tip-box">
                  <p class="tip-text">
                    <strong>⚠️ Important :</strong> Ce lien expire dans <strong>1 heure</strong>. Si tu n'es pas à l'origine de cette demande, ignore cet email immédiatement.
                  </p>
                </div>

                <p style="margin: 0 0 8px; font-size: 13px; color: #6b7280;">
                  Le bouton ne fonctionne pas ? Copie ce lien :
                </p>
                <p class="link-box">
                  ${resetLink}
                </p>
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