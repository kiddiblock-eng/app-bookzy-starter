import Link from "next/link";
import { getAllNiches } from "@/lib/niches";

const ACCENT = "#059669";
const TINT = "rgba(5,150,105,0.10)";
const BASE = "https://www.bookzy.io";

export const metadata = {
  title: "Marché des ebooks : quelles niches sont rentables ? | Bookzy",
  description: "Analyse data des niches d'ebooks rentables : annonceurs Facebook actifs, tendances Google et score de rentabilité par sujet. Trouve un marché porteur avant de créer.",
  alternates: { canonical: `${BASE}/marche-ebook` },
  openGraph: { title: "Marché des ebooks : quelles niches sont rentables ?", description: "Score de rentabilité par niche, données réelles.", url: `${BASE}/marche-ebook`, siteName: "Bookzy", type: "website" },
};

export default function MarcheHub() {
  const niches = getAllNiches().sort((a, b) => b.score - a.score);
  const byCat = {};
  niches.forEach((n) => { (byCat[n.categorie] = byCat[n.categorie] || []).push(n); });

  return (
    <main className="bg-white">
      <section className="pt-28 sm:pt-36 pb-10">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <span className="inline-block px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] mb-5" style={{ background: TINT, color: ACCENT }}>
            {niches.length > 0 ? `${niches.length} marchés analysés` : "Marché des ebooks"}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 leading-[1.06]">
            Quelles niches d'ebooks
            <span className="block mt-1.5" style={{ color: ACCENT }}>se vendent vraiment ?</span>
          </h1>
          <p className="mt-5 text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Pour chaque sujet : les annonceurs Facebook actifs, la tendance de recherche et un score de rentabilité — des données réelles pour savoir quoi créer avant de te lancer.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-5 space-y-12">
          {niches.length === 0 && (
            <p className="text-center text-neutral-400">Les analyses de marché arrivent bientôt.</p>
          )}
          {Object.entries(byCat).map(([cat, list]) => (
            <div key={cat}>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900 mb-4">{cat}</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {list.map((n) => (
                  <Link key={n.slug} href={`/marche-ebook/${n.slug}`} className="rounded-2xl border border-neutral-200 p-4 hover:border-neutral-900 transition-colors flex items-center justify-between gap-3">
                    <span className="text-[15px] font-semibold text-neutral-900 leading-snug">{n.niche}</span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0" style={{ background: TINT, color: ACCENT }}>{n.score}/100</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
