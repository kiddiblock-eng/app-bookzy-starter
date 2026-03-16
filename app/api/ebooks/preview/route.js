// app/api/ebooks/preview/route.js
// Proxy PDF — affiche sans permettre le téléchargement direct
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

// Liste blanche des IDs d'ebooks autorisés à être prévisualisés
const ALLOWED_EBOOKS = [
  "maitriser-whatsapp-business-69b0b393370bdef7d6198af1",
  "lart-de-loratoire-parler-en-public-avec-charisme-et-assurance-69b47016391523fc07",
  "le-business-des-jus-naturels-packaging-bissap-gingembre-69b0cee8370bdef7d6199168",
  "trouver-sa-vocation-le-plan-divin-pour-votre-vie-69b0ccd7370bdef7d61990b1",
  "reussir-sa-relation-a-distance-69b0b254370bdef7d6198a45",
  "immo-pays-construire-sa-villa-sans-risques-69b0c93c370bdef7d6198fad",
  "musculation-a-la-maison-le-programme-complet-sans-materiel-69b0b4c7370bdef7d6198",
  "intelligence-artificielle-pour-debutants-guide-2026-69b0b858370bdef7d6198cba",
];

// Map id → URL Cloudinary complète
const EBOOK_URLS = {
  "maitriser-whatsapp-business-69b0b393370bdef7d6198af1":
    "https://res.cloudinary.com/dcmlw5hak/raw/upload/v1773188104/bookzy/ebooks/maitriser-whatsapp-business-69b0b393370bdef7d6198af1.pdf",
  "lart-de-loratoire-parler-en-public-avec-charisme-et-assurance-69b47016391523fc07":
    "https://res.cloudinary.com/dcmlw5hak/raw/upload/v1773432969/bookzy/ebooks/lart-de-loratoire-parler-en-public-avec-charisme-et-assurance-69b47016391523fc07.pdf",
  "le-business-des-jus-naturels-packaging-bissap-gingembre-69b0cee8370bdef7d6199168":
    "https://res.cloudinary.com/dcmlw5hak/raw/upload/v1773195421/bookzy/ebooks/le-business-des-jus-naturels-packaging-bissap-gingembre-69b0cee8370bdef7d6199168.pdf",
  "trouver-sa-vocation-le-plan-divin-pour-votre-vie-69b0ccd7370bdef7d61990b1":
    "https://res.cloudinary.com/dcmlw5hak/raw/upload/v1773194603/bookzy/ebooks/trouver-sa-vocation-le-plan-divin-pour-votre-vie-69b0ccd7370bdef7d61990b1.pdf",
  "reussir-sa-relation-a-distance-69b0b254370bdef7d6198a45":
    "https://res.cloudinary.com/dcmlw5hak/raw/upload/v1773187763/bookzy/ebooks/reussir-sa-relation-a-distance-69b0b254370bdef7d6198a45.pdf",
  "immo-pays-construire-sa-villa-sans-risques-69b0c93c370bdef7d6198fad":
    "https://res.cloudinary.com/dcmlw5hak/raw/upload/v1773193667/bookzy/ebooks/immo-pays-construire-sa-villa-sans-risques-69b0c93c370bdef7d6198fad.pdf",
  "musculation-a-la-maison-le-programme-complet-sans-materiel-69b0b4c7370bdef7d6198":
    "https://res.cloudinary.com/dcmlw5hak/raw/upload/v1773188410/bookzy/ebooks/musculation-a-la-maison-le-programme-complet-sans-materiel-69b0b4c7370bdef7d6198.pdf",
  "intelligence-artificielle-pour-debutants-guide-2026-69b0b858370bdef7d6198cba":
    "https://res.cloudinary.com/dcmlw5hak/raw/upload/v1773189314/bookzy/ebooks/intelligence-artificielle-pour-debutants-guide-2026-69b0b858370bdef7d6198cba.pdf",
};

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id || !ALLOWED_EBOOKS.includes(id)) {
      return new NextResponse("Non autorisé", { status: 403 });
    }

    const pdfUrl = EBOOK_URLS[id];
    if (!pdfUrl) return new NextResponse("Introuvable", { status: 404 });

    // Fetch le PDF depuis Cloudinary
    const res = await fetch(pdfUrl);
    if (!res.ok) return new NextResponse("Erreur chargement", { status: 502 });

    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        // inline = afficher dans le navigateur (pas télécharger)
        "Content-Disposition": "inline",
        // Bloquer mise en cache longue durée
        "Cache-Control": "no-store",
        // Bloquer l'embed depuis d'autres domaines
        "X-Frame-Options": "SAMEORIGIN",
      },
    });

  } catch (err) {
    console.error("Erreur proxy PDF:", err);
    return new NextResponse("Erreur serveur", { status: 500 });
  }
}