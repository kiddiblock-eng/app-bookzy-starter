"use client";
import { Suspense } from "react";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2, Loader2, FileText, MessageCircle, PenTool,
  Download, Smartphone, ArrowRight, ArrowLeft, Check, BookOpen,
  X, Lock, FileCheck2, ArrowUpRightFromCircleIcon, CreditCard, Menu,
  Plus, Target, Radio, Youtube, BarChart2
} from "lucide-react";
import { useCredits } from "@/hooks/useCredits";

// ── DONNÉES ────────────────────────────────────────────────────────────────────
const TEMPLATES = [
  { id: "modern",    label: "Moderne",   primaryColor: "#667eea", accentColor: "#764ba2", preview: { bg: "linear-gradient(135deg,#667eea,#764ba2)", badge: "PREMIUM",  badgeStyle: "bg-white/20 text-white",                   pattern: "grid" }},
  { id: "luxe",      label: "Luxe",      primaryColor: "#1a1a1a", accentColor: "#d4af37", preview: { bg: "linear-gradient(135deg,#1a1a1a,#3d2817)", badge: "LUXE",     badgeStyle: "bg-amber-400 text-black",                  pattern: "frame" }},
  { id: "educatif",  label: "Éducatif",  primaryColor: "#0f766e", accentColor: "#14b8a6", preview: { bg: "linear-gradient(135deg,#0f766e,#14b8a6)", badge: "FORMATION",badgeStyle: "bg-white/20 text-white",                   pattern: "dots" }},
  { id: "energie",   label: "Énergique", primaryColor: "#f97316", accentColor: "#dc2626", preview: { bg: "linear-gradient(135deg,#f97316,#dc2626)", badge: "BOOST",    badgeStyle: "bg-white/20 text-white",                   pattern: "stripes" }},
  { id: "minimal",   label: "Minimal",   primaryColor: "#1e293b", accentColor: "#64748b", preview: { bg: "#ffffff",                                  badge: "GUIDE",    badgeStyle: "bg-slate-100 text-slate-500",              pattern: "border" }},
  { id: "creative",  label: "Créatif",   primaryColor: "#a855f7", accentColor: "#ec4899", preview: { bg: "linear-gradient(135deg,#a855f7,#ec4899)", badge: "CRÉATIF",  badgeStyle: "bg-white/20 text-white",                   pattern: "blobs" }},
  { id: "tech",      label: "Tech",      primaryColor: "#0a0e27", accentColor: "#00d4ff", preview: { bg: "linear-gradient(135deg,#0a0e27,#1e3a8a)", badge: "TECH",     badgeStyle: "border border-cyan-400 text-cyan-400",     pattern: "code" }},
  { id: "nature",    label: "Nature",    primaryColor: "#166534", accentColor: "#15803d", preview: { bg: "linear-gradient(135deg,#166534,#15803d)", badge: "NATURE",   badgeStyle: "bg-white/20 text-white",                   pattern: "leaves" }},
  { id: "fashion",   label: "Fashion",   primaryColor: "#9f1239", accentColor: "#be185d", preview: { bg: "linear-gradient(135deg,#9f1239,#be185d)", badge: "STYLE",    badgeStyle: "border border-white text-white",           pattern: "frame" }},
  { id: "corporate", label: "Corporate", primaryColor: "#1e40af", accentColor: "#3b82f6", preview: { bg: "linear-gradient(135deg,#1e40af,#3b82f6)", badge: "BUSINESS", badgeStyle: "bg-white/20 text-white",                   pattern: "bars" }},
  { id: "retro",     label: "Rétro",     primaryColor: "#92400e", accentColor: "#b45309", preview: { bg: "linear-gradient(135deg,#92400e,#b45309)", badge: "VINTAGE",  badgeStyle: "border border-amber-300 text-amber-300",   pattern: "lines" }},
  { id: "futuriste", label: "Futuriste", primaryColor: "#5b21b6", accentColor: "#7c3aed", preview: { bg: "linear-gradient(135deg,#5b21b6,#7c3aed)", badge: "FUTURE",   badgeStyle: "border border-violet-300 text-violet-300", pattern: "hex" }},
  { id: "afrique",   label: "Afrique",   primaryColor: "#78350f", accentColor: "#d97706", preview: { bg: "linear-gradient(135deg,#78350f,#b45309,#d97706)", badge: "AFRIQUE", badgeStyle: "bg-white/20 text-white",            pattern: "kente" }},
  { id: "sport",     label: "Sport",     primaryColor: "#0f172a", accentColor: "#ef4444", preview: { bg: "linear-gradient(135deg,#0f172a,#1e293b)", badge: "SPORT",    badgeStyle: "bg-red-500 text-white",                    pattern: "diagonal" }},
  { id: "wellness",  label: "Wellness",  primaryColor: "#8b5cf6", accentColor: "#c4b5fd", preview: { bg: "linear-gradient(135deg,#f3e8ff,#c4b5fd)", badge: "BIEN-ÊTRE",badgeStyle: "bg-purple-200/60 text-purple-800",         pattern: "soft" }},
  { id: "business",  label: "Business",  primaryColor: "#0f172a", accentColor: "#b8860b", preview: { bg: "linear-gradient(135deg,#0f172a,#1e293b)", badge: "PREMIUM",  badgeStyle: "border border-yellow-500 text-yellow-500", pattern: "gold" }},
];

const TONES = ["Professionnel", "Simple", "Expert", "Inspirant"];
const AUDIENCES = ["Débutants", "Étudiants", "Freelances", "Entrepreneurs", "Grand Public"];
const PAGES_OPTIONS = [20, 30, 40, 50, 60, 70, 80];
const CHAPTERS_OPTIONS = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// Lanceur d'outils (menu "+") — chaque entrée ouvre la page de l'outil
const TOOLS = [
  { label: "Valider une idée", desc: "Score de rentabilité", href: "/dashboard/analyseur", icon: BarChart2 },
  { label: "Niche Hunter", desc: "Trouver une niche", href: "/dashboard/niche-hunter", icon: Target },
  { label: "Radar Cash", desc: "Espionner les pubs qui cartonnent", href: "/dashboard/radar-cash", icon: Radio },
  { label: "Youbook", desc: "Vidéo YouTube en ebook", href: "/dashboard/youbook", icon: Youtube },
  { label: "Ebook Designer", desc: "Word en PDF pro", href: "/dashboard/express", icon: FileText },
  { label: "Romans IA", desc: "Écrire un roman", href: "/dashboard/romans", icon: BookOpen },
];

// ── BOOK 3D ────────────────────────────────────────────────────────────────────
const Book3D = ({ title, template, size = "md" }) => {
  const tmpl = TEMPLATES.find(t => t.id === template) || TEMPLATES[0];
  const displayTitle = title || "Votre titre ici";
  const dims = size === "lg"
    ? "w-48 h-64 sm:w-56 sm:h-72"
    : "w-36 h-48 sm:w-44 sm:h-56";

  return (
    <div className={`relative ${dims} mx-auto select-none`}>
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-4 bg-black/20 blur-xl rounded-full" />
      <div className="absolute inset-0 rounded-r-md rounded-l-[2px] shadow-2xl overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${tmpl.primaryColor}, ${tmpl.accentColor})` }}>
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-black/20 to-transparent" />
        <div className="absolute inset-0 p-4 flex flex-col text-white">
          <div className="text-[7px] uppercase tracking-[0.2em] opacity-60 mb-2">Guide</div>
          <h3 className="text-sm font-bold leading-tight flex-1">{displayTitle}</h3>
        </div>
      </div>
      <div className="absolute top-1 -right-1 bottom-1 w-2 bg-white rounded-r-sm -z-10" />
      <div className="absolute top-2 -right-2 bottom-2 w-1 bg-slate-100 rounded-r-sm -z-20" />
    </div>
  );
};

// ── MINI COVER PREVIEW ─────────────────────────────────────────────────────────
const MiniCoverPreview = ({ t, isSelected }) => {
  const p = t.preview;
  const patterns = {
    grid:     <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)",backgroundSize:"12px 12px"}} />,
    frame:    <div style={{position:"absolute",inset:"6px",border:"1px solid rgba(255,255,255,.3)"}} />,
    dots:     <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(255,255,255,.15) 1px,transparent 1px)",backgroundSize:"8px 8px"}} />,
    stripes:  <div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(-45deg,transparent,transparent 6px,rgba(255,255,255,.08) 6px,rgba(255,255,255,.08) 12px)"}} />,
    border:   <div style={{position:"absolute",inset:"6px",border:"1px solid #e2e8f0"}} />,
    blobs:    <div style={{position:"absolute",width:"60px",height:"60px",borderRadius:"30% 70% 70% 30%",background:"rgba(255,255,255,.15)",top:"-10px",right:"-10px"}} />,
    code:     <div style={{position:"absolute",bottom:"8px",left:"8px",right:"8px",height:"2px",background:"linear-gradient(90deg,#00d4ff,transparent)"}} />,
    leaves:   <div style={{position:"absolute",top:"4px",right:"6px",fontSize:"18px",opacity:.25}}>🌿</div>,
    bars:     <><div style={{position:"absolute",bottom:0,left:"10px",width:"8px",height:"20px",background:"rgba(255,255,255,.2)"}} /><div style={{position:"absolute",bottom:0,left:"22px",width:"8px",height:"30px",background:"rgba(255,255,255,.2)"}} /><div style={{position:"absolute",bottom:0,left:"34px",width:"8px",height:"24px",background:"rgba(255,255,255,.2)"}} /></>,
    lines:    <div style={{position:"absolute",inset:0,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 8px,rgba(255,255,255,.06) 8px,rgba(255,255,255,.06) 9px)"}} />,
    hex:      <div style={{position:"absolute",bottom:"8px",right:"8px",width:"20px",height:"14px",background:"rgba(167,139,250,.4)",clipPath:"polygon(30% 0%,70% 0%,100% 50%,70% 100%,30% 100%,0% 50%)"}} />,
    kente:    <div style={{position:"absolute",bottom:0,left:0,right:0,height:"6px",background:"repeating-linear-gradient(90deg,#d97706 0,#d97706 8px,#dc2626 8px,#dc2626 16px,white 16px,white 24px)"}} />,
    diagonal: <div style={{position:"absolute",bottom:0,left:0,right:0,height:"25px",background:"#ef4444",clipPath:"polygon(0 60%,100% 0%,100% 100%,0% 100%)",opacity:.5}} />,
    soft:     <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle at 70% 30%,rgba(139,92,246,.3),transparent 60%)"}} />,
    gold:     <div style={{position:"absolute",left:0,top:0,bottom:0,width:"4px",background:"linear-gradient(180deg,#b8860b,#d4af37)"}} />,
  };
  return (
    <div style={{position:"relative",width:"100%",aspectRatio:"3/4",borderRadius:"8px",overflow:"hidden",background:p.bg,
      boxShadow:isSelected?"0 0 0 2.5px #6366f1, 0 0 0 4px white":"0 2px 8px rgba(0,0,0,.15)",
      transform:isSelected?"scale(1.04)":"scale(1)",transition:"transform .15s, box-shadow .15s"}}>
      {patterns[p.pattern]||null}
      <div style={{position:"absolute",left:0,top:0,bottom:0,width:"4px",background:"rgba(0,0,0,.2)"}} />
      <div style={{position:"relative",zIndex:1,padding:"10px 8px 8px 12px",display:"flex",flexDirection:"column",height:"100%"}}>
        <div style={{fontSize:"5px",fontWeight:700,letterSpacing:"0.05em",padding:"2px 5px",borderRadius:"20px",marginBottom:"6px",width:"fit-content",lineHeight:1.4}} className={p.badgeStyle}>{p.badge}</div>
        <div style={{width:"70%",height:"3px",borderRadius:"2px",background:"rgba(255,255,255,.6)",marginBottom:"3px"}} />
        <div style={{width:"50%",height:"2px",borderRadius:"2px",background:"rgba(255,255,255,.35)",marginBottom:"8px"}} />
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:"2.5px"}}>
          {[85,70,75,60].map((w,i)=><div key={i} style={{width:`${w}%`,height:"2px",borderRadius:"1px",background:"rgba(255,255,255,.2)"}} />)}
        </div>
        <div style={{width:"55%",height:"2px",borderRadius:"1px",background:"rgba(255,255,255,.4)",marginTop:"auto"}} />
      </div>
      {isSelected&&<div style={{position:"absolute",top:"5px",right:"5px",width:"16px",height:"16px",borderRadius:"50%",background:"#6366f1",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <svg width="8" height="8" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5 4-4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
      </div>}
    </div>
  );
};

// ── TEMPLATE PICKER ────────────────────────────────────────────────────────────
const TemplatePicker = ({ value, onChange }) => {
  const [showAll, setShowAll] = useState(false);
  const selected = TEMPLATES.find(t => t.id === value) || TEMPLATES[0];
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"10px"}}>
        {TEMPLATES.slice(0, showAll ? 16 : 8).map(t => (
          <button key={t.id} type="button" onClick={() => onChange(t.id)}
            style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"5px",background:"none",border:"none",cursor:"pointer",padding:0}}>
            <MiniCoverPreview t={t} isSelected={value === t.id} />
            <span style={{fontSize:"9px",fontWeight:value===t.id?700:500,color:value===t.id?"#0f172a":"#64748b",textAlign:"center",lineHeight:1.2,width:"100%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.label}</span>
          </button>
        ))}
      </div>
      <button type="button" onClick={() => setShowAll(v => !v)}
        style={{marginTop:"12px",width:"100%",padding:"8px",borderRadius:"10px",border:"1px dashed #cbd5e1",background:"#f8fafc",fontSize:"12px",fontWeight:600,color:"#475569",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"6px"}}>
        {showAll ? "Voir moins" : `Voir les ${TEMPLATES.length - 8} autres templates`}
      </button>
      <div style={{marginTop:"10px",padding:"8px 12px",borderRadius:"8px",background:"#f1f5f9",display:"flex",alignItems:"center",gap:"8px"}}>
        <div style={{width:"28px",height:"38px",borderRadius:"4px",overflow:"hidden",flexShrink:0,background:selected.preview.bg,position:"relative"}}>
          <div style={{position:"absolute",left:0,top:0,bottom:0,width:"3px",background:"rgba(0,0,0,.2)"}} />
        </div>
        <div>
          <div style={{fontWeight:700,color:"#0f172a",fontSize:"12px"}}>{selected.label}</div>
          <div style={{fontSize:"10px",color:"#94a3b8"}}>Template sélectionné</div>
        </div>
      </div>
    </div>
  );
};

// ── NUMBER PICKER ──────────────────────────────────────────────────────────────
const NumberPicker = ({ label, value, options, onChange }) => (
  <div>
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-lg font-bold text-slate-900">{value}</span>
    </div>
    <div className="flex gap-1">
      {options.map(opt => (
        <button key={opt} type="button" onClick={() => onChange(opt.toString())}
          className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${parseInt(value)===opt?'bg-slate-900 text-white':'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
          {opt}
        </button>
      ))}
    </div>
  </div>
);

// ── PILL SELECTOR ──────────────────────────────────────────────────────────────
const PillSelector = ({ options, value, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {options.map(opt => (
      <button key={opt} type="button" onClick={() => onChange(opt)}
        className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${value===opt?'bg-slate-900 text-white shadow-lg':'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
        {opt}
      </button>
    ))}
  </div>
);

// ── CANVA LOADING ──────────────────────────────────────────────────────────────
function CanvaLoading({ titre, template, langue }) {
  const [step, setStep] = useState(0);
  const isEn = langue === "anglais";
  const steps = isEn ? [
    { label: "Analyzing the topic", sub: "Understanding the context..." },
    { label: "Creating the outline", sub: "Building ebook structure..." },
    { label: "Writing your ebook", sub: "The magic is happening..." },
    { label: "Free preview", sub: "Finalizing your preview..." },
  ] : [
    { label: "Analyse du sujet", sub: "Compréhension du contexte..." },
    { label: "Création du sommaire", sub: "Structure de l'ebook en cours..." },
    { label: "Rédaction de votre ebook", sub: "La magie opère..." },
    { label: "Aperçu gratuit", sub: "On finalise votre aperçu..." },
  ];

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 1200),
      setTimeout(() => setStep(2), 5000),
      setTimeout(() => setStep(3), 9000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const tmpl = TEMPLATES.find(t => t.id === template) || TEMPLATES[0];

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50 p-6">
      {/* Livre animé */}
      <div className="mb-10" style={{animation:"float 3s ease-in-out infinite"}}>
        <div className="relative w-32 h-44 mx-auto">
          <div className="absolute inset-0 rounded-r-md rounded-l-sm shadow-2xl overflow-hidden"
            style={{background:`linear-gradient(135deg,${tmpl.primaryColor},${tmpl.accentColor})`}}>
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-black/20" />
            <div className="absolute inset-0 p-3 flex flex-col text-white">
              <div className="text-[6px] uppercase tracking-widest opacity-60 mb-2">{isEn ? "Creating" : "En création"}</div>
              <p className="text-[9px] font-bold leading-tight opacity-90">{titre || (isEn ? "Your ebook" : "Votre ebook")}</p>
            </div>
            {/* Shimmer effect */}
            <div style={{position:"absolute",inset:0,background:"linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.15) 50%,transparent 60%)",animation:"shimmer 2s infinite"}} />
          </div>
          <div className="absolute top-1 -right-1 bottom-1 w-2 bg-slate-100 rounded-r-sm -z-10" />
          <div className="absolute top-2 -right-2 bottom-2 w-1 bg-slate-200 rounded-r-sm -z-20" />
        </div>
      </div>

      {/* Étapes */}
      <div className="w-full max-w-xs space-y-3 mb-8">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
              i < step ? "bg-indigo-600" : i === step ? "bg-indigo-100 border-2 border-indigo-600" : "bg-slate-100"
            }`}>
              {i < step ? (
                <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
              ) : i === step ? (
                <div style={{width:"8px",height:"8px",borderRadius:"50%",background:"#6366f1",animation:"pulse 1s infinite"}} />
              ) : null}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium transition-colors ${i <= step ? "text-slate-900" : "text-slate-300"}`}>{s.label}</p>
              {i === step && <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-400 text-center">{isEn ? "100% free preview · No credits required · No commitment" : "Aperçu 100% gratuit · Aucun crédit requis · Sans engagement"}</p>

      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </div>
  );
}

// ── GENERATING OVERLAY (génération complète) ───────────────────────────────────
function GeneratingOverlay({ progress = 0 }) {
  const pct = progress || 5;
  const label =
    pct < 20 ? "Déverrouillage de votre ebook..." :
    pct < 40 ? "Rédaction du kit marketing..." :
    pct < 70 ? "Assemblage du contenu..." :
    pct < 80 ? "Mise en page finale..." :
    pct < 95 ? "Génération du PDF complet..." :
    pct < 100 ? "Mise en ligne..." : "Terminé !";

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[200] p-6">
      <div className="w-20 h-20 mb-6 relative">
        <svg width="80" height="80" viewBox="0 0 80 80" style={{transform:"rotate(-90deg)"}}>
          <circle cx="40" cy="40" r="34" strokeWidth="5" fill="none" stroke="#f1f5f9" />
          <circle cx="40" cy="40" r="34" strokeWidth="5" fill="none" stroke="#6366f1" strokeLinecap="round"
            strokeDasharray={`${2*Math.PI*34}`}
            strokeDashoffset={`${2*Math.PI*34*(1-pct/100)}`}
            style={{transition:"stroke-dashoffset 0.8s ease"}} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-slate-900 font-bold text-sm">{Math.round(pct)}%</div>
      </div>
      <h2 className="text-slate-900 text-lg font-bold mb-1">Génération en cours</h2>
      <p className="text-slate-500 text-sm text-center">{label}</p>
      <p className="text-slate-300 text-xs mt-2">Ne fermez pas cette page</p>
    </div>
  );
}

// ── DOWNLOAD KIT MODAL ─────────────────────────────────────────────────────────
function DownloadKitModal({ kit, router }) {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-6 overflow-y-auto">
      <div className="max-w-sm w-full text-center py-4">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">C'est prêt !</h2>
        <p className="text-slate-500 text-sm mb-6">Votre ebook a été généré avec succès</p>

        <a href={kit.pdfUrl} download
          className="flex items-center gap-3 p-4 rounded-xl border-2 border-indigo-600 bg-indigo-600 hover:bg-indigo-700 transition-all mb-6">
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-semibold text-white text-sm">Télécharger mon ebook (PDF)</div>
            <div className="text-xs text-indigo-200">Version complète, prêt à vendre</div>
          </div>
          <Download className="w-5 h-5 text-white flex-shrink-0" />
        </a>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-slate-100" />
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2">Inclus</span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>

        <div className="space-y-2 mb-6">
          {kit.docxUrl ? (
            <a href={kit.docxUrl} download className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all">
              <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"><FileCheck2 className="w-4 h-4 text-blue-600" /></div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-slate-900 text-sm">Version modifiable (.docx)</div>
                <div className="text-xs text-slate-400">Éditable dans Word ou Google Docs</div>
              </div>
              <Download className="w-4 h-4 text-slate-400 flex-shrink-0" />
            </a>
          ) : null}

          <button onClick={() => router.push('/dashboard/fichiers/' + kit.projetId)}
            className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all w-full">
            <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0"><MessageCircle className="w-4 h-4 text-purple-600" /></div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-slate-900 text-sm">Kits marketing</div>
              <div className="text-xs text-slate-400">Posts Facebook, WhatsApp, email...</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
          </button>
        </div>

        <button onClick={() => router.push('/dashboard/fichiers')}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300 text-sm font-medium transition-all">
          <BookOpen className="w-4 h-4" />
          Voir ma bibliothèque
        </button>

        {/* CTA Taliopay */}
        <div className="mt-4 p-4 rounded-2xl" style={{background:"linear-gradient(135deg,#0f172a,#1e293b)"}}>
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">💰 Monétise ton ebook</div>
          <p className="text-sm text-white font-medium mb-3">Vends cet ebook et encaisse par Mobile Money</p>
          <a href="https://taliopay.com" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold transition-all"
            style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"white"}}>
            Vendre sur Taliopay
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

// ── CREDITS MODAL ─────────────────────────────────────────────────────────────
function CreditsModal({ balance, onClose, onGoTarifs }) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:"16px"}}>
      <div style={{background:"white",borderRadius:"20px",width:"100%",maxWidth:"340px",overflow:"hidden"}}>
        <div style={{padding:"24px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"16px"}}>
            <h3 style={{fontSize:"16px",fontWeight:"800",color:"#0f172a",margin:0}}>Crédits insuffisants</h3>
            <button onClick={onClose} style={{width:"28px",height:"28px",borderRadius:"50%",background:"#f1f5f9",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><X size={13} /></button>
          </div>
          <div style={{textAlign:"center",padding:"8px 0 20px"}}>
            <div style={{fontSize:"40px",marginBottom:"12px"}}>🔒</div>
            <p style={{fontSize:"14px",color:"#374151",margin:"0 0 6px"}}>
              Il te faut <strong>minimum 20 crédits</strong> pour débloquer ton ebook.
            </p>
            <p style={{fontSize:"13px",color:"#94a3b8",margin:0}}>
              Tu as actuellement <strong style={{color:"#0f172a"}}>{balance ?? 0} crédit{(balance ?? 0) !== 1 ? "s" : ""}</strong>.
            </p>
          </div>
          <button onClick={onGoTarifs}
            style={{width:"100%",padding:"14px",background:"#0f172a",color:"white",fontSize:"14px",fontWeight:"700",border:"none",borderRadius:"12px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}>
            Voir les plans et recharger <ArrowRight size={15} />
          </button>
          <button onClick={onClose} style={{width:"100%",padding:"10px",color:"#94a3b8",fontSize:"12px",border:"none",background:"none",cursor:"pointer",marginTop:"6px"}}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}

// ── PREVIEW PAGE (après génération gratuite) ───────────────────────────────────
function PreviewPage({ kit, previewData, onEdit }) {
  const router = useRouter();
  const params = useSearchParams();
  const { balance, mutateBalance } = useCredits();
  const [isGenerating, setIsGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(5);
  const [downloadKit, setDownloadKit] = useState(null);
  const [showCreditsModal, setShowCreditsModal] = useState(false);

  const tmpl = TEMPLATES.find(t => t.id === kit.template) || TEMPLATES[0];

  // Au retour après paiement → relancer automatiquement
  useEffect(() => {
    const resume = params.get("resume");
    if (resume === "true" && balance !== null && balance >= 20) {
      sessionStorage.removeItem("bookzy_pending_generate");
      handleGenerate();
    }
  }, [balance]);

  const handleBuyPlan = (packId) => {
    sessionStorage.setItem("bookzy_resume_projetId", kit.projetId);
    router.push("/dashboard/tarifs");
  };

  const handleGenerate = async () => {
    if (isGenerating) return;
    if (balance !== null && balance < 20) { setShowCreditsModal(true); return; }
    setIsGenerating(true);
    try {
      const genRes = await fetch("/api/ebooks/generate", {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({
          projetId: kit.projetId,
          titre: kit.titre, description: kit.description,
          pages: kit.pages, chapters: kit.chapters,
          tone: kit.tone, audience: kit.audience,
          template: kit.template, outline: previewData.sommaire, langue: kit.langue,
        }),
      });
      const genData = await genRes.json();
      if (!genData.success) {
        if (genData.insufficientCredits) { setShowCreditsModal(true); setIsGenerating(false); return; }
        alert(genData.message || "Erreur"); setIsGenerating(false); return;
      }
      const projetId = genData.projetId || kit.projetId;
      let attempts = 0;
      const poll = async () => {
        if (attempts++ > 120) { alert("Délai dépassé."); setIsGenerating(false); return; }
        try {
          const r = await fetch(`/api/ebooks/progress/${projetId}`, { credentials: "include" });
          const d = await r.json();
          if (d.progress) setGenProgress(d.progress);
          if (d.status === "COMPLETED" && d.pdfUrl) {
            setIsGenerating(false); await mutateBalance?.();
            setDownloadKit({ pdfUrl: d.pdfUrl, docxUrl: d.docxUrl || null, title: kit.titre, projetId });
          } else if (d.status === "ERROR") { alert("Erreur lors de la génération."); setIsGenerating(false); }
          else { setTimeout(poll, 2000); }
        } catch { setTimeout(poll, 3000); }
      };
      setTimeout(poll, 1500);
    } catch { alert("Erreur technique"); setIsGenerating(false); }
  };

  const primary = tmpl.primaryColor;
  const accent = tmpl.accentColor;
  const gradient = `linear-gradient(135deg, ${primary}, ${accent})`;
  const isEn = kit.langue === "anglais";
  const t = {
    locked: isEn ? "The rest is locked" : "La suite est verrouillée",
    reserved: isEn ? "The rest is reserved" : "La suite est réservée",
    sections: isEn ? "sections" : "sections",
    chapters: isEn ? "chapters" : "chapitres",
    intro: isEn ? "intro" : "intro",
    conclusion: isEn ? "conclusion" : "conclusion",
    pages: isEn ? "pages" : "pages",
    pdfReady: isEn ? "PDF ready to sell" : "PDF prêt à vendre",
    kitIncluded: isEn ? "Marketing kit included" : "Kit marketing inclus",
    genTime: isEn ? "Generation in ~1 minute · 20 credits" : "Génération en ~1 minute · 20 crédits",
    unlockBtn: isEn ? "Get my complete ebook" : "Obtenir mon ebook complet",
    unlockSub: isEn ? "PDF + Marketing kit · Ready to sell in 60 seconds" : "PDF + Kit marketing · Prêt à vendre en 60 secondes",
    ctaSub: isEn ? "Full PDF + Marketing kit · 20 credits" : "PDF complet + Kit marketing · 20 crédits",
    toc: isEn ? "Table of Contents" : "Table des Matières",
    introduction: isEn ? "INTRODUCTION" : "INTRODUCTION",
    chapter1: isEn ? "CHAPTER 1" : "CHAPITRE 1",
  };


  return (
    <div style={{minHeight:"100vh",background:"#f1f5f9",paddingBottom:"120px"}}>
      {isGenerating && <GeneratingOverlay progress={genProgress} />}
      {downloadKit && <DownloadKitModal kit={downloadKit} router={router} />}

      {/* Modal crédits */}
      {showCreditsModal && (
        <CreditsModal
          balance={balance}
          onClose={() => setShowCreditsModal(false)}
          onGoTarifs={() => {
            sessionStorage.setItem("bookzy_resume_projetId", kit.projetId);
            setShowCreditsModal(false);
            router.push("/dashboard/tarifs");
          }}
        />
      )}

      {/* Header */}
      <div style={{position:"fixed",top:0,left:0,right:0,background:"white",borderBottom:"1px solid #f1f5f9",zIndex:50,padding:"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 1px 8px rgba(0,0,0,0.06)"}}>
        <button onClick={onEdit} style={{display:"flex",alignItems:"center",gap:"6px",color:"#64748b",fontSize:"13px",fontWeight:"600",background:"#f1f5f9",border:"none",borderRadius:"8px",padding:"8px 14px",cursor:"pointer"}}>
          <ArrowLeft size={14} /> Modifier
        </button>
        <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
          <span style={{background:"#dcfce7",color:"#166534",padding:"5px 12px",borderRadius:"20px",fontSize:"11px",fontWeight:"700"}}>Aperçu gratuit</span>
          {balance !== null && <span style={{background:"#f1f5f9",color:"#64748b",padding:"5px 12px",borderRadius:"20px",fontSize:"11px"}}>{balance} cr.</span>}
        </div>
      </div>

      <div style={{maxWidth:"680px",margin:"0 auto",paddingTop:"72px",paddingBottom:"40px",paddingLeft:"16px",paddingRight:"16px"}}>

        {/* ── PDF PREVIEW ── */}
        {previewData.previewImages?.length > 0 ? (
          <div style={{borderRadius:"12px",overflow:"hidden",marginBottom:"16px",boxShadow:"0 4px 24px rgba(0,0,0,0.12)",background:"white",position:"relative"}}>
            <img src={previewData.previewImages[0]} alt="Cover" style={{width:"100%",display:"block"}} />
            {previewData.previewImages[1] && (
              <img src={previewData.previewImages[1]} alt="Sommaire" style={{width:"100%",display:"block"}} />
            )}
            {previewData.previewImages[2] && (
              <img src={previewData.previewImages[2]} alt="Introduction" style={{width:"100%",display:"block"}} />
            )}
            {previewData.previewImages[3] && (
              <div style={{position:"relative"}}>
                <img src={previewData.previewImages[3]} alt="Chapitre 1" style={{width:"100%",display:"block"}} />
                <div style={{position:"absolute",bottom:0,left:0,right:0,height:"50%",background:"linear-gradient(to bottom, transparent, white)",pointerEvents:"none"}} />
                <div style={{position:"absolute",bottom:"40px",left:0,right:0,display:"flex",flexDirection:"column",alignItems:"center",gap:"10px",pointerEvents:"none"}}>
                  <div style={{width:"44px",height:"44px",background:"white",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(0,0,0,0.12)"}}>
                    <Lock size={18} color="#64748b" />
                  </div>
                  <p style={{fontSize:"13px",fontWeight:"700",color:"#0f172a",margin:0,textAlign:"center"}}>{t.locked}</p>
                  <p style={{fontSize:"12px",color:"#64748b",margin:0}}>{parseInt(kit.chapters) + 2} {t.sections} · {kit.pages} {t.pages}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
        {/* ── COVER ── */}
        <div style={{borderRadius:"12px",overflow:"hidden",marginBottom:"16px",boxShadow:"0 8px 32px rgba(0,0,0,0.2)",background:gradient,position:"relative",minHeight:"380px",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",textAlign:"center",padding:"48px 40px"}}>
          {/* Spine */}
          <div style={{position:"absolute",left:0,top:0,bottom:0,width:"8px",background:"rgba(0,0,0,0.3)"}} />
          {/* Pages effect */}
          <div style={{position:"absolute",top:"8px",right:"-4px",bottom:"8px",width:"6px",background:"rgba(255,255,255,0.4)",borderRadius:"0 4px 4px 0",zIndex:-1}} />
          <div style={{position:"absolute",top:"16px",right:"-8px",bottom:"16px",width:"4px",background:"rgba(255,255,255,0.2)",borderRadius:"0 4px 4px 0",zIndex:-2}} />
          {/* Badge */}
          <div style={{border:"2px solid rgba(255,255,255,0.5)",padding:"6px 24px",borderRadius:"4px",fontSize:"11px",fontWeight:"900",letterSpacing:"4px",color:"white",marginBottom:"28px",background:"rgba(255,255,255,0.1)"}}>
            {tmpl.preview.badge}
          </div>
          <h1 style={{fontSize:"clamp(22px,4vw,40px)",fontWeight:"900",color:"white",lineHeight:1.15,margin:"0 0 16px",textShadow:"0 2px 12px rgba(0,0,0,0.3)",textTransform:"uppercase"}}>
            {kit.titre}
          </h1>
          {kit.description && (
            <p style={{fontSize:"14px",color:"rgba(255,255,255,0.8)",maxWidth:"420px",margin:"0 0 32px",lineHeight:1.6}}>{kit.description}</p>
          )}
          <div style={{width:"120px",height:"2px",background:`linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)`,margin:"0 auto 20px"}} />
          <p style={{fontSize:"13px",color:"rgba(255,255,255,0.7)",letterSpacing:"2px",fontWeight:"600"}}>Par {previewData.authorName || "Auteur"}</p>
        </div>

        {/* ── TABLE DES MATIÈRES ── */}
        <div style={{background:"white",borderRadius:"12px",padding:"32px",marginBottom:"16px",boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
          <div style={{borderBottom:`3px solid ${primary}`,paddingBottom:"16px",marginBottom:"24px"}}>
            <h2 style={{fontSize:"22px",fontWeight:"900",color:primary,margin:0,textTransform:"uppercase",letterSpacing:"1px"}}>{t.toc}</h2>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
            <div style={{display:"flex",alignItems:"center",gap:"12px",padding:"10px 14px",background:"#f8fafc",borderRadius:"8px"}}>
              <span style={{fontSize:"18px",fontWeight:"900",color:accent,minWidth:"36px"}}>00</span>
              <span style={{fontSize:"14px",fontWeight:"600",color:"#0f172a",flex:1}}>Introduction</span>
            </div>
            {previewData.sommaire.map((chap, idx) => (
              <div key={idx} style={{display:"flex",alignItems:"center",gap:"12px",padding:"10px 14px",background:idx===0?"#f8fafc":"#fafafa",borderRadius:"8px",opacity:idx===0?1:0.7}}>
                <span style={{fontSize:"18px",fontWeight:"900",color:idx===0?accent:"#94a3b8",minWidth:"36px"}}>{String(idx+1).padStart(2,"0")}</span>
                <span style={{fontSize:"14px",fontWeight:idx===0?"600":"400",color:idx===0?"#0f172a":"#64748b",flex:1}}>{chap}</span>
                {idx > 0 && <Lock size={13} color="#cbd5e1" />}
              </div>
            ))}
          </div>
        </div>

        {/* ── INTRODUCTION ── */}
        <div style={{background:"white",borderRadius:"12px",overflow:"hidden",marginBottom:"16px",boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
          <div style={{height:"4px",background:gradient}} />
          <div style={{padding:"32px"}}>
            <div style={{display:"flex",alignItems:"center",gap:"16px",marginBottom:"24px",paddingBottom:"16px",borderBottom:`2px solid ${primary}`}}>
              <div style={{fontSize:"52px",fontWeight:"900",color:accent,lineHeight:1,opacity:0.3}}>00</div>
              <div>
                <p style={{fontSize:"11px",fontWeight:"800",letterSpacing:"3px",color:accent,margin:"0 0 4px"}}>{t.introduction}</p>
                <h2 style={{fontSize:"24px",fontWeight:"900",color:primary,margin:0}}>Introduction</h2>
              </div>
            </div>
            <div style={{fontSize:"15px",lineHeight:"1.8",color:"#374151"}} dangerouslySetInnerHTML={{__html: previewData.introduction}} />
          </div>
        </div>

        {/* ── CHAPITRE 1 (coupé) ── */}
        <div style={{background:"white",borderRadius:"12px",overflow:"hidden",marginBottom:"16px",boxShadow:"0 2px 12px rgba(0,0,0,0.06)",position:"relative"}}>
          <div style={{height:"4px",background:gradient}} />
          <div style={{padding:"32px"}}>
            <div style={{display:"flex",alignItems:"center",gap:"16px",marginBottom:"24px",paddingBottom:"16px",borderBottom:`2px solid ${primary}`}}>
              <div style={{fontSize:"52px",fontWeight:"900",color:accent,lineHeight:1,opacity:0.3}}>01</div>
              <div>
                <p style={{fontSize:"11px",fontWeight:"800",letterSpacing:"3px",color:accent,margin:"0 0 4px"}}>{t.chapter1}</p>
                <h2 style={{fontSize:"24px",fontWeight:"900",color:primary,margin:0}}>{previewData.ch1Title}</h2>
              </div>
            </div>
            <div style={{fontSize:"15px",lineHeight:"1.8",color:"#374151",maxHeight:"220px",overflow:"hidden",position:"relative"}}>
              <div dangerouslySetInnerHTML={{__html: previewData.chapitre1Preview}} />
              <div style={{position:"absolute",bottom:0,left:0,right:0,height:"120px",background:"linear-gradient(to bottom, transparent, white)"}} />
            </div>
          </div>
        </div>

          </>
        )}

        {/* ── CTA DÉBLOQUER ── */}
        <div style={{background:"white",borderRadius:"16px",padding:"36px 28px",textAlign:"center",boxShadow:"0 8px 32px rgba(0,0,0,0.1)",border:`2px solid ${primary}20`}}>
          <div style={{width:"52px",height:"52px",background:`${primary}15`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:"24px"}}>🔒</div>
          <h3 style={{fontSize:"20px",fontWeight:"900",color:"#0f172a",margin:"0 0 8px"}}>{t.reserved}</h3>
          <p style={{fontSize:"14px",color:"#64748b",margin:"0 0 4px"}}>
            <strong style={{color:primary}}>{parseInt(kit.chapters) + 2} {t.sections}</strong> ({parseInt(kit.chapters)} {t.chapters} + {t.intro} + {t.conclusion}) · <strong style={{color:primary}}>{kit.pages} {t.pages}</strong> · {t.pdfReady} · {t.kitIncluded}
          </p>
          <p style={{fontSize:"12px",color:"#94a3b8",margin:"0 0 24px"}}>{t.genTime}</p>
          <button onClick={handleGenerate} disabled={isGenerating}
            style={{background:gradient,color:"white",fontSize:"16px",fontWeight:"900",padding:"18px 44px",borderRadius:"14px",border:"none",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"10px",boxShadow:`0 8px 24px ${primary}50`,width:"100%",justifyContent:"center",marginBottom:"12px"}}>
            {isGenerating
              ? <><Loader2 size={16} style={{animation:"spin 1s linear infinite"}} /> Génération en cours...</>
              : <>{t.unlockBtn} <ArrowRight size={16} /></>
            }
          </button>
          <p style={{fontSize:"11px",color:"#94a3b8",margin:0}}>{t.unlockSub}</p>
        </div>

      </div>

      {/* CTA fixe mobile */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"white",borderTop:"1px solid #f1f5f9",padding:"12px 16px",zIndex:40,boxShadow:"0 -4px 20px rgba(0,0,0,0.08)"}}>
        <button onClick={handleGenerate} disabled={isGenerating}
          style={{width:"100%",padding:"16px",background:gradient,color:"white",fontWeight:"800",fontSize:"15px",border:"none",borderRadius:"14px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}>
          {isGenerating ? <><Loader2 size={15} style={{animation:"spin 1s linear infinite"}} /> En cours...</> : <>{t.unlockBtn} <ArrowRight size={15} /></>}
        </button>
        <p style={{textAlign:"center",fontSize:"11px",color:"#94a3b8",marginTop:"6px",marginBottom:0}}>{t.ctaSub}</p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function NouveauProjetPageContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { balance } = useCredits();
  const bookRef = useRef(null);

  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [pages, setPages] = useState("30");
  const [chapters, setChapters] = useState("6");
  const [tone, setTone] = useState("Professionnel");
  const [audience, setAudience] = useState("Débutants");
  const [template, setTemplate] = useState("modern");
  const [langue, setLangue] = useState("français");

  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [kitData, setKitData] = useState(null);
  const [improvingTitle, setImprovingTitle] = useState(false);
  const [improvingDescription, setImprovingDescription] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [step, setStep] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [toolsOpen, setToolsOpen] = useState(false);

  // URL params + resume depuis sessionStorage
  useEffect(() => {
    const t = params.get("template");
    if (t && TEMPLATES.some(tmp => tmp.id === t)) setTemplate(t);
    const suggestion = params.get("suggestion");
    if (suggestion) setTitre(decodeURIComponent(suggestion));
    const desc = params.get("description");
    if (desc) setDescription(decodeURIComponent(desc));

    // Retour après page tarifs — recharger l'aperçu depuis la DB
    const projetId = sessionStorage.getItem("bookzy_resume_projetId");
    if (projetId) {
      sessionStorage.removeItem("bookzy_resume_projetId");
      setIsLoading(true);
      fetch(`/api/projets/${projetId}`, { credentials: "include" })
        .then(r => r.json())
        .then(data => {
          if (data.projet) {
            const p = data.projet;
            const sommaireLines = (p.summary || "")
              .split("\n")
              .map(l => l.replace(/^\d+[\.\)]\s*/, "").replace(/^[-•*]\s*/, "").trim())
              .filter(l => l.length > 3 && !l.toLowerCase().includes("introduction") && !l.toLowerCase().includes("conclusion"))
              .slice(0, (p.chapters || 6) + 2);

            setKitData({
              projetId: p._id,
              titre: p.titre,
              description: p.description,
              tone: p.tone,
              audience: p.audience,
              pages: p.pages,
              chapters: p.chapters,
              template: p.template,
              langue: p.langue || "français",
            });
            setPreviewData({
              sommaire: sommaireLines,
              introduction: p.introduction || "",
              chapitre1Preview: "",
              ch1Title: sommaireLines[0] || "Chapitre 1",
              previewImages: p.previewImages || [],
              authorName: "",
            });
          }
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [params]);

  useEffect(() => {
    fetch("/api/profile/get", { credentials: "include" })
      .then(r => r.json())
      .then(d => { const u = d?.user || d; setUserName(u?.firstName || u?.displayName || (u?.name ? u.name.split(" ")[0] : "") || ""); })
      .catch(() => {});
  }, []);

  const handleImproveTitle = async () => {
    if (!titre || improvingTitle) return;
    setImprovingTitle(true);
    try {
      const res = await fetch("/api/ebooks/improve-title", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ titre, tone, audience }) });
      const data = await res.json();
      if (data.success && data.improvedTitle) setTitre(data.improvedTitle);
    } catch (e) { console.error(e); } finally { setImprovingTitle(false); }
  };

  const handleImproveDescription = async () => {
    if (!description || improvingDescription) return;
    setImprovingDescription(true);
    try {
      const res = await fetch("/api/ebooks/improve-description", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ titre, description, tone, audience }) });
      const data = await res.json();
      if (data.success && data.improvedDescription) setDescription(data.improvedDescription);
    } catch (e) { console.error(e); } finally { setImprovingDescription(false); }
  };


  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!isFormValid) return;
    const finalDescription = description.trim() || `Un guide pratique et complet sur : ${titre}.`;
    setIsLoading(true);
    try {
      const res = await fetch("/api/ebooks/draft-preview", {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({ titre, description: finalDescription, tone, audience, pages: parseInt(pages), chapters: parseInt(chapters), template, langue }),
      });
      const data = await res.json();
      if (data.success) {
        setKitData({ projetId: data.projetId, titre, description: finalDescription, tone, audience, pages, chapters, template, langue });
        setPreviewData(data.preview);
      } else if (data.limitReached) {
        setIsLoading(false);
        setShowLimitModal(true);
      } else {
        alert(data.message || "Erreur");
        setIsLoading(false);
      }
    } catch (e) {
      alert("Erreur de connexion");
      setIsLoading(false);
    }
  };

  const isFormValid = titre.trim().length > 3;

  // Afficher le Canva loading pendant l'appel
  if (isLoading && !previewData) return <CanvaLoading titre={titre} template={template} langue={langue} />;

  // Afficher la preview après succès
  if (previewData && kitData) return <PreviewPage kit={kitData} previewData={previewData} onEdit={() => { setPreviewData(null); setKitData(null); setIsLoading(false); }} />;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* Drawer menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <nav className="absolute left-0 top-0 bottom-0 w-72 max-w-[80vw] bg-white shadow-2xl flex flex-col" style={{ animation: "bzslide .2s ease" }}>
            <div className="flex items-center justify-between px-5 h-14 border-b border-slate-100">
              <span className="font-extrabold text-slate-900">Bookzy</span>
              <button type="button" onClick={() => setMenuOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {[
                { label: "Créer un ebook", href: "/dashboard" },
                { label: "Mes livres", href: "/dashboard/fichiers" },
                { label: "Validateur d'idée", href: "/dashboard/analyseur" },
                { label: "Niche Hunter", href: "/dashboard/niche-hunter" },
                { label: "Radar Cash", href: "/dashboard/radar-cash" },
                { label: "Youbook", href: "/dashboard/youbook" },
                { label: "Ebook Designer", href: "/dashboard/express" },
                { label: "Romans IA", href: "/dashboard/romans" },
                { label: "Tarifs & abonnement", href: "/dashboard/tarifs" },
                { label: "Paramètres", href: "/dashboard/parametres" },
              ].map(item => (
                <a key={item.href} href={item.href}
                  className="flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all">
                  {item.label} <ArrowRight className="w-4 h-4 text-slate-300" />
                </a>
              ))}
            </div>
          </nav>
          <style>{`@keyframes bzslide { from { transform: translateX(-100%); } to { transform: none; } }`}</style>
        </div>
      )}

      {/* Modal limite aperçus */}
      {showLimitModal && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:"16px"}}>
          <div style={{background:"white",borderRadius:"20px",width:"100%",maxWidth:"360px",overflow:"hidden"}}>
            <div style={{background:"linear-gradient(135deg,#0f172a,#1e293b)",padding:"28px 24px 24px",textAlign:"center"}}>
              <div style={{fontSize:"40px",marginBottom:"12px"}}>🔒</div>
              <h3 style={{fontSize:"18px",fontWeight:"900",color:"white",margin:"0 0 8px"}}>3 aperçus utilisés</h3>
              <p style={{fontSize:"13px",color:"rgba(255,255,255,0.6)",margin:0}}>Tu as déjà généré 3 aperçus sans créer d'ebook.</p>
            </div>
            <div style={{padding:"24px"}}>
              <p style={{fontSize:"14px",color:"#374151",margin:"0 0 20px",lineHeight:1.6,textAlign:"center"}}>
                Pour continuer à créer des aperçus et générer des ebooks, passe à un abonnement Bookzy.
              </p>
              <button onClick={() => { setShowLimitModal(false); router.push("/dashboard/tarifs"); }}
                style={{width:"100%",padding:"14px",background:"#0f172a",color:"white",fontSize:"14px",fontWeight:"700",border:"none",borderRadius:"12px",cursor:"pointer",marginBottom:"10px"}}>
                Voir les plans →
              </button>
              <button onClick={() => setShowLimitModal(false)}
                style={{width:"100%",padding:"10px",color:"#94a3b8",fontSize:"12px",border:"none",background:"none",cursor:"pointer"}}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
      {step === 0 ? (
        /* ── FOCUS (accueil Claude) — centré verticalement, rien d'autre ── */
        <div className="flex-1 flex flex-col items-center justify-center px-5 pb-32">
          <div className="w-full max-w-3xl text-center">
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-8 leading-tight">Quel ebook veux-tu créer aujourd'hui ?</h1>
            <div className="relative">
              {/* Lanceur d'outils */}
              <button type="button" onClick={() => setToolsOpen((v) => !v)} aria-label="Autres outils"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 transition-all">
                <Plus className="w-5 h-5" />
              </button>
              <input type="text" value={titre} onChange={e => setTitre(e.target.value)} autoFocus
                onKeyDown={e => { if (e.key === "Enter" && titre.trim().length > 3) setStep(1); }}
                placeholder="Tapez votre sujet"
                className="w-full pl-14 pr-14 py-5 bg-white border border-slate-200 rounded-[28px] text-slate-900 text-lg placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-md transition-all" />
              <button type="button" disabled={titre.trim().length <= 3} onClick={() => setStep(1)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 text-white disabled:bg-slate-200 disabled:text-slate-400 hover:bg-slate-800 transition-all">
                <ArrowRight className="w-4 h-4" />
              </button>

              {toolsOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setToolsOpen(false)} />
                  <div className="absolute left-0 top-full mt-2 w-80 max-w-[calc(100vw-40px)] bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-20 text-left">
                    {TOOLS.map((t) => (
                      <Link key={t.href} href={t.href} onClick={() => setToolsOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 transition-colors">
                        <t.icon className="w-5 h-5 text-slate-600 shrink-0" />
                        <span className="min-w-0">
                          <span className="block text-sm font-medium text-slate-900">{t.label}</span>
                          <span className="block text-xs text-slate-500 truncate">{t.desc}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center justify-center gap-2 mt-4">
              <button type="button" onClick={handleImproveTitle} disabled={!titre || improvingTitle}
                className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 px-3 py-1.5 rounded-full transition-all">
                {improvingTitle ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowUpRightFromCircleIcon className="w-3.5 h-3.5" />}
                {improvingTitle ? "..." : "Améliorer"}
              </button>
              {[{ value: "français", label: "Français" }, { value: "anglais", label: "English" }].map(opt => (
                <button key={opt.value} type="button" onClick={() => setLangue(opt.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${langue === opt.value ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
      <div className="max-w-2xl mx-auto w-full px-5 py-8">

        <div key={step} className="bz-step">

          {/* ── ÉTAPE 1 — DÉTAILS (optionnel) ── */}
          {step === 1 && (
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Veux-tu préciser un peu ?</h1>
              <p className="text-slate-500 text-sm mb-8">Optionnel — quelques mots sur ce que le lecteur va apprendre. Tu peux passer.</p>
              <div className="relative">
                <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} autoFocus
                  placeholder="Ex: les techniques concrètes pour trouver des clients et vendre sur WhatsApp..."
                  className="w-full px-5 py-4 pr-28 bg-white border border-slate-200 rounded-2xl text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none shadow-sm transition-all" />
                <button type="button" onClick={handleImproveDescription} disabled={!description || improvingDescription}
                  className="absolute right-2.5 top-3 px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 rounded-lg flex items-center gap-1.5 transition-all">
                  {improvingDescription ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowUpRightFromCircleIcon className="w-3.5 h-3.5" />}
                  {improvingDescription ? "..." : "Améliorer"}
                </button>
              </div>
            </div>
          )}

          {/* ── ÉTAPE 2 — TON + PUBLIC ── */}
          {step === 2 && (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Le ton et le public</h1>
                <p className="text-slate-500 text-sm">Pour adapter l'écriture à tes lecteurs.</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Ton</label>
                  <PillSelector options={TONES} value={tone} onChange={setTone} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Public</label>
                  <PillSelector options={AUDIENCES} value={audience} onChange={setAudience} />
                </div>
              </div>
            </div>
          )}

          {/* ── ÉTAPE 3 — DESIGN + GÉNÉRATION ── */}
          {step === 3 && (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Choisis ton design</h1>
                <p className="text-slate-500 text-sm">Aperçu de ta couverture en direct.</p>
              </div>
              <div className="bg-slate-900 rounded-2xl p-6 mb-6">
                <div ref={bookRef}><Book3D title={titre} template={template} /></div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <TemplatePicker value={template} onChange={setTemplate} />
                <details className="mt-6">
                  <summary className="text-xs font-semibold text-slate-400 uppercase tracking-wider cursor-pointer">Options avancées</summary>
                  <div className="grid sm:grid-cols-2 gap-6 mt-4">
                    <NumberPicker label="Pages" value={pages} options={PAGES_OPTIONS} onChange={setPages} />
                    <NumberPicker label="Chapitres" value={chapters} options={CHAPTERS_OPTIONS} onChange={setChapters} />
                  </div>
                </details>
              </div>
            </div>
          )}

        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          <button type="button" onClick={() => setStep(s => s - 1)}
            className="px-5 py-4 bg-white border border-slate-200 text-slate-500 rounded-xl font-medium hover:border-slate-300 transition-all flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
          {step < 3 ? (
            <button type="button" onClick={() => setStep(s => s + 1)}
              className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
              {step === 1 && description.trim().length === 0 ? "Passer" : "Continuer"} <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button type="button" onClick={handleSubmit}
              className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
              Voir mon aperçu gratuit <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
        {step === 3 && <p className="text-xs text-slate-400 text-center mt-3">Aperçu 100% gratuit · Aucun crédit requis</p>}

      </div>
      )}

      <style>{`
        .bz-step { animation: bzfade .28s ease; min-height: 320px; }
        @keyframes bzfade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}

export default function NouveauProjetPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>}>
      <NouveauProjetPageContent />
    </Suspense>
  );
}