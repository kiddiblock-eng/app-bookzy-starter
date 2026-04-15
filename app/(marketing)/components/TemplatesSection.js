"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`;

const TEMPLATES = [
  { id: "modern", label: "Moderne", bg: ["#667eea", "#764ba2"], pattern: "grid", badge: "PREMIUM", badgeBg: "rgba(255,255,255,.2)", badgeClr: "#fff", accent: "rgba(255,255,255,.85)", tooltip: { couleurs: ["#667eea", "#764ba2"], police: "DM Sans Bold", ideal: "Marketing, business, formations" } },
  { id: "luxe", label: "Luxe", bg: ["#1a1a1a", "#3d2817"], pattern: "frame", badge: "LUXE", badgeBg: "#d4af37", badgeClr: "#111", accent: "#d4af37", italic: true, tooltip: { couleurs: ["#1a1a1a", "#d4af37"], police: "Georgia Italic", ideal: "Coaching, personal branding, luxe" } },
  { id: "educatif", label: "Éducatif", bg: ["#0f766e", "#14b8a6"], pattern: "dots", badge: "FORMATION", badgeBg: "rgba(255,255,255,.2)", badgeClr: "#fff", accent: "rgba(255,255,255,.85)", tooltip: { couleurs: ["#0f766e", "#14b8a6"], police: "DM Sans", ideal: "Formations, tutoriels, guides tech" } },
  { id: "energie", label: "Énergique", bg: ["#f97316", "#dc2626"], pattern: "stripes", badge: "BOOST", badgeBg: "rgba(255,255,255,.2)", badgeClr: "#fff", accent: "rgba(255,255,255,.85)", tooltip: { couleurs: ["#f97316", "#dc2626"], police: "DM Sans ExtraBold", ideal: "Sport, motivation, dev personnel" } },
  { id: "minimal", label: "Minimal", bg: ["#ffffff", "#f8fafc"], pattern: "border", darkText: true, badge: "GUIDE", badgeBg: "#f1f5f9", badgeClr: "#64748b", accent: "#1e293b", tooltip: { couleurs: ["#ffffff", "#1e293b"], police: "DM Sans Light", ideal: "Essais, philosophie, minimalisme" } },
  { id: "creative", label: "Créatif", bg: ["#a855f7", "#ec4899"], pattern: "blobs", badge: "CREATIF", badgeBg: "rgba(255,255,255,.2)", badgeClr: "#fff", accent: "rgba(255,255,255,.85)", tooltip: { couleurs: ["#a855f7", "#ec4899"], police: "DM Sans", ideal: "Créativité, design, art, culture" } },
  { id: "tech", label: "Tech", bg: ["#0a0e27", "#1e3a8a"], pattern: "code", badge: "TECH", badgeBg: "transparent", badgeClr: "#00d4ff", accent: "#00d4ff", border: "#00d4ff", tooltip: { couleurs: ["#0a0e27", "#00d4ff"], police: "DM Sans Mono", ideal: "IA, cybersécurité, crypto, dev" } },
  { id: "afrique", label: "Afrique", bg: ["#78350f", "#d97706"], pattern: "kente", badge: "AFRIQUE", badgeBg: "rgba(255,255,255,.2)", badgeClr: "#fff", accent: "#fbbf24", tooltip: { couleurs: ["#78350f", "#fbbf24"], police: "DM Sans Bold", ideal: "Entrepreneuriat africain, culture" } },
  { id: "corporate", label: "Corporate", bg: ["#1e40af", "#3b82f6"], pattern: "bars", badge: "BUSINESS", badgeBg: "rgba(255,255,255,.2)", badgeClr: "#fff", accent: "rgba(255,255,255,.85)", tooltip: { couleurs: ["#1e40af", "#3b82f6"], police: "DM Sans SemiBold", ideal: "B2B, management, stratégie" } },
  { id: "wellness", label: "Wellness", bg: ["#f3e8ff", "#c4b5fd"], pattern: "soft", darkText: true, badge: "BIEN-ETRE", badgeBg: "rgba(139,92,246,.15)", badgeClr: "#5b21b6", accent: "#7c3aed", tooltip: { couleurs: ["#f3e8ff", "#7c3aed"], police: "DM Sans Light", ideal: "Méditation, santé mentale, yoga" } },
  { id: "retro", label: "Rétro", bg: ["#92400e", "#b45309"], pattern: "lines", badge: "VINTAGE", badgeBg: "transparent", badgeClr: "#fbbf24", accent: "#fbbf24", border: "#fbbf24", italic: true, tooltip: { couleurs: ["#92400e", "#fbbf24"], police: "Georgia Italic", ideal: "Récits, mémoires, histoire, culture" } },
  { id: "nature", label: "Nature", bg: ["#166534", "#15803d"], pattern: "leaves", badge: "NATURE", badgeBg: "rgba(255,255,255,.2)", badgeClr: "#fff", accent: "rgba(255,255,255,.85)", tooltip: { couleurs: ["#166534", "#15803d"], police: "DM Sans", ideal: "Bien-être, écologie, alimentation" } },
];

function CoverSVG({ t, W = 160, H = 210, uid }) {
  const [c1, c2] = t.bg;
  const isWhite = c1 === "#ffffff";
  const tc = t.darkText ? "#0f172a" : "white";
  const ff = t.italic ? "Georgia,serif" : "DM Sans,sans-serif";
  const w1 = t.darkText ? "rgba(0,0,0,.07)" : "rgba(255,255,255,.12)";
  const pat = {
    grid:    `<defs><pattern id="pg${uid}" width="14" height="14" patternUnits="userSpaceOnUse"><path d="M14 0H0V14" fill="none" stroke="${w1}" stroke-width=".5"/></pattern></defs><rect width="${W}" height="${H}" fill="url(#pg${uid})"/>`,
    frame:   `<rect x="6" y="6" width="${W-12}" height="${H-12}" rx="1" fill="none" stroke="rgba(255,255,255,.22)" stroke-width="1"/>`,
    dots:    `<defs><pattern id="pd${uid}" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4.5" cy="4.5" r=".7" fill="${w1}"/></pattern></defs><rect width="${W}" height="${H}" fill="url(#pd${uid})"/>`,
    stripes: `<defs><pattern id="ps${uid}" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)"><rect width="5" height="10" fill="rgba(255,255,255,.07)"/></pattern></defs><rect width="${W}" height="${H}" fill="url(#ps${uid})"/>`,
    border:  `<rect x="6" y="6" width="${W-12}" height="${H-12}" fill="none" stroke="#e2e8f0" stroke-width="1"/>`,
    blobs:   `<ellipse cx="${W*.85}" cy="${H*.14}" rx="36" ry="36" fill="rgba(255,255,255,.1)"/><ellipse cx="${W*.12}" cy="${H*.84}" rx="24" ry="24" fill="rgba(255,255,255,.06)"/>`,
    code:    `<defs><pattern id="pc${uid}" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="8" height="16" fill="rgba(0,212,255,.03)"/></pattern></defs><rect width="${W}" height="${H}" fill="url(#pc${uid})"/><line x1="0" y1="${H-4}" x2="${W}" y2="${H-4}" stroke="#00d4ff" stroke-width="1.5"/>`,
    leaves:  `<text x="${W*.62}" y="${H*.17}" font-size="18" opacity=".13">🌿</text>`,
    bars:    `<rect x="12" y="${H*.76}" width="8" height="${H*.2}" fill="rgba(255,255,255,.18)"/><rect x="25" y="${H*.66}" width="8" height="${H*.3}" fill="rgba(255,255,255,.18)"/><rect x="38" y="${H*.71}" width="8" height="${H*.25}" fill="rgba(255,255,255,.18)"/>`,
    lines:   `<defs><pattern id="pl${uid}" width="10" height="8" patternUnits="userSpaceOnUse"><line x1="0" y1="0" x2="10" y2="0" stroke="rgba(255,255,255,.07)" stroke-width="1"/></pattern></defs><rect width="${W}" height="${H}" fill="url(#pl${uid})"/>`,
    soft:    `<defs><radialGradient id="rg${uid}" cx="70%" cy="30%"><stop offset="0%" stop-color="rgba(139,92,246,.28)"/><stop offset="100%" stop-color="transparent"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#rg${uid})"/>`,
    kente:   `<rect x="0" y="${H-13}" width="${W*.25}" height="13" fill="#d97706"/><rect x="${W*.25}" y="${H-13}" width="${W*.25}" height="13" fill="#dc2626"/><rect x="${W*.5}" y="${H-13}" width="${W*.25}" height="13" fill="rgba(255,255,255,.8)"/><rect x="${W*.75}" y="${H-13}" width="${W*.25}" height="13" fill="#d97706"/>`,
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <linearGradient id={`gr${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c1}/><stop offset="100%" stopColor={c2}/>
        </linearGradient>
        <clipPath id={`cp${uid}`}><rect width={W} height={H} rx="6"/></clipPath>
      </defs>
      <g clipPath={`url(#cp${uid})`}>
        <rect width={W} height={H} fill={isWhite ? "#f8fafc" : `url(#gr${uid})`}/>
        {isWhite && <rect width={W} height={H} fill="white"/>}
        <g dangerouslySetInnerHTML={{ __html: pat[t.pattern] || "" }}/>
        <rect x="0" y="0" width="4" height={H} fill="rgba(0,0,0,.18)"/>
        <rect x="10" y="11" width={Math.min(t.badge.replace(/[^\x00-\x7F]/g, "xx").length * 5.2 + 12, W - 20)} height="14" rx="7" fill={t.badgeBg} stroke={t.border || "none"} strokeWidth={t.border ? 0.8 : 0}/>
        <text x="16" y="21" fontFamily="DM Sans,sans-serif" fontSize="6" fontWeight="700" fill={t.badgeClr} letterSpacing=".3">{t.badge}</text>
        <text x="10" y="46" fontFamily={ff} fontSize={12} fontWeight="800" fontStyle={t.italic ? "italic" : "normal"} fill={tc}>{t.label}</text>
        <rect x="10" y="62" width={W * 0.48} height="1.8" rx="1" fill={t.accent}/>
        {[0,1,2].map(i => <rect key={i} x="10" y={75 + i * 7} width={W * (.32 + (i % 3) * .13)} height="1.3" rx="1" fill="rgba(255,255,255,.11)"/>)}
        <rect x="10" y={H - 12} width={W * 0.36} height="1.5" rx="1" fill={t.accent}/>
      </g>
    </svg>
  );
}

function Tooltip({ t, visible }) {
  if (!visible) return null;
  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 w-52 pointer-events-none">
      <div className="rounded-2xl p-4 shadow-2xl text-left border border-[#E8E8E8]" style={{ background: "#FAFAFA" }}>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Couleurs</p>
        <div className="flex gap-2 mb-3">
          {t.tooltip.couleurs.map((c, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full border border-[#E8E8E8] flex-shrink-0" style={{ background: c }}/>
              <span className="text-[9px] text-slate-500 font-mono">{c}</span>
            </div>
          ))}
        </div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Police</p>
        <p className="text-xs text-slate-900 font-bold mb-3">{t.tooltip.police}</p>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Idéal pour</p>
        <p className="text-[11px] text-slate-500 leading-relaxed">{t.tooltip.ideal}</p>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[7px] border-r-[7px] border-t-[7px] border-l-transparent border-r-transparent border-t-[#E8E8E8]"/>
    </div>
  );
}

export default function TemplatesSection() {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState("modern");
  const [modal, setModal] = useState(null);
  const selectedT = TEMPLATES.find(t => t.id === selected);

  return (
    <section className="relative pt-16 pb-8 lg:py-24 overflow-hidden w-full max-w-full" style={{ background: "#FAFAFA" }}>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        <div className="mb-12 lg:mb-16 pb-10 border-b border-[#E8E8E8]">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Design professionnel</p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[0.92]">
              Votre ebook mérite une<br />
              <span className="text-blue-500">couverture qui vend</span>
            </h2>
            <p className="text-slate-500 text-base sm:max-w-xs leading-relaxed">
              12 templates inclus dans chaque plan. Choisissez, l'IA applique le design automatiquement.
            </p>
          </div>
        </div>

        <div className="mb-4 lg:mb-10">
          <div className="overflow-hidden w-full">
            <div className="flex gap-3 overflow-x-auto pb-3 lg:hidden scrollbar-hide px-5" style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}>
              {TEMPLATES.map((t, i) => (
                <div key={t.id} className="flex-shrink-0 flex flex-col items-center gap-2 relative" style={{ scrollSnapAlign: "start", width: "120px" }} onMouseEnter={() => setHovered(t.id)} onMouseLeave={() => setHovered(null)}>
                  <Tooltip t={t} visible={hovered === t.id}/>
                  <button onClick={() => { setSelected(t.id); setModal(t); }} className={`relative w-full rounded-xl overflow-hidden transition-all duration-200 border-2 ${selected === t.id ? "border-slate-900 shadow-lg" : "border-[#E8E8E8] hover:border-slate-400"}`}>
                    <CoverSVG t={t} W={160} H={210} uid={`m${i}`}/>
                    {selected === t.id && <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center shadow-sm"><svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg></div>}
                  </button>
                  <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${selected === t.id ? "text-slate-900" : "text-slate-400"}`}>{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-6 gap-3">
            {TEMPLATES.map((t, i) => (
              <div key={t.id} className="relative flex flex-col items-center gap-2" onMouseEnter={() => setHovered(t.id)} onMouseLeave={() => setHovered(null)}>
                <Tooltip t={t} visible={hovered === t.id}/>
                <button onClick={() => { setSelected(t.id); setModal(t); }} className={`relative w-full rounded-xl overflow-hidden transition-all duration-200 border-2 group ${selected === t.id ? "border-slate-900 shadow-lg scale-[1.04]" : "border-[#E8E8E8] hover:border-slate-400 hover:shadow-md hover:-translate-y-1"}`}>
                  <CoverSVG t={t} W={160} H={210} uid={`g${i}`}/>
                  {selected === t.id && <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center shadow-sm"><svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg></div>}
                </button>
                <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${selected === t.id ? "text-slate-900" : "text-slate-400"}`}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        {selectedT && (
          <div className="hidden lg:flex rounded-2xl border border-[#E8E8E8] bg-white p-6 lg:p-10 flex-col lg:flex-row items-center gap-8 lg:gap-14 relative overflow-hidden">
            <div className="flex-shrink-0 relative z-10">
              <div className="relative" style={{ perspective: "900px" }}>
                <div style={{ transform: "rotateY(-12deg)", filter: "drop-shadow(20px 16px 32px rgba(0,0,0,.15))" }}>
                  <CoverSVG t={selectedT} W={180} H={250} uid="prev"/>
                </div>
                <div className="absolute top-2 right-[-10px] bottom-2 w-3 bg-slate-100 rounded-r-sm"/>
                <div className="absolute top-4 right-[-16px] bottom-4 w-2 bg-slate-200 rounded-r-sm"/>
              </div>
            </div>
            <div className="flex-1 text-left relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">Template sélectionné</p>
              <h3 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight mb-1">{selectedT.label}</h3>
              <p className="text-slate-500 text-sm mb-6">{selectedT.tooltip.ideal}</p>
              <div className="flex flex-wrap gap-8 mb-8">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Couleurs</p>
                  <div className="flex gap-2">
                    {selectedT.tooltip.couleurs.map((c, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full border-2 border-[#E8E8E8] shadow-sm" style={{ background: c }}/>
                        <span className="text-xs text-slate-500 font-mono">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Police</p>
                  <span className="text-sm font-bold text-slate-900">{selectedT.tooltip.police}</span>
                </div>
              </div>
              <div className="w-full h-px bg-[#E8E8E8] mb-6" />
              <Link href="/auth/register" className="inline-flex items-center gap-2 px-7 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all">
                Utiliser ce template <ArrowRight className="w-4 h-4"/>
              </Link>
            </div>
          </div>
        )}

        <div className="hidden lg:block text-center mt-8">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            12 templates inclus. Aucun frais supplémentaire.{" "}
            <Link href="/auth/register" className="text-slate-900 hover:text-slate-600 underline underline-offset-4 transition-colors">Commencer gratuitement</Link>
          </p>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-5" onClick={() => setModal(null)}>
          <div className="rounded-2xl overflow-hidden w-full max-w-sm shadow-2xl border border-[#E8E8E8] relative" style={{ background: "#FAFAFA", animation: "popIn .2s ease" }} onClick={e => e.stopPropagation()}>
            <div className="relative z-10">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E8E8]">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Template</p>
                  <span className="font-black text-slate-900 tracking-tight">{modal.label}</span>
                </div>
                <button onClick={() => setModal(null)} className="w-8 h-8 rounded-lg bg-white border border-[#E8E8E8] hover:border-slate-400 flex items-center justify-center transition-all">
                  <X className="w-4 h-4 text-slate-500"/>
                </button>
              </div>
              <div className="flex items-center justify-center py-10 px-8" style={{ background: "white" }}>
                <div style={{ perspective: "900px" }}>
                  <div style={{ transform: "rotateY(-8deg)", filter: "drop-shadow(16px 12px 24px rgba(0,0,0,.18))" }}>
                    <CoverSVG t={modal} W={200} H={280} uid="modal"/>
                  </div>
                </div>
              </div>
              <div className="px-5 py-5 border-t border-[#E8E8E8] space-y-4">
                <div className="flex gap-6">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Couleurs</p>
                    <div className="flex gap-1.5">{modal.tooltip.couleurs.map((c, i) => <div key={i} className="w-5 h-5 rounded-full border border-[#E8E8E8] shadow-sm" style={{ background: c }}/>)}</div>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Police</p>
                    <p className="text-xs font-bold text-slate-900">{modal.tooltip.police}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Idéal pour</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{modal.tooltip.ideal}</p>
                  </div>
                </div>
                <div className="w-full h-px bg-[#E8E8E8]" />
                <Link href="/auth/register" className="flex items-center justify-center gap-2 w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all">
                  Utiliser ce template <ArrowRight className="w-4 h-4"/>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes popIn { from { opacity:0; transform:scale(.95) translateY(8px); } to { opacity:1; transform:none; } } .scrollbar-hide::-webkit-scrollbar { display:none; } .scrollbar-hide { -ms-overflow-style:none; scrollbar-width:none; }`}</style>
    </section>
  );
}