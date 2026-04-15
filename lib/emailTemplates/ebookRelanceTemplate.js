export function ebookRelanceTemplate({ firstName, titre, sommaire = [], emailIndex = 1 }) {
  const prenom = firstName || "toi";
  const lien = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/projets/nouveau`;

  const configs = {
    1: {
      badge: "⏳ Ton ebook t'attend",
      badgeBg: "#fef3c7",
      badgeBorder: "#fde68a",
      badgeColor: "#92400e",
      titre: `Ton ebook "${titre}" est presque prêt`,
      intro: `Tu as commencé quelque chose hier. L'aperçu de ton ebook est prêt — il ne reste plus qu'à le débloquer.`,
      texte: `Tu as déjà le sommaire, l'introduction et le premier chapitre. La génération complète prend moins d'une minute. Pendant que tu hésites, d'autres vendent déjà leurs ebooks sur ce même sujet.`,
      urgence: `Clique ci-dessous et obtiens ton PDF complet + kit marketing en 60 secondes.`,
      cta: "Débloquer mon ebook →",
      ctaColor: "#0f172a",
    },
    2: {
      badge: "🔥 Le marché bouge",
      badgeBg: "#fee2e2",
      badgeBorder: "#fca5a5",
      badgeColor: "#991b1b",
      titre: `Le sujet "${titre}" est en train de décoller`,
      intro: `De nouveaux vendeurs arrivent sur ce marché. Ton aperçu est toujours disponible.`,
      texte: `Les meilleurs moments pour lancer un ebook, c'est quand le sujet monte — pas après. Tu as déjà fait le plus dur : trouver le sujet, générer l'aperçu. Il ne reste que 20 crédits entre toi et ton ebook complet.`,
      urgence: `Ne laisse pas quelqu'un d'autre prendre ta place sur ce marché.`,
      cta: "Finaliser mon ebook →",
      ctaColor: "#dc2626",
    },
    3: {
      badge: "💡 Un rappel important",
      badgeBg: "#f0fdf4",
      badgeBorder: "#86efac",
      badgeColor: "#166534",
      titre: `Tu n'as pas terminé "${titre}"`,
      intro: `Trois jours ont passé. Ton aperçu est toujours là, ton contenu aussi. Rien n'a été perdu.`,
      texte: `Des centaines d'ebooks sont vendus chaque jour en Afrique francophone. Le tien pourrait en faire partie dès aujourd'hui. L'investissement ? 20 crédits. Le retour potentiel ? Des ventes récurrentes sur un sujet que tu maîtrises.`,
      urgence: `Génère ton ebook maintenant et commence à vendre cette semaine.`,
      cta: "Générer mon ebook →",
      ctaColor: "#16a34a",
    },
    4: {
      badge: "🚨 Dernière chance",
      badgeBg: "#eff6ff",
      badgeBorder: "#93c5fd",
      badgeColor: "#1e40af",
      titre: `Ton projet "${titre}" expire bientôt`,
      intro: `C'est la dernière fois qu'on te contacte pour cet ebook. Après ça, le projet sera archivé.`,
      texte: `Tu as mis du temps à trouver ce sujet, générer cet aperçu. Ne laisse pas tout ça disparaître. En 60 secondes tu peux avoir ton PDF complet, ton kit marketing, et être prêt à vendre.`,
      urgence: `C'est maintenant ou jamais.`,
      cta: "Je veux mon ebook →",
      ctaColor: "#6366f1",
    },
  };

  const c = configs[emailIndex] || configs[1];

  const sommaireHtml = sommaire.length > 0
    ? sommaire.slice(0, 5).map((chap, i) => `
      <tr>
        <td style="padding:6px 0;border-bottom:1px solid #f1f5f9;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="width:28px;font-size:11px;font-weight:700;color:#94a3b8;">${String(i + 1).padStart(2, "0")}</td>
              <td style="font-size:13px;color:#374151;">${chap}</td>
            </tr>
          </table>
        </td>
      </tr>`).join("")
    : "";

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${c.titre}</title>
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
              <td style="background:${c.badgeBg};border:1px solid ${c.badgeBorder};border-radius:20px;padding:4px 12px;">
                <span style="font-size:11px;font-weight:700;color:${c.badgeColor};text-transform:uppercase;letter-spacing:0.08em;">${c.badge}</span>
              </td>
            </tr>
          </table>

          <!-- TITRE -->
          <h1 style="font-size:22px;font-weight:900;color:#0f172a;margin:0 0 10px;line-height:1.3;">${c.titre}</h1>
          <p style="font-size:14px;color:#64748b;margin:0 0 20px;line-height:1.7;">Bonjour ${prenom},<br/><br/>${c.intro}</p>

          <!-- SOMMAIRE si dispo -->
          ${sommaireHtml ? `
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;margin-bottom:20px;">
            <tr><td style="padding:16px 20px;">
              <p style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 12px;">Aperçu de ton sommaire</p>
              <table width="100%" cellpadding="0" cellspacing="0">${sommaireHtml}</table>
            </td></tr>
          </table>` : ""}

          <!-- TEXTE -->
          <p style="font-size:14px;color:#374151;margin:0 0 14px;line-height:1.7;">${c.texte}</p>
          <p style="font-size:14px;font-weight:700;color:#0f172a;margin:0 0 24px;line-height:1.7;">${c.urgence}</p>

          <!-- CTA -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
            <tr><td style="text-align:center;">
              <a href="${lien}" style="display:inline-block;background:${c.ctaColor};color:white;font-size:15px;font-weight:800;padding:16px 32px;border-radius:12px;text-decoration:none;">${c.cta}</a>
            </td></tr>
          </table>
          <p style="font-size:11px;color:#94a3b8;text-align:center;margin:0;">Génération en ~60 secondes · 20 crédits</p>

        </td></tr>

        <!-- FOOTER -->
        <tr><td style="padding:24px 0;text-align:center;">
          <p style="font-size:12px;color:#94a3b8;margin:0 0 6px;">Tu reçois cet email car tu as commencé un ebook sur Bookzy.</p>
          <p style="font-size:12px;color:#94a3b8;margin:0;">© 2026 Bookzy · <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="color:#94a3b8;">Mon compte</a></p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}