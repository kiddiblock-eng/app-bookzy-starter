// lib/pdf/htmlGenerator.js
// 🎯 VERSION 2.0 — 16 TEMPLATES PREMIUM
// ✅ CSS corrigé : text-align left (plus de justify)
// ✅ H2 dupliqué fixé : suppression du premier <h2> systématiquement
// ✅ 12 templates Express portés + 4 nouveaux (afrique, sport, wellness, business)
// ✅ step-box, quote, tip-box, warning-box, conseil-box tous stylisés
// ✅ Numéros de page personnalisés par template

// ============================================================================
// 1. CONFIGURATION DES 16 THÈMES
// ============================================================================
function getThemeConfig(templateKey) {
  const themes = {
    modern:    { primary: "#0f172a", secondary: "#3b82f6", accent: "#7c3aed",   font: "Inter",            gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
    luxe:      { primary: "#1a1a1a", secondary: "#d4af37", accent: "#ffd700",   font: "Playfair Display", gradient: "linear-gradient(135deg, #1a1a1a 0%, #3d2817 100%)" },
    educatif:  { primary: "#065f46", secondary: "#10b981", accent: "#34d399",   font: "Inter",            gradient: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)" },
    energie:   { primary: "#dc2626", secondary: "#f97316", accent: "#fbbf24",   font: "Manrope",          gradient: "linear-gradient(135deg, #f97316 0%, #dc2626 100%)" },
    minimal:   { primary: "#1e293b", secondary: "#64748b", accent: "#94a3b8",   font: "Inter",            gradient: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)" },
    creative:  { primary: "#7c3aed", secondary: "#ec4899", accent: "#f59e0b",   font: "Nunito",           gradient: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)" },
    tech:      { primary: "#0a0e27", secondary: "#00d4ff", accent: "#4f46e5",   font: "Inter",            gradient: "linear-gradient(135deg, #0a0e27 0%, #1e3a8a 100%)" },
    nature:    { primary: "#14532d", secondary: "#22c55e", accent: "#84cc16",   font: "Inter",            gradient: "linear-gradient(135deg, #166534 0%, #15803d 100%)" },
    fashion:   { primary: "#831843", secondary: "#ec4899", accent: "#f0abfc",   font: "Playfair Display", gradient: "linear-gradient(135deg, #9f1239 0%, #be185d 100%)" },
    corporate: { primary: "#1e3a8a", secondary: "#3b82f6", accent: "#60a5fa",   font: "Inter",            gradient: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)" },
    retro:     { primary: "#78350f", secondary: "#d97706", accent: "#fbbf24",   font: "Merriweather",     gradient: "linear-gradient(135deg, #92400e 0%, #b45309 100%)" },
    futuriste: { primary: "#4c1d95", secondary: "#a78bfa", accent: "#c084fc",   font: "Inter",            gradient: "linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)" },
    // 4 NOUVEAUX
    afrique:   { primary: "#7c2d12", secondary: "#d97706", accent: "#f59e0b",   font: "Inter",            gradient: "linear-gradient(135deg, #78350f 0%, #b45309 40%, #d97706 100%)" },
    sport:     { primary: "#0f172a", secondary: "#ef4444", accent: "#fbbf24",   font: "Manrope",          gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #7f1d1d 100%)" },
    wellness:  { primary: "#2e1065", secondary: "#8b5cf6", accent: "#a78bfa",   font: "Nunito",           gradient: "linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 50%, #c4b5fd 100%)" },
    business:  { primary: "#0f172a", secondary: "#b8860b", accent: "#d4af37",   font: "Inter",            gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 70%, #2d1f0f 100%)" },
  };
  return themes[templateKey] || themes.modern;
}

// ============================================================================
// 2. FONCTION PRINCIPALE EXPORTÉE
// ============================================================================
export function generateStyledHTML(data, templateKey = "modern") {
  const { title, author, subtitle, intro, conclusion, chaptersData } = data;
  const theme = getThemeConfig(templateKey);

  const safeSubtitle = subtitle && subtitle.length > 250
    ? subtitle.substring(0, 250).trim() + "..."
    : (subtitle || "");

  // ✅ FIX H2 DUPLIQUÉ — supprime le tout premier <h2> du contenu Gemini
  // sans chercher à matcher le titre (qui peut être reformulé)
  function removeFirstH2(content) {
    if (!content) return content;
    return content.replace(/<h2[^>]*>[\s\S]*?<\/h2>/i, '').trim();
  }

  const coverHTML  = buildCover(templateKey, theme, title, author, safeSubtitle);

  const tocItems = [
    { num: 1, text: "Introduction" },
    ...chaptersData.map((ch, i) => ({ num: i + 2, text: ch.title })),
    { num: chaptersData.length + 2, text: "Conclusion" },
  ];
  const tocHTML = buildTOC(tocItems, templateKey, theme);

  let pageNum  = 3;
  let bodyHTML = buildChapter("00", "INTRODUCTION", "Introduction", intro, templateKey, pageNum++);

  chaptersData.forEach((ch, i) => {
    bodyHTML += buildChapter(
      String(i + 1).padStart(2, '0'),
      `CHAPITRE ${i + 1}`,
      ch.title,
      removeFirstH2(ch.content),
      templateKey,
      pageNum++
    );
  });

  bodyHTML += buildChapter("∞", "CONCLUSION", "Conclusion", conclusion, templateKey, pageNum);

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>${buildCSS(theme, templateKey)}</style>
</head>
<body>${coverHTML + tocHTML + bodyHTML}</body>
</html>`;
}

// ============================================================================
// 3. COUVERTURES — 16 designs
// ============================================================================
function buildCover(key, theme, title, author, subtitle) {
  const auth = author || "Auteur";
  const sub  = subtitle ? `<p class="cover-subtitle">${subtitle}</p>` : '';

  const covers = {

    modern: `
    <div class="cover-page modern-cover">
      <div class="modern-grid-3d"></div>
      <div class="modern-gradient-overlay"></div>
      <div class="modern-shapes"><div class="s1"></div><div class="s2"></div><div class="s3"></div></div>
      <div class="cover-content">
        <div class="modern-badge">PREMIUM</div>
        <h1 class="cover-title modern-title">${title}</h1>${sub}
        <div class="cover-author modern-author">${auth}</div>
      </div>
      <div class="modern-footer">BOOKZY</div>
    </div>`,

    luxe: `
    <div class="cover-page luxe-cover">
      <div class="luxe-texture"></div>
      <div class="luxe-frame-outer"></div><div class="luxe-frame-inner"></div>
      <div class="luxe-ornament-top">◆ ◆ ◆</div>
      <div class="cover-content">
        <div class="luxe-badge">ÉDITION PREMIUM</div>
        <div class="luxe-divider"></div>
        <h1 class="cover-title luxe-title">${title}</h1>
        <div class="luxe-divider"></div>
        ${subtitle ? `<div class="luxe-subtitle">${subtitle}</div>` : ''}
        <div class="luxe-author"><span class="author-label">Par</span><span class="author-name">${auth}</span></div>
      </div>
      <div class="luxe-ornament-bottom">◆ ◆ ◆</div>
    </div>`,

    educatif: `
    <div class="cover-page educatif-cover">
      <div class="educatif-grid"></div>
      <div class="educatif-icons"><div class="ei">📚</div><div class="ei">🎓</div><div class="ei">✓</div><div class="ei">📊</div></div>
      <div class="cover-content">
        <div class="educatif-badge">FORMATION</div>
        <h1 class="cover-title educatif-title">${title}</h1>${sub}
        <div class="cover-author educatif-author">${auth}</div>
      </div>
    </div>`,

    energie: `
    <div class="cover-page energie-cover">
      <div class="energie-rays"></div>
      <div class="energie-circles"><div class="ec c1"></div><div class="ec c2"></div><div class="ec c3"></div></div>
      <div class="cover-content">
        <div class="energie-badge">⚡ BOOST</div>
        <h1 class="cover-title energie-title">${title}</h1>${sub}
        <div class="energie-lightning"><svg viewBox="0 0 50 100" width="50" height="100"><polygon points="25,0 10,60 30,60 15,100 45,40 25,40" fill="white" opacity="0.9"/></svg></div>
        <div class="cover-author energie-author">${auth}</div>
      </div>
    </div>`,

    minimal: `
    <div class="cover-page minimal-cover">
      <div class="minimal-grid"></div>
      <div class="cover-content">
        <div class="minimal-label">GUIDE</div>
        <h1 class="cover-title minimal-title">${title}</h1>
        ${subtitle ? `<p class="minimal-sub">${subtitle}</p>` : ''}
        <div class="minimal-line"></div>
        <div class="cover-author minimal-author">${auth}</div>
        <div class="minimal-year">2026</div>
      </div>
    </div>`,

    creative: `
    <div class="cover-page creative-cover">
      <div class="cb blob-1"></div><div class="cb blob-2"></div><div class="cb blob-3"></div><div class="cb blob-4"></div>
      <div class="creative-pattern"></div>
      <div class="cover-content">
        <div class="creative-badge">✨ CRÉATIF</div>
        <h1 class="cover-title creative-title">${title}</h1>${sub}
        <div class="creative-wave"><svg viewBox="0 0 300 30" width="300" height="30"><path d="M0,15 Q37.5,0 75,15 T150,15 T225,15 T300,15" stroke="white" stroke-width="4" fill="none" opacity="0.6"/></svg></div>
        <div class="cover-author creative-author">${auth}</div>
      </div>
    </div>`,

    tech: `
    <div class="cover-page tech-cover">
      <div class="tech-grid"></div>
      <div class="tech-circuits"><div class="tc c1"></div><div class="tc c2"></div><div class="tc c3"></div></div>
      <div class="cover-content">
        <div class="tech-badge">TECH</div>
        <h1 class="cover-title tech-title">${title}</h1>${sub}
        <div class="tech-line"></div>
        <div class="cover-author tech-author">${auth}</div>
      </div>
      <div class="tech-footer">POWERED BY AI</div>
    </div>`,

    nature: `
    <div class="cover-page nature-cover">
      <div class="nature-leaves"><div class="nl l1">🍃</div><div class="nl l2">🌿</div><div class="nl l3">🍃</div><div class="nl l4">🌿</div></div>
      <div class="nature-texture"></div>
      <div class="cover-content">
        <div class="nature-badge">🌱 NATURE</div>
        <h1 class="cover-title nature-title">${title}</h1>${sub}
        <div class="cover-author nature-author">${auth}</div>
      </div>
    </div>`,

    fashion: `
    <div class="cover-page fashion-cover">
      <div class="fashion-texture"></div><div class="fashion-frame"></div>
      <div class="cover-content">
        <div class="fashion-badge">STYLE</div>
        <h1 class="cover-title fashion-title">${title}</h1>${sub}
        <div class="fashion-divider">✦ ✦ ✦</div>
        <div class="cover-author fashion-author">${auth}</div>
      </div>
      <div class="fashion-corner tl"></div><div class="fashion-corner tr"></div>
      <div class="fashion-corner bl"></div><div class="fashion-corner br"></div>
    </div>`,

    corporate: `
    <div class="cover-page corporate-cover">
      <div class="corporate-grid"></div>
      <div class="corporate-bars"><div class="cb2 b1"></div><div class="cb2 b2"></div><div class="cb2 b3"></div></div>
      <div class="cover-content">
        <div class="corporate-badge">BUSINESS</div>
        <h1 class="cover-title corporate-title">${title}</h1>
        ${subtitle ? `<div class="corporate-subtitle">${subtitle}</div>` : ''}
        <div class="cover-author corporate-author">${auth}</div>
      </div>
    </div>`,

    retro: `
    <div class="cover-page retro-cover">
      <div class="retro-paper"></div>
      <div class="retro-stamp">VINTAGE</div>
      <div class="cover-content">
        <div class="retro-badge">ÉDITION CLASSIQUE</div>
        <h1 class="cover-title retro-title">${title}</h1>${sub}
        <div class="retro-ornament">❦ ❦ ❦</div>
        <div class="cover-author retro-author">${auth}</div>
        <div class="retro-year">EST. 2026</div>
      </div>
    </div>`,

    futuriste: `
    <div class="cover-page futuriste-cover">
      <div class="futuriste-grid"></div><div class="futuriste-glow"></div>
      <div class="futuriste-particles"><div class="fp p1"></div><div class="fp p2"></div><div class="fp p3"></div><div class="fp p4"></div></div>
      <div class="cover-content">
        <div class="futuriste-badge">◢ FUTURE ◣</div>
        <h1 class="cover-title futuriste-title">${title}</h1>${sub}
        <div class="futuriste-hexagon"></div>
        <div class="cover-author futuriste-author">${auth}</div>
      </div>
    </div>`,

    // ---- NOUVEAUX ----

    afrique: `
    <div class="cover-page afrique-cover">
      <div class="afrique-pattern"></div>
      <div class="afrique-circles"><div class="ac c1"></div><div class="ac c2"></div></div>
      <div class="afrique-kente"></div>
      <div class="cover-content">
        <div class="afrique-badge">🌍 AFRIQUE</div>
        <h1 class="cover-title afrique-title">${title}</h1>${sub}
        <div class="afrique-divider">◆ ◆ ◆</div>
        <div class="cover-author afrique-author">${auth}</div>
      </div>
    </div>`,

    sport: `
    <div class="cover-page sport-cover">
      <div class="sport-stripes"></div>
      <div class="sport-diagonal"></div>
      <div class="cover-content">
        <div class="sport-badge">⚡ PERFORMANCE</div>
        <h1 class="cover-title sport-title">${title}</h1>${sub}
        <div class="sport-bar"></div>
        <div class="cover-author sport-author">${auth}</div>
      </div>
    </div>`,

    wellness: `
    <div class="cover-page wellness-cover">
      <div class="wellness-circles"><div class="wc w1"></div><div class="wc w2"></div><div class="wc w3"></div></div>
      <div class="wellness-dots"></div>
      <div class="cover-content">
        <div class="wellness-badge">🌸 BIEN-ÊTRE</div>
        <h1 class="cover-title wellness-title">${title}</h1>
        ${subtitle ? `<p class="wellness-sub">${subtitle}</p>` : ''}
        <div class="wellness-flower">✿ ✿ ✿</div>
        <div class="cover-author wellness-author">${auth}</div>
      </div>
    </div>`,

    business: `
    <div class="cover-page business-cover">
      <div class="business-grid"></div>
      <div class="business-accent-bar"></div>
      <div class="cover-content">
        <div class="business-badge">PREMIUM BUSINESS</div>
        <h1 class="cover-title business-title">${title}</h1>
        ${subtitle ? `<div class="business-subtitle">${subtitle}</div>` : ''}
        <div class="business-separator"></div>
        <div class="business-author-block">
          <span class="business-by">Par</span>
          <span class="business-name">${auth}</span>
        </div>
      </div>
    </div>`,
  };

  return covers[key] || covers.modern;
}

// ============================================================================
// 4. SOMMAIRES — 16 designs
// ============================================================================
function buildTOC(items, key, theme) {
  const romans = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI'];
  const n = i => String(i).padStart(2,'0');

  const tocs = {

    luxe: `<div class="toc-page toc-luxe">
      <h1 class="toc-title">Table des Matières</h1>
      <div class="toc-ornament">◆</div>
      <div class="toc-list">${items.map((it,idx)=>`
        <div class="toc-item"><span class="toc-num-roman">${romans[idx]||idx+1}</span><span class="toc-dots"></span><span class="toc-text">${it.text}</span></div>`).join('')}
      </div></div>`,

    modern: `<div class="toc-page toc-modern">
      <h1 class="toc-title">Sommaire</h1>
      <div class="toc-list">${items.map(it=>`
        <div class="toc-item"><span class="toc-num-big">${n(it.num)}</span><div class="toc-content"><span class="toc-text">${it.text}</span><span class="toc-line-diag"></span></div></div>`).join('')}
      </div></div>`,

    educatif: `<div class="toc-page toc-educatif">
      <h1 class="toc-title">📚 Programme</h1>
      <div class="toc-list">${items.map(it=>`
        <div class="toc-item"><span class="toc-circle">${n(it.num)}</span><span class="toc-check">✓</span><span class="toc-text">${it.text}</span></div>`).join('')}
      </div></div>`,

    energie: `<div class="toc-page toc-energie">
      <h1 class="toc-title">⚡ ROADMAP</h1>
      <div class="toc-list">${items.map(it=>`
        <div class="toc-item"><span class="toc-diamond">${n(it.num)}</span><span class="toc-arrow">→</span><span class="toc-text">${it.text}</span></div>`).join('')}
      </div></div>`,

    minimal: `<div class="toc-page toc-minimal">
      <h1 class="toc-title">Index</h1>
      <div class="toc-list">${items.map(it=>`
        <div class="toc-item"><span class="toc-dot">•</span><span class="toc-text">${it.text}</span><span class="toc-num-small">${n(it.num)}</span></div>`).join('')}
      </div></div>`,

    creative: `<div class="toc-page toc-creative">
      <h1 class="toc-title">✨ Au Menu</h1>
      <div class="toc-list">${items.map(it=>`
        <div class="toc-item"><span class="toc-badge">${n(it.num)}</span><span class="toc-text">${it.text}</span></div>`).join('')}
      </div></div>`,

    tech: `<div class="toc-page toc-tech">
      <h1 class="toc-title">&lt; INDEX /&gt;</h1>
      <div class="toc-list">${items.map(it=>`
        <div class="toc-item"><span class="toc-binary">${it.num.toString(2).padStart(4,'0')}</span><span class="toc-bracket">[</span><span class="toc-text">${it.text}</span><span class="toc-bracket">]</span></div>`).join('')}
      </div></div>`,

    nature: `<div class="toc-page toc-nature">
      <h1 class="toc-title">🌿 Parcours</h1>
      <div class="toc-list">${items.map(it=>`
        <div class="toc-item"><span class="toc-leaf">🍃</span><span class="toc-text">${it.text}</span><span class="toc-num-nature">${n(it.num)}</span></div>`).join('')}
      </div></div>`,

    fashion: `<div class="toc-page toc-fashion">
      <h1 class="toc-title">Sommaire</h1>
      <div class="toc-divider">✦</div>
      <div class="toc-list">${items.map(it=>`
        <div class="toc-item"><span class="toc-num-serif">${n(it.num)}</span><span class="toc-text">${it.text}</span></div>`).join('')}
      </div></div>`,

    corporate: `<div class="toc-page toc-corporate">
      <h1 class="toc-title">TABLE OF CONTENTS</h1>
      <div class="toc-list">${items.map(it=>`
        <div class="toc-item"><span class="toc-bar"></span><span class="toc-num-corp">${n(it.num)}</span><span class="toc-text">${it.text}</span></div>`).join('')}
      </div></div>`,

    retro: `<div class="toc-page toc-retro">
      <h1 class="toc-title">Table des Matières</h1>
      <div class="toc-orn-retro">❦ ❦ ❦</div>
      <div class="toc-list">${items.map(it=>`
        <div class="toc-item"><span class="toc-num-retro">${it.num}.</span><span class="toc-dots-retro"></span><span class="toc-text">${it.text}</span></div>`).join('')}
      </div></div>`,

    futuriste: `<div class="toc-page toc-futuriste">
      <h1 class="toc-title">◢ NAVIGATION ◣</h1>
      <div class="toc-list">${items.map(it=>`
        <div class="toc-item"><span class="toc-hex">${n(it.num)}</span><span class="toc-line-neon"></span><span class="toc-text">${it.text}</span></div>`).join('')}
      </div></div>`,

    afrique: `<div class="toc-page toc-afrique">
      <h1 class="toc-title">🌍 Sommaire</h1>
      <div class="toc-orn-afrique">◆ ◆ ◆</div>
      <div class="toc-list">${items.map(it=>`
        <div class="toc-item"><span class="toc-num-afrique">${n(it.num)}</span><span class="toc-text">${it.text}</span></div>`).join('')}
      </div></div>`,

    sport: `<div class="toc-page toc-sport">
      <h1 class="toc-title">⚡ PROGRAMME</h1>
      <div class="toc-list">${items.map(it=>`
        <div class="toc-item"><span class="toc-num-sport">${n(it.num)}</span><span class="toc-arr-sport">▶</span><span class="toc-text">${it.text}</span></div>`).join('')}
      </div></div>`,

    wellness: `<div class="toc-page toc-wellness">
      <h1 class="toc-title">🌸 Votre Parcours</h1>
      <div class="toc-list">${items.map(it=>`
        <div class="toc-item"><span class="toc-flower">✿</span><span class="toc-text">${it.text}</span><span class="toc-num-well">${n(it.num)}</span></div>`).join('')}
      </div></div>`,

    business: `<div class="toc-page toc-business">
      <h1 class="toc-title">TABLE DES MATIÈRES</h1>
      <div class="toc-biz-line"></div>
      <div class="toc-list">${items.map(it=>`
        <div class="toc-item"><span class="toc-num-biz">${n(it.num)}</span><span class="toc-text">${it.text}</span><span class="toc-dots-biz"></span></div>`).join('')}
      </div></div>`,
  };

  return tocs[key] || tocs.modern;
}

// ============================================================================
// 5. CHAPITRES
// ============================================================================
function buildChapter(num, label, title, content, key, pageNum) {
  const pageFooter = {
    modern:    `<div class="page-number pn-modern">${pageNum}</div>`,
    luxe:      `<div class="page-number pn-luxe">◆ ${pageNum} ◆</div>`,
    tech:      `<div class="page-number pn-tech">0x${pageNum.toString(16).toUpperCase()}</div>`,
    energie:   `<div class="page-number pn-energie">${pageNum}</div>`,
    minimal:   `<div class="page-number pn-minimal">${pageNum}</div>`,
    creative:  `<div class="page-number pn-creative">${pageNum}</div>`,
    educatif:  `<div class="page-number pn-educatif">${pageNum}</div>`,
    nature:    `<div class="page-number pn-nature">🌿 ${pageNum}</div>`,
    fashion:   `<div class="page-number pn-fashion">${pageNum}</div>`,
    corporate: `<div class="page-number pn-corporate">${pageNum}</div>`,
    retro:     `<div class="page-number pn-retro">— ${pageNum} —</div>`,
    futuriste: `<div class="page-number pn-futuriste">${pageNum}</div>`,
    afrique:   `<div class="page-number pn-afrique">◆ ${pageNum} ◆</div>`,
    sport:     `<div class="page-number pn-sport">${pageNum}</div>`,
    wellness:  `<div class="page-number pn-wellness">✿ ${pageNum}</div>`,
    business:  `<div class="page-number pn-business">${pageNum}</div>`,
  };

  return `
  <div class="content-page start-chapter template-${key}">
    <div class="chapter-header-${key}">
      <div class="chapter-number">${num}</div>
      <div class="chapter-info">
        <div class="chapter-label">${label}</div>
        <h1 class="chapter-title">${title}</h1>
      </div>
    </div>
    <div class="section-content">${content || ''}</div>
    ${pageFooter[key] || pageFooter.modern}
  </div>`;
}

// ============================================================================
// 6. CSS COMPLET — 16 templates
// ============================================================================

// ── Font URLs par famille (chargement minimal) ──
const FONT_URLS = {
  'Inter':           'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
  'Playfair Display':'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap',
  'Manrope':         'https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap',
  'Nunito':          'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800;900&display=swap',
  'Merriweather':    'https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&display=swap',
};
function getFontUrl(font) {
  return FONT_URLS[font] || FONT_URLS['Inter'];
}

function buildCSS(theme, key) {
  return `
    @import url('${getFontUrl(theme.font)}');

    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: '${theme.font}', "Noto Color Emoji", sans-serif; color: #1e293b; font-size: 18px; line-height: 1.8; background: white; }
    @page { size: A4; margin: 20mm 15mm 30mm 15mm; }
    @page :first { margin: 0; }
    .start-chapter { page-break-before: always; margin-top: 0; padding-top: 0; }

    /* ===== COUVERTURE BASE ===== */
    .cover-page { width:100%; min-height:100vh; display:flex; align-items:center; justify-content:center; text-align:center; padding:0; page-break-after:always; position:relative; overflow:hidden; }
    .cover-content { position:relative; z-index:10; padding:60px; }
    .cover-title { font-size:56px; font-weight:900; line-height:1.1; margin-bottom:25px; }
    .cover-subtitle { font-size:20px; opacity:0.9; margin-bottom:35px; max-width:680px; margin-inline:auto; }
    .cover-author { font-size:18px; font-weight:700; margin-top:45px; }

    /* ===== MODERN ===== */
    .modern-cover { background:${theme.gradient}; color:white; }
    .modern-grid-3d { position:absolute; inset:0; background-image:linear-gradient(rgba(255,255,255,.1) 2px,transparent 2px),linear-gradient(90deg,rgba(255,255,255,.1) 2px,transparent 2px); background-size:80px 80px; transform:perspective(500px) rotateX(60deg); transform-origin:center; }
    .modern-gradient-overlay { position:absolute; inset:0; background:radial-gradient(circle at 30% 40%,rgba(255,255,255,.15),transparent 60%); }
    .modern-shapes { position:absolute; inset:0; overflow:hidden; }
    .modern-shapes .s1,.modern-shapes .s2,.modern-shapes .s3 { position:absolute; border-radius:50%; opacity:.1; }
    .modern-shapes .s1 { width:400px; height:400px; background:white; top:-200px; right:-100px; }
    .modern-shapes .s2 { width:300px; height:300px; background:${theme.accent}; bottom:-150px; left:-100px; }
    .modern-shapes .s3 { width:200px; height:200px; background:white; top:50%; left:10%; }
    .modern-badge { display:inline-block; background:rgba(255,255,255,.2); border:2px solid rgba(255,255,255,.3); padding:12px 40px; border-radius:50px; font-weight:800; font-size:13px; letter-spacing:4px; margin-bottom:40px; color:white; }
    .modern-title { text-transform:uppercase; text-shadow:0 8px 32px rgba(0,0,0,.3); }
    .modern-author { letter-spacing:3px; padding:18px 50px; border:2px solid white; border-radius:12px; display:inline-block; background:rgba(0,0,0,.2); }
    .modern-footer { position:absolute; bottom:40px; left:50%; transform:translateX(-50%); font-size:11px; letter-spacing:4px; opacity:.6; font-weight:700; color:white; }

    /* ===== LUXE ===== */
    .luxe-cover { background:${theme.gradient}; color:${theme.accent}; }
    .luxe-texture { position:absolute; inset:0; background-image:repeating-linear-gradient(45deg,transparent,transparent 2px,rgba(212,175,55,.03) 2px,rgba(212,175,55,.03) 4px); }
    .luxe-frame-outer { position:absolute; inset:30px; border:3px double ${theme.secondary}; pointer-events:none; }
    .luxe-frame-inner { position:absolute; inset:45px; border:1px solid ${theme.secondary}; pointer-events:none; }
    .luxe-ornament-top,.luxe-ornament-bottom { position:absolute; left:50%; transform:translateX(-50%); font-size:24px; color:${theme.secondary}; letter-spacing:20px; }
    .luxe-ornament-top { top:50px; } .luxe-ornament-bottom { bottom:50px; }
    .luxe-badge { display:inline-block; background:linear-gradient(135deg,${theme.secondary},${theme.accent}); color:#1a1a1a; padding:12px 40px; border-radius:4px; font-weight:900; font-size:12px; letter-spacing:5px; margin-bottom:30px; }
    .luxe-divider { width:150px; height:2px; background:linear-gradient(90deg,transparent,${theme.secondary},transparent); margin:25px auto; }
    .luxe-title { font-family:'Playfair Display',serif; font-size:52px; font-weight:900; line-height:1.2; margin:0 80px; }
    .luxe-subtitle { font-family:'Merriweather',serif; font-size:16px; font-style:italic; opacity:.8; margin:30px 0 50px; }
    .luxe-author { display:flex; flex-direction:column; gap:8px; margin-top:50px; }
    .luxe-author .author-label { font-size:11px; letter-spacing:3px; opacity:.7; }
    .luxe-author .author-name { font-family:'Playfair Display',serif; font-size:26px; font-weight:700; }

    /* ===== ÉDUCATIF ===== */
    .educatif-cover { background:${theme.gradient}; color:white; }
    .educatif-grid { position:absolute; inset:0; background-image:linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px); background-size:60px 60px; }
    .educatif-icons { position:absolute; inset:0; display:flex; justify-content:space-around; align-items:center; padding:0 60px; opacity:.12; }
    .educatif-icons .ei { font-size:100px; }
    .educatif-badge { display:inline-block; background:rgba(255,255,255,.2); border:2px solid rgba(255,255,255,.4); padding:14px 45px; border-radius:8px; font-weight:900; font-size:13px; letter-spacing:4px; margin-bottom:40px; color:white; }
    .educatif-title { font-size:54px; font-weight:800; line-height:1.15; margin:0 70px 20px; }
    .educatif-author { font-size:17px; font-weight:700; letter-spacing:3px; padding:16px 50px; border:2px solid white; border-radius:10px; display:inline-block; }

    /* ===== ÉNERGIE ===== */
    .energie-cover { background:${theme.gradient}; color:white; }
    .energie-rays { position:absolute; inset:0; background:repeating-linear-gradient(45deg,transparent,transparent 30px,rgba(255,255,255,.08) 30px,rgba(255,255,255,.08) 60px); }
    .energie-circles { position:absolute; inset:0; }
    .ec { position:absolute; border:3px solid rgba(255,255,255,.2); border-radius:50%; }
    .ec.c1 { width:500px; height:500px; top:-250px; right:-100px; }
    .ec.c2 { width:350px; height:350px; bottom:-150px; left:-100px; }
    .ec.c3 { width:200px; height:200px; top:40%; left:20%; }
    .energie-badge { display:inline-block; background:rgba(255,255,255,.25); border:3px solid rgba(255,255,255,.5); padding:14px 45px; border-radius:12px; font-weight:900; font-size:14px; letter-spacing:5px; margin-bottom:40px; color:white; }
    .energie-title { font-size:60px; font-weight:900; line-height:1.1; margin:0 60px 40px; text-transform:uppercase; text-shadow:0 6px 24px rgba(0,0,0,.4); }
    .energie-lightning { margin:40px 0; }
    .energie-author { font-size:19px; font-weight:900; letter-spacing:4px; padding:18px 55px; background:rgba(0,0,0,.35); border-radius:8px; display:inline-block; }

    /* ===== MINIMAL ===== */
    .minimal-cover { background:white; color:${theme.primary}; }
    .minimal-grid { position:absolute; inset:40px; border:1px solid #e2e8f0; }
    .minimal-label { font-size:12px; font-weight:800; letter-spacing:6px; margin-bottom:60px; opacity:.5; }
    .minimal-title { font-size:68px; font-weight:300; line-height:.95; letter-spacing:-4px; margin:0 80px 50px; }
    .minimal-sub { font-size:18px; color:${theme.secondary}; max-width:500px; margin:0 auto 40px; }
    .minimal-line { width:100px; height:3px; background:${theme.primary}; margin:0 auto 60px; }
    .minimal-author { font-size:15px; font-weight:600; letter-spacing:3px; text-transform:uppercase; color:${theme.secondary}; margin-bottom:20px; }
    .minimal-year { font-size:13px; font-weight:500; opacity:.4; letter-spacing:2px; }

    /* ===== CRÉATIF ===== */
    .creative-cover { background:${theme.gradient}; color:white; }
    .cb { position:absolute; border-radius:30% 70% 70% 30% / 30% 30% 70% 70%; opacity:.2; }
    .cb.blob-1 { width:500px; height:500px; background:${theme.accent}; top:-150px; right:-150px; }
    .cb.blob-2 { width:350px; height:350px; background:white; bottom:-100px; left:-100px; border-radius:70% 30% 30% 70% / 70% 70% 30% 30%; }
    .cb.blob-3 { width:250px; height:250px; background:${theme.secondary}; top:45%; left:15%; opacity:.15; }
    .cb.blob-4 { width:180px; height:180px; background:white; bottom:30%; right:20%; opacity:.1; }
    .creative-pattern { position:absolute; inset:0; background-image:radial-gradient(circle,rgba(255,255,255,.1) 1px,transparent 1px); background-size:30px 30px; }
    .creative-badge { display:inline-block; background:rgba(255,255,255,.25); border:2px solid rgba(255,255,255,.4); padding:13px 40px; border-radius:50px; font-weight:800; font-size:13px; letter-spacing:3px; margin-bottom:40px; color:white; }
    .creative-title { font-size:58px; font-weight:900; line-height:1.15; margin:0 70px 40px; background:linear-gradient(135deg,white,${theme.accent}); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    .creative-wave { margin:40px auto; opacity:.7; }
    .creative-author { font-size:18px; font-weight:700; letter-spacing:4px; padding:16px 50px; background:rgba(255,255,255,.15); border:2px solid rgba(255,255,255,.3); border-radius:50px; display:inline-block; }

    /* ===== TECH ===== */
    .tech-cover { background:${theme.gradient}; color:white; }
    .tech-grid { position:absolute; inset:0; background-image:linear-gradient(${theme.secondary} 1px,transparent 1px),linear-gradient(90deg,${theme.secondary} 1px,transparent 1px); background-size:50px 50px; opacity:.1; }
    .tech-badge { display:inline-block; background:rgba(0,212,255,.2); border:2px solid ${theme.secondary}; padding:12px 40px; border-radius:4px; font-weight:900; font-size:13px; letter-spacing:5px; margin-bottom:40px; color:${theme.secondary}; box-shadow:0 0 20px rgba(0,212,255,.3); }
    .tech-title { font-size:58px; font-weight:900; line-height:1.1; margin:0 70px 30px; text-transform:uppercase; color:${theme.secondary}; text-shadow:0 0 30px rgba(0,212,255,.5); }
    .tech-line { width:200px; height:3px; background:linear-gradient(90deg,transparent,${theme.secondary},transparent); margin:30px auto 40px; }
    .tech-author { font-size:17px; font-weight:700; letter-spacing:3px; padding:16px 50px; background:rgba(0,212,255,.15); border:2px solid ${theme.secondary}; border-radius:8px; display:inline-block; }
    .tech-footer { position:absolute; bottom:40px; left:50%; transform:translateX(-50%); font-size:10px; letter-spacing:4px; opacity:.5; color:${theme.secondary}; }
    .tech-circuits { position:absolute; inset:0; }
    .tc { position:absolute; border:2px solid ${theme.secondary}; opacity:.3; }
    .tc.c1 { width:300px; height:200px; top:100px; left:50px; border-radius:20px; }
    .tc.c2 { width:200px; height:150px; bottom:100px; right:80px; border-radius:15px; }
    .tc.c3 { width:100px; height:100px; top:50%; left:70%; border-radius:50%; }

    /* ===== NATURE ===== */
    .nature-cover { background:${theme.gradient}; color:white; }
    .nature-leaves { position:absolute; inset:0; }
    .nl { position:absolute; font-size:80px; opacity:.15; }
    .nl.l1 { top:50px; left:80px; transform:rotate(-20deg); }
    .nl.l2 { top:200px; right:100px; transform:rotate(30deg); }
    .nl.l3 { bottom:100px; left:120px; transform:rotate(15deg); }
    .nl.l4 { bottom:200px; right:150px; transform:rotate(-35deg); }
    .nature-texture { position:absolute; inset:0; background-image:repeating-linear-gradient(90deg,transparent,transparent 3px,rgba(255,255,255,.02) 3px,rgba(255,255,255,.02) 6px); }
    .nature-badge { display:inline-block; background:rgba(255,255,255,.2); border:2px solid rgba(255,255,255,.4); padding:14px 45px; border-radius:50px; font-weight:800; font-size:13px; letter-spacing:3px; margin-bottom:40px; color:white; }
    .nature-title { font-size:56px; font-weight:800; line-height:1.15; margin:0 70px 20px; }
    .nature-author { font-size:17px; font-weight:700; letter-spacing:3px; padding:16px 50px; background:rgba(255,255,255,.15); border:2px solid rgba(255,255,255,.3); border-radius:12px; display:inline-block; }

    /* ===== FASHION ===== */
    .fashion-cover { background:${theme.gradient}; color:white; }
    .fashion-texture { position:absolute; inset:0; background-image:linear-gradient(45deg,rgba(255,255,255,.02) 25%,transparent 25%),linear-gradient(-45deg,rgba(255,255,255,.02) 25%,transparent 25%); background-size:60px 60px; }
    .fashion-frame { position:absolute; inset:50px; border:1px solid rgba(255,255,255,.3); }
    .fashion-badge { display:inline-block; background:transparent; border:2px solid white; padding:12px 40px; border-radius:4px; font-weight:700; font-size:12px; letter-spacing:6px; margin-bottom:40px; color:white; }
    .fashion-title { font-family:'Playfair Display',serif; font-size:60px; font-weight:700; line-height:1.1; margin:0 70px 30px; }
    .fashion-divider { font-size:20px; letter-spacing:15px; margin:40px 0; opacity:.7; }
    .fashion-author { font-family:'Playfair Display',serif; font-size:22px; font-weight:500; font-style:italic; }
    .fashion-corner { position:absolute; width:40px; height:40px; border:2px solid rgba(255,255,255,.4); }
    .fashion-corner.tl { top:25px; left:25px; border-right:none; border-bottom:none; }
    .fashion-corner.tr { top:25px; right:25px; border-left:none; border-bottom:none; }
    .fashion-corner.bl { bottom:25px; left:25px; border-right:none; border-top:none; }
    .fashion-corner.br { bottom:25px; right:25px; border-left:none; border-top:none; }

    /* ===== CORPORATE ===== */
    .corporate-cover { background:${theme.gradient}; color:white; }
    .corporate-grid { position:absolute; inset:0; background-image:linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px); background-size:40px 40px; }
    .corporate-bars { position:absolute; bottom:0; left:50%; transform:translateX(-50%); display:flex; gap:20px; opacity:.2; }
    .cb2 { width:60px; background:white; }
    .cb2.b1 { height:150px; } .cb2.b2 { height:250px; } .cb2.b3 { height:200px; }
    .corporate-badge { display:inline-block; background:rgba(255,255,255,.15); border:2px solid rgba(255,255,255,.4); padding:14px 50px; border-radius:8px; font-weight:900; font-size:12px; letter-spacing:5px; margin-bottom:40px; color:white; }
    .corporate-title { font-size:52px; font-weight:800; line-height:1.2; margin:0 80px 20px; text-transform:uppercase; }
    .corporate-subtitle { font-size:18px; font-weight:500; opacity:.85; letter-spacing:3px; margin-bottom:50px; }
    .corporate-author { font-size:16px; font-weight:700; letter-spacing:3px; padding:16px 50px; border:2px solid white; border-radius:8px; display:inline-block; }

    /* ===== RÉTRO ===== */
    .retro-cover { background:${theme.gradient}; color:#f5e6d3; }
    .retro-paper { position:absolute; inset:0; background-image:repeating-linear-gradient(0deg,rgba(0,0,0,.02),rgba(0,0,0,.02) 1px,transparent 1px,transparent 2px); }
    .retro-stamp { position:absolute; top:40px; right:40px; padding:8px 20px; border:3px dashed ${theme.accent}; font-size:11px; font-weight:900; letter-spacing:2px; transform:rotate(8deg); opacity:.7; color:${theme.accent}; }
    .retro-badge { display:inline-block; border:2px solid ${theme.accent}; padding:10px 35px; font-family:'Merriweather',serif; font-size:12px; letter-spacing:4px; margin-bottom:40px; color:${theme.accent}; }
    .retro-title { font-family:'Merriweather',serif; font-size:54px; font-weight:700; line-height:1.2; margin:0 70px 30px; }
    .retro-ornament { font-size:24px; letter-spacing:20px; margin:40px 0; opacity:.6; }
    .retro-author { font-family:'Merriweather',serif; font-size:20px; font-weight:400; font-style:italic; margin-bottom:15px; }
    .retro-year { font-size:11px; font-weight:700; letter-spacing:3px; opacity:.6; }

    /* ===== FUTURISTE ===== */
    .futuriste-cover { background:${theme.gradient}; color:white; }
    .futuriste-grid { position:absolute; inset:0; background-image:linear-gradient(${theme.secondary} 1px,transparent 1px),linear-gradient(90deg,${theme.secondary} 1px,transparent 1px); background-size:100px 100px; opacity:.1; }
    .futuriste-glow { position:absolute; inset:0; background:radial-gradient(circle at 50% 50%,${theme.accent},transparent 70%); opacity:.3; }
    .futuriste-particles { position:absolute; inset:0; }
    .fp { position:absolute; width:3px; height:3px; background:${theme.secondary}; border-radius:50%; box-shadow:0 0 10px ${theme.secondary}; }
    .fp.p1 { top:20%; left:15%; } .fp.p2 { top:60%; right:20%; } .fp.p3 { bottom:25%; left:25%; } .fp.p4 { top:40%; right:35%; }
    .futuriste-badge { display:inline-block; background:rgba(167,139,250,.2); border:2px solid ${theme.secondary}; padding:12px 40px; border-radius:4px; font-weight:900; font-size:13px; letter-spacing:5px; margin-bottom:40px; color:${theme.secondary}; }
    .futuriste-title { font-size:60px; font-weight:900; line-height:1.1; margin:0 70px 40px; text-transform:uppercase; color:${theme.secondary}; text-shadow:0 0 30px ${theme.secondary}; }
    .futuriste-hexagon { width:100px; height:60px; border:3px solid ${theme.secondary}; margin:40px auto; clip-path:polygon(30% 0%,70% 0%,100% 50%,70% 100%,30% 100%,0% 50%); box-shadow:0 0 20px ${theme.secondary}; }
    .futuriste-author { font-size:18px; font-weight:700; letter-spacing:4px; padding:16px 50px; background:rgba(167,139,250,.15); border:2px solid ${theme.secondary}; border-radius:8px; display:inline-block; }

    /* ===== AFRIQUE ===== */
    .afrique-cover { background:${theme.gradient}; color:white; }
    .afrique-pattern { position:absolute; inset:0; background-image:repeating-linear-gradient(60deg,transparent,transparent 10px,rgba(255,255,255,.04) 10px,rgba(255,255,255,.04) 20px),repeating-linear-gradient(-60deg,transparent,transparent 10px,rgba(255,255,255,.04) 10px,rgba(255,255,255,.04) 20px); }
    .afrique-circles { position:absolute; inset:0; }
    .ac { position:absolute; border-radius:50%; border:4px solid rgba(255,255,255,.15); }
    .ac.c1 { width:400px; height:400px; top:-150px; right:-100px; }
    .ac.c2 { width:250px; height:250px; bottom:-80px; left:-60px; }
    .afrique-kente { position:absolute; bottom:0; left:0; right:0; height:20px; background:repeating-linear-gradient(90deg,${theme.secondary} 0px,${theme.secondary} 20px,${theme.accent} 20px,${theme.accent} 40px,#dc2626 40px,#dc2626 60px,white 60px,white 80px); opacity:.6; }
    .afrique-badge { display:inline-block; background:rgba(255,255,255,.2); border:2px solid rgba(255,255,255,.5); padding:12px 40px; border-radius:8px; font-weight:900; font-size:14px; letter-spacing:3px; margin-bottom:40px; color:white; }
    .afrique-title { font-size:56px; font-weight:900; line-height:1.1; margin:0 60px 25px; color:white; }
    .afrique-divider { font-size:18px; letter-spacing:15px; color:${theme.accent}; margin:25px 0; }
    .afrique-author { font-size:18px; font-weight:700; letter-spacing:3px; padding:15px 45px; background:rgba(0,0,0,.3); border-radius:8px; display:inline-block; border:1px solid rgba(255,255,255,.3); }

    /* ===== SPORT ===== */
    .sport-cover { background:${theme.gradient}; color:white; }
    .sport-stripes { position:absolute; inset:0; background:repeating-linear-gradient(-45deg,transparent,transparent 40px,rgba(239,68,68,.15) 40px,rgba(239,68,68,.15) 80px); }
    .sport-diagonal { position:absolute; bottom:0; left:0; right:0; height:200px; background:${theme.secondary}; clip-path:polygon(0 60%,100% 0%,100% 100%,0% 100%); opacity:.3; }
    .sport-badge { display:inline-block; background:${theme.secondary}; color:white; padding:14px 45px; border-radius:4px; font-weight:900; font-size:14px; letter-spacing:4px; margin-bottom:40px; text-transform:uppercase; }
    .sport-title { font-size:62px; font-weight:900; line-height:1.0; margin:0 60px 30px; text-transform:uppercase; letter-spacing:-2px; text-shadow:0 4px 20px rgba(0,0,0,.5); }
    .sport-bar { width:80px; height:6px; background:${theme.accent}; margin:30px auto; border-radius:3px; }
    .sport-author { font-size:18px; font-weight:900; letter-spacing:4px; padding:16px 50px; background:rgba(0,0,0,.4); border-radius:4px; display:inline-block; text-transform:uppercase; }

    /* ===== WELLNESS ===== */
    .wellness-cover { background:linear-gradient(135deg,#f3e8ff 0%,#e9d5ff 50%,#c4b5fd 100%); color:#2e1065; }
    .wellness-circles { position:absolute; inset:0; }
    .wc { position:absolute; border-radius:50%; opacity:.2; }
    .wc.w1 { width:600px; height:600px; background:radial-gradient(circle,#a78bfa,transparent); top:-200px; right:-200px; }
    .wc.w2 { width:400px; height:400px; background:radial-gradient(circle,#8b5cf6,transparent); bottom:-100px; left:-100px; }
    .wc.w3 { width:200px; height:200px; background:radial-gradient(circle,#c084fc,transparent); top:40%; left:30%; }
    .wellness-dots { position:absolute; inset:0; background-image:radial-gradient(circle,rgba(139,92,246,.15) 1px,transparent 1px); background-size:25px 25px; }
    .wellness-badge { display:inline-block; background:rgba(139,92,246,.15); border:2px solid rgba(139,92,246,.4); padding:12px 40px; border-radius:50px; font-weight:800; font-size:13px; letter-spacing:3px; margin-bottom:40px; color:#5b21b6; }
    .wellness-title { font-size:54px; font-weight:800; line-height:1.15; margin:0 70px 20px; color:#2e1065; }
    .wellness-sub { font-size:18px; color:#5b21b6; margin-bottom:30px; max-width:600px; margin-inline:auto; }
    .wellness-flower { font-size:36px; margin:25px 0; color:#7c3aed; letter-spacing:15px; }
    .wellness-author { font-size:18px; font-weight:600; letter-spacing:2px; padding:15px 45px; background:rgba(139,92,246,.1); border:1px solid rgba(139,92,246,.3); border-radius:50px; display:inline-block; color:#4c1d95; }

    /* ===== BUSINESS ===== */
    .business-cover { background:${theme.gradient}; color:white; }
    .business-grid { position:absolute; inset:0; background-image:linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px); background-size:50px 50px; }
    .business-accent-bar { position:absolute; left:0; top:0; bottom:0; width:12px; background:linear-gradient(180deg,${theme.secondary},${theme.accent}); }
    .business-badge { display:inline-block; border:2px solid ${theme.secondary}; padding:10px 35px; font-weight:900; font-size:11px; letter-spacing:6px; margin-bottom:40px; color:${theme.secondary}; }
    .business-title { font-size:52px; font-weight:800; line-height:1.15; margin:0 80px 20px; text-transform:uppercase; }
    .business-subtitle { font-size:18px; opacity:.8; letter-spacing:1px; margin-bottom:50px; }
    .business-separator { width:200px; height:2px; background:linear-gradient(90deg,transparent,${theme.secondary},transparent); margin:30px auto 40px; }
    .business-author-block { display:flex; flex-direction:column; gap:5px; }
    .business-by { font-size:11px; letter-spacing:4px; opacity:.6; }
    .business-name { font-size:24px; font-weight:700; letter-spacing:2px; color:${theme.secondary}; }

    /* ===== SOMMAIRES BASE ===== */
    .toc-page { page-break-after:always; padding:60px 40px; }
    .toc-title { margin-bottom:50px; }
    .toc-list { max-width:680px; margin:0 auto; }
    .toc-item { display:flex; align-items:center; gap:15px; margin-bottom:20px; }
    .toc-text { flex:1; font-size:18px; }

    /* Luxe TOC */
    .toc-luxe .toc-title { font-family:'Playfair Display',serif; font-size:52px; font-weight:900; color:${theme.primary}; text-align:center; }
    .toc-luxe .toc-ornament { text-align:center; font-size:28px; color:${theme.secondary}; margin-bottom:50px; }
    .toc-luxe .toc-item { padding:15px 0; border-bottom:1px solid ${theme.secondary}; align-items:baseline; }
    .toc-luxe .toc-num-roman { font-family:'Playfair Display',serif; font-size:24px; font-weight:700; color:${theme.secondary}; min-width:50px; }
    .toc-luxe .toc-dots { flex:1; height:1px; background:repeating-linear-gradient(90deg,${theme.secondary} 0,${theme.secondary} 4px,transparent 4px,transparent 8px); margin:0 15px; }
    .toc-luxe .toc-text { font-family:'Merriweather',serif; font-size:18px; font-style:italic; color:${theme.primary}; flex:0; }

    /* Modern TOC */
    .toc-modern .toc-title { font-size:56px; font-weight:900; color:${theme.primary}; text-transform:uppercase; }
    .toc-modern .toc-item { gap:30px; margin-bottom:30px; }
    .toc-modern .toc-num-big { font-size:72px; font-weight:900; color:${theme.secondary}; opacity:.3; min-width:100px; }
    .toc-modern .toc-content { flex:1; }
    .toc-modern .toc-text { font-size:20px; font-weight:700; color:${theme.primary}; display:block; margin-bottom:10px; }
    .toc-modern .toc-line-diag { display:block; width:100%; height:4px; background:linear-gradient(90deg,${theme.secondary},transparent); transform:skewY(-2deg); }

    /* Educatif TOC */
    .toc-educatif .toc-title { font-size:48px; font-weight:800; color:${theme.primary}; text-align:center; }
    .toc-educatif .toc-item { padding:15px; background:#f8fafc; border-radius:12px; margin-bottom:20px; }
    .toc-educatif .toc-circle { width:50px; height:50px; border-radius:50%; background:${theme.secondary}; color:white; display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:900; flex-shrink:0; }
    .toc-educatif .toc-check { font-size:24px; color:${theme.accent}; }
    .toc-educatif .toc-text { font-size:18px; font-weight:600; color:${theme.primary}; }

    /* Energie TOC */
    .toc-energie .toc-title { font-size:52px; font-weight:900; color:${theme.primary}; text-transform:uppercase; text-align:center; }
    .toc-energie .toc-item { margin-bottom:25px; }
    .toc-energie .toc-diamond { width:55px; height:55px; background:${theme.secondary}; color:white; display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:900; transform:rotate(45deg); flex-shrink:0; }
    .toc-energie .toc-arrow { font-size:28px; color:${theme.accent}; font-weight:900; }
    .toc-energie .toc-text { font-size:19px; font-weight:700; color:${theme.primary}; }

    /* Minimal TOC */
    .toc-minimal .toc-title { font-size:48px; font-weight:300; color:${theme.primary}; letter-spacing:-2px; }
    .toc-minimal .toc-item { padding:12px 0; border-bottom:1px solid #e2e8f0; align-items:baseline; }
    .toc-minimal .toc-dot { font-size:28px; color:${theme.secondary}; }
    .toc-minimal .toc-text { font-size:18px; font-weight:400; color:${theme.primary}; }
    .toc-minimal .toc-num-small { font-size:14px; font-weight:600; color:${theme.secondary}; }

    /* Creative TOC */
    .toc-creative .toc-title { font-size:50px; font-weight:900; color:${theme.primary}; text-align:center; }
    .toc-creative .toc-badge { background:${theme.secondary}; color:white; padding:10px 20px; border-radius:20px; font-size:16px; font-weight:800; }
    .toc-creative .toc-text { font-size:19px; font-weight:700; color:${theme.primary}; }

    /* Tech TOC */
    .toc-tech .toc-title { font-family:'Courier New',monospace; font-size:44px; font-weight:900; color:${theme.secondary}; text-align:center; text-shadow:0 0 20px ${theme.secondary}; }
    .toc-tech .toc-item { padding:12px 20px; background:rgba(0,212,255,.05); border-left:3px solid ${theme.secondary}; }
    .toc-tech .toc-binary { font-family:'Courier New',monospace; font-size:16px; color:${theme.secondary}; min-width:60px; }
    .toc-tech .toc-bracket { font-family:'Courier New',monospace; color:${theme.accent}; font-size:20px; }
    .toc-tech .toc-text { font-size:18px; font-weight:600; color:${theme.primary}; }

    /* Nature TOC */
    .toc-nature .toc-title { font-size:50px; font-weight:800; color:${theme.primary}; text-align:center; }
    .toc-nature .toc-item { padding:15px; background:rgba(34,197,94,.05); border-radius:12px; }
    .toc-nature .toc-leaf { font-size:32px; }
    .toc-nature .toc-text { font-size:18px; font-weight:600; color:${theme.primary}; }
    .toc-nature .toc-num-nature { font-size:18px; font-weight:800; color:${theme.secondary}; }

    /* Fashion TOC */
    .toc-fashion .toc-title { font-family:'Playfair Display',serif; font-size:54px; font-weight:700; color:${theme.primary}; text-align:center; margin-bottom:20px !important; }
    .toc-fashion .toc-divider { text-align:center; font-size:24px; color:${theme.secondary}; margin-bottom:50px; }
    .toc-fashion .toc-item { padding:12px 0; border-bottom:1px solid rgba(240,171,252,.5); align-items:baseline; gap:25px; }
    .toc-fashion .toc-num-serif { font-family:'Playfair Display',serif; font-size:28px; font-weight:700; color:${theme.secondary}; min-width:50px; }
    .toc-fashion .toc-text { font-family:'Playfair Display',serif; font-size:19px; font-weight:500; color:${theme.primary}; }

    /* Corporate TOC */
    .toc-corporate .toc-title { font-size:50px; font-weight:800; color:${theme.primary}; text-transform:uppercase; letter-spacing:1px; }
    .toc-corporate .toc-item { padding:12px 0; border-bottom:1px solid #e2e8f0; }
    .toc-corporate .toc-bar { width:6px; height:40px; background:${theme.secondary}; flex-shrink:0; }
    .toc-corporate .toc-num-corp { font-size:24px; font-weight:900; color:${theme.secondary}; min-width:50px; }
    .toc-corporate .toc-text { font-size:18px; font-weight:600; color:${theme.primary}; }

    /* Retro TOC */
    .toc-retro .toc-title { font-family:'Merriweather',serif; font-size:48px; font-weight:700; color:${theme.primary}; text-align:center; margin-bottom:20px !important; }
    .toc-retro .toc-orn-retro { text-align:center; font-size:24px; color:${theme.secondary}; letter-spacing:20px; margin-bottom:50px; }
    .toc-retro .toc-item { font-family:'Merriweather',serif; align-items:baseline; gap:10px; margin-bottom:18px; }
    .toc-retro .toc-num-retro { font-size:18px; font-weight:700; color:${theme.secondary}; min-width:40px; }
    .toc-retro .toc-dots-retro { flex:1; border-bottom:2px dotted ${theme.accent}; margin:0 10px 3px; }
    .toc-retro .toc-text { font-size:17px; font-weight:400; color:${theme.primary}; flex:0; }

    /* Futuriste TOC */
    .toc-futuriste .toc-title { font-size:48px; font-weight:900; color:${theme.secondary}; text-align:center; text-shadow:0 0 20px ${theme.secondary}; }
    .toc-futuriste .toc-item { margin-bottom:25px; }
    .toc-futuriste .toc-hex { width:60px; height:40px; background:${theme.secondary}; color:white; display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:900; clip-path:polygon(30% 0%,70% 0%,100% 50%,70% 100%,30% 100%,0% 50%); box-shadow:0 0 15px ${theme.secondary}; }
    .toc-futuriste .toc-line-neon { flex:1; height:2px; background:linear-gradient(90deg,${theme.secondary},transparent); box-shadow:0 0 10px ${theme.secondary}; }
    .toc-futuriste .toc-text { font-size:18px; font-weight:700; color:${theme.primary}; }

    /* Afrique TOC */
    .toc-afrique .toc-title { font-size:52px; font-weight:900; color:${theme.primary}; text-align:center; margin-bottom:20px !important; }
    .toc-afrique .toc-orn-afrique { text-align:center; font-size:20px; color:${theme.secondary}; letter-spacing:15px; margin-bottom:50px; }
    .toc-afrique .toc-item { padding:18px; background:rgba(217,119,6,.05); border-left:5px solid ${theme.secondary}; border-radius:0 12px 12px 0; }
    .toc-afrique .toc-num-afrique { font-size:28px; font-weight:900; color:${theme.secondary}; min-width:55px; }
    .toc-afrique .toc-text { font-size:19px; font-weight:600; color:${theme.primary}; }

    /* Sport TOC */
    .toc-sport .toc-title { font-size:52px; font-weight:900; color:${theme.primary}; text-transform:uppercase; letter-spacing:-1px; }
    .toc-sport .toc-item { padding:15px 20px; border-left:6px solid ${theme.secondary}; background:#f8fafc; }
    .toc-sport .toc-num-sport { font-size:32px; font-weight:900; color:${theme.secondary}; min-width:60px; }
    .toc-sport .toc-arr-sport { font-size:20px; color:${theme.accent}; }
    .toc-sport .toc-text { font-size:18px; font-weight:700; color:${theme.primary}; }

    /* Wellness TOC */
    .toc-wellness .toc-title { font-size:50px; font-weight:800; color:#4c1d95; text-align:center; }
    .toc-wellness .toc-item { padding:15px 20px; background:rgba(139,92,246,.05); border-radius:50px; }
    .toc-wellness .toc-flower { font-size:28px; }
    .toc-wellness .toc-text { font-size:18px; font-weight:600; color:#2e1065; }
    .toc-wellness .toc-num-well { font-size:16px; font-weight:700; color:${theme.secondary}; }

    /* Business TOC */
    .toc-business .toc-title { font-size:48px; font-weight:900; color:${theme.primary}; text-transform:uppercase; letter-spacing:2px; margin-bottom:20px !important; }
    .toc-business .toc-biz-line { width:100%; height:3px; background:linear-gradient(90deg,${theme.secondary},transparent); margin-bottom:50px; }
    .toc-business .toc-item { padding:18px 0; border-bottom:1px solid #e2e8f0; }
    .toc-business .toc-num-biz { font-size:22px; font-weight:900; color:${theme.secondary}; min-width:50px; font-style:italic; }
    .toc-business .toc-text { font-size:18px; font-weight:600; color:${theme.primary}; }
    .toc-business .toc-dots-biz { width:80px; height:1px; background:repeating-linear-gradient(90deg,${theme.secondary} 0,${theme.secondary} 3px,transparent 3px,transparent 6px); }

    /* ===== CHAPITRES — HEADERS 16 TEMPLATES ===== */
    .content-page { position:relative; padding-top:0; }
    .content-page::before { content:''; position:absolute; left:0; top:0; bottom:0; width:4px; background:${theme.secondary}; opacity:.15; }

    /* Modern chapter */
    .template-modern .chapter-header-modern { display:flex; align-items:flex-start; gap:30px; margin-bottom:60px; padding-bottom:40px; border-bottom:4px solid ${theme.secondary}; }
    .template-modern .chapter-number { font-size:140px; font-weight:900; color:${theme.secondary}; line-height:.8; opacity:.2; min-width:150px; }
    .template-modern .chapter-info { flex:1; padding-top:30px; }
    .template-modern .chapter-label { font-size:13px; font-weight:800; letter-spacing:4px; color:${theme.secondary}; margin-bottom:15px; }
    .template-modern .chapter-title { font-size:44px; font-weight:900; color:${theme.primary}; line-height:1.2; }

    /* Luxe chapter */
    .template-luxe .chapter-header-luxe { text-align:center; margin-bottom:70px; padding:50px; border:3px double ${theme.secondary}; position:relative; }
    .template-luxe .chapter-number { font-family:'Playfair Display',serif; font-size:80px; font-weight:900; color:${theme.secondary}; margin-bottom:20px; }
    .template-luxe .chapter-label { font-size:12px; letter-spacing:5px; color:${theme.secondary}; margin-bottom:25px; }
    .template-luxe .chapter-title { font-family:'Playfair Display',serif; font-size:42px; font-weight:900; color:${theme.primary}; line-height:1.3; }

    /* Educatif chapter */
    .template-educatif .chapter-header-educatif { display:flex; align-items:center; gap:30px; margin-bottom:60px; padding:30px; background:linear-gradient(135deg,rgba(16,185,129,.1),transparent); border-left:6px solid ${theme.secondary}; }
    .template-educatif .chapter-number { width:100px; height:100px; border-radius:50%; background:${theme.secondary}; color:white; display:flex; align-items:center; justify-content:center; font-size:48px; font-weight:900; flex-shrink:0; }
    .template-educatif .chapter-info { flex:1; }
    .template-educatif .chapter-label { font-size:13px; font-weight:800; letter-spacing:3px; color:${theme.secondary}; margin-bottom:10px; }
    .template-educatif .chapter-title { font-size:40px; font-weight:800; color:${theme.primary}; line-height:1.2; }

    /* Energie chapter */
    .template-energie .chapter-header-energie { display:flex; align-items:center; gap:30px; margin-bottom:60px; }
    .template-energie .chapter-number { width:120px; height:120px; background:linear-gradient(135deg,${theme.secondary},${theme.accent}); color:white; display:flex; align-items:center; justify-content:center; font-size:52px; font-weight:900; transform:rotate(45deg); flex-shrink:0; }
    .template-energie .chapter-info { flex:1; }
    .template-energie .chapter-label { font-size:14px; font-weight:900; letter-spacing:4px; color:${theme.secondary}; margin-bottom:12px; }
    .template-energie .chapter-title { font-size:44px; font-weight:900; color:${theme.primary}; line-height:1.1; }

    /* Minimal chapter */
    .template-minimal .chapter-header-minimal { margin-bottom:80px; padding-bottom:30px; border-bottom:1px solid ${theme.secondary}; }
    .template-minimal .chapter-number { font-size:20px; font-weight:600; color:${theme.secondary}; margin-bottom:20px; letter-spacing:2px; }
    .template-minimal .chapter-label { font-size:11px; font-weight:600; letter-spacing:4px; color:${theme.secondary}; opacity:.6; margin-bottom:15px; }
    .template-minimal .chapter-title { font-size:52px; font-weight:300; color:${theme.primary}; line-height:1.1; letter-spacing:-2px; }

    /* Creative chapter */
    .template-creative .chapter-header-creative { text-align:center; margin-bottom:60px; padding:40px; background:linear-gradient(135deg,rgba(168,85,247,.05),rgba(236,72,153,.05)); border-radius:20px; }
    .template-creative .chapter-number { display:inline-block; background:${theme.secondary}; color:white; padding:15px 35px; border-radius:30px; font-size:32px; font-weight:900; margin-bottom:20px; }
    .template-creative .chapter-label { font-size:13px; font-weight:800; letter-spacing:3px; color:${theme.secondary}; margin-bottom:15px; }
    .template-creative .chapter-title { font-size:42px; font-weight:900; background:linear-gradient(135deg,${theme.primary},${theme.secondary}); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; line-height:1.3; }

    /* Tech chapter */
    .template-tech .chapter-header-tech { margin-bottom:60px; padding:30px; background:rgba(0,212,255,.05); border-left:4px solid ${theme.secondary}; font-family:'Courier New',monospace; }
    .template-tech .chapter-number { font-size:24px; color:${theme.secondary}; margin-bottom:15px; text-shadow:0 0 10px ${theme.secondary}; }
    .template-tech .chapter-number::before { content:'0x'; }
    .template-tech .chapter-label { font-size:12px; letter-spacing:2px; color:${theme.accent}; margin-bottom:15px; }
    .template-tech .chapter-label::before { content:'< '; } .template-tech .chapter-label::after { content:' />'; }
    .template-tech .chapter-title { font-family:'Inter',sans-serif; font-size:42px; font-weight:900; color:${theme.primary}; line-height:1.2; }

    /* Nature chapter */
    .template-nature .chapter-header-nature { display:flex; align-items:center; gap:25px; margin-bottom:60px; padding:30px; background:rgba(34,197,94,.05); border-radius:16px; }
    .template-nature .chapter-number { font-size:60px; flex-shrink:0; }
    .template-nature .chapter-number::before { content:'🌿'; }
    .template-nature .chapter-info { flex:1; }
    .template-nature .chapter-label { font-size:13px; font-weight:800; letter-spacing:3px; color:${theme.secondary}; margin-bottom:12px; }
    .template-nature .chapter-title { font-size:42px; font-weight:800; color:${theme.primary}; line-height:1.2; }

    /* Fashion chapter */
    .template-fashion .chapter-header-fashion { text-align:center; margin-bottom:70px; padding:50px; position:relative; }
    .template-fashion .chapter-header-fashion::before,.template-fashion .chapter-header-fashion::after { content:''; position:absolute; width:40px; height:40px; border:2px solid ${theme.secondary}; }
    .template-fashion .chapter-header-fashion::before { top:0; left:0; border-right:none; border-bottom:none; }
    .template-fashion .chapter-header-fashion::after { bottom:0; right:0; border-left:none; border-top:none; }
    .template-fashion .chapter-number { font-family:'Playfair Display',serif; font-size:72px; font-weight:700; color:${theme.secondary}; margin-bottom:20px; }
    .template-fashion .chapter-label { font-size:11px; letter-spacing:5px; color:${theme.secondary}; margin-bottom:20px; }
    .template-fashion .chapter-title { font-family:'Playfair Display',serif; font-size:44px; font-weight:700; color:${theme.primary}; line-height:1.3; }

    /* Corporate chapter */
    .template-corporate .chapter-header-corporate { display:flex; align-items:center; gap:25px; margin-bottom:60px; padding-bottom:30px; border-bottom:3px solid ${theme.secondary}; }
    .template-corporate .chapter-number { width:80px; height:100px; background:${theme.secondary}; color:white; display:flex; align-items:center; justify-content:center; font-size:40px; font-weight:900; flex-shrink:0; }
    .template-corporate .chapter-info { flex:1; }
    .template-corporate .chapter-label { font-size:12px; font-weight:900; letter-spacing:4px; color:${theme.secondary}; margin-bottom:12px; text-transform:uppercase; }
    .template-corporate .chapter-title { font-size:40px; font-weight:800; color:${theme.primary}; line-height:1.2; text-transform:uppercase; }

    /* Retro chapter */
    .template-retro .chapter-header-retro { text-align:center; margin-bottom:70px; padding:40px; border:2px solid ${theme.accent}; background:rgba(217,119,6,.03); }
    .template-retro .chapter-number { font-family:'Merriweather',serif; font-size:64px; font-weight:700; color:${theme.secondary}; margin-bottom:15px; }
    .template-retro .chapter-number::before { content:'— '; color:${theme.accent}; }
    .template-retro .chapter-number::after { content:' —'; color:${theme.accent}; }
    .template-retro .chapter-label { font-family:'Merriweather',serif; font-size:12px; letter-spacing:4px; color:${theme.secondary}; margin-bottom:20px; }
    .template-retro .chapter-title { font-family:'Merriweather',serif; font-size:38px; font-weight:700; color:${theme.primary}; line-height:1.4; }

    /* Futuriste chapter */
    .template-futuriste .chapter-header-futuriste { display:flex; align-items:center; gap:30px; margin-bottom:60px; padding:30px; background:rgba(167,139,250,.05); border-left:4px solid ${theme.secondary}; box-shadow:0 0 20px rgba(167,139,250,.1); }
    .template-futuriste .chapter-number { width:100px; height:70px; background:${theme.secondary}; color:white; display:flex; align-items:center; justify-content:center; font-size:32px; font-weight:900; clip-path:polygon(30% 0%,70% 0%,100% 50%,70% 100%,30% 100%,0% 50%); box-shadow:0 0 20px ${theme.secondary}; flex-shrink:0; }
    .template-futuriste .chapter-info { flex:1; }
    .template-futuriste .chapter-label { font-size:13px; font-weight:900; letter-spacing:4px; color:${theme.secondary}; margin-bottom:12px; }
    .template-futuriste .chapter-title { font-size:42px; font-weight:900; color:${theme.primary}; line-height:1.2; }

    /* Afrique chapter */
    .template-afrique .chapter-header-afrique { display:flex; align-items:center; gap:25px; margin-bottom:60px; padding:30px; background:linear-gradient(135deg,rgba(217,119,6,.1),transparent); border-left:8px solid ${theme.secondary}; border-radius:0 16px 16px 0; }
    .template-afrique .chapter-number { width:90px; height:90px; background:linear-gradient(135deg,${theme.secondary},${theme.accent}); color:white; display:flex; align-items:center; justify-content:center; font-size:40px; font-weight:900; border-radius:50%; flex-shrink:0; box-shadow:0 4px 20px rgba(217,119,6,.4); }
    .template-afrique .chapter-info { flex:1; }
    .template-afrique .chapter-label { font-size:13px; font-weight:900; letter-spacing:3px; color:${theme.secondary}; margin-bottom:10px; }
    .template-afrique .chapter-title { font-size:42px; font-weight:900; color:${theme.primary}; line-height:1.2; }

    /* Sport chapter */
    .template-sport .chapter-header-sport { display:flex; align-items:stretch; margin-bottom:60px; overflow:hidden; border-radius:8px; }
    .template-sport .chapter-number { min-width:100px; background:${theme.secondary}; color:white; display:flex; align-items:center; justify-content:center; font-size:52px; font-weight:900; padding:20px; }
    .template-sport .chapter-info { flex:1; padding:20px 30px; background:#f8fafc; border-top:4px solid ${theme.secondary}; }
    .template-sport .chapter-label { font-size:12px; font-weight:900; letter-spacing:4px; color:${theme.secondary}; margin-bottom:10px; text-transform:uppercase; }
    .template-sport .chapter-title { font-size:40px; font-weight:900; color:${theme.primary}; line-height:1.1; text-transform:uppercase; }

    /* Wellness chapter */
    .template-wellness .chapter-header-wellness { text-align:center; margin-bottom:70px; padding:50px 40px; background:linear-gradient(135deg,rgba(139,92,246,.05),rgba(192,132,252,.05)); border-radius:24px; }
    .template-wellness .chapter-number { font-size:48px; margin-bottom:20px; color:${theme.secondary}; }
    .template-wellness .chapter-number::before { content:'✿ '; }
    .template-wellness .chapter-label { font-size:13px; font-weight:700; letter-spacing:3px; color:${theme.secondary}; margin-bottom:15px; }
    .template-wellness .chapter-title { font-size:42px; font-weight:800; color:#2e1065; line-height:1.3; }

    /* Business chapter */
    .template-business .chapter-header-business { display:flex; align-items:flex-start; gap:30px; margin-bottom:60px; padding:40px; background:linear-gradient(135deg,#0f172a,#1e293b); border-radius:8px; }
    .template-business .chapter-number { font-size:80px; font-weight:900; color:${theme.secondary}; line-height:1; opacity:.8; min-width:100px; }
    .template-business .chapter-info { flex:1; padding-top:10px; }
    .template-business .chapter-label { font-size:12px; font-weight:900; letter-spacing:5px; color:${theme.secondary}; margin-bottom:15px; }
    .template-business .chapter-title { font-size:40px; font-weight:800; color:white; line-height:1.2; }

    /* ===== CONTENU — LE FIX PRINCIPAL ===== */
    .section-content {
      font-size: 18px !important;
      text-align: left !important;
      max-width: 720px;
    }
    .section-content,
    .section-content p,
    .section-content div,
    .section-content li {
      text-align: left !important;
      text-justify: none !important;
      word-spacing: normal !important;
      letter-spacing: normal !important;
      white-space: normal !important;
      hyphens: none !important;
    }
    .section-content p {
      display: block !important;
      margin-bottom: 1.4em !important;
      line-height: 1.8 !important;
      color: #334155;
    }

    strong { color: ${theme.primary}; font-weight: 700; }
    em { font-style: italic; }

    .section-content h2 {
      font-size: 26px !important;
      font-weight: 800 !important;
      color: ${theme.primary} !important;
      margin-top: 50px !important;
      margin-bottom: 20px !important;
      line-height: 1.3 !important;
      padding-left: 16px;
      border-left: 5px solid ${theme.secondary};
      page-break-after: avoid;
    }
    .section-content h3 {
      font-size: 21px !important;
      font-weight: 700 !important;
      color: ${theme.secondary} !important;
      margin-top: 35px !important;
      margin-bottom: 15px !important;
      page-break-after: avoid;
    }

    /* Listes */
    .section-content ul, .section-content ol { margin: 1.6em 0 1.6em 2em !important; line-height: 1.8 !important; text-align: left !important; }
    .section-content li { margin-bottom: 0.7em !important; text-align: left !important; padding-left: 0.3em; page-break-inside: avoid; }
    .section-content ul li::marker { color: ${theme.secondary}; font-size: 1.2em; }
    .section-content ol li::marker { color: ${theme.secondary}; font-weight: 700; }

    /* Tableaux */
    .section-content table { width: 100%; border-collapse: collapse; margin: 35px 0; font-size: 17px; box-shadow: 0 4px 10px rgba(0,0,0,.06); page-break-inside: auto; }
    .section-content tr { page-break-inside: avoid; }
    .section-content th { background: ${theme.primary}; color: white; padding: 15px; text-align: left; font-size: 16px; }
    .section-content td { border: 1px solid #e2e8f0; padding: 14px; font-size: 16px; }
    .section-content tr:nth-child(even) { background: #f8fafc; }

    /* ===== BLOCS SPÉCIAUX — texte pur, zéro boîte ===== */

    /* blockquote / quote : italique simple */
    .section-content blockquote, .section-content .quote {
      margin: 1.4em 0;
      padding: 0;
      border: none;
      background: none;
      font-style: italic;
      color: #475569;
      font-size: 18px;
      line-height: 1.8;
    }

    /* tip-box, conseil-box, warning-box : texte intégré, aucune boîte */
    .tip-box, .conseil-box, .warning-box {
      display: block;
      margin: 1em 0;
      padding: 0;
      border: none;
      background: none;
      font-size: 18px;
      color: #334155;
      line-height: 1.8;
      font-style: italic;
    }

    /* step-box : numérotation sobre, texte pur */
    .section-content { counter-reset: step-counter; }
    .step-box {
      display: block;
      margin: 1.2em 0;
      padding: 0;
      border: none;
      background: none;
      font-size: 18px;
      color: #1e293b;
      line-height: 1.8;
    }
    .step-box .step-title {
      display: inline;
      font-weight: 700;
      color: ${theme.primary};
      font-size: 18px;
    }
    .step-box .step-title::before {
      content: counter(step-counter) ". ";
      counter-increment: step-counter;
      font-weight: 800;
      color: ${theme.secondary};
    }

    /* Numéros de page */
    .page-number { position: absolute; bottom: -22mm; font-weight: 900; font-size: 14px; }
    .pn-modern    { right:20mm; width:36px; height:36px; line-height:36px; text-align:center; background:${theme.secondary}; color:white; border-radius:50%; }
    .pn-luxe      { left:50%; transform:translateX(-50%); font-family:'Playfair Display',serif; font-size:13px; color:${theme.secondary}; letter-spacing:8px; }
    .pn-tech      { right:20mm; font-family:'Courier New',monospace; font-size:13px; color:${theme.secondary}; padding:6px 12px; border:2px solid ${theme.secondary}; border-radius:4px; }
    .pn-energie   { right:20mm; padding:6px 16px; background:linear-gradient(135deg,${theme.secondary},${theme.accent}); color:white; border-radius:8px; }
    .pn-minimal   { right:20mm; font-size:11px; font-weight:300; color:${theme.secondary}; opacity:.5; }
    .pn-creative  { right:20mm; padding:6px 16px; background:${theme.secondary}; color:white; border-radius:20px; font-size:12px; }
    .pn-educatif  { right:20mm; width:34px; height:34px; line-height:34px; text-align:center; background:${theme.secondary}; color:white; border-radius:50%; font-size:13px; }
    .pn-nature    { right:20mm; font-size:13px; color:${theme.secondary}; }
    .pn-fashion   { left:50%; transform:translateX(-50%); font-family:'Playfair Display',serif; font-size:16px; color:${theme.secondary}; }
    .pn-corporate { right:20mm; padding:8px 18px; background:${theme.secondary}; color:white; font-size:12px; border-radius:4px; }
    .pn-retro     { left:50%; transform:translateX(-50%); font-family:'Merriweather',serif; font-size:12px; color:${theme.secondary}; letter-spacing:6px; }
    .pn-futuriste { right:20mm; padding:8px 18px; background:${theme.secondary}; color:white; font-size:13px; border-radius:6px; }
    .pn-afrique   { left:50%; transform:translateX(-50%); font-size:13px; color:${theme.secondary}; letter-spacing:5px; }
    .pn-sport     { right:20mm; padding:6px 16px; background:${theme.secondary}; color:white; font-size:13px; border-radius:4px; font-weight:900; }
    .pn-wellness  { left:50%; transform:translateX(-50%); font-size:13px; color:${theme.secondary}; letter-spacing:3px; }
    .pn-business  { right:20mm; padding:8px 18px; border:2px solid ${theme.secondary}; color:${theme.secondary}; font-size:12px; border-radius:4px; font-weight:700; }
  `;
}