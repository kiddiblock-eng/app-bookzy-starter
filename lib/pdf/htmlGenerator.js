// lib/pdf/htmlGenerator.js
// 🎯 VERSION GEMINI OPTIMISÉE + SUPPORT EMOJI
// - Polices dynamiques par theme
// - Uppercase intelligent
// - Support emoji complet
// - Design premium conservé

import fs from "fs";
import path from "path";

// ============================================================================
// 1. CONFIGURATION DES THÈMES (Matching exact avec ton Frontend)
// ============================================================================
function getThemeConfig(templateKey) {
    const themes = {
        modern:   { primary: "#0f172a", secondary: "#334155", font: "Inter", uppercase: true },
        luxe:     { primary: "#1a1a1a", secondary: "#B8860B", font: "Poppins", uppercase: false },
        educatif: { primary: "#0A6847", secondary: "#127C56", font: "Inter", uppercase: true },
        energie:  { primary: "#FF6B35", secondary: "#F7931E", font: "Manrope", uppercase: true },
        minimal:  { primary: "#2c3e50", secondary: "#7f8c8d", font: "Inter", uppercase: false },
        creative: { primary: "#8B5CF6", secondary: "#EC4899", font: "Nunito", uppercase: true },
    };
    return themes[templateKey] || themes.modern;
}

// ============================================================================
// 2. FONCTION PRINCIPALE
// ============================================================================
export function generateStyledHTML(data, templateKey = "modern") {
  const { title, author, subtitle, intro, conclusion, chaptersData } = data;
  
  // On récupère la configuration du thème
  const theme = getThemeConfig(templateKey);
  
  const safeSubtitle = subtitle && subtitle.length > 250 
      ? subtitle.substring(0, 250).trim() + "..." 
      : (subtitle || "");

  // --- CONSTRUCTION DES SECTIONS HTML ---
  
  const coverHTML = `
    <div class="cover-page">
        <div class="cover-content">
            <div class="badge">GUIDE PREMIUM</div>
            <h1 class="cover-title">${title}</h1>
            ${safeSubtitle ? `<p class="cover-subtitle">${safeSubtitle}</p>` : ''}
            <div class="cover-separator"></div>
            <div class="cover-author">PAR ${author ? author.toUpperCase() : 'AUTEUR'}</div>
        </div>
    </div>`;

  let tocHTML = `
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

  let bodyHTML = `
    <div class="content-page start-chapter">
        <h1 class="section-title">Introduction</h1>
        <div class="section-content intro-text">${intro}</div>
    </div>
    ${chaptersData.map((ch, idx) => `
        <div class="content-page start-chapter">
            <div class="chapter-header">
                <div class="chapter-badge">CHAPITRE ${idx + 1}</div>
                <h1 class="chapter-title">${ch.title}</h1>
            </div>
            <div class="section-content">${ch.content}</div>
        </div>
    `).join('')}
    <div class="content-page start-chapter">
        <h1 class="section-title">Conclusion</h1>
        <div class="section-content conclusion-text">${conclusion}</div>
    </div>`;

  /* ==========================================================================
     3. CSS COMPLET AVEC SUPPORT EMOJI
     ========================================================================== */
  const finalCSS = `
    /* IMPORT DYNAMIQUE DES POLICES GOOGLE + EMOJI */
    @import url('https://fonts.googleapis.com/css2?family=${theme.font.replace(' ', '+')}:wght@300;400;500;600;700;800;900&family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap');

    /* --- RESET & BASE --- */
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
        font-family: '${theme.font}', "Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji", Helvetica, Arial, sans-serif;
        color: #1e293b; 
        font-size: 21px; 
        line-height: 1.8; 
        background: white;
    }

    @page { size: A4; margin: 25mm 20mm; }
    @page :first { margin: 0; }

    .start-chapter { page-break-before: always; margin-top: 0; padding-top: 20px; }

    /* --- 1. PAGE DE COUVERTURE --- */
    .cover-page {
        width: 100%; min-height: 100vh;
        background: linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%);
        color: white; display: flex; flex-direction: column; align-items: center; justify-content: center;
        text-align: center; padding: 40px; page-break-after: always;
    }

    .cover-content { max-width: 90%; }

    .badge {
        display: inline-block; background: rgba(255,255,255,0.2);
        color: white; padding: 12px 35px; font-weight: 700; font-size: 14px;
        letter-spacing: 3px; margin-bottom: 30px; border-radius: 50px;
        text-transform: uppercase; border: 1px solid rgba(255,255,255,0.4);
    }

    .cover-title {
        font-size: 56px; font-weight: 900; line-height: 1.1; margin-bottom: 30px;
        ${theme.uppercase ? 'text-transform: uppercase;' : 'text-transform: capitalize;'}
        ${templateKey === 'luxe' ? "font-family: 'Merriweather', serif;" : ""}
    }

    .cover-subtitle { font-size: 24px; margin-bottom: 40px; opacity: 0.95; max-width: 800px; margin-inline: auto; white-space: pre-wrap; }
    .cover-separator { width: 120px; height: 6px; background: white; border-radius: 3px; margin: 0 auto 40px auto; opacity: 0.6; }
    .cover-author { font-weight: 700; letter-spacing: 2px; font-size: 16px; padding: 15px 40px; border: 2px solid white; border-radius: 12px; display: inline-block; background: white; color: ${theme.primary}; }

    /* --- 2. SOMMAIRE --- */
    .toc-page { page-break-after: always; padding-top: 40px; }
    .toc-title { font-size: 44px; font-weight: 800; color: ${theme.primary}; margin-bottom: 50px; text-align: center; text-transform: uppercase; letter-spacing: 1px; }
    .toc-list { max-width: 700px; margin: 0 auto; border-top: 2px solid #f1f5f9; padding-top: 30px; }
    .toc-item { display: flex; align-items: baseline; margin-bottom: 20px; font-size: 20px; padding: 10px 0; border-bottom: 1px dashed #e2e8f0; page-break-inside: avoid; }
    .toc-num { font-weight: 900; color: ${theme.secondary}; width: 40px; font-size: 22px; }
    .toc-text { font-weight: 500; color: #334155; }

    /* --- 3. CONTENU DES CHAPITRES --- */
    .chapter-header { text-align: center; margin-bottom: 50px; padding-bottom: 30px; border-bottom: 2px solid #f1f5f9; }
    .chapter-badge { color: ${theme.secondary}; font-weight: 800; font-size: 16px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 15px; display: inline-block; background: #f8fafc; padding: 10px 25px; border-radius: 20px; }
    .chapter-title { font-size: 42px; font-weight: 800; color: ${theme.primary}; line-height: 1.2; }
    .section-title { font-size: 44px; font-weight: 900; color: ${theme.primary}; margin-bottom: 50px; text-align: center; text-transform: uppercase; }

    .section-content { font-size: 21px; text-align: justify; }
    .section-content p { margin-bottom: 28px; line-height: 1.8; }
    .section-content h2 { color: ${theme.primary}; font-size: 32px; font-weight: 800; margin-top: 50px; margin-bottom: 25px; page-break-after: avoid; display: flex; align-items: center; }
    .section-content h2::before { content: ""; display: inline-block; width: 10px; height: 32px; background: ${theme.secondary}; margin-right: 15px; border-radius: 4px; }
    .section-content h3 { color: ${theme.secondary}; font-size: 26px; font-weight: 700; margin-top: 40px; margin-bottom: 20px; page-break-after: avoid; }

    /* --- LISTES & ÉTAPES (MAGIE VISUELLE) --- */
    .section-content ul { margin: 30px 0; padding-left: 25px; list-style: none; }
    .section-content ul li { margin-bottom: 15px; position: relative; padding-left: 35px; font-size: 21px; page-break-inside: avoid; }
    .section-content ul li::before { content: "•"; color: ${theme.secondary}; font-size: 35px; position: absolute; left: 0; top: -10px; font-weight: bold; }

    .section-content ol { counter-reset: steps; list-style: none; margin: 40px 0; padding: 0; }
    .section-content ol li { position: relative; background: #f8fafc; border: 1px solid #e2e8f0; border-left: 6px solid ${theme.primary}; border-radius: 12px; padding: 25px 25px 25px 85px; margin-bottom: 25px; counter-increment: steps; page-break-inside: avoid; box-shadow: 0 4px 8px rgba(0,0,0,0.04); font-size: 21px; }
    .section-content ol li::before { content: counter(steps); position: absolute; left: 20px; top: 50%; transform: translateY(-50%); width: 45px; height: 45px; background: ${theme.primary}; color: white; border-radius: 50%; text-align: center; line-height: 45px; font-weight: 800; font-size: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }

    /* --- TABLEAUX INTELLIGENTS --- */
    .section-content table { width: 100%; border-collapse: collapse; margin: 35px 0; font-size: 19px; box-shadow: 0 4px 10px rgba(0,0,0,0.06); page-break-inside: auto; }
    .section-content tr { page-break-inside: avoid; page-break-after: auto; }
    .section-content th { background: ${theme.primary}; color: white; padding: 18px; text-align: left; font-size: 19px; }
    .section-content td { border: 1px solid #e2e8f0; padding: 18px; font-size: 19px; }
    .section-content tr:nth-child(even) { background: #f8fafc; }

    /* --- BLOCS SPÉCIAUX --- */
    .section-content blockquote { margin: 35px 0; padding: 30px 40px; background: linear-gradient(to right, #f9fafb, #ffffff); border-left: 8px solid ${theme.secondary}; border-radius: 0 12px 12px 0; font-style: italic; color: #475569; font-family: 'Merriweather', serif; font-size: 22px; line-height: 1.8; position: relative; page-break-inside: avoid; box-shadow: 0 4px 15px rgba(0,0,0,0.06); }
    .section-content blockquote::before { content: '"'; font-size: 90px; color: ${theme.secondary}; opacity: 0.15; position: absolute; top: -25px; left: 15px; font-family: Arial; }

    .tip-box, .conseil-box, .warning-box { padding: 30px; margin: 35px 0; border-radius: 10px; border-left: 8px solid; box-shadow: 0 4px 12px rgba(0,0,0,0.05); page-break-inside: avoid; font-size: 20px; }
    .tip-box { background-color: #f0fdf4; border-color: #22c55e; }
    .warning-box { background-color: #fff7ed; border-color: #f97316; }
    .conseil-box { background-color: #eff6ff; border-color: #3b82f6; }

    strong { color: ${theme.primary}; font-weight: 700; }
    img { max-width: 100%; height: auto; border-radius: 12px; margin: 30px 0; box-shadow: 0 4px 8px rgba(0,0,0,0.1); page-break-inside: avoid; }
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