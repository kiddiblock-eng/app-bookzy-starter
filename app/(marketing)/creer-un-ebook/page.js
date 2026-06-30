import Link from "next/link";
import { CATEGORIES, ALL_TOPICS, slugify } from "@/lib/seoTopics";

const ACCENT = "#059669";
const TINT = "rgba(5,150,105,0.10)";
const BASE = "https://www.bookzy.io";

export const metadata = {
  title: "Créer un ebook sur n'importe quel sujet avec l'IA — Bookzy",
  description: `Plus de ${ALL_TOPICS.length} idées d'ebooks à créer avec l'IA en 1 minute : business, santé, finance, relations, agriculture… Contenu, design et cover inclus.`,
  alternates: { canonical: `${BASE}/creer-un-ebook` },
  openGraph: {
    title: "Créer un ebook sur n'importe quel sujet avec l'IA — Bookzy",
    description: `Plus de ${ALL_TOPICS.length} idées d'ebooks à générer avec l'IA, dans tous les domaines.`,
    url: `${BASE}/creer-un-ebook`,
    siteName: "Bookzy",
    type: "website",
  },
};

export default function CreerEbookHub() {
  return (
    <main className="bg-white">
      <section className="pt-28 sm:pt-36 pb-12">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <span className="inline-block px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] mb-5" style={{ background: TINT, color: ACCENT }}>
            {ALL_TOPICS.length}+ idées d'ebooks
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 leading-[1.06]">
            Créez un ebook sur n'importe quel sujet,
            <span className="block mt-1.5" style={{ color: ACCENT }}>l'IA s'occupe de tout.</span>
          </h1>
          <p className="mt-5 text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Choisis un sujet : Bookzy l'écrit, le designe et le met en page en une minute. Un ebook pro, prêt à vendre, à enseigner ou à partager.
          </p>
          <Link href="/auth/register" className="mt-7 inline-flex items-center justify-center px-7 py-3.5 bg-neutral-900 text-white text-[15px] font-semibold rounded-full hover:bg-neutral-800 transition-colors">
            Créer mon ebook
          </Link>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-5 space-y-12">
          {CATEGORIES.map((cat) => (
            <div key={cat.name}>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900 mb-4">{cat.name}</h2>
              <div className="flex flex-wrap gap-2.5">
                {cat.topics.map((titre) => (
                  <Link key={titre} href={`/creer-un-ebook/${slugify(titre)}`}
                    className="px-4 py-2 rounded-full border border-neutral-200 text-sm text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 transition-colors">
                    {titre}
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
