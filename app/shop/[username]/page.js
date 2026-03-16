// app/shop/[username]/page.js
// Page publique d'une boutique - Avec support Banner Premium

import { notFound } from "next/navigation";
import Link from "next/link";
import { Instagram, Youtube, Globe, ShoppingBag } from "lucide-react";

// Templates de style
const templates = {
  clean: { 
    bg: "bg-white", text: "text-gray-900", textMuted: "text-gray-500",
    card: "bg-gray-50 border border-gray-100", 
    button: "bg-gray-900 text-white hover:bg-gray-800",
    buttonSecondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
  },
  stone: { 
    bg: "bg-gray-900", text: "text-white", textMuted: "text-gray-400",
    card: "bg-gray-800 border border-gray-700", 
    button: "bg-white text-gray-900 hover:bg-gray-100",
    buttonSecondary: "bg-gray-800 text-white hover:bg-gray-700 border border-gray-600",
  },
  gradient: { 
    bg: "bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700", 
    text: "text-white", textMuted: "text-white/70",
    card: "bg-white/10 backdrop-blur border border-white/20", 
    button: "bg-white text-indigo-700 hover:bg-gray-100",
    buttonSecondary: "bg-white/20 text-white hover:bg-white/30 border border-white/30",
  },
  warm: { 
    bg: "bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50", 
    text: "text-amber-900", textMuted: "text-amber-700",
    card: "bg-white border border-amber-200", 
    button: "bg-amber-600 text-white hover:bg-amber-700",
    buttonSecondary: "bg-amber-100 text-amber-900 hover:bg-amber-200",
  },
  neon: {
    bg: "bg-black", text: "text-white", textMuted: "text-gray-400",
    card: "bg-gray-900/50 border border-fuchsia-500/30",
    button: "bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white hover:opacity-90",
    buttonSecondary: "bg-transparent text-fuchsia-400 border border-fuchsia-500/50 hover:bg-fuchsia-500/10",
    price: "text-fuchsia-400", special: "neon",
  },
  minimal: {
    bg: "bg-neutral-50", text: "text-neutral-900", textMuted: "text-neutral-500",
    card: "bg-white",
    button: "bg-neutral-900 text-white hover:bg-neutral-800",
    buttonSecondary: "bg-transparent text-neutral-900 border-b-2 border-neutral-900 rounded-none hover:bg-neutral-100",
    special: "minimal",
  },
  brutalist: {
    bg: "bg-yellow-300", text: "text-black", textMuted: "text-black/70",
    card: "bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
    button: "bg-black text-yellow-300 border-4 border-black",
    buttonSecondary: "bg-white text-black border-4 border-black hover:bg-yellow-100",
    special: "brutalist",
  },
  glass: {
    bg: "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900",
    text: "text-white", textMuted: "text-white/60",
    card: "bg-white/5 backdrop-blur-xl border border-white/10",
    button: "bg-white/20 backdrop-blur text-white border border-white/30 hover:bg-white/30",
    buttonSecondary: "bg-white/5 text-white/80 border border-white/10 hover:bg-white/15",
    special: "glass",
  },
  love: {
    bg: "bg-gradient-to-b from-pink-50 to-rose-100",
    text: "text-rose-900", textMuted: "text-rose-400",
    card: "bg-white border border-rose-100",
    button: "bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:opacity-90",
    buttonSecondary: "bg-rose-100 text-rose-700 hover:bg-rose-200",
    special: "love",
  },
  elegant: {
    bg: "bg-stone-100", text: "text-stone-800", textMuted: "text-stone-500",
    card: "bg-white border-l-4 border-amber-400",
    button: "bg-stone-800 text-white hover:bg-stone-900",
    buttonSecondary: "bg-transparent text-amber-600 border border-amber-400 hover:bg-amber-50",
    special: "elegant",
  },
  playful: {
    bg: "bg-gradient-to-b from-violet-100 via-pink-50 to-cyan-100",
    text: "text-gray-800", textMuted: "text-gray-500",
    card: "bg-white",
    button: "bg-gradient-to-r from-violet-500 via-pink-500 to-orange-400 text-white hover:opacity-90",
    buttonSecondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    special: "playful",
  },
  nature: {
    bg: "bg-gradient-to-b from-green-50 to-emerald-100",
    text: "text-green-900", textMuted: "text-green-600",
    card: "bg-white border border-green-100",
    button: "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90",
    buttonSecondary: "bg-green-100 text-green-700 hover:bg-green-200",
    special: "nature",
  },
  midnight: {
    bg: "bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900",
    text: "text-white", textMuted: "text-indigo-300",
    card: "bg-indigo-950/50 backdrop-blur border border-indigo-500/20",
    button: "bg-indigo-500 text-white hover:bg-indigo-600",
    buttonSecondary: "bg-indigo-900/50 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-900",
    price: "text-indigo-400", special: "midnight",
  },
};

const PREMIUM_TEMPLATES = ["love", "elegant", "playful", "nature", "midnight"];

function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

const currencies = { XOF: "FCFA", XAF: "FCFA", EUR: "€", USD: "$", GBP: "£" };

async function getShopData(username) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/shop/${username}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data : null;
  } catch (error) {
    console.error("Erreur fetch shop:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { username } = await params;
  const data = await getShopData(username);
  if (!data) return { title: "Boutique introuvable" };
  return {
    title: `${data.shop.name} | Bookzy`,
    description: data.shop.bio || `Découvrez les produits de ${data.shop.name}`,
    openGraph: {
      title: data.shop.name,
      description: data.shop.bio,
      images: data.shop.logo ? [data.shop.logo] : [],
    },
  };
}

// TikTok Icon Component
function TikTokIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );
}

export default async function ShopPage({ params }) {
  const { username } = await params;
  const data = await getShopData(username);
  if (!data) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-gray-900 border border-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-8 h-8 text-gray-600" />
          </div>
          <h1 className="text-white font-bold text-xl mb-2">Boutique non disponible</h1>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Cette boutique n&apos;est pas encore publiée. Si c&apos;est la tienne, publie-la depuis ton dashboard pour activer ce lien.
          </p>
          <a
            href="/dashboard/smart-shop/boutique"
            className="inline-flex items-center gap-2 px-5 py-3 bg-white text-gray-900 font-semibold rounded-xl text-sm hover:bg-gray-100 transition"
          >
            Publier ma boutique →
          </a>
          <p className="text-gray-700 text-xs mt-8">Propulsé par Bookzy</p>
        </div>
      </div>
    );
  }
  
  const { shop, products } = data;
  const theme = templates[shop.theme?.style] || templates.clean;
  const currencySymbol = currencies[shop.currency] || "FCFA";
  const isPremium = PREMIUM_TEMPLATES.includes(shop.theme?.style);
  
  // Social links check
  const hasSocials = shop.socials?.instagram || shop.socials?.youtube || shop.socials?.tiktok || shop.socials?.website;
  
  return (
    <div className={`min-h-screen ${theme.bg} relative overflow-hidden`}>
      
      {/* === EFFETS SPÉCIAUX === */}
      {theme.special === "neon" && (
        <>
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
            backgroundImage: `linear-gradient(rgba(217,70,239,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(217,70,239,0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-[120px] pointer-events-none" />
        </>
      )}
      
      {theme.special === "glass" && (
        <>
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/30 rounded-full blur-[120px] pointer-events-none" />
        </>
      )}
      
      {theme.special === "love" && (
        <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-[10%] text-8xl">♥</div>
          <div className="absolute top-32 right-[15%] text-6xl">♥</div>
          <div className="absolute bottom-40 left-[25%] text-5xl">♥</div>
        </div>
      )}
      
      {theme.special === "midnight" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-4 left-[10%] w-1 h-1 bg-white rounded-full animate-pulse" />
          <div className="absolute top-8 left-[25%] w-1.5 h-1.5 bg-white rounded-full" />
          <div className="absolute top-6 right-8 w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 shadow-[0_0_30px_rgba(255,255,255,0.2)]" />
        </div>
      )}
      
      <div className="max-w-lg mx-auto relative z-10">
        
        {/* ================================================ */}
        {/* HERO BANNER - Templates PREMIUM uniquement       */}
        {/* ================================================ */}
        {isPremium && (
          <div className="relative">
            {/* Banner Image ou Gradient par défaut */}
            <div className="h-36 sm:h-44 overflow-hidden">
              {shop.banner ? (
                <img 
                  src={shop.banner} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full ${
                  theme.special === "love" ? "bg-gradient-to-r from-pink-400 to-rose-400" :
                  theme.special === "elegant" ? "bg-gradient-to-b from-stone-600 to-stone-800" :
                  theme.special === "playful" ? "bg-gradient-to-r from-violet-500 via-pink-500 to-orange-400" :
                  theme.special === "nature" ? "bg-gradient-to-br from-green-500 to-emerald-600" :
                  theme.special === "midnight" ? "bg-gradient-to-b from-indigo-800 to-slate-900" :
                  "bg-gray-300"
                }`} />
              )}
            </div>
            
            {/* Avatar centré qui chevauche le banner */}
            <div className="flex justify-center -mt-12">
              {shop.logo ? (
                <img 
                  src={shop.logo} 
                  alt={shop.name}
                  className="w-24 h-24 object-cover shadow-xl rounded-full border-4 border-white"
                />
              ) : (
                <div className="w-24 h-24 bg-white flex items-center justify-center shadow-xl rounded-full border-4 border-white">
                  <span className={`text-3xl font-bold ${theme.text}`}>
                    {shop.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            
            {/* Infos sous l'avatar */}
            <div className="text-center px-4 mt-3 pb-6">
              <h1 className={`text-2xl font-bold ${theme.text}`}>{shop.name}</h1>
              <p className={`text-sm mt-1 ${theme.textMuted}`}>@{shop.slug}</p>
              
              {shop.bio && (
                <p className={`mt-3 ${theme.textMuted} text-sm leading-relaxed max-w-md mx-auto`}>
                  {shop.bio}
                </p>
              )}
              
              {/* Social Links */}
              {hasSocials && (
                <div className="flex items-center justify-center gap-3 mt-4">
                  {shop.socials?.instagram && (
                    <a href={`https://instagram.com/${shop.socials.instagram}`} target="_blank" rel="noopener noreferrer"
                      className={`w-10 h-10 ${theme.card} flex items-center justify-center hover:scale-110 transition-all rounded-full`}>
                      <Instagram className={`w-5 h-5 ${theme.text}`} />
                    </a>
                  )}
                  {shop.socials?.youtube && (
                    <a href={`https://youtube.com/@${shop.socials.youtube}`} target="_blank" rel="noopener noreferrer"
                      className={`w-10 h-10 ${theme.card} flex items-center justify-center hover:scale-110 transition-all rounded-full`}>
                      <Youtube className={`w-5 h-5 ${theme.text}`} />
                    </a>
                  )}
                  {shop.socials?.tiktok && (
                    <a href={`https://tiktok.com/@${shop.socials.tiktok}`} target="_blank" rel="noopener noreferrer"
                      className={`w-10 h-10 ${theme.card} flex items-center justify-center hover:scale-110 transition-all rounded-full`}>
                      <TikTokIcon className={`w-5 h-5 ${theme.text}`} />
                    </a>
                  )}
                  {shop.socials?.website && (
                    <a href={shop.socials.website.startsWith('http') ? shop.socials.website : `https://${shop.socials.website}`} target="_blank" rel="noopener noreferrer"
                      className={`w-10 h-10 ${theme.card} flex items-center justify-center hover:scale-110 transition-all rounded-full`}>
                      <Globe className={`w-5 h-5 ${theme.text}`} />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* ================================================ */}
        {/* HEADER CLASSIQUE - Templates NON Premium         */}
        {/* ================================================ */}
        {!isPremium && (
          <div className={`text-center px-4 pt-8 ${theme.special === "minimal" ? "mb-12" : "mb-8"}`}>
            {shop.logo ? (
              <img 
                src={shop.logo} 
                alt={shop.name}
                className={`w-24 h-24 mx-auto mb-4 object-cover shadow-xl ${
                  theme.special === "brutalist" ? "border-4 border-black" 
                  : theme.special === "neon" ? "rounded-full border-2 border-fuchsia-500 shadow-[0_0_30px_rgba(217,70,239,0.5)]"
                  : "rounded-full border-4 border-white/20"
                }`}
              />
            ) : (
              <div className={`w-24 h-24 mx-auto mb-4 ${theme.card} flex items-center justify-center shadow-xl ${
                theme.special === "brutalist" ? "" : "rounded-full"
              } ${theme.special === "neon" ? "border-2 border-fuchsia-500" : ""}`}>
                <span className={`text-3xl font-bold ${theme.text}`}>
                  {shop.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            )}
            
            <h1 className={`text-2xl font-bold ${theme.text} ${theme.special === "brutalist" ? "uppercase" : ""}`}>
              {shop.name}
            </h1>
            <p className={`text-sm mt-1 ${theme.special === "neon" ? "text-fuchsia-400 font-mono" : theme.textMuted}`}>
              @{shop.slug}
            </p>
            
            {shop.bio && (
              <p className={`mt-4 ${theme.textMuted} text-sm leading-relaxed max-w-md mx-auto`}>
                {shop.bio}
              </p>
            )}
            
            {/* Social Links */}
            {hasSocials && (
              <div className="flex items-center justify-center gap-3 mt-4">
                {shop.socials?.instagram && (
                  <a href={`https://instagram.com/${shop.socials.instagram}`} target="_blank" rel="noopener noreferrer"
                    className={`w-10 h-10 ${theme.card} flex items-center justify-center hover:scale-110 transition-all ${
                      theme.special === "brutalist" ? "" : "rounded-full"
                    }`}>
                    <Instagram className={`w-5 h-5 ${theme.special === "neon" ? "text-fuchsia-400" : theme.text}`} />
                  </a>
                )}
                {shop.socials?.youtube && (
                  <a href={`https://youtube.com/@${shop.socials.youtube}`} target="_blank" rel="noopener noreferrer"
                    className={`w-10 h-10 ${theme.card} flex items-center justify-center hover:scale-110 transition-all ${
                      theme.special === "brutalist" ? "" : "rounded-full"
                    }`}>
                    <Youtube className={`w-5 h-5 ${theme.special === "neon" ? "text-fuchsia-400" : theme.text}`} />
                  </a>
                )}
                {shop.socials?.tiktok && (
                  <a href={`https://tiktok.com/@${shop.socials.tiktok}`} target="_blank" rel="noopener noreferrer"
                    className={`w-10 h-10 ${theme.card} flex items-center justify-center hover:scale-110 transition-all ${
                      theme.special === "brutalist" ? "" : "rounded-full"
                    }`}>
                    <TikTokIcon className={`w-5 h-5 ${theme.special === "neon" ? "text-fuchsia-400" : theme.text}`} />
                  </a>
                )}
                {shop.socials?.website && (
                  <a href={shop.socials.website.startsWith('http') ? shop.socials.website : `https://${shop.socials.website}`} target="_blank" rel="noopener noreferrer"
                    className={`w-10 h-10 ${theme.card} flex items-center justify-center hover:scale-110 transition-all ${
                      theme.special === "brutalist" ? "" : "rounded-full"
                    }`}>
                    <Globe className={`w-5 h-5 ${theme.special === "neon" ? "text-fuchsia-400" : theme.text}`} />
                  </a>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Séparateur minimal */}
        {theme.special === "minimal" && (
          <div className="max-w-xs mx-auto mb-8 px-4">
            <div className="h-px bg-neutral-200" />
          </div>
        )}
        
        {/* ================================================ */}
        {/* PRODUCTS                                         */}
        {/* ================================================ */}
        <div className="px-4 pb-8">
          {products.length > 0 ? (
            <div className="space-y-4">
              {products.map((product) => (
                <div 
                  key={product._id}
                  className={`${theme.card} overflow-hidden transition-all ${
                    theme.special === "brutalist" ? "" : "rounded-2xl shadow-sm"
                  }`}
                >
                  <div className="flex gap-4 p-4">
                    {/* Cover */}
                    <div className={`w-20 h-24 overflow-hidden flex-shrink-0 bg-gray-200 ${
                      theme.special === "brutalist" ? "border-2 border-black" : "rounded-xl"
                    }`}>
                      {product.cover ? (
                        <img src={product.cover} alt={product.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center ${theme.special === "neon" ? "bg-gray-900" : ""}`}>
                          <ShoppingBag className={`w-8 h-8 ${theme.special === "neon" ? "text-fuchsia-400" : "text-gray-400"}`} />
                        </div>
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold ${theme.text} line-clamp-2 ${theme.special === "brutalist" ? "uppercase" : ""}`}>
                        {product.title}
                      </h3>
                      
                      {product.description && (
                        <p className={`text-sm ${theme.textMuted} mt-1 line-clamp-2`}>
                          {stripHtml(product.description)}
                        </p>
                      )}
                      
                      {/* Price */}
                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        {product.comparePrice && (
                          <span className={`text-sm ${theme.textMuted} line-through`}>
                            {product.comparePrice.toLocaleString()} {currencySymbol}
                          </span>
                        )}
                        <span className={`font-bold ${theme.price || theme.text}`}>
                          {product.checkoutType === "free" ? "Gratuit" : `${product.price.toLocaleString()} ${currencySymbol}`}
                        </span>
                        {product.comparePrice && (
                          <span className={`text-xs text-white px-2 py-0.5 ${
                            theme.special === "neon" ? "bg-fuchsia-500" : theme.special === "brutalist" ? "bg-black text-yellow-300" : "bg-red-500"
                          } ${theme.special === "brutalist" ? "" : "rounded-full"}`}>
                            -{Math.round((1 - product.price / product.comparePrice) * 100)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Buttons */}
                  <div className="px-4 pb-4 flex gap-2">
                    <Link href={`/shop/${username}/${product.slug}`}
                      className={`flex-1 py-2.5 text-center text-sm font-medium transition-all ${theme.buttonSecondary} ${
                        theme.special === "brutalist" ? "" : "rounded-xl"
                      }`}>
                      En savoir plus
                    </Link>
                    <Link href={`/shop/${username}/${product.slug}?action=buy`}
                      className={`flex-1 py-2.5 text-center text-sm font-medium transition-all ${theme.button} ${
                        theme.special === "brutalist" ? "" : "rounded-xl"
                      }`}>
                      {product.buttonText || "Acheter"}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`${theme.card} p-8 text-center ${theme.special === "brutalist" ? "" : "rounded-2xl"}`}>
              <ShoppingBag className={`w-12 h-12 ${theme.textMuted} mx-auto mb-3`} />
              <p className={theme.textMuted}>Aucun produit disponible</p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className={`text-center py-6 ${theme.special === "neon" ? "border-t border-fuchsia-500/20" : ""}`}>
          <a href="https://bookzy.io" target="_blank" rel="noopener noreferrer"
            className={`text-xs ${theme.textMuted} hover:underline`}>
            {theme.special === "brutalist" ? "▲ PROPULSÉ PAR BOOKZY ▲" : "Propulsé par Bookzy"}
          </a>
        </div>
      </div>
    </div>
  );
}