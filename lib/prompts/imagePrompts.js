// lib/prompts/imagePrompts.js

export function getCoverPrompt({ title, description, style = 'modern' }) {
  const styleDescriptions = {
    modern: 'minimaliste et contemporain, lignes propres, esthétique épurée',
    luxe: 'premium, élégant, accents dorés, style sophistiqué',
    educatif: 'professionnel, sérieux, structuré, fiable',
    energie: 'dynamique, vibrant, couleurs fortes et énergiques',
    minimal: 'ultra minimaliste, monochrome, géométrie simple',
    creative: 'artistique, coloré, imaginatif, visuel unique'
  };

  const styleDesc = styleDescriptions[style] || styleDescriptions.modern;

  return `Photorealistic 3D ebook cover mockup for a French digital guide titled "${title}".

STYLE DESCRIPTION:
${styleDesc}

TOPIC:
${description || 'Practical guide with real, actionable value'}

COMPOSITION REQUIREMENTS:
3D book or box rendered standing upright.
Slight angle for depth and realism.
Clean white background or soft gradient.
Soft professional studio lighting and natural shadows.
High-end premium product photography look.
Focus entirely on the ebook product.

STRICT RULES:
No text directly printed on the book (clean surface only).
No author name.
No logos.
No labels.
No baked-in title.
Design must be modern, premium, appealing for African francophone audiences.

TECHNICAL REQUIREMENTS:
Photorealistic rendering.
High contrast and sharp details.
Professional color grading.
Commercial advertising quality.`;
}

export function getAdPosterPrompt({ title, description, format = 'vertical' }) {
  const dimensions =
    format === 'vertical'
      ? 'vertical mobile format 9:16'
      : 'square format 1:1 for social media';

  return `Promotional poster in ${dimensions} for a French ebook titled "${title}".

THEME:
${description || 'Professional guide with strong practical impact'}

TARGET AUDIENCE:
African francophone market (Benin, Ivory Coast, Cameroon, Senegal, Togo, Gabon)

DESIGN REQUIREMENTS:
Bold and eye-catching.
Modern, clean and premium aesthetic.
Mobile optimized for Facebook and Instagram advertising.
High readability at small sizes.
Strong visual hierarchy.
Aspirational, motivational and professional mood.

VISUAL ELEMENTS:
Dynamic layout.
Premium color palette.
Symbolic visuals representing the ebook topic.
Energetic composition without clutter.

STRICT RULES:
No text in the image.
No phone numbers.
No prices.
No screenshots.
No visible faces unless absolutely necessary.
No skin tones specified unless required by the concept.
Focus on emotional impact and commercial appeal.

TECHNICAL REQUIREMENTS:
High resolution.
Clean exposure.
Balanced colors.
Clear and professional finish.
Optimized for paid advertising campaigns.`;
}

export function getSquareAdPrompt({ title, description }) {
  return getAdPosterPrompt({ title, description, format: 'square' });
}

export function optimizeImagePrompt(basePrompt) {
  return `${basePrompt}

TECHNICAL ENHANCEMENT:
Ultra high quality.
Commercial-grade photography.
Sharp, clean, high contrast.
Perfect lighting.
Publication-ready for marketing and paid campaigns.`;
}