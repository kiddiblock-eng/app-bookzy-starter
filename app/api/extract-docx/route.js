export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import mammoth from "mammoth";

// ============================================================================
// 🧠 SYSTÈME D'EXTRACTION ULTRA-INTELLIGENT AVEC IA
// ============================================================================

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Aucun fichier fourni" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ✅ CONVERSION HTML AVEC OPTIONS AVANCÉES
    const result = await mammoth.convertToHtml({ 
      buffer,
      styleMap: [
        "p[style-name='Heading 1'] => h1",
        "p[style-name='Heading 2'] => h2",
        "p[style-name='Heading 3'] => h3",
        "p[style-name='Title'] => h1",
        "p[style-name='Subtitle'] => h2"
      ]
    });
    
    const html = result.value;
    const messages = result.messages || [];

    if (!html || html.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Le fichier est vide" },
        { status: 400 }
      );
    }

    console.log("🧠 ═══════════════════════════════════════════════════════");
    console.log("🧠 [AI-Extract] DÉMARRAGE ANALYSE ULTRA-INTELLIGENTE");
    console.log("🧠 ═══════════════════════════════════════════════════════");
    console.log(`📏 [AI-Extract] Taille HTML: ${Math.round(html.length / 1024)}KB`);
    console.log(`📋 [AI-Extract] Messages Mammoth: ${messages.length}`);

    // ✅ PHASE 1 : ANALYSE MULTI-DIMENSIONNELLE
    const documentAnalysis = analyzeDocumentIntelligently(html);
    console.log("📊 [AI-Extract] Analyse multi-dimensionnelle:");
    console.log(JSON.stringify(documentAnalysis, null, 2));

    // ✅ PHASE 2 : EXTRACTION ET VALIDATION DU SOMMAIRE
    const tableOfContents = extractTableOfContents(html);
    const tocQuality = evaluateTOCQuality(tableOfContents, documentAnalysis);
    
    if (tableOfContents.length > 0) {
      console.log(`📑 [TOC] ${tableOfContents.length} entrées détectées dans le sommaire`);
      console.log(`📑 [TOC] Qualité du sommaire: ${tocQuality.score}% (${tocQuality.status})`);
      tableOfContents.forEach((entry, i) => {
        console.log(`  ${i + 1}. "${entry}"`);
      });
      documentAnalysis.tableOfContents = tableOfContents;
      documentAnalysis.tocQuality = tocQuality;
    } else {
      console.log(`📑 [TOC] Aucun sommaire détecté`);
      documentAnalysis.tocQuality = { score: 0, status: "absent", reliable: false };
    }

    // ✅ PHASE 2.5 : EXTRAIRE INTRO depuis le HTML brut AVANT le cleanup
    let rawIntro = "";
    let rawConclusion = "";
    const introRegexRaw = /^(introduction|avant-propos|préface)$/i;
    const conclusionRegexRaw = /^(conclusion|épilogue|mot de fin)$/i;
    const rawH1s = [...html.matchAll(/<h1[^>]*>(.*?)<\/h1>/gi)];
    for (let ri = 0; ri < rawH1s.length; ri++) {
      const title = cleanText(rawH1s[ri][0]);
      if (introRegexRaw.test(title.trim())) {
        const idx = html.indexOf(rawH1s[ri][0]);
        const nextH1 = rawH1s[ri + 1];
        const end = nextH1 ? html.indexOf(nextH1[0]) : html.length;
        rawIntro = cleanHTMLToHTML(html.substring(idx + rawH1s[ri][0].length, end));
        console.log(`  ✅ [RAW] Introduction extraite (${rawIntro.length} chars)`);
      }
      if (conclusionRegexRaw.test(title.trim())) {
        const idx = html.indexOf(rawH1s[ri][0]);
        rawConclusion = cleanHTMLToHTML(html.substring(idx + rawH1s[ri][0].length, html.length));
        console.log(`  ✅ [RAW] Conclusion extraite (${rawConclusion.length} chars)`);
      }
    }

    // ✅ PHASE 3 : NETTOYAGE INTELLIGENT
    let cleanedHTML = intelligentCleanup(html, documentAnalysis);

    // ✅ PHASE 4 : EXTRACTION DU TITRE AVEC IA
    const titre = extractTitleIntelligently(cleanedHTML, documentAnalysis);
    console.log(`✨ [AI-Extract] Titre détecté: "${titre}" (confiance: ${documentAnalysis.titleConfidence}%)`);

    // ✅ PHASE 5 : EXTRACTION DES CHAPITRES AVEC ALGORITHME ADAPTATIF
    let chapters = extractChaptersIntelligently(cleanedHTML, documentAnalysis, titre);
    
    // ✅ PHASE 6 : POST-TRAITEMENT AVANCÉ
    chapters = postProcessChaptersIntelligently(chapters, documentAnalysis);
    
    // ✅ PHASE 7 : VALIDATION QUALITÉ
    const qualityScore = calculateQualityScore(chapters, documentAnalysis);

    console.log("🎯 ═══════════════════════════════════════════════════════");
    console.log(`✅ [AI-Extract] EXTRACTION TERMINÉE - Score qualité: ${qualityScore}%`);
    console.log(`📚 [AI-Extract] ${chapters.length} chapitre(s) extrait(s)`);
    chapters.forEach((ch, i) => {
      console.log(`  ${i + 1}. "${ch.title}" (${ch.content.length} caractères)`);
    });
    console.log("🎯 ═══════════════════════════════════════════════════════");

    const stripHTML = (html) => html
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    return NextResponse.json({
      success: true,
      titre,
      chapters,
      introduction: stripHTML(rawIntro || extractByHeadingAdvanced._intro || ""),
      conclusion: stripHTML(rawConclusion || extractByHeadingAdvanced._conclusion || ""),
      stats: {
        totalChapters: chapters.length,
        totalCharacters: chapters.reduce((sum, ch) => sum + ch.content.length, 0),
        detectionMethod: documentAnalysis.bestMethod,
        confidence: documentAnalysis.confidence,
        qualityScore,
        structureType: documentAnalysis.structureType
      }
    });

  } catch (error) {
    console.error("❌ [AI-Extract] Erreur fatale:", error);
    return NextResponse.json(
      { success: false, error: "Impossible de lire ce fichier Word" },
      { status: 500 }
    );
  }
}

// ============================================================================
// 📑 EXTRACTION DU SOMMAIRE
// ============================================================================
function extractTableOfContents(html) {
  const tocEntries = [];
  
  const tocPatterns = [
    /(?:AU PROGRAMME|SOMMAIRE|TABLE DES MATI[EÈ]RES|PLAN)[\s\S]*?<(?:ul|ol)>([\s\S]*?)<\/(?:ul|ol)>/i
  ];
  
  for (const pattern of tocPatterns) {
    const match = html.match(pattern);
    if (match) {
      const listHTML = match[1];
      const liMatches = listHTML.match(/<li[^>]*>(.*?)<\/li>/gi) || [];
      
      liMatches.forEach(li => {
        let entry = cleanText(li);
        entry = entry.replace(/\.{2,}/g, '').replace(/\d+\s*$/, '').trim();
        if (entry.length >= 5 && entry.length <= 200) {
          tocEntries.push(entry);
        }
      });
      
      if (tocEntries.length > 0) {
        console.log(`📑 [TOC-Extract] Sommaire détecté via liste (${tocEntries.length} entrées)`);
        return tocEntries;
      }
    }
  }
  
  const dotPattern = /^(.+?)\s*\.{3,}\s*\d*$/gm;
  const dotMatches = [...html.matchAll(dotPattern)];
  
  if (dotMatches.length >= 3) {
    dotMatches.forEach(match => {
      const entry = cleanText(match[1]).trim();
      if (entry.length >= 5 && entry.length <= 200) {
        tocEntries.push(entry);
      }
    });
    if (tocEntries.length >= 3) {
      console.log(`📑 [TOC-Extract] Sommaire détecté via points de suite (${tocEntries.length} entrées)`);
      return tocEntries;
    }
  }
  
  return [];
}

// ============================================================================
// 🎯 ÉVALUATION DE LA QUALITÉ DU SOMMAIRE
// ============================================================================
function evaluateTOCQuality(tocEntries, analysis) {
  if (tocEntries.length === 0) {
    return { score: 0, status: "absent", reliable: false };
  }
  
  let score = 0;
  let reasons = [];
  
  if (tocEntries.length >= 5 && tocEntries.length <= 20) {
    score += 30;
    reasons.push(`✅ Nombre optimal (${tocEntries.length})`);
  } else if (tocEntries.length >= 3 && tocEntries.length < 5) {
    score += 15;
    reasons.push(`⚠️ Peu d'entrées (${tocEntries.length})`);
  } else if (tocEntries.length > 20) {
    score += 10;
    reasons.push(`⚠️ Trop d'entrées (${tocEntries.length})`);
  } else {
    score += 5;
    reasons.push(`❌ Trop peu d'entrées (${tocEntries.length})`);
  }
  
  const uppercaseTexts = analysis.uppercaseStrongs.map(s => s.text.toLowerCase());
  let matchCount = 0;
  
  tocEntries.forEach(entry => {
    const normalizedEntry = entry.toLowerCase().trim();
    const hasMatch = uppercaseTexts.some(uppercase => {
      const normalizedUppercase = uppercase.toLowerCase().trim();
      return normalizedUppercase.includes(normalizedEntry) || 
             normalizedEntry.includes(normalizedUppercase) ||
             similarity(normalizedEntry, normalizedUppercase) > 0.7;
    });
    if (hasMatch) matchCount++;
  });
  
  const matchRatio = matchCount / tocEntries.length;
  const matchScore = Math.round(matchRatio * 40);
  score += matchScore;
  reasons.push(`${matchRatio >= 0.5 ? '✅' : '⚠️'} ${matchCount}/${tocEntries.length} correspondances (${Math.round(matchRatio * 100)}%)`);
  
  const avgLength = tocEntries.reduce((sum, e) => sum + e.length, 0) / tocEntries.length;
  const hasNumericPattern = tocEntries.some(e => /^\d+\./.test(e) || /^(Chapitre|Module|Partie)\s+\d+/i.test(e));
  const allUppercase = tocEntries.every(e => /^[A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ\s'-]+$/.test(e));
  
  if (avgLength >= 10 && avgLength <= 100) {
    score += 15;
    reasons.push(`✅ Longueur moyenne cohérente (${Math.round(avgLength)} chars)`);
  } else {
    score += 5;
    reasons.push(`⚠️ Longueur incohérente (${Math.round(avgLength)} chars)`);
  }
  
  if (hasNumericPattern || allUppercase) {
    score += 15;
    reasons.push(`✅ Structure cohérente`);
  } else {
    score += 7;
    reasons.push(`⚠️ Structure variable`);
  }
  
  let status = "";
  let reliable = false;
  
  if (score >= 70) {
    status = "fiable";
    reliable = true;
    reasons.push(`✅ SOMMAIRE FIABLE - Sera utilisé pour filtrage`);
  } else if (score >= 40) {
    status = "partiel";
    reliable = false;
    reasons.push(`⚠️ SOMMAIRE PARTIEL - Utilisé avec prudence`);
  } else {
    status = "non-fiable";
    reliable = false;
    reasons.push(`❌ SOMMAIRE NON FIABLE - Sera ignoré`);
  }
  
  console.log(`📊 [TOC-Quality] Évaluation détaillée:`);
  reasons.forEach(r => console.log(`  ${r}`));
  
  return { score, status, reliable, reasons };
}

// ============================================================================
// 🧠 ANALYSE MULTI-DIMENSIONNELLE DU DOCUMENT
// ============================================================================
function analyzeDocumentIntelligently(html) {
  const analysis = {
    h1Count: (html.match(/<h1[^>]*>/gi) || []).length,
    h2Count: (html.match(/<h2[^>]*>/gi) || []).length,
    h3Count: (html.match(/<h3[^>]*>/gi) || []).length,
    strongCount: (html.match(/<strong[^>]*>/gi) || []).length,
    pCount: (html.match(/<p[^>]*>/gi) || []).length,
    olCount: (html.match(/<ol[^>]*>/gi) || []).length,
    ulCount: (html.match(/<ul[^>]*>/gi) || []).length,
    liCount: (html.match(/<li[^>]*>/gi) || []).length,
    uppercaseStrongs: [],
    bulletPatterns: [],
    numberedPatterns: [],
    tableOfContents: [],
    tocQuality: null,
    hasH1: false,
    hasH2: false,
    hasH3: false,
    hasTableOfContents: false,
    hasBulletChapters: false,
    hasUppercaseChapters: false,
    hasNumberedChapters: false,
    hasLists: false,
    estimatedWordCount: 0,
    averageParagraphLength: 0,
    structureType: null,
    bestMethod: null,
    confidence: 0,
    titleConfidence: 0
  };

  // ✅ ANALYSE DES PATTERNS DE MAJUSCULES
  const strongMatches = html.match(/<strong[^>]*>(.*?)<\/strong>/gi) || [];
  console.log(`🔍 [Analyze] ${strongMatches.length} balises <strong> détectées au total`);

  strongMatches.forEach((strong, index) => {
    const text = cleanText(strong);
    const letters = text.match(/[a-zA-ZÀ-ÿ]/g) || [];
    if (letters.length === 0) return;
    const uppercaseLetters = text.match(/[A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ]/g) || [];
    const uppercaseRatio = uppercaseLetters.length / letters.length;
    if (index < 30) {
      console.log(`  [${index + 1}] "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}" - Ratio: ${(uppercaseRatio * 100).toFixed(0)}% (${uppercaseLetters.length}/${letters.length})`);
    }
    if (uppercaseRatio >= 0.95 && text.length >= 5 && text.length <= 200) {
      analysis.uppercaseStrongs.push({ text, ratio: uppercaseRatio, length: text.length });
      if (index < 30) console.log(`    ✅ VALIDÉ comme chapitre potentiel (ratio ${(uppercaseRatio * 100).toFixed(0)}%)`);
    }
  });

  console.log(`🔍 [Analyze] ${analysis.uppercaseStrongs.length} textes en MAJUSCULES pures détectés (ratio ≥ 95%)`);

  // ✅ ANALYSE DES BULLETS
  const bulletRegex = /[•\*\-]\s*([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ][^\n<]{5,100})/g;
  analysis.bulletPatterns = [...html.matchAll(bulletRegex)].map(m => m[1].trim());

  // ✅ ANALYSE DES CHAPITRES NUMÉROTÉS
  const numberedRegex = /(Chapitre|CHAPITRE|Chapter|MODULE|Module|Partie|PARTIE)\s+(\d+|[IVX]+)/gi;
  analysis.numberedPatterns = [...html.matchAll(numberedRegex)].map(m => m[0]);

  // ✅ DÉTECTION TABLE DES MATIÈRES
  const tocPatterns = [/AU PROGRAMME/i, /SOMMAIRE/i, /TABLE DES MATI[EÈ]RES/i, /PLAN\s+(DU\s+)?DOCUMENT/i, /INDEX/i];
  analysis.hasTableOfContents = tocPatterns.some(p => p.test(html));

  analysis.hasH1 = analysis.h1Count > 0;
  analysis.hasH2 = analysis.h2Count >= 2;
  analysis.hasH3 = analysis.h3Count >= 2;
  analysis.hasUppercaseChapters = analysis.uppercaseStrongs.length >= 3;
  analysis.hasBulletChapters = analysis.bulletPatterns.length >= 3;
  analysis.hasNumberedChapters = analysis.numberedPatterns.length >= 2;
  analysis.hasLists = analysis.olCount > 0 || analysis.ulCount > 0;

  const textContent = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  analysis.estimatedWordCount = textContent.split(' ').length;

  const pMatches = html.match(/<p[^>]*>.*?<\/p>/gi) || [];
  if (pMatches.length > 0) {
    const totalLength = pMatches.reduce((sum, p) => sum + cleanText(p).length, 0);
    analysis.averageParagraphLength = Math.round(totalLength / pMatches.length);
  }

  // ✅ NOUVEAU : Analyser la qualité des H1 et H2 pour choisir le meilleur niveau
  const chapterPrefixRegex = /^(chapitre|chapter|module|partie|section)\s*\d+$/i;
  const metaRegex = /^(table des mati[eè]res|sommaire|index|plan|introduction|conclusion|bibliographie|annexe|remerciements|d[eé]dicace|préface|avant-propos)$/i;

  const h1Texts = [...html.matchAll(/<h1[^>]*>(.*?)<\/h1>/gi)].map(m => cleanText(m[1]));
  const h2Texts = [...html.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi)].map(m => cleanText(m[1]));

  // H2 génériques = tous les h2 sont juste "Chapitre X", "Module X", etc.
  const h2AllGeneric = h2Texts.length > 0 && h2Texts.every(t => chapterPrefixRegex.test(t.trim()));

  // H1 riches = au moins 3 h1 non-méta, non-génériques, avec du vrai contenu
  const h1Rich = h1Texts.filter(t => !metaRegex.test(t.trim()) && !chapterPrefixRegex.test(t.trim()) && t.length > 10);
  const h1HasRealContent = h1Rich.length >= 3;

  console.log(`🔍 [Analyze] H2 tous génériques: ${h2AllGeneric}, H1 riches: ${h1Rich.length}`);
  if (h2AllGeneric) console.log(`  ⚠️ H2 génériques détectés: [${h2Texts.join(', ')}]`);
  if (h1HasRealContent) console.log(`  ✅ H1 riches détectés: [${h1Rich.slice(0, 3).join(', ')}...]`);

  // ✅ DÉTERMINATION INTELLIGENTE DE LA STRUCTURE
  // CAS 1 : H2 génériques + H1 riches → utiliser H1
  if (h2AllGeneric && h1HasRealContent) {
    analysis.structureType = "h1_over_generic_h2";
    analysis.bestMethod = "h1";
    analysis.confidence = 96;
    analysis.titleConfidence = 90;
    console.log(`✅ [Analyze] Stratégie: H1 prioritaire (H2 génériques détectés)`);
  }
  // CAS 2 : H2 et H1 présents, H2 non génériques → hierarchical_perfect, utiliser H2
  else if (analysis.h2Count >= 3 && analysis.h1Count >= 1 && !h2AllGeneric) {
    analysis.structureType = "hierarchical_perfect";
    analysis.bestMethod = "h2";
    analysis.confidence = 98;
    analysis.titleConfidence = 95;
  }
  // CAS 3 : Seulement H1 riches (pas de H2)
  else if (h1HasRealContent && analysis.h2Count < 2) {
    analysis.structureType = "h1_only";
    analysis.bestMethod = "h1";
    analysis.confidence = 90;
    analysis.titleConfidence = 85;
    console.log(`✅ [Analyze] Stratégie: H1 uniquement`);
  }
  // CAS 4 : Majuscules en gras
  else if (analysis.hasUppercaseChapters && analysis.strongCount >= 5) {
    analysis.structureType = "uppercase_strong_chapters";
    analysis.bestMethod = "uppercase_strong";
    analysis.confidence = 92;
    analysis.titleConfidence = 85;
  }
  // CAS 5 : Chapitres numérotés
  else if (analysis.hasNumberedChapters && analysis.numberedPatterns.length >= 3) {
    analysis.structureType = "numbered_chapters";
    analysis.bestMethod = "numbered";
    analysis.confidence = 88;
    analysis.titleConfidence = 80;
  }
  // CAS 6 : H2 partiels
  else if (analysis.h2Count >= 2) {
    analysis.structureType = "partial_hierarchy";
    analysis.bestMethod = "h2";
    analysis.confidence = 85;
    analysis.titleConfidence = 75;
  }
  // CAS 7 : Bullets
  else if (analysis.hasBulletChapters) {
    analysis.structureType = "bullet_structure";
    analysis.bestMethod = "bullets";
    analysis.confidence = 75;
    analysis.titleConfidence = 70;
  }
  // CAS 8 : Tous les gras
  else if (analysis.strongCount >= 5) {
    analysis.structureType = "bold_sections";
    analysis.bestMethod = "all_strong";
    analysis.confidence = 65;
    analysis.titleConfidence = 60;
  }
  // CAS 9 : Paragraphes
  else if (analysis.pCount > 10) {
    analysis.structureType = "paragraph_based";
    analysis.bestMethod = "paragraphs";
    analysis.confidence = 50;
    analysis.titleConfidence = 45;
  }
  // CAS 10 : Fallback
  else {
    analysis.structureType = "unstructured";
    analysis.bestMethod = "fallback";
    analysis.confidence = 30;
    analysis.titleConfidence = 30;
  }

  return analysis;
}

// ============================================================================
// 🧹 NETTOYAGE INTELLIGENT
// ============================================================================
function intelligentCleanup(html, analysis) {
  let cleaned = html;

  if (analysis.hasTableOfContents) {
    console.log("🗑️ [AI-Cleanup] Détection et suppression du sommaire...");
    
    const tocKeywords = [
      /AU PROGRAMME.*?(?=<h2|<h1|<strong>INTRODUCTION|<strong>CHAPITRE)/is,
      /SOMMAIRE.*?(?=<h2|<h1|<strong>INTRODUCTION|<strong>CHAPITRE)/is,
      /TABLE DES MATI[EÈ]RES.*?(?=<h2|<h1|<strong>INTRODUCTION|<strong>CHAPITRE)/is
    ];
    
    tocKeywords.forEach(pattern => {
      cleaned = cleaned.replace(pattern, "");
    });

    const firstUL = cleaned.match(/<ul>.*?<\/ul>/is);
    if (firstUL && firstUL.index < 2000) {
      const ulContent = cleanText(firstUL[0]);
      const hasChapterWords = /(Chapitre|Introduction|Conclusion|Module|Partie)/i.test(ulContent);
      if (hasChapterWords) {
        cleaned = cleaned.replace(firstUL[0], "");
        console.log("🗑️ [AI-Cleanup] Sommaire sous forme de liste supprimé");
      }
    }
  }

  cleaned = cleaned
    .replace(/<p>\s*<\/p>/g, "")
    .replace(/<strong>\s*<\/strong>/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned;
}

// ============================================================================
// 📖 EXTRACTION INTELLIGENTE DU TITRE
// ============================================================================
function extractTitleIntelligently(html, analysis) {
  let titre = "";
  let candidates = [];

  // ✅ Vérifier si le premier <strong> apparaît AVANT le premier <h1>
  const firstStrongMatch = html.match(/<strong[^>]*>(.*?)<\/strong>/i);
  const firstH1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
  const firstStrongIdx = firstStrongMatch ? html.indexOf(firstStrongMatch[0]) : Infinity;
  const firstH1Idx = firstH1Match ? html.indexOf(firstH1Match[0]) : Infinity;

  if (firstStrongMatch && firstStrongIdx < firstH1Idx) {
    const candidate = cleanText(firstStrongMatch[0]);
    if (candidate.length >= 10 && candidate.length <= 150 &&
        !/^(AU PROGRAMME|SOMMAIRE|Introduction|Chapitre|TABLE)/i.test(candidate)) {
      candidates.push({ text: candidate, score: 110, source: "strong_before_h1" });
    }
  }

  if (analysis.hasH1) {
    const metaTitleRegex = /^(table des mati[eè]res|sommaire|index|plan|introduction|conclusion|bibliographie|annexe|remerciements|d[eé]dicace|préface|avant-propos)$/i;
    const chapterPrefixRegex = /^(chapitre|chapter|module|partie|section)\s*\d+$/i;
    const allH1Matches = [...html.matchAll(/<h1[^>]*>(.*?)<\/h1>/gi)];
    
    for (const h1Match of allH1Matches) {
      const candidate = cleanText(h1Match[1]);
      if (
        candidate.length >= 5 &&
        candidate.length <= 150 &&
        !metaTitleRegex.test(candidate.trim()) &&
        !chapterPrefixRegex.test(candidate.trim())
      ) {
        candidates.push({ text: candidate, score: 100, source: "h1" });
        break;
      }
    }
  }

  const strongMatches = html.match(/<strong[^>]*>(.*?)<\/strong>/gi) || [];
  for (let i = 0; i < Math.min(5, strongMatches.length); i++) {
    const candidate = cleanText(strongMatches[i]);
    if (candidate.length >= 10 && candidate.length <= 100) {
      const isUppercase = /^[A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ\s'-]+$/.test(candidate);
      const score = isUppercase ? 85 : 70;
      if (!/^(AU PROGRAMME|SOMMAIRE|Introduction|Chapitre|TABLE)/i.test(candidate)) {
        candidates.push({ text: candidate, score, source: "strong" });
      }
    }
  }

  const pMatches = html.match(/<p[^>]*>(.*?)<\/p>/gi) || [];
  for (let i = 0; i < Math.min(3, pMatches.length); i++) {
    const candidate = cleanText(pMatches[i]);
    if (candidate.length >= 10 && candidate.length <= 100) {
      const words = candidate.split(' ').length;
      if (words >= 2 && words <= 15) {
        candidates.push({ text: candidate, score: 60, source: "paragraph" });
      }
    }
  }

  if (candidates.length > 0) {
    candidates.sort((a, b) => b.score - a.score);
    titre = candidates[0].text;
    console.log(`✨ [AI-Title] Sélection: "${titre}" (${candidates[0].source}, score: ${candidates[0].score})`);
  } else {
    titre = "Document Word";
    console.log(`⚠️ [AI-Title] Aucun titre valide détecté, utilisation du défaut`);
  }

  return titre;
}

// ============================================================================
// 📚 EXTRACTION INTELLIGENTE DES CHAPITRES (MULTI-PASSES)
// ============================================================================
function extractChaptersIntelligently(html, analysis, titre) {
  console.log(`🎯 [AI-Chapters] Méthode: ${analysis.bestMethod} (${analysis.structureType})`);
  console.log(`🎯 [AI-Chapters] Confiance: ${analysis.confidence}%`);

  let chapters = [];

  // ✅ PASSE 1 : Méthode principale
  switch (analysis.bestMethod) {
    case "h1":       // ✅ NOUVEAU CAS
    case "h2":
      chapters = extractByHeadingAdvanced(html, analysis);
      break;
    
    case "uppercase_strong":
      chapters = extractByUppercaseStrongAdvanced(html, titre, analysis);
      break;
    
    case "numbered":
      chapters = extractByNumberedAdvanced(html, analysis);
      break;
    
    case "bullets":
      chapters = extractByBulletsAdvanced(html, analysis);
      break;
    
    case "all_strong":
      chapters = extractByAllStrongAdvanced(html, titre, analysis);
      break;
    
    case "paragraphs":
      chapters = extractByParagraphsAdvanced(html, analysis);
      break;
    
    default:
      chapters = extractByFallbackMethod(html);
  }

  console.log(`✅ [AI-Chapters-Pass1] Méthode principale: ${chapters.length} chapitres`);

  // ✅ PASSE 2 : Si trop peu de chapitres, essayer d'autres méthodes
  if (chapters.length < 3) {
    console.log("⚠️ [AI-Chapters-Pass2] Trop peu de chapitres, essai méthode secondaire...");
    
    const allMethods = [
      { name: "h1", fn: () => extractByHeadingAdvanced(html, { ...analysis, bestMethod: "h1", structureType: "h1_only" }) },
      { name: "h2", fn: () => extractByHeadingAdvanced(html, { ...analysis, bestMethod: "h2", structureType: "partial_hierarchy" }) },
      { name: "uppercase_strong", fn: () => extractByUppercaseStrongAdvanced(html, titre, analysis) },
      { name: "numbered", fn: () => extractByNumberedAdvanced(html, analysis) },
      { name: "all_strong", fn: () => extractByAllStrongAdvanced(html, titre, analysis) },
      { name: "bullets", fn: () => extractByBulletsAdvanced(html, analysis) }
    ];
    
    let bestAlternative = { chapters: [], count: 0, method: null };
    
    allMethods.forEach(method => {
      if (method.name === analysis.bestMethod) return;
      try {
        const result = method.fn();
        console.log(`  🔍 [Pass2] ${method.name}: ${result.length} chapitres`);
        if (result.length > bestAlternative.count && result.length >= 3) {
          bestAlternative = { chapters: result, count: result.length, method: method.name };
        }
      } catch (err) {
        console.log(`  ⚠️ [Pass2] ${method.name}: erreur`);
      }
    });
    
    if (bestAlternative.count > chapters.length) {
      console.log(`✅ [AI-Chapters-Pass2] Meilleure alternative: ${bestAlternative.method} (${bestAlternative.count} chapitres)`);
      chapters = bestAlternative.chapters;
    }
  }

  // ✅ PASSE 3 : Si encore trop peu, combiner plusieurs méthodes
  if (chapters.length < 5 && analysis.hasUppercaseChapters) {
    console.log("🔄 [AI-Chapters-Pass3] Combinaison de méthodes...");
    
    const uppercaseChapters = extractByUppercaseStrongAdvanced(html, titre, analysis);
    const strongChapters = extractByAllStrongAdvanced(html, titre, analysis);
    
    const combined = [...chapters];
    
    uppercaseChapters.forEach(ch => {
      if (!combined.find(c => c.title === ch.title)) combined.push(ch);
    });
    strongChapters.forEach(ch => {
      if (!combined.find(c => c.title === ch.title)) combined.push(ch);
    });
    
    if (combined.length > chapters.length) {
      console.log(`✅ [AI-Chapters-Pass3] Après combinaison: ${combined.length} chapitres`);
      chapters = combined;
    }
  }

  if (chapters.length === 0) {
    console.log("⚠️ [AI-Chapters] Aucune méthode n'a fonctionné, création chapitre unique");
    chapters = [{
      title: "Contenu complet",
      content: cleanHTMLToHTML(html)
    }];
  }

  console.log(`✅ [AI-Chapters-Final] ${chapters.length} chapitre(s) extrait(s)`);
  return chapters;
}

// ============================================================================
// 📚 MÉTHODE AVANCÉE : EXTRACTION PAR HEADING (H1 ou H2 selon stratégie)
// ============================================================================
function extractByHeadingAdvanced(html, analysis) {
  const chapters = [];

  const metaChapters = /^(table des mati[eè]res|sommaire|index|plan|introduction|conclusion|bibliographie|annexe|remerciements|d[eé]dicace|préface|avant-propos)$/i;
  const introRegex = /^(introduction|avant-propos|préface)$/i;
  const conclusionRegex = /^(conclusion|épilogue|mot de fin)$/i;
  const chapterPrefix = /^(chapitre|chapter|module|partie|section)\s*\d+$/i;

  const useH1 = analysis.bestMethod === "h1" || 
                analysis.structureType === "h1_over_generic_h2" || 
                analysis.structureType === "h1_only";

  const h1Matches = html.match(/<h1[^>]*>.*?<\/h1>/gi) || [];
  const h2Matches = html.match(/<h2[^>]*>.*?<\/h2>/gi) || [];

  let headingMatches, tag;

  if (useH1) {
    headingMatches = h1Matches.slice(1);
    tag = "h1";
    console.log(`🔍 [Heading-Advanced] Stratégie H1 (${headingMatches.length} candidats après skip titre)`);
  } else {
    headingMatches = h2Matches.length >= 2 ? h2Matches : h1Matches;
    tag = h2Matches.length >= 2 ? "h2" : "h1";
    console.log(`🔍 [Heading-Advanced] Stratégie ${tag.toUpperCase()} (${headingMatches.length} balises)`);
  }

  const allHeadings = headingMatches;
  const validHeadings = [];
  let introContent = "";
  let conclusionContent = "";
  
  for (let hi = 0; hi < allHeadings.length; hi++) {
    const h = allHeadings[hi];
    const title = cleanText(h);
    console.log(`  [${hi}] Heading: "${title}" | introTest: ${introRegex.test(title.trim())}`);
    if (introRegex.test(title.trim())) {
      const idx = html.indexOf(h);
      const nextH = allHeadings[hi + 1];
      const end = nextH ? html.indexOf(nextH) : html.length;
      introContent = cleanHTMLToHTML(html.substring(idx + h.length, end));
      console.log(`  ✅ Introduction extraite (${introContent.length} chars)`);
      continue;
    }
    if (conclusionRegex.test(title.trim())) {
      const idx = html.indexOf(h);
      conclusionContent = cleanHTMLToHTML(html.substring(idx + h.length, html.length));
      console.log(`  ✅ Conclusion extraite (${conclusionContent.length} chars)`);
      continue;
    }
    if (metaChapters.test(title.trim())) {
      console.log(`  ⏭️ Ignoré (méta): "${title}"`);
      continue;
    }
    if (useH1 && chapterPrefix.test(title.trim())) {
      console.log(`  ⏭️ Ignoré (générique): "${title}"`);
      continue;
    }
    validHeadings.push(h);
  }

  // Chercher intro/conclusion aussi dans h2
  const allH2 = html.match(/<h2[^>]*>.*?<\/h2>/gi) || [];
  for (const h of allH2) {
    const title = cleanText(h);
    if (introRegex.test(title.trim()) && !introContent) {
      const idx = html.indexOf(h);
      const nextH = allH2[allH2.indexOf(h) + 1] || allHeadings[0];
      const end = nextH ? html.indexOf(nextH) : html.length;
      introContent = cleanHTMLToHTML(html.substring(idx + h.length, end));
      console.log(`  ✅ Introduction extraite (h2) (${introContent.length} chars)`);
    }
    if (conclusionRegex.test(title.trim()) && !conclusionContent) {
      const idx = html.indexOf(h);
      conclusionContent = cleanHTMLToHTML(html.substring(idx + h.length, html.length));
      console.log(`  ✅ Conclusion extraite (h2) (${conclusionContent.length} chars)`);
    }
  }

  // Stocker intro/conclusion pour les récupérer après
  extractByHeadingAdvanced._intro = introContent;
  extractByHeadingAdvanced._conclusion = conclusionContent;

  console.log(`🔍 [Heading-Advanced] ${validHeadings.length} chapitres valides`);

  validHeadings.forEach((heading, index) => {
    let title = cleanText(heading);
    const headingIdx = html.indexOf(heading);
    let contentStart = headingIdx + heading.length;

    // En mode H2, si le titre est générique ("Chapitre X"), enrichir avec le H1 suivant
    if (!useH1 && chapterPrefix.test(title)) {
      const afterHeading = html.substring(contentStart, contentStart + 500);
      const nextH1Match = afterHeading.match(/<h1[^>]*>(.*?)<\/h1>/i);
      if (nextH1Match) {
        const h1Title = cleanText(nextH1Match[1]);
        if (!metaChapters.test(h1Title) && h1Title.length > 5) {
          title = title + " : " + h1Title;
          console.log(`  🔗 Titre fusionné: "${title}"`);
          contentStart += nextH1Match.index + nextH1Match[0].length;
        }
      }
    }

    const nextHeading = validHeadings[index + 1];
    const endIndex = nextHeading ? html.indexOf(nextHeading) : html.length;

    let chapterHTML = html.substring(contentStart, endIndex);

    // ✅ FIX : Supprimer les H2 génériques dans le contenu avant nettoyage
    chapterHTML = chapterHTML.replace(/<h2[^>]*>(?:chapitre|chapter|module|partie|section)\s*\d+<\/h2>/gi, '');

    const content = cleanHTMLToHTML(chapterHTML);

    const wordCount = content.split(' ').length;
    if (wordCount >= 30) {
      chapters.push({ title, content });
      console.log(`  ✅ "${title}" (${wordCount} mots)`);
    } else {
      console.log(`  ⏭️ Ignoré: "${title}" (${wordCount} mots - trop court)`);
    }
  });

  return chapters;
}

// Alias pour rétrocompatibilité avec les appels existants dans Pass2
function extractByH2Advanced(html, analysis) {
  return extractByHeadingAdvanced(html, analysis);
}

// ============================================================================
// 📚 MÉTHODE AVANCÉE : EXTRACTION PAR MAJUSCULES + GRAS (ADAPTATIF)
// ============================================================================
function extractByUppercaseStrongAdvanced(html, titre, analysis) {
  const chapters = [];
  
  console.log(`🔍 [Uppercase-Advanced] Début analyse avec ${analysis.uppercaseStrongs.length} candidats`);
  
  const useTOC = analysis.tocQuality && analysis.tocQuality.reliable;
  const tocEntries = useTOC ? (analysis.tableOfContents || []) : [];
  
  if (useTOC) {
    console.log(`📑 [Uppercase-Advanced] Utilisation du sommaire FIABLE (${tocEntries.length} entrées, score: ${analysis.tocQuality.score}%)`);
  } else {
    console.log(`📑 [Uppercase-Advanced] Sommaire ${analysis.tocQuality?.status || 'absent'} - Filtrage par ratio uniquement`);
  }
  
  const uppercaseStrongs = analysis.uppercaseStrongs
    .filter(s => {
      if (s.text === titre) { console.log(`  ⏭️ Ignoré (titre): "${s.text}"`); return false; }
      if (s.length < 5) { console.log(`  ⏭️ Ignoré (trop court): "${s.text}"`); return false; }
      if (s.ratio < 0.95) { console.log(`  ⏭️ Ignoré (ratio ${(s.ratio * 100).toFixed(0)}% < 95%): "${s.text}"`); return false; }
      
      if (useTOC) {
        const normalizedText = s.text.toLowerCase().trim();
        const isInTOC = tocEntries.some(entry => {
          const normalizedEntry = entry.toLowerCase().trim();
          return normalizedEntry.includes(normalizedText) || 
                 normalizedText.includes(normalizedEntry) ||
                 similarity(normalizedText, normalizedEntry) > 0.7;
        });
        if (!isInTOC) { console.log(`  ⏭️ Ignoré (absent du sommaire fiable): "${s.text}"`); return false; }
        else { console.log(`  ✅ Trouvé dans le sommaire: "${s.text}"`); }
      }
      
      if (!useTOC) {
        const metaKeywords = [
          /^AU PROGRAMME$/i, /^SOMMAIRE$/i, /^TABLE DES MATI[EÈ]RES$/i,
          /^INDEX$/i, /^PLAN$/i, /^FIN$/i, /^BIOGRAPHIE.*AUTEUR$/i,
          /^NOTE.*AUTEUR$/i, /^AVIS PERSONNEL$/i, /^LIENS.*SOCIAL/i,
          /^AVERTISSEMENT/i, /^RÉSUMÉ DES/i, /^SYNTHÈSE DES/i,
          /^REMERCIEMENTS$/i, /^DÉDICACE$/i
        ];
        if (metaKeywords.some(p => p.test(s.text))) { console.log(`  ⏭️ Ignoré (méta/conclusion): "${s.text}"`); return false; }
      }
      
      const excludePatterns = [
        /^(I+|V+|X+)\s*[\.:\-]/, /^\d+\s*[\.:\-]/, /^[A-Z]\s*[\.:\-]/,
        /^[a-z]\s*[\.\)]/i, /^\d+\.\d+/,
      ];
      if (excludePatterns.some(p => p.test(s.text))) { console.log(`  ⏭️ Ignoré (pattern sous-titre): "${s.text}"`); return false; }
      
      const cleanedText = s.text.replace(/^[\d\.\s\-:IVX]+/, '').trim();
      if (cleanedText.length < 5) { console.log(`  ⏭️ Ignoré (texte nettoyé trop court): "${s.text}"`); return false; }
      
      console.log(`  ✅ VALIDÉ: "${s.text}" (ratio: ${(s.ratio * 100).toFixed(0)}%)`);
      return true;
    })
    .map(s => s.text);
  
  console.log(`🔍 [Uppercase-Advanced] ${uppercaseStrongs.length} titres FINAUX validés`);

  uppercaseStrongs.forEach((titleText, index) => {
    const strongPattern = new RegExp(`<strong[^>]*>${escapeRegex(titleText)}</strong>`, 'i');
    const match = html.match(strongPattern);
    if (!match) { console.log(`  ⚠️ Pattern non trouvé dans HTML: "${titleText}"`); return; }

    const startIndex = html.indexOf(match[0]) + match[0].length;
    let endIndex = html.length;
    if (index < uppercaseStrongs.length - 1) {
      const nextPattern = new RegExp(`<strong[^>]*>${escapeRegex(uppercaseStrongs[index + 1])}</strong>`, 'i');
      const nextMatch = html.match(nextPattern);
      if (nextMatch) endIndex = html.indexOf(nextMatch[0]);
    }
    
    const chapterHTML = html.substring(startIndex, endIndex);
    const content = cleanHTMLToHTML(chapterHTML);
    const wordCount = content.split(' ').length;
    if (wordCount >= 50) {
      chapters.push({ title: titleText, content });
      console.log(`  ✅ Chapitre créé: "${titleText}" (${wordCount} mots)`);
    } else {
      console.log(`  ⏭️ Chapitre ignoré (contenu trop court): "${titleText}" (${wordCount} mots)`);
    }
  });

  console.log(`🔍 [Uppercase-Advanced] ${chapters.length} chapitres FINAUX extraits`);
  return chapters;
}

// ============================================================================
// 🔧 FONCTION SIMILARITÉ
// ============================================================================
function similarity(s1, s2) {
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  if (longer.length === 0) return 1.0;
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(s1, s2) {
  const costs = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) { costs[j] = j; }
      else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

// ============================================================================
// 📚 MÉTHODE AVANCÉE : EXTRACTION PAR NUMÉROTATION
// ============================================================================
function extractByNumberedAdvanced(html, analysis) {
  const chapters = [];
  const numberedRegex = /(Chapitre|CHAPITRE|Chapter|MODULE|Module|Partie|PARTIE)\s+(\d+|[IVX]+)[:\s\-]*(.*?)(?=<\/p>|<br>|<\/h)/gi;
  const matches = [...html.matchAll(numberedRegex)];
  console.log(`🔍 [Numbered-Advanced] ${matches.length} chapitres numérotés détectés`);

  matches.forEach((match, index) => {
    const titleSuffix = match[3] ? match[3].trim() : "";
    const title = titleSuffix ? `${match[1]} ${match[2]}: ${titleSuffix}` : `${match[1]} ${match[2]}`;
    const startIndex = match.index + match[0].length;
    const nextMatch = matches[index + 1];
    const endIndex = nextMatch ? nextMatch.index : html.length;
    const chapterHTML = html.substring(startIndex, endIndex);
    const content = cleanHTMLToHTML(chapterHTML);
    const wordCount = content.split(' ').length;
    if (wordCount >= 50) {
      chapters.push({ title, content });
      console.log(`  ✅ "${title}" (${wordCount} mots)`);
    }
  });

  return chapters;
}

// ============================================================================
// 📚 MÉTHODE AVANCÉE : EXTRACTION PAR BULLETS
// ============================================================================
function extractByBulletsAdvanced(html, analysis) {
  const chapters = [];
  const bulletRegex = /[•\*\-]\s*([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ][^\n<]{5,150})/g;
  const matches = [...html.matchAll(bulletRegex)];
  console.log(`🔍 [Bullets-Advanced] ${matches.length} bullets détectés`);

  matches.forEach((match, index) => {
    const title = match[1].trim();
    const startIndex = match.index + match[0].length;
    const nextMatch = matches[index + 1];
    const endIndex = nextMatch ? nextMatch.index : html.length;
    const chapterHTML = html.substring(startIndex, endIndex);
    const content = cleanHTMLToHTML(chapterHTML);
    const wordCount = content.split(' ').length;
    if (wordCount >= 50) {
      chapters.push({ title, content });
      console.log(`  ✅ "${title}" (${wordCount} mots)`);
    }
  });

  return chapters;
}

// ============================================================================
// 📚 MÉTHODE AVANCÉE : EXTRACTION PAR TOUS LES GRAS
// ============================================================================
function extractByAllStrongAdvanced(html, titre, analysis) {
  const chapters = [];
  const strongMatches = html.match(/<strong[^>]*>.*?<\/strong>/gi) || [];
  const validStrongs = strongMatches.filter(s => {
    const text = cleanText(s);
    return text.length >= 8 && text.length <= 200 && text !== titre;
  });
  console.log(`🔍 [AllStrong-Advanced] ${validStrongs.length} textes en gras validés`);

  validStrongs.forEach((strong, index) => {
    const title = cleanText(strong);
    const startIndex = html.indexOf(strong) + strong.length;
    const nextStrong = validStrongs[index + 1];
    const endIndex = nextStrong ? html.indexOf(nextStrong) : html.length;
    const chapterHTML = html.substring(startIndex, endIndex);
    const content = cleanHTMLToHTML(chapterHTML);
    const wordCount = content.split(' ').length;
    if (wordCount >= 50) {
      chapters.push({ title, content });
      console.log(`  ✅ "${title}" (${wordCount} mots)`);
    }
  });

  return chapters;
}

// ============================================================================
// 📚 MÉTHODE AVANCÉE : EXTRACTION PAR PARAGRAPHES
// ============================================================================
function extractByParagraphsAdvanced(html, analysis) {
  const chapters = [];
  const content = cleanHTMLToHTML(html);
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 100);
  console.log(`🔍 [Paragraphs-Advanced] ${paragraphs.length} paragraphes détectés`);

  let currentChapter = "";
  let chapterNum = 1;
  const targetWordsPerChapter = Math.max(300, Math.floor(analysis.estimatedWordCount / 5));
  
  paragraphs.forEach(p => {
    const currentWords = currentChapter.split(' ').length;
    const pWords = p.split(' ').length;
    if (currentWords + pWords > targetWordsPerChapter && currentWords > 200) {
      chapters.push({ title: `Section ${chapterNum}`, content: currentChapter.trim() });
      console.log(`  ✅ Section ${chapterNum} (${currentWords} mots)`);
      currentChapter = "";
      chapterNum++;
    }
    currentChapter += p + "\n\n";
  });
  
  if (currentChapter.trim().length > 200) {
    chapters.push({ title: `Section ${chapterNum}`, content: currentChapter.trim() });
    console.log(`  ✅ Section ${chapterNum} (${currentChapter.split(' ').length} mots)`);
  }

  return chapters;
}

// ============================================================================
// 📚 MÉTHODE DE SECOURS ULTIME
// ============================================================================
function extractByFallbackMethod(html) {
  console.log("🆘 [Fallback] Méthode de secours activée");
  const content = cleanHTMLToHTML(html);
  const words = content.split(' ').length;
  
  if (words < 500) {
    return [{ title: "Contenu complet", content }];
  }

  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 50);
  const targetSections = Math.min(5, Math.max(3, Math.floor(words / 500)));
  const parasPerSection = Math.ceil(paragraphs.length / targetSections);
  
  const chapters = [];
  for (let i = 0; i < targetSections; i++) {
    const start = i * parasPerSection;
    const end = Math.min((i + 1) * parasPerSection, paragraphs.length);
    const sectionContent = paragraphs.slice(start, end).join('\n\n');
    if (sectionContent.trim().length > 200) {
      chapters.push({ title: `Partie ${i + 1}`, content: sectionContent });
    }
  }

  return chapters;
}

// ============================================================================
// ✨ POST-TRAITEMENT INTELLIGENT
// ============================================================================
function postProcessChaptersIntelligently(chapters, analysis) {
  let processed = [...chapters];
  console.log(`🔧 [AI-PostProcess] Début: ${processed.length} chapitres`);

  processed = processed.filter((ch, index, self) =>
    index === self.findIndex(c => c.title === ch.title)
  );
  console.log(`🔧 [AI-PostProcess] Après doublons: ${processed.length}`);

  if (processed.length > 10) {
    const merged = [];
    let buffer = null;
    processed.forEach((ch, index) => {
      const wordCount = ch.content.split(' ').length;
      if (wordCount < 80 && buffer) {
        buffer.content += "\n\n" + ch.content;
        buffer.title = buffer.title + " & " + ch.title;
      } else if (wordCount < 80) {
        buffer = { ...ch };
      } else {
        if (buffer) { merged.push(buffer); buffer = null; }
        merged.push(ch);
      }
    });
    if (buffer) merged.push(buffer);
    processed = merged;
    console.log(`🔧 [AI-PostProcess] Après fusion: ${processed.length}`);
  }

  if (processed.length > 15) {
    console.log(`⚠️ [AI-PostProcess] ${processed.length} chapitres (trop!), application filtre strict`);
    processed = processed
      .map(ch => ({ ...ch, wordCount: ch.content.split(' ').length, isMajor: /^[A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ\s'-]+$/.test(ch.title) }))
      .filter(ch => ch.wordCount >= 100 || ch.isMajor)
      .map(({ wordCount, isMajor, ...ch }) => ch);
    console.log(`🔧 [AI-PostProcess] Après filtre: ${processed.length}`);
  }

  if (processed.length === 0) {
    console.log(`⚠️ [AI-PostProcess] Aucun chapitre valide, création par défaut`);
    processed = [{ title: "Contenu du document", content: "Contenu extrait" }];
  }

  console.log(`✅ [AI-PostProcess] Résultat final: ${processed.length} chapitres`);
  return processed;
}

// ============================================================================
// 📊 CALCUL DU SCORE DE QUALITÉ
// ============================================================================
function calculateQualityScore(chapters, analysis) {
  let score = 0;
  if (chapters.length >= 3 && chapters.length <= 10) score += 30;
  else if (chapters.length >= 2 && chapters.length <= 15) score += 20;
  else score += 10;

  score += Math.round(analysis.confidence * 0.4);

  const avgLength = chapters.reduce((sum, ch) => sum + ch.content.length, 0) / chapters.length;
  if (avgLength >= 500 && avgLength <= 5000) score += 20;
  else if (avgLength >= 200) score += 10;

  if (analysis.hasLists) score += 10;

  return Math.min(100, score);
}

// ============================================================================
// 🧹 NETTOYAGE HTML → HTML PROPRE (PRÉSERVE FORMATAGE)
// ============================================================================
function cleanHTMLToHTML(html) {
  if (!html) return "";
  
  let text = html
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/<\/p>/gi, "</p>\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/li>/gi, "</li>\n")
    .replace(/<ol>/gi, '\n<ol class="list-decimal pl-6">\n')
    .replace(/<\/ol>/gi, "\n</ol>\n\n")
    .replace(/<ul>/gi, '\n<ul class="list-disc pl-6">\n')
    .replace(/<\/ul>/gi, "\n</ul>\n\n")
    .replace(/<(\/?)strong>/gi, "<$1strong>")
    .replace(/<(\/?)em>/gi, "<$1em>")
    .replace(/<(\/?)u>/gi, "<$1u>")
    .replace(/<(\/?)b>/gi, "<$1strong>")
    .replace(/<(\/?)i>/gi, "<$1em>")
    .replace(/<(\/?)h([1-6])>/gi, "<$1h$2>")
    .replace(/<h[1-6]>/gi, "\n<h3>")
    .replace(/<\/h[1-6]>/gi, "</h3>\n\n")
    .replace(/<(?!\/?(?:ol|ul|li|strong|em|u|p|h3)\b)[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\n\s+\n/g, "\n\n")
    .replace(/<p>\s*<\/p>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  
  text = text.replace(
    /([.!?])\s+([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ]{5,}[A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ\s'-]*?)(?=\s+[A-Z]|\s*<|$)/g,
    '$1\n\n<h3>$2</h3>\n\n'
  );
  
  return text;
}

// ============================================================================
// 🧹 NETTOYAGE TEXTE SIMPLE
// ============================================================================
function cleanText(str) {
  return str
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

// ============================================================================
// 🔧 HELPER : ESCAPE REGEX
// ============================================================================
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}