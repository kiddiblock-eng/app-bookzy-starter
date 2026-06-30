import Link from "next/link";
import { getPillars, getAllGuides } from "@/lib/guides";

const ACCENT = "#059669";
const TINT = "rgba(5,150,105,0.10)";
const BASE = "https://www.bookzy.io";

export const metadata = {
  title: "Guides — Créer et vendre des ebooks avec l'IA | Bookzy",
  description: "Tous nos guides pour créer, designer, vendre et monétiser des ebooks en Afrique francophone : niche rentable, marketing WhatsApp, business digital, IA et plus.",
  alternates: { canonical: `${BASE}/guides` },
  openGraph: {
    title: "Guides — Créer et vendre des ebooks avec l'IA | Bookzy",
    description: "Tous nos guides pour créer, designer, vendre et monétiser des ebooks.",
    url: `${BASE}/guides`,
    siteName: "Bookzy",
    type: "website",
  },
};

export default function GuidesHub() {
  const pillars = getPillars();
  const total = getAllGuides().length;

  return (
    <main className="bg-white">
      <section className="pt-28 sm:pt-36 pb-10">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <span className="inline-block px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] mb-5" style={{ background: TINT, color: ACCENT }}>
            {total > 0 ? `${total} guides` : "Guides"}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 leading-[1.06]">
            Créer et vendre des ebooks,
            <span className="block mt-1.5" style={{ color: ACCENT }}>tout ce qu'il faut savoir.</span>
          </h1>
          <p className="mt-5 text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Des guides concrets pour passer de l'idée à l'ebook qui rapporte : trouver une niche, écrire, designer, vendre et monétiser — adaptés au marché africain francophone.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-5 space-y-12">
          {pillars.length === 0 && (
            <p className="text-center text-neutral-400">Les premiers guides arrivent très bientôt.</p>
          )}
          {pillars.map((p) => (
            <div key={p.name}>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900 mb-4">{p.name}</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {p.guides.map((g) => (
                  <Link key={g.slug} href={`/guides/${g.slug}`} className="rounded-2xl border border-neutral-200 p-5 hover:border-neutral-900 hover:shadow-sm transition-all">
                    <p className="text-[15px] font-semibold text-neutral-900 leading-snug">{g.title}</p>
                    {g.metaDescription && <p className="mt-1.5 text-sm text-neutral-500 leading-relaxed line-clamp-2">{g.metaDescription}</p>}
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
