export function venusAnnouncementTemplate(userName = "là") {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bookzy — Quelque chose arrive.</title>
</head>
<body style="margin:0;padding:0;background:#0D0D0D;font-family:Georgia,serif;-webkit-font-smoothing:antialiased;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0D0D0D;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#0D0D0D;">

  <!-- TOP BAR -->
  <tr>
    <td style="padding:32px 48px 24px;border-bottom:1px solid #1E1E1E;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td>
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="width:32px;height:32px;background:#F5F2ED;border-radius:8px;text-align:center;vertical-align:middle;">
                  <img src="https://bookzy.io/logo-dark.png" width="16" height="16" alt="B" style="display:block;margin:auto;" onerror="this.style.display='none'"/>
                </td>
                <td style="padding-left:10px;font-family:Arial,sans-serif;font-weight:500;font-size:15px;color:#F5F2ED;letter-spacing:2px;">BOOKZY</td>
              </tr>
            </table>
          </td>
          <td align="right" style="font-family:Arial,sans-serif;font-size:11px;color:#444444;letter-spacing:3px;text-transform:uppercase;">Mars 2026</td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- HERO -->
  <tr>
    <td style="padding:72px 48px 64px;border-bottom:1px solid #1E1E1E;">
      <p style="margin:0 0 40px 0;font-family:Arial,sans-serif;font-size:11px;color:#444444;letter-spacing:4px;text-transform:uppercase;">Message de l'équipe</p>
      <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:64px;line-height:1.0;color:#F5F2ED;letter-spacing:-1px;font-weight:normal;">
        Quelque<br>chose<br><em style="color:#666666;font-style:italic;">arrive.</em>
      </h1>
      <div style="width:48px;height:1px;background:#2E2E2E;margin:40px 0;"></div>
      <p style="margin:0;font-family:Arial,sans-serif;font-size:17px;line-height:1.9;color:#555555;font-weight:300;max-width:420px;">
        Salut ${userName},<br><br>
        Depuis que tu utilises Bookzy, on n'a pas chômé.<br><br>
        On a retravaillé le générateur IA de fond en comble.<br>
        On a ajouté des templates encore plus beaux.<br>
        On a repensé toute l'expérience.<br><br>
        Nouvelles pages. Nouveaux outils. Nouveau niveau.<br><br>
        <strong style="color:#F5F2ED;font-weight:400;">Et ce n'est qu'un avant-goût de ce qui arrive.</strong>
      </p>
    </td>
  </tr>

  <!-- VERSION BLOCK -->
  <tr>
    <td style="background:#F5F2ED;padding:56px 48px;border-bottom:1px solid #1E1E1E;">
      <p style="margin:0 0 8px 0;font-family:Georgia,'Times New Roman',serif;font-size:96px;line-height:1;color:#111111;letter-spacing:-4px;font-weight:normal;">V1.1</p>
      <p style="margin:0 0 40px 0;font-family:Arial,sans-serif;font-size:11px;color:#888888;letter-spacing:6px;text-transform:uppercase;">Venus &nbsp;·&nbsp; Ça arrive très vite</p>
      <div style="width:100%;height:1px;background:#D4CFC8;margin-bottom:40px;"></div>
      <!-- FEATURES EN TABLE -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="50%" style="padding-bottom:16px;">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="width:2px;background:#C8BFB0;font-size:0;">&nbsp;</td>
                <td style="padding-left:14px;font-family:Arial,sans-serif;font-size:13px;color:#333333;">Générateur IA, 10x plus fort</td>
              </tr>
            </table>
          </td>
          <td width="50%" style="padding-bottom:16px;">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="width:2px;background:#C8BFB0;font-size:0;">&nbsp;</td>
                <td style="padding-left:14px;font-family:Arial,sans-serif;font-size:13px;color:#333333;">Smart Shop, ta boutique en 1 min</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td width="50%">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="width:2px;background:#C8BFB0;font-size:0;">&nbsp;</td>
                <td style="padding-left:14px;font-family:Arial,sans-serif;font-size:13px;color:#333333;">Bookzy Express, design en 20s</td>
              </tr>
            </table>
          </td>
          <td width="50%">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="width:2px;background:#C8BFB0;font-size:0;">&nbsp;</td>
                <td style="padding-left:14px;font-family:Arial,sans-serif;font-size:13px;color:#333333;">Radar Cash, trouve ce qui se vend</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- CTA -->
  <tr>
    <td style="padding:64px 48px;border-bottom:1px solid #1E1E1E;">
      <p style="margin:0 0 24px 0;font-family:Arial,sans-serif;font-size:11px;color:#444444;letter-spacing:3px;text-transform:uppercase;">Sois le premier à découvrir</p>
      <a href="https://bookzy.io" style="display:inline-block;background:#F5F2ED;color:#111111;font-family:Arial,sans-serif;font-size:13px;font-weight:500;letter-spacing:2px;text-transform:uppercase;padding:18px 40px;text-decoration:none;border-radius:2px;">bookzy.io &nbsp;→</a>
    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td style="padding:32px 48px;border-top:1px solid #1A1A1A;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="font-family:Arial,sans-serif;font-size:12px;color:#2E2E2E;letter-spacing:1px;">bookzy.io</td>
          <td align="right" style="font-family:Arial,sans-serif;font-size:12px;color:#2E2E2E;letter-spacing:1px;">Ebooks IA · Afrique francophone</td>
        </tr>
      </table>
    </td>
  </tr>

</table>
</td></tr>
</table>

</body>
</html>`;
}