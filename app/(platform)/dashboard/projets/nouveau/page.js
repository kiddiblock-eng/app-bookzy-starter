"use client";
import { Suspense } from "react";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Script from "next/script";
import { toPng } from "html-to-image";
import {
  CheckCircle2, Loader2,
  FileText, Zap, MessageCircle, PenTool, Lock, Download,
  Clock, Smartphone, ArrowRight, ArrowLeft, Check, BookOpen, X, ExternalLink,
  BadgeCentIcon,
  FileCheck2,
  ArrowUpRightFromCircleIcon
} from "lucide-react";

import { useCredits } from "@/hooks/useCredits";
import InsufficientCreditsModal from "@/components/ui/InsufficientCreditsModal";

// --- DONNÉES ---
const TEMPLATES = [
  {
    id: "modern", label: "Moderne", primaryColor: "#667eea", accentColor: "#764ba2",
    preview: { bg: "linear-gradient(135deg,#667eea,#764ba2)", badge: "PREMIUM", badgeStyle: "bg-white/20 text-white", titleColor: "text-white", pattern: "grid" }
  },
  {
    id: "luxe", label: "Luxe", primaryColor: "#1a1a1a", accentColor: "#d4af37",
    preview: { bg: "linear-gradient(135deg,#1a1a1a,#3d2817)", badge: "LUXE", badgeStyle: "bg-amber-400 text-black", titleColor: "text-amber-300", pattern: "frame" }
  },
  {
    id: "educatif", label: "Éducatif", primaryColor: "#0f766e", accentColor: "#14b8a6",
    preview: { bg: "linear-gradient(135deg,#0f766e,#14b8a6)", badge: "FORMATION", badgeStyle: "bg-white/20 text-white", titleColor: "text-white", pattern: "dots" }
  },
  {
    id: "energie", label: "Énergique", primaryColor: "#f97316", accentColor: "#dc2626",
    preview: { bg: "linear-gradient(135deg,#f97316,#dc2626)", badge: "⚡ BOOST", badgeStyle: "bg-white/20 text-white", titleColor: "text-white", pattern: "stripes" }
  },
  {
    id: "minimal", label: "Minimal", primaryColor: "#1e293b", accentColor: "#64748b",
    preview: { bg: "#ffffff", badge: "GUIDE", badgeStyle: "bg-slate-100 text-slate-500", titleColor: "text-slate-900", pattern: "border" }
  },
  {
    id: "creative", label: "Créatif", primaryColor: "#a855f7", accentColor: "#ec4899",
    preview: { bg: "linear-gradient(135deg,#a855f7,#ec4899)", badge: "✨ CRÉATIF", badgeStyle: "bg-white/20 text-white", titleColor: "text-white", pattern: "blobs" }
  },
  {
    id: "tech", label: "Tech", primaryColor: "#0a0e27", accentColor: "#00d4ff",
    preview: { bg: "linear-gradient(135deg,#0a0e27,#1e3a8a)", badge: "TECH", badgeStyle: "border border-cyan-400 text-cyan-400", titleColor: "text-cyan-300", pattern: "code" }
  },
  {
    id: "nature", label: "Nature", primaryColor: "#166534", accentColor: "#15803d",
    preview: { bg: "linear-gradient(135deg,#166534,#15803d)", badge: "🌱 NATURE", badgeStyle: "bg-white/20 text-white", titleColor: "text-white", pattern: "leaves" }
  },
  {
    id: "fashion", label: "Fashion", primaryColor: "#9f1239", accentColor: "#be185d",
    preview: { bg: "linear-gradient(135deg,#9f1239,#be185d)", badge: "STYLE", badgeStyle: "border border-white text-white", titleColor: "text-white", pattern: "frame" }
  },
  {
    id: "corporate", label: "Corporate", primaryColor: "#1e40af", accentColor: "#3b82f6",
    preview: { bg: "linear-gradient(135deg,#1e40af,#3b82f6)", badge: "BUSINESS", badgeStyle: "bg-white/20 text-white", titleColor: "text-white", pattern: "bars" }
  },
  {
    id: "retro", label: "Rétro", primaryColor: "#92400e", accentColor: "#b45309",
    preview: { bg: "linear-gradient(135deg,#92400e,#b45309)", badge: "VINTAGE", badgeStyle: "border border-amber-300 text-amber-300", titleColor: "text-amber-200", pattern: "lines" }
  },
  {
    id: "futuriste", label: "Futuriste", primaryColor: "#5b21b6", accentColor: "#7c3aed",
    preview: { bg: "linear-gradient(135deg,#5b21b6,#7c3aed)", badge: "◢ FUTURE ◣", badgeStyle: "border border-violet-300 text-violet-300", titleColor: "text-violet-200", pattern: "hex" }
  },
  {
    id: "afrique", label: "Afrique", primaryColor: "#78350f", accentColor: "#d97706",
    preview: { bg: "linear-gradient(135deg,#78350f,#b45309,#d97706)", badge: "🌍 AFRIQUE", badgeStyle: "bg-white/20 text-white", titleColor: "text-white", pattern: "kente" }
  },
  {
    id: "sport", label: "Sport", primaryColor: "#0f172a", accentColor: "#ef4444",
    preview: { bg: "linear-gradient(135deg,#0f172a,#1e293b)", badge: "⚡ SPORT", badgeStyle: "bg-red-500 text-white", titleColor: "text-white", pattern: "diagonal" }
  },
  {
    id: "wellness", label: "Wellness", primaryColor: "#8b5cf6", accentColor: "#c4b5fd",
    preview: { bg: "linear-gradient(135deg,#f3e8ff,#c4b5fd)", badge: "🌸 BIEN-ÊTRE", badgeStyle: "bg-purple-200/60 text-purple-800", titleColor: "text-purple-900", pattern: "soft" }
  },
  {
    id: "business", label: "Business", primaryColor: "#0f172a", accentColor: "#b8860b",
    preview: { bg: "linear-gradient(135deg,#0f172a,#1e293b)", badge: "PREMIUM", badgeStyle: "border border-yellow-500 text-yellow-500", titleColor: "text-yellow-400", pattern: "gold" }
  },
];

const TONES = ["Professionnel", "Simple", "Expert", "Inspirant"];
const AUDIENCES = ["Débutants", "Étudiants", "Freelances", "Entrepreneurs", "Grand Public"];
const PAGES_OPTIONS = [20, 30, 40, 50, 60, 70, 80];
const CHAPTERS_OPTIONS = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// URL de l'ebook exemple
const EXAMPLE_EBOOK_URL = "https://res.cloudinary.com/dcmlw5hak/raw/upload/v1773635937/bookzy/ebooks/guide-importer-depuis-la-chine-69b788cadc09670f33c2b20a.pdf";

/* --- BOOK 3D --- */
const Book3D = ({ title, template }) => {
  const tmpl = TEMPLATES.find(t => t.id === template) || TEMPLATES[0];
  const displayTitle = title || "Votre titre ici";

  return (
    <div className="relative w-40 h-56 sm:w-48 sm:h-64 mx-auto select-none">
      {/* Shadow */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-4 bg-black/20 blur-xl rounded-full" />
      
      {/* Book */}
      <div 
        className="absolute inset-0 rounded-r-md rounded-l-[2px] shadow-2xl overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${tmpl.primaryColor}, ${tmpl.accentColor})` }}
      >
        {/* Spine */}
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-black/20 to-transparent" />
        
        {/* Content */}
        <div className="absolute inset-0 p-4 flex flex-col text-white">
          <div className="text-[7px] uppercase tracking-[0.2em] opacity-60 mb-2">Guide</div>
          <h3 className="text-sm sm:text-base font-bold leading-tight flex-1">{displayTitle}</h3>
        </div>
      </div>
      
      {/* Pages */}
      <div className="absolute top-1 -right-1 bottom-1 w-2 bg-white rounded-r-sm -z-10" />
      <div className="absolute top-2 -right-2 bottom-2 w-1 bg-slate-100 rounded-r-sm -z-20" />
    </div>
  );
};

/* --- PILL SELECTOR --- */
const PillSelector = ({ options, value, onChange, columns = "auto" }) => {
  const gridClass = columns === "auto" 
    ? "flex flex-wrap gap-2" 
    : `grid grid-cols-${columns} gap-2`;
  
  return (
    <div className={gridClass}>
      {options.map(opt => {
        const val = typeof opt === 'object' ? opt.id : opt;
        const label = typeof opt === 'object' ? opt.label : opt;
        const isSelected = value === val;
        
        return (
          <button
            key={val}
            type="button"
            onClick={() => onChange(val)}
            className={`
              px-4 py-2.5 rounded-full text-sm font-medium transition-all
              ${isSelected 
                ? 'bg-slate-900 text-white shadow-lg' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }
            `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

/* --- MINI COVER PREVIEW CSS --- */
const MiniCoverPreview = ({ t, isSelected }) => {
  const p = t.preview;

  // Patterns décoratifs en SVG inline ultra-léger
  const patterns = {
    grid:     <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)",backgroundSize:"12px 12px"}} />,
    frame:    <div style={{position:"absolute",inset:"6px",border:"1px solid rgba(255,255,255,.3)",pointerEvents:"none"}} />,
    dots:     <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(255,255,255,.15) 1px,transparent 1px)",backgroundSize:"8px 8px"}} />,
    stripes:  <div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(-45deg,transparent,transparent 6px,rgba(255,255,255,.08) 6px,rgba(255,255,255,.08) 12px)"}} />,
    border:   <div style={{position:"absolute",inset:"6px",border:"1px solid #e2e8f0"}} />,
    blobs:    <div style={{position:"absolute",width:"60px",height:"60px",borderRadius:"30% 70% 70% 30%",background:"rgba(255,255,255,.15)",top:"-10px",right:"-10px"}} />,
    code:     <div style={{position:"absolute",bottom:"8px",left:"8px",right:"8px",height:"2px",background:`linear-gradient(90deg,#00d4ff,transparent)`}} />,
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
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "3/4",
        borderRadius: "8px",
        overflow: "hidden",
        background: p.bg,
        boxShadow: isSelected ? "0 0 0 2.5px #0f172a, 0 0 0 4px white" : "0 2px 8px rgba(0,0,0,.15)",
        transform: isSelected ? "scale(1.04)" : "scale(1)",
        transition: "transform .15s, box-shadow .15s",
      }}
    >
      {/* Pattern décoratif */}
      {patterns[p.pattern] || null}

      {/* Spine livre */}
      <div style={{position:"absolute",left:0,top:0,bottom:0,width:"4px",background:"rgba(0,0,0,.2)"}} />

      {/* Contenu cover miniature */}
      <div style={{position:"relative",zIndex:1,padding:"10px 8px 8px 12px",display:"flex",flexDirection:"column",height:"100%"}}>
        {/* Badge */}
        <div style={{fontSize:"5px",fontWeight:700,letterSpacing:"0.05em",padding:"2px 5px",borderRadius:"20px",marginBottom:"6px",width:"fit-content",lineHeight:1.4}}
          className={p.badgeStyle}>
          {p.badge}
        </div>
        {/* Trait titre */}
        <div style={{width:"70%",height:"3px",borderRadius:"2px",background:"rgba(255,255,255,.6)",marginBottom:"3px"}} />
        <div style={{width:"50%",height:"2px",borderRadius:"2px",background:"rgba(255,255,255,.35)",marginBottom:"8px"}} />
        {/* Petits blocs texte */}
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:"2.5px"}}>
          {[85,70,75,60].map((w,i)=>(
            <div key={i} style={{width:`${w}%`,height:"2px",borderRadius:"1px",background:"rgba(255,255,255,.2)"}} />
          ))}
        </div>
        {/* Auteur */}
        <div style={{width:"55%",height:"2px",borderRadius:"1px",background:"rgba(255,255,255,.4)",marginTop:"auto"}} />
      </div>

      {/* Check sélectionné */}
      {isSelected && (
        <div style={{position:"absolute",top:"5px",right:"5px",width:"16px",height:"16px",borderRadius:"50%",background:"#0f172a",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg width="8" height="8" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5 4-4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
        </div>
      )}
    </div>
  );
};

/* --- TEMPLATE PICKER — grille scrollable + modal bottom sheet mobile --- */
const TemplatePicker = ({ value, onChange }) => {
  const [showAll, setShowAll] = useState(false);
  const selected = TEMPLATES.find(t => t.id === value) || TEMPLATES[0];

  return (
    <div>
      {/* Grille principale — 4 cols sur mobile, scroll horizontal */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
        }}
      >
        {TEMPLATES.slice(0, showAll ? 16 : 8).map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"5px",background:"none",border:"none",cursor:"pointer",padding:0}}
          >
            <MiniCoverPreview t={t} isSelected={value === t.id} />
            <span style={{
              fontSize:"9px",
              fontWeight: value === t.id ? 700 : 500,
              color: value === t.id ? "#0f172a" : "#64748b",
              textAlign:"center",
              lineHeight:1.2,
              width:"100%",
              overflow:"hidden",
              textOverflow:"ellipsis",
              whiteSpace:"nowrap",
            }}>
              {t.label}
            </span>
          </button>
        ))}
      </div>

      {/* Bouton Voir tout / Réduire */}
      <button
        type="button"
        onClick={() => setShowAll(v => !v)}
        style={{
          marginTop:"12px",
          width:"100%",
          padding:"8px",
          borderRadius:"10px",
          border:"1px dashed #cbd5e1",
          background:"#f8fafc",
          fontSize:"12px",
          fontWeight:600,
          color:"#475569",
          cursor:"pointer",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          gap:"6px",
        }}
      >
        {showAll ? (
          <><svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 8l4-4 4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>Voir moins</>
        ) : (
          <><svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>Voir les {TEMPLATES.length - 8} autres templates</>
        )}
      </button>

      {/* Template sélectionné - badge récapitulatif */}
      <div style={{
        marginTop:"10px",
        padding:"8px 12px",
        borderRadius:"8px",
        background:"#f1f5f9",
        display:"flex",
        alignItems:"center",
        gap:"8px",
        fontSize:"12px",
        color:"#475569",
      }}>
        <div style={{
          width:"28px",
          height:"38px",
          borderRadius:"4px",
          overflow:"hidden",
          flexShrink:0,
          background: selected.preview.bg,
          position:"relative",
        }}>
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

/* --- NUMBER SLIDER --- */
const NumberPicker = ({ label, value, options, onChange }) => (
  <div>
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-lg font-bold text-slate-900">{value}</span>
    </div>
    <div className="flex gap-1">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt.toString())}
          className={`
            flex-1 py-2 text-xs font-medium rounded-lg transition-all
            ${parseInt(value) === opt 
              ? 'bg-slate-900 text-white' 
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }
          `}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

/* --- MODAL EXEMPLE EBOOK --- */
const ExampleEbookModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full text-xs font-medium w-fit mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              Exemple réel
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Voici un exemple d'ebook généré avec Bookzy
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Cet ebook a été créé en 1 min avec le <span className="font-semibold text-amber-600">template Corporate</span>. Vous obtiendrez la même qualité professionnelle avec votre sujet et le template de votre choix.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        {/* PDF Preview */}
        <div className="flex-1 bg-slate-100 overflow-hidden min-h-[400px]">
          <iframe 
            src={`https://docs.google.com/viewer?url=${encodeURIComponent(EXAMPLE_EBOOK_URL)}&embedded=true`}
            className="w-full h-full min-h-[450px] sm:min-h-[550px]"
            title="Exemple d'ebook Bookzy"
          />
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            J'ai compris, générer le mien
          </button>
        </div>
      </div>
    </div>
  );
};

// === COMPOSANT PRINCIPAL ===
function NouveauProjetPageContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { balance } = useCredits();
  const hasProcessedPayment = useRef(false);
  const bookRef = useRef(null);
  const bookRefMobile = useRef(null);

  // ÉTATS FORMULAIRE
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [pages, setPages] = useState("30");
  const [chapters, setChapters] = useState("6");
  const [tone, setTone] = useState("Professionnel");
  const [audience, setAudience] = useState("Débutants");
  const [template, setTemplate] = useState("modern");
  
  // ÉTATS PROCESS
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedProgress, setSimulatedProgress] = useState(0);
  const [finalKitData, setFinalKitData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isDownloadingCover, setIsDownloadingCover] = useState(false);

  // ÉTATS PAIEMENT/GÉNÉRATION
  const txId = params.get("tx");
  const kkiapayId = params.get("kkiapayId");
  const [realGenerating, setRealGenerating] = useState(!!txId);
  const [progressPercent, setProgressPercent] = useState(0);
  const [generatedKit, setGeneratedKit] = useState(null);

  // PRIX
  const [dynamicPrice, setDynamicPrice] = useState(2100);
  const [dynamicCurrency, setDynamicCurrency] = useState("XOF");
  const [dynamicProvider, setDynamicProvider] = useState("moneroo");

  // OUTLINE
  const [predictedOutline, setPredictedOutline] = useState([]);
  const outlineFetchedRef = useRef(false);
  const outlineDataRef = useRef(null);

  // IA
  const [improvingTitle, setImprovingTitle] = useState(false);
  const [improvingDescription, setImprovingDescription] = useState(false);

  // DOWNLOAD COVER
  const handleDownloadCover = async () => {
    const targetRef = window.innerWidth >= 1024 ? bookRef.current : bookRefMobile.current;
    if (!targetRef) return;
    setIsDownloadingCover(true);
    try {
      const dataUrl = await toPng(targetRef, { cacheBust: true, pixelRatio: 8 });
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        const newWindow = window.open();
        if (newWindow) {
          newWindow.document.write(`<!DOCTYPE html><html><head><title>Cover</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;padding:20px;background:#0f172a;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh}img{max-width:90%;border-radius:12px;margin-bottom:24px}.btn{padding:14px 28px;background:#2563eb;color:white;text-decoration:none;border-radius:12px;font-weight:bold}</style></head><body><img src="${dataUrl}"/><p style="color:#e2e8f0;text-align:center;font-size:14px">Appuyez longuement pour enregistrer</p><a href="${dataUrl}" download="cover.png" class="btn">Télécharger</a></body></html>`);
          newWindow.document.close();
        }
      } else {
        const link = document.createElement('a');
        link.download = `bookzy-cover-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      alert("Erreur capture");
    } finally {
      setIsDownloadingCover(false);
    }
  };

  // FETCH PRICE
  useEffect(() => {
    fetch("/api/ebooks/price").then(r => r.json()).then(data => {
      if (data.success) {
        setDynamicPrice(data.price);
        setDynamicCurrency(data.currency);
        setDynamicProvider(data.provider);
      }
    }).catch(console.error);
  }, []);

  // URL PARAMS
  useEffect(() => {
    const t = params.get("template");
    if (t && TEMPLATES.some(temp => temp.id === t)) setTemplate(t);
    const suggestion = params.get("suggestion");
    if (suggestion) setTitre(decodeURIComponent(suggestion));
    const desc = params.get("description");
    if (desc) setDescription(decodeURIComponent(desc));
    
    if (txId && !hasProcessedPayment.current) {
      if (generatedKit) { setRealGenerating(false); return; }
      hasProcessedPayment.current = true;
      setRealGenerating(true);
      verifyAndGenerate(txId, kkiapayId);
    }
  }, [params, txId, kkiapayId]);

  // IMPROVE TITLE
  const handleImproveTitle = async () => {
    if (!titre || improvingTitle) return;
    setImprovingTitle(true);
    try {
      const res = await fetch("/api/ebooks/improve-title", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titre, tone, audience }),
      });
      const data = await res.json();
      if (data.success && data.improvedTitle) setTitre(data.improvedTitle);
    } catch (e) { console.error(e); }
    finally { setImprovingTitle(false); }
  };

  // IMPROVE DESCRIPTION
  const handleImproveDescription = async () => {
    if (!description || improvingDescription) return;
    setImprovingDescription(true);
    try {
      const res = await fetch("/api/ebooks/improve-description", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titre, description, tone, audience }),
      });
      const data = await res.json();
      if (data.success && data.improvedDescription) setDescription(data.improvedDescription);
    } catch (e) { console.error(e); }
    finally { setImprovingDescription(false); }
  };

  const forceChapterCount = (rawOutline, targetCount) => {
    let clean = rawOutline.filter(l => {
      const lower = l.toLowerCase();
      return !lower.includes("introduction") && !lower.includes("conclusion") && !lower.includes("préface");
    });
    const target = parseInt(targetCount) || 5;
    if (clean.length > target) clean = clean.slice(0, target);
    while (clean.length < target) clean.push(`Chapitre ${clean.length + 1}`);
    return [`Introduction`, ...clean, `Conclusion`];
  };

  // FETCH OUTLINE
  useEffect(() => {
    if (isSimulating && !outlineFetchedRef.current) {
      outlineFetchedRef.current = true;
      fetch("/api/ebooks/outline", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titre, tone, audience, chapters }) 
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.outline) outlineDataRef.current = forceChapterCount(data.outline, chapters);
        else throw new Error("No outline");
      })
      .catch(() => {
        outlineDataRef.current = forceChapterCount([], parseInt(chapters) || 5);
      });
    }
  }, [isSimulating, titre, tone, audience, chapters]);

  // PROGRESS TIMER
  useEffect(() => {
    let interval;
    if (isSimulating) {
      setSimulatedProgress(0);
      interval = setInterval(() => {
        setSimulatedProgress(prev => {
          const isReady = outlineDataRef.current?.length > 0;
          if (isReady && prev > 80) return Math.min(prev + 5, 100);
          if (prev >= 100) return 100;
          if (!isReady && prev > 85) return prev;
          return prev + 1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  // WATCHER - CREATE DRAFT
  useEffect(() => {
    if (simulatedProgress >= 100 && isSimulating) {
      const finalOutline = outlineDataRef.current || forceChapterCount([], parseInt(chapters) || 5);
      
      const createDraft = async () => {
        try {
          const res = await fetch("/api/projets/ajouter", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              titre, description, template,
              pages: parseInt(pages), chapitres: parseInt(chapters),
              ton: tone, audience, outline: finalOutline
            })
          });
          const data = await res.json();
          if (data.success && data.projet) {
            setPredictedOutline(finalOutline);
            setFinalKitData({
              projetId: data.projet._id.toString(),
              title: titre, description, pages, chapters,
              tone, audience, template,
              price: dynamicPrice, currency: dynamicCurrency,
              provider: dynamicProvider, outline: finalOutline
            });
            setShowPreview(true);
          }
        } catch (e) { console.error(e); }
      };
      createDraft();
      setIsSimulating(false);
      setSimulatedProgress(0);
      outlineFetchedRef.current = false;
      outlineDataRef.current = null;
      window.scrollTo(0, 0);
    }
  }, [simulatedProgress, isSimulating, titre, description, pages, chapters, tone, audience, template, dynamicPrice, dynamicCurrency, dynamicProvider]);

  // VERIFY & GENERATE
  const verifyAndGenerate = async (transactionId, kkiapayId) => {
    try {
      const verifyRes = await fetch("/api/payments/verify", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId, kkiapayId })
      });
      const data = await verifyRes.json();
      
      if (data.success && data.paid) {
        window.history.replaceState({}, '', '/dashboard/projets/nouveau');
        setRealGenerating(true);
        
        const kitData = data.transaction.kitData || {};
        const currentTitre = titre || kitData.title;
        const currentDesc = description || kitData.description;
        const currentOutline = predictedOutline.length > 0 ? predictedOutline : (kitData.outline || []);
        const currentTemplate = template || "modern";
        
        const genRes = await fetch("/api/ebooks/generate", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projetId: data.transaction.projetId || null,
            transactionId,
            titre: currentTitre, description: currentDesc,
            tone: kitData.tone || tone, audience: kitData.audience || audience,
            pages: kitData.pages || pages, chapters: kitData.chapters || chapters,
            template: currentTemplate, outline: currentOutline
          }),
        });
        
        const genData = await genRes.json();
        if (!genData.success) throw new Error(genData.message);
        
        if (genData.alreadyGenerated) {
          setRealGenerating(false);
          setGeneratedKit({ title: currentTitre || "Mon eBook", pdfUrl: genData.pdfUrl, kitUrl: genData.kitUrl || "#" });
          return;
        }
        
        const finalProjetId = genData.projetId;
        const pollInterval = setInterval(async () => {
          try {
            const pRes = await fetch(`/api/ebooks/progress/${finalProjetId}`);
            const pData = await pRes.json();
            setProgressPercent(pData.progress || 0);
            
            if (pData.status === "COMPLETED") {
              clearInterval(pollInterval);
              setFinalKitData(null);
              setGeneratedKit({ title: currentTitre || "Mon eBook", pdfUrl: pData.pdfUrl || "#", kitUrl: pData.kitUrl || "#" });
              setRealGenerating(false);
            }
            if (pData.status === "ERROR") {
              clearInterval(pollInterval);
              setRealGenerating(false);
              alert("Erreur technique.");
            }
          } catch (e) { console.error(e); }
        }, 3000);
      } else {
        throw new Error("Paiement non validé.");
      }
    } catch (e) {
      console.error(e);
      setRealGenerating(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSimulating(true);
  };
  const isFormValid = titre.length > 3 && description.length > 10;

  return (
    <>
      <Script src="https://cdn.kkiapay.me/k.js" strategy="lazyOnload" />
      <div className="min-h-screen bg-slate-50">

        <main>
          <div className="max-w-5xl mx-auto px-5 py-8 lg:py-12">
            
            {/* TITRE PAGE */}
            <div className="text-center mb-10">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                Générez votre ebook
              </h1>
              <p className="text-slate-500 text-sm">
                En quelques clics, obtenez un ebook professionnel prêt à vendre
              </p>
            </div>

            <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
              
              {/* GAUCHE - FORMULAIRE */}
              <div className="lg:col-span-3">
                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* SECTION 1 - CONTENU */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-5">
                      Contenu
                    </h2>
                    
                    {/* Titre */}
                    <div className="mb-5">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Titre</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={titre} 
                          onChange={e => setTitre(e.target.value)}
                          placeholder="Ex: Guide complet du marketing digital"
                          className="w-full px-4 py-3 pr-24 bg-slate-50 border-0 rounded-xl text-slate-900 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900 transition-all"
                        />
                        <button
                          type="button"
                          onClick={handleImproveTitle}
                          disabled={!titre || improvingTitle}
                          className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1.5 text-xs text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:text-slate-400 rounded-lg flex items-center gap-1.5 transition-all"
                        >
                          {improvingTitle ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowUpRightFromCircleIcon className="w-3.5 h-4.5" />}
                          {improvingTitle ? "..." : "Améliorer"}
                        </button>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                      <div className="relative">
                        <textarea 
                          rows={3}
                          value={description} 
                          onChange={e => setDescription(e.target.value)}
                          placeholder="Décrivez ce que les lecteurs vont apprendre..."
                          className="w-full px-4 py-3 pr-24 bg-slate-50 border-0 rounded-xl text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900 resize-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={handleImproveDescription}
                          disabled={!description || improvingDescription}
                          className="absolute right-2 top-2 px-2.5 py-1.5 text-xs text-blue-600 hover:bg-blue-50 disabled:opacity-30 disabled:text-slate-400 rounded-lg flex items-center gap-1.5 transition-all"
                        >
                          {improvingDescription ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowUpRightFromCircleIcon className="w-3.5 h-4.5" />}
                          {improvingDescription ? "..." : "Améliorer"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2 - STRUCTURE */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-5">
                      Structure
                    </h2>
                    
                    <div className="grid sm:grid-cols-2 gap-6">
                      <NumberPicker 
                        label="Pages" 
                        value={pages} 
                        options={PAGES_OPTIONS} 
                        onChange={setPages} 
                      />
                      <NumberPicker 
                        label="Chapitres" 
                        value={chapters} 
                        options={CHAPTERS_OPTIONS} 
                        onChange={setChapters} 
                      />
                    </div>
                  </div>

                  {/* SECTION 3 - STYLE */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-5">
                      Style
                    </h2>
                    
                    {/* Template */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-slate-700 mb-3">Template</label>
                      <TemplatePicker value={template} onChange={setTemplate} />
                    </div>

                    {/* Ton */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-slate-700 mb-3">Ton</label>
                      <PillSelector options={TONES} value={tone} onChange={setTone} />
                    </div>

                    {/* Audience */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">Audience</label>
                      <PillSelector options={AUDIENCES} value={audience} onChange={setAudience} />
                    </div>
                  </div>

                  {/* SUBMIT */}
                  <button 
                    type="submit"
                    disabled={!isFormValid}
                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    Générer maintenant
                    <ArrowRight className="w-4 h-4" />
                  </button>

                </form>

                {/* PREVIEW MOBILE - After button */}
                <div className="mt-8 lg:hidden">
                  <div className="bg-slate-900 rounded-2xl p-6">
                    
                    {/* Book */}
                    <div ref={bookRefMobile} className="mb-6">
                      <Book3D title={titre} template={template} />
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-white/5 rounded-xl p-3 text-center">
                        <div className="text-xl font-bold text-white">{pages}</div>
                        <div className="text-[10px] text-slate-400 uppercase">Pages</div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 text-center">
                        <div className="text-xl font-bold text-white">{chapters}</div>
                        <div className="text-[10px] text-slate-400 uppercase">Chapitres</div>
                      </div>
                    </div>

                    {/* Inclus */}
                    <div className="space-y-2.5 mb-6">
                      {["PDF professionnel", "Cover 3D", "Kit marketing"].map((item, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-sm text-white/70">
                          <Check className="w-4 h-4 text-green-400" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* Download */}
                    <button
                      type="button"
                      onClick={handleDownloadCover}
                      disabled={isDownloadingCover || !titre}
                      className="w-full py-2.5 border border-white/20 text-white/60 hover:text-white hover:bg-white/5 disabled:opacity-30 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
                    >
                      {isDownloadingCover ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      Télécharger la cover
                    </button>

                  </div>
                </div>
              </div>

              {/* DROITE - PREVIEW DESKTOP ONLY */}
              <div className="lg:col-span-2 hidden lg:block">
                <div className="lg:sticky lg:top-8">
                  <div className="bg-slate-900 rounded-2xl p-6 sm:p-8">
                    
                    {/* Book */}
                    <div ref={bookRef} className="mb-6">
                      <Book3D title={titre} template={template} />
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-white/5 rounded-xl p-3 text-center">
                        <div className="text-xl font-bold text-white">{pages}</div>
                        <div className="text-[10px] text-slate-400 uppercase">Pages</div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 text-center">
                        <div className="text-xl font-bold text-white">{chapters}</div>
                        <div className="text-[10px] text-slate-400 uppercase">Chapitres</div>
                      </div>
                    </div>

                    {/* Inclus */}
                    <div className="space-y-2.5 mb-6">
                      {["PDF professionnel", "Cover 3D", "Kit marketing"].map((item, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-sm text-white/70">
                          <Check className="w-4 h-4 text-green-400" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* Download */}
                    <button
                      type="button"
                      onClick={handleDownloadCover}
                      disabled={isDownloadingCover || !titre}
                      className="w-full py-2.5 border border-white/20 text-white/60 hover:text-white hover:bg-white/5 disabled:opacity-30 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
                    >
                      {isDownloadingCover ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      Télécharger la cover
                    </button>

                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>

        {isSimulating && <SimulationModal progress={simulatedProgress} />}
        {realGenerating && <RealGenerationModal progress={progressPercent} />}

        {/* PREVIEW — overlay instantané sans unmount */}
        {finalKitData && (
          <div
            style={{
              position: "fixed", inset: 0, zIndex: 9999,
              transform: showPreview ? "translateX(0)" : "translateX(100%)",
              transition: "transform 0ms",
              willChange: "transform",
              backgroundColor: "white",
            }}
          >
            <PreviewPage
              kit={finalKitData}
              onEdit={() => setShowPreview(false)}
              onGenerated={(result) => setGeneratedKit(result)}
            />
          </div>
        )}
      </div>
    </>
  );
}

// === PREVIEW PAGE ===
function PreviewPage({ kit, onEdit, onGenerated }) {
  const router = useRouter();
  const hasDebited = useRef(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showExampleModal, setShowExampleModal] = useState(false);
  const [showNoCreditsModal, setShowNoCreditsModal] = useState(false);
  const [downloadKit, setDownloadKit] = useState(null);
  const [realProgress, setRealProgress] = useState(5);
  const { balance, mutateBalance } = useCredits();

  const handleGenerate = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      // Lancer la génération (asynchrone — la route répond immédiatement)
      // Lancer la génération — le débit est géré côté serveur dans /api/ebooks/generate
      const genRes = await fetch("/api/ebooks/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          projetId: kit.projetId,
          titre: kit.title,
          description: kit.description,
          pages: kit.pages,
          chapters: kit.chapters,
          tone: kit.tone,
          audience: kit.audience,
          template: kit.template,
          outline: kit.outline,
        })
      });
      const genData = await genRes.json();

      if (!genData.success) {
        if (genData.insufficientCredits) {
          hasDebited.current = false;
          setShowNoCreditsModal(true);
          setIsGenerating(false);
          return;
        }
        if (genData.message && genData.message !== "Génération lancée") {
          alert(genData.message || "Erreur lors du lancement");
          setIsGenerating(false);
          return;
        }
      }

      // La route est async — poll /api/ebooks/generate?projetId=... jusqu'à COMPLETED
      const projetId = genData.projetId || kit.projetId;
      let attempts = 0;
      const maxAttempts = 120; // 2 min max

      const poll = async () => {
        if (attempts >= maxAttempts) {
          alert("Délai dépassé. Vérifiez vos projets.");
          setIsGenerating(false);
          return;
        }
        attempts++;
        try {
          const statusRes = await fetch(`/api/ebooks/progress/${projetId}`, {
            credentials: "include"
          });
          const statusData = await statusRes.json();
          if (statusData.progress) setRealProgress(statusData.progress);

          if (statusData.status === "COMPLETED" && statusData.pdfUrl) {
            setRealProgress(100);
            setIsGenerating(false);
            await mutateBalance?.();
            setDownloadKit({ pdfUrl: statusData.pdfUrl, docxUrl: statusData.docxUrl || null, title: kit.title, projetId });
          } else if (statusData.status === "ERROR") {
            alert("Erreur lors de la génération. Réessayez.");
            setIsGenerating(false);
          } else {
            // Encore en cours — repoller dans 2s
            setTimeout(poll, 2000);
            // (poll récursif toutes les 2s)
          }
        } catch (e) {
          setTimeout(poll, 3000);
        }
      };

      setTimeout(poll, 1000); // Premier poll après 1s

    } catch (e) {
      console.error(e);
      alert("Erreur technique");
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {isGenerating && <GeneratingOverlay progress={realProgress} />}
      {downloadKit && <DownloadKitModal kit={downloadKit} router={router} />}

      {showNoCreditsModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 3h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center mb-1">Crédits insuffisants</h3>
            <p className="text-sm text-slate-500 text-center mb-5">La génération d'un ebook coûte <span className="font-semibold text-slate-900">20 crédits</span>. Rechargez votre solde pour continuer.</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => { setShowNoCreditsModal(false); router.push("/dashboard/tarifs"); }}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all"
              >
                Acheter des crédits
              </button>
              <button
                onClick={() => setShowNoCreditsModal(false)}
                className="w-full py-2.5 text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal exemple */}
      <ExampleEbookModal 
        isOpen={showExampleModal} 
        onClose={() => setShowExampleModal(false)} 
      />
      
      {/* Header */}
      <header className={`bg-white border-b border-slate-100 fixed top-0 left-0 right-0 ${showNoCreditsModal ? "z-0" : "z-[10000]"}`}>
        <div className="max-w-4xl mx-auto px-4 h-12 flex items-center justify-between">
          <button onClick={onEdit} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Modifier
          </button>
          <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Prêt
          </span>
        </div>
      </header>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto pb-32 pt-12">
        <div className="max-w-4xl mx-auto px-4 py-4">
          
          {/* Book + Stats - Compact on mobile */}
          <div className="flex items-center gap-4 mb-4 p-4 bg-slate-100 rounded-2xl">
            {/* Mini Book */}
            <div className="relative w-24 h-32 flex-shrink-0">
              <div 
                className="absolute inset-0 rounded-r-sm rounded-l-[1px] shadow-lg overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${TEMPLATES.find(t => t.id === kit.template)?.primaryColor || '#2563eb'}, ${TEMPLATES.find(t => t.id === kit.template)?.accentColor || '#7c3aed'})` }}
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-r from-black/20 to-transparent" />
                <div className="p-2 text-white">
                  <div className="text-[6px] uppercase tracking-wider opacity-60 mb-1">Guide</div>
                  <h3 className="text-[9px] font-bold leading-tight line-clamp-5">{kit.title}</h3>
                </div>
              </div>
              <div className="absolute top-0.5 -right-0.5 bottom-0.5 w-1 bg-white rounded-r-sm -z-10" />
            </div>
            
            {/* Stats */}
            <div className="flex-1 flex gap-3">
              <div className="bg-white px-4 py-2 rounded-xl text-center flex-1">
                <div className="text-lg font-bold text-slate-900">{kit.pages}</div>
                <div className="text-[9px] text-slate-500 uppercase">Pages</div>
              </div>
              <div className="bg-white px-4 py-2 rounded-xl text-center flex-1">
                <div className="text-lg font-bold text-slate-900">{kit.chapters}</div>
                <div className="text-[9px] text-slate-500 uppercase">Chap.</div>
              </div>
            </div>
          </div>

          {/* Sommaire */}
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900 mb-3">Sommaire</h2>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {kit.outline?.map((chap, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                    chap.toLowerCase().includes('intro') || chap.toLowerCase().includes('concl')
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {chap.toLowerCase().includes('intro') ? 'I' : chap.toLowerCase().includes('concl') ? 'C' : idx}
                  </div>
                  <span className="text-sm text-slate-700 flex-1 truncate">{chap}</span>
                  <Lock className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Bonus */}
          <div className="mb-6">
            <h4 className="text-xs font-semibold text-slate-400 uppercase mb-3">Bonus inclus</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                <MessageCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-slate-700">Posts réseaux sociaux</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
                <Smartphone className="w-4 h-4 text-green-600" />
                <span className="text-sm text-slate-700">Scripts WhatsApp</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg">
                <PenTool className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-slate-700">Texte page de vente</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* CTA Fixed Bottom */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] transition-all duration-200 ${(isGenerating || downloadKit) ? "opacity-0 pointer-events-none translate-y-4" : "opacity-100 translate-y-0"}`}>
        <div className="max-w-4xl mx-auto">
          
          {/* Bouton voir exemple */}
          <button
            onClick={() => setShowExampleModal(true)}
            className="w-full py-2.5 mb-3 bg-amber-100 hover:bg-amber-200 text-amber-700 font-medium rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Voir un exemple d'ebook Bookzy
          </button>
          
          <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-2">
            <Clock className="w-3 h-3" />
            <span>Génération : ~1 min · 20 crédits seront débités</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[9px] text-slate-400 uppercase">Coût</div>
              <div className="text-xl font-bold text-slate-900">
                20 <span className="text-xs font-normal text-slate-500">crédits</span>
              </div>
            </div>
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Génération en cours...</>
              ) : (
                <><Zap className="w-4 h-4" /> Générer mon ebook</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// === MODALS ===
function SimulationModal({ progress }) {
  return (
    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm flex flex-col items-center justify-center z-50 p-6">
      <div className="w-20 h-20 mb-6 relative">
        <svg className="w-full h-full -rotate-90">
          <circle cx="40" cy="40" r="36" strokeWidth="4" fill="none" className="stroke-slate-700" />
          <circle cx="40" cy="40" r="36" strokeWidth="4" fill="none" strokeLinecap="round" className="stroke-white transition-all duration-300" strokeDasharray="226" strokeDashoffset={226 - (226 * progress) / 100} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold">{Math.round(progress)}%</div>
      </div>
      <h2 className="text-white text-lg font-semibold mb-1">Analyse en cours</h2>
      <p className="text-slate-400 text-sm">Génération du sommaire...</p>
    </div>
  );
}

function RealGenerationModal({ progress }) {
  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center z-50 p-6">
      <div className="w-20 h-20 mb-6 relative">
        <div className="absolute inset-0 border-4 border-slate-700 rounded-full" />
        <div className="absolute inset-0 border-4 border-white rounded-full border-t-transparent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold">{Math.round(progress)}%</div>
      </div>
      <h2 className="text-white text-lg font-semibold mb-1">Rédaction en cours</h2>
      <p className="text-slate-400 text-sm">Ne fermez pas cette page</p>
    </div>
  );
}

function GeneratingOverlay({ progress = 0 }) {
  // Affiche directement le vrai progress du serveur
  const displayPct = progress || 5;

  const label =
    displayPct < 20 ? "Démarrage..." :
    displayPct < 40 ? "Rédaction introduction..." :
    displayPct < 70 ? "Rédaction des chapitres..." :
    displayPct < 80 ? "Conclusion & visuels..." :
    displayPct < 95 ? "Génération du PDF..." :
    displayPct < 100 ? "Mise en ligne..." :
    "Terminé !";

  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center z-[200] p-6">
      <div className="w-20 h-20 mb-6 relative">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" strokeWidth="5" fill="none" className="stroke-slate-700" />
          <circle
            cx="40" cy="40" r="34" strokeWidth="5" fill="none"
            stroke="white" strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 34}`}
            strokeDashoffset={`${2 * Math.PI * 34 * (1 - displayPct / 100)}`}
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">{Math.round(displayPct)}%</div>
      </div>
      <h2 className="text-white text-lg font-semibold mb-1">Génération en cours</h2>
      <p className="text-slate-400 text-sm text-center">{label}</p>
      <p className="text-slate-600 text-xs mt-2">Ne fermez pas cette page</p>
    </div>
  );
}

function DownloadKitModal({ kit, router }) {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-6 overflow-y-auto">
      <div className="max-w-sm w-full text-center py-4">

        {/* Header */}
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">C'est prêt ! 🎉</h2>
        <p className="text-slate-500 text-sm mb-6">Votre ebook a été généré avec succès</p>

        {/* PDF principal */}
        <a
          href={kit.pdfUrl}
          download
          className="flex items-center gap-3 p-4 rounded-xl border-2 border-slate-900 bg-slate-900 hover:bg-slate-800 transition-all mb-6"
        >
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-semibold text-white text-sm">Télécharger mon ebook (PDF)</div>
            <div className="text-xs text-slate-400">Version complète· prêt à vendre</div>
          </div>
          <Download className="w-5 h-5 text-white flex-shrink-0" />
        </a>

        {/* Séparateur Bonus */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-slate-100" />
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2">Inclus avec votre ebook</span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>

        {/* Bonus items */}
        <div className="space-y-2 mb-6">

          {/* Format Word */}
          {kit.docxUrl ? (
            <a
              href={kit.docxUrl}
              download
              className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all"
            >
              <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileCheck2 className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-slate-900 text-sm">Version modifiable offerte (.docx)</div>
                <div className="text-xs text-slate-400">Éditable dans Word ou Google Docs</div>
              </div>
              <Download className="w-4 h-4 text-slate-400 flex-shrink-0" />
            </a>
          ) : (
            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50 opacity-50">
              <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileCheck2 className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-slate-400 text-sm">Version modifiable offerte (.docx)</div>
                <div className="text-xs text-slate-300">En cours de préparation...</div>
              </div>
            </div>
          )}

          {/* Publier sur boutique */}
          <button
            onClick={() => router.push('/dashboard/smart-shop/boutique?fromEbook=' + encodeURIComponent(kit.title) + (kit.projetId ? '&projetId=' + kit.projetId : ''))}
            className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all w-full"
          >
            <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-slate-900 text-sm">Publier sur ma boutique</div>
              <div className="text-xs text-slate-400">Vendre via Smart Shop</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
          </button>

          {/* Kits marketing */}
          <button
            onClick={() => router.push('/dashboard/fichiers/' + kit.projetId)}
            className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all w-full"
          >
            <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-slate-900 text-sm">Kits marketing</div>
              <div className="text-xs text-slate-400">Posts prêts pour Facebook, WhatsApp, email...</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
          </button>

        </div>

        {/* CTA bibliothèque */}
        <button
          onClick={() => router.push('/dashboard/fichiers')}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300 text-sm font-medium transition-all"
        >
          <BookOpen className="w-4 h-4" />
          Voir tout dans ma bibliothèque
        </button>

      </div>
    </div>
  );
}

export default function NouveauProjetPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    }>
      <NouveauProjetPageContent />
    </Suspense>
  );
}