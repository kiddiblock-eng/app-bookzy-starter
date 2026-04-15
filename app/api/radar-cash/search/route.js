export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { verifyAuth } from "@/lib/auth";

// ── NICHES EBOOK — requêtes ciblées ──────────────────────────────────────────
const NICHE_QUERIES = [
  "formation en ligne afrique",
  "coaching business afrique",
  "comment gagner argent internet",
  "dropshipping afrique francophone",
  "formation trading forex afrique",
  "visa canada immigration",
  "agriculture elevage rentable",
  "immobilier investissement afrique",
  "formation developpement personnel",
  "ebook numerique vendre",
  "formation freelance digital",
  "commerce en ligne cote ivoire",
  "creation entreprise afrique",
  "formation informatique afrique",
  "business en ligne sans capital",
  "produits digitaux vendre afrique",
  "ecommerce boutique en ligne afrique",
  "trading debutant afrique",
  "ebook formation vente",
  "dropshipping debutant francophone",
  "importation chine afrique revente",
  "vendre produits numeriques whatsapp",
  "formation marketing digital afrique",
  "gagner argent tiktok instagram afrique",
];

// ── FILTRE STRICT ─────────────────────────────────────────────────────────────
const POSITIVE_KW = [
  "formation","coaching","cours","apprendre","guide","methode","programme",
  "business","argent","revenu","gagner","profit","entrepreneur","investir",
  "vendre","vente","digital","freelance","numerique","ligne",
  "agriculture","elevage","jardinage","cultiver","plantation",
  "sante","minceur","regime","bien-etre","maigrir","fitness",
  "immobilier","terrain","location","foncier",
  "visa","immigration","voyage","etudier","etranger","canada",
  "cuisine","recette","patisserie",
  "informatique","programmation","coding","developpeur",
  "developpement personnel","motivation","reussir","succes","mindset",
  "mariage","couple","famille","enfant","education","parentalite",
  "couture","artisanat","creation",
  "forex","trading","crypto","bitcoin",
  "emploi","cv","reconversion","carriere",
  "dropshipping","ecommerce","importation","chariow","alibaba",
  "instagram","tiktok","reseaux sociaux","influence","monetiser","contenu",
  "strategie","technique","secret","comment devenir","lancer","creer",
  "mecanique","reparation","auto",
  "ebook","livre numerique","pdf","guide pratique",
];

const NEGATIVE_KW = [
  // Achat produits physiques
  "acheter","achetez","commander","livraison","livraison gratuite","soldes","promo",
  "reduction","bon plan","offre limitee","stock limite","commandez","buy now","shop now",
  "prix reduit","meilleur prix","pas cher","moins cher",
  // Tech physique
  "smartphone","telephone","iphone","samsung","android","tablette","laptop","ordinateur portable",
  "ecouteur","airpod","chargeur","accessoire telephone","clavier","souris",
  // Mode/beauté
  "vetement","chaussure","sac a main","bijou","montre","parfum","cosmetique","maquillage",
  "creme","serum","huile","masque","lotion","shampoing","savon","gel","deodorant",
  "rouge a levre","fond de teint","mascara","produit beaute","soin visage","anti-age",
  // Santé produits physiques
  "supplement","collagen","peptide","vitamin","probiotic","pilule","capsule","gelule",
  "complement alimentaire","bruleur de graisse","detox","cure","comprime","sirop",
  // Maison/électro
  "aspirateur","machine a laver","refrigerateur","television","meuble","matelas",
  "robot menager","friteuse","cuisiniere","four","micro-onde","lave-vaisselle",
  // Food delivery / restaurants
  "livraison repas","plat cuisine","traiteur","chef a domicile","menu","carte restaurant",
  // Marques physiques
  "vichy","liftactiv","loreal","garnier","nivea","dove","colgate","oral-b",
  "coca","pepsi","nestle","danone","maggi","unilever",
  "aws","google cloud","microsoft azure","salesforce","hubspot",
  // Langues étrangères
  "siketi","urunde","indirim","temizleyici","milyonlarca","burun",
  "kidney stones","daily life","ayurveda","sleep solution","non-melatonin","drops nightly",
  "your startup","auto-checked","double taxation","tax identifier","stripe and us",
  "we sweat","you build","trusted by","handles your","incorporated today",
  "join us","make a difference","stay inspired","shop our","free shipping",
  // Pièces auto/physique
  "pneu","piece auto","carrosserie","pare-choc","phare voiture",
  // Nettoyage
  "chiffon","nettoyant","detergent","lessive","produit menager",
];

function isValidAd(ad) {
  const raw = `${ad.title} ${ad.bodyText} ${ad.pageName}`.toLowerCase();
  const text = raw.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  if (!ad.pageName) return false;
  if (!ad.bodyText && !ad.title) return false;

  // Rejeter si contient des caractères arabes
  if (/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(raw)) return false;
  // Rejeter si contient des caractères turcs spéciaux
  if (/[şğıİŞĞ]/.test(raw)) return false;
  // Rejeter si trop d'anglais (plus de 3 mots anglais typiques)
  const englishWords = ["the","and","for","with","your","you","our","this","that","from","are","has","have","can","get","free","now","today","just","how","its","not","but","all","new","one","more"];
  const englishCount = englishWords.filter(w => raw.includes(` ${w} `) || raw.startsWith(`${w} `)).length;
  if (englishCount >= 3) return false;

  // Rejeter si mot négatif
  const negNorm = NEGATIVE_KW.map(k => k.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
  if (negNorm.some(kw => text.includes(kw))) return false;

  // DOIT avoir un mot-clé positif
  const posNorm = POSITIVE_KW.map(k => k.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
  return posNorm.some(kw => text.includes(kw));
}

function parseAd(ad) {
  const snap = ad.snapshot || {};
  const images = snap.images || [];
  const videos = snap.videos || [];

  const imageUrl = images[0]?.original_image_url || images[0]?.resized_image_url ||
    snap.cards?.[0]?.original_image_url || videos[0]?.video_preview_image_url || null;
  const videoUrl = videos[0]?.video_hd_url || videos[0]?.video_sd_url || null;

  const bodyText = typeof snap.body === "string" ? snap.body : snap.body?.text || snap.cards?.[0]?.body || "";
  const title = snap.title || snap.cards?.[0]?.title || snap.cards?.[0]?.link_title || "";
  const pageName = snap.page_name || ad.page_name || "";
  const pagePhoto = snap.page_profile_picture_url || "";
  const pageUrl = snap.page_profile_uri || "";

  const startTimestamp = ad.start_date || ad.ad_delivery_start_time;
  const startDate = startTimestamp ? new Date(typeof startTimestamp === "number" ? startTimestamp * 1000 : startTimestamp) : null;
  const daysRunning = startDate ? Math.round((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24)) : null;

  const platforms = ad.publisher_platforms || [];
  let potential = 1;
  if (daysRunning >= 60) potential = 3;
  else if (daysRunning >= 20) potential = 2;

  return {
    id: ad.ad_archive_id || String(Math.random()),
    pageName: String(pageName),
    pagePhoto: String(pagePhoto),
    pageUrl: String(pageUrl),
    bodyText: String(bodyText).substring(0, 400),
    title: String(title).substring(0, 120),
    imageUrl,
    videoUrl,
    daysRunning,
    platforms,
    potential,
  };
}

async function fetchFbAds(query, country, mediaType, cursor = null) {
  const params = new URLSearchParams({
    query,
    search_type: "keyword_unordered",
    ad_type: "all",
    status: "ACTIVE",
    sort_by: "total_impressions",
    trim: "false",
  });
  if (country !== "ALL") params.set("country", country);
  if (mediaType !== "ALL") params.set("media_type", mediaType);
  if (cursor) params.set("cursor", cursor);

  const res = await fetch(
    `https://facebook-ads-library-scraper-api.p.rapidapi.com/search/ads?${params}`,
    {
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host": "facebook-ads-library-scraper-api.p.rapidapi.com",
      },
    }
  );
  if (!res.ok) return null;
  const data = await res.json();
  const ads = Array.isArray(data) ? data : (data.searchResults || data.ads || data.data || []);
  return { ads, cursor: data.cursor || data.next_cursor || null, total: data.searchResultsCount || ads.length };
}

export async function GET(req) {
  try {
    await dbConnect();
    const user = await verifyAuth(req);
    if (!user) return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const country = searchParams.get("country") || "ALL";
    const mediaType = searchParams.get("media_type") || "ALL";
    const cursor = searchParams.get("cursor") || null;

    const userDoc = await User.findById(user.id);
    if (!userDoc) return NextResponse.json({ success: false, message: "Introuvable." }, { status: 404 });
    const isPremium = ["solo", "createur", "agence"].includes(userDoc.plan);

    let allAds = [];
    let nextCursor = null;
    let totalCount = 0;

    if (query.trim()) {
      // Recherche utilisateur — 2 appels pour plus de résultats
      const [r1, r2] = await Promise.allSettled([
        fetchFbAds(query, country, mediaType, cursor),
        fetchFbAds(`${query} formation`, country, mediaType),
      ]);
      if (r1.status === "fulfilled" && r1.value) {
        allAds = [...allAds, ...r1.value.ads];
        nextCursor = r1.value.cursor;
        totalCount = r1.value.total;
      }
      if (r2.status === "fulfilled" && r2.value) {
        allAds = [...allAds, ...r2.value.ads];
      }
    } else {
      // Chargement initial — 4 requêtes ciblées en parallèle
      const queries = NICHE_QUERIES.sort(() => Math.random() - 0.5).slice(0, 4);
      const results = await Promise.allSettled(queries.map(q => fetchFbAds(q, country, mediaType)));
      for (const r of results) {
        if (r.status === "fulfilled" && r.value) {
          allAds = [...allAds, ...r.value.ads];
          totalCount = Math.max(totalCount, r.value.total);
        }
      }
    }

    // Dédupliquer
    const seen = new Set();
    const unique = allAds.filter(ad => {
      const id = ad.ad_archive_id;
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    });

    // Parser + filtrer
    const parsed = unique.map(parseAd).filter(isValidAd);

    console.log(`✅ [Radar Cash] "${query || "auto"}" → ${unique.length} bruts → ${parsed.length} filtrés`);

    return NextResponse.json({
      success: true,
      data: { ads: parsed.slice(0, 50), totalCount, nextCursor, isPremium },
    });

  } catch (e) {
    console.error("❌ Radar Cash:", e);
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}