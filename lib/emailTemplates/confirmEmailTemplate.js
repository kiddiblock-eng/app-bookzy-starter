export const confirmEmailTemplate = (prenom, confirmUrl) => `
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Confirmez votre email Bookzy</title>
    <style>
      /* Reset & Base */
      body { margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #334155; }
      table { border-spacing: 0; width: 100%; }
      td { padding: 0; }
      img { border: 0; }
      
      /* Container */
      .wrapper { width: 100%; table-layout: fixed; background-color: #f8fafc; padding-bottom: 40px; }
      .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
      
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
      .content { padding: 40px 40px; }
      .h1 { font-size: 24px; font-weight: 700; color: #0f172a; margin: 0 0 16px; letter-spacing: -0.5px; text-align: center; }
      .text { font-size: 16px; line-height: 26px; color: #475569; margin: 0 0 24px; }
      .center { text-align: center; }
      
      /* Button */
      .btn-container { text-align: center; margin: 32px 0; }
      .btn { background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; mso-padding-alt: 0; text-align: center; box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.1); }
      
      /* Footer */
      .footer { background-color: #f8fafc; padding: 32px 40px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
      .footer a { color: #64748b; text-decoration: underline; }
      
      /* Utilities */
      .link-fallback { font-size: 12px; color: #94a3b8; word-break: break-all; margin-top: 24px; line-height: 1.5; }
    </style>
  </head>
  <body>
    <center class="wrapper">
      <table class="main" width="100%">
        
        <tr>
          <td class="header">
            <a href="https://bookzy.io" target="_blank">
               <span class="logo-text">Bookzy<span class="logo-dot">.</span></span>
            </a>
          </td>
        </tr>

        <tr>
          <td class="content">
            <h1 class="h1">Vérification de sécurité 🔐</h1>
            
            <p class="text">Bonjour <strong>${prenom}</strong>,</p>
            
            <p class="text">
              Nous avons reçu une demande pour lier cette adresse e-mail à un compte <strong>Bookzy</strong>. 
              Pour finaliser la procédure et sécuriser votre compte, merci de cliquer sur le bouton ci-dessous.
            </p>

            <div class="btn-container">
              <a href="${confirmUrl}" class="btn">Confirmer mon e-mail</a>
            </div>

            <p class="text" style="font-size: 14px; color: #64748b;">
              Ce lien est valide pendant <strong>1 heure</strong>. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail en toute sécurité.
            </p>

            <div class="link-fallback">
              <p>Le bouton ne fonctionne pas ? Copiez-collez ce lien dans votre navigateur :</p>
              <a href="${confirmUrl}" style="color: #0f172a; text-decoration: underline;">${confirmUrl}</a>
            </div>
          </td>
        </tr>

        <tr>
          <td class="footer">
            <p style="margin: 0 0 8px;">
              © ${new Date().getFullYear()} <strong>Bookzy</strong>. Tous droits réservés.
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