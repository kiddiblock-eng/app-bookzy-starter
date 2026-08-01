// lib/imageKit.js
// Génération des visuels du kit ebook (couverture + affiche) via OpenRouter.
// Pipeline "prompt engine" : un LLM (Gemini Flash) nettoie le titre et écrit les
// prompts image, puis un modèle Nano Banana (Flash / Pro) génère les images.
import sharp from "sharp";
import { uploadBufferToCloudinary } from "./cloudinary";

const OR_BASE = "https://openrouter.ai/api/v1";

// Modèles (swappables) — voir https://openrouter.ai/collections/image-models
export const IMG_MODELS = {
  gpt: "openai/gpt-image-2",               // GPT Image 2 — meilleur pour le texte + les layouts (choix actuel)
  pro: "google/gemini-3-pro-image",        // Nano Banana Pro
  flash: "google/gemini-2.5-flash-image",  // Nano Banana (Flash)
};
const TEXT_MODEL = "google/gemini-2.5-flash"; // prompt engine (texte)

function orHeaders() {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY manquante");
  return {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    "HTTP-Referer": "https://bookzy.app",
    "X-Title": "Bookzy",
  };
}

/**
 * 1) Prompt engine : Gemini Flash nettoie le titre + écrit les prompts image.
 * Renvoie { displayTitle, subtitle, coverPrompt, affichePrompt }.
 */
export async function buildImageBrief({ titre, description = "", audience = "", langue = "français", auteur = "", template = "" }) {
  const sys = `Tu es DIRECTEUR ARTISTIQUE SENIOR spécialisé dans les COUVERTURES DE LIVRES et les AFFICHES MARKETING (niveau Behance / Canva Pro / top designer Fiverr).
On te donne les infos d'un ebook. Réponds UNIQUEMENT par un JSON valide (aucun texte autour) :
{
  "displayTitle": "titre COURT et percutant pour la couverture (2 à 5 mots MAX, sans guillemets ; raccourcis/reformule si le titre d'origine est long)",
  "subtitle": "sous-titre court (max 8 mots) ou chaine vide",
  "coverPrompt": "prompt image en ANGLAIS, très détaillé (160-230 mots)",
  "affichePrompt": "prompt image en ANGLAIS, très détaillé (160-230 mots)"
}

DIRECTION ARTISTIQUE OBLIGATOIRE (ne dévie pas) :

coverPrompt = une COUVERTURE DE LIVRE COMMERCIALE À FORT IMPACT présentée en MOCKUP 3D :
"A professional 3D hardcover book mockup standing upright on a clean surface, soft realistic studio shadow, front cover clearly visible. High-impact COMMERCIAL bestseller book cover (modern self-help / non-fiction style, the kind that grabs attention and sells). Features: the title '<displayTitle>' in VERY LARGE, HEAVY, BOLD, high-impact modern typography (thick punchy sans-serif, dominant, strong presence), perfectly legible and correctly spelled; <si subtitle: a short subtitle just below in smaller type.> NO author name and NO other text on the cover (title and subtitle only). A BOLD, striking illustration or graphic composition that FILLS the cover edge-to-edge (full bleed, minimal empty/cream space, no small framed box) and is directly related to the topic — NOT a generic stock photo, NOT a person's face. RICH, saturated, HIGH-CONTRAST color palette (confident and vibrant, not pastel or washed-out) inspired by the '<template>' theme. Punchy, eye-catching, powerful visual hierarchy, premium and award-winning, sharp clean rendering, Behance quality."

affichePrompt = une AFFICHE PROMOTIONNELLE (social media marketing flyer, portrait) pour VENDRE l'ebook :
"A professional social media marketing flyer (portrait poster) to promote and sell the ebook, agency-grade design. It MUST clearly and prominently display THREE texts: (1) the ebook TITLE '<displayTitle>' as the big bold headline at the top, (2) the author name '<auteur>' clearly visible, (3) a short call-to-action ('Disponible maintenant' or 'Télécharge maintenant'). Layout: the title headline at the top; the 3D book mockup of this same book showcased prominently in the center; 2-3 short punchy benefit bullet points; accent color blocks and a clean structured grid layout with generous spacing; color palette inspired by the '<template>' theme. Modern high-contrast graphic design poster, bold sans-serif typography, eye-catching, Canva Pro quality. This is a designed GRAPHIC POSTER, not a photograph."

RÈGLES STRICTES:
- Le SEUL texte visible sur la COUVERTURE = le titre + le sous-titre (AUCUN nom d'auteur, aucun autre texte). Sur l'AFFICHE = accroche + bénéfices + call-to-action. RIEN d'autre.
- TOUT le texte doit être en ${langue} UNIQUEMENT. Aucun mot en anglais, aucune langue mélangée, aucun mot parasite/aléatoire, pas de lorem ipsum, pas de charabia.
- Typographie nette, moderne, PARFAITEMENT orthographiée. Pas de watermark, pas de visage humain photoréaliste, pas de texte illisible. Titre court = clé de la lisibilité.`;
  const user = `Titre de l'ebook : "${titre}"
Description : ${description || "(aucune)"}
Audience : ${audience || "grand public"}
Auteur : ${auteur || "(non spécifié — n'affiche pas de ligne auteur)"}
Thème visuel (template) : ${template || "moderne"}`;

  const res = await fetch(`${OR_BASE}/chat/completions`, {
    method: "POST",
    headers: orHeaders(),
    body: JSON.stringify({
      model: TEXT_MODEL,
      messages: [
        { role: "system", content: sys },
        { role: "user", content: user },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) throw new Error(`OpenRouter chat ${res.status}: ${await res.text().catch(() => "")}`);

  const data = await res.json();
  const raw = data?.choices?.[0]?.message?.content || "{}";
  let brief = {};
  try {
    brief = JSON.parse(raw);
  } catch {
    const m = raw.match(/\{[\s\S]*\}/);
    try { brief = m ? JSON.parse(m[0]) : {}; } catch { brief = {}; }
  }

  const short = brief.displayTitle || String(titre).split(/\s+/).slice(0, 5).join(" ");
  return {
    displayTitle: short,
    subtitle: brief.subtitle || "",
    coverPrompt: brief.coverPrompt || `A professional 3D hardcover book mockup standing upright, soft studio shadow, minimal neutral background. Cover shows ONLY the title "${short}" in very large bold modern typography (no author name, no other text), a bold modern illustration filling the cover related to the topic, rich saturated high-contrast palette, premium commercial bestseller book cover design, Behance quality. All text in ${langue}.`,
    affichePrompt: brief.affichePrompt || `A professional social media marketing flyer (portrait) promoting the ebook "${short}": bold typographic headline, the 3D book mockup showcased, short benefit bullet points, a call-to-action banner, accent color blocks, clean structured layout, modern high-contrast graphic design poster, Canva Pro quality. Designed poster, not a photo. All text in ${langue}.`,
  };
}

/**
 * 2) Génère une image via OpenRouter → upload Cloudinary → renvoie l'URL.
 */
export async function generateOpenRouterImage(prompt, {
  model,
  resolution = "2K",
  aspectRatio = "3:4",
  quality = "high",
  references,
} = {}) {
  const payload = {
    model,
    prompt,
    resolution,
    aspect_ratio: aspectRatio,
    quality,
    output_format: "png",
  };
  // Images de référence (ex: la couverture réutilisée pour l'affiche → même livre).
  if (Array.isArray(references) && references.length) {
    payload.input_references = references.map((url) => ({ type: "image_url", image_url: { url } }));
  }
  // Retry réseau (fetch failed / 5xx / 429). Les 4xx (hors 429) sont définitifs → pas de retry.
  let data = null, lastErr = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(`${OR_BASE}/images`, { method: "POST", headers: orHeaders(), body: JSON.stringify(payload) });
      if (res.ok) { data = await res.json(); break; }
      const errText = await res.text().catch(() => "");
      if (res.status < 500 && res.status !== 429) throw new Error(`OpenRouter images ${res.status}: ${errText}`);
      lastErr = new Error(`OpenRouter images ${res.status}: ${errText}`);
    } catch (e) {
      if (/OpenRouter images 4\d\d/.test(String(e.message))) throw e; // 4xx définitif
      lastErr = e; // erreur réseau (fetch failed) → on réessaie
    }
    if (attempt < 3) await new Promise((r) => setTimeout(r, 1500 * attempt));
  }
  if (!data) throw lastErr || new Error("OpenRouter images: échec");

  if (data?.usage?.cost != null) console.log(`💵 [IMG] ${model}: $${Number(data.usage.cost).toFixed(4)}`);
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) throw new Error("OpenRouter: aucune image renvoyée");

  // Le PNG brut peut peser plusieurs Mo (> limite Cloudinary 10 Mo à haute résolution).
  // On convertit en JPEG haute qualité (haute résolution conservée) → ~2-5 Mo.
  const raw = Buffer.from(b64, "base64");
  const buffer = await sharp(raw)
    .resize({ width: 3840, height: 3840, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer();

  const upload = await uploadBufferToCloudinary(buffer, {
    folder: "bookzy/kit-images",
    resourceType: "image",
    extension: "jpg",
  });
  return upload.secure_url;
}
