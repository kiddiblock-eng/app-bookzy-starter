import Link from "next/link";
import { notFound } from "next/navigation";
import { ALL_TOPICS, getTopicBySlug, getRelated } from "@/lib/seoTopics";
import { COUNTRIES } from "@/lib/seoCountries";

const ACCENT = "#059669";
const TINT = "rgba(5,150,105,0.10)";
const BASE = "https://www.bookzy.io";

export function generateStaticParams() {
  return ALL_TOPICS.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }) {
  const t = getTopicBySlug(params.slug);
  if (!t) return {};
  const title = `Créer un ebook sur « ${t.titre} » avec l'IA — Bookzy`;
  const description = `Génère un ebook professionnel sur « ${t.titre} » en 1 minute grâce à l'IA : contenu, design et cover inclus. Prêt à vendre, à enseigner ou à partager.`;
  const url = `${BASE}/creer-un-ebook/${t.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article", siteName: "Bookzy" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function TopicPage({ params }) {
  const t = getTopicBySlug(params.slug);
  if (!t) notFound();

  const related = getRelated(t.slug, 6);
  const chapters = [
    `Comprendre l'essentiel : ${t.titre}`,
    "Les erreurs qui font tout échouer",
    "La méthode étape par étape",
    "Outils, astuces et ressources utiles",
    "Passer à l'action et obtenir des résultats",
  ];
  const faqs = [
    { q: `Combien de temps pour créer un ebook sur « ${t.titre} » ?`, a: "Environ une minute. Tu donnes le sujet, l'IA rédige le contenu, structure les chapitres et génère la cover et la mise en page." },
    { q: "Ai-je besoin de savoir écrire ou designer ?", a: "Non. Bookzy s'occupe de la rédaction et du design. Tu n'as qu'à décrire ton idée et valider le résultat." },
    { q: "Puis-je le vendre ?", a: "Oui. L'ebook t'appartient à 100 %. Tu peux le vendre, en faire une formation, ou le partager avec ta communauté." },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <main className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* En-tête */}
      <section className="pt-28 sm:pt-32 pb-12">
        <div className="max-w-3xl mx-auto px-5">
          <nav className="text-xs text-neutral-400 mb-5">
            <Link href="/creer-un-ebook" className="hover:text-neutral-700">Créer un ebook</Link>
            <span className="mx-1.5">/</span>
            <span className="text-neutral-600">{t.categorie}</span>
          </nav>
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4" style={{ background: TINT, color: ACCENT }}>
            {t.categorie}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 leading-[1.08]">
            Créer un ebook sur « {t.titre} »
            <span className="block mt-1.5" style={{ color: ACCENT }}>avec l'IA, en 1 minute.</span>
          </h1>
          <p className="mt-5 text-lg text-neutral-600 leading-relaxed">
            Tu veux un ebook professionnel sur <strong className="text-neutral-900 font-semibold">{t.titre.toLowerCase()}</strong> ? Bookzy l'écrit, le designe et le met en page pour toi. Tu obtiens un PDF complet, prêt à vendre, à enseigner ou à partager — sans rien rédiger.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <Link href={`/auth/register?suggestion=${encodeURIComponent(t.titre)}`}
              className="inline-flex items-center justify-center px-7 py-3.5 bg-neutral-900 text-white text-[15px] font-semibold rounded-full hover:bg-neutral-800 transition-colors">
              Créer cet ebook maintenant
            </Link>
            <Link href="/creer-un-ebook" className="inline-flex items-center justify-center px-7 py-3.5 text-[15px] font-semibold text-neutral-700 hover:text-neutral-900 transition-colors">
              Voir d'autres sujets
            </Link>
          </div>
        </div>
      </section>

      {/* Pourquoi */}
      <section className="py-12 border-t border-neutral-100">
        <div className="max-w-3xl mx-auto px-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 mb-4">Pourquoi un ebook sur ce sujet ?</h2>
          <p className="text-neutral-600 leading-relaxed">
            Le sujet « {t.titre.toLowerCase()} » fait partie de la catégorie <strong className="text-neutral-900 font-semibold">{t.categorie}</strong>, un domaine très recherché. Un ebook clair et bien présenté te positionne comme une référence : tu peux le <strong className="text-neutral-900 font-semibold">vendre</strong> à ton audience, en faire une <strong className="text-neutral-900 font-semibold">formation</strong>, ou le <strong className="text-neutral-900 font-semibold">partager</strong> pour faire grandir ta communauté.
          </p>
        </div>
      </section>

      {/* Sommaire généré */}
      <section className="py-12 bg-neutral-50">
        <div className="max-w-3xl mx-auto px-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 mb-2">Un exemple de sommaire</h2>
          <p className="text-neutral-500 mb-6">Voici le type de structure que l'IA peut générer pour cet ebook.</p>
          <ol className="space-y-2.5">
            {chapters.map((c, i) => (
              <li key={i} className="flex items-center gap-3 bg-white border border-neutral-200 rounded-xl px-4 py-3">
                <span className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-[11px] font-bold" style={{ background: TINT, color: ACCENT }}>{i + 1}</span>
                <span className="text-sm text-neutral-700">{c}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Comment Bookzy */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 mb-6">Comment Bookzy le crée pour toi</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              ["1", "Décris ton idée", "Indique le sujet de ton ebook. C'est tout."],
              ["2", "L'IA écrit et designe", "Contenu, chapitres, mise en page et cover générés automatiquement."],
              ["3", "Télécharge ton PDF", "Un ebook pro, prêt à vendre, enseigner ou partager."],
            ].map(([n, ti, d]) => (
              <div key={n} className="rounded-2xl border border-neutral-200 p-5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 text-sm font-bold" style={{ background: TINT, color: ACCENT }}>{n}</div>
                <h3 className="font-semibold text-neutral-900 mb-1">{ti}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-neutral-50">
        <div className="max-w-3xl mx-auto px-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 mb-6">Questions fréquentes</h2>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="bg-white border border-neutral-200 rounded-xl p-5">
                <p className="font-semibold text-neutral-900 mb-1.5">{f.q}</p>
                <p className="text-sm text-neutral-500 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sujets similaires */}
      {related.length > 0 && (
        <section className="py-12">
          <div className="max-w-3xl mx-auto px-5">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 mb-6">Sujets similaires</h2>
            <div className="flex flex-wrap gap-2.5">
              {related.map((r) => (
                <Link key={r.slug} href={`/creer-un-ebook/${r.slug}`}
                  className="px-4 py-2 rounded-full border border-neutral-200 text-sm text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 transition-colors">
                  {r.titre}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Par pays */}
      <section className="py-12 border-t border-neutral-100">
        <div className="max-w-3xl mx-auto px-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 mb-2">Créer cet ebook dans ton pays</h2>
          <p className="text-neutral-500 mb-5">Marché, canaux de vente et paiement adaptés à chez toi.</p>
          <div className="flex flex-wrap gap-2.5">
            {COUNTRIES.map((c) => (
              <Link key={c.slug} href={`/creer-un-ebook/${t.slug}/${c.slug}`}
                className="px-4 py-2 rounded-full border border-neutral-200 text-sm text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 transition-colors">
                {c.nom}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-5">
          <div className="rounded-3xl bg-neutral-900 px-6 py-14 text-center">
            <h2 className="text-white text-2xl sm:text-4xl font-extrabold tracking-tight">Lance ton ebook sur « {t.titre} »</h2>
            <p className="text-neutral-400 mt-3 max-w-lg mx-auto">L'IA s'occupe de la rédaction, du design et de la mise en page. Toi, tu récoltes le résultat.</p>
            <Link href={`/auth/register?suggestion=${encodeURIComponent(t.titre)}`}
              className="mt-7 inline-flex items-center justify-center px-7 py-3.5 bg-white text-neutral-900 rounded-full text-sm font-semibold hover:bg-neutral-100 transition-colors">
              Créer mon ebook gratuitement
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
