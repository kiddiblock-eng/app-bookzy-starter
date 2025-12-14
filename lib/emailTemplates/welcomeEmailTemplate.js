// lib/emailTemplates/welcomeEmailTemplate.js

export function welcomeEmailTemplate({ firstName }) {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenue sur Bookzy !</title>
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
    .h2 { font-size: 28px; font-weight: 800; color: #1f2937; margin: 0 0 12px; }
    .text { font-size: 16px; line-height: 26px; color: #475569; margin: 0 0 24px; }
    .center { text-align: center; }
    
    /* Button (Primary: Slate-900) */
    .btn-container { text-align: center; margin: 32px 0; }
    .btn { background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 700; font-size: 16px; display: inline-block; mso-padding-alt: 0; text-align: center; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.2); }
    
    /* Callout/Tip Box */
    .tip-box { background-color: #f1f5f9; border-radius: 12px; padding: 24px; margin-bottom: 32px; }
    .tip-list { margin: 0; padding-left: 20px; color: #475569; line-height: 1.8; font-size: 15px; }
    
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
              <td class="content-box" style="text-align: center;">
                <div style="font-size: 80px; line-height: 1; margin-bottom: 16px;">
                  🎉
                </div>
                <h2 class="h2">
                  Bienvenue, ${firstName} !
                </h2>
                <p style="margin: 0; font-size: 17px; color: #64748b;">
                  Ton compte est prêt. Accélère la création d'ebooks. 🚀
                </p>
              </td>
            </tr>

            <tr>
              <td class="content-box" style="padding-top: 0;">
                
                <p class="text">
                  Félicitations ! Toute l'équipe Bookzy est ravie de t'accueillir. Tu as fait le premier pas pour transformer ton savoir en produits digitaux professionnels, rapidement et sans effort grâce à l'IA.
                </p>

                <div class="tip-box">
                  <h3 style="margin: 0 0 16px; font-size: 18px; font-weight: 700; color: #1f2937;">
                    ✨ Ton plan de vol :
                  </h3>
                  <ul class="tip-list">
                    <li style="margin-bottom: 8px;">Connecte-toi à ton Dashboard.</li>
                    <li style="margin-bottom: 8px;">Décris simplement ton idée d'ebook en 1 phrase.</li>
                    <li style="margin-bottom: 8px;">L'IA s'occupe de la structure, de la rédaction et de la mise en page.</li>
                    <li style="margin-bottom: 0;">Télécharge ton pack complet (PDF + Marketing) en quelques minutes.</li>
                  </ul>
                </div>

                <div class="btn-container">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="btn">
                    Créer mon premier ebook
                  </a>
                </div>

                <div style="text-align: center; padding-top: 24px; border-top: 1px solid #f1f5f9;">
                  <p style="margin: 0 0 12px; font-size: 14px; color: #6b7280;">
                    Un guide pour démarrer ?
                  </p>
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/blog" style="color: #0f172a; font-weight: 600; text-decoration: none;">
                    Consulte notre centre d'aide →
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