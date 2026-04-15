"use client";

import { useState, useEffect } from "react";
import { X, ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`;

// ─── VISUELS ANIMÉS ───────────────────────────────────────────────────────────

function VisualEspionner() {
  return (
    <div style={{ background: '#ECFEFF', borderRadius: 12, padding: 16, border: '1px solid #A5F3FC' }}>
      <style>{`
        @keyframes radar-spin2 { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        @keyframes ping2 { 0%{transform:scale(0.8);opacity:1} 100%{transform:scale(2.2);opacity:0} }
      `}</style>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
          {[1, 0.66, 0.33].map((s, i) => (
            <div key={i} style={{ position: 'absolute', inset: `${i * 12}px`, borderRadius: '50%', border: '1px solid rgba(8,145,178,0.25)' }} />
          ))}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'radar-spin2 3s linear infinite' }}>
            <div style={{ position: 'absolute', width: '50%', height: 1, background: 'linear-gradient(90deg, transparent, #0891b2)', right: '50%', top: '50%', transformOrigin: 'right center' }} />
          </div>
          {[[16,14],[48,28],[24,52],[56,50]].map(([x,y], i) => (
            <div key={i} style={{ position: 'absolute', left: x, top: y }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0891b2', animation: `ping2 2s ${i*0.5}s infinite` }} />
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0891b2', position: 'absolute', top: 0 }} />
            </div>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          {[
            { label: 'Marketing WhatsApp', score: 94 },
            { label: 'Freelance Afrique', score: 87 },
            { label: 'Business en ligne', score: 76 },
          ].map((item, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: 10, color: '#164e63', fontWeight: 600 }}>{item.label}</span>
                <span style={{ fontSize: 10, color: '#0891b2', fontWeight: 700 }}>{item.score}</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: '#CFFAFE' }}>
                <div style={{ height: '100%', width: `${item.score}%`, background: '#0891b2', borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
        {['Radar Cash', 'Niche Hunter'].map(tool => (
          <span key={tool} style={{ fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: '#0891b2', color: 'white' }}>{tool}</span>
        ))}
      </div>
    </div>
  );
}

function VisualValider() {
  return (
    <div style={{ background: '#F5F3FF', borderRadius: 12, padding: 16, border: '1px solid #DDD6FE' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <div style={{ position: 'relative', width: 56, height: 56, flexShrink: 0 }}>
          <svg viewBox="0 0 56 56" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
            <circle cx="28" cy="28" r="24" fill="none" stroke="#EDE9FE" strokeWidth="5"/>
            <circle cx="28" cy="28" r="24" fill="none" stroke="#7c3aed" strokeWidth="5" strokeDasharray="150" strokeDashoffset="27" strokeLinecap="round"/>
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: '#4c1d95' }}>82</div>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#4c1d95' }}>Très rentable</div>
          <div style={{ fontSize: 9, color: '#7c3aed' }}>Score /100 basé sur les données</div>
        </div>
      </div>
      {[
        { label: 'Concurrence', val: 'Faible', color: '#059669' },
        { label: 'Revenus estimés', val: '180k FCFA/mois', color: '#7c3aed' },
        { label: 'Meilleur marché', val: 'CI · SN · CM', color: '#7c3aed' },
      ].map((item, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: i < 2 ? '1px solid #EDE9FE' : 'none' }}>
          <span style={{ fontSize: 10, color: '#6b7280' }}>{item.label}</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: item.color }}>{item.val}</span>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
        <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: '#7c3aed', color: 'white' }}>Validateur d'idée</span>
      </div>
    </div>
  );
}

function VisualCreer() {
  return (
    <div style={{ background: '#EFF6FF', borderRadius: 12, padding: 16, border: '1px solid #BFDBFE' }}>
      <style>{`
        @keyframes typing2 { 0%,100%{width:20%} 60%{width:100%} }
        @keyframes pulse-dot2 { 0%,100%{transform:scale(1)} 50%{transform:scale(1.5)} }
      `}</style>
      <div style={{ background: 'white', borderRadius: 8, padding: '10px 12px', border: '1px solid #DBEAFE', marginBottom: 10 }}>
        <div style={{ fontSize: 9, color: '#3b82f6', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Génération en cours</div>
        {[90, 75, 85, 60].map((w, i) => (
          <div key={i} style={{ height: 6, borderRadius: 3, background: '#DBEAFE', marginBottom: 6, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: '#3b82f6', borderRadius: 3, animation: `typing2 2s ${i * 0.3}s infinite ease-in-out` }} />
          </div>
        ))}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginTop: 8 }}>
          {[0, 0.15, 0.3].map((d, i) => (
            <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: '#3b82f6', animation: `pulse-dot2 1s ${d}s infinite` }} />
          ))}
          <span style={{ fontSize: 9, color: '#93c5fd', marginLeft: 4 }}>Chapitre 3 en cours...</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {['Génération IA', 'Ebook Designer', 'Romans IA', 'Youbook'].map(tool => (
          <span key={tool} style={{ fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: '#1d4ed8', color: 'white' }}>{tool}</span>
        ))}
      </div>
    </div>
  );
}

// ─── CHEMINS ──────────────────────────────────────────────────────────────────

const pathWithIdea = [
  {
    number: "01",
    title: "Vérifiez que votre idée va vendre",
    description: "Le Validateur d'idée analyse Facebook Ads, Google Trends et les données de marché. Score sur 100, concurrence, revenus estimés. Créez en sachant que votre sujet va vendre.",
    tools: ["Validateur d'idée"],
  },
  {
    number: "02",
    title: "Votre ebook pro en 60 secondes",
    description: "Choisissez votre outil, l'IA fait le reste. PDF professionnel, cover 3D et kit marketing inclus.",
    tools: ["Génération IA", "Ebook Designer", "Romans IA", "Youbook"],
  },
];

const pathNoIdea = [
  {
    number: "01",
    title: "Trouvez ce qui se vend en ce moment",
    description: "Radar Cash surveille les pubs Facebook actives. Niche Hunter analyse Google et le marché. Vous voyez exactement quels sujets génèrent des ventes maintenant.",
    tools: ["Radar Cash", "Niche Hunter"],
  },
  {
    number: "02",
    title: "Confirmez le potentiel de votre idée",
    description: "Le Validateur d'idée analyse en profondeur votre sujet. Score de rentabilité, niveau de concurrence, revenus estimés, pays qui achètent le plus.",
    tools: ["Validateur d'idée"],
  },
  {
    number: "03",
    title: "Votre ebook pro en 60 secondes",
    description: "Choisissez votre outil, l'IA fait le reste. PDF professionnel, cover 3D et kit marketing inclus.",
    tools: ["Génération IA", "Ebook Designer", "Romans IA", "Youbook"],
  },
];

// ─── EXEMPLES ─────────────────────────────────────────────────────────────────

const examples = [
  {
    id: 1,
    title: "Réussir sa Relation à Distance",
    category: "Fashion",
    pdfUrl: "https://res.cloudinary.com/dcmlw5hak/raw/upload/v1773187763/bookzy/ebooks/reussir-sa-relation-a-distance-69b0b254370bdef7d6198a45.pdf",
    cover: { bg: "linear-gradient(135deg, #9f1239 0%, #be185d 100%)", spine: "rgba(0,0,0,0.28)", badge: "FASHION", badgeStyle: { border: "1.5px solid rgba(255,255,255,0.55)", color: "#fff", background: "transparent" }, titleColor: "#fff", accentColor: "rgba(255,255,255,0.5)", font: "Georgia, serif", corners: true },
  },
  {
    id: 2,
    title: "Maîtriser WhatsApp Business",
    category: "Business",
    pdfUrl: "https://res.cloudinary.com/dcmlw5hak/raw/upload/v1773188104/bookzy/ebooks/maitriser-whatsapp-business-69b0b393370bdef7d6198af1.pdf",
    cover: { bg: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", spine: "rgba(0,0,0,0.3)", badge: "PREMIUM", badgeStyle: { border: "1.5px solid #b8860b", color: "#b8860b", background: "transparent" }, titleColor: "#fff", accentColor: "#d4af37", font: "Inter, sans-serif", accentBar: true },
  },
  {
    id: 3,
    title: "Musculation à la Maison",
    category: "Sport",
    pdfUrl: "https://res.cloudinary.com/dcmlw5hak/raw/upload/v1773188410/bookzy/ebooks/musculation-a-la-maison-le-programme-complet-sans-materiel-69b0b4c7370bdef7d6198.pdf",
    cover: { bg: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", spine: "rgba(0,0,0,0.3)", badge: "SPORT", badgeStyle: { background: "#ef4444", color: "#fff", border: "none" }, titleColor: "#fff", accentColor: "#ef4444", font: "Inter, sans-serif", diagonal: true },
  },
  {
    id: 4,
    title: "Intelligence Artificielle pour Débutants",
    category: "Tech",
    pdfUrl: "https://res.cloudinary.com/dcmlw5hak/raw/upload/v1773189314/bookzy/ebooks/intelligence-artificielle-pour-debutants-guide-2026-69b0b858370bdef7d6198cba.pdf",
    cover: { bg: "linear-gradient(135deg, #0a0e27 0%, #1e3a8a 100%)", spine: "rgba(0,0,0,0.3)", badge: "TECH", badgeStyle: { border: "1.5px solid #00d4ff", color: "#00d4ff", background: "transparent" }, titleColor: "#00d4ff", accentColor: "#00d4ff", font: "Inter, sans-serif", grid: true },
  },
];

function EbookCoverCSS({ cover, title, isActive }) {
  const words = title.split(" ");
  const line1 = words.slice(0, Math.ceil(words.length / 2)).join(" ");
  const line2 = words.slice(Math.ceil(words.length / 2)).join(" ");
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", background: cover.bg, borderRadius: "2px 8px 8px 2px", overflow: "hidden", boxShadow: isActive ? "0 32px 64px rgba(0,0,0,0.5)" : "0 8px 24px rgba(0,0,0,0.3)", transition: "box-shadow 0.3s" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, background: cover.spine, zIndex: 3 }} />
      {cover.accentBar && <div style={{ position: "absolute", left: 5, top: 0, bottom: 0, width: 4, background: "linear-gradient(180deg, #b8860b, #d4af37)", zIndex: 3 }} />}
      {cover.grid && <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${cover.accentColor}18 1px, transparent 1px), linear-gradient(90deg, ${cover.accentColor}18 1px, transparent 1px)`, backgroundSize: "22px 22px" }} />}
      {cover.diagonal && (
        <>
          <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(-45deg, transparent, transparent 24px, rgba(239,68,68,0.08) 24px, rgba(239,68,68,0.08) 48px)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "35%", background: "rgba(239,68,68,0.18)", clipPath: "polygon(0 40%, 100% 0%, 100% 100%, 0% 100%)" }} />
        </>
      )}
      {cover.corners && [{ top: 8, left: 8 }, { top: 8, right: 8 }, { bottom: 8, left: 8 }, { bottom: 8, right: 8 }].map((s, i) => (
        <div key={i} style={{ position: "absolute", width: 14, height: 14, border: "1.5px solid rgba(255,255,255,0.35)", ...s }} />
      ))}
      <div style={{ position: "relative", zIndex: 4, padding: "14px 12px 10px 16px", display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ display: "inline-block", padding: "2px 8px", borderRadius: 20, fontSize: 7, fontWeight: 800, letterSpacing: "0.08em", marginBottom: 10, width: "fit-content", ...cover.badgeStyle }}>{cover.badge}</div>
        <div style={{ fontFamily: cover.font, fontWeight: 800, fontSize: 11, color: cover.titleColor, lineHeight: 1.3, marginBottom: 8, flex: 1 }}>{line1}<br />{line2}</div>
        <div style={{ width: "55%", height: 1.5, borderRadius: 1, background: cover.accentColor, marginBottom: 6 }} />
        {[80, 65, 72, 58].map((w, i) => <div key={i} style={{ width: `${w}%`, height: 1.5, borderRadius: 1, background: "rgba(255,255,255,0.12)", marginBottom: 3 }} />)}
        <div style={{ marginTop: "auto", width: "45%", height: 1.5, borderRadius: 1, background: cover.accentColor, opacity: 0.7 }} />
      </div>
    </div>
  );
}

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────

export default function HowItWorksAndExamples() {
  const [mode, setMode] = useState("idea"); // "idea" | "no-idea"
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(true);
  const [activeBook, setActiveBook] = useState(0);

  useEffect(() => {
    document.body.style.overflow = selectedPdf ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [selectedPdf]);

  useEffect(() => {
    const t = setInterval(() => setActiveBook(p => (p + 1) % examples.length), 3000);
    return () => clearInterval(t);
  }, []);

  const steps = mode === "idea" ? pathWithIdea : pathNoIdea;

  return (
    <>
      <div style={{ background: '#FAFAFA' }}>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: 'repeat', backgroundSize: '128px' }} />

        {/* ── HOW IT WORKS ── */}
        <section id="howitWorks" className="relative z-10 pt-16 lg:pt-24 pb-20 lg:pb-28 px-5 sm:px-6">
          <div className="max-w-6xl mx-auto">

            {/* Header */}
            <div className="mb-10 pb-10 border-b border-[#E8E8E8]">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Comment ça marche</p>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[0.92]">
                  De l'idée à l'ebook<br />
                  <span className="text-blue-500">en quelques minutes</span>
                </h2>

                {/* Toggle */}
                <div className="flex-shrink-0">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Votre situation</p>
                  <div className="flex w-full sm:w-auto bg-white border border-[#E8E8E8] rounded-xl p-1 gap-1">
                    <button
                      onClick={() => setMode("idea")}
                      className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${mode === "idea" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-900"}`}
                    >
                      J'ai une idée
                    </button>
                    <button
                      onClick={() => setMode("no-idea")}
                      className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${mode === "no-idea" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-900"}`}
                    >
                      Je cherche
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className={`grid gap-5 lg:gap-6 ${steps.length === 2 ? "lg:grid-cols-2 max-w-3xl mx-auto" : "lg:grid-cols-3"}`}>
              {steps.map((step, i) => (
                <div key={`${mode}-${i}`} className="relative">
                  {i < steps.length - 1 && (
                    <div className="hidden lg:flex absolute top-8 left-full w-6 z-10 items-center justify-center">
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </div>
                  )}
                  <div className="rounded-2xl border border-[#E8E8E8] bg-white hover:border-slate-300 hover:shadow-md transition-all duration-300 p-6 h-full flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <span className="text-6xl font-black leading-none text-slate-100">{step.number}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 leading-snug tracking-tight mb-2">{step.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-auto pt-2">
                      {step.tools.map(tool => (
                        <span key={tool} className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100 text-slate-600">{tool}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center mt-12">
              <Link href="/auth/register" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-base rounded-full transition-all">
                Commencer gratuitement
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-xs text-slate-400 mt-3">4 crédits offerts. Aucune carte requise.</p>
            </div>
          </div>
        </section>

        {/* ── EXAMPLES ── */}
        <section id="examples" className="relative z-10 pt-4 pb-16 lg:pb-24 px-5 sm:px-6 border-t border-[#E8E8E8]">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14 pt-16 pb-10 border-b border-[#E8E8E8]">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Exemples réels</p>
                <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[0.92]">Générés avec Bookzy</h2>
                <p className="text-slate-500 text-base mt-3 max-w-md">
                  Chaque ebook ci-dessous a été généré par l'IA de Bookzy en 64s. Contenu, mise en page, cover. Aucune retouche.
                </p>
              </div>
              <Link href="/auth/register" className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all">
                Créer le mien <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-6">
              {examples.map((ex, i) => {
                const isActive = activeBook === i;
                return (
                  <button key={ex.id} onClick={() => { setSelectedPdf(ex); setIsLoadingPdf(true); }} onMouseEnter={() => setActiveBook(i)} className="group text-left flex flex-col">
                    <div className="relative mb-3 transition-all duration-300" style={{ aspectRatio: "3/4", transform: isActive ? "translateY(-6px) scale(1.02)" : "translateY(0) scale(1)" }}>
                      <div style={{ position: "absolute", top: 3, right: -5, bottom: 3, width: 8, background: "#e2e8f0", borderRadius: "0 3px 3px 0", zIndex: 0 }} />
                      <div style={{ position: "absolute", top: 6, right: -9, bottom: 6, width: 6, background: "#cbd5e1", borderRadius: "0 3px 3px 0", zIndex: 0 }} />
                      <div style={{ position: "relative", zIndex: 1, height: "100%", borderRadius: "2px 8px 8px 2px", overflow: "hidden" }}>
                        <EbookCoverCSS cover={ex.cover} title={ex.title} isActive={isActive} />
                      </div>
                      <div className="absolute inset-0 rounded-lg flex items-center justify-center transition-opacity duration-200" style={{ zIndex: 2, background: "rgba(0,0,0,0.45)", opacity: isActive ? 1 : 0, borderRadius: "2px 8px 8px 2px" }}>
                        <span className="bg-white text-slate-900 text-[11px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">Voir le PDF</span>
                      </div>
                    </div>
                    <div className="px-0.5">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 text-slate-400">{ex.category}</p>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-slate-600 transition-colors line-clamp-2">{ex.title}</h3>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-center gap-2 mb-6">
              {examples.map((_, i) => (
                <button key={i} onClick={() => setActiveBook(i)} className="transition-all duration-300 rounded-full" style={{ width: activeBook === i ? 20 : 7, height: 7, background: activeBook === i ? "#0f172a" : "#E8E8E8" }} />
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ── PDF MODAL ── */}
      {selectedPdf && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={() => setSelectedPdf(null)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative z-10 bg-white w-full h-full sm:w-[90%] sm:h-[90%] sm:max-w-4xl sm:rounded-2xl overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">{selectedPdf.title}</h3>
                <p className="text-xs text-slate-400">Template {selectedPdf.category} · Généré par Bookzy</p>
              </div>
              <button onClick={() => setSelectedPdf(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="flex-1 bg-slate-50 relative">
              {isLoadingPdf && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10">
                  <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-3" />
                  <p className="text-slate-500 text-sm">Chargement du PDF...</p>
                </div>
              )}
              <iframe src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(selectedPdf.pdfUrl)}`} className="w-full h-full border-0" title={selectedPdf.title} onLoad={() => setIsLoadingPdf(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}