import Link from "next/link";
import { notFound } from "next/navigation";
import { ALL_TOPICS, getTopicBySlug } from "@/lib/seoTopics";
import { COUNTRIES, getCountry } from "@/lib/seoCountries";

const ACCENT = "#059669";
const TINT = "rgba(5,150,105,0.10)";
const BASE = "https://www.bookzy.io";

export function generateStaticParams() {
  const out = [];
  for (const t of ALL_TOPICS) for (const c of COUNTRIES) out.push({ slug: t.slug, pays: c.slug });
  return out;
}

export function generateMetadata({ params }) {
  const t = getTopicBySlug(params.slug);
  const c = getCountry(params.pays);
  if (!t || !c) return {};
  const url = `${BASE}/creer-un-ebook/${t.slug}/${c.slug}`;
  const title = `Créer un ebook sur « ${t.titre} » ${c.prep} ${c.nom} | Bookzy`;
  const description = `Comment créer et vendre un ebook sur ${t.titre.toLowerCase()} ${c.prep} ${c.nom} : marché local, paiement par ${c.mm.slice(0, 2).join(" et ")}, et génération par l'IA en 1 minute.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article", siteName: "Bookzy" },
  };
}

export default function SubjectCountryPage({ params }) {
  const t = getTopicBySlug(params.slug);
  const c = getCountry(params.pays);
  if (!t || !c) notFound();

  const sujet = t.titre;
  const sujetL = t.titre.toLowerCase();
  const vi = (t.slug.length + c.slug.length) % 3; // variation déterministe
  const isDiaspora = c.zone === "diaspora";

  const introVariants = [
    `Tu veux créer un ebook sur ${sujetL} et le vendre ${c.prep} ${c.nom} ? Tu es au bon endroit. Le marché digital ${c.prep} ${c.nom} est ${c.note}, et un ebook bien fait peut devenir une vraie source de revenus. Voici comment t'y prendre, du contenu à l'encaissement, sans rien rédiger toi-même.`,
    `Créer un ebook sur ${sujetL} ${c.prep} ${c.nom}, c'est aujourd'hui à la portée de tout le monde. Avec l'IA qui écrit et designe à ta place, et le mobile money qui simplifie l'encaissement, tu peux lancer ton produit digital en quelques minutes. Ce guide t'explique tout, étape par étape, pour le marché ${c.prep === "en" ? "" : ""}${c.nom}.`,
    `Un ebook sur ${sujetL} peut très bien se vendre ${c.prep} ${c.nom}, à condition de connaître le marché local et les bons canaux. Bonne nouvelle : tu n'as ni à écrire, ni à designer. On te montre comment créer ton ebook avec l'IA et le transformer en revenus, ${c.prep} ${c.nom}.`,
  ];

  const sections = [
    {
      h2: `Pourquoi créer un ebook sur ${sujetL} ${c.prep} ${c.nom}`,
      body: [
        `${c.nom} fait partie des marchés où la demande pour du contenu utile et accessible ne cesse de croître. Sur le thème « ${sujet} » — dans le domaine ${t.categorie.toLowerCase()} — beaucoup de gens cherchent des réponses claires, prêtes à l'emploi. Un ebook répond exactement à ce besoin : c'est concret, ça se consomme facilement sur téléphone, et ça se partage en un clic.`,
        `L'avantage d'un ebook, c'est qu'il ne coûte presque rien à produire et se vend autant de fois que tu veux. Tu le crées une fois, et il peut te rapporter pendant des mois. ${c.prep === "en" ? "En" : c.prep === "au" ? "Au" : "À"} ${c.nom}, où le téléphone est l'outil principal pour apprendre et acheter, ce format est particulièrement adapté.`,
      ],
    },
    {
      h2: `Le marché ${c.prep} ${c.nom}`,
      body: [
        `Le digital ${c.prep} ${c.nom} est ${c.note}. De plus en plus de personnes consomment des formations, des guides et des produits digitaux directement depuis leur smartphone. C'est une opportunité réelle pour qui propose un contenu de qualité sur ${sujetL}.`,
        isDiaspora
          ? `La diaspora francophone ${c.prep} ${c.nom} est une audience à fort pouvoir d'achat, habituée à payer en ligne par carte ou PayPal. Un ebook bien présenté, qui parle vrai, peut très bien y trouver son public.`
          : `Le mobile money a levé le principal frein à l'achat en ligne : plus besoin de carte bancaire. N'importe qui peut payer ton ebook en quelques secondes depuis son téléphone, ce qui élargit énormément ta clientèle potentielle.`,
      ],
    },
    {
      h2: `Comment te faire payer ${c.prep} ${c.nom}`,
      body: [
        `${c.prep === "en" ? "En" : c.prep === "au" ? "Au" : "À"} ${c.nom}, tes clients peuvent te payer directement, sans intermédiaire compliqué. Les moyens les plus utilisés sont ${c.mm.join(", ")}.`,
        `Concrètement : ton client te confirme son intérêt, tu lui indiques ton numéro ${isDiaspora ? "ou ton lien de paiement" : "mobile money"}, il t'envoie le montant, et tu lui livres l'ebook en PDF dans la foulée. C'est instantané, et c'est TOI qui encaisses : Bookzy ne prend aucune commission sur tes ventes.`,
      ],
      list: c.mm.map((m) => `Encaisse par ${m}`),
    },
    {
      h2: `Où vendre ton ebook ${c.prep} ${c.nom}`,
      body: [
        `Le canal numéro un reste WhatsApp : tu publies des statuts utiles autour de ${sujetL}, tu réponds aux questions, et tu vends en conversation directe. Facebook et les groupes thématiques marchent aussi très bien pour toucher du monde sans budget pub.`,
        isDiaspora
          ? `Tu peux également vendre via une simple page de vente, Instagram ou une boutique en ligne, et accepter les paiements par carte ou PayPal. La diaspora est à l'aise avec ces moyens.`
          : `Tu peux aussi vendre via Telegram, Instagram ou un statut WhatsApp avec un aperçu de ton ebook. L'important est de montrer la valeur avant de demander le paiement.`,
      ],
    },
    {
      h2: `Créer ton ebook sur ${sujetL} en 1 minute`,
      body: [
        `Tu n'as pas besoin de savoir écrire ni designer. Avec Bookzy, tu décris ton sujet, et l'IA s'occupe du reste : elle rédige le contenu, structure les chapitres, applique une mise en page professionnelle et génère une couverture qui donne envie d'acheter.`,
        `En quelques minutes, tu obtiens un PDF complet, prêt à être vendu ${c.prep} ${c.nom} — ou ailleurs. Tu peux ensuite l'améliorer, y ajouter ta touche personnelle, et le proposer à ton audience.`,
      ],
      list: [
        "Décris ton sujet en une phrase",
        "L'IA écrit, designe et met en page",
        "Télécharge ton PDF et vends-le",
      ],
    },
  ];

  const faq = [
    { q: `Comment vendre un ebook sur ${sujetL} ${c.prep} ${c.nom} ?`, a: `Le plus simple est de vendre sur WhatsApp et les réseaux sociaux, puis d'encaisser par ${c.mm.slice(0, 2).join(" ou ")}. Tu livres l'ebook en PDF directement à l'acheteur.` },
    { q: `Faut-il une carte bancaire pour se faire payer ${c.prep} ${c.nom} ?`, a: isDiaspora ? `${c.prep === "en" ? "En" : "Au"} ${c.nom}, la carte bancaire et PayPal sont les moyens les plus courants, mais tu peux aussi accepter d'autres options selon ton audience.` : `Non. ${c.prep === "en" ? "En" : c.prep === "au" ? "Au" : "À"} ${c.nom}, le mobile money (${c.mm.slice(0, 2).join(", ")}) suffit largement : tes clients paient depuis leur téléphone, sans carte.` },
    { q: `Combien de temps pour créer cet ebook ?`, a: `Environ une minute avec l'IA de Bookzy. Tu donnes le sujet, et le contenu, le design et la couverture sont générés automatiquement.` },
  ];

  const otherCountries = COUNTRIES.filter((x) => x.slug !== c.slug).slice(0, 8);
  const sameCatSubjects = ALL_TOPICS.filter((x) => x.categorie === t.categorie && x.slug !== t.slug).slice(0, 4);

  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

  return (
    <main className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <article className="max-w-3xl mx-auto px-5 pt-28 sm:pt-32 pb-16">
        <nav className="text-xs text-neutral-400 mb-5">
          <Link href="/creer-un-ebook" className="hover:text-neutral-700">Créer un ebook</Link>
          <span className="mx-1.5">/</span>
          <Link href={`/creer-un-ebook/${t.slug}`} className="hover:text-neutral-700">{t.titre}</Link>
          <span className="mx-1.5">/</span>
          <span className="text-neutral-600">{c.nom}</span>
        </nav>

        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4" style={{ background: TINT, color: ACCENT }}>{t.categorie} · {c.nom}</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 leading-[1.08]">
          Créer un ebook sur « {sujet} »
          <span className="block mt-1.5" style={{ color: ACCENT }}>{c.prep} {c.nom}</span>
        </h1>
        <p className="mt-5 text-lg text-neutral-600 leading-relaxed">{introVariants[vi]}</p>

        <div className="mt-7">
          <Link href={`/auth/register?suggestion=${encodeURIComponent(sujet)}`} className="inline-flex items-center justify-center px-7 py-3.5 bg-neutral-900 text-white text-[15px] font-semibold rounded-full hover:bg-neutral-800 transition-colors">
            Créer cet ebook maintenant
          </Link>
        </div>

        <div className="mt-10 space-y-10">
          {sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 mb-4">{s.h2}</h2>
              {s.body.map((p, j) => <p key={j} className="text-[17px] text-neutral-700 leading-[1.75] mb-4">{p}</p>)}
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

        {/* CTA */}
        <div className="mt-12 rounded-3xl bg-neutral-900 px-6 py-12 text-center">
          <h2 className="text-white text-2xl sm:text-3xl font-extrabold tracking-tight">Lance ton ebook {c.prep} {c.nom}</h2>
          <p className="text-neutral-400 mt-3 max-w-lg mx-auto">L'IA écrit, designe et met en page. Toi, tu vends et tu encaisses par {c.mm[0]}.</p>
          <Link href={`/auth/register?suggestion=${encodeURIComponent(sujet)}`} className="mt-6 inline-flex items-center justify-center px-7 py-3.5 bg-white text-neutral-900 rounded-full text-sm font-semibold hover:bg-neutral-100 transition-colors">
            Créer mon ebook gratuitement
          </Link>
        </div>

        {/* FAQ */}
        <div className="mt-14">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 mb-6">Questions fréquentes</h2>
          <div className="space-y-3">
            {faq.map((f, i) => (
              <div key={i} className="rounded-xl border border-neutral-200 p-5">
                <p className="font-semibold text-neutral-900 mb-1.5">{f.q}</p>
                <p className="text-[15px] text-neutral-600 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Maillage : autres pays */}
        <div className="mt-14 pt-10 border-t border-neutral-100">
          <h2 className="text-xl font-extrabold tracking-tight text-neutral-900 mb-4">« {sujet} » dans d'autres pays</h2>
          <div className="flex flex-wrap gap-2">
            {otherCountries.map((x) => (
              <Link key={x.slug} href={`/creer-un-ebook/${t.slug}/${x.slug}`} className="px-3.5 py-2 rounded-full border border-neutral-200 text-sm text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 transition-colors">
                {x.nom}
              </Link>
            ))}
          </div>

          {sameCatSubjects.length > 0 && (
            <>
              <h2 className="text-xl font-extrabold tracking-tight text-neutral-900 mb-4 mt-10">Autres sujets {c.prep} {c.nom}</h2>
              <div className="flex flex-wrap gap-2">
                {sameCatSubjects.map((x) => (
                  <Link key={x.slug} href={`/creer-un-ebook/${x.slug}/${c.slug}`} className="px-3.5 py-2 rounded-full border border-neutral-200 text-sm text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 transition-colors">
                    {x.titre}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </article>
    </main>
  );
}
