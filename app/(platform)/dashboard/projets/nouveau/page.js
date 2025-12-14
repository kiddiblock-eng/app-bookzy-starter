"use client";
import { Suspense } from "react";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CheckCircle2, Loader2, ArrowLeft, ArrowRight, Sparkles,
  Layers, FileText, Zap, Wand2, MessageCircle, PenTool, Lock, Shield, Download, Image as ImageIcon, BrainCircuit,
  ListOrdered, Clock, Info, AlertCircle, User, Mic, Smartphone
} from "lucide-react";

// --- DONNÉES STATIQUES ---
const TEMPLATES = [
  { id: "modern", label: "Moderne", primaryColor: "#2563eb", accentColor: "#7c3aed", font: "Inter", description: "Design élégant" },
  { id: "luxe", label: "Luxe", primaryColor: "#f59e0b", accentColor: "#fbbf24", font: "Poppins", description: "Premium" },
  { id: "educatif", label: "Éducatif", primaryColor: "#10b981", accentColor: "#0d9488", font: "Inter", description: "Clair" },
  { id: "energie", label: "Énergique", primaryColor: "#f97316", accentColor: "#ef4444", font: "Manrope", description: "Dynamique" },
  { id: "minimal", label: "Minimaliste", primaryColor: "#94a3b8", accentColor: "#475569", font: "Inter", description: "Épuré" },
  { id: "creative", label: "Créatif", primaryColor: "#8b5cf6", accentColor: "#ec4899", font: "Nunito", description: "Audacieux" },
];

const TONES = [
  { value: "professionnel", label: "Pro", icon: "💼" },
  { value: "Simple", label: "Simple", icon: "😊" },
  { value: "expert", label: "Expert", icon: "🎓" },
  { value: "inspirant", label: "Inspirant", icon: "✨" },
];

const AUDIENCES = ["Débutants", "Étudiants", "Freelances", "Grand public", "Entrepreneurs", "Parents"];

/* --- LIVRE 3D (DESIGN FINAL) --- */
const LiveBookPreview = ({ title, templateId, small = false }) => {
  const tmpl = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0];
  const displayTitle = title || "Votre Titre Ici";
  
  const wClass = small ? "w-28 md:w-36" : "w-48 md:w-64"; 
  const hClass = small ? "h-40 md:h-52" : "h-72 md:h-96";

  const getFontSizeClass = (text) => {
      const len = text.length;
      if (small) {
          if (len > 80) return "text-[6px] leading-[1.1]";
          if (len > 50) return "text-[7px] leading-[1.1]";
          return "text-[9px] leading-tight";
      } else {
          if (len > 100) return "text-sm md:text-base leading-tight";
          if (len > 60) return "text-base md:text-xl leading-snug";
          if (len > 30) return "text-lg md:text-2xl leading-snug";
          return "text-xl md:text-3xl leading-tight";
      }
  };

  return (
    <div className={`relative ${wClass} ${hClass} transition-all duration-500 transform hover:scale-105 hover:rotate-1 perspective-1000 group cursor-pointer mx-auto flex-shrink-0`}>
      <div className="absolute bottom-0 left-2 right-2 h-4 bg-black/40 blur-xl rounded-full transform translate-y-4 group-hover:scale-110 transition-transform"></div>
      <div 
        className="absolute inset-0 rounded-r-md rounded-l-sm shadow-2xl overflow-hidden flex flex-col transition-all duration-500 border-l border-white/10"
        style={{ background: `linear-gradient(135deg, ${tmpl.primaryColor}, ${tmpl.accentColor})`, fontFamily: tmpl.font }}
      >
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-r from-white/30 to-transparent z-20"></div>
        <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-black/10 z-20"></div>
        
        <div className={`flex-1 ${small ? 'p-2' : 'p-6'} flex flex-col relative z-10 text-white`}>
          <div className="mb-2">
             <div className="inline-block text-[8px] font-bold tracking-[0.2em] opacity-70 uppercase border-b border-white/20 pb-1">Guide Premium</div>
          </div>
          <h1 className={`${getFontSizeClass(displayTitle)} font-black drop-shadow-lg break-words text-left`} style={{ textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
            {displayTitle}
          </h1>
          <div className="mt-auto pt-4 border-t border-white/20 flex items-center gap-2 opacity-80">
             <div className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center"><Sparkles className="w-2 h-2"/></div>
             <span className="text-[7px] font-bold uppercase tracking-widest">Édition Limitée</span>
          </div>
        </div>
      </div>
      <div className="absolute top-1 right-1 bottom-1 w-3 bg-[#f8fafc] rounded-r-sm shadow-inner transform translate-x-full -translate-y-0.5 -z-10 border-l border-slate-300"></div>
      <div className="absolute top-1.5 right-1 bottom-1.5 w-2 bg-slate-200 rounded-r-sm transform translate-x-full -z-10"></div>
    </div>
  );
};

function NouveauProjetPageContent() {
  const router = useRouter();
  const params = useSearchParams();
  const hasProcessedPayment = useRef(false);

  // ÉTATS
  const [step, setStep] = useState(1);
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  
  // LIMITES
  const [pages, setPages] = useState("20");
  const [chapters, setChapters] = useState("5");
  
  const [tone, setTone] = useState("professionnel");
  const [audience, setAudience] = useState("Débutants");
  const [template, setTemplate] = useState("modern");
  
  const [loading, setLoading] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedProgress, setSimulatedProgress] = useState(0);
  const [finalKitData, setFinalKitData] = useState(null);
  
  const txId = params.get("tx");
  const [realGenerating, setRealGenerating] = useState(!!txId);
  const [progressPercent, setProgressPercent] = useState(0);
  const [generatedKit, setGeneratedKit] = useState(null);

  const [dynamicPrice, setDynamicPrice] = useState(2100);
  const [dynamicCurrency, setDynamicCurrency] = useState("XOF");
  const [dynamicProvider, setDynamicProvider] = useState("moneroo");

  const [predictedOutline, setPredictedOutline] = useState([]);
  const outlineFetchedRef = useRef(false);
  const outlineDataRef = useRef(null);

  useEffect(() => {
    async function fetchPrice() {
      try {
        const res = await fetch("/api/ebooks/price");
        const data = await res.json();
        if (data.success) {
          setDynamicPrice(data.price);
          setDynamicCurrency(data.currency);
          setDynamicProvider(data.provider);
        }
      } catch (err) { console.error(err); }
    }
    fetchPrice();
  }, []);

  useEffect(() => {
    const t = params.get("template");
    if (t && TEMPLATES.some((temp) => temp.id === t)) setTemplate(t);
    const suggestion = params.get("suggestion");
    if (suggestion) setTitre(decodeURIComponent(suggestion));
    const desc = params.get("description");
    if (desc) setDescription(decodeURIComponent(desc));
    
    if (txId && !hasProcessedPayment.current) {
        if (generatedKit) { setRealGenerating(false); return; }
        hasProcessedPayment.current = true;
        setRealGenerating(true);
        verifyAndGenerate(txId);
    }
  }, [params, txId]);

  // INPUTS HANDLERS
  const handlePagesChange = (e) => {
      const val = e.target.value;
      if (val === "") { setPages(""); return; }
      const num = parseInt(val);
      if (isNaN(num)) return;
      if (num > 80) { setPages("80"); return; }
      setPages(val);
  };
  const handlePagesBlur = () => {
      let num = parseInt(pages);
      if (isNaN(num) || num < 10) setPages("10");
  };

  const handleChaptersChange = (e) => {
      const val = e.target.value;
      if (val === "") { setChapters(""); return; }
      const num = parseInt(val);
      if (isNaN(num)) return;
      if (num > 12) { setChapters("12"); return; }
      setChapters(val);
  };
  const handleChaptersBlur = () => {
      let num = parseInt(chapters);
      if (isNaN(num) || num < 3) setChapters("3");
  };

  // CALCUL N+2
  const forceChapterCount = (rawOutline, targetCount) => {
    let clean = rawOutline.filter(l => {
        const lower = l.toLowerCase();
        return !lower.includes("introduction") && !lower.includes("conclusion") && !lower.includes("préface");
    });
    const target = parseInt(targetCount) || 5;
    if (clean.length > target) clean = clean.slice(0, target);
    while (clean.length < target) clean.push(`Chapitre ${clean.length + 1} : Stratégies et Clés de Succès (Bonus)`);
    return [`Introduction`, ...clean, `Conclusion`];
  };

  // API OUTLINE
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
            else throw new Error("Pas d'outline");
        })
        .catch(e => {
            const count = parseInt(chapters) || 5;
            const fallback = ["Introduction", ...Array(count).fill("Chapitre"), "Conclusion"];
            outlineDataRef.current = fallback;
        });
    }
  }, [isSimulating, titre, tone, audience, chapters]);

  // TIMER
  useEffect(() => {
    let interval;
    if (isSimulating) {
        setSimulatedProgress(0);
        interval = setInterval(() => {
            setSimulatedProgress((prev) => {
                const isReady = outlineDataRef.current && outlineDataRef.current.length > 0;
                if (isReady && prev > 80) return Math.min(prev + 5, 100);
                if (prev >= 100) return 100;
                if (!isReady && prev > 85) return prev; 
                return prev + 1;
            });
        }, 100);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  // WATCHER
  useEffect(() => {
    if (simulatedProgress >= 100 && isSimulating) {
        const count = parseInt(chapters) || 5;
        const finalOutline = outlineDataRef.current || forceChapterCount([], count);
        setPredictedOutline(finalOutline);
        setFinalKitData({
            title: titre, description, pages, chapters, tone, audience, template,
            price: dynamicPrice, currency: dynamicCurrency, provider: dynamicProvider, value: 197,
            outline: finalOutline
        });
        setIsSimulating(false);
        setSimulatedProgress(0);
        outlineFetchedRef.current = false;
        outlineDataRef.current = null;
        setStep(3);
        window.scrollTo(0, 0); 
    }
  }, [simulatedProgress, isSimulating]);

  // GENERATION
  const verifyAndGenerate = async (transactionId) => {
    try {
        const verifyRes = await fetch("/api/payments/verify", {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ transactionId })
        });
        const data = await verifyRes.json();
        if (data.success && data.status === "completed") {
            const newUrl = '/dashboard/projets/nouveau';
            window.history.replaceState({}, '', newUrl); 
            setRealGenerating(true);
            const kitData = data.transaction.kitData || {};
            const currentTitre = titre || kitData.title;
            const currentDesc = description || kitData.description;
            const currentOutline = predictedOutline.length > 0 ? predictedOutline : (kitData.outline || []);
            const genRes = await fetch("/api/ebooks/generate", {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                  projetId: data.transaction.projetId || null, transactionId: transactionId,
                  titre: currentTitre, description: currentDesc,
                  tone: kitData.tone || tone, audience: kitData.audience || audience,
                  pages: kitData.pages || pages, chapters: kitData.chapters || chapters,
                  template: kitData.template || template, outline: currentOutline
              }),
            });
            const genData = await genRes.json();
            if (!genData.success) throw new Error(genData.message);
            if (genData.alreadyGenerated) {
                setRealGenerating(false); 
                setGeneratedKit({
                    title: currentTitre || "Mon eBook",
                    files: [
                        { name: "Ebook_Complet.pdf", type: "Livre", url: genData.pdfUrl, icon: "📕", color: "text-red-500 bg-red-50" },
                        { name: "Marketing_Pack.pdf", type: "Scripts & Ads", url: "#", icon: "🔥", color: "text-orange-500 bg-orange-50" },
                        { name: "Scripts_Vente.txt", type: "Copywriting", url: "#", icon: "✍️", color: "text-blue-500 bg-blue-50" },
                    ],
                });
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
                        setGeneratedKit({
                            title: currentTitre || "Mon eBook",
                            files: [
                                { name: `${(currentTitre || "ebook").substring(0, 30)}.pdf`, type: "Ebook Complet", url: pData.pdfUrl || "#", icon: "📕", color: "text-red-500 bg-red-50" },
                                { name: "Marketing_Pack.pdf", type: "Scripts & Ads", url: pData.kitUrl || "#", icon: "🔥", color: "text-orange-500 bg-orange-50" },
                                { name: "Scripts_Vente.txt", type: "Copywriting", url: pData.kitUrl || "#", icon: "✍️", color: "text-blue-500 bg-blue-50" },
                            ],
                        });
                        setRealGenerating(false);
                    }
                    if (pData.status === "ERROR") {
                        clearInterval(pollInterval);
                        setRealGenerating(false);
                        alert("Erreur technique. Support contacté.");
                    }
                } catch (e) { console.error("Erreur polling:", e); }
            }, 3000);
        } else { throw new Error("Paiement non validé."); }
    } catch (e) { 
        console.error("Erreur verify&generate:", e);
        setRealGenerating(false);
    }
  };

  const handleSubmit = (e) => { e.preventDefault(); setIsSimulating(true); };

  if (step === 3 && finalKitData) {
    return <PreviewPage kit={finalKitData} onEdit={() => setStep(1)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans selection:bg-indigo-100 selection:text-indigo-900 relative">
      {/* GAUCHE */}
      <div className="w-full md:w-1/2 p-6 md:p-12 overflow-y-auto h-auto md:h-screen bg-white shadow-2xl z-10 relative border-r border-slate-100 order-1 md:order-1">
        <div className="flex mb-8 items-center gap-2 text-indigo-600">
           <Zap className="w-6 h-6 fill-current" /> <span className="font-black text-xl">Bookzy Studio</span>
        </div>
        <div className="max-w-md mx-auto py-4">
            <h1 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">
                {step === 1 ? "Concevez votre Livre" : "Personnalisez le Style"}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {step === 1 && (
                    <>
                        <div className="space-y-5">
                            <div><label className="block text-sm font-bold text-slate-700 mb-2">Titre de l’ebook</label><input autoFocus type="text" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-500 font-bold text-slate-900" placeholder="Ex: Le Guide de l'Immobilier..." value={titre} onChange={e => setTitre(e.target.value)} /></div>
                            <div><label className="block text-sm font-bold text-slate-700 mb-2">Décris ton ebook en quelques phrases</label><textarea rows={4} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-500 font-medium text-slate-700 resize-none" placeholder="Décrivez les grandes lignes..." value={description} onChange={e => setDescription(e.target.value)} /></div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className={`p-4 rounded-xl border bg-white relative transition-colors ${parseInt(pages) === 80 ? 'border-orange-300 bg-orange-50' : 'border-slate-200'}`}>
                                    <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1 mb-1"><Layers className="w-3 h-3"/> Pages (Max 80)</label>
                                    <input 
                                        type="number" inputMode="numeric"
                                        value={pages} onChange={handlePagesChange} onBlur={handlePagesBlur}
                                        className="w-full text-2xl font-black text-slate-900 outline-none border-b border-transparent focus:border-indigo-500 bg-transparent" 
                                    />
                                    {parseInt(pages) === 80 && <div className="absolute top-2 right-2 text-[10px] text-orange-600 font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Max</div>}
                                </div>
                                <div className={`p-4 rounded-xl border bg-white relative transition-colors ${parseInt(chapters) === 12 ? 'border-orange-300 bg-orange-50' : 'border-slate-200'}`}>
                                    <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1 mb-1"><FileText className="w-3 h-3"/> Chapitres (Max 12)</label>
                                    <input 
                                        type="number" inputMode="numeric"
                                        value={chapters} onChange={handleChaptersChange} onBlur={handleChaptersBlur}
                                        className="w-full text-2xl font-black text-slate-900 outline-none border-b border-transparent focus:border-indigo-500 bg-transparent" 
                                    />
                                    {parseInt(chapters) === 12 && <div className="absolute top-2 right-2 text-[10px] text-orange-600 font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Max</div>}
                                </div>
                            </div>
                        </div>
                        <button type="button" disabled={!titre || !description} onClick={() => setStep(2)} className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 transition-all">Suivant <ArrowRight size={18} /></button>
                    </>
                )}
                
                {step === 2 && (
                    <>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-purple-500"/> Style Graphique</label>
                            <div className="grid grid-cols-3 gap-3">
                                {TEMPLATES.map(t => (
                                    <div key={t.id} onClick={() => setTemplate(t.id)} className={`cursor-pointer rounded-xl border-2 p-1 transition-all transform hover:scale-105 ${template === t.id ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-slate-100 hover:border-slate-300'}`}>
                                        <div className="h-20 w-full rounded-lg bg-gradient-to-br mb-2 shadow-sm" style={{backgroundImage: `linear-gradient(135deg, ${t.primaryColor}, ${t.accentColor})`}}></div>
                                        <p className={`text-[10px] text-center font-bold uppercase tracking-wide ${template === t.id ? 'text-indigo-700' : 'text-slate-500'}`}>{t.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><Mic className="w-4 h-4 text-blue-500"/> Ton du livre</label>
                            <div className="flex flex-wrap gap-2">{TONES.map(t => (<button key={t.value} type="button" onClick={() => setTone(t.value)} className={`px-4 py-2.5 rounded-lg text-sm font-bold border transition-all flex items-center gap-2 ${tone === t.value ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}><span>{t.icon}</span> {t.label}</button>))}</div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><User className="w-4 h-4 text-green-500"/> Audience Cible</label>
                            <div className="flex flex-wrap gap-2">{AUDIENCES.slice(0, 5).map(a => (<button key={a} type="button" onClick={() => setAudience(a)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${audience === a ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-slate-500 border-slate-200'}`}>{a}</button>))}</div>
                        </div>
                        <div className="flex gap-4 pt-6 border-t border-slate-100">
                            <button type="button" onClick={() => setStep(1)} className="px-6 py-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"><ArrowLeft size={18} /></button>
                            <button type="submit" disabled={loading} className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-indigo-200 hover:scale-[1.02] transition-all"><Wand2 size={18} /> Générer l'Aperçu</button>
                        </div>
                    </>
                )}
            </form>
        </div>
      </div>

      {/* DROITE */}
      <div className="w-full md:w-1/2 bg-slate-900 relative flex items-center justify-center overflow-hidden h-[600px] md:h-screen order-2 md:order-2">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px]"></div>
         <div className="relative z-10 flex flex-col items-center animate-in zoom-in duration-700 w-full px-4">
            <LiveBookPreview id="book-preview-target" title={titre} templateId={template} />
            
            <div className="mt-8 grid grid-cols-2 gap-4 text-center w-full max-w-xs">
                <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="text-2xl font-black text-white mb-1">{pages}</div>
                    <div className="text-[9px] text-indigo-300 uppercase font-bold tracking-widest">Pages estimées</div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="text-2xl font-black text-white mb-1">5</div>
                    <div className="text-[9px] text-purple-300 uppercase font-bold tracking-widest">Fichiers inclus</div>
                </div>
            </div>
         </div>
      </div>

      {isSimulating && <SimulationModal progress={simulatedProgress} />}
      {realGenerating && <RealGenerationModal progress={progressPercent} />}
      {generatedKit && <DownloadKitModal kit={generatedKit} router={router} />}
    </div>
  );
}

// 🔥 PAGE PREVIEW AVEC BOUTON FIXE ET LISTE BONUS INCLUSE
function PreviewPage({ kit, onEdit }) {
    const handlePay = async () => {
       try {
          const res = await fetch("/api/payments/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kitData: { ...kit } }) });
          const data = await res.json();
          if(data.success && data.paymentUrl) window.location.href = data.paymentUrl;
          else alert("Erreur initialisation paiement");
       } catch(e) { alert("Erreur technique"); }
    }

    return (
        <div className="h-[100dvh] bg-slate-50 font-sans flex flex-col overflow-hidden">
            {/* HEADER */}
            <div className="bg-white border-b border-slate-200 h-14 md:h-16 flex-shrink-0 z-40 shadow-sm px-4 flex items-center justify-between">
                <button onClick={onEdit} className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-800 text-sm"><ArrowLeft className="w-4 h-4"/> Modifier</button>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] md:text-xs font-black uppercase flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5"/> Validé</span>
            </div>

            {/* CONTENU CENTRAL (FLEX ROW pour PC, COL pour Mobile) */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden max-w-7xl mx-auto w-full relative">
                
                {/* GAUCHE (Mobile: Scrollable / PC: Colonne fixe) */}
                <div className="md:w-5/12 bg-slate-100 md:border-r border-slate-200 flex-shrink-0 overflow-y-auto">
                    <div className="p-6 flex flex-col items-center">
                        <div className="scale-90 origin-top transform transition-transform hover:scale-95">
                            {/* 🔥 STEP 3 : PAS DE LIVRE 3D, JUSTE LE PLAN ET LES INFOS */}
                        </div>
                         {/* Sur mobile, on peut cacher le livre au step 3 pour gagner de la place si tu veux */}
                         {/* Pour l'instant je le garde mais en plus petit si besoin */}
                         <div className="scale-90 origin-top transform transition-transform hover:scale-95">
                            <LiveBookPreview title={kit.title} templateId={kit.template} small={true} />
                        </div>

                        {/* STATS */}
                        <div className="mt-6 flex gap-4 w-full max-w-xs justify-center">
                            <div className="bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm text-center min-w-[80px]">
                                <div className="text-xl font-black text-slate-800">{kit.pages}</div>
                                <div className="text-[9px] text-slate-400 font-bold uppercase">Pages</div>
                            </div>
                            <div className="bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm text-center min-w-[80px]">
                                <div className="text-xl font-black text-slate-800">4</div>
                                <div className="text-[9px] text-slate-400 font-bold uppercase">Fichiers</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DROITE (Plan + CTA Fixe) */}
                <div className="flex-1 bg-white flex flex-col h-full overflow-hidden relative">
                    <div className="p-5 pb-2 flex-shrink-0 bg-white z-10">
                        <h2 className="text-lg md:text-2xl font-black text-slate-900 mb-1">Votre plan est prêt.</h2>
                        <p className="text-slate-500 text-xs md:text-sm">Structure optimisée pour {kit.pages} pages.</p>
                    </div>

                    {/* ✅ LISTE SCROLLABLE AVEC PADDING ENORME (pb-40) POUR PAS CACHER SOUS LE BOUTON */}
                    <div className="flex-1 overflow-y-auto px-5 py-2 space-y-2 custom-scrollbar pb-40">
                        {kit.outline && kit.outline.map((chap, idx) => (
                            <div key={idx} className="flex gap-3 p-3 border border-slate-100 items-start hover:bg-slate-50 transition-colors rounded-lg group">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 ${chap.toLowerCase().includes('intro') || chap.toLowerCase().includes('concl') ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                                    {chap.toLowerCase().includes('intro') ? 'I' : chap.toLowerCase().includes('concl') ? 'C' : idx}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <span className="text-sm font-bold text-slate-800 leading-snug">{chap}</span>
                                        <Lock className="w-3 h-3 text-slate-300 mt-0.5 flex-shrink-0"/>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* 🔥 BONUS INCLUS DANS LA LISTE SCROLLABLE */}
                        <div className="pt-6 mt-2 border-t border-slate-100">
                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
                                <Sparkles className="w-3 h-3 text-orange-500"/> Bonus inclus dans le pack
                            </h4>
                            <div className="space-y-3">
                                {/* FB / Insta */}
                                <div className="flex gap-3 p-3 border border-slate-100 items-center bg-white rounded-xl shadow-sm opacity-80">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0"><MessageCircle className="w-5 h-5"/></div>
                                    <div className="flex-1">
                                        <div className="text-xs font-bold text-slate-900">Scripts Facebook & Instagram</div>
                                        <div className="text-[10px] text-slate-500">Pour lancer vos publicités</div>
                                    </div>
                                    <Lock className="w-4 h-4 text-slate-300"/>
                                </div>
                                {/* WhatsApp */}
                                <div className="flex gap-3 p-3 border border-slate-100 items-center bg-white rounded-xl shadow-sm opacity-80">
                                    <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0"><Smartphone className="w-5 h-5"/></div>
                                    <div className="flex-1">
                                        <div className="text-xs font-bold text-slate-900">Séquence WhatsApp</div>
                                        <div className="text-[10px] text-slate-500">Pour relancer vos prospects</div>
                                    </div>
                                    <Lock className="w-4 h-4 text-slate-300"/>
                                </div>
                                {/* Vente */}
                                <div className="flex gap-3 p-3 border border-slate-100 items-center bg-white rounded-xl shadow-sm opacity-80">
                                    <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center flex-shrink-0"><PenTool className="w-5 h-5"/></div>
                                    <div className="flex-1">
                                        <div className="text-xs font-bold text-slate-900">Texte Page de Vente</div>
                                        <div className="text-[10px] text-slate-500">Structure persuasive (Copywriting)</div>
                                    </div>
                                    <Lock className="w-4 h-4 text-slate-300"/>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ✅ CTA FOOTER (FIXED ABSOLUTE BOTTOM) */}
                    {/* Sur mobile : position: fixed bottom-0 (sort du flux) */}
                    {/* Sur PC : position: absolute bottom-0 (reste dans la colonne de droite) */}
                    <div className="fixed md:absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 bg-white/95 backdrop-blur-md z-50 shadow-[0_-5px_30px_rgba(0,0,0,0.1)]">
                        <div className="max-w-7xl mx-auto w-full">
                            <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-100 rounded-lg mb-3 text-[10px] md:text-xs text-blue-700 font-medium justify-center">
                                <Clock className="w-3.5 h-3.5 shrink-0"/>
                                <p>Génération complète : <strong>~1 min</strong> après paiement.</p>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total</div>
                                    <div className="text-xl md:text-2xl font-black text-slate-900 leading-none">{kit.price} <span className="text-xs text-slate-500 font-medium">{kit.currency}</span></div>
                                </div>
                                <button onClick={handlePay} className="flex-[2] py-3.5 bg-slate-900 text-white font-bold rounded-xl active:scale-[0.98] transition-transform flex items-center justify-center gap-2 shadow-lg group">
                                    <Lock className="w-4 h-4 text-green-400 group-hover:text-green-300" />
                                    <span>Débloquer</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* --- LOADERS (inchangés) --- */
function SimulationModal({ progress }) {
    return (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center z-50 text-white p-6 animate-in fade-in">
             <div className="w-20 h-20 mb-6 relative">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-700" />
                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-indigo-500 transition-all duration-300 ease-linear" strokeDasharray="226" strokeDashoffset={226 - (226 * progress) / 100} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">{Math.round(progress)}%</div>
             </div>
             <h2 className="text-xl font-bold mb-2 animate-pulse">Analyse du sujet...</h2>
        </div>
    )
}

function RealGenerationModal({ progress }) {
    return (
        <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 to-slate-900 flex flex-col items-center justify-center z-50 text-white p-6">
            <div className="w-full max-w-md text-center">
                <div className="mb-6 relative mx-auto w-20 h-20">
                     <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
                     <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
                     <div className="absolute inset-0 flex items-center justify-center font-bold text-lg">{Math.round(progress)}%</div>
                </div>
                <h2 className="text-2xl font-bold mb-2">Rédaction en cours...</h2>
                <p className="text-slate-400 mb-8 animate-pulse text-sm">Ne fermez pas cette page.</p>
            </div>
        </div>
    )
}

function DownloadKitModal({ kit, router }) {
    return (
        <div className="fixed inset-0 bg-green-50/90 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-in zoom-in">
            <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-lg w-full text-center border border-white">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-10 h-10 text-green-600" /></div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">C'est prêt !</h2>
                <p className="text-slate-500 mb-8">Votre kit a été généré avec succès.</p>
                
                <div className="space-y-3 mb-8">
                    {/* EBOOK PDF (Vrai téléchargement) */}
                    <a href={kit.files[0].url} download={kit.files[0].name} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-green-500 hover:bg-green-50 transition-all bg-slate-50 cursor-pointer text-left">
                        <span className="text-xl p-2 rounded-lg text-red-500 bg-red-50">📕</span>
                        <div className="flex-1"><div className="font-bold text-slate-900 text-sm">Télécharger l'Ebook (PDF)</div></div>
                        <Download className="w-5 h-5 text-slate-400" />
                    </a>

                    {/* MARKETING (Redirection Dashboard pour copier) */}
                    <div onClick={() => router.push('/dashboard/projets')} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all bg-slate-50 cursor-pointer text-left">
                        <span className="text-xl p-2 rounded-lg text-blue-500 bg-blue-50">📋</span>
                        <div className="flex-1">
                            <div className="font-bold text-slate-900 text-sm">Voir les Textes Marketing</div>
                            <div className="text-[10px] text-slate-500">Facebook, WhatsApp, Email...</div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-400" />
                    </div>
                </div>
                
                <button onClick={() => router.push('/dashboard/projets')} className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg">Aller au Tableau de Bord</button>
            </div>
        </div>
    )
}
export default function NouveauProjetPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-lg">Chargement...</div></div>}>
      <NouveauProjetPageContent />
    </Suspense>
  );
}