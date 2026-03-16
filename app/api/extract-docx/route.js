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

    return NextResponse.json({
      success: true,
      titre,
      chapters,
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
  
  // ✅ PATTERN 1 : Détecter une liste (UL/OL) après "SOMMAIRE", "AU PROGRAMME", etc.
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
        // Nettoyer les numéros de page et autres artefacts
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
  
  // ✅ PATTERN 2 : Détecter des lignes avec points de suite (.......)
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
  
  // ✅ CRITÈRE 1 : Nombre d'entrées (30 points max)
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
  
  // ✅ CRITÈRE 2 : Correspondance avec les textes en MAJUSCULES (40 points max)
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
  
  // ✅ CRITÈRE 3 : Cohérence des entrées (30 points max)
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
  
  // ✅ DÉTERMINATION DU STATUT
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
    // Compteurs de base
    h1Count: (html.match(/<h1[^>]*>/gi) || []).length,
    h2Count: (html.match(/<h2[^>]*>/gi) || []).length,
    h3Count: (html.match(/<h3[^>]*>/gi) || []).length,
    strongCount: (html.match(/<strong[^>]*>/gi) || []).length,
    pCount: (html.match(/<p[^>]*>/gi) || []).length,
    
    // Listes
    olCount: (html.match(/<ol[^>]*>/gi) || []).length,
    ulCount: (html.match(/<ul[^>]*>/gi) || []).length,
    liCount: (html.match(/<li[^>]*>/gi) || []).length,
    
    // Patterns avancés
    uppercaseStrongs: [],
    bulletPatterns: [],
    numberedPatterns: [],
    tableOfContents: [],
    tocQuality: null,
    
    // Indicateurs de structure
    hasH1: false,
    hasH2: false,
    hasH3: false,
    hasTableOfContents: false,
    hasBulletChapters: false,
    hasUppercaseChapters: false,
    hasNumberedChapters: false,
    hasLists: false,
    
    // Métadonnées
    estimatedWordCount: 0,
    averageParagraphLength: 0,
    structureType: null,
    bestMethod: null,
    confidence: 0,
    titleConfidence: 0
  };

  // ✅ ANALYSE DES PATTERNS DE MAJUSCULES (RATIO STRICT + DEBUG)
  const strongMatches = html.match(/<strong[^>]*>(.*?)<\/strong>/gi) || [];
  console.log(`🔍 [Analyze] ${strongMatches.length} balises <strong> détectées au total`);

  strongMatches.forEach((strong, index) => {
    const text = cleanText(strong);
    const letters = text.match(/[a-zA-ZÀ-ÿ]/g) || [];
    if (letters.length === 0) return;
    
    const uppercaseLetters = text.match(/[A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ]/g) || [];
    const uppercaseRatio = uppercaseLetters.length / letters.length;
    
    // ✅ DEBUG : Afficher les 30 premiers
    if (index < 30) {
      console.log(`  [${index + 1}] "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}" - Ratio: ${(uppercaseRatio * 100).toFixed(0)}% (${uppercaseLetters.length}/${letters.length})`);
    }
    
    // ✅ RATIO ULTRA-STRICT >= 0.95 (95% de majuscules minimum)
    if (uppercaseRatio >= 0.95 && text.length >= 5 && text.length <= 200) {
      analysis.uppercaseStrongs.push({
        text,
        ratio: uppercaseRatio,
        length: text.length
      });
      if (index < 30) {
        console.log(`    ✅ VALIDÉ comme chapitre potentiel (ratio ${(uppercaseRatio * 100).toFixed(0)}%)`);
      }
    }
  });

  console.log(`🔍 [Analyze] ${analysis.uppercaseStrongs.length} textes en MAJUSCULES pures détectés (ratio ≥ 95%)`);

  // ✅ ANALYSE DES BULLETS
  const bulletRegex = /[•\*\-]\s*([A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ][^\n<]{5,100})/g;
  const bulletMatches = [...html.matchAll(bulletRegex)];
  analysis.bulletPatterns = bulletMatches.map(m => m[1].trim());

  // ✅ ANALYSE DES CHAPITRES NUMÉROTÉS
  const numberedRegex = /(Chapitre|CHAPITRE|Chapter|MODULE|Module|Partie|PARTIE)\s+(\d+|[IVX]+)/gi;
  const numberedMatches = [...html.matchAll(numberedRegex)];
  analysis.numberedPatterns = numberedMatches.map(m => m[0]);

  // ✅ DÉTECTION TABLE DES MATIÈRES
  const tocPatterns = [
    /AU PROGRAMME/i,
    /SOMMAIRE/i,
    /TABLE DES MATI[EÈ]RES/i,
    /PLAN\s+(DU\s+)?DOCUMENT/i,
    /INDEX/i
  ];
  analysis.hasTableOfContents = tocPatterns.some(p => p.test(html));

  // ✅ MISE À JOUR DES INDICATEURS
  analysis.hasH1 = analysis.h1Count > 0;
  analysis.hasH2 = analysis.h2Count >= 2;
  analysis.hasH3 = analysis.h3Count >= 2;
  analysis.hasUppercaseChapters = analysis.uppercaseStrongs.length >= 3;
  analysis.hasBulletChapters = analysis.bulletPatterns.length >= 3;
  analysis.hasNumberedChapters = analysis.numberedPatterns.length >= 2;
  analysis.hasLists = analysis.olCount > 0 || analysis.ulCount > 0;

  // ✅ CALCUL DU NOMBRE DE MOTS
  const textContent = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  analysis.estimatedWordCount = textContent.split(' ').length;

  // ✅ LONGUEUR MOYENNE DES PARAGRAPHES
  const pMatches = html.match(/<p[^>]*>.*?<\/p>/gi) || [];
  if (pMatches.length > 0) {
    const totalLength = pMatches.reduce((sum, p) => sum + cleanText(p).length, 0);
    analysis.averageParagraphLength = Math.round(totalLength / pMatches.length);
  }

  // ✅ DÉTERMINATION INTELLIGENTE DE LA STRUCTURE
  if (analysis.h2Count >= 3 && analysis.h1Count >= 1) {
    analysis.structureType = "hierarchical_perfect";
    analysis.bestMethod = "h2";
    analysis.confidence = 98;
    analysis.titleConfidence = 95;
  } else if (analysis.hasUppercaseChapters && analysis.strongCount >= 5) {
    analysis.structureType = "uppercase_strong_chapters";
    analysis.bestMethod = "uppercase_strong";
    analysis.confidence = 92;
    analysis.titleConfidence = 85;
  } else if (analysis.hasNumberedChapters && analysis.numberedPatterns.length >= 3) {
    analysis.structureType = "numbered_chapters";
    analysis.bestMethod = "numbered";
    analysis.confidence = 88;
    analysis.titleConfidence = 80;
  } else if (analysis.h2Count >= 2) {
    analysis.structureType = "partial_hierarchy";
    analysis.bestMethod = "h2";
    analysis.confidence = 85;
    analysis.titleConfidence = 75;
  } else if (analysis.hasBulletChapters) {
    analysis.structureType = "bullet_structure";
    analysis.bestMethod = "bullets";
    analysis.confidence = 75;
    analysis.titleConfidence = 70;
  } else if (analysis.strongCount >= 5) {
    analysis.structureType = "bold_sections";
    analysis.bestMethod = "all_strong";
    analysis.confidence = 65;
    analysis.titleConfidence = 60;
  } else if (analysis.pCount > 10) {
    analysis.structureType = "paragraph_based";
    analysis.bestMethod = "paragraphs";
    analysis.confidence = 50;
    analysis.titleConfidence = 45;
  } else {
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

  // ✅ SUPPRESSION INTELLIGENTE DU SOMMAIRE
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

  if (analysis.hasH1) {
    const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
    if (h1Match) {
      const candidate = cleanText(h1Match[1]);
      if (candidate.length >= 5 && candidate.length <= 150) {
        candidates.push({ text: candidate, score: 100, source: "h1" });
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
    case "h2":
      chapters = extractByH2Advanced(html, analysis);
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
      { name: "h2", fn: () => extractByH2Advanced(html, analysis) },
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
      if (!combined.find(c => c.title === ch.title)) {
        combined.push(ch);
      }
    });
    
    strongChapters.forEach(ch => {
      if (!combined.find(c => c.title === ch.title)) {
        combined.push(ch);
      }
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
// 📚 MÉTHODE AVANCÉE : EXTRACTION PAR H2
// ============================================================================
function extractByH2Advanced(html, analysis) {
  const chapters = [];
  const h2Matches = html.match(/<h2[^>]*>.*?<\/h2>/gi) || [];
  
  console.log(`🔍 [H2-Advanced] ${h2Matches.length} balises H2 détectées`);

  h2Matches.forEach((h2, index) => {
    const title = cleanText(h2);
    
    const startIndex = html.indexOf(h2) + h2.length;
    const nextH2 = h2Matches[index + 1];
    const endIndex = nextH2 ? html.indexOf(nextH2) : html.length;
    
    const chapterHTML = html.substring(startIndex, endIndex);
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

// ============================================================================
// 📚 MÉTHODE AVANCÉE : EXTRACTION PAR MAJUSCULES + GRAS (ADAPTATIF)
// ============================================================================
function extractByUppercaseStrongAdvanced(html, titre, analysis) {
  const chapters = [];
  
  console.log(`🔍 [Uppercase-Advanced] Début analyse avec ${analysis.uppercaseStrongs.length} candidats`);
  
  // ✅ DÉCISION INTELLIGENTE : Utiliser le sommaire si fiable
  const useTOC = analysis.tocQuality && analysis.tocQuality.reliable;
  const tocEntries = useTOC ? (analysis.tableOfContents || []) : [];
  
  if (useTOC) {
    console.log(`📑 [Uppercase-Advanced] Utilisation du sommaire FIABLE (${tocEntries.length} entrées, score: ${analysis.tocQuality.score}%)`);
  } else {
    console.log(`📑 [Uppercase-Advanced] Sommaire ${analysis.tocQuality?.status || 'absent'} - Filtrage par ratio uniquement`);
  }
  
  // ✅ FILTRE ULTRA-STRICT
  const uppercaseStrongs = analysis.uppercaseStrongs
    .filter(s => {
      // Exclure le titre
      if (s.text === titre) {
        console.log(`  ⏭️ Ignoré (titre): "${s.text}"`);
        return false;
      }
      
      // Longueur minimale
      if (s.length < 5) {
        console.log(`  ⏭️ Ignoré (trop court): "${s.text}"`);
        return false;
      }
      
      // ✅ RATIO ULTRA-STRICT >= 0.95
      if (s.ratio < 0.95) {
        console.log(`  ⏭️ Ignoré (ratio ${(s.ratio * 100).toFixed(0)}% < 95%): "${s.text}"`);
        return false;
      }
      
      // ✅ SI SOMMAIRE FIABLE : Vérifier correspondance
      if (useTOC) {
        const normalizedText = s.text.toLowerCase().trim();
        const isInTOC = tocEntries.some(entry => {
          const normalizedEntry = entry.toLowerCase().trim();
          return normalizedEntry.includes(normalizedText) || 
                 normalizedText.includes(normalizedEntry) ||
                 similarity(normalizedText, normalizedEntry) > 0.7;
        });
        
        if (!isInTOC) {
          console.log(`  ⏭️ Ignoré (absent du sommaire fiable): "${s.text}"`);
          return false;
        } else {
          console.log(`  ✅ Trouvé dans le sommaire: "${s.text}"`);
        }
      }
      
      // ✅ SINON : Filtrer les mots-clés méta/conclusion
      if (!useTOC) {
        const metaKeywords = [
          /^AU PROGRAMME$/i,
          /^SOMMAIRE$/i,
          /^TABLE DES MATI[EÈ]RES$/i,
          /^INDEX$/i,
          /^PLAN$/i,
          /^FIN$/i,
          /^BIOGRAPHIE.*AUTEUR$/i,
          /^NOTE.*AUTEUR$/i,
          /^AVIS PERSONNEL$/i,
          /^LIENS.*SOCIAL/i,
          /^AVERTISSEMENT/i,
          /^RÉSUMÉ DES/i,
          /^SYNTHÈSE DES/i,
          /^REMERCIEMENTS$/i,
          /^DÉDICACE$/i
        ];
        
        if (metaKeywords.some(p => p.test(s.text))) {
          console.log(`  ⏭️ Ignoré (méta/conclusion): "${s.text}"`);
          return false;
        }
      }
      
      // ✅ EXCLURE LES PATTERNS DE SOUS-TITRES
      const excludePatterns = [
        /^(I+|V+|X+)\s*[\.:\-]/,
        /^\d+\s*[\.:\-]/,
        /^[A-Z]\s*[\.:\-]/,
        /^[a-z]\s*[\.\)]/i,
        /^\d+\.\d+/,
      ];
      
      if (excludePatterns.some(p => p.test(s.text))) {
        console.log(`  ⏭️ Ignoré (pattern sous-titre): "${s.text}"`);
        return false;
      }
      
      // ✅ EXCLURE SI TROP COURT APRÈS NETTOYAGE
      const cleanedText = s.text.replace(/^[\d\.\s\-:IVX]+/, '').trim();
      if (cleanedText.length < 5) {
        console.log(`  ⏭️ Ignoré (texte nettoyé trop court): "${s.text}"`);
        return false;
      }
      
      console.log(`  ✅ VALIDÉ: "${s.text}" (ratio: ${(s.ratio * 100).toFixed(0)}%)`);
      return true;
    })
    .map(s => s.text);
  
  console.log(`🔍 [Uppercase-Advanced] ${uppercaseStrongs.length} titres FINAUX validés`);

  uppercaseStrongs.forEach((titleText, index) => {
    const strongPattern = new RegExp(`<strong[^>]*>${escapeRegex(titleText)}</strong>`, 'i');
    const match = html.match(strongPattern);
    
    if (!match) {
      console.log(`  ⚠️ Pattern non trouvé dans HTML: "${titleText}"`);
      return;
    }

    const startIndex = html.indexOf(match[0]) + match[0].length;
    
    let endIndex = html.length;
    if (index < uppercaseStrongs.length - 1) {
      const nextPattern = new RegExp(`<strong[^>]*>${escapeRegex(uppercaseStrongs[index + 1])}</strong>`, 'i');
      const nextMatch = html.match(nextPattern);
      if (nextMatch) {
        endIndex = html.indexOf(nextMatch[0]);
      }
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
// 🔧 FONCTION SIMILARITÉ (POUR COMPARAISON SOMMAIRE)
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
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
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
    const title = titleSuffix 
      ? `${match[1]} ${match[2]}: ${titleSuffix}`
      : `${match[1]} ${match[2]}`;
    
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
      chapters.push({
        title: `Section ${chapterNum}`,
        content: currentChapter.trim()
      });
      console.log(`  ✅ Section ${chapterNum} (${currentWords} mots)`);
      currentChapter = "";
      chapterNum++;
    }
    currentChapter += p + "\n\n";
  });
  
  if (currentChapter.trim().length > 200) {
    chapters.push({
      title: `Section ${chapterNum}`,
      content: currentChapter.trim()
    });
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
    return [{
      title: "Contenu complet",
      content
    }];
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
      chapters.push({
        title: `Partie ${i + 1}`,
        content: sectionContent
      });
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

  // ✅ ÉTAPE 1 : Suppression des doublons
  processed = processed.filter((ch, index, self) =>
    index === self.findIndex(c => c.title === ch.title)
  );
  console.log(`🔧 [AI-PostProcess] Après doublons: ${processed.length}`);

  // ✅ ÉTAPE 2 : Fusion des chapitres trop courts
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
        if (buffer) {
          merged.push(buffer);
          buffer = null;
        }
        merged.push(ch);
      }
    });
    
    if (buffer) merged.push(buffer);
    
    processed = merged;
    console.log(`🔧 [AI-PostProcess] Après fusion: ${processed.length}`);
  }

  // ✅ ÉTAPE 3 : Limitation intelligente si trop de chapitres
  if (processed.length > 15) {
    console.log(`⚠️ [AI-PostProcess] ${processed.length} chapitres (trop!), application filtre strict`);
    
    processed = processed
      .map(ch => ({
        ...ch,
        wordCount: ch.content.split(' ').length,
        isMajor: /^[A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ\s'-]+$/.test(ch.title)
      }))
      .filter(ch => ch.wordCount >= 100 || ch.isMajor)
      .map(({ wordCount, isMajor, ...ch }) => ch);
    
    console.log(`🔧 [AI-PostProcess] Après filtre: ${processed.length}`);
  }

  // ✅ ÉTAPE 4 : Validation finale
  if (processed.length === 0) {
    console.log(`⚠️ [AI-PostProcess] Aucun chapitre valide, création par défaut`);
    processed = [{
      title: "Contenu du document",
      content: "Contenu extrait"
    }];
  }

  console.log(`✅ [AI-PostProcess] Résultat final: ${processed.length} chapitres`);
  
  return processed;
}

// ============================================================================
// 📊 CALCUL DU SCORE DE QUALITÉ
// ============================================================================
function calculateQualityScore(chapters, analysis) {
  let score = 0;

  if (chapters.length >= 3 && chapters.length <= 10) {
    score += 30;
  } else if (chapters.length >= 2 && chapters.length <= 15) {
    score += 20;
  } else {
    score += 10;
  }

  score += Math.round(analysis.confidence * 0.4);

  const avgLength = chapters.reduce((sum, ch) => sum + ch.content.length, 0) / chapters.length;
  if (avgLength >= 500 && avgLength <= 5000) {
    score += 20;
  } else if (avgLength >= 200) {
    score += 10;
  }

  if (analysis.hasLists) {
    score += 10;
  }

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