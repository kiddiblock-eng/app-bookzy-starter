import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllGuideSlugs, getGuide, getRelatedGuides } from "@/lib/guides";

const ACCENT = "#059669";
const TINT = "rgba(5,150,105,0.10)";
const BASE = "https://www.bookzy.io";

const anchor = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export function generateStaticParams() {
  return getAllGuideSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const g = getGuide(params.slug);
  if (!g) return {};
  const url = `${BASE}/guides/${g.slug}`;
  const title = g.metaTitle || g.title;
  return {
    title: { absolute: title },
    description: g.metaDescription,
    alternates: { canonical: url },
    openGraph: { title, description: g.metaDescription, url, type: "article", siteName: "Bookzy" },
    twitter: { card: "summary_large_image", title, description: g.metaDescription },
  };
}

export default function GuidePage({ params }) {
  const g = getGuide(params.slug);
  if (!g) notFound();

  const sections = g.sections || [];
  const related = getRelatedGuides(g.slug, g.pillar, 4);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.title,
    description: g.metaDescription,
    author: { "@type": "Organization", name: "Bookzy" },
    publisher: { "@type": "Organization", name: "Bookzy", logo: { "@type": "ImageObject", url: `${BASE}/logo12.webp` } },
    mainEntityOfPage: `${BASE}/guides/${g.slug}`,
  };
  const faqLd = g.faq && g.faq.length
    ? { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: g.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }
    : null;

  return (
    <main className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}

      <article className="max-w-3xl mx-auto px-5 pt-28 sm:pt-32 pb-16">
        {/* Fil d'ariane + pilier */}
        <nav className="text-xs text-neutral-400 mb-5">
          <Link href="/guides" className="hover:text-neutral-700">Guides</Link>
          <span className="mx-1.5">/</span>
          <span className="text-neutral-600">{g.pillar}</span>
        </nav>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 leading-[1.08]">{g.title}</h1>
        {g.intro && <p className="mt-5 text-lg text-neutral-600 leading-relaxed">{g.intro}</p>}

        {/* Sommaire */}
        {sections.length > 1 && (
          <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Sommaire</p>
            <ol className="space-y-1.5">
              {sections.map((s, i) => (
                <li key={i}>
                  <a href={`#${anchor(s.h2)}`} className="text-sm text-neutral-700 hover:text-neutral-900 hover:underline">
                    {i + 1}. {s.h2}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Corps */}
        <div className="mt-10 space-y-10">
          {sections.map((s, i) => (
            <section key={i} id={anchor(s.h2)} className="scroll-mt-24">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 mb-4">{s.h2}</h2>
              {(s.body || []).map((p, j) => (
                <p key={j} className="text-[17px] text-neutral-700 leading-[1.75] mb-4">{p}</p>
              ))}
              {s.list && (
                <ul className="space-y-2.5 my-4">
                  {s.list.map((item, k) => (
                    <li key={k} className="flex items-start gap-3">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ACCENT }} />
                      <span className="text-[17px] text-neutral-700 leading-[1.7]">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {/* À retenir */}
        {g.takeaways && g.takeaways.length > 0 && (
          <div className="mt-12 rounded-2xl p-6" style={{ background: TINT }}>
            <p className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: ACCENT }}>À retenir</p>
            <ul className="space-y-2">
              {g.takeaways.map((t, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ACCENT }} />
                  <span className="text-[15px] text-neutral-800 leading-relaxed">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* CTA produit */}
        <div className="mt-12 rounded-3xl bg-neutral-900 px-6 py-12 text-center">
          <h2 className="text-white text-2xl sm:text-3xl font-extrabold tracking-tight">Passe de la théorie à ton ebook.</h2>
          <p className="text-neutral-400 mt-3 max-w-lg mx-auto">Bookzy écrit, designe et met en page ton ebook avec l'IA. Tu n'as plus qu'à le vendre, l'enseigner ou le partager.</p>
          <Link href="/auth/register" className="mt-6 inline-flex items-center justify-center px-7 py-3.5 bg-white text-neutral-900 rounded-full text-sm font-semibold hover:bg-neutral-100 transition-colors">
            Créer mon ebook gratuitement
          </Link>
        </div>

        {/* FAQ */}
        {g.faq && g.faq.length > 0 && (
          <div className="mt-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 mb-6">Questions fréquentes</h2>
            <div className="space-y-3">
              {g.faq.map((f, i) => (
                <div key={i} className="rounded-xl border border-neutral-200 p-5">
                  <p className="font-semibold text-neutral-900 mb-1.5">{f.q}</p>
                  <p className="text-[15px] text-neutral-600 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Guides liés */}
        {related.length > 0 && (
          <div className="mt-14 pt-10 border-t border-neutral-100">
            <h2 className="text-xl font-extrabold tracking-tight text-neutral-900 mb-5">À lire ensuite</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {related.map((r) => (
                <Link key={r.slug} href={`/guides/${r.slug}`} className="rounded-xl border border-neutral-200 p-4 hover:border-neutral-900 transition-colors">
                  <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: ACCENT }}>{r.pillar}</span>
                  <p className="text-[15px] font-semibold text-neutral-900 mt-1 leading-snug">{r.title}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </main>
  );
}
