// lib/pdf/expressHtmlGenerator.js
// Générateur HTML ULTRA-PREMIUM pour Bookzy Express
// 12 templates UNIQUES avec sommaires et mises en page personnalisés

// ============================================================================
// 1. CONFIGURATION DES 12 THÈMES PREMIUM
// ============================================================================
function getThemeConfig(templateKey) {
    const themes = {
        modern: { 
            primary: "#0f172a", 
            secondary: "#3b82f6", 
            accent: "#7c3aed",
            font: "Inter", 
            gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        },
        luxe: { 
            primary: "#1a1a1a", 
            secondary: "#d4af37", 
            accent: "#ffd700",
            font: "Playfair Display", 
            gradient: "linear-gradient(135deg, #1a1a1a 0%, #3d2817 100%)",
        },
        educatif: { 
            primary: "#065f46", 
            secondary: "#10b981", 
            accent: "#34d399",
            font: "Inter", 
            gradient: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
        },
        energie: { 
            primary: "#dc2626", 
            secondary: "#f97316", 
            accent: "#fbbf24",
            font: "Manrope", 
            gradient: "linear-gradient(135deg, #f97316 0%, #dc2626 100%)",
        },
        minimal: { 
            primary: "#1e293b", 
            secondary: "#64748b", 
            accent: "#94a3b8",
            font: "Inter", 
            gradient: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        },
        creative: { 
            primary: "#7c3aed", 
            secondary: "#ec4899", 
            accent: "#f59e0b",
            font: "Nunito", 
            gradient: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
        },
        tech: {
            primary: "#0a0e27",
            secondary: "#00d4ff",
            accent: "#4f46e5",
            font: "Inter",
            gradient: "linear-gradient(135deg, #0a0e27 0%, #1e3a8a 100%)",
        },
        nature: {
            primary: "#14532d",
            secondary: "#22c55e",
            accent: "#84cc16",
            font: "Inter",
            gradient: "linear-gradient(135deg, #166534 0%, #15803d 100%)",
        },
        fashion: {
            primary: "#831843",
            secondary: "#ec4899",
            accent: "#f0abfc",
            font: "Playfair Display",
            gradient: "linear-gradient(135deg, #9f1239 0%, #be185d 100%)",
        },
        corporate: {
            primary: "#1e3a8a",
            secondary: "#3b82f6",
            accent: "#60a5fa",
            font: "Inter",
            gradient: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
        },
        retro: {
            primary: "#78350f",
            secondary: "#d97706",
            accent: "#fbbf24",
            font: "Merriweather",
            gradient: "linear-gradient(135deg, #92400e 0%, #b45309 100%)",
        },
        futuriste: {
            primary: "#4c1d95",
            secondary: "#a78bfa",
            accent: "#c084fc",
            font: "Inter",
            gradient: "linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)",
        },
    };
    return themes[templateKey] || themes.modern;
}

// ============================================================================
// 2. FONCTION PRINCIPALE EXPRESS
// ============================================================================
export function generateExpressHTML(data, templateKey = "modern") {
  const { title, author, introduction, conclusion, chapters } = data;
  
  const theme = getThemeConfig(templateKey);

  // --- COUVERTURES (12 designs différents) ---
  let coverHTML = "";
  
  if (templateKey === "luxe") {
    coverHTML = `
    <div class="cover-page luxe-cover">
        <div class="luxe-texture"></div>
        <div class="luxe-frame-outer"></div>
        <div class="luxe-frame-inner"></div>
        <div class="luxe-ornament-top">◆ ◆ ◆</div>
        <div class="cover-content">
            <div class="luxe-badge">ÉDITION PREMIUM</div>
            <div class="luxe-divider"></div>
            <h1 class="cover-title luxe-title">${title}</h1>
            <div class="luxe-divider"></div>
            <div class="luxe-subtitle">Un guide complet et professionnel</div>
            <div class="cover-author luxe-author">
                <span class="author-label">Par</span>
                <span class="author-name">${author || 'Expert'}</span>
            </div>
        </div>
        <div class="luxe-ornament-bottom">◆ ◆ ◆</div>
    </div>`;
  } else if (templateKey === "creative") {
    coverHTML = `
    <div class="cover-page creative-cover">
        <div class="creative-blob blob-1"></div>
        <div class="creative-blob blob-2"></div>
        <div class="creative-blob blob-3"></div>
        <div class="creative-blob blob-4"></div>
        <div class="creative-pattern"></div>
        <div class="cover-content">
            <div class="creative-badge">✨ CRÉATIF</div>
            <h1 class="cover-title creative-title">${title}</h1>
            <div class="creative-wave">
                <svg viewBox="0 0 300 30" width="300" height="30">
                    <path d="M0,15 Q37.5,0 75,15 T150,15 T225,15 T300,15" 
                          stroke="white" stroke-width="4" fill="none" opacity="0.6"/>
                </svg>
            </div>
            <div class="cover-author creative-author">${author || 'Créateur'}</div>
        </div>
    </div>`;
  } else if (templateKey === "minimal") {
    coverHTML = `
    <div class="cover-page minimal-cover">
        <div class="minimal-grid"></div>
        <div class="cover-content">
            <div class="minimal-label">GUIDE</div>
            <h1 class="cover-title minimal-title">${title}</h1>
            <div class="minimal-line"></div>
            <div class="cover-author minimal-author">${author || 'Auteur'}</div>
            <div class="minimal-year">2026</div>
        </div>
    </div>`;
  } else if (templateKey === "energie") {
    coverHTML = `
    <div class="cover-page energie-cover">
        <div class="energie-rays"></div>
        <div class="energie-circles">
            <div class="circle c1"></div>
            <div class="circle c2"></div>
            <div class="circle c3"></div>
        </div>
        <div class="cover-content">
            <div class="energie-badge">⚡ BOOST</div>
            <h1 class="cover-title energie-title">${title}</h1>
            <div class="energie-lightning">
                <svg viewBox="0 0 50 100" width="50" height="100">
                    <polygon points="25,0 10,60 30,60 15,100 45,40 25,40" fill="white" opacity="0.9"/>
                </svg>
            </div>
            <div class="cover-author energie-author">${author || 'Expert'}</div>
        </div>
    </div>`;
  } else if (templateKey === "educatif") {
    coverHTML = `
    <div class="cover-page educatif-cover">
        <div class="educatif-grid"></div>
        <div class="educatif-icons">
            <div class="icon">📚</div>
            <div class="icon">🎓</div>
            <div class="icon">✓</div>
            <div class="icon">📊</div>
        </div>
        <div class="cover-content">
            <div class="educatif-badge">FORMATION</div>
            <h1 class="cover-title educatif-title">${title}</h1>
            <div class="educatif-subtitle">Guide complet et structuré</div>
            <div class="cover-author educatif-author">${author || 'Formateur'}</div>
        </div>
    </div>`;
  } else if (templateKey === "tech") {
    coverHTML = `
    <div class="cover-page tech-cover">
        <div class="tech-grid"></div>
        <div class="tech-circuits">
            <div class="circuit c1"></div>
            <div class="circuit c2"></div>
            <div class="circuit c3"></div>
        </div>
        <div class="cover-content">
            <div class="tech-badge">TECH</div>
            <h1 class="cover-title tech-title">${title}</h1>
            <div class="tech-line"></div>
            <div class="cover-author tech-author">${author || 'Tech Expert'}</div>
        </div>
        <div class="tech-footer">POWERED BY AI</div>
    </div>`;
  } else if (templateKey === "nature") {
    coverHTML = `
    <div class="cover-page nature-cover">
        <div class="nature-leaves">
            <div class="leaf l1">🍃</div>
            <div class="leaf l2">🌿</div>
            <div class="leaf l3">🍃</div>
            <div class="leaf l4">🌿</div>
        </div>
        <div class="nature-texture"></div>
        <div class="cover-content">
            <div class="nature-badge">🌱 NATURE</div>
            <h1 class="cover-title nature-title">${title}</h1>
            <div class="nature-subtitle">Guide éco-responsable</div>
            <div class="cover-author nature-author">${author || 'Expert Nature'}</div>
        </div>
    </div>`;
  } else if (templateKey === "fashion") {
    coverHTML = `
    <div class="cover-page fashion-cover">
        <div class="fashion-texture"></div>
        <div class="fashion-frame"></div>
        <div class="cover-content">
            <div class="fashion-badge">STYLE</div>
            <h1 class="cover-title fashion-title">${title}</h1>
            <div class="fashion-divider">✦ ✦ ✦</div>
            <div class="cover-author fashion-author">${author || 'Style Expert'}</div>
        </div>
        <div class="fashion-corner tl"></div>
        <div class="fashion-corner tr"></div>
        <div class="fashion-corner bl"></div>
        <div class="fashion-corner br"></div>
    </div>`;
  } else if (templateKey === "corporate") {
    coverHTML = `
    <div class="cover-page corporate-cover">
        <div class="corporate-grid"></div>
        <div class="corporate-bars">
            <div class="bar b1"></div>
            <div class="bar b2"></div>
            <div class="bar b3"></div>
        </div>
        <div class="cover-content">
            <div class="corporate-badge">BUSINESS</div>
            <h1 class="cover-title corporate-title">${title}</h1>
            <div class="corporate-subtitle">Professional Guide</div>
            <div class="cover-author corporate-author">${author || 'Business Expert'}</div>
        </div>
    </div>`;
  } else if (templateKey === "retro") {
    coverHTML = `
    <div class="cover-page retro-cover">
        <div class="retro-paper"></div>
        <div class="retro-stamp">VINTAGE</div>
        <div class="cover-content">
            <div class="retro-badge">ÉDITION CLASSIQUE</div>
            <h1 class="cover-title retro-title">${title}</h1>
            <div class="retro-ornament">❦ ❦ ❦</div>
            <div class="cover-author retro-author">${author || 'Auteur'}</div>
            <div class="retro-year">EST. 2026</div>
        </div>
    </div>`;
  } else if (templateKey === "futuriste") {
    coverHTML = `
    <div class="cover-page futuriste-cover">
        <div class="futuriste-grid"></div>
        <div class="futuriste-glow"></div>
        <div class="futuriste-particles">
            <div class="particle p1"></div>
            <div class="particle p2"></div>
            <div class="particle p3"></div>
            <div class="particle p4"></div>
        </div>
        <div class="cover-content">
            <div class="futuriste-badge">◢ FUTURE ◣</div>
            <h1 class="cover-title futuriste-title">${title}</h1>
            <div class="futuriste-hexagon"></div>
            <div class="cover-author futuriste-author">${author || 'Visionnaire'}</div>
        </div>
    </div>`;
  } else {
    coverHTML = `
    <div class="cover-page modern-cover">
        <div class="modern-grid-3d"></div>
        <div class="modern-gradient-overlay"></div>
        <div class="modern-shapes">
            <div class="shape s1"></div>
            <div class="shape s2"></div>
            <div class="shape s3"></div>
        </div>
        <div class="cover-content">
            <div class="modern-badge">PREMIUM</div>
            <h1 class="cover-title modern-title">${title}</h1>
            <div class="modern-subtitle">Guide professionnel</div>
            <div class="cover-author modern-author">${author || 'Expert'}</div>
        </div>
        <div class="modern-footer">BOOKZY EXPRESS</div>
    </div>`;
  }

  // --- SOMMAIRES PERSONNALISÉS ---
  let tocItems = [];
  let tocCounter = 1;
  
  if (introduction && introduction.trim()) {
    tocItems.push({ num: tocCounter++, text: "Introduction" });
  }
  
  chapters.forEach((ch) => {
    tocItems.push({ num: tocCounter++, text: ch.title });
  });
  
  if (conclusion && conclusion.trim()) {
    tocItems.push({ num: tocCounter++, text: "Conclusion" });
  }
  
  let tocHTML = generateTOC(tocItems, templateKey, theme);

  // --- CONTENU AVEC NUMÉROTATION ---
  let bodyHTML = "";
  let pageNum = 3;
  
  if (introduction && introduction.trim()) {
    bodyHTML += generateChapterHTMLWithPage("00", "INTRODUCTION", "Introduction", introduction, templateKey, pageNum);
    pageNum++;
  }
  
  chapters.forEach((ch, idx) => {
    bodyHTML += generateChapterHTMLWithPage(
      String(idx + 1).padStart(2, '0'),
      `CHAPITRE ${idx + 1}`,
      ch.title,
      ch.content,
      templateKey,
      pageNum
    );
    pageNum++;
  });
  
  if (conclusion && conclusion.trim()) {
    bodyHTML += generateChapterHTMLWithPage("∞", "CONCLUSION", "Conclusion", conclusion, templateKey, pageNum);
  }

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>${generatePremiumCSS(theme, templateKey)}</style>
    </head>
    <body>
        ${coverHTML + tocHTML + bodyHTML}
    </body>
    </html>
  `;
}// ============================================================================
// 3. GÉNÉRATEURS DE SOMMAIRES
// ============================================================================
function generateTOC(items, templateKey, theme) {
  if (templateKey === "luxe") {
    const romans = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
    return `
      <div class="toc-page toc-luxe">
          <h1 class="toc-title">Table des Matières</h1>
          <div class="toc-ornament">◆</div>
          <div class="toc-list">
              ${items.map((item, idx) => `
                  <div class="toc-item">
                      <span class="toc-num-roman">${romans[idx] || idx + 1}</span>
                      <span class="toc-dots"></span>
                      <span class="toc-text">${item.text}</span>
                  </div>
              `).join('')}
          </div>
      </div>`;
  }
  
  if (templateKey === "modern") {
    return `
      <div class="toc-page toc-modern">
          <h1 class="toc-title">Sommaire</h1>
          <div class="toc-list">
              ${items.map(item => `
                  <div class="toc-item">
                      <span class="toc-num-big">${String(item.num).padStart(2, '0')}</span>
                      <div class="toc-content">
                          <span class="toc-text">${item.text}</span>
                          <span class="toc-line-diagonal"></span>
                      </div>
                  </div>
              `).join('')}
          </div>
      </div>`;
  }
  
  if (templateKey === "educatif") {
    return `
      <div class="toc-page toc-educatif">
          <h1 class="toc-title">📚 Programme</h1>
          <div class="toc-list">
              ${items.map(item => `
                  <div class="toc-item">
                      <span class="toc-circle">${String(item.num).padStart(2, '0')}</span>
                      <span class="toc-check">✓</span>
                      <span class="toc-text">${item.text}</span>
                  </div>
              `).join('')}
          </div>
      </div>`;
  }
  
  if (templateKey === "energie") {
    return `
      <div class="toc-page toc-energie">
          <h1 class="toc-title">⚡ ROADMAP</h1>
          <div class="toc-list">
              ${items.map(item => `
                  <div class="toc-item">
                      <span class="toc-diamond">${String(item.num).padStart(2, '0')}</span>
                      <span class="toc-arrow">→</span>
                      <span class="toc-text">${item.text}</span>
                  </div>
              `).join('')}
          </div>
      </div>`;
  }
  
  if (templateKey === "minimal") {
    return `
      <div class="toc-page toc-minimal">
          <h1 class="toc-title">Index</h1>
          <div class="toc-list">
              ${items.map(item => `
                  <div class="toc-item">
                      <span class="toc-dot">•</span>
                      <span class="toc-text">${item.text}</span>
                      <span class="toc-num-small">${String(item.num).padStart(2, '0')}</span>
                  </div>
              `).join('')}
          </div>
      </div>`;
  }
  
  if (templateKey === "creative") {
    return `
      <div class="toc-page toc-creative">
          <h1 class="toc-title">✨ Au Menu</h1>
          <div class="toc-list">
              ${items.map(item => `
                  <div class="toc-item">
                      <span class="toc-badge">${String(item.num).padStart(2, '0')}</span>
                      <span class="toc-text">${item.text}</span>
                  </div>
              `).join('')}
          </div>
      </div>`;
  }
  
  if (templateKey === "tech") {
    return `
      <div class="toc-page toc-tech">
          <h1 class="toc-title">&lt; INDEX /&gt;</h1>
          <div class="toc-list">
              ${items.map(item => `
                  <div class="toc-item">
                      <span class="toc-binary">${item.num.toString(2).padStart(4, '0')}</span>
                      <span class="toc-bracket">[</span>
                      <span class="toc-text">${item.text}</span>
                      <span class="toc-bracket">]</span>
                  </div>
              `).join('')}
          </div>
      </div>`;
  }
  
  if (templateKey === "nature") {
    return `
      <div class="toc-page toc-nature">
          <h1 class="toc-title">🌿 Parcours</h1>
          <div class="toc-list">
              ${items.map(item => `
                  <div class="toc-item">
                      <span class="toc-leaf">🍃</span>
                      <span class="toc-text">${item.text}</span>
                      <span class="toc-num-nature">${String(item.num).padStart(2, '0')}</span>
                  </div>
              `).join('')}
          </div>
      </div>`;
  }
  
  if (templateKey === "fashion") {
    return `
      <div class="toc-page toc-fashion">
          <h1 class="toc-title">Sommaire</h1>
          <div class="toc-divider">✦</div>
          <div class="toc-list">
              ${items.map(item => `
                  <div class="toc-item">
                      <span class="toc-num-serif">${String(item.num).padStart(2, '0')}</span>
                      <span class="toc-text">${item.text}</span>
                  </div>
              `).join('')}
          </div>
      </div>`;
  }
  
  if (templateKey === "corporate") {
    return `
      <div class="toc-page toc-corporate">
          <h1 class="toc-title">TABLE OF CONTENTS</h1>
          <div class="toc-list">
              ${items.map(item => `
                  <div class="toc-item">
                      <span class="toc-bar"></span>
                      <span class="toc-num-corp">${String(item.num).padStart(2, '0')}</span>
                      <span class="toc-text">${item.text}</span>
                  </div>
              `).join('')}
          </div>
      </div>`;
  }
  
  if (templateKey === "retro") {
    return `
      <div class="toc-page toc-retro">
          <h1 class="toc-title">Table des Matières</h1>
          <div class="toc-ornament-retro">❦ ❦ ❦</div>
          <div class="toc-list">
              ${items.map(item => `
                  <div class="toc-item">
                      <span class="toc-num-retro">${item.num}.</span>
                      <span class="toc-dots-retro">.....</span>
                      <span class="toc-text">${item.text}</span>
                  </div>
              `).join('')}
          </div>
      </div>`;
  }
  
  return `
    <div class="toc-page toc-futuriste">
        <h1 class="toc-title">◢ NAVIGATION ◣</h1>
        <div class="toc-list">
            ${items.map(item => `
                <div class="toc-item">
                    <span class="toc-hex">${String(item.num).padStart(2, '0')}</span>
                    <span class="toc-line-neon"></span>
                    <span class="toc-text">${item.text}</span>
                </div>
            `).join('')}
        </div>
    </div>`;
}

// ============================================================================
// 4. GÉNÉRATEUR DE CHAPITRES AVEC NUMÉRO DE PAGE
// ============================================================================
function generateChapterHTMLWithPage(num, label, title, content, templateKey, pageNum) {
  const className = `template-${templateKey}`;
  
  // Générer le HTML du pied de page selon le template
  let footerHTML = '';
  
  switch(templateKey) {
    case 'modern':
      footerHTML = `<div class="page-number modern-page">${pageNum}</div>`;
      break;
    case 'luxe':
      footerHTML = `<div class="page-number luxe-page">◆ ${pageNum} ◆</div>`;
      break;
    case 'tech':
      footerHTML = `<div class="page-number tech-page">0x${pageNum.toString(16).toUpperCase()}</div>`;
      break;
    case 'energie':
      footerHTML = `<div class="page-number energie-page">${pageNum}</div>`;
      break;
    case 'minimal':
      footerHTML = `<div class="page-number minimal-page">${pageNum}</div>`;
      break;
    case 'creative':
      footerHTML = `<div class="page-number creative-page">${pageNum}</div>`;
      break;
    case 'educatif':
      footerHTML = `<div class="page-number educatif-page">${pageNum}</div>`;
      break;
    case 'nature':
      footerHTML = `<div class="page-number nature-page">🌿 ${pageNum}</div>`;
      break;
    case 'fashion':
      footerHTML = `<div class="page-number fashion-page">${pageNum}</div>`;
      break;
    case 'corporate':
      footerHTML = `<div class="page-number corporate-page">${pageNum}</div>`;
      break;
    case 'retro':
      footerHTML = `<div class="page-number retro-page">— ${pageNum} —</div>`;
      break;
    case 'futuriste':
      footerHTML = `<div class="page-number futuriste-page">${pageNum}</div>`;
      break;
    default:
      footerHTML = `<div class="page-number modern-page">${pageNum}</div>`;
  }
  
  return `
    <div class="content-page start-chapter ${className}">
        <div class="chapter-header-${templateKey}">
            <div class="chapter-number">${num}</div>
            <div class="chapter-info">
                <div class="chapter-label">${label}</div>
                <h1 class="chapter-title">${title}</h1>
            </div>
        </div>
        <div class="section-content">${content}</div>
        ${footerHTML}
    </div>
  `;
}// ============================================================================
// 5. CSS ULTRA-PREMIUM
// ============================================================================
function generatePremiumCSS(theme, templateKey) {
  return `
    /* IMPORT POLICES PREMIUM */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&family=Manrope:wght@300;400;500;600;700;800&family=Nunito:wght@300;400;600;700;800;900&family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap');

    /* RESET & BASE */
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
        font-family: '${theme.font}', "Noto Color Emoji", sans-serif;
        color: #1e293b; 
        font-size: 18px; 
        line-height: 1.8; 
        background: white;
    }

    @page { 
        size: A4; 
        margin: 20mm 15mm 30mm 20mm;
    }
    @page :first { margin: 0; }
    
    .start-chapter { 
        page-break-before: always; 
        margin-top: 0; 
        padding-top: 0; 
    }

    /* ========================================================================
       COUVERTURES (12 DESIGNS)
       ======================================================================== */
    
    .cover-page {
        width: 100%; 
        min-height: 100vh;
        display: flex; 
        align-items: center; 
        justify-content: center;
        text-align: center; 
        padding: 0; 
        page-break-after: always;
        position: relative; 
        overflow: hidden;
    }

    /* MODERNE */
    .modern-cover { background: ${theme.gradient}; color: white; position: relative; }
    .modern-grid-3d { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.1) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.1) 2px, transparent 2px); background-size: 80px 80px; transform: perspective(500px) rotateX(60deg); transform-origin: center; }
    .modern-gradient-overlay { position: absolute; inset: 0; background: radial-gradient(circle at 30% 40%, rgba(255,255,255,0.15), transparent 60%); }
    .modern-shapes { position: absolute; inset: 0; overflow: hidden; }
    .modern-shapes .shape { position: absolute; border-radius: 50%; opacity: 0.1; }
    .modern-shapes .s1 { width: 400px; height: 400px; background: white; top: -200px; right: -100px; }
    .modern-shapes .s2 { width: 300px; height: 300px; background: ${theme.accent}; bottom: -150px; left: -100px; }
    .modern-shapes .s3 { width: 200px; height: 200px; background: white; top: 50%; left: 10%; }
    .modern-badge { display: inline-block; background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); border: 2px solid rgba(255,255,255,0.3); padding: 12px 40px; border-radius: 50px; font-weight: 800; font-size: 13px; letter-spacing: 4px; margin-bottom: 40px; }
    .modern-title { font-size: 64px; font-weight: 900; line-height: 1.1; margin: 0 60px 30px 60px; text-transform: uppercase; letter-spacing: -2px; text-shadow: 0 8px 32px rgba(0,0,0,0.3); }
    .modern-subtitle { font-size: 20px; font-weight: 500; opacity: 0.9; letter-spacing: 2px; margin-bottom: 50px; }
    .modern-author { font-size: 18px; font-weight: 700; letter-spacing: 3px; padding: 18px 50px; border: 2px solid white; border-radius: 12px; display: inline-block; background: rgba(0,0,0,0.2); }
    .modern-footer { position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); font-size: 11px; letter-spacing: 4px; opacity: 0.6; font-weight: 700; }

    /* LUXE */
    .luxe-cover { background: ${theme.gradient}; color: ${theme.accent}; position: relative; }
    .luxe-texture { position: absolute; inset: 0; background-image: repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(212,175,55,0.03) 2px, rgba(212,175,55,0.03) 4px); }
    .luxe-frame-outer { position: absolute; inset: 30px; border: 3px double ${theme.secondary}; pointer-events: none; }
    .luxe-frame-inner { position: absolute; inset: 45px; border: 1px solid ${theme.secondary}; pointer-events: none; }
    .luxe-ornament-top, .luxe-ornament-bottom { position: absolute; left: 50%; transform: translateX(-50%); font-size: 24px; color: ${theme.secondary}; letter-spacing: 20px; }
    .luxe-ornament-top { top: 50px; }
    .luxe-ornament-bottom { bottom: 50px; }
    .luxe-badge { display: inline-block; background: linear-gradient(135deg, ${theme.secondary}, ${theme.accent}); color: #1a1a1a; padding: 12px 40px; border-radius: 4px; font-weight: 900; font-size: 12px; letter-spacing: 5px; margin-bottom: 30px; box-shadow: 0 8px 24px rgba(212,175,55,0.3); }
    .luxe-divider { width: 150px; height: 2px; background: linear-gradient(90deg, transparent, ${theme.secondary}, transparent); margin: 25px auto; }
    .luxe-title { font-family: 'Playfair Display', serif; font-size: 56px; font-weight: 900; line-height: 1.2; margin: 0 80px; letter-spacing: 1px; }
    .luxe-subtitle { font-family: 'Merriweather', serif; font-size: 16px; font-style: italic; opacity: 0.8; margin: 30px 0 50px 0; }
    .luxe-author { display: flex; flex-direction: column; gap: 8px; }
    .luxe-author .author-label { font-size: 11px; letter-spacing: 3px; opacity: 0.7; }
    .luxe-author .author-name { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; }

    /* ÉDUCATIF */
    .educatif-cover { background: ${theme.gradient}; color: white; position: relative; }
    .educatif-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px); background-size: 60px 60px; }
    .educatif-icons { position: absolute; inset: 0; display: flex; justify-content: space-around; align-items: center; padding: 0 60px; opacity: 0.15; }
    .educatif-icons .icon { font-size: 120px; }
    .educatif-badge { display: inline-block; background: rgba(255,255,255,0.2); border: 2px solid rgba(255,255,255,0.4); padding: 14px 45px; border-radius: 8px; font-weight: 900; font-size: 13px; letter-spacing: 4px; margin-bottom: 40px; }
    .educatif-title { font-size: 58px; font-weight: 800; line-height: 1.15; margin: 0 70px 20px 70px; text-transform: uppercase; }
    .educatif-subtitle { font-size: 18px; font-weight: 500; opacity: 0.85; margin-bottom: 50px; }
    .educatif-author { font-size: 17px; font-weight: 700; letter-spacing: 3px; padding: 16px 50px; border: 2px solid white; border-radius: 10px; display: inline-block; }

    /* ÉNERGIE */
    .energie-cover { background: ${theme.gradient}; color: white; position: relative; }
    .energie-rays { position: absolute; inset: 0; background: repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(255,255,255,0.08) 30px, rgba(255,255,255,0.08) 60px); }
    .energie-circles { position: absolute; inset: 0; }
    .energie-circles .circle { position: absolute; border: 3px solid rgba(255,255,255,0.2); border-radius: 50%; }
    .energie-circles .c1 { width: 500px; height: 500px; top: -250px; right: -100px; }
    .energie-circles .c2 { width: 350px; height: 350px; bottom: -150px; left: -100px; }
    .energie-circles .c3 { width: 200px; height: 200px; top: 40%; left: 20%; }
    .energie-badge { display: inline-block; background: rgba(255,255,255,0.25); border: 3px solid rgba(255,255,255,0.5); padding: 14px 45px; border-radius: 12px; font-weight: 900; font-size: 14px; letter-spacing: 5px; margin-bottom: 40px; }
    .energie-title { font-size: 66px; font-weight: 900; line-height: 1.1; margin: 0 60px 40px 60px; text-transform: uppercase; letter-spacing: -3px; text-shadow: 0 6px 24px rgba(0,0,0,0.4); }
    .energie-lightning { margin: 40px 0; }
    .energie-author { font-size: 19px; font-weight: 900; letter-spacing: 4px; padding: 18px 55px; background: rgba(0,0,0,0.35); border-radius: 8px; display: inline-block; }

    /* MINIMAL */
    .minimal-cover { background: white; color: ${theme.primary}; position: relative; }
    .minimal-grid { position: absolute; inset: 40px; border: 1px solid #e2e8f0; }
    .minimal-label { font-size: 12px; font-weight: 800; letter-spacing: 6px; margin-bottom: 60px; opacity: 0.5; }
    .minimal-title { font-size: 72px; font-weight: 300; line-height: 0.95; letter-spacing: -4px; margin: 0 80px 50px 80px; }
    .minimal-line { width: 100px; height: 3px; background: ${theme.primary}; margin: 0 auto 60px auto; }
    .minimal-author { font-size: 15px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: ${theme.secondary}; margin-bottom: 20px; }
    .minimal-year { font-size: 13px; font-weight: 500; opacity: 0.4; letter-spacing: 2px; }

    /* CRÉATIF */
    .creative-cover { background: ${theme.gradient}; color: white; position: relative; }
    .creative-blob { position: absolute; border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; opacity: 0.2; }
    .creative-blob.blob-1 { width: 500px; height: 500px; background: ${theme.accent}; top: -150px; right: -150px; }
    .creative-blob.blob-2 { width: 350px; height: 350px; background: white; bottom: -100px; left: -100px; border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%; }
    .creative-blob.blob-3 { width: 250px; height: 250px; background: ${theme.secondary}; top: 45%; left: 15%; opacity: 0.15; }
    .creative-blob.blob-4 { width: 180px; height: 180px; background: white; bottom: 30%; right: 20%; opacity: 0.1; }
    .creative-pattern { position: absolute; inset: 0; background-image: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 30px 30px; }
    .creative-badge { display: inline-block; background: rgba(255,255,255,0.25); backdrop-filter: blur(15px); border: 2px solid rgba(255,255,255,0.4); padding: 13px 40px; border-radius: 50px; font-weight: 800; font-size: 13px; letter-spacing: 3px; margin-bottom: 40px; }
    .creative-title { font-size: 62px; font-weight: 900; line-height: 1.15; margin: 0 70px 40px 70px; background: linear-gradient(135deg, white, ${theme.accent}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .creative-wave { margin: 40px auto; opacity: 0.7; }
    .creative-author { font-size: 18px; font-weight: 700; letter-spacing: 4px; padding: 16px 50px; background: rgba(255,255,255,0.15); border: 2px solid rgba(255,255,255,0.3); border-radius: 50px; display: inline-block; }

    /* TECH */
    .tech-cover { background: ${theme.gradient}; color: white; position: relative; }
    .tech-grid { position: absolute; inset: 0; background-image: linear-gradient(${theme.secondary} 1px, transparent 1px), linear-gradient(90deg, ${theme.secondary} 1px, transparent 1px); background-size: 50px 50px; opacity: 0.1; }
    .tech-badge { display: inline-block; background: rgba(0, 212, 255, 0.2); border: 2px solid ${theme.secondary}; padding: 12px 40px; border-radius: 4px; font-weight: 900; font-size: 13px; letter-spacing: 5px; margin-bottom: 40px; box-shadow: 0 0 20px rgba(0, 212, 255, 0.3); }
    .tech-title { font-size: 62px; font-weight: 900; line-height: 1.1; margin: 0 70px 30px 70px; text-transform: uppercase; letter-spacing: -2px; color: ${theme.secondary}; text-shadow: 0 0 30px rgba(0, 212, 255, 0.5); }
    .tech-line { width: 200px; height: 3px; background: linear-gradient(90deg, transparent, ${theme.secondary}, transparent); margin: 30px auto 40px auto; }
    .tech-author { font-size: 17px; font-weight: 700; letter-spacing: 3px; padding: 16px 50px; background: rgba(0, 212, 255, 0.15); border: 2px solid ${theme.secondary}; border-radius: 8px; display: inline-block; }
    .tech-footer { position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); font-size: 10px; letter-spacing: 4px; opacity: 0.5; color: ${theme.secondary}; }
    .tech-circuits { position: absolute; inset: 0; }
    .tech-circuits .circuit { position: absolute; border: 2px solid ${theme.secondary}; opacity: 0.3; }
    .tech-circuits .c1 { width: 300px; height: 200px; top: 100px; left: 50px; border-radius: 20px; }
    .tech-circuits .c2 { width: 200px; height: 150px; bottom: 100px; right: 80px; border-radius: 15px; }
    .tech-circuits .c3 { width: 100px; height: 100px; top: 50%; left: 70%; border-radius: 50%; }

    /* NATURE */
    .nature-cover { background: ${theme.gradient}; color: white; position: relative; }
    .nature-leaves { position: absolute; inset: 0; }
    .nature-leaves .leaf { position: absolute; font-size: 80px; opacity: 0.15; }
    .nature-leaves .l1 { top: 50px; left: 80px; transform: rotate(-20deg); }
    .nature-leaves .l2 { top: 200px; right: 100px; transform: rotate(30deg); }
    .nature-leaves .l3 { bottom: 100px; left: 120px; transform: rotate(15deg); }
    .nature-leaves .l4 { bottom: 200px; right: 150px; transform: rotate(-35deg); }
    .nature-texture { position: absolute; inset: 0; background-image: repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,255,255,0.02) 3px, rgba(255,255,255,0.02) 6px); }
    .nature-badge { display: inline-block; background: rgba(255,255,255,0.2); border: 2px solid rgba(255,255,255,0.4); padding: 14px 45px; border-radius: 50px; font-weight: 800; font-size: 13px; letter-spacing: 3px; margin-bottom: 40px; }
    .nature-title { font-size: 60px; font-weight: 800; line-height: 1.15; margin: 0 70px 20px 70px; }
    .nature-subtitle { font-size: 18px; font-weight: 500; opacity: 0.9; margin-bottom: 50px; }
    .nature-author { font-size: 17px; font-weight: 700; letter-spacing: 3px; padding: 16px 50px; background: rgba(255,255,255,0.15); border: 2px solid rgba(255,255,255,0.3); border-radius: 12px; display: inline-block; }

    /* FASHION */
    .fashion-cover { background: ${theme.gradient}; color: white; position: relative; }
    .fashion-texture { position: absolute; inset: 0; background-image: linear-gradient(45deg, rgba(255,255,255,0.02) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.02) 25%, transparent 25%); background-size: 60px 60px; }
    .fashion-frame { position: absolute; inset: 50px; border: 1px solid rgba(255,255,255,0.3); }
    .fashion-badge { display: inline-block; background: transparent; border: 2px solid white; padding: 12px 40px; border-radius: 4px; font-weight: 700; font-size: 12px; letter-spacing: 6px; margin-bottom: 40px; }
    .fashion-title { font-family: 'Playfair Display', serif; font-size: 64px; font-weight: 700; line-height: 1.1; margin: 0 70px 30px 70px; letter-spacing: 2px; }
    .fashion-divider { font-size: 20px; letter-spacing: 15px; margin: 40px 0; opacity: 0.7; }
    .fashion-author { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 500; letter-spacing: 2px; font-style: italic; }
    .fashion-corner { position: absolute; width: 40px; height: 40px; border: 2px solid rgba(255,255,255,0.4); }
    .fashion-corner.tl { top: 25px; left: 25px; border-right: none; border-bottom: none; }
    .fashion-corner.tr { top: 25px; right: 25px; border-left: none; border-bottom: none; }
    .fashion-corner.bl { bottom: 25px; left: 25px; border-right: none; border-top: none; }
    .fashion-corner.br { bottom: 25px; right: 25px; border-left: none; border-top: none; }

    /* CORPORATE */
    .corporate-cover { background: ${theme.gradient}; color: white; position: relative; }
    .corporate-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 40px 40px; }
    .corporate-bars { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); display: flex; gap: 20px; opacity: 0.2; }
    .corporate-bars .bar { width: 60px; background: white; }
    .corporate-bars .b1 { height: 150px; }
    .corporate-bars .b2 { height: 250px; }
    .corporate-bars .b3 { height: 200px; }
    .corporate-badge { display: inline-block; background: rgba(255,255,255,0.15); border: 2px solid rgba(255,255,255,0.4); padding: 14px 50px; border-radius: 8px; font-weight: 900; font-size: 12px; letter-spacing: 5px; margin-bottom: 40px; }
    .corporate-title { font-size: 56px; font-weight: 800; line-height: 1.2; margin: 0 80px 20px 80px; text-transform: uppercase; letter-spacing: -1px; }
    .corporate-subtitle { font-size: 18px; font-weight: 500; opacity: 0.85; letter-spacing: 3px; margin-bottom: 50px; }
    .corporate-author { font-size: 16px; font-weight: 700; letter-spacing: 3px; padding: 16px 50px; border: 2px solid white; border-radius: 8px; display: inline-block; }

    /* RÉTRO */
    .retro-cover { background: ${theme.gradient}; color: #f5e6d3; position: relative; }
    .retro-paper { position: absolute; inset: 0; background-image: repeating-linear-gradient(0deg, rgba(0,0,0,0.02), rgba(0,0,0,0.02) 1px, transparent 1px, transparent 2px); opacity: 0.5; }
    .retro-stamp { position: absolute; top: 40px; right: 40px; padding: 8px 20px; border: 3px dashed ${theme.accent}; border-radius: 4px; font-size: 11px; font-weight: 900; letter-spacing: 2px; transform: rotate(8deg); opacity: 0.7; }
    .retro-badge { display: inline-block; background: transparent; border: 2px solid ${theme.accent}; padding: 10px 35px; border-radius: 4px; font-family: 'Merriweather', serif; font-size: 12px; letter-spacing: 4px; margin-bottom: 40px; }
    .retro-title { font-family: 'Merriweather', serif; font-size: 58px; font-weight: 700; line-height: 1.2; margin: 0 70px 30px 70px; }
    .retro-ornament { font-size: 24px; letter-spacing: 20px; margin: 40px 0; opacity: 0.6; }
    .retro-author { font-family: 'Merriweather', serif; font-size: 20px; font-weight: 400; font-style: italic; margin-bottom: 15px; }
    .retro-year { font-size: 11px; font-weight: 700; letter-spacing: 3px; opacity: 0.6; }

    /* FUTURISTE */
    .futuriste-cover { background: ${theme.gradient}; color: white; position: relative; }
    .futuriste-grid { position: absolute; inset: 0; background-image: linear-gradient(${theme.secondary} 1px, transparent 1px), linear-gradient(90deg, ${theme.secondary} 1px, transparent 1px); background-size: 100px 100px; opacity: 0.1; }
    .futuriste-glow { position: absolute; inset: 0; background: radial-gradient(circle at 50% 50%, ${theme.accent}, transparent 70%); opacity: 0.3; }
    .futuriste-particles { position: absolute; inset: 0; }
    .futuriste-particles .particle { position: absolute; width: 3px; height: 3px; background: ${theme.secondary}; border-radius: 50%; box-shadow: 0 0 10px ${theme.secondary}; }
    .futuriste-particles .p1 { top: 20%; left: 15%; }
    .futuriste-particles .p2 { top: 60%; right: 20%; }
    .futuriste-particles .p3 { bottom: 25%; left: 25%; }
    .futuriste-particles .p4 { top: 40%; right: 35%; }
    .futuriste-badge { display: inline-block; background: rgba(167, 139, 250, 0.2); border: 2px solid ${theme.secondary}; padding: 12px 40px; border-radius: 4px; font-weight: 900; font-size: 13px; letter-spacing: 5px; margin-bottom: 40px; box-shadow: 0 0 20px rgba(167, 139, 250, 0.4); }
    .futuriste-title { font-size: 64px; font-weight: 900; line-height: 1.1; margin: 0 70px 40px 70px; text-transform: uppercase; letter-spacing: -2px; color: ${theme.secondary}; text-shadow: 0 0 30px ${theme.secondary}; }
    .futuriste-hexagon { width: 100px; height: 60px; background: transparent; border: 3px solid ${theme.secondary}; margin: 40px auto; position: relative; clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%); box-shadow: 0 0 20px ${theme.secondary}; }
    .futuriste-author { font-size: 18px; font-weight: 700; letter-spacing: 4px; padding: 16px 50px; background: rgba(167, 139, 250, 0.15); border: 2px solid ${theme.secondary}; border-radius: 8px; display: inline-block; box-shadow: 0 0 15px rgba(167, 139, 250, 0.3); }

    /* SOMMAIRES - JE CONTINUE MAIS ATTENTION LE CSS EST TRÈS LONG */
    .toc-page { page-break-after: always; padding: 60px 40px; }
    .toc-luxe .toc-title { font-family: 'Playfair Display', serif; font-size: 52px; font-weight: 900; color: ${theme.primary}; text-align: center; margin-bottom: 20px; }
    .toc-luxe .toc-ornament { text-align: center; font-size: 28px; color: ${theme.secondary}; margin-bottom: 50px; }
    .toc-luxe .toc-list { max-width: 650px; margin: 0 auto; }
    .toc-luxe .toc-item { display: flex; align-items: baseline; gap: 20px; margin-bottom: 20px; padding: 15px 0; border-bottom: 1px solid ${theme.secondary}; }
    .toc-luxe .toc-num-roman { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 700; color: ${theme.secondary}; min-width: 50px; }
    .toc-luxe .toc-dots { flex: 1; height: 1px; background: repeating-linear-gradient(90deg, ${theme.secondary} 0px, ${theme.secondary} 4px, transparent 4px, transparent 8px); margin: 0 15px; }
    .toc-luxe .toc-text { font-family: 'Merriweather', serif; font-size: 18px; font-style: italic; color: ${theme.primary}; }
    .toc-modern .toc-title { font-size: 56px; font-weight: 900; color: ${theme.primary}; text-transform: uppercase; margin-bottom: 60px; }
    .toc-modern .toc-list { max-width: 700px; margin: 0 auto; }
    .toc-modern .toc-item { display: flex; align-items: center; gap: 30px; margin-bottom: 30px; }
    .toc-modern .toc-num-big { font-size: 72px; font-weight: 900; color: ${theme.secondary}; opacity: 0.3; min-width: 100px; }
    .toc-modern .toc-content { flex: 1; }
    .toc-modern .toc-text { font-size: 20px; font-weight: 700; color: ${theme.primary}; display: block; margin-bottom: 10px; }
    .toc-modern .toc-line-diagonal { display: block; width: 100%; height: 4px; background: linear-gradient(90deg, ${theme.secondary}, transparent); transform: skewY(-2deg); }
    .toc-educatif .toc-title { font-size: 48px; font-weight: 800; color: ${theme.primary}; text-align: center; margin-bottom: 50px; }
    .toc-educatif .toc-list { max-width: 650px; margin: 0 auto; }
    .toc-educatif .toc-item { display: flex; align-items: center; gap: 20px; margin-bottom: 25px; padding: 15px; background: #f8fafc; border-radius: 12px; }
    .toc-educatif .toc-circle { width: 50px; height: 50px; border-radius: 50%; background: ${theme.secondary}; color: white; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 900; flex-shrink: 0; }
    .toc-educatif .toc-check { font-size: 24px; color: ${theme.accent}; }
    .toc-educatif .toc-text { font-size: 18px; font-weight: 600; color: ${theme.primary}; flex: 1; }
    .toc-energie .toc-title { font-size: 52px; font-weight: 900; color: ${theme.primary}; text-transform: uppercase; text-align: center; margin-bottom: 50px; }
    .toc-energie .toc-list { max-width: 650px; margin: 0 auto; }
    .toc-energie .toc-item { display: flex; align-items: center; gap: 20px; margin-bottom: 25px; }
    .toc-energie .toc-diamond { width: 60px; height: 60px; background: ${theme.secondary}; color: white; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 900; transform: rotate(45deg); flex-shrink: 0; }
    .toc-energie .toc-arrow { font-size: 32px; color: ${theme.accent}; font-weight: 900; }
    .toc-energie .toc-text { font-size: 19px; font-weight: 700; color: ${theme.primary}; flex: 1; }
    .toc-minimal .toc-title { font-size: 48px; font-weight: 300; color: ${theme.primary}; letter-spacing: -2px; margin-bottom: 60px; }
    .toc-minimal .toc-list { max-width: 600px; margin: 0 auto; }
    .toc-minimal .toc-item { display: flex; align-items: baseline; gap: 15px; margin-bottom: 20px; padding: 12px 0; }
    .toc-minimal .toc-dot { font-size: 28px; color: ${theme.secondary}; }
    .toc-minimal .toc-text { font-size: 18px; font-weight: 400; color: ${theme.primary}; flex: 1; }
    .toc-minimal .toc-num-small { font-size: 14px; font-weight: 600; color: ${theme.secondary}; }
    .toc-creative .toc-title { font-size: 50px; font-weight: 900; color: ${theme.primary}; text-align: center; margin-bottom: 50px; }
    .toc-creative .toc-list { max-width: 650px; margin: 0 auto; }
    .toc-creative .toc-item { display: flex; align-items: center; gap: 20px; margin-bottom: 20px; }
    .toc-creative .toc-badge { background: ${theme.secondary}; color: white; padding: 10px 20px; border-radius: 20px; font-size: 16px; font-weight: 800; }
    .toc-creative .toc-text { font-size: 19px; font-weight: 700; color: ${theme.primary}; flex: 1; }
    .toc-tech .toc-title { font-family: 'Courier New', monospace; font-size: 44px; font-weight: 900; color: ${theme.secondary}; text-align: center; margin-bottom: 50px; text-shadow: 0 0 20px ${theme.secondary}; }
    .toc-tech .toc-list { max-width: 650px; margin: 0 auto; }
    .toc-tech .toc-item { display: flex; align-items: center; gap: 15px; margin-bottom: 20px; padding: 12px 20px; background: rgba(0, 212, 255, 0.05); border-left: 3px solid ${theme.secondary}; }
    .toc-tech .toc-binary { font-family: 'Courier New', monospace; font-size: 16px; color: ${theme.secondary}; min-width: 60px; }
    .toc-tech .toc-bracket { font-family: 'Courier New', monospace; color: ${theme.accent}; font-size: 20px; }
    .toc-tech .toc-text { font-size: 18px; font-weight: 600; color: ${theme.primary}; flex: 1; }
    .toc-nature .toc-title { font-size: 50px; font-weight: 800; color: ${theme.primary}; text-align: center; margin-bottom: 50px; }
    .toc-nature .toc-list { max-width: 650px; margin: 0 auto; }
    .toc-nature .toc-item { display: flex; align-items: center; gap: 20px; margin-bottom: 20px; padding: 15px; background: rgba(34, 197, 94, 0.05); border-radius: 12px; }
    .toc-nature .toc-leaf { font-size: 32px; }
    .toc-nature .toc-text { font-size: 18px; font-weight: 600; color: ${theme.primary}; flex: 1; }
    .toc-nature .toc-num-nature { font-size: 18px; font-weight: 800; color: ${theme.secondary}; }
    .toc-fashion .toc-title { font-family: 'Playfair Display', serif; font-size: 54px; font-weight: 700; color: ${theme.primary}; text-align: center; margin-bottom: 20px; }
    .toc-fashion .toc-divider { text-align: center; font-size: 24px; color: ${theme.secondary}; margin-bottom: 50px; }
    .toc-fashion .toc-list { max-width: 650px; margin: 0 auto; }
    .toc-fashion .toc-item { display: flex; align-items: baseline; gap: 25px; margin-bottom: 25px; padding: 12px 0; border-bottom: 1px solid #f0abfc; }
    .toc-fashion .toc-num-serif { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; color: ${theme.secondary}; min-width: 50px; }
    .toc-fashion .toc-text { font-family: 'Playfair Display', serif; font-size: 19px; font-weight: 500; color: ${theme.primary}; flex: 1; }
    .toc-corporate .toc-title { font-size: 50px; font-weight: 800; color: ${theme.primary}; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 50px; }
    .toc-corporate .toc-list { max-width: 650px; margin: 0 auto; }
    .toc-corporate .toc-item { display: flex; align-items: center; gap: 20px; margin-bottom: 20px; }
    .toc-corporate .toc-bar { width: 6px; height: 40px; background: ${theme.secondary}; }
    .toc-corporate .toc-num-corp { font-size: 24px; font-weight: 900; color: ${theme.secondary}; min-width: 50px; }
    .toc-corporate .toc-text { font-size: 18px; font-weight: 600; color: ${theme.primary}; flex: 1; }
    .toc-retro .toc-title { font-family: 'Merriweather', serif; font-size: 48px; font-weight: 700; color: ${theme.primary}; text-align: center; margin-bottom: 20px; }
    .toc-retro .toc-ornament-retro { text-align: center; font-size: 24px; color: ${theme.secondary}; letter-spacing: 20px; margin-bottom: 50px; }
    .toc-retro .toc-list { max-width: 650px; margin: 0 auto; }
    .toc-retro .toc-item { display: flex; align-items: baseline; gap: 10px; margin-bottom: 18px; font-family: 'Merriweather', serif; }
    .toc-retro .toc-num-retro { font-size: 18px; font-weight: 700; color: ${theme.secondary}; min-width: 40px; }
    .toc-retro .toc-dots-retro { flex: 1; border-bottom: 2px dotted ${theme.accent}; margin: 0 10px 3px 10px; }
    .toc-retro .toc-text { font-size: 17px; font-weight: 400; color: ${theme.primary}; }
    .toc-futuriste .toc-title { font-size: 48px; font-weight: 900; color: ${theme.secondary}; text-align: center; margin-bottom: 50px; text-shadow: 0 0 20px ${theme.secondary}; }
    .toc-futuriste .toc-list { max-width: 650px; margin: 0 auto; }
    .toc-futuriste .toc-item { display: flex; align-items: center; gap: 20px; margin-bottom: 25px; }
    .toc-futuriste .toc-hex { width: 60px; height: 40px; background: ${theme.secondary}; color: white; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 900; clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%); box-shadow: 0 0 15px ${theme.secondary}; }
    .toc-futuriste .toc-line-neon { flex: 1; height: 2px; background: linear-gradient(90deg, ${theme.secondary}, transparent); box-shadow: 0 0 10px ${theme.secondary}; }
    .toc-futuriste .toc-text { font-size: 18px; font-weight: 700; color: ${theme.primary}; }/* ========================================================================
       CHAPITRES - 12 HEADERS PERSONNALISÉS
       ======================================================================== */

    .content-page { position: relative; padding-top: 0; }

    /* BARRE LATÉRALE COLORÉE */
    .content-page::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        background: ${theme.secondary};
        opacity: 0.2;
    }

    /* MODERNE */
    .template-modern .chapter-header-modern {
        display: flex;
        align-items: flex-start;
        gap: 30px;
        margin-bottom: 60px;
        padding-bottom: 40px;
        border-bottom: 4px solid ${theme.secondary};
    }
    .template-modern .chapter-number {
        font-size: 140px;
        font-weight: 900;
        color: ${theme.secondary};
        line-height: 0.8;
        opacity: 0.2;
        min-width: 150px;
    }
    .template-modern .chapter-info { flex: 1; padding-top: 30px; }
    .template-modern .chapter-label {
        font-size: 13px;
        font-weight: 800;
        letter-spacing: 4px;
        color: ${theme.secondary};
        margin-bottom: 15px;
    }
    .template-modern .chapter-title {
        font-size: 48px;
        font-weight: 900;
        color: ${theme.primary};
        line-height: 1.2;
        text-transform: uppercase;
    }

    /* LUXE */
    .template-luxe .chapter-header-luxe {
        text-align: center;
        margin-bottom: 70px;
        padding: 50px;
        border: 3px double ${theme.secondary};
        position: relative;
    }
    .template-luxe .chapter-number {
        font-family: 'Playfair Display', serif;
        font-size: 80px;
        font-weight: 900;
        color: ${theme.secondary};
        margin-bottom: 20px;
    }
    .template-luxe .chapter-label {
        font-size: 12px;
        letter-spacing: 5px;
        color: ${theme.secondary};
        margin-bottom: 25px;
    }
    .template-luxe .chapter-title {
        font-family: 'Playfair Display', serif;
        font-size: 42px;
        font-weight: 900;
        color: ${theme.primary};
        line-height: 1.3;
    }
    .template-luxe .chapter-header-luxe::before,
    .template-luxe .chapter-header-luxe::after {
        content: '◆';
        position: absolute;
        font-size: 24px;
        color: ${theme.secondary};
    }
    .template-luxe .chapter-header-luxe::before { top: 15px; left: 50%; transform: translateX(-50%); }
    .template-luxe .chapter-header-luxe::after { bottom: 15px; left: 50%; transform: translateX(-50%); }

    /* ÉDUCATIF */
    .template-educatif .chapter-header-educatif {
        display: flex;
        align-items: center;
        gap: 30px;
        margin-bottom: 60px;
        padding: 30px;
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), transparent);
        border-left: 6px solid ${theme.secondary};
    }
    .template-educatif .chapter-number {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: ${theme.secondary};
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 48px;
        font-weight: 900;
        flex-shrink: 0;
        box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
    }
    .template-educatif .chapter-info { flex: 1; }
    .template-educatif .chapter-label {
        font-size: 13px;
        font-weight: 800;
        letter-spacing: 3px;
        color: ${theme.secondary};
        margin-bottom: 10px;
    }
    .template-educatif .chapter-label::before { content: '✓ '; color: ${theme.accent}; }
    .template-educatif .chapter-title {
        font-size: 40px;
        font-weight: 800;
        color: ${theme.primary};
        line-height: 1.2;
    }

    /* ÉNERGIE */
    .template-energie .chapter-header-energie {
        display: flex;
        align-items: center;
        gap: 30px;
        margin-bottom: 60px;
    }
    .template-energie .chapter-number {
        width: 120px;
        height: 120px;
        background: linear-gradient(135deg, ${theme.secondary}, ${theme.accent});
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 52px;
        font-weight: 900;
        transform: rotate(45deg);
        flex-shrink: 0;
    }
    .template-energie .chapter-info { flex: 1; }
    .template-energie .chapter-label {
        font-size: 14px;
        font-weight: 900;
        letter-spacing: 4px;
        color: ${theme.secondary};
        margin-bottom: 12px;
    }
    .template-energie .chapter-label::after { content: ' →'; color: ${theme.accent}; font-size: 24px; }
    .template-energie .chapter-title {
        font-size: 46px;
        font-weight: 900;
        color: ${theme.primary};
        line-height: 1.1;
        text-transform: uppercase;
    }

    /* MINIMAL */
    .template-minimal .chapter-header-minimal {
        margin-bottom: 80px;
        padding-bottom: 30px;
        border-bottom: 1px solid ${theme.secondary};
    }
    .template-minimal .chapter-number {
        font-size: 20px;
        font-weight: 600;
        color: ${theme.secondary};
        margin-bottom: 20px;
        letter-spacing: 2px;
    }
    .template-minimal .chapter-label {
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 4px;
        color: ${theme.secondary};
        opacity: 0.6;
        margin-bottom: 15px;
    }
    .template-minimal .chapter-title {
        font-size: 56px;
        font-weight: 300;
        color: ${theme.primary};
        line-height: 1.1;
        letter-spacing: -2px;
    }

    /* CRÉATIF */
    .template-creative .chapter-header-creative {
        text-align: center;
        margin-bottom: 60px;
        padding: 40px;
        background: linear-gradient(135deg, rgba(168, 85, 247, 0.05), rgba(236, 72, 153, 0.05));
        border-radius: 20px;
    }
    .template-creative .chapter-number {
        display: inline-block;
        background: ${theme.secondary};
        color: white;
        padding: 15px 35px;
        border-radius: 30px;
        font-size: 32px;
        font-weight: 900;
        margin-bottom: 20px;
    }
    .template-creative .chapter-label {
        font-size: 13px;
        font-weight: 800;
        letter-spacing: 3px;
        color: ${theme.secondary};
        margin-bottom: 15px;
    }
    .template-creative .chapter-title {
        font-size: 44px;
        font-weight: 900;
        background: linear-gradient(135deg, ${theme.primary}, ${theme.secondary});
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        line-height: 1.3;
    }

    /* TECH */
    .template-tech .chapter-header-tech {
        margin-bottom: 60px;
        padding: 30px;
        background: rgba(0, 212, 255, 0.05);
        border-left: 4px solid ${theme.secondary};
        font-family: 'Courier New', monospace;
    }
    .template-tech .chapter-number {
        font-size: 24px;
        color: ${theme.secondary};
        margin-bottom: 15px;
        text-shadow: 0 0 10px ${theme.secondary};
    }
    .template-tech .chapter-number::before { content: '0x'; }
    .template-tech .chapter-label {
        font-size: 12px;
        letter-spacing: 2px;
        color: ${theme.accent};
        margin-bottom: 15px;
    }
    .template-tech .chapter-label::before { content: '< '; }
    .template-tech .chapter-label::after { content: ' />'; }
    .template-tech .chapter-title {
        font-family: 'Inter', sans-serif;
        font-size: 42px;
        font-weight: 900;
        color: ${theme.primary};
        line-height: 1.2;
    }

    /* NATURE */
    .template-nature .chapter-header-nature {
        display: flex;
        align-items: center;
        gap: 25px;
        margin-bottom: 60px;
        padding: 30px;
        background: rgba(34, 197, 94, 0.05);
        border-radius: 16px;
    }
    .template-nature .chapter-number { font-size: 80px; margin-right: 10px; }
    .template-nature .chapter-number::before { content: '🌿'; }
    .template-nature .chapter-info { flex: 1; }
    .template-nature .chapter-label {
        font-size: 13px;
        font-weight: 800;
        letter-spacing: 3px;
        color: ${theme.secondary};
        margin-bottom: 12px;
    }
    .template-nature .chapter-title {
        font-size: 42px;
        font-weight: 800;
        color: ${theme.primary};
        line-height: 1.2;
    }

    /* FASHION */
    .template-fashion .chapter-header-fashion {
        text-align: center;
        margin-bottom: 70px;
        padding: 50px;
        position: relative;
    }
    .template-fashion .chapter-header-fashion::before,
    .template-fashion .chapter-header-fashion::after {
        content: '';
        position: absolute;
        width: 40px;
        height: 40px;
        border: 2px solid ${theme.secondary};
    }
    .template-fashion .chapter-header-fashion::before { top: 0; left: 0; border-right: none; border-bottom: none; }
    .template-fashion .chapter-header-fashion::after { bottom: 0; right: 0; border-left: none; border-top: none; }
    .template-fashion .chapter-number {
        font-family: 'Playfair Display', serif;
        font-size: 72px;
        font-weight: 700;
        color: ${theme.secondary};
        margin-bottom: 20px;
    }
    .template-fashion .chapter-label {
        font-size: 11px;
        letter-spacing: 5px;
        color: ${theme.secondary};
        margin-bottom: 20px;
    }
    .template-fashion .chapter-title {
        font-family: 'Playfair Display', serif;
        font-size: 46px;
        font-weight: 700;
        color: ${theme.primary};
        line-height: 1.3;
    }

    /* CORPORATE */
    .template-corporate .chapter-header-corporate {
        display: flex;
        align-items: center;
        gap: 25px;
        margin-bottom: 60px;
        padding-bottom: 30px;
        border-bottom: 3px solid ${theme.secondary};
    }
    .template-corporate .chapter-number {
        width: 80px;
        height: 100px;
        background: ${theme.secondary};
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40px;
        font-weight: 900;
        flex-shrink: 0;
    }
    .template-corporate .chapter-info { flex: 1; }
    .template-corporate .chapter-label {
        font-size: 12px;
        font-weight: 900;
        letter-spacing: 4px;
        color: ${theme.secondary};
        margin-bottom: 12px;
        text-transform: uppercase;
    }
    .template-corporate .chapter-title {
        font-size: 42px;
        font-weight: 800;
        color: ${theme.primary};
        line-height: 1.2;
        text-transform: uppercase;
    }

    /* RÉTRO */
    .template-retro .chapter-header-retro {
        text-align: center;
        margin-bottom: 70px;
        padding: 40px;
        border: 2px solid ${theme.accent};
        background: rgba(217, 119, 6, 0.03);
    }
    .template-retro .chapter-number {
        font-family: 'Merriweather', serif;
        font-size: 64px;
        font-weight: 700;
        color: ${theme.secondary};
        margin-bottom: 15px;
    }
    .template-retro .chapter-number::before { content: '— '; color: ${theme.accent}; }
    .template-retro .chapter-number::after { content: ' —'; color: ${theme.accent}; }
    .template-retro .chapter-label {
        font-family: 'Merriweather', serif;
        font-size: 12px;
        letter-spacing: 4px;
        color: ${theme.secondary};
        margin-bottom: 20px;
    }
    .template-retro .chapter-title {
        font-family: 'Merriweather', serif;
        font-size: 40px;
        font-weight: 700;
        color: ${theme.primary};
        line-height: 1.4;
    }

    /* FUTURISTE */
    .template-futuriste .chapter-header-futuriste {
        display: flex;
        align-items: center;
        gap: 30px;
        margin-bottom: 60px;
        padding: 30px;
        background: rgba(167, 139, 250, 0.05);
        border-left: 4px solid ${theme.secondary};
        box-shadow: 0 0 20px rgba(167, 139, 250, 0.1);
    }
    .template-futuriste .chapter-number {
        width: 100px;
        height: 70px;
        background: ${theme.secondary};
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        font-weight: 900;
        clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%);
        box-shadow: 0 0 20px ${theme.secondary};
        flex-shrink: 0;
    }
    .template-futuriste .chapter-info { flex: 1; }
    .template-futuriste .chapter-label {
        font-size: 13px;
        font-weight: 900;
        letter-spacing: 4px;
        color: ${theme.secondary};
        margin-bottom: 12px;
        text-shadow: 0 0 10px ${theme.secondary};
    }
    .template-futuriste .chapter-title {
        font-size: 44px;
        font-weight: 900;
        color: ${theme.primary};
        line-height: 1.2;
        text-transform: uppercase;
    }

    /* ========================================================================
       CONTENU - STYLES TEXTE
       ======================================================================== */

    .section-content {
        font-size: 18px !important;
        text-align: left !important;
        max-width: 680px;
        margin: 0 0 0 40px;
        position: relative;
    }

    .section-content, .section-content p, .section-content div, .section-content li {
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

    /* Lettrine subtile */
    .template-modern .section-content p:first-of-type::first-letter,
    .template-energie .section-content p:first-of-type::first-letter,
    .template-tech .section-content p:first-of-type::first-letter {
        font-size: 2.5em;
        font-weight: 900;
        color: ${theme.secondary};
        float: left;
        line-height: 1;
        margin: 0 0.08em 0 0;
    }

    .template-luxe .section-content p:first-of-type::first-letter,
    .template-fashion .section-content p:first-of-type::first-letter {
        font-family: 'Playfair Display', serif;
        font-size: 4.5em;
        font-weight: 900;
        color: ${theme.secondary};
        float: left;
        line-height: 0.8;
        margin: 0.05em 0.15em 0 0;
    }

    .template-minimal .section-content p:first-of-type::first-letter {
        font-size: 3em;
        font-weight: 300;
        color: ${theme.secondary};
        float: left;
        line-height: 0.9;
        margin: 0.1em 0.1em 0 0;
    }

    strong {
        color: ${theme.primary};
        font-weight: 700;
    }

    .section-content blockquote {
        margin: 2em 0 !important;
        padding: 1.5em 2em !important;
        border-left: 5px solid ${theme.secondary} !important;
        background: #f8fafc !important;
        font-style: italic !important;
        color: ${theme.primary} !important;
    }

    .section-content ul, .section-content ol {
        margin: 1.8em 0 1.8em 2.5em !important;
        line-height: 1.8 !important;
        text-align: left !important;
    }

    .section-content li {
        margin-bottom: 1em !important;
        text-align: left !important;
        padding-left: 0.5em;
    }

    .section-content ul li::marker {
        color: ${theme.secondary};
        font-size: 1.2em;
    }

    .section-content ol li::marker {
        color: ${theme.secondary};
        font-weight: 700;
    }

    .section-content img {
        max-width: 100%;
        height: auto;
        display: block;
        margin: 2em auto;
        border-radius: 8px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    }

    /* ========================================================================
       🔥 PIEDS DE PAGE AVEC NUMÉROS (HTML DIRECT)
       ======================================================================== */

    .page-number {
        position: absolute;
        bottom: -22mm;
        font-weight: 900;
        font-size: 14px;
    }

    /* MODERNE - Cercle */
    .modern-page {
        right: 20mm;
        width: 36px;
        height: 36px;
        line-height: 36px;
        text-align: center;
        background: #3b82f6;
        color: white;
        border-radius: 50%;
    }

    /* LUXE - Ornements */
    .luxe-page {
        left: 50%;
        transform: translateX(-50%);
        font-family: 'Playfair Display', serif;
        font-size: 13px;
        color: #d4af37;
        letter-spacing: 8px;
    }

    /* TECH - Hexadécimal */
    .tech-page {
        right: 20mm;
        font-family: 'Courier New', monospace;
        font-size: 13px;
        color: #00d4ff;
        padding: 6px 12px;
        border: 2px solid #00d4ff;
        border-radius: 4px;
    }

    /* ÉNERGIE */
    .energie-page {
        right: 20mm;
        padding: 6px 16px;
        background: linear-gradient(135deg, #f97316, #fbbf24);
        color: white;
        border-radius: 8px;
    }

    /* MINIMAL */
    .minimal-page {
        right: 20mm;
        font-size: 11px;
        font-weight: 300;
        color: #64748b;
        opacity: 0.4;
    }

    /* CRÉATIF */
    .creative-page {
        right: 20mm;
        padding: 6px 16px;
        background: #ec4899;
        color: white;
        border-radius: 20px;
        font-size: 12px;
    }

    /* ÉDUCATIF */
    .educatif-page {
        right: 20mm;
        width: 34px;
        height: 34px;
        line-height: 34px;
        text-align: center;
        background: #10b981;
        color: white;
        border-radius: 50%;
        font-size: 13px;
    }

    /* NATURE */
    .nature-page {
        right: 20mm;
        font-size: 13px;
        color: #22c55e;
    }

    /* FASHION */
    .fashion-page {
        left: 50%;
        transform: translateX(-50%);
        font-family: 'Playfair Display', serif;
        font-size: 16px;
        color: #ec4899;
    }

    /* CORPORATE */
    .corporate-page {
        right: 20mm;
        padding: 8px 18px;
        background: #3b82f6;
        color: white;
        font-size: 12px;
        border-radius: 4px;
    }

    /* RÉTRO */
    .retro-page {
        left: 50%;
        transform: translateX(-50%);
        font-family: 'Merriweather', serif;
        font-size: 12px;
        color: #d97706;
        letter-spacing: 6px;
    }

    /* FUTURISTE */
    .futuriste-page {
        right: 20mm;
        padding: 8px 18px;
        background: #a78bfa;
        color: white;
        font-size: 13px;
        border-radius: 6px;
    }
  `;
}