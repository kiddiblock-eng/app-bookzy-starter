"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, ArrowRight, ArrowLeft, Plus, Trash2, Loader2, User, Heart, Compass, Shield, Search, BookMarked, FileText, Feather, Moon } from "lucide-react";
import { useCredits } from "@/hooks/useCredits";

const GENRES = [
  { id: "thriller", label: "Thriller", Icon: Shield, desc: "Suspense et danger" },
  { id: "romance", label: "Romance", Icon: Heart, desc: "Histoire d'amour" },
  { id: "aventure", label: "Aventure", Icon: Compass, desc: "Action et découvertes" },
  { id: "drame", label: "Drame", Icon: Feather, desc: "Émotions profondes" },
  { id: "fantasy", label: "Fantasy", Icon: Moon, desc: "Magie et imaginaire" },
  { id: "policier", label: "Policier", Icon: Search, desc: "Enquête et mystère" },
];

const CADRES = [
  { id: "afrique", label: "Afrique" },
  { id: "europe", label: "Europe" },
  { id: "amerique", label: "Amérique" },
  { id: "universel", label: "Universel" },
];

const LONGUEURS = [
  { id: "court", label: "Court", pages: "20-30 pages", chapitres: "6 chapitres", Icon: BookOpen },
  { id: "moyen", label: "Moyen", pages: "50-70 pages", chapitres: "10 chapitres", Icon: BookMarked },
  { id: "long", label: "Long", pages: "100+ pages", chapitres: "15 chapitres", Icon: FileText },
];

const TONS = [
  { id: "dramatique", label: "Dramatique" },
  { id: "sombre", label: "Sombre" },
  { id: "leger", label: "Léger" },
  { id: "humoristique", label: "Humoristique" },
];

const EPOQUES = [
  { id: "contemporaine", label: "Contemporaine" },
  { id: "historique", label: "Historique" },
  { id: "futuriste", label: "Futuriste" },
  { id: "medievale", label: "Médiévale" },
];

const ROLES = [
  { id: "heros", label: "Héros/Héroïne" },
  { id: "antagoniste", label: "Antagoniste" },
  { id: "love_interest", label: "Intérêt romantique" },
  { id: "secondaire", label: "Personnage secondaire" },
];

const TEMPLATES = [
  { id: "classique", label: "Classique", desc: "Élégant, serif, livre de poche", color: "#1e293b", bg: "#ffffff", titleColor: "#0f172a", lineColor: "#94a3b8", accent: true, ornement: null },
  { id: "sombre", label: "Sombre", desc: "Fond noir, accents dorés, thriller", color: "#d4af37", bg: "#0a0a0a", titleColor: "#ffffff", lineColor: "#475569", accent: false, ornement: "◆" },
  { id: "romance", label: "Romance", desc: "Tons crème, ornements floraux", color: "#be185d", bg: "#fdf8f3", titleColor: "#1e1b4b", lineColor: "#be185d", accent: false, ornement: "❧" },
  { id: "moderne", label: "Moderne", desc: "Minimaliste, bold, contemporain", color: "#2563eb", bg: "#ffffff", titleColor: "#111111", lineColor: "#94a3b8", accent: true, ornement: null },
];

export default function RomansPage() {
  const router = useRouter();
  const { mutateBalance } = useCredits();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Config
  const [genre, setGenre] = useState("");
  const [cadre, setCadre] = useState("afrique");
  const [longueur, setLongueur] = useState("moyen");
  const [ton, setTon] = useState("dramatique");
  const [publicCible] = useState("adulte");
  const [template, setTemplate] = useState("classique");

  // Personnages
  const [personnages, setPersonnages] = useState([
    { nom: "", age: "", role: "heros", description: "" }
  ]);

  // Histoire
  const [decor, setDecor] = useState("");
  const [epoque, setEpoque] = useState("contemporaine");
  const [intrigue, setIntrigue] = useState("");
  const [twist, setTwist] = useState("");

  const selectedLongueur = LONGUEURS.find(l => l.id === longueur);

  const addPersonnage = () => {
    setPersonnages([...personnages, { nom: "", age: "", role: "secondaire", description: "" }]);
  };

  const removePersonnage = (idx) => {
    setPersonnages(personnages.filter((_, i) => i !== idx));
  };

  const updatePersonnage = (idx, field, value) => {
    const updated = [...personnages];
    updated[idx][field] = value;
    setPersonnages(updated);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/romans/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          genre, cadre, longueur, ton, publicCible, template,
          personnages: personnages.filter(p => p.nom.trim()),
          decor, epoque, intrigue, twist,
        }),
      });
      const data = await res.json();
      if (data?.locked) { window.location.href = data.redirectTo || "/dashboard/tarifs"; return; }

      if (!data.success) {
        if (data.insufficientCredits) {
          setError("Il te faut au moins 1 ebook pour générer ce roman.");
        } else {
          setError(data.message || "Erreur lors de la génération.");
        }
        setLoading(false);
        return;
      }

      mutateBalance();
      router.push(`/dashboard/romans/${data.data.romanId}`);
    } catch (e) {
      setError("Erreur serveur. Réessaie.");
      setLoading(false);
    }
  };

  // ── LOADING ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-[calc(100dvh-56px)] bg-white flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-14 h-14 rounded-2xl bg-neutral-900 flex items-center justify-center">
          <BookOpen size={26} className="text-white" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-neutral-900 mb-1.5">Génération de ton roman…</h2>
          <p className="text-sm text-neutral-500">L'IA écrit chaque chapitre. Cela prend 1 à 3 minutes.</p>
        </div>
        <Loader2 size={28} className="text-neutral-900 animate-spin" />
        <div className="flex flex-col gap-2 w-full max-w-xs">
          {["Création du plan narratif…", "Écriture des chapitres…", "Finalisation du roman…"].map((msg, i) => (
            <div key={i} className="flex items-center gap-2.5 px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl">
              <Loader2 size={14} className="text-neutral-400 animate-spin shrink-0" />
              <span className="text-sm text-neutral-600">{msg}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const labelCls = "text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2";
  const inputCls = "w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all";
  const primaryBtn = "flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition-colors disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed";
  const secondaryBtn = "flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors";

  // ── ÉTAPE 0 : Focus (l'idée de l'histoire) ──────────────────────────────────
  if (step === 0) {
    return (
      <div className="min-h-[calc(100dvh-56px)] bg-white flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-neutral-900 mb-5">
            <Feather size={22} className="text-white" />
          </div>
          <h1 className="font-serif text-[28px] leading-tight sm:text-4xl font-semibold text-neutral-900 mb-2.5 tracking-tight">
            Quel roman veux-tu écrire aujourd'hui ?
          </h1>
          <p className="text-sm text-neutral-500 mb-7">Décris ton idée — l'IA construit l'histoire complète avec toi.</p>

          <textarea
            value={intrigue}
            onChange={e => setIntrigue(e.target.value)}
            placeholder="Ex : un détective à Abidjan découvre une corruption, est traqué, et doit choisir entre fuir ou exposer la vérité…"
            rows={3}
            className="w-full px-5 py-4 bg-white border border-neutral-200 rounded-[28px] text-[15px] text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all resize-none text-left"
          />

          <button onClick={() => setStep(1)} className={`mt-4 w-full ${primaryBtn}`}>
            Commencer mon roman <ArrowRight size={16} />
          </button>

          <p className="mt-5 text-xs text-neutral-400">Tu préciseras ensuite le genre, les personnages et le ton.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100dvh-56px)] bg-white">
      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-neutral-900 mb-4">
            <BookOpen size={22} className="text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 mb-1.5">Roman IA</h1>
          <p className="text-sm text-neutral-500">Crée un roman complet en quelques minutes grâce à l'IA.</p>
        </div>

        {/* PROGRESS */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`flex-1 h-1 rounded-full transition-colors ${i <= step ? "bg-neutral-900" : "bg-neutral-200"}`} />
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ── ÉTAPE 1 : Genre + Longueur + Template ── */}
        {step === 1 && (
          <div>
            <h2 className="text-base font-semibold text-neutral-900 mb-4">Genre & format</h2>

            <p className={labelCls}>Genre</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
              {GENRES.map(g => {
                const on = genre === g.id;
                return (
                  <button key={g.id} onClick={() => setGenre(g.id)}
                    className={`p-3 rounded-xl border text-center transition-colors ${on ? "border-neutral-900 bg-neutral-900" : "border-neutral-200 bg-white hover:border-neutral-300"}`}>
                    <g.Icon size={18} className={`mx-auto mb-1.5 ${on ? "text-white" : "text-neutral-700"}`} />
                    <p className={`text-xs font-semibold mb-0.5 ${on ? "text-white" : "text-neutral-900"}`}>{g.label}</p>
                    <p className={`text-[10px] ${on ? "text-white/60" : "text-neutral-500"}`}>{g.desc}</p>
                  </button>
                );
              })}
            </div>

            <p className={labelCls}>Longueur</p>
            <div className="grid gap-2 mb-2">
              {LONGUEURS.map(l => {
                const on = longueur === l.id;
                return (
                  <button key={l.id} onClick={() => setLongueur(l.id)}
                    className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl border text-left transition-colors ${on ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 bg-white hover:border-neutral-300"}`}>
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${on ? "bg-neutral-900" : "bg-neutral-100"}`}>
                      <l.Icon size={17} className={on ? "text-white" : "text-neutral-500"} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-neutral-900">{l.label}</p>
                      <p className="text-xs text-neutral-500">{l.pages} · {l.chapitres}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-neutral-400 mb-6">Chaque roman = 1 ebook, quelle que soit la longueur.</p>

            <p className={labelCls}>Template</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-7">
              {TEMPLATES.map(t => {
                const on = template === t.id;
                return (
                  <button key={t.id} onClick={() => setTemplate(t.id)}
                    className={`rounded-xl border-2 bg-white overflow-hidden text-left transition-colors ${on ? "border-neutral-900" : "border-neutral-200 hover:border-neutral-300"}`}>
                    <div className="h-[90px] px-3 py-2.5 flex flex-col gap-1.5 relative overflow-hidden" style={{ background: t.bg }}>
                      <div className="h-2 w-[70%] rounded-sm" style={{ background: t.titleColor, opacity: 0.9 }} />
                      <div className="h-1 w-[90%] rounded-sm" style={{ background: t.lineColor, opacity: 0.5 }} />
                      <div className="h-1 w-[80%] rounded-sm" style={{ background: t.lineColor, opacity: 0.4 }} />
                      <div className="h-1 w-[85%] rounded-sm" style={{ background: t.lineColor, opacity: 0.3 }} />
                      {t.ornement && <div className="absolute right-2.5 bottom-2 text-lg" style={{ opacity: 0.4, color: t.color }}>{t.ornement}</div>}
                      {t.accent && <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: t.color }} />}
                    </div>
                    <div className="px-3 py-2">
                      <p className="text-xs font-semibold text-neutral-900">{t.label}</p>
                      <p className="text-[10px] text-neutral-500 leading-tight">{t.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <button onClick={() => genre && setStep(2)} disabled={!genre} className={`w-full ${primaryBtn}`}>
              Continuer <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* ── ÉTAPE 2 : Personnages ── */}
        {step === 2 && (
          <div>
            <h2 className="text-base font-semibold text-neutral-900 mb-1">Personnages</h2>
            <p className="text-sm text-neutral-500 mb-4">Définis tes personnages. Plus tu donnes de détails, plus le roman sera fidèle à ta vision.</p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5 text-xs text-amber-800">
              💡 <strong>Recommandé :</strong> ajoute 2-3 personnages — un héros, un antagoniste, un secondaire. Des descriptions riches = une histoire cohérente.
            </div>

            {personnages.map((p, idx) => (
              <div key={idx} className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 mb-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-neutral-400" />
                    <span className="text-sm font-semibold text-neutral-600">Personnage {idx + 1}</span>
                  </div>
                  {idx > 0 && (
                    <button onClick={() => removePersonnage(idx)} className="text-neutral-400 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input type="text" placeholder="Prénom *" value={p.nom} onChange={e => updatePersonnage(idx, "nom", e.target.value)} className={`${inputCls} bg-white`} />
                  <input type="text" placeholder="Âge (recommandé)" value={p.age} onChange={e => updatePersonnage(idx, "age", e.target.value)} className={`${inputCls} bg-white`} />
                </div>
                <select value={p.role} onChange={e => updatePersonnage(idx, "role", e.target.value)} className={`${inputCls} bg-white mb-2`}>
                  {ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                </select>
                <textarea placeholder="Description du personnage — recommandé pour plus de profondeur" value={p.description} onChange={e => updatePersonnage(idx, "description", e.target.value)} rows={2} className={`${inputCls} bg-white resize-none`} />
              </div>
            ))}

            {personnages.length < 5 && (
              <button onClick={addPersonnage} className="w-full py-3 mb-5 rounded-xl border border-dashed border-neutral-300 text-sm font-semibold text-neutral-500 hover:border-neutral-400 hover:text-neutral-700 transition-colors flex items-center justify-center gap-1.5">
                <Plus size={14} /> Ajouter un personnage
              </button>
            )}

            <div className="flex gap-2.5">
              <button onClick={() => setStep(1)} className={`flex-1 ${secondaryBtn}`}>
                <ArrowLeft size={16} /> Retour
              </button>
              <button onClick={() => setStep(3)} className={`flex-[2] ${primaryBtn}`}>
                Continuer <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── ÉTAPE 3 : Décor + Intrigue ── */}
        {step === 3 && (
          <div>
            <h2 className="text-base font-semibold text-neutral-900 mb-1">Cadre & histoire</h2>
            <p className="text-sm text-neutral-500 mb-5">Plus tu donnes de détails, plus le roman sera unique. L'IA invente le reste.</p>

            <p className={labelCls}>Cadre géographique</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {CADRES.map(c => {
                const on = cadre === c.id;
                return (
                  <button key={c.id} onClick={() => setCadre(c.id)}
                    className={`px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${on ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"}`}>
                    {c.label}
                  </button>
                );
              })}
            </div>

            <input type="text" placeholder="Lieu précis (ex : Abidjan, Paris, forêt mystérieuse…)" value={decor} onChange={e => setDecor(e.target.value)} className={`${inputCls} mb-4`} />

            <p className={labelCls}>Époque</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {EPOQUES.map(e => {
                const on = epoque === e.id;
                return (
                  <button key={e.id} onClick={() => setEpoque(e.id)}
                    className={`px-4 py-2 rounded-full border text-xs font-semibold transition-colors ${on ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"}`}>
                    {e.label}
                  </button>
                );
              })}
            </div>

            <p className={labelCls}>Ton du roman</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {TONS.map(t => {
                const on = ton === t.id;
                return (
                  <button key={t.id} onClick={() => setTon(t.id)}
                    className={`px-4 py-2 rounded-full border text-xs font-semibold transition-colors ${on ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"}`}>
                    {t.label}
                  </button>
                );
              })}
            </div>

            <p className={labelCls}>Intrigue principale</p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-2 text-xs text-amber-800">
              💡 <strong>Recommandé :</strong> décris le point de départ, le conflit principal et la fin que tu imagines.
            </div>
            <textarea placeholder="Décris ton histoire — plus c'est détaillé, plus le roman te ressemble…" value={intrigue} onChange={e => setIntrigue(e.target.value)} rows={4} className={`${inputCls} resize-none mb-2.5`} />

            <input type="text" placeholder="Rebondissement/twist — recommandé pour un roman captivant" value={twist} onChange={e => setTwist(e.target.value)} className={`${inputCls} mb-6`} />

            <div className="flex gap-2.5">
              <button onClick={() => setStep(2)} className={`flex-1 ${secondaryBtn}`}>
                <ArrowLeft size={16} /> Retour
              </button>
              <button onClick={() => setStep(4)} className={`flex-[2] ${primaryBtn}`}>
                Continuer <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── ÉTAPE 4 : Récap + Lancer ── */}
        {step === 4 && (
          <div>
            <h2 className="text-base font-semibold text-neutral-900 mb-1">Récapitulatif</h2>
            <p className="text-sm text-neutral-500 mb-5">Vérifie et lance la génération de ton roman.</p>

            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 mb-5">
              {[
                ["Genre", GENRES.find(g => g.id === genre)?.label || genre],
                ["Longueur", `${selectedLongueur?.label} — ${selectedLongueur?.pages} · ${selectedLongueur?.chapitres}`],
                ["Template", TEMPLATES.find(t => t.id === template)?.label],
                ["Cadre", `${CADRES.find(c => c.id === cadre)?.label}${decor ? " — " + decor : ""}`],
                ["Époque", EPOQUES.find(e => e.id === epoque)?.label],
                ["Ton", TONS.find(t => t.id === ton)?.label],
                ["Personnages", personnages.filter(p => p.nom).map(p => p.nom).join(", ") || "Définis par l'IA"],
                ["Intrigue", intrigue || "Inventée par l'IA"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 py-2 border-b border-neutral-200 last:border-0">
                  <span className="text-xs text-neutral-500 font-semibold shrink-0">{label}</span>
                  <span className="text-xs text-neutral-900 text-right">{value}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2.5">
              <button onClick={() => setStep(3)} className={`flex-1 ${secondaryBtn}`}>
                <ArrowLeft size={16} /> Retour
              </button>
              <button onClick={handleGenerate} className={`flex-[2] ${primaryBtn}`}>
                <BookOpen size={16} /> Générer mon roman
              </button>
            </div>
            <p className="text-center text-xs text-neutral-400 mt-3">Générer ce roman utilise 1 ebook.</p>
          </div>
        )}
      </div>
    </div>
  );
}
