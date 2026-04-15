// lib/emailTemplates/youbookRelanceTemplate.js

const MESSAGES = [
  // Email 1 — J+1
  {
    subject: (titre) => `Ton ebook "${titre}" attend toujours`,
    badge: "Rappel",
    badgeColor: "#eef2ff",
    badgeBorder: "#c7d2fe",
    badgeText: "#4338ca",
    title: "Ton idée est prête à devenir un ebook",
    body: (titre, prenom) => `
      <p style="font-size:14px;color:#374151;margin:0 0 14px;line-height:1.7;">
        Bonjour ${prenom},
      </p>
      <p style="font-size:14px;color:#374151;margin:0 0 14px;line-height:1.7;">
        Tu as analysé une vidéo YouTube hier et obtenu un concept d'ebook complet sur <strong>"${titre}"</strong>. Le sommaire est prêt, les chapitres sont définis.
      </p>
      <p style="font-size:14px;color:#374151;margin:0 0 14px;line-height:1.7;">
        Il ne reste qu'un clic pour transformer ce concept en PDF professionnel prêt à vendre.
      </p>
    `,
  },
  // Email 2 — J+2
  {
    subject: (titre) => `Le marché autour de "${titre}" est en mouvement`,
    badge: "Signal de marché",
    badgeColor: "#fef3c7",
    badgeBorder: "#fde68a",
    badgeText: "#92400e",
    title: "Les créateurs actifs sur ce sujet se multiplient",
    body: (titre, prenom) => `
      <p style="font-size:14px;color:#374151;margin:0 0 14px;line-height:1.7;">
        Bonjour ${prenom},
      </p>
      <p style="font-size:14px;color:#374151;margin:0 0 14px;line-height:1.7;">
        On a vérifié pour toi — le sujet <strong>"${titre}"</strong> génère de l'activité sur les réseaux en ce moment. Les créateurs qui se positionnent maintenant captent l'audience avant que le marché soit saturé.
      </p>
      <p style="font-size:14px;color:#374151;margin:0 0 14px;line-height:1.7;">
        Ton concept est déjà analysé et structuré. Il suffit de finaliser ton ebook et de le mettre en vente.
      </p>
    `,
  },
  // Email 3 — J+3
  {
    subject: (titre) => `Dernière chance — ton ebook "${titre}"`,
    badge: "Dernier rappel",
    badgeColor: "#fef2f2",
    badgeBorder: "#fecaca",
    badgeText: "#dc2626",
    title: "Ton concept expire bientôt",
    body: (titre, prenom) => `
      <p style="font-size:14px;color:#374151;margin:0 0 14px;line-height:1.7;">
        Bonjour ${prenom},
      </p>
      <p style="font-size:14px;color:#374151;margin:0 0 14px;line-height:1.7;">
        Tu as analysé une vidéo YouTube il y a 3 jours et généré un concept d'ebook complet sur <strong>"${titre}"</strong>. Mais l'ebook n'a pas encore été créé.
      </p>
      <p style="font-size:14px;color:#374151;margin:0 0 14px;line-height:1.7;">
        C'est le bon moment d'agir. Les idées qui restent dans les tiroirs ne génèrent pas de revenus. En moins d'une minute sur Bookzy, ton ebook est généré, mis en page et prêt à être vendu via Taliopay.
      </p>
    `,
  },
];

export function youbookRelanceTemplate({ firstName, titre, sommaire = [], emailIndex = 1 }) {
  const prenom = firstName || "cher créateur";
  const msg = MESSAGES[Math.min(emailIndex - 1, 2)];
  const lien = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/youbook`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${msg.subject(titre)}</title>
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
              <td style="background:${msg.badgeColor};border:1px solid ${msg.badgeBorder};border-radius:20px;padding:4px 12px;">
                <span style="font-size:11px;font-weight:700;color:${msg.badgeText};text-transform:uppercase;letter-spacing:0.08em;">${msg.badge}</span>
              </td>
            </tr>
          </table>

          <!-- TITRE -->
          <h1 style="font-size:22px;font-weight:900;color:#0f172a;margin:0 0 20px;line-height:1.3;">
            ${msg.title}
          </h1>

          <!-- BODY -->
          ${msg.body(titre, prenom)}

          <!-- SUJET ANALYSÉ -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;margin-bottom:20px;">
            <tr><td style="padding:16px 20px;">
              <p style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 6px;">Ton concept Youbook</p>
              <p style="font-size:15px;font-weight:700;color:#0f172a;margin:0 0 12px;">"${titre}"</p>
              ${sommaire.length > 0 ? `
              <table width="100%" cellpadding="0" cellspacing="0">
                ${sommaire.slice(0, 4).map((chap, i) => `
                <tr>
                  <td style="padding:3px 0;vertical-align:top;width:20px;">
                    <span style="font-size:11px;color:#94a3b8;font-weight:700;">${i + 1}.</span>
                  </td>
                  <td style="padding:3px 0;">
                    <span style="font-size:12px;color:#64748b;">${chap.replace(/^Chapitre \d+:\s*/i, "")}</span>
                  </td>
                </tr>`).join("")}
                ${sommaire.length > 4 ? `<tr><td colspan="2" style="padding:4px 0;"><span style="font-size:11px;color:#94a3b8;">+ ${sommaire.length - 4} chapitres...</span></td></tr>` : ""}
              </table>` : ""}
            </td></tr>
          </table>

          <!-- CTA -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
            <tr><td style="text-align:center;">
              <a href="${lien}" style="display:inline-block;background:#6366f1;color:white;font-size:15px;font-weight:800;padding:16px 36px;border-radius:12px;text-decoration:none;">
                Finaliser mon ebook
              </a>
            </td></tr>
          </table>
          <p style="font-size:11px;color:#94a3b8;text-align:center;margin:0;">
            Génération en moins d'une minute sur Bookzy
          </p>

        </td></tr>

        <!-- FOOTER -->
        <tr><td style="padding:24px 0;text-align:center;">
          <p style="font-size:12px;color:#94a3b8;margin:0 0 6px;">
            Tu reçois cet email car tu as analysé une vidéo YouTube sur Bookzy.
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