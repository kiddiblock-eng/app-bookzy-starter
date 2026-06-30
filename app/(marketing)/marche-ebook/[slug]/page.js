import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllNicheSlugs, getNiche, getRelatedNiches, verdictFromScore } from "@/lib/niches";

const ACCENT = "#059669";
const TINT = "rgba(5,150,105,0.10)";
const BASE = "https://www.bookzy.io";

const PAYS = { CI: "🇨🇮 Côte d'Ivoire", SN: "🇸🇳 Sénégal", CM: "🇨🇲 Cameroun", ML: "🇲🇱 Mali", BJ: "🇧🇯 Bénin", TG: "🇹🇬 Togo", FR: "🇫🇷 France" };
const TREND = { montante: { t: "En hausse", c: "#059669" }, stable: { t: "Stable", c: "#64748b" }, descendante: { t: "En baisse", c: "#ef4444" } };

export function generateStaticParams() {
  return getAllNicheSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const n = getNiche(params.slug);
  if (!n) return {};
  const url = `${BASE}/marche-ebook/${n.slug}`;
  const title = `Marché de l'ebook « ${n.niche} » : rentable en 2026 ? | Bookzy`;
  const description = `Analyse du marché pour un ebook sur ${n.niche.toLowerCase()} : ${n.totalAnnonceurs} annonceurs Facebook actifs, tendance ${TREND[n.tendance]?.t.toLowerCase()}, score de rentabilité ${n.score}/100.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article", siteName: "Bookzy" },
  };
}

export default function NicheMarketPage({ params }) {
  const n = getNiche(params.slug);
  if (!n) notFound();

  const v = verdictFromScore(n.score);
  const trend = TREND[n.tendance] || TREND.stable;
  const pays = Object.entries(n.paysScores || {}).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const related = getRelatedNiches(n.slug, n.categorie, 6);

  return (
    <main className="bg-white">
      <article className="max-w-3xl mx-auto px-5 pt-28 sm:pt-32 pb-16">
        <nav className="text-xs text-neutral-400 mb-5">
          <Link href="/marche-ebook" className="hover:text-neutral-700">Marché des ebooks</Link>
          <span className="mx-1.5">/</span>
          <span className="text-neutral-600">{n.categorie}</span>
        </nav>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 leading-[1.08]">
          Le marché de l'ebook
          <span className="block mt-1.5" style={{ color: ACCENT }}>« {n.niche} »</span>
        </h1>
        <p className="mt-5 text-lg text-neutral-600 leading-relaxed">
          Avant de créer un ebook sur ce sujet, voici ce que disent les données réelles du marché : qui investit déjà, comment évolue la demande, et quel est le potentiel de rentabilité.
        </p>

        {/* Score + verdict */}
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-neutral-200 p-6 flex items-center gap-5">
            <div className="relative w-20 h-20 shrink-0">
              <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#eef2f7" strokeWidth="3.5" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke={ACCENT} strokeWidth="3.5" strokeLinecap="round"
                  strokeDasharray={`${(n.score / 100) * 100} 100`} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-extrabold text-neutral-900">{n.score}</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Score de rentabilité</p>
              <p className="text-2xl font-extrabold text-neutral-900">{n.score}<span className="text-base text-neutral-400">/100</span></p>
              <span className="inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: TINT, color: ACCENT }}>{v.label}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Signaux du marché</p>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between"><span className="text-neutral-500">Annonceurs Facebook actifs</span><span className="font-bold text-neutral-900">{n.totalAnnonceurs}</span></div>
              <div className="flex items-center justify-between"><span className="text-neutral-500">Tendance de recherche</span><span className="font-bold" style={{ color: trend.c }}>{trend.t}</span></div>
              <div className="flex items-center justify-between"><span className="text-neutral-500">Revenus estimés</span><span className="font-bold text-neutral-900">{n.revenusEstimes}</span></div>
            </div>
          </div>
        </div>

        {/* Pays */}
        {pays.length > 0 && (
          <div className="mt-6 rounded-2xl border border-neutral-200 p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Pays les plus porteurs</p>
            <div className="flex flex-wrap gap-2">
              {pays.map(([code, sc]) => (
                <span key={code} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-50 border border-neutral-200 text-sm">
                  <span className="text-neutral-700">{PAYS[code] || code}</span>
                  <span className="font-bold" style={{ color: ACCENT }}>{sc}/100</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Annonceurs */}
        {n.annonceurs && n.annonceurs.length > 0 && (
          <div className="mt-6 rounded-2xl border border-neutral-200 p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Ils investissent déjà sur ce thème</p>
            <div className="flex flex-wrap gap-3">
              {n.annonceurs.map((a, i) => (
                <div key={i} className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-full pl-1 pr-3 py-1">
                  {a.photo ? <img src={a.photo} alt="" className="w-6 h-6 rounded-full object-cover" /> : <span className="w-6 h-6 rounded-full bg-neutral-200" />}
                  <span className="text-sm text-neutral-700 max-w-[160px] truncate">{a.nom}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lecture */}
        <div className="mt-8 rounded-2xl p-6" style={{ background: TINT }}>
          <p className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: ACCENT }}>Comment lire ces données</p>
          <p className="text-[15px] text-neutral-800 leading-relaxed">
            Un nombre élevé d'annonceurs Facebook actifs signifie que des gens dépensent déjà de l'argent sur ce sujet — la demande est prouvée. Une tendance en hausse indique un marché qui grandit. Le score combine ces signaux pour estimer le potentiel : plus il est élevé, plus tu as de raisons de te lancer.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-10 rounded-3xl bg-neutral-900 px-6 py-12 text-center">
          <h2 className="text-white text-2xl sm:text-3xl font-extrabold tracking-tight">Crée ton ebook sur « {n.niche} »</h2>
          <p className="text-neutral-400 mt-3 max-w-lg mx-auto">L'IA écrit, designe et met en page ton ebook en une minute. Tu n'as plus qu'à le vendre.</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={`/auth/register?suggestion=${encodeURIComponent(n.niche)}`} className="inline-flex items-center justify-center px-7 py-3.5 bg-white text-neutral-900 rounded-full text-sm font-semibold hover:bg-neutral-100 transition-colors">
              Créer cet ebook
            </Link>
            <Link href={`/creer-un-ebook/${n.slug}`} className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold text-white border border-neutral-700 rounded-full hover:bg-neutral-800 transition-colors">
              En savoir plus
            </Link>
          </div>
        </div>

        {/* Niches liées */}
        {related.length > 0 && (
          <div className="mt-14 pt-10 border-t border-neutral-100">
            <h2 className="text-xl font-extrabold tracking-tight text-neutral-900 mb-5">Autres marchés à explorer</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {related.map((r) => (
                <Link key={r.slug} href={`/marche-ebook/${r.slug}`} className="rounded-xl border border-neutral-200 p-4 hover:border-neutral-900 transition-colors flex items-center justify-between gap-3">
                  <span className="text-[15px] font-semibold text-neutral-900 leading-snug">{r.niche}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0" style={{ background: TINT, color: ACCENT }}>{r.score}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <p className="mt-10 text-xs text-neutral-400">Données issues de Facebook Ads Library et Google Trends. Estimations indicatives, mises à jour périodiquement.</p>
      </article>
    </main>
  );
}
