"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, BookOpen, Users, Target, X, Check } from "lucide-react";

// ── TEMPLATES (même liste que nouveau/page.js) ────────────────────────────────
const TEMPLATES = [
  { id: "modern",    label: "Moderne",    primaryColor: "#667eea", accentColor: "#764ba2", preview: { bg: "linear-gradient(135deg,#667eea,#764ba2)", badge: "PREMIUM",    badgeStyle: "bg-white/20 text-white",              pattern: "grid" }},
  { id: "luxe",      label: "Luxe",       primaryColor: "#1a1a1a", accentColor: "#d4af37", preview: { bg: "linear-gradient(135deg,#1a1a1a,#3d2817)", badge: "LUXE",       badgeStyle: "bg-amber-400 text-black",             pattern: "frame" }},
  { id: "educatif",  label: "Éducatif",   primaryColor: "#0f766e", accentColor: "#14b8a6", preview: { bg: "linear-gradient(135deg,#0f766e,#14b8a6)", badge: "FORMATION",  badgeStyle: "bg-white/20 text-white",              pattern: "dots" }},
  { id: "energie",   label: "Énergique",  primaryColor: "#f97316", accentColor: "#dc2626", preview: { bg: "linear-gradient(135deg,#f97316,#dc2626)", badge: "BOOST",      badgeStyle: "bg-white/20 text-white",              pattern: "stripes" }},
  { id: "minimal",   label: "Minimal",    primaryColor: "#1e293b", accentColor: "#64748b", preview: { bg: "#ffffff",                                  badge: "GUIDE",      badgeStyle: "bg-slate-100 text-slate-500",         pattern: "border" }},
  { id: "creative",  label: "Créatif",    primaryColor: "#a855f7", accentColor: "#ec4899", preview: { bg: "linear-gradient(135deg,#a855f7,#ec4899)", badge: "CRÉATIF",    badgeStyle: "bg-white/20 text-white",              pattern: "blobs" }},
  { id: "tech",      label: "Tech",       primaryColor: "#0a0e27", accentColor: "#00d4ff", preview: { bg: "linear-gradient(135deg,#0a0e27,#1e3a8a)", badge: "TECH",       badgeStyle: "border border-cyan-400 text-cyan-400", pattern: "code" }},
  { id: "nature",    label: "Nature",     primaryColor: "#166534", accentColor: "#15803d", preview: { bg: "linear-gradient(135deg,#166534,#15803d)", badge: "NATURE",     badgeStyle: "bg-white/20 text-white",              pattern: "leaves" }},
  { id: "fashion",   label: "Fashion",    primaryColor: "#9f1239", accentColor: "#be185d", preview: { bg: "linear-gradient(135deg,#9f1239,#be185d)", badge: "STYLE",      badgeStyle: "border border-white text-white",      pattern: "frame" }},
  { id: "corporate", label: "Corporate",  primaryColor: "#1e40af", accentColor: "#3b82f6", preview: { bg: "linear-gradient(135deg,#1e40af,#3b82f6)", badge: "BUSINESS",   badgeStyle: "bg-white/20 text-white",              pattern: "bars" }},
  { id: "retro",     label: "Rétro",      primaryColor: "#92400e", accentColor: "#b45309", preview: { bg: "linear-gradient(135deg,#92400e,#b45309)", badge: "VINTAGE",    badgeStyle: "border border-amber-300 text-amber-300", pattern: "lines" }},
  { id: "futuriste", label: "Futuriste",  primaryColor: "#5b21b6", accentColor: "#7c3aed", preview: { bg: "linear-gradient(135deg,#5b21b6,#7c3aed)", badge: "FUTURE",     badgeStyle: "border border-violet-300 text-violet-300", pattern: "hex" }},
  { id: "afrique",   label: "Afrique",    primaryColor: "#78350f", accentColor: "#d97706", preview: { bg: "linear-gradient(135deg,#78350f,#b45309,#d97706)", badge: "AFRIQUE", badgeStyle: "bg-white/20 text-white",           pattern: "kente" }},
  { id: "sport",     label: "Sport",      primaryColor: "#0f172a", accentColor: "#ef4444", preview: { bg: "linear-gradient(135deg,#0f172a,#1e293b)", badge: "SPORT",      badgeStyle: "bg-red-500 text-white",               pattern: "diagonal" }},
  { id: "wellness",  label: "Wellness",   primaryColor: "#8b5cf6", accentColor: "#c4b5fd", preview: { bg: "linear-gradient(135deg,#f3e8ff,#c4b5fd)", badge: "BIEN-ÊTRE",  badgeStyle: "bg-purple-200/60 text-purple-800",    pattern: "soft" }},
  { id: "business",  label: "Business",   primaryColor: "#0f172a", accentColor: "#b8860b", preview: { bg: "linear-gradient(135deg,#0f172a,#1e293b)", badge: "PREMIUM",    badgeStyle: "border border-yellow-500 text-yellow-500", pattern: "gold" }},
];

// ── MINI COVER PREVIEW ────────────────────────────────────────────────────────
const MiniCoverPreview = ({ t, isSelected }) => {
  const p = t.preview;
  const patterns = {
    grid:     <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)",backgroundSize:"12px 12px"}} />,
    frame:    <div style={{position:"absolute",inset:"6px",border:"1px solid rgba(255,255,255,.3)",pointerEvents:"none"}} />,
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
    <div style={{
      position:"relative", width:"100%", aspectRatio:"3/4", borderRadius:"8px",
      overflow:"hidden", background:p.bg,
      boxShadow: isSelected ? "0 0 0 2.5px #0f172a, 0 0 0 4px white" : "0 2px 8px rgba(0,0,0,.15)",
      transform: isSelected ? "scale(1.04)" : "scale(1)",
      transition:"transform .15s, box-shadow .15s",
    }}>
      {patterns[p.pattern] || null}
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
      {isSelected && (
        <div style={{position:"absolute",top:"5px",right:"5px",width:"16px",height:"16px",borderRadius:"50%",background:"#0f172a",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg width="8" height="8" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5 4-4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
        </div>
      )}
    </div>
  );
};

// ── MODAL TEMPLATE ────────────────────────────────────────────────────────────
function TemplateModal({ result, onClose, onGenerate, isGenerating }) {
  const [selected, setSelected] = useState("modern");
  const [showAll, setShowAll] = useState(false);

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center",padding:"0"}}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{background:"white",borderRadius:"20px 20px 0 0",width:"100%",maxWidth:"560px",maxHeight:"85vh",overflow:"hidden",display:"flex",flexDirection:"column"}}>

        {/* Header */}
        <div style={{padding:"20px 20px 12px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid #f1f5f9",flexShrink:0}}>
          <div>
            <p style={{fontSize:"16px",fontWeight:"800",color:"#0f172a",margin:0}}>Choisir un template</p>
            <p style={{fontSize:"12px",color:"#64748b",margin:"2px 0 0"}}>Sélectionne le style de ton ebook</p>
          </div>
          <button onClick={onClose} style={{width:"32px",height:"32px",borderRadius:"50%",border:"1px solid #e2e8f0",background:"white",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
            <X size={15} color="#64748b" />
          </button>
        </div>

        {/* Grille templates */}
        <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"10px",marginBottom:"12px"}}>
            {TEMPLATES.slice(0, showAll ? 16 : 8).map(t => (
              <button key={t.id} type="button" onClick={() => setSelected(t.id)}
                style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"5px",background:"none",border:"none",cursor:"pointer",padding:0}}>
                <MiniCoverPreview t={t} isSelected={selected === t.id} />
                <span style={{fontSize:"9px",fontWeight:selected===t.id?700:500,color:selected===t.id?"#0f172a":"#64748b",textAlign:"center",lineHeight:1.2,width:"100%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  {t.label}
                </span>
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setShowAll(v => !v)}
            style={{width:"100%",padding:"8px",borderRadius:"10px",border:"1px dashed #cbd5e1",background:"#f8fafc",fontSize:"12px",fontWeight:600,color:"#475569",cursor:"pointer",marginBottom:"16px"}}>
            {showAll ? "Voir moins" : `Voir les ${TEMPLATES.length - 8} autres templates`}
          </button>

          {/* Recap template sélectionné */}
          {(() => {
            const sel = TEMPLATES.find(t => t.id === selected);
            return (
              <div style={{padding:"10px 12px",borderRadius:"10px",background:"#f1f5f9",display:"flex",alignItems:"center",gap:"10px",marginBottom:"16px"}}>
                <div style={{width:"28px",height:"38px",borderRadius:"5px",overflow:"hidden",flexShrink:0,background:sel.preview.bg,position:"relative"}}>
                  <div style={{position:"absolute",left:0,top:0,bottom:0,width:"3px",background:"rgba(0,0,0,.2)"}} />
                </div>
                <div>
                  <div style={{fontWeight:700,color:"#0f172a",fontSize:"12px"}}>{sel.label}</div>
                  <div style={{fontSize:"10px",color:"#94a3b8"}}>Template sélectionné</div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* CTA */}
        <div style={{padding:"16px 20px",borderTop:"1px solid #f1f5f9",flexShrink:0}}>
          <button onClick={() => onGenerate(selected)} disabled={isGenerating}
            style={{width:"100%",padding:"14px",background:"#0f172a",color:"white",border:"none",borderRadius:"12px",fontSize:"14px",fontWeight:"700",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",opacity:isGenerating?0.7:1}}>
            {isGenerating ? <><Loader2 size={16} style={{animation:"spin 1s linear infinite"}} /> Génération en cours...</> : <>Générer mon ebook <ArrowRight size={16} /></>}
          </button>
          <p style={{fontSize:"11px",color:"#94a3b8",textAlign:"center",margin:"8px 0 0"}}>20 crédits seront débités</p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── GENERATING OVERLAY ────────────────────────────────────────────────────────
function GeneratingOverlay({ progress = 0 }) {
  const displayPct = progress || 5;
  const label =
    displayPct < 20 ? "Démarrage..." :
    displayPct < 40 ? "Rédaction introduction..." :
    displayPct < 70 ? "Rédaction des chapitres..." :
    displayPct < 80 ? "Conclusion et visuels..." :
    displayPct < 95 ? "Génération du PDF..." :
    displayPct < 100 ? "Mise en ligne..." : "Terminé !";

  return (
    <div style={{position:"fixed",inset:0,background:"#0f172a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:200,padding:"24px"}}>
      <div style={{width:"80px",height:"80px",position:"relative",marginBottom:"24px"}}>
        <svg width="80" height="80" viewBox="0 0 80 80" style={{transform:"rotate(-90deg)"}}>
          <circle cx="40" cy="40" r="34" strokeWidth="5" fill="none" stroke="#1e293b" />
          <circle cx="40" cy="40" r="34" strokeWidth="5" fill="none" stroke="white" strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 34}`}
            strokeDashoffset={`${2 * Math.PI * 34 * (1 - displayPct / 100)}`}
            style={{transition:"stroke-dashoffset 0.8s ease"}} />
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:"700",fontSize:"13px"}}>
          {Math.round(displayPct)}%
        </div>
      </div>
      <h2 style={{color:"white",fontSize:"18px",fontWeight:"700",margin:"0 0 8px"}}>Génération en cours</h2>
      <p style={{color:"#64748b",fontSize:"14px",margin:0,textAlign:"center"}}>{label}</p>
      <p style={{color:"#334155",fontSize:"12px",margin:"8px 0 0"}}>Ne fermez pas cette page</p>
    </div>
  );
}

// ── PAGE PRINCIPALE ───────────────────────────────────────────────────────────
export default function YoubookResultPage() {
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [realProgress, setRealProgress] = useState(5);
  const [downloadUrl, setDownloadUrl] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("youbookResult");
    if (stored) {
      setResult(JSON.parse(stored));
      setLoading(false);
    } else {
      router.push("/dashboard/youbook");
    }
  }, [router]);

  const handleGenerate = async (template) => {
    if (!result || isGenerating) return;
    setIsGenerating(true);
    setShowTemplateModal(false);

    try {
      // 1. Créer le projet DRAFT avec les données Youbook
      const draftRes = await fetch("/api/projets/ajouter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          titre: result.titre,
          description: result.description,
          template,
          pages: result.pages_estimees || 30,
          chapitres: result.sommaire?.length || 6,
          ton: result.tone || "Professionnel",
          audience: typeof result.audience === "object" ? result.audience.principal : (result.audience || "Grand Public"),
          outline: result.sommaire || [],
          youbookTranscript: true, // flag pour que Gemini sache que c'est du Youbook
        }),
      });
      const draftData = await draftRes.json();
      if (!draftData.success) throw new Error("Erreur création projet");

      const projetId = draftData.projet._id.toString();

      // 2. Lancer la génération en passant le contenu de la vidéo
      const genRes = await fetch("/api/ebooks/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          projetId,
          titre: result.titre,
          description: result.description,
          pages: result.pages_estimees || 30,
          chapters: result.sommaire?.length || 6,
          tone: result.tone || "Professionnel",
          audience: typeof result.audience === "object" ? result.audience.principal : (result.audience || "Grand Public"),
          template,
          outline: result.sommaire || [],
          youbookContext: {
            hook: result.hook,
            probleme: result.probleme,
            transformation: result.transformation,
            key_insights: result.key_insights,
            verbatim: result.verbatim,
          },
        }),
      });
      const genData = await genRes.json();
      if (!genData.success && genData.insufficientCredits) {
        alert("Crédits insuffisants. Rechargez votre solde.");
        setIsGenerating(false);
        return;
      }

      const finalProjetId = genData.projetId || projetId;

      // 3. Poll progress
      let attempts = 0;
      const poll = async () => {
        if (attempts++ > 120) { alert("Délai dépassé."); setIsGenerating(false); return; }
        try {
          const pRes = await fetch(`/api/ebooks/progress/${finalProjetId}`, { credentials: "include" });
          const pData = await pRes.json();
          if (pData.progress) setRealProgress(pData.progress);
          if (pData.status === "COMPLETED" && pData.pdfUrl) {
            setIsGenerating(false);
            setDownloadUrl(pData.pdfUrl);
            sessionStorage.removeItem("youbookResult");
          } else if (pData.status === "ERROR") {
            alert("Erreur lors de la génération.");
            setIsGenerating(false);
          } else {
            setTimeout(poll, 2000);
          }
        } catch { setTimeout(poll, 3000); }
      };
      setTimeout(poll, 1500);

    } catch (e) {
      console.error(e);
      alert("Erreur technique");
      setIsGenerating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
    </div>
  );

  const audience = typeof result.audience === "object"
    ? result.audience
    : { principal: result.audience || "Grand Public", niveau: "Débutant" };

  // Page de succès après génération
  if (downloadUrl) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Ebook généré</h2>
          <p className="text-sm text-slate-500 mb-6">Ton ebook Youbook est prêt.</p>
          <a href={downloadUrl} download
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm mb-3 hover:bg-slate-800 transition-all">
            Télécharger mon ebook
          </a>
          <button onClick={() => router.push("/dashboard/fichiers")}
            className="w-full py-3 border border-slate-200 text-slate-500 rounded-xl text-sm font-medium hover:text-slate-900 transition-all">
            Voir ma bibliothèque
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      {isGenerating && <GeneratingOverlay progress={realProgress} />}
      {showTemplateModal && (
        <TemplateModal
          result={result}
          onClose={() => setShowTemplateModal(false)}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* Retour */}
        <button onClick={() => router.push("/dashboard/youbook")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Nouvelle analyse</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── COLONNE GAUCHE (contenu) ── */}
          <div className="lg:col-span-2 pb-24 lg:pb-8">

            {/* Status */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">Analyse terminée</span>
              </div>
              {result.pages_estimees && (
                <span className="text-sm text-slate-500">~{result.pages_estimees} pages estimées</span>
              )}
            </div>

            {/* Titre */}
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{result.titre}</h1>
            {result.hook && <p className="text-lg text-slate-500 mb-4">{result.hook}</p>}
            <p className="text-slate-600 leading-relaxed mb-8">{result.description}</p>

            {/* Problème & Transformation */}
            {(result.probleme || result.transformation) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {result.probleme && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                    <p className="text-xs font-semibold text-red-600 uppercase mb-2">Problème résolu</p>
                    <p className="text-sm text-slate-700">{result.probleme}</p>
                  </div>
                )}
                {result.transformation && (
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <p className="text-xs font-semibold text-emerald-600 uppercase mb-2">Transformation</p>
                    <p className="text-sm text-slate-700">{result.transformation}</p>
                  </div>
                )}
              </div>
            )}

            {/* Audience */}
            <div className="flex items-center gap-3 mb-8 p-4 bg-slate-50 rounded-xl">
              <Users className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-900">{audience.principal}</p>
                <p className="text-xs text-slate-500">Niveau : {audience.niveau}</p>
              </div>
            </div>

            {/* Sommaire */}
            {result.sommaire && result.sommaire.length > 0 && (
              <div className="mb-8">
                <p className="font-semibold text-slate-900 mb-3">Sommaire suggéré</p>
                <div className="space-y-2">
                  {result.sommaire.map((chapitre, idx) => (
                    <div key={idx} className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                      <span className="text-xs font-bold text-slate-400 w-5 pt-0.5">{idx + 1}.</span>
                      <p className="text-sm text-slate-700">{chapitre.replace(/^Chapitre \d+:\s*/i, "")}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key insights */}
            {result.key_insights && result.key_insights.length > 0 && (
              <div className="mb-8">
                <p className="font-semibold text-slate-900 mb-3">Points clés</p>
                <div className="space-y-2">
                  {result.key_insights.map((insight, idx) => (
                    <div key={idx} className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                      <span className="text-xs font-bold text-slate-400 w-5 pt-0.5">{idx + 1}.</span>
                      <p className="text-sm text-slate-700">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Verbatim */}
            {result.verbatim && (
              <div className="mb-8 p-5 bg-slate-900 rounded-xl">
                <p className="text-xs text-slate-500 mb-3">Citation clé</p>
                <p className="text-white text-lg italic leading-relaxed mb-4">"{result.verbatim}"</p>
                {(result.channelName || result.channelThumbnail) && (
                  <div className="flex items-center gap-3 pt-3 border-t border-slate-700">
                    {result.channelThumbnail ? (
                      <img src={result.channelThumbnail} alt={result.channelName}
                        style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: "13px", fontWeight: "700", color: "white" }}>
                          {result.channelName?.charAt(0)?.toUpperCase() || "Y"}
                        </span>
                      </div>
                    )}
                    <div>
                      <p style={{ fontSize: "12px", fontWeight: "700", color: "white", margin: 0 }}>{result.channelName || "Chaîne YouTube"}</p>
                      <p style={{ fontSize: "10px", color: "#64748b", margin: 0 }}>Source YouTube</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Metadata */}
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span>Ton : {result.tone}</span>
              {result.pages_estimees && (<><span>·</span><span>{result.pages_estimees} pages</span></>)}
            </div>
          </div>

          {/* ── COLONNE DROITE (sidebar sticky desktop) ── */}
          <aside className="hidden lg:block">
            <div className="sticky top-6 space-y-4">

              {/* Mini résumé */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Ton concept</p>
                <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug">{result.titre}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{result.description}</p>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>{result.pages_estimees || 25} pages</span>
                  <span>·</span>
                  <span>{result.sommaire?.length || 0} chapitres</span>
                </div>
              </div>

              {/* Sommaire rapide */}
              {result.sommaire && result.sommaire.length > 0 && (
                <div className="bg-slate-50 rounded-2xl p-5">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Sommaire</p>
                  <div className="space-y-2">
                    {result.sommaire.slice(0, 5).map((chap, idx) => (
                      <div key={idx} className="flex gap-2">
                        <span className="text-xs font-bold text-slate-300 w-4">{idx + 1}.</span>
                        <p className="text-xs text-slate-600 leading-snug">{chap.replace(/^Chapitre \d+:\s*/i, "")}</p>
                      </div>
                    ))}
                    {result.sommaire.length > 5 && (
                      <p className="text-xs text-slate-400">+{result.sommaire.length - 5} chapitres</p>
                    )}
                  </div>
                </div>
              )}

              {/* CTA desktop */}
              <button onClick={() => setShowTemplateModal(true)}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                Transformer en ebook
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-xs text-slate-400 text-center">20 crédits seront débités</p>
            </div>
          </aside>

        </div>
      </div>

      {/* CTA Fixed mobile uniquement */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 lg:hidden">
        <button onClick={() => setShowTemplateModal(true)}
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
          Transformer en ebook
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}