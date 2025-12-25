// lib/pdf/htmlGenerator.js
// 🎯 VERSION 10/10 ULTRA-PREMIUM
// - Design unique par thème (pas juste couleurs)
// - Couvertures personnalisées avec ornements
// - Sommaires stylisés différemment
// - Effets visuels modernes
// - Support emoji complet

import fs from "fs";
import path from "path";

// ============================================================================
// 1. CONFIGURATION DES THÈMES (Extended)
// ============================================================================
function getThemeConfig(templateKey) {
    const themes = {
        modern: { 
            primary: "#0f172a", 
            secondary: "#3b82f6", 
            accent: "#8b5cf6",
            font: "Inter", 
            uppercase: true,
            coverStyle: "gradient-grid",
            tocStyle: "modern-lines"
        },
        luxe: { 
            primary: "#1a1a1a", 
            secondary: "#B8860B", 
            accent: "#D4AF37",
            font: "Poppins", 
            uppercase: false,
            coverStyle: "ornamental",
            tocStyle: "roman-numbers"
        },
        educatif: { 
            primary: "#0A6847", 
            secondary: "#127C56", 
            accent: "#10b981",
            font: "Inter", 
            uppercase: true,
            coverStyle: "academic",
            tocStyle: "numbered-circles"
        },
        energie: { 
            primary: "#FF6B35", 
            secondary: "#F7931E", 
            accent: "#ef4444",
            font: "Manrope", 
            uppercase: true,
            coverStyle: "dynamic",
            tocStyle: "bold-arrows"
        },
        minimal: { 
            primary: "#2c3e50", 
            secondary: "#7f8c8d", 
            accent: "#95a5a6",
            font: "Inter", 
            uppercase: false,
            coverStyle: "clean-border",
            tocStyle: "simple-dots"
        },
        creative: { 
            primary: "#8B5CF6", 
            secondary: "#EC4899", 
            accent: "#f59e0b",
            font: "Nunito", 
            uppercase: true,
            coverStyle: "abstract-shapes",
            tocStyle: "colorful-badges"
        },
    };
    return themes[templateKey] || themes.modern;
}

// ============================================================================
// 2. FONCTION PRINCIPALE
// ============================================================================
export function generateStyledHTML(data, templateKey = "modern") {
  const { title, author, subtitle, intro, conclusion, chaptersData } = data;
  
  const theme = getThemeConfig(templateKey);
  
  const safeSubtitle = subtitle && subtitle.length > 250 
      ? subtitle.substring(0, 250).trim() + "..." 
      : (subtitle || "");

  // ✅ FONCTION POUR NETTOYER LE CONTENU DES CHAPITRES
  // Supprime UNIQUEMENT le h2 qui correspond EXACTEMENT au titre du chapitre
  function cleanChapterContent(content, chapterTitle) {
    if (!content || !chapterTitle) return content;
    
    // Nettoyer le titre pour la comparaison (enlever espaces, ponctuation en trop)
    const cleanTitle = chapterTitle.trim().replace(/\s+/g, '\\s+');
    
    // Regex STRICTE : Cherche un h2 qui contient UNIQUEMENT le titre du chapitre
    // Pas de texte avant ou après (sauf espaces)
    const h2Pattern = `<h2[^>]*>\\s*${escapeRegex(cleanTitle)}\\s*</h2>`;
    const regex = new RegExp(h2Pattern, 'i');
    
    // Test si le h2 existe
    if (regex.test(content)) {
      // Supprimer UNIQUEMENT ce h2 spécifique
      return content.replace(regex, '');
    }
    
    // Si pas trouvé, retourner le contenu original (ne rien supprimer)
    return content;
  }
  
  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // --- COUVERTURES PERSONNALISÉES PAR THÈME ---
  
  const coverHTML = templateKey === "luxe" ? `
    <div class="cover-page luxe-cover">
        <div class="luxe-frame"></div>
        <div class="luxe-ornament-top"></div>
        <div class="cover-content">
            <div class="luxe-crest">◆</div>
            <div class="badge luxe-badge">ÉDITION PREMIUM</div>
            <h1 class="cover-title luxe-title">${title}</h1>
            ${safeSubtitle ? `<p class="cover-subtitle luxe-subtitle">${safeSubtitle}</p>` : ''}
            <div class="luxe-separator">
                <span>◆</span><span>◆</span><span>◆</span>
            </div>
            <div class="cover-author luxe-author">
                <div class="luxe-author-label">AUTEUR</div>
                <div class="luxe-author-name">${author ? author.toUpperCase() : 'EXPERT'}</div>
            </div>
        </div>
        <div class="luxe-ornament-bottom"></div>
    </div>`
  : templateKey === "creative" ? `
    <div class="cover-page creative-cover">
        <div class="creative-blob blob-1"></div>
        <div class="creative-blob blob-2"></div>
        <div class="creative-blob blob-3"></div>
        <div class="cover-content">
            <div class="badge creative-badge">✨ CRÉATIF</div>
            <h1 class="cover-title creative-title">${title}</h1>
            ${safeSubtitle ? `<p class="cover-subtitle">${safeSubtitle}</p>` : ''}
            <div class="creative-waves">
                <svg viewBox="0 0 200 20" width="200" height="20">
                    <path d="M0,10 Q25,0 50,10 T100,10 T150,10 T200,10" stroke="${theme.secondary}" stroke-width="3" fill="none"/>
                </svg>
            </div>
            <div class="cover-author creative-author">PAR ${author ? author.toUpperCase() : 'CRÉATEUR'}</div>
        </div>
    </div>`
  : templateKey === "minimal" ? `
    <div class="cover-page minimal-cover">
        <div class="minimal-border"></div>
        <div class="cover-content">
            <h1 class="cover-title minimal-title">${title}</h1>
            ${safeSubtitle ? `<p class="cover-subtitle minimal-subtitle">${safeSubtitle}</p>` : ''}
            <div class="minimal-line"></div>
            <div class="cover-author minimal-author">${author || 'Auteur'}</div>
        </div>
    </div>`
  : templateKey === "energie" ? `
    <div class="cover-page energie-cover">
        <div class="energie-rays"></div>
        <div class="cover-content">
            <div class="badge energie-badge">⚡ BOOST</div>
            <h1 class="cover-title energie-title">${title}</h1>
            ${safeSubtitle ? `<p class="cover-subtitle">${safeSubtitle}</p>` : ''}
            <div class="energie-lightning">
                <div class="lightning-bolt"></div>
            </div>
            <div class="cover-author energie-author">PAR ${author ? author.toUpperCase() : 'EXPERT'}</div>
        </div>
    </div>`
  : templateKey === "educatif" ? `
    <div class="cover-page educatif-cover">
        <div class="educatif-grid"></div>
        <div class="cover-content">
            <div class="badge educatif-badge">📚 FORMATION</div>
            <h1 class="cover-title educatif-title">${title}</h1>
            ${safeSubtitle ? `<p class="cover-subtitle">${safeSubtitle}</p>` : ''}
            <div class="educatif-check">✓</div>
            <div class="cover-author educatif-author">PAR ${author ? author.toUpperCase() : 'FORMATEUR'}</div>
        </div>
    </div>`
  : `
    <div class="cover-page modern-cover">
        <div class="modern-grid"></div>
        <div class="cover-content">
            <div class="badge">GUIDE PREMIUM</div>
            <h1 class="cover-title">${title}</h1>
            ${safeSubtitle ? `<p class="cover-subtitle">${safeSubtitle}</p>` : ''}
            <div class="cover-separator"></div>
            <div class="cover-author">PAR ${author ? author.toUpperCase() : 'AUTEUR'}</div>
        </div>
    </div>`;

  // --- SOMMAIRES PERSONNALISÉS ---
  
  let tocHTML = templateKey === "luxe" ? `
    <div class="toc-page luxe-toc">
        <h1 class="toc-title">Table des Matières</h1>
        <div class="luxe-toc-ornament">◆</div>
        <div class="toc-list">
            <div class="toc-item luxe-toc-item"><span class="toc-num">I.</span><span class="toc-text">Introduction</span></div>
            ${chaptersData.map((ch, idx) => {
                const roman = ['II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][idx] || `${idx + 2}`;
                return `<div class="toc-item luxe-toc-item"><span class="toc-num">${roman}.</span><span class="toc-text">${ch.title}</span></div>`;
            }).join('')}
            <div class="toc-item luxe-toc-item"><span class="toc-num">${['XIII', 'XII', 'XI', 'X'][chaptersData.length] || 'XII'}.</span><span class="toc-text">Conclusion</span></div>
        </div>
    </div>`
  : `
    <div class="toc-page">
        <h1 class="toc-title">Sommaire</h1>
        <div class="toc-list">
            <div class="toc-item"><span class="toc-num">1.</span><span class="toc-text">Introduction</span></div>
            ${chaptersData.map((ch, idx) => `
                <div class="toc-item"><span class="toc-num">${idx + 2}.</span><span class="toc-text">${ch.title}</span></div>
            `).join('')}
            <div class="toc-item"><span class="toc-num">${chaptersData.length + 2}.</span><span class="toc-text">Conclusion</span></div>
        </div>
    </div>`;

  // --- CHAPITRES ---
  
  let bodyHTML = `
    <div class="content-page start-chapter">
        <h1 class="section-title">Introduction</h1>
        <div class="section-content intro-text">${intro}</div>
    </div>
    ${chaptersData.map((ch, idx) => {
      // ✅ Nettoyer le contenu pour supprimer le h2 dupliqué
      const cleanedContent = cleanChapterContent(ch.content, ch.title);
      
      return `
        <div class="content-page start-chapter">
            <div class="chapter-header">
                <div class="chapter-badge">CHAPITRE ${idx + 1}</div>
                <h1 class="chapter-title">${ch.title}</h1>
            </div>
            <div class="section-content chapter-content">${cleanedContent}</div>
        </div>
      `;
    }).join('')}
    <div class="content-page start-chapter">
        <h1 class="section-title">Conclusion</h1>
        <div class="section-content conclusion-text">${conclusion}</div>
    </div>`;

  /* ==========================================================================
     3. CSS ULTRA-PREMIUM AVEC STYLES PAR THÈME
     ========================================================================== */
  const finalCSS = `
    /* IMPORT POLICES + EMOJI */
    @import url('https://fonts.googleapis.com/css2?family=${theme.font.replace(' ', '+')}:wght@300;400;500;600;700;800;900&family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&family=Playfair+Display:wght@400;700;900&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
        font-family: '${theme.font}', "Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji", sans-serif;
        color: #1e293b; 
        font-size: 21px; 
        line-height: 1.8; 
        background: white;
    }

    @page { size: A4; margin: 25mm 20mm; }
    @page :first { margin: 0; }
    .start-chapter { page-break-before: always; margin-top: 0; padding-top: 20px; }

    /* ========== COUVERTURES PAR THÈME ========== */
    
    .cover-page {
        width: 100%; min-height: 100vh;
        display: flex; align-items: center; justify-content: center;
        text-align: center; padding: 40px; page-break-after: always;
        position: relative; overflow: hidden;
    }
    
    /* LUXE */
    .luxe-cover {
        background: linear-gradient(135deg, #1a1a1a 0%, #2d2013 100%);
        color: #D4AF37;
    }
    .luxe-frame {
        position: absolute; inset: 20px;
        border: 3px double #B8860B;
        pointer-events: none;
    }
    .luxe-ornament-top, .luxe-ornament-bottom {
        position: absolute; left: 50%; transform: translateX(-50%);
        width: 200px; height: 2px;
        background: linear-gradient(90deg, transparent, #B8860B, transparent);
    }
    .luxe-ornament-top { top: 40px; }
    .luxe-ornament-bottom { bottom: 40px; }
    .luxe-crest {
        font-size: 48px; color: #B8860B; margin-bottom: 20px;
        text-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
    }
    .luxe-badge {
        background: linear-gradient(135deg, #B8860B, #D4AF37);
        color: #1a1a1a !important;
        font-weight: 900; letter-spacing: 4px;
        padding: 10px 30px; border-radius: 4px;
        box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
    }
    .luxe-title {
        font-family: 'Playfair Display', serif !important;
        font-size: 58px; font-weight: 900;
        margin: 30px 0; line-height: 1.1;
        text-shadow: 0 2px 10px rgba(212, 175, 55, 0.3);
    }
    .luxe-subtitle {
        font-family: 'Merriweather', serif;
        font-style: italic; font-size: 22px;
        color: #d4d4d8; margin-bottom: 40px;
    }
    .luxe-separator {
        display: flex; gap: 20px; justify-content: center;
        margin: 40px 0; font-size: 20px; color: #B8860B;
    }
    .luxe-author {
        margin-top: 50px;
    }
    .luxe-author-label {
        font-size: 12px; letter-spacing: 3px;
        color: #B8860B; margin-bottom: 10px;
    }
    .luxe-author-name {
        font-family: 'Playfair Display', serif;
        font-size: 24px; font-weight: 700;
        color: #D4AF37;
    }
    
    /* CRÉATIF */
    .creative-cover {
        background: linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%);
        color: white;
    }
    .creative-blob {
        position: absolute; border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
        opacity: 0.15;
    }
    .blob-1 {
        width: 400px; height: 400px;
        background: ${theme.accent};
        top: -100px; right: -100px;
    }
    .blob-2 {
        width: 300px; height: 300px;
        background: white;
        bottom: -80px; left: -80px;
        border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%;
    }
    .blob-3 {
        width: 200px; height: 200px;
        background: ${theme.secondary};
        top: 50%; left: 10%;
        opacity: 0.1;
    }
    .creative-badge {
        background: rgba(255,255,255,0.2);
        backdrop-filter: blur(10px);
        border: 2px solid rgba(255,255,255,0.3);
    }
    .creative-title {
        font-size: 62px; font-weight: 900;
        background: linear-gradient(135deg, white, ${theme.accent});
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin: 30px 0;
    }
    .creative-waves {
        margin: 30px auto; opacity: 0.6;
    }
    .creative-author {
        font-size: 18px; letter-spacing: 3px;
        padding: 15px 40px;
        background: rgba(255,255,255,0.1);
        border-radius: 50px;
        border: 2px solid rgba(255,255,255,0.2);
    }
    
    /* MINIMAL */
    .minimal-cover {
        background: white; color: #2c3e50;
    }
    .minimal-border {
        position: absolute; inset: 30px;
        border: 1px solid #e2e8f0;
    }
    .minimal-title {
        font-size: 68px; font-weight: 300;
        letter-spacing: -3px; line-height: 1;
        margin: 0 0 30px 0;
    }
    .minimal-subtitle {
        font-size: 20px; font-weight: 400;
        color: #64748b; max-width: 600px;
        margin: 0 auto 50px auto;
    }
    .minimal-line {
        width: 80px; height: 2px;
        background: #2c3e50; margin: 0 auto 50px auto;
    }
    .minimal-author {
        font-size: 16px; font-weight: 500;
        letter-spacing: 2px; text-transform: uppercase;
        color: #64748b;
    }
    
    /* ÉNERGIE */
    .energie-cover {
        background: linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 50%, ${theme.accent} 100%);
        color: white; position: relative;
    }
    .energie-rays {
        position: absolute; inset: 0;
        background: 
            repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.05) 20px, rgba(255,255,255,0.05) 40px);
    }
    .energie-badge {
        background: rgba(255,255,255,0.2);
        border: 2px solid rgba(255,255,255,0.4);
        font-weight: 900; letter-spacing: 4px;
    }
    .energie-title {
        font-size: 64px; font-weight: 900;
        margin: 30px 0; text-transform: uppercase;
        letter-spacing: -2px;
        text-shadow: 0 4px 20px rgba(0,0,0,0.3);
    }
    .energie-lightning {
        margin: 40px 0; height: 60px;
        display: flex; align-items: center; justify-content: center;
    }
    .lightning-bolt {
        width: 0; height: 0;
        border-left: 15px solid transparent;
        border-right: 15px solid transparent;
        border-top: 50px solid white;
        position: relative;
        opacity: 0.8;
    }
    .lightning-bolt::after {
        content: ''; position: absolute;
        top: -50px; left: -15px;
        width: 0; height: 0;
        border-left: 20px solid white;
        border-bottom: 30px solid transparent;
    }
    .energie-author {
        font-size: 18px; letter-spacing: 4px;
        padding: 15px 50px;
        background: rgba(0,0,0,0.3);
        border-radius: 4px; font-weight: 900;
    }
    
    /* ÉDUCATIF */
    .educatif-cover {
        background: linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%);
        color: white;
    }
    .educatif-grid {
        position: absolute; inset: 0;
        background-image: 
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
        background-size: 50px 50px;
    }
    .educatif-badge {
        background: rgba(255,255,255,0.2);
        border: 2px solid rgba(255,255,255,0.3);
    }
    .educatif-title {
        font-size: 56px; font-weight: 800;
        margin: 30px 0; text-transform: uppercase;
    }
    .educatif-check {
        font-size: 80px; color: ${theme.accent};
        margin: 30px 0; font-weight: bold;
        text-shadow: 0 4px 15px rgba(16, 185, 129, 0.5);
    }
    .educatif-author {
        font-size: 16px; letter-spacing: 3px;
        padding: 12px 40px;
        border: 2px solid white; border-radius: 8px;
        display: inline-block;
    }
    
    /* MODERN (défaut) */
    .modern-cover {
        background: linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%);
        color: white;
    }
    .modern-grid {
        position: absolute; inset: 0;
        background-image: 
            linear-gradient(rgba(255,255,255,0.03) 2px, transparent 2px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 2px, transparent 2px);
        background-size: 100px 100px;
    }
    
    /* ÉLÉMENTS COMMUNS COUVERTURE */
    .badge {
        display: inline-block; background: rgba(255,255,255,0.2);
        color: white; padding: 12px 35px; font-weight: 700; font-size: 14px;
        letter-spacing: 3px; margin-bottom: 30px; border-radius: 50px;
        text-transform: uppercase; border: 1px solid rgba(255,255,255,0.4);
    }
    .cover-title {
        font-size: 56px; font-weight: 900; line-height: 1.1; margin-bottom: 30px;
        ${theme.uppercase ? 'text-transform: uppercase;' : 'text-transform: capitalize;'}
    }
    .cover-subtitle {
        font-size: 24px; margin-bottom: 40px; opacity: 0.95;
        max-width: 800px; margin-inline: auto;
    }
    .cover-separator {
        width: 120px; height: 6px; background: white;
        border-radius: 3px; margin: 0 auto 40px auto; opacity: 0.6;
    }
    .cover-author {
        font-weight: 700; letter-spacing: 2px; font-size: 16px;
        padding: 15px 40px; border: 2px solid white;
        border-radius: 12px; display: inline-block;
    }

    /* ========== SOMMAIRE ========== */
    .toc-page { page-break-after: always; padding-top: 40px; }
    .toc-title {
        font-size: 44px; font-weight: 800; color: ${theme.primary};
        margin-bottom: 50px; text-align: center;
        text-transform: uppercase; letter-spacing: 1px;
    }
    
    /* LUXE TOC */
    .luxe-toc .toc-title {
        font-family: 'Playfair Display', serif;
        font-size: 48px; color: #1a1a1a;
    }
    .luxe-toc-ornament {
        text-align: center; font-size: 24px;
        color: #B8860B; margin-bottom: 40px;
    }
    .luxe-toc-item {
        border-bottom: 1px solid #B8860B !important;
        padding: 15px 0 !important;
    }
    .luxe-toc-item .toc-num {
        font-family: 'Playfair Display', serif;
        color: #B8860B; font-size: 20px;
    }
    .luxe-toc-item .toc-text {
        font-family: 'Merriweather', serif;
        font-style: italic;
    }
    
    /* TOC Standard */
    .toc-list {
        max-width: 700px; margin: 0 auto;
        border-top: 2px solid #f1f5f9; padding-top: 30px;
    }
    .toc-item {
        display: flex; align-items: baseline;
        margin-bottom: 20px; font-size: 20px;
        padding: 10px 0; border-bottom: 1px dashed #e2e8f0;
        page-break-inside: avoid;
    }
    .toc-num {
        font-weight: 900; color: ${theme.secondary};
        width: 60px; font-size: 22px;
    }
    .toc-text { font-weight: 500; color: #334155; flex: 1; }

    /* ========== CHAPITRES ========== */
    .chapter-header {
        text-align: center; margin-bottom: 50px;
        padding-bottom: 30px; border-bottom: 2px solid #f1f5f9;
    }
    .chapter-badge {
        color: ${theme.secondary}; font-weight: 800; font-size: 16px;
        letter-spacing: 2px; text-transform: uppercase; margin-bottom: 15px;
        display: inline-block; background: #f8fafc;
        padding: 10px 25px; border-radius: 20px;
    }
    .chapter-title {
        font-size: 42px; font-weight: 800;
        color: ${theme.primary}; line-height: 1.2;
    }
    .section-title {
        font-size: 44px; font-weight: 900;
        color: ${theme.primary}; margin-bottom: 50px;
        text-align: center; text-transform: uppercase;
    }

    /* CONTENU */
    .section-content { font-size: 21px; text-align: justify; }
    .section-content p { margin-bottom: 28px; line-height: 1.8; }
    .section-content h2 {
        color: ${theme.primary}; font-size: 32px; font-weight: 800;
        margin-top: 50px; margin-bottom: 25px;
        page-break-after: avoid; display: flex; align-items: center;
    }
    .section-content h2::before {
        content: ""; display: inline-block; 
        width: 6px; 
        height: 28px; 
        background: ${theme.secondary}; 
        margin-right: 15px; 
        border-radius: 2px;
        flex-shrink: 0;
    }
    
    .section-content h3 {
        color: ${theme.secondary}; font-size: 26px; font-weight: 700;
        margin-top: 40px; margin-bottom: 20px; page-break-after: avoid;
    }

    /* LISTES */
    .section-content ul {
        margin: 30px 0; padding-left: 25px; list-style: none;
    }
    .section-content ul li {
        margin-bottom: 15px; position: relative;
        padding-left: 35px; font-size: 21px; page-break-inside: avoid;
    }
    .section-content ul li::before {
        content: "•"; color: ${theme.secondary}; font-size: 35px;
        position: absolute; left: 0; top: -10px; font-weight: bold;
    }

    .section-content ol {
        counter-reset: steps; list-style: none;
        margin: 40px 0; padding: 0;
    }
    .section-content ol li {
        position: relative; background: #f8fafc;
        border: 1px solid #e2e8f0; border-left: 6px solid ${theme.primary};
        border-radius: 12px; padding: 25px 25px 25px 85px;
        margin-bottom: 25px; counter-increment: steps;
        page-break-inside: avoid; box-shadow: 0 4px 8px rgba(0,0,0,0.04);
        font-size: 21px;
    }
    .section-content ol li::before {
        content: counter(steps); position: absolute;
        left: 20px; top: 50%; transform: translateY(-50%);
        width: 45px; height: 45px; background: ${theme.primary};
        color: white; border-radius: 50%; text-align: center;
        line-height: 45px; font-weight: 800; font-size: 20px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }

    /* TABLEAUX */
    .section-content table {
        width: 100%; border-collapse: collapse; margin: 35px 0;
        font-size: 19px; box-shadow: 0 4px 10px rgba(0,0,0,0.06);
        page-break-inside: auto;
    }
    .section-content tr {
        page-break-inside: avoid; page-break-after: auto;
    }
    .section-content th {
        background: ${theme.primary}; color: white;
        padding: 18px; text-align: left; font-size: 19px;
    }
    .section-content td {
        border: 1px solid #e2e8f0; padding: 18px; font-size: 19px;
    }
    .section-content tr:nth-child(even) { background: #f8fafc; }

    /* BLOCS SPÉCIAUX */
    .section-content blockquote {
        margin: 35px 0; padding: 30px 40px;
        background: linear-gradient(to right, #f9fafb, #ffffff);
        border-left: 8px solid ${theme.secondary}; border-radius: 0 12px 12px 0;
        font-style: italic; color: #475569;
        font-family: 'Merriweather', serif; font-size: 22px;
        line-height: 1.8; position: relative;
        page-break-inside: avoid; box-shadow: 0 4px 15px rgba(0,0,0,0.06);
    }
    .section-content blockquote::before {
        content: '"'; font-size: 90px; color: ${theme.secondary};
        opacity: 0.15; position: absolute; top: -25px; left: 15px;
    }

    .tip-box, .conseil-box, .warning-box {
        padding: 30px; margin: 35px 0; border-radius: 10px;
        border-left: 8px solid; box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        page-break-inside: avoid; font-size: 20px;
    }
    .tip-box {
        background-color: #f0fdf4; border-color: #22c55e;
    }
    .warning-box {
        background-color: #fff7ed; border-color: #f97316;
    }
    .conseil-box {
        background-color: #eff6ff; border-color: #3b82f6;
    }

    strong { color: ${theme.primary}; font-weight: 700; }
    img {
        max-width: 100%; height: auto; border-radius: 12px;
        margin: 30px 0; box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        page-break-inside: avoid;
    }
  `;

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>${finalCSS}</style>
    </head>
    <body>
        ${coverHTML + tocHTML + bodyHTML}
    </body>
    </html>
  `;
}