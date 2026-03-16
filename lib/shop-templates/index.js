// lib/shop-templates/index.js

import CleanTemplate from "./CleanTemplate";
import StoneTemplate from "./StoneTemplate";
import GradientTemplate from "./GradientTemplate";
import WarmTemplate from "./WarmTemplate";
import NeonTemplate from "./NeonTemplate";
import MinimalTemplate from "./MinimalTemplate";
import BrutalistTemplate from "./BrutalistTemplate";
import GlassTemplate from "./GlassTemplate";
import LoveTemplate from "./LoveTemplate";
import ElegantTemplate from "./ElegantTemplate";
import PlayfulTemplate from "./PlayfulTemplate";
import NatureTemplate from "./NatureTemplate";
import MidnightTemplate from "./MidnightTemplate";

export const templates = {
  // === CLASSIQUES ===
  clean: {
    id: "clean",
    name: "Clean",
    description: "Minimaliste et élégant",
    category: "classic",
    component: CleanTemplate,
    colors: {
      background: "#ffffff",
      text: "#111827",
      accent: "#6366f1",
    },
  },
  stone: {
    id: "stone",
    name: "Stone",
    description: "Sombre et premium",
    category: "classic",
    component: StoneTemplate,
    colors: {
      background: "#111827",
      text: "#ffffff",
      accent: "#6366f1",
    },
  },
  gradient: {
    id: "gradient",
    name: "Gradient",
    description: "Moderne et vibrant",
    category: "classic",
    component: GradientTemplate,
    colors: {
      background: "#7c3aed",
      text: "#ffffff",
      accent: "#a78bfa",
    },
  },
  warm: {
    id: "warm",
    name: "Warm",
    description: "Chaleureux et accueillant",
    category: "classic",
    component: WarmTemplate,
    colors: {
      background: "#fffbeb",
      text: "#78350f",
      accent: "#f59e0b",
    },
  },
  // === MODERNES ===
  neon: {
    id: "neon",
    name: "Neon",
    description: "Cyberpunk avec effets néon",
    category: "modern",
    isNew: true,
    component: NeonTemplate,
    colors: {
      background: "#000000",
      text: "#ffffff",
      accent: "#d946ef",
    },
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    description: "Ultra épuré et élégant",
    category: "modern",
    isNew: true,
    component: MinimalTemplate,
    colors: {
      background: "#fafafa",
      text: "#171717",
      accent: "#171717",
    },
  },
  brutalist: {
    id: "brutalist",
    name: "Brutalist",
    description: "Audacieux et impactant",
    category: "modern",
    isNew: true,
    component: BrutalistTemplate,
    colors: {
      background: "#fde047",
      text: "#000000",
      accent: "#000000",
    },
  },
  glass: {
    id: "glass",
    name: "Glass",
    description: "Glassmorphism moderne",
    category: "modern",
    isNew: true,
    component: GlassTemplate,
    colors: {
      background: "#1e1b4b",
      text: "#ffffff",
      accent: "#a855f7",
    },
  },
  // === PREMIUM (avec cover hero) ===
  love: {
    id: "love",
    name: "Love",
    description: "Romantique et doux",
    category: "premium",
    isNew: true,
    hasCover: true,
    component: LoveTemplate,
    colors: {
      background: "#fdf2f8",
      text: "#9f1239",
      accent: "#f43f5e",
    },
  },
  elegant: {
    id: "elegant",
    name: "Elegant",
    description: "Luxe et raffiné",
    category: "premium",
    isNew: true,
    hasCover: true,
    component: ElegantTemplate,
    colors: {
      background: "#f5f5f4",
      text: "#292524",
      accent: "#d97706",
    },
  },
  playful: {
    id: "playful",
    name: "Playful",
    description: "Fun et coloré",
    category: "premium",
    isNew: true,
    hasCover: true,
    component: PlayfulTemplate,
    colors: {
      background: "#ede9fe",
      text: "#1f2937",
      accent: "#8b5cf6",
    },
  },
  nature: {
    id: "nature",
    name: "Nature",
    description: "Bio et organique",
    category: "premium",
    isNew: true,
    hasCover: true,
    component: NatureTemplate,
    colors: {
      background: "#ecfdf5",
      text: "#14532d",
      accent: "#10b981",
    },
  },
  midnight: {
    id: "midnight",
    name: "Midnight",
    description: "Mystique et étoilé",
    category: "premium",
    isNew: true,
    hasCover: true,
    component: MidnightTemplate,
    colors: {
      background: "#0f172a",
      text: "#ffffff",
      accent: "#6366f1",
    },
  },
};

export const templateList = Object.values(templates);

export const classicTemplates = templateList.filter(t => t.category === "classic");
export const modernTemplates = templateList.filter(t => t.category === "modern");
export const premiumTemplates = templateList.filter(t => t.category === "premium");

export function getTemplate(templateId) {
  return templates[templateId] || templates.clean;
}

export function getTemplateComponent(templateId) {
  const template = getTemplate(templateId);
  return template.component;
}

export { 
  CleanTemplate, 
  StoneTemplate, 
  GradientTemplate, 
  WarmTemplate,
  NeonTemplate,
  MinimalTemplate,
  BrutalistTemplate,
  GlassTemplate,
  LoveTemplate,
  ElegantTemplate,
  PlayfulTemplate,
  NatureTemplate,
  MidnightTemplate
};