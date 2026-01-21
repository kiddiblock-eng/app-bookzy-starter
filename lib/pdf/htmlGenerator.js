// lib/pdf/htmlGenerator.js
// 💎 VERSION FINALE : DESIGN PREMIUM (LIGNES DIAGONALES) + STABLE

export function generateStyledHTML(data, templateKey = "modern") {
  const { title, author, subtitle, intro, conclusion, chaptersData } = data;
  
  // ============================================================================
  // 1. CONFIGURATION DES THÈMES
  // ============================================================================
  const themes = {
      modern: { 
          primary: "#0f172a", secondary: "#3b82f6", accent: "#8b5cf6", 
          font: "Inter", 
          // LE SECRET : Lignes diagonales subtiles au lieu des points
          coverBg: `
            background-color: #0f172a;
            background-image: repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 40px);
          `
      },
      luxe: { 
          primary: "#1a1a1a", secondary: "#B8860B", accent: "#D4AF37", 
          font: "Playfair Display", 
          coverBg: "background: linear-gradient(135deg, #1a1a1a 0%, #2d2013 100%);" 
      },
      educatif: { 
          primary: "#064e3b", secondary: "#10b981", accent: "#34d399", 
          font: "Inter", 
          coverBg: "background: linear-gradient(135deg, #064e3b 0%, #065f46 100%);" 
      },
      energie: { 
          primary: "#c2410c", secondary: "#f97316", accent: "#fbbf24", 
          font: "Inter", 
          coverBg: "background: linear-gradient(135deg, #c2410c 0%, #ea580c 100%);" 
      },
      minimal: { 
          primary: "#334155", secondary: "#94a3b8", accent: "#cbd5e1", 
          font: "Inter", 
          coverBg: "background: #ffffff;" 
      },
      creative: { 
          primary: "#7c3aed", secondary: "#db2777", accent: "#f472b6", 
          font: "Inter", 
          coverBg: "background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%);" 
      },
  };

  const theme = themes[templateKey] || themes.modern;
  const safeSubtitle = subtitle && subtitle.length > 250 ? subtitle.substring(0, 250).trim() + "..." : (subtitle || "");

  // ============================================================================
  // 2. FONCTIONS DE NETTOYAGE (Stabilité)
  // ============================================================================
  function escapeRegex(str) { return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  function cleanOrphanBullets(htmlContent) {
    if (!htmlContent) return htmlContent;
    return htmlContent
      .replace(/<p>\s*•\s*<\/p>/gi, '')
      .replace(/<li>\s*•\s*<\/li>/gi, '')
      .replace(/>\s*•\s*</g, '><')
      .replace(/\n\s*•\s*\n/g, '\n')
      .replace(/<p>•\s+/gi, '<p>');
  }

  function cleanChapterContent(content, chapterTitle) {
    if (!content || !chapterTitle) return content;
    const cleanTitle = chapterTitle.trim().replace(/\s+/g, '\\s+');
    const h2Pattern = `<h2[^>]*>\\s*${escapeRegex(cleanTitle)}\\s*</h2>`;
    const regex = new RegExp(h2Pattern, 'i');
    let cleaned = regex.test(content) ? content.replace(regex, '') : content;
    return cleanOrphanBullets(cleaned);
  }

  // ============================================================================
  // 3. COUVERTURES (Design SVG & CSS Safe)
  // ============================================================================
  
  const coverHTML = templateKey === "luxe" ? `
    <div class="cover-page luxe-cover">
        <div class="luxe-frame"></div>
        <div class="cover-content">
            <div style="font-size: 40px; color: #B8860B; margin-bottom: 20px;">◆</div>
            <div class="badge luxe-badge">ÉDITION PREMIUM</div>
            <h1 class="cover-title" style="font-family: 'Playfair Display', serif;">${title}</h1>
            ${safeSubtitle ? `<p class="cover-subtitle" style="font-family: 'Merriweather', serif; font-style:italic;">${safeSubtitle}</p>` : ''}
            <div style="margin: 40px 0; color: #B8860B;">◆ &nbsp; ◆ &nbsp; ◆</div>
            <div class="cover-author luxe-author">AUTEUR : ${author ? author.toUpperCase() : 'EXPERT'}</div>
        </div>
    </div>`
  : templateKey === "creative" ? `
    <div class="cover-page creative-cover">
        <svg style="position: absolute; top: -50px; right: -50px; opacity: 0.2;" width="400" height="400">
            <circle cx="200" cy="200" r="150" fill="white"/>
        </svg>
        <svg style="position: absolute; bottom: -50px; left: -50px; opacity: 0.1;" width="300" height="300">
            <rect x="50" y="50" width="200" height="200" rx="40" fill="white"/>
        </svg>
        <div class="cover-content">
            <div class="badge creative-badge">✨ CRÉATIF</div>
            <h1 class="cover-title">${title}</h1>
            ${safeSubtitle ? `<p class="cover-subtitle">${safeSubtitle}</p>` : ''}
            <div class="cover-line"></div>
            <div class="cover-author">PAR ${author ? author.toUpperCase() : 'CRÉATEUR'}</div>
        </div>
    </div>`
  : templateKey === "minimal" ? `
    <div class="cover-page minimal-cover">
        <div class="minimal-border"></div>
        <div class="cover-content">
            <h1 class="cover-title" style="color: #334155;">${title}</h1>
            ${safeSubtitle ? `<p class="cover-subtitle" style="color: #64748b;">${safeSubtitle}</p>` : ''}
            <div class="cover-line" style="background: #334155;"></div>
            <div class="cover-author" style="color: #64748b; border-color: #64748b;">${author || 'Auteur'}</div>
        </div>
    </div>`
  : templateKey === "energie" ? `
    <div class="cover-page energie-cover">
        <div class="cover-content">
            <div class="badge energie-badge">⚡ BOOST</div>
            <h1 class="cover-title">${title}</h1>
            ${safeSubtitle ? `<p class="cover-subtitle">${safeSubtitle}</p>` : ''}
            <div class="energie-bolt">⚡</div>
            <div class="cover-author">PAR ${author ? author.toUpperCase() : 'EXPERT'}</div>
        </div>
    </div>`
  : templateKey === "educatif" ? `
    <div class="cover-page educatif-cover">
        <div class="cover-content">
            <div class="badge educatif-badge">📚 FORMATION</div>
            <h1 class="cover-title">${title}</h1>
            ${safeSubtitle ? `<p class="cover-subtitle">${safeSubtitle}</p>` : ''}
            <div style="font-size: 60px; color: #34d399; margin: 30px 0;">✓</div>
            <div class="cover-author">PAR ${author ? author.toUpperCase() : 'FORMATEUR'}</div>
        </div>
    </div>`
  : /* MODERN (Défaut avec LIGNES DIAGONALES) */ `
    <div class="cover-page modern-cover">
        <div class="cover-content">
            <div class="badge">GUIDE COMPLET</div>
            <h1 class="cover-title">${title}</h1>
            ${safeSubtitle ? `<p class="cover-subtitle">${safeSubtitle}</p>` : ''}
            <div class="cover-line"></div>
            <div class="cover-author">PAR ${author ? author.toUpperCase() : 'L\'ÉQUIPE BOOKZY'}</div>
        </div>
    </div>`;

  // --- SOMMAIRE ---
  const tocHTML = `
    <div class="toc-page">
        <h1 class="toc-title" style="color: ${theme.primary}">Sommaire</h1>
        <div class="toc-list">
            <div class="toc-item"><span class="toc-num" style="color: ${theme.secondary}">01</span><span class="toc-text">Introduction</span></div>
            ${chaptersData.map((ch, idx) => `
                <div class="toc-item">
                    <span class="toc-num" style="color: ${theme.secondary}">${String(idx + 2).padStart(2, '0')}</span>
                    <span class="toc-text">${ch.title}</span>
                </div>
            `).join('')}
            <div class="toc-item"><span class="toc-num" style="color: ${theme.secondary}">${String(chaptersData.length + 2).padStart(2, '0')}</span><span class="toc-text">Conclusion</span></div>
        </div>
    </div>`;

  // --- CORPS ---
  const bodyHTML = `
    <div class="content-page start-chapter">
        <h1 class="section-title" style="color: ${theme.primary}">Introduction</h1>
        <div class="section-content">${cleanOrphanBullets(intro)}</div>
    </div>
    ${chaptersData.map((ch, idx) => `
        <div class="content-page start-chapter">
            <div class="chapter-header">
                <div class="chapter-badge" style="color: ${theme.secondary}; background: #f1f5f9;">CHAPITRE ${idx + 1}</div>
                <h1 class="chapter-title" style="color: ${theme.primary}">${ch.title}</h1>
            </div>
            <div class="section-content">${cleanChapterContent(ch.content, ch.title)}</div>
        </div>
    `).join('')}
    <div class="content-page start-chapter">
        <h1 class="section-title" style="color: ${theme.primary}">Conclusion</h1>
        <div class="section-content">${cleanOrphanBullets(conclusion)}</div>
    </div>`;

  // ============================================================================
  // 4. CSS GLOBAL (Optimisé PDF)
  // ============================================================================
  const finalCSS = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=Playfair+Display:wght@400;700;900&family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&family=Noto+Color+Emoji&display=swap');

    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; font-family: '${theme.font}', 'Inter', sans-serif; color: #334155; font-size: 18px; line-height: 1.7; background: white; }
    
    @page { size: A4; margin: 20mm 20mm; }
    @page :first { margin: 0; }
    .start-chapter { page-break-before: always; padding-top: 30px; }

    /* --- COUVERTURES --- */
    .cover-page { width: 100%; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 50px; page-break-after: always; position: relative; overflow: hidden; }
    
    .modern-cover { ${themes.modern.coverBg} color: white; }
    .luxe-cover { ${themes.luxe.coverBg} color: #D4AF37; }
    .educatif-cover { ${themes.educatif.coverBg} color: white; }
    .energie-cover { ${themes.energie.coverBg} color: white; }
    .creative-cover { ${themes.creative.coverBg} color: white; }
    .minimal-cover { ${themes.minimal.coverBg} color: #334155; }

    /* CADRE LUXE DOUBLE (Suggestion validée) */
    .luxe-frame {
        position: absolute; inset: 30px;
        border: 3px double #B8860B; /* Double bordure */
        opacity: 0.8; pointer-events: none;
    }
    
    .minimal-border { position: absolute; inset: 20px; border: 1px solid #cbd5e1; pointer-events: none; }
    .energie-bolt { font-size: 80px; margin: 30px 0; text-shadow: 0 0 20px rgba(255,255,255,0.5); }

    .cover-title { font-size: 50px; font-weight: 900; line-height: 1.1; margin: 30px 0; text-transform: uppercase; }
    .cover-subtitle { font-size: 22px; opacity: 0.9; margin-bottom: 40px; font-weight: 300; max-width: 800px; }
    .badge { display: inline-block; padding: 10px 30px; border: 1px solid rgba(255,255,255,0.4); border-radius: 50px; font-weight: 700; font-size: 13px; letter-spacing: 3px; text-transform: uppercase; }
    .luxe-badge { background: #D4AF37; color: #1a1a1a !important; border: none; }
    .cover-line { width: 80px; height: 4px; background: white; margin: 0 auto 40px auto; opacity: 0.5; border-radius: 2px; }
    .cover-author { font-weight: 600; letter-spacing: 2px; font-size: 14px; border: 1px solid currentColor; padding: 10px 20px; border-radius: 8px; display: inline-block; }

    /* --- SOMMAIRE & CONTENU --- */
    .toc-page { padding: 60px 0; page-break-after: always; }
    .toc-title { text-align: center; font-size: 36px; font-weight: 800; margin-bottom: 50px; text-transform: uppercase; }
    .toc-list { max-width: 650px; margin: 0 auto; }
    .toc-item { display: flex; align-items: baseline; padding: 15px 0; border-bottom: 1px solid #e2e8f0; margin-bottom: 5px; }
    .toc-num { font-weight: 900; font-size: 20px; width: 60px; }
    .toc-text { font-weight: 500; font-size: 18px; color: #1e293b; }

    .chapter-header { text-align: center; margin-bottom: 60px; padding-bottom: 30px; border-bottom: 2px solid #f1f5f9; }
    .chapter-badge { padding: 8px 20px; border-radius: 20px; font-weight: 700; font-size: 12px; letter-spacing: 2px; margin-bottom: 20px; display: inline-block; }
    .chapter-title { font-size: 38px; font-weight: 800; line-height: 1.2; margin: 0; }
    .section-title { font-size: 40px; font-weight: 900; text-align: center; margin-bottom: 50px; }

    .section-content h2 { font-size: 28px; color: ${theme.primary}; margin-top: 50px; margin-bottom: 20px; font-weight: 800; letter-spacing: -0.5px; page-break-after: avoid; }
    .section-content h3 { font-size: 22px; color: ${theme.secondary}; margin-top: 35px; margin-bottom: 15px; font-weight: 700; page-break-after: avoid; }
    .section-content p { margin-bottom: 25px; text-align: justify; }

    /* TABLEAUX STRIPE */
    table { width: 100%; border-collapse: collapse; margin: 40px 0; font-size: 16px; background: white; page-break-inside: auto; }
    th { text-align: left; padding: 15px; color: #64748b; font-weight: 700; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; border-bottom: 2px solid #e2e8f0; background: #f8fafc; }
    td { padding: 15px; border-bottom: 1px solid #e2e8f0; vertical-align: top; color: #334155; }
    tr:last-child td { border-bottom: none; }

    /* BLOCS RICHES */
    ul { list-style: none; padding-left: 20px; margin: 25px 0; }
    ul li { position: relative; padding-left: 30px; margin-bottom: 15px; }
    ul li::before { content: "•"; position: absolute; left: 0; color: ${theme.secondary}; font-size: 24px; top: -5px; }
    
    ol { counter-reset: item; list-style-type: none; padding-left: 0; }
    ol li { display: block; margin-bottom: 15px; padding-left: 40px; position: relative; }
    ol li::before { content: counter(item); counter-increment: item; position: absolute; left: 0; top: 0; background: ${theme.primary}; color: white; width: 25px; height: 25px; border-radius: 50%; text-align: center; line-height: 25px; font-size: 14px; font-weight: bold; }

    blockquote { margin: 30px 0; padding: 20px 30px; border-left: 5px solid ${theme.secondary}; background: #f8fafc; font-style: italic; color: #475569; font-family: 'Merriweather', serif; page-break-inside: avoid; }
    .tip-box, .conseil-box, .warning-box { background: #f8fafc; border-left: 5px solid ${theme.secondary}; padding: 25px; margin: 30px 0; border-radius: 0 8px 8px 0; font-size: 17px; page-break-inside: avoid; }
    .warning-box { border-color: #ef4444; background: #fef2f2; }
    .conseil-box { border-color: #3b82f6; background: #eff6ff; }
    img { max-width: 100%; border-radius: 8px; margin: 30px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
  `;

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head><meta charset="UTF-8"><style>${finalCSS}</style></head>
    <body>${coverHTML}${tocHTML}${bodyHTML}</body>
    </html>
  `;
}