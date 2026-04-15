// ── TEMPLATES ROMANS IA ─────────────────────────────────────────────────────

export function generateRomanHTML(roman) {
  const templates = {
    classique: classicTemplate,
    sombre: sombreTemplate,
    romance: romanceTemplate,
    moderne: moderneTemplate,
  };
  const templateFn = templates[roman.template] || classicTemplate;
  return templateFn(roman);
}

// ── UTILITAIRES ───────────────────────────────────────────────────────────────
function formatContent(text, accentColor = "#0f172a") {
  const paragraphs = (text || "").split("\n\n").filter(p => p.trim());
  return paragraphs.map((p, i) => {
    const clean = p.trim().replace(/\n/g, " ");
    if (i === 0) {
      // Premier paragraphe : on met juste la première lettre en grand INLINE (pas float)
      const firstLetter = clean[0];
      const rest = clean.slice(1);
      return `<p class="first-para"><span class="drop-cap" style="color:${accentColor};font-size:3em;font-weight:700;line-height:1;display:inline-block;margin-right:2px;vertical-align:baseline;">${firstLetter}</span>${rest}</p>`;
    }
    return `<p>${clean}</p>`;
  }).join("");
}

function tableOfContents(chapters) {
  return chapters.map(ch =>
    `<div class="toc-item">
      <span class="toc-num">Chapitre ${ch.number}</span>
      <span class="toc-dots"></span>
      <span class="toc-title">${ch.title}</span>
    </div>`
  ).join("");
}

// ── TEMPLATE 1 : CLASSIQUE ────────────────────────────────────────────────────
function classicTemplate(roman) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Georgia', 'Times New Roman', serif; color: #1a1a1a; background: white; }

  .cover { width: 100%; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #0f172a; page-break-after: always; }
  .cover-ornement { width: 60px; height: 2px; background: #d4af37; margin: 0 auto 24px; }
  .cover-genre { font-size: 11px; color: #94a3b8; letter-spacing: 0.3em; text-transform: uppercase; margin-bottom: 32px; }
  .cover-title { font-size: 42px; font-weight: 700; color: white; text-align: center; line-height: 1.2; margin-bottom: 16px; padding: 0 40px; }
  .cover-line { width: 40px; height: 1px; background: #d4af37; margin: 0 auto 48px; }

  .synopsis-page { padding: 80px; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; page-break-after: always; }
  .synopsis-label { font-size: 10px; letter-spacing: 0.3em; color: #94a3b8; text-transform: uppercase; margin-bottom: 24px; }
  .synopsis-text { font-size: 15px; line-height: 1.9; color: #374151; font-style: italic; border-left: 3px solid #d4af37; padding-left: 24px; }

  .toc-page { padding: 80px; min-height: 100vh; page-break-after: always; }
  .toc-title-h { font-size: 28px; color: #0f172a; margin-bottom: 40px; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px; }
  .toc-item { display: flex; align-items: baseline; gap: 8px; margin-bottom: 14px; font-size: 14px; }
  .toc-num { color: #d4af37; font-weight: 600; min-width: 90px; font-size: 12px; }
  .toc-title { color: #1a1a1a; }
  .toc-dots { flex: 1; border-bottom: 1px dotted #cbd5e1; }

  .chapter { padding: 80px; page-break-before: always; }
  .chapter-num { font-size: 11px; letter-spacing: 0.3em; color: #94a3b8; text-transform: uppercase; margin-bottom: 12px; }
  .chapter-title { font-size: 28px; color: #0f172a; margin-bottom: 40px; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px; }

  /* Contenu — pas de first-letter CSS global */
  .chapter-content p { font-size: 15px; line-height: 1.9; color: #374151; text-indent: 2em; margin-bottom: 0.4em; orphans: 3; widows: 3; }
  .chapter-content p.first-para { text-indent: 0; }


  .footer { position: fixed; bottom: 24px; left: 0; right: 0; text-align: center; font-size: 10px; color: #94a3b8; }
</style>
</head>
<body>

<div class="cover">
  <div class="cover-ornement"></div>
  <p class="cover-genre">${roman.genre}</p>
  <h1 class="cover-title">${roman.title}</h1>
  <div class="cover-line"></div>
</div>

<div class="synopsis-page">
  <p class="synopsis-label">Synopsis</p>
  <p class="synopsis-text">${roman.synopsis}</p>
</div>

<div class="toc-page">
  <h2 class="toc-title-h">Table des matières</h2>
  ${tableOfContents(roman.chapters)}
</div>

${roman.chapters.map(ch => `
<div class="chapter">
  <p class="chapter-num">Chapitre ${ch.number}</p>
  <h2 class="chapter-title">${ch.title}</h2>
  <div class="chapter-content">
    ${formatContent(ch.content, "#0f172a")}
  </div>
</div>
`).join("")}

<div class="footer">${roman.title}</div>
</body>
</html>`;
}

// ── TEMPLATE 2 : SOMBRE ───────────────────────────────────────────────────────
function sombreTemplate(roman) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Georgia', serif; color: #e2e8f0; background: #0a0a0a; }

  .cover { width: 100%; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #0a0a0a; page-break-after: always; }
  .cover-genre { font-size: 10px; letter-spacing: 0.4em; color: #dc2626; text-transform: uppercase; margin-bottom: 40px; }
  .cover-title { font-size: 48px; font-weight: 700; color: white; text-align: center; line-height: 1.1; margin-bottom: 32px; padding: 0 40px; }
  .cover-line { width: 80px; height: 1px; background: #dc2626; margin: 0 auto; }

  .synopsis-page { padding: 80px; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; background: #0f0f0f; page-break-after: always; }
  .synopsis-label { font-size: 10px; letter-spacing: 0.3em; color: #dc2626; text-transform: uppercase; margin-bottom: 20px; }
  .synopsis-text { font-size: 15px; line-height: 1.9; color: #cbd5e1; font-style: italic; border-left: 2px solid #dc2626; padding-left: 20px; }

  .toc-page { padding: 80px; min-height: 100vh; background: #0f0f0f; page-break-after: always; }
  .toc-title-h { font-size: 26px; color: white; margin-bottom: 36px; border-bottom: 1px solid #1e293b; padding-bottom: 14px; }
  .toc-item { display: flex; align-items: baseline; gap: 8px; margin-bottom: 12px; font-size: 13px; }
  .toc-num { color: #dc2626; font-weight: 700; min-width: 90px; font-size: 11px; }
  .toc-title { color: #cbd5e1; }
  .toc-dots { flex: 1; border-bottom: 1px dotted #1e293b; }

  .chapter { padding: 80px; background: #0a0a0a; page-break-before: always; }
  .chapter-num { font-size: 10px; letter-spacing: 0.4em; color: #dc2626; text-transform: uppercase; margin-bottom: 10px; }
  .chapter-title { font-size: 26px; color: white; margin-bottom: 36px; }
  .chapter-divider { width: 40px; height: 1px; background: #dc2626; margin-bottom: 36px; }

  .chapter-content p { font-size: 14px; line-height: 1.9; color: #cbd5e1; text-indent: 2em; margin-bottom: 0.4em; orphans: 3; widows: 3; }
  .chapter-content p.first-para { text-indent: 0; }


  .footer { position: fixed; bottom: 24px; left: 0; right: 0; text-align: center; font-size: 10px; color: #374151; }
</style>
</head>
<body>

<div class="cover">
  <p class="cover-genre">${roman.genre}</p>
  <h1 class="cover-title">${roman.title}</h1>
  <div class="cover-line"></div>
</div>

<div class="synopsis-page">
  <p class="synopsis-label">Synopsis</p>
  <p class="synopsis-text">${roman.synopsis}</p>
</div>

<div class="toc-page">
  <h2 class="toc-title-h">Table des matières</h2>
  ${tableOfContents(roman.chapters)}
</div>

${roman.chapters.map(ch => `
<div class="chapter">
  <p class="chapter-num">Chapitre ${ch.number}</p>
  <h2 class="chapter-title">${ch.title}</h2>
  <div class="chapter-divider"></div>
  <div class="chapter-content">
    ${formatContent(ch.content, "#dc2626")}
  </div>
</div>
`).join("")}

<div class="footer">${roman.title}</div>
</body>
</html>`;
}

// ── TEMPLATE 3 : ROMANCE ──────────────────────────────────────────────────────
function romanceTemplate(roman) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Georgia', serif; color: #3d2b1f; background: #fdf8f3; }

  .cover { width: 100%; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #fdf8f3; page-break-after: always; }
  .cover-ornement { font-size: 28px; color: #be185d; margin-bottom: 20px; }
  .cover-genre { font-size: 11px; letter-spacing: 0.25em; color: #be185d; text-transform: uppercase; margin-bottom: 24px; }
  .cover-title { font-size: 40px; font-weight: 700; color: #1e1b4b; text-align: center; line-height: 1.2; margin-bottom: 20px; padding: 0 40px; font-style: italic; }
  .cover-ornement2 { font-size: 22px; color: #be185d; margin-top: 16px; }

  .synopsis-page { padding: 80px; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; background: #fffbf7; page-break-after: always; }
  .synopsis-label { font-size: 10px; letter-spacing: 0.3em; color: #be185d; text-transform: uppercase; margin-bottom: 20px; }
  .synopsis-text { font-size: 15px; line-height: 1.9; color: #4b2d2d; font-style: italic; border-left: 3px solid #f9a8d4; padding-left: 20px; }

  .toc-page { padding: 80px; min-height: 100vh; background: #fffbf7; page-break-after: always; }
  .toc-title-h { font-size: 26px; color: #1e1b4b; margin-bottom: 36px; border-bottom: 1px solid #fce7f3; padding-bottom: 14px; font-style: italic; }
  .toc-item { display: flex; align-items: baseline; gap: 8px; margin-bottom: 12px; font-size: 13px; }
  .toc-num { color: #be185d; font-weight: 600; min-width: 90px; font-size: 11px; }
  .toc-title { color: #3d2b1f; font-style: italic; }
  .toc-dots { flex: 1; border-bottom: 1px dotted #fce7f3; }

  .chapter { padding: 80px; background: #fffbf7; page-break-before: always; }
  .chapter-ornement { text-align: center; font-size: 18px; color: #be185d; margin-bottom: 20px; }
  .chapter-num { font-size: 10px; letter-spacing: 0.3em; color: #be185d; text-transform: uppercase; text-align: center; margin-bottom: 10px; }
  .chapter-title { font-size: 26px; color: #1e1b4b; margin-bottom: 36px; text-align: center; font-style: italic; }
  .chapter-divider { text-align: center; font-size: 16px; color: #f9a8d4; margin-bottom: 32px; }

  .chapter-content p { font-size: 15px; line-height: 1.9; color: #3d2b1f; text-indent: 2em; margin-bottom: 0.4em; orphans: 3; widows: 3; }
  .chapter-content p.first-para { text-indent: 0; }


  .footer { position: fixed; bottom: 24px; left: 0; right: 0; text-align: center; font-size: 10px; color: #d1a0b0; font-style: italic; }
</style>
</head>
<body>

<div class="cover">
  <div class="cover-ornement">✦</div>
  <p class="cover-genre">${roman.genre}</p>
  <h1 class="cover-title">${roman.title}</h1>
  <div class="cover-ornement2">❧</div>
</div>

<div class="synopsis-page">
  <p class="synopsis-label">Synopsis</p>
  <p class="synopsis-text">${roman.synopsis}</p>
</div>

<div class="toc-page">
  <h2 class="toc-title-h">Table des matières</h2>
  ${tableOfContents(roman.chapters)}
</div>

${roman.chapters.map(ch => `
<div class="chapter">
  <div class="chapter-ornement">✦</div>
  <p class="chapter-num">Chapitre ${ch.number}</p>
  <h2 class="chapter-title">${ch.title}</h2>
  <div class="chapter-divider">~ ❧ ~</div>
  <div class="chapter-content">
    ${formatContent(ch.content, "#be185d")}
  </div>
</div>
`).join("")}

<div class="footer">✦ ${roman.title} ✦</div>
</body>
</html>`;
}

// ── TEMPLATE 4 : MODERNE ─────────────────────────────────────────────────────
function moderneTemplate(roman) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #111; background: white; }

  .cover { width: 100%; height: 100vh; display: flex; flex-direction: column; padding: 80px; background: white; page-break-after: always; justify-content: flex-end; }
  .cover-accent { width: 60px; height: 6px; background: #2563eb; margin-bottom: 40px; }
  .cover-title { font-size: 52px; font-weight: 900; color: #111; line-height: 1.0; margin-bottom: 20px; letter-spacing: -2px; }
  .cover-genre { font-size: 13px; font-weight: 600; color: #2563eb; text-transform: uppercase; letter-spacing: 0.2em; }

  .synopsis-page { padding: 80px; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; page-break-after: always; }
  .synopsis-label { font-size: 10px; font-weight: 700; letter-spacing: 0.3em; color: #2563eb; text-transform: uppercase; margin-bottom: 20px; }
  .synopsis-text { font-size: 16px; line-height: 1.8; color: #374151; max-width: 600px; }

  .toc-page { padding: 80px; min-height: 100vh; page-break-after: always; }
  .toc-title-h { font-size: 32px; font-weight: 900; color: #111; margin-bottom: 40px; letter-spacing: -1px; }
  .toc-item { display: flex; align-items: center; gap: 16px; margin-bottom: 14px; padding-bottom: 14px; border-bottom: 1px solid #f1f5f9; }
  .toc-num { font-size: 11px; font-weight: 700; color: #2563eb; min-width: 80px; text-transform: uppercase; }
  .toc-title { font-size: 14px; font-weight: 600; color: #111; }
  .toc-dots { display: none; }

  .chapter { padding: 80px; page-break-before: always; }
  .chapter-tag { display: inline-block; background: #2563eb; color: white; font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; padding: 4px 10px; border-radius: 4px; margin-bottom: 16px; }
  .chapter-title { font-size: 32px; font-weight: 900; color: #111; margin-bottom: 40px; letter-spacing: -1px; line-height: 1.1; }

  .chapter-content p { font-size: 15px; line-height: 1.8; color: #374151; margin-bottom: 0.8em; orphans: 3; widows: 3; }
  .chapter-content p.first-para { text-indent: 0; }


  .footer { position: fixed; bottom: 24px; right: 40px; font-size: 10px; color: #94a3b8; font-weight: 600; text-transform: uppercase; }
</style>
</head>
<body>

<div class="cover">
  <div class="cover-accent"></div>
  <h1 class="cover-title">${roman.title}</h1>
  <p class="cover-genre">${roman.genre}</p>
</div>

<div class="synopsis-page">
  <p class="synopsis-label">Synopsis</p>
  <p class="synopsis-text">${roman.synopsis}</p>
</div>

<div class="toc-page">
  <h2 class="toc-title-h">Sommaire</h2>
  ${tableOfContents(roman.chapters)}
</div>

${roman.chapters.map(ch => `
<div class="chapter">
  <div class="chapter-tag">Chapitre ${ch.number}</div>
  <h2 class="chapter-title">${ch.title}</h2>
  <div class="chapter-content">
    ${formatContent(ch.content, "#2563eb")}
  </div>
</div>
`).join("")}

<div class="footer">${roman.title}</div>
</body>
</html>`;
}