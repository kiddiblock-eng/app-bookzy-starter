// lib/emailTemplates/dailyLesson.js

export function dailyLessonEmail({ userName, subject, lesson, tip, ctaText, ctaUrl, dayLabel, reportData }) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f5f2ed;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f2ed;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

          <!-- HEADER -->
          <tr>
            <td style="padding-bottom:24px;text-align:center;">
              <div style="display:inline-flex;align-items:center;gap:8px;">
                <div style="width:32px;height:32px;background:#0f172a;border-radius:8px;display:inline-block;text-align:center;line-height:32px;">
                  <span style="color:white;font-size:16px;">📖</span>
                </div>
                <span style="font-size:18px;font-weight:900;color:#0f172a;letter-spacing:-0.5px;">Bookzy</span>
              </div>
            </td>
          </tr>

          <!-- CARD PRINCIPALE -->
          <tr>
            <td style="background:white;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">

              <!-- TOP BAR colorée -->
              <div style="background:#0f172a;padding:20px 28px;">
                <p style="margin:0 0 4px;font-size:10px;font-weight:700;color:#94a3b8;letter-spacing:0.2em;text-transform:uppercase;">${dayLabel}</p>
                <h1 style="margin:0;font-size:22px;font-weight:900;color:white;line-height:1.3;">${subject}</h1>
              </div>

              <!-- CORPS -->
              <div style="padding:28px;">
                <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:0.15em;text-transform:uppercase;">Bonjour ${userName} 👋</p>

                <!-- Leçon -->
                <div style="font-size:15px;color:#374151;line-height:1.8;margin-bottom:24px;">
                  ${lesson.split('\n\n').map(p => `<p style="margin:0 0 14px;">${p}</p>`).join('')}
                </div>

                <!-- Astuce du jour -->
                <div style="background:#f0fdf4;border-left:4px solid #16a34a;border-radius:0 10px 10px 0;padding:14px 18px;margin-bottom:24px;">
                  <p style="margin:0 0 4px;font-size:10px;font-weight:700;color:#16a34a;letter-spacing:0.15em;text-transform:uppercase;">💡 Astuce actionnable</p>
                  <p style="margin:0;font-size:14px;color:#15803d;line-height:1.6;">${tip}</p>
                </div>

                ${reportData ? `
                <!-- RAPPORT REVENUS (dimanche uniquement) -->
                <div style="background:#0f172a;border-radius:12px;padding:20px;margin-bottom:24px;">
                  <p style="margin:0 0 12px;font-size:10px;font-weight:700;color:#94a3b8;letter-spacing:0.15em;text-transform:uppercase;">📊 Rapport de la semaine</p>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="text-align:center;padding:8px;">
                        <p style="margin:0;font-size:24px;font-weight:900;color:white;">${reportData.potentielFCFA}</p>
                        <p style="margin:4px 0 0;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:0.1em;">Potentiel estimé</p>
                      </td>
                      <td style="text-align:center;padding:8px;">
                        <p style="margin:0;font-size:24px;font-weight:900;color:#f59e0b;">${reportData.nichesActives}</p>
                        <p style="margin:4px 0 0;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:0.1em;">Niches actives</p>
                      </td>
                      <td style="text-align:center;padding:8px;">
                        <p style="margin:0;font-size:24px;font-weight:900;color:#10b981;">${reportData.ebooksCreated}</p>
                        <p style="margin:4px 0 0;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:0.1em;">Ebooks créés</p>
                      </td>
                    </tr>
                  </table>
                </div>
                ` : ''}

                <!-- CTA -->
                <div style="text-align:center;">
                  <a href="${ctaUrl}" style="display:inline-block;background:#0f172a;color:white;font-size:14px;font-weight:700;padding:14px 32px;border-radius:10px;text-decoration:none;">
                    ${ctaText} →
                  </a>
                </div>
              </div>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding-top:24px;text-align:center;">
              <p style="margin:0 0 8px;font-size:12px;color:#94a3b8;">Bookzy · Créez. Vendez. Réussissez.</p>
              <p style="margin:0;font-size:11px;color:#cbd5e1;">
                <a href="https://app.bookzy.io/dashboard/settings" style="color:#94a3b8;text-decoration:underline;">Se désabonner des emails</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}