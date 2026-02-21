"use client";
import { Suspense } from "react";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Script from "next/script";
import { toPng } from "html-to-image";
import {
  CheckCircle2, Loader2, Sparkles,
  FileText, Zap, MessageCircle, PenTool, Lock, Download,
  Clock, Smartphone, ArrowRight, ArrowLeft, Check
} from "lucide-react";

// --- DONNÉES ---
const TEMPLATES = [
  { id: "modern", label: "Moderne", primaryColor: "#2563eb", accentColor: "#7c3aed" },
  { id: "luxe", label: "Luxe", primaryColor: "#f59e0b", accentColor: "#fbbf24" },
  { id: "educatif", label: "Éducatif", primaryColor: "#10b981", accentColor: "#0d9488" },
  { id: "energie", label: "Énergique", primaryColor: "#f97316", accentColor: "#ef4444" },
  { id: "minimal", label: "Minimal", primaryColor: "#64748b", accentColor: "#334155" },
  { id: "creative", label: "Créatif", primaryColor: "#8b5cf6", accentColor: "#ec4899" },
];

const TONES = ["Professionnel", "Simple", "Expert", "Inspirant"];
const AUDIENCES = ["Débutants", "Étudiants", "Freelances", "Entrepreneurs", "Grand Public"];
const PAGES_OPTIONS = [20, 30, 40, 50, 60, 70, 80];
const CHAPTERS_OPTIONS = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

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

/* --- TEMPLATE PICKER --- */
const TemplatePicker = ({ value, onChange }) => (
  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
    {TEMPLATES.map(t => (
      <button
        key={t.id}
        type="button"
        onClick={() => onChange(t.id)}
        className="flex flex-col items-center gap-2"
      >
        <div 
          className={`
            w-full aspect-[3/4] rounded-lg overflow-hidden transition-all
            ${value === t.id ? 'ring-2 ring-slate-900 ring-offset-2 scale-105' : 'hover:scale-105'}
          `}
          style={{ background: `linear-gradient(135deg, ${t.primaryColor}, ${t.accentColor})` }}
        >
          {value === t.id && (
            <div className="w-full h-full flex items-center justify-center bg-black/20">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
        <span className={`text-[10px] font-medium ${value === t.id ? 'text-slate-900' : 'text-slate-500'}`}>
          {t.label}
        </span>
      </button>
    ))}
  </div>
);

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

// === COMPOSANT PRINCIPAL ===
function NouveauProjetPageContent() {
  const router = useRouter();
  const params = useSearchParams();
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

  const handleSubmit = (e) => { e.preventDefault(); setIsSimulating(true); };
  const isFormValid = titre.length > 3 && description.length > 10;

  // PREVIEW PAGE
  if (showPreview && finalKitData) {
    return <PreviewPage kit={finalKitData} onEdit={() => setShowPreview(false)} />;
  }

  return (
    <>
      <Script src="https://cdn.kkiapay.me/k.js" strategy="lazyOnload" />
      
      <div className="min-h-screen bg-slate-50">

        <main>
          <div className="max-w-5xl mx-auto px-5 py-8 lg:py-12">
            
            {/* TITRE PAGE */}
            <div className="text-center mb-10">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                Créez votre ebook
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
                          {improvingTitle ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
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
                          {improvingDescription ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
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
                    Générer l'aperçu
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
        {generatedKit && <DownloadKitModal kit={generatedKit} router={router} />}
      </div>
    </>
  );
}

// === PREVIEW PAGE ===
function PreviewPage({ kit, onEdit }) {
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  
  const handlePay = async () => {
    if (isPaymentLoading) return;
    setIsPaymentLoading(true);

    try {
      const res = await fetch("/api/payments/create", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kitData: kit, projetId: kit.projetId })
      });
      const data = await res.json();
      
      if (data.success) {
        if (data.useWidget) {
          if (typeof window.openKkiapayWidget !== 'function') {
            alert('SDK non chargé. Rechargez la page.');
            setIsPaymentLoading(false);
            return;
          }
          window.addSuccessListener((response) => {
            window.location.href = `/dashboard/projets/nouveau?tx=${data.transactionId}&kkiapayId=${response.transactionId}`;
          });
          window.addFailedListener(() => {
            setIsPaymentLoading(false);
            alert('Paiement annulé');
          });
          window.openKkiapayWidget({
            amount: data.widgetConfig.amount,
            key: data.widgetConfig.api_key,
            sandbox: data.widgetConfig.sandbox,
            email: data.widgetConfig.email || '',
            phone: data.widgetConfig.phone || '',
            name: data.widgetConfig.name || 'Client Bookzy'
          });
        } else {
          window.location.href = data.paymentUrl;
        }
      } else {
        alert(data.message || 'Erreur');
        setIsPaymentLoading(false);
      }
    } catch (e) {
      console.error(e);
      alert('Erreur technique');
      setIsPaymentLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
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
      <div className="flex-1 overflow-y-auto pb-28">
        <div className="max-w-4xl mx-auto px-4 py-4">
          
          {/* Book + Stats - Compact on mobile */}
          <div className="flex items-center gap-4 mb-4 p-4 bg-slate-100 rounded-2xl">
            {/* Mini Book */}
            <div className="relative w-20 h-28 flex-shrink-0">
              <div 
                className="absolute inset-0 rounded-r-sm rounded-l-[1px] shadow-lg overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${TEMPLATES.find(t => t.id === kit.template)?.primaryColor || '#2563eb'}, ${TEMPLATES.find(t => t.id === kit.template)?.accentColor || '#7c3aed'})` }}
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-r from-black/20 to-transparent" />
                <div className="p-2 text-white">
                  <div className="text-[6px] uppercase tracking-wider opacity-60 mb-1">Guide</div>
                  <h3 className="text-[8px] font-bold leading-tight line-clamp-4">{kit.title}</h3>
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
          <div>
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-3">
            <Clock className="w-3 h-3" />
            <span>Génération : ~1 min après paiement</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[9px] text-slate-400 uppercase">Total</div>
              <div className="text-xl font-bold text-slate-900">
                {kit.price} <span className="text-xs font-normal text-slate-500">{kit.currency}</span>
              </div>
            </div>
            <button 
              onClick={handlePay}
              disabled={isPaymentLoading}
              className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {isPaymentLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Chargement...</>
              ) : (
                <><Lock className="w-4 h-4" /> Débloquer et télécharger</>
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

function DownloadKitModal({ kit, router }) {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-6">
      <div className="max-w-sm w-full text-center">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-7 h-7 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">C'est prêt !</h2>
        <p className="text-slate-500 text-sm mb-6">Votre ebook a été généré</p>
        
        <div className="space-y-3 mb-6">
          <a href={kit.pdfUrl} download className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-slate-900 text-sm">Télécharger le PDF</div>
            </div>
            <Download className="w-5 h-5 text-slate-400" />
          </a>
          
          <button onClick={() => router.push('/dashboard/projets')} className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all w-full">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-slate-900 text-sm">Kit Marketing</div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        <button onClick={() => router.push('/dashboard/projets')} className="w-full py-3.5 bg-slate-900 text-white font-semibold rounded-xl">
          Tableau de bord
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