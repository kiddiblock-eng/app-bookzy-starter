// lib/seoCountries.js — dimension PAYS pour le SEO programmatique (gratuit, sans API)
import { slugify } from "@/lib/seoTopics";

// prep = préposition ("en Côte d'Ivoire", "au Sénégal"), mm = moyens de paiement réels par pays
const RAW = [
  { nom: "Côte d'Ivoire", prep: "en", mm: ["Orange Money", "MTN MoMo", "Moov Money", "Wave"], zone: "afrique", note: "un des marchés digitaux les plus dynamiques d'Afrique de l'Ouest" },
  { nom: "Sénégal", prep: "au", mm: ["Orange Money", "Wave", "Free Money"], zone: "afrique", note: "où la vente en ligne via WhatsApp explose" },
  { nom: "Cameroun", prep: "au", mm: ["Orange Money", "MTN MoMo"], zone: "afrique", note: "un grand marché bilingue à fort potentiel" },
  { nom: "Mali", prep: "au", mm: ["Orange Money", "Moov Money"], zone: "afrique", note: "où le mobile money est devenu la norme" },
  { nom: "Bénin", prep: "au", mm: ["MTN MoMo", "Moov Money", "Celtiis Cash"], zone: "afrique", note: "un marché en pleine digitalisation" },
  { nom: "Togo", prep: "au", mm: ["T-Money", "Flooz"], zone: "afrique", note: "où l'entrepreneuriat digital se développe vite" },
  { nom: "Burkina Faso", prep: "au", mm: ["Orange Money", "Moov Money"], zone: "afrique", note: "avec une jeunesse très connectée" },
  { nom: "Niger", prep: "au", mm: ["Airtel Money", "Moov Money"], zone: "afrique", note: "un marché émergent du digital" },
  { nom: "Guinée", prep: "en", mm: ["Orange Money", "MTN MoMo"], zone: "afrique", note: "où le paiement mobile gagne du terrain" },
  { nom: "RD Congo", prep: "en", mm: ["M-Pesa", "Orange Money", "Airtel Money"], zone: "afrique", note: "l'un des plus grands marchés francophones du continent" },
  { nom: "Congo", prep: "au", mm: ["MTN MoMo", "Airtel Money"], zone: "afrique", note: "un marché digital en croissance" },
  { nom: "Gabon", prep: "au", mm: ["Airtel Money", "Moov Money"], zone: "afrique", note: "avec un bon pouvoir d'achat urbain" },
  { nom: "Madagascar", prep: "à", mm: ["MVola", "Orange Money", "Airtel Money"], zone: "afrique", note: "où le mobile money est très répandu" },
  { nom: "France", prep: "en", mm: ["carte bancaire", "PayPal", "virement"], zone: "diaspora", note: "auprès de la diaspora francophone" },
  { nom: "Belgique", prep: "en", mm: ["carte bancaire", "PayPal", "Bancontact"], zone: "diaspora", note: "auprès de la communauté francophone" },
  { nom: "Canada", prep: "au", mm: ["carte bancaire", "Interac", "PayPal"], zone: "diaspora", note: "auprès de la diaspora africaine" },
];

export const COUNTRIES = RAW.map((c) => ({ ...c, slug: slugify(c.nom) }));

const _bySlug = new Map(COUNTRIES.map((c) => [c.slug, c]));
export function getCountry(slug) {
  return _bySlug.get(slug) || null;
}
