"use client";

import { useState, useEffect } from "react";
import { X, ArrowRight } from "lucide-react";
import Link from "next/link";

// ─── 4 vrais ebooks générés par Bookzy ───────────────────────────────────────
const examples = [
  {
    id: 1,
    title: "Réussir sa Relation à Distance",
    category: "Fashion",
    pdfUrl: "https://res.cloudinary.com/dcmlw5hak/raw/upload/v1773187763/bookzy/ebooks/reussir-sa-relation-a-distance-69b0b254370bdef7d6198a45.pdf",
    // Template Fashion
    cover: {
      bg: "linear-gradient(135deg, #9f1239 0%, #be185d 100%)",
      spine: "rgba(0,0,0,0.28)",
      badge: "FASHION",
      badgeStyle: { border: "1.5px solid rgba(255,255,255,0.55)", color: "#fff", background: "transparent" },
      titleColor: "#fff",
      accentColor: "rgba(255,255,255,0.5)",
      font: "Georgia, serif",
      corners: true,
      pattern: "fashion",
    },
  },
  {
    id: 2,
    title: "Maîtriser WhatsApp Business",
    category: "Business",
    pdfUrl: "https://res.cloudinary.com/dcmlw5hak/raw/upload/v1773188104/bookzy/ebooks/maitriser-whatsapp-business-69b0b393370bdef7d6198af1.pdf",
    // Template Business
    cover: {
      bg: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      spine: "rgba(0,0,0,0.3)",
      badge: "PREMIUM",
      badgeStyle: { border: "1.5px solid #b8860b", color: "#b8860b", background: "transparent" },
      titleColor: "#fff",
      accentColor: "#d4af37",
      font: "Inter, sans-serif",
      accentBar: true,
      pattern: "business",
    },
  },
  {
    id: 3,
    title: "Musculation à la Maison",
    category: "Sport",
    pdfUrl: "https://res.cloudinary.com/dcmlw5hak/raw/upload/v1773188410/bookzy/ebooks/musculation-a-la-maison-le-programme-complet-sans-materiel-69b0b4c7370bdef7d6198.pdf",
    // Template Sport
    cover: {
      bg: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      spine: "rgba(0,0,0,0.3)",
      badge: "⚡ SPORT",
      badgeStyle: { background: "#ef4444", color: "#fff", border: "none" },
      titleColor: "#fff",
      accentColor: "#ef4444",
      font: "Inter, sans-serif",
      diagonal: true,
      pattern: "sport",
    },
  },
  {
    id: 4,
    title: "Intelligence Artificielle pour Débutants",
    category: "Tech",
    pdfUrl: "https://res.cloudinary.com/dcmlw5hak/raw/upload/v1773189314/bookzy/ebooks/intelligence-artificielle-pour-debutants-guide-2026-69b0b858370bdef7d6198cba.pdf",
    // Template Tech
    cover: {
      bg: "linear-gradient(135deg, #0a0e27 0%, #1e3a8a 100%)",
      spine: "rgba(0,0,0,0.3)",
      badge: "TECH",
      badgeStyle: { border: "1.5px solid #00d4ff", color: "#00d4ff", background: "transparent" },
      titleColor: "#00d4ff",
      accentColor: "#00d4ff",
      font: "Inter, sans-serif",
      grid: true,
      pattern: "tech",
    },
  },
];

// ─── Mini cover CSS fidèle au vrai template ───────────────────────────────────
function EbookCoverCSS({ cover, title, isActive }) {
  const words = title.split(" ");
  const line1 = words.slice(0, Math.ceil(words.length / 2)).join(" ");
  const line2 = words.slice(Math.ceil(words.length / 2)).join(" ");

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: cover.bg,
        borderRadius: "2px 8px 8px 2px",
        overflow: "hidden",
        boxShadow: isActive
          ? "0 32px 64px rgba(0,0,0,0.5), 4px 0 0 rgba(0,0,0,0.15)"
          : "0 8px 24px rgba(0,0,0,0.3)",
        transition: "box-shadow 0.3s",
      }}
    >
      {/* Spine */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 5,
        background: cover.spine, zIndex: 3,
      }} />

      {/* Barre or latérale — Business */}
      {cover.accentBar && (
        <div style={{
          position: "absolute", left: 5, top: 0, bottom: 0, width: 4,
          background: `linear-gradient(180deg, #b8860b, #d4af37)`,
          zIndex: 3,
        }} />
      )}

      {/* Grid — Tech */}
      {cover.grid && (
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `linear-gradient(${cover.accentColor}18 1px, transparent 1px), linear-gradient(90deg, ${cover.accentColor}18 1px, transparent 1px)`,
          backgroundSize: "22px 22px",
        }} />
      )}

      {/* Diagonal rouge — Sport */}
      {cover.diagonal && (
        <>
          <div style={{
            position: "absolute", inset: 0,
            background: "repeating-linear-gradient(-45deg, transparent, transparent 24px, rgba(239,68,68,0.08) 24px, rgba(239,68,68,0.08) 48px)",
          }} />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "35%",
            background: "rgba(239,68,68,0.18)",
            clipPath: "polygon(0 40%, 100% 0%, 100% 100%, 0% 100%)",
          }} />
        </>
      )}

      {/* Coins décoratifs — Fashion */}
      {cover.corners && (
        <>
          {[
            { top: 8, left: 8, borderRight: "none", borderBottom: "none" },
            { top: 8, right: 8, borderLeft: "none", borderBottom: "none" },
            { bottom: 8, left: 8, borderRight: "none", borderTop: "none" },
            { bottom: 8, right: 8, borderLeft: "none", borderTop: "none" },
          ].map((s, i) => (
            <div key={i} style={{
              position: "absolute", width: 14, height: 14,
              border: "1.5px solid rgba(255,255,255,0.35)",
              ...s,
            }} />
          ))}
        </>
      )}

      {/* Contenu cover */}
      <div style={{
        position: "relative", zIndex: 4,
        padding: "14px 12px 10px 16px",
        display: "flex", flexDirection: "column", height: "100%",
      }}>
        {/* Badge */}
        <div style={{
          display: "inline-block",
          padding: "2px 8px",
          borderRadius: 20,
          fontSize: 7,
          fontWeight: 800,
          letterSpacing: "0.08em",
          marginBottom: 10,
          width: "fit-content",
          ...cover.badgeStyle,
        }}>
          {cover.badge}
        </div>

        {/* Titre */}
        <div style={{
          fontFamily: cover.font,
          fontWeight: 800,
          fontSize: 11,
          color: cover.titleColor,
          lineHeight: 1.3,
          marginBottom: 8,
          flex: 1,
          textShadow: cover.pattern === "tech" ? `0 0 12px ${cover.accentColor}` : "none",
        }}>
          {line1}<br />{line2}
        </div>

        {/* Ligne accent */}
        <div style={{
          width: "55%", height: 1.5, borderRadius: 1,
          background: cover.accentColor,
          marginBottom: 6,
        }} />

        {/* Lignes texte simulées */}
        {[80, 65, 72, 58].map((w, i) => (
          <div key={i} style={{
            width: `${w}%`, height: 1.5, borderRadius: 1,
            background: "rgba(255,255,255,0.12)",
            marginBottom: 3,
          }} />
        ))}

        {/* Auteur bas */}
        <div style={{
          marginTop: "auto",
          width: "45%", height: 1.5, borderRadius: 1,
          background: cover.accentColor,
          opacity: 0.7,
        }} />
      </div>

      {/* Ligne neon bas — Tech */}
      {cover.pattern === "tech" && (
        <div style={{
          position: "absolute", bottom: 14, left: 16, right: 16, height: 1,
          background: `linear-gradient(90deg, ${cover.accentColor}, transparent)`,
          zIndex: 4,
        }} />
      )}
    </div>
  );
}

// ─── Étapes (inchangées) ──────────────────────────────────────────────────────
const steps = [
  {
    number: "01",
    label: "Configurez",
    title: "Décrivez votre ebook",
    description: "Sujet, ton, audience, chapitres, pages et template. Moins de 30 secondes.",
    accent: "#60A5FA",
    visual: (
      <div className="rounded-2xl overflow-hidden border border-[#C8BFB0] bg-white p-3 space-y-2.5">
        <div className="bg-[#F5F2ED] rounded-xl p-2.5 space-y-2">
          <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Contenu</div>
          <div className="bg-slate-50 rounded-lg px-2.5 py-1.5 border border-[#D6CFC4] flex items-center justify-between">
            <span className="text-[10px] text-slate-700">Dresser son chien en 30 jours</span>
            <span className="text-blue-500 text-[8px]">✦ Améliorer</span>
          </div>
          <div className="bg-slate-50 rounded-lg px-2.5 py-1.5 border border-[#D6CFC4]">
            <span className="text-[9px] text-slate-400 leading-relaxed">Guide pratique pour dresser votre chien...</span>
          </div>
        </div>
        <div className="bg-[#F5F2ED] rounded-xl p-2.5 space-y-2">
          <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Structure</div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[8px] text-slate-400">Pages</span>
                <span className="text-[10px] font-bold text-slate-900">30</span>
              </div>
              <div className="flex gap-0.5">
                {[20,30,40,50].map((n) => (
                  <div key={n} className={`flex-1 py-1 text-[8px] text-center rounded font-medium ${n === 30 ? "bg-white text-slate-900" : "bg-slate-100 text-slate-400"}`}>{n}</div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[8px] text-slate-400">Chapitres</span>
                <span className="text-[10px] font-bold text-slate-900">6</span>
              </div>
              <div className="flex gap-0.5">
                {[4,5,6,7].map((n) => (
                  <div key={n} className={`flex-1 py-1 text-[8px] text-center rounded font-medium ${n === 6 ? "bg-white text-slate-900" : "bg-slate-100 text-slate-400"}`}>{n}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#F5F2ED] rounded-xl p-2.5 space-y-2">
          <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Style</div>
          <div className="flex gap-1.5">
            {[
              { from: "#2563eb", to: "#7c3aed", active: true },
              { from: "#f59e0b", to: "#fbbf24" },
              { from: "#10b981", to: "#0d9488" },
              { from: "#f97316", to: "#ef4444" },
              { from: "#64748b", to: "#334155" },
              { from: "#8b5cf6", to: "#ec4899" },
            ].map((t, i) => (
              <div
                key={i}
                className={`flex-1 aspect-[3/4] rounded-md overflow-hidden ${t.active ? "ring-1 ring-white ring-offset-1 ring-offset-transparent scale-110" : ""}`}
                style={{ background: `linear-gradient(135deg, ${t.from}, ${t.to})` }}
              />
            ))}
          </div>
          <div className="flex gap-1 flex-wrap">
            {["Professionnel", "Simple", "Expert", "Inspirant"].map((t, i) => (
              <div key={t} className={`px-2 py-0.5 rounded-full text-[8px] font-medium ${i === 0 ? "bg-white text-slate-900" : "bg-slate-100 text-slate-500"}`}>{t}</div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    number: "02",
    label: "Générez",
    title: "L'IA rédige tout",
    description: "Contenu complet, mise en page PDF, cover 3D et textes marketing. En 60 secondes.",
    accent: "#34D399",
    visual: (
      <div className="rounded-2xl overflow-hidden border border-[#C8BFB0] bg-white p-5">
        <div className="flex items-center justify-center mb-4">
          <div className="relative w-16 h-16">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" strokeWidth="3" fill="none" className="stroke-slate-200" />
              <circle cx="32" cy="32" r="28" strokeWidth="3" fill="none" stroke="#34D399" strokeLinecap="round" strokeDasharray="176" strokeDashoffset="44" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-slate-900">75%</span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          {[
            { label: "Sommaire", done: true },
            { label: "Chapitres", done: true },
            { label: "Mise en page", done: true },
            { label: "Cover 3D", done: false, active: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2.5">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? "bg-emerald-50 border border-emerald-200" : item.active ? "border border-slate-200 bg-slate-50" : "border border-slate-100"}`}>
                {item.done && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                {item.active && <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />}
              </div>
              <span className={`text-[11px] ${item.done ? "text-slate-400 line-through" : item.active ? "text-slate-900 font-medium" : "text-slate-300"}`}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    number: "03",
    label: "Vendez",
    title: "Téléchargez et monétisez",
    description: "PDF pro, cover 3D, posts réseaux sociaux, scripts WhatsApp. Tout est prêt.",
    accent: "#F472B6",
    visual: (
      <div className="rounded-2xl overflow-hidden border border-[#C8BFB0] bg-white p-4">
        <div className="flex gap-2 justify-center mb-4">
          {[
            { label: "PDF", from: "#ef4444", to: "#dc2626" },
            { label: "3D", from: "#3b82f6", to: "#7c3aed" },
            { label: "KIT", from: "#10b981", to: "#059669" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1.5">
              <div className="w-11 h-14 rounded-lg shadow-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${item.from}, ${item.to})` }}>
                <span className="text-[9px] font-bold text-white">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5 justify-center">
          {["Posts FB", "Scripts WA", "Instagram", "Cover"].map((tag) => (
            <span key={tag} className="px-2 py-1 bg-white/10 border border-slate-100 rounded-full text-[9px] text-white/60 font-medium">{tag}</span>
          ))}
        </div>
        <div className="mt-3 flex justify-center">
          <div className="px-4 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
            <span className="text-[11px] font-semibold text-emerald-600">✓ Prêt à vendre</span>
          </div>
        </div>
      </div>
    ),
  },
];

// ─── Composant principal ──────────────────────────────────────────────────────
export default function HowItWorksAndExamples() {
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(true);
  const [activeBook, setActiveBook] = useState(0);

  useEffect(() => {
    document.body.style.overflow = selectedPdf ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [selectedPdf]);

  // Auto-rotate les livres
  useEffect(() => {
    const t = setInterval(() => setActiveBook(p => (p + 1) % examples.length), 3000);
    return () => clearInterval(t);
  }, []);

  const openPdf = (ex) => { setSelectedPdf(ex); setIsLoadingPdf(true); };

  return (
    <>
      <div className="relative overflow-hidden" style={{ borderRadius: "2rem 2rem 2rem 2rem", background: "#F5F2ED" }}>

        {/* Grain texture Smart Shop */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }}
        />
        {/* Cercle déco */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-20"
          style={{ background: "radial-gradient(ellipse, #BAE6FD 0%, transparent 70%)" }}
        />

        {/* ── HOW IT WORKS ── */}
        <section id="howitWorks" className="relative z-10 pt-16 lg:pt-24 pb-20 lg:pb-28 px-5 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-14 pb-10 border-b border-[#C8BFB0]">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Comment ça marche</p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[0.92]">
                De l'idée à l'ebook<br />
                <span className="text-blue-500">en moins de 2 min</span>
              </h2>
            </div>
            <div className="grid lg:grid-cols-3 gap-5 lg:gap-6">
              {steps.map((step, i) => (
                <div key={i} className="group relative">
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-6 z-10">
                      <div className="h-px bg-[#C8BFB0] mx-2" />
                    </div>
                  )}
                  <div className="relative rounded-2xl border border-[#C8BFB0] bg-white hover:border-slate-400 hover:shadow-md transition-all duration-300 p-6 h-full flex flex-col gap-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.25em] mb-2" style={{ color: step.accent }}>{step.label}</div>
                        <h3 className="text-lg font-black text-slate-900 leading-snug tracking-tight">{step.title}</h3>
                        <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{step.description}</p>
                      </div>
                      <span className="text-5xl font-black flex-shrink-0 ml-3 leading-none text-[#E8E2D9]">{step.number}</span>
                    </div>
                    <div className="mt-auto">{step.visual}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="h-px bg-[#C8BFB0]" />
        </div>

        {/* ── EXAMPLES ── */}
        <section id="examples" className="relative z-10 pt-20 lg:pt-24 pb-12 lg:pb-16 px-5 sm:px-6">
          <div className="max-w-6xl mx-auto">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14 lg:mb-16 pb-10 border-b border-[#C8BFB0]">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Exemples réels</p>
                <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[0.92]">
                  Générés avec Bookzy
                </h2>
                <p className="text-slate-500 text-base mt-3 max-w-md">
                  Chaque ebook ci-dessous a été généré par l'IA de Bookzy en 64s : contenu, mise en page. Aucun template externe. Aucune retouche. Et chaque ebook est accompagné d'un kit marketing complet.
                </p>
              </div>
              <Link
                href="/auth/register"
                className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all"
              >
                Créer le mien
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Grille 4 ebooks */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-6">
              {examples.map((ex, i) => {
                const isActive = activeBook === i;
                return (
                  <button
                    key={ex.id}
                    onClick={() => openPdf(ex)}
                    onMouseEnter={() => setActiveBook(i)}
                    className="group text-left flex flex-col"
                  >
                    {/* Cover */}
                    <div
                      className="relative mb-3 transition-all duration-300"
                      style={{
                        aspectRatio: "3/4",
                        transform: isActive ? "translateY(-6px) scale(1.02)" : "translateY(0) scale(1)",
                      }}
                    >
                      {/* Pages effet livre */}
                      <div style={{
                        position: "absolute", top: 3, right: -5, bottom: 3,
                        width: 8, background: "#e2e8f0", borderRadius: "0 3px 3px 0", zIndex: 0,
                      }} />
                      <div style={{
                        position: "absolute", top: 6, right: -9, bottom: 6,
                        width: 6, background: "#cbd5e1", borderRadius: "0 3px 3px 0", zIndex: 0,
                      }} />

                      {/* Cover principale */}
                      <div style={{ position: "relative", zIndex: 1, height: "100%", borderRadius: "2px 8px 8px 2px", overflow: "hidden" }}>
                        <EbookCoverCSS cover={ex.cover} title={ex.title} isActive={isActive} />
                      </div>

                      {/* Overlay hover */}
                      <div
                        className="absolute inset-0 rounded-lg flex items-center justify-center transition-opacity duration-200"
                        style={{
                          zIndex: 2,
                          background: "rgba(0,0,0,0.45)",
                          opacity: isActive ? 1 : 0,
                          borderRadius: "2px 8px 8px 2px",
                        }}
                      >
                        <span className="bg-white text-slate-900 text-[11px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                          Voir le PDF
                        </span>
                      </div>
                    </div>

                    {/* Infos */}
                    <div className="px-0.5">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 text-slate-400">
                        {ex.category}
                      </p>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-slate-600 transition-colors line-clamp-2">
                        {ex.title}
                      </h3>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Dots navigation */}
            <div className="flex justify-center gap-2 mb-14 lg:mb-16">
              {examples.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveBook(i)}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: activeBook === i ? 20 : 7,
                    height: 7,
                    background: activeBook === i ? "#0f172a" : "#C8BFB0",
                  }}
                />
              ))}
            </div>

          </div>
        </section>

      </div>

      {/* ── PDF MODAL ── */}
      {selectedPdf && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={() => setSelectedPdf(null)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div
            className="relative z-10 bg-white w-full h-full sm:w-[90%] sm:h-[90%] sm:max-w-4xl sm:rounded-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
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
              <iframe
                src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(selectedPdf.pdfUrl)}`}
                className="w-full h-full border-0"
                title={selectedPdf.title}
                onLoad={() => setIsLoadingPdf(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}