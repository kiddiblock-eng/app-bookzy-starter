"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Loader2, Check, FileText, Download, X, ArrowLeft } from "lucide-react";
import TipTapEditor from "../../../components/TipTapEditor";
import { useCredits } from "@/hooks/useCredits";
import InsufficientCreditsModal from "@/components/ui/InsufficientCreditsModal";

const TEMPLATES = [
  { id: "modern", label: "Moderne", primaryColor: "#667eea", accentColor: "#764ba2" },
  { id: "luxe", label: "Luxe", primaryColor: "#d4af37", accentColor: "#ffd700" },
  { id: "educatif", label: "Éducatif", primaryColor: "#0f766e", accentColor: "#14b8a6" },
  { id: "energie", label: "Énergique", primaryColor: "#f97316", accentColor: "#dc2626" },
  { id: "minimal", label: "Minimal", primaryColor: "#f8fafc", accentColor: "#e2e8f0" },
  { id: "creative", label: "Créatif", primaryColor: "#a855f7", accentColor: "#ec4899" },
  { id: "tech", label: "Tech", primaryColor: "#0a0e27", accentColor: "#00d4ff" },
  { id: "nature", label: "Nature", primaryColor: "#166534", accentColor: "#22c55e" },
  { id: "fashion", label: "Fashion", primaryColor: "#9f1239", accentColor: "#ec4899" },
  { id: "corporate", label: "Corporate", primaryColor: "#1e40af", accentColor: "#3b82f6" },
  { id: "retro", label: "Rétro", primaryColor: "#92400e", accentColor: "#d97706" },
  { id: "futuriste", label: "Futuriste", primaryColor: "#5b21b6", accentColor: "#a78bfa" },
];

// ============================================================================
// 💡 NOUVEAU MODAL APERÇU - VERSION IMAGES (RESPONSIVE + FLUIDE)
// ============================================================================
const PreviewModal = ({ isOpen, onClose, projetId, onBuy }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !projetId) return;

    const fetchPreview = async () => {
      try {
        setLoading(true);
        setLoadingProgress(10);
        setError(null);
        setImages([]);
        setCurrentPage(1);
        
        // 1. Récupérer l'URL du PDF aperçu
        const res = await fetch(`/api/express/preview/${projetId}`);
        const data = await res.json();

        if (!data.success) {
          throw new Error(data.error || "Erreur de chargement");
        }

        setLoadingProgress(30);

        // 2. Convertir le PDF en images
        const convertRes = await fetch("/api/pdf-to-images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pdfUrl: data.previewPdfUrl,
            maxPages: 12
          })
        });

        setLoadingProgress(70);

        const convertData = await convertRes.json();

        if (!convertData.success) {
          throw new Error(convertData.error || "Erreur de conversion");
        }

        setLoadingProgress(100);
        setImages(convertData.images);

      } catch (err) {
        console.error("Erreur fetch preview:", err);
        setError(err.message || "Erreur de connexion");
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [isOpen, projetId]);

  // Détecter la page visible lors du scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || images.length === 0) return;

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.top + containerRect.height / 2;

      const imageElements = container.querySelectorAll('[data-page]');
      let closestPage = 1;
      let closestDistance = Infinity;

      imageElements.forEach((img) => {
        const rect = img.getBoundingClientRect();
        const imgCenter = rect.top + rect.height / 2;
        const distance = Math.abs(imgCenter - containerCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestPage = parseInt(img.dataset.page);
        }
      });

      setCurrentPage(closestPage);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [images]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
      
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-white text-base font-bold">Aperçu de votre ebook</h3>
            <p className="text-slate-400 text-xs hidden sm:block">Aperçu limité avec watermark</p>
          </div>
        </div>
        
        {/* Pagination indicator - desktop */}
        {!loading && images.length > 0 && (
          <div className="hidden sm:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
            <span className="text-white text-sm font-medium">
              {currentPage} / {images.length}
            </span>
          </div>
        )}
        
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Image Viewer */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-800"
        style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}
      >
        {loading ? (
          <div className="h-full flex items-center justify-center flex-col gap-4 p-8">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-white animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-white text-sm font-medium">Préparation de l'aperçu...</p>
              <p className="text-slate-400 text-xs mt-1">
                {loadingProgress < 30 && "Chargement du PDF..."}
                {loadingProgress >= 30 && loadingProgress < 70 && "Conversion en images..."}
                {loadingProgress >= 70 && "Finalisation..."}
              </p>
            </div>
            
            {/* Progress bar */}
            <div className="w-48 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center flex-col gap-4 p-8">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
              <X className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-white text-lg font-semibold text-center">{error}</p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Fermer
            </button>
          </div>
        ) : (
          <div className="py-4 px-2 sm:px-4 space-y-4 max-w-3xl mx-auto">
            {images.map((img, index) => (
              <div 
                key={img.page}
                data-page={img.page}
                className="relative bg-white rounded-lg overflow-hidden shadow-2xl"
              >
                {/* Page number badge */}
                <div className="absolute top-2 left-2 z-10 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                  Page {img.page}
                </div>
                
                {/* Image */}
                <img
                  src={img.url}
                  alt={`Page ${img.page}`}
                  className="w-full h-auto"
                  loading={index < 3 ? "eager" : "lazy"}
                  decoding="async"
                />
              </div>
            ))}
            
            {/* End indicator */}
            <div className="text-center py-4">
              <p className="text-slate-500 text-sm">
                Fin de l'aperçu ({images.length} pages)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Page Indicator */}
      {!loading && !error && images.length > 0 && (
        <div className="sm:hidden fixed bottom-44 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-black/80 backdrop-blur px-4 py-2 rounded-full">
            <span className="text-white text-sm font-medium">
              {currentPage} / {images.length}
            </span>
          </div>
        </div>
      )}

      {/* Footer Actions */}
      {!loading && !error && (
        <div className="bg-slate-900 border-t border-slate-700 p-4 flex-shrink-0">
          
          {/* Warning */}
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 mb-4">
            <p className="text-yellow-200 text-center text-sm">
              ⚠️ Aperçu limité ({images.length} premières pages en images avec watermark). En cliquant sur générer le PDF, vous recevrez le PDF complet sans watermark.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base"
            >
              Modifier mon contenu
            </button>
            <button
              onClick={onBuy}
              className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors text-sm sm:text-base"
            >
              Générer le PDF — 10 crédits
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

// ============================================================================
// 💡 MODAL CONFIRMATION PAIEMENT
// ============================================================================
// ============================================================================
// 💡 MODAL GÉNÉRATION (Après paiement)
// ============================================================================
const GenerationModal = ({ isOpen, onClose, projetId, titre, mutateBalance }) => {
  const [status, setStatus] = useState("processing");
  const [progress, setProgress] = useState(0);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !projetId) return;

    let interval = null;

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/projets/${projetId}/status`);
        const data = await res.json();

        if (data.success) {
          setProgress(data.progress || 0);

          if (data.status === "COMPLETED" && data.pdfUrl) {
            setStatus("completed");
            setPdfUrl(data.pdfUrl);
            mutateBalance(); // ✅ rafraîchir le solde
            if (interval) clearInterval(interval);
          } else if (data.status === "ERROR") {
            setStatus("error");
            setError(data.errorMessage || "Erreur inconnue");
            if (interval) clearInterval(interval);
          }
        }
      } catch (err) {
        console.error("Erreur check status:", err);
      }
    };

    interval = setInterval(checkStatus, 2000);
    checkStatus();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, projetId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        
        {(status === "completed" || status === "error") && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {status === "processing" && (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 relative">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Génération en cours...
            </h3>
            <p className="text-slate-600 mb-6">{titre}</p>
            
            <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-slate-500">{progress}%</p>
          </div>
        )}

        {status === "completed" && (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              eBook prêt !
            </h3>
            <p className="text-slate-600 mb-6">{titre}</p>
            
            <div className="space-y-3">
              {pdfUrl ? (
                <a
                  href={pdfUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all text-center"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" />
                    <span>Télécharger le PDF</span>
                  </div>
                </a>
              ) : null}
              
              <button
                onClick={() => (window.location.href = "/dashboard/projets")}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-all"
              >
                Voir mes projets
              </button>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <X className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Erreur de génération
            </h3>
            <p className="text-slate-600 mb-6">
              {error || "Une erreur est survenue"}
            </p>
            
            <button
              onClick={onClose}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-all"
            >
              Réessayer
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

// ============================================================================
// 💡 MINI BOOK PREVIEW
// ============================================================================
const MiniBook = ({ title, template }) => {
  const tmpl = TEMPLATES.find((t) => t.id === template) || TEMPLATES[0];
  
  return (
    <div className="relative w-32 h-44 mx-auto">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-3 bg-black/20 blur-xl rounded-full" />
      <div 
        className="absolute inset-0 rounded-r-md rounded-l-[2px] shadow-2xl overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${tmpl.primaryColor}, ${tmpl.accentColor})` }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-r from-black/20 to-transparent" />
        <div className="p-3 text-white">
          <div className="text-[6px] uppercase tracking-wider opacity-60 mb-1">Express</div>
          <h3 className="text-[10px] font-bold leading-tight line-clamp-6">{title || "Votre titre"}</h3>
        </div>
      </div>
      <div className="absolute top-0.5 -right-0.5 bottom-0.5 w-1 bg-white rounded-r-sm -z-10" />
    </div>
  );
};

// ============================================================================
// 📄 COMPOSANT PRINCIPAL
// ============================================================================
export default function BookzyExpressEditor() {
  const [titre, setTitre] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [conclusion, setConclusion] = useState("");
  const [nbChapters, setNbChapters] = useState(5);
  const [chapters, setChapters] = useState([
    { title: "", content: "" },
    { title: "", content: "" },
    { title: "", content: "" },
    { title: "", content: "" },
    { title: "", content: "" },
  ]);
  const [template, setTemplate] = useState("modern");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  
  // ✅ MODALS
  const [showModal, setShowModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [currentProjetId, setCurrentProjetId] = useState(null);
  const [previewProjetId, setPreviewProjetId] = useState(null);
  
  // TRACKING IA
  const [aiUsageCount, setAiUsageCount] = useState(0);

  // CRÉDITS
  const { balance, requireCredits, showModal: showCreditsModal, setShowModal: setShowCreditsModal, modalAction, mutateBalance } = useCredits();

  // PROTECTION ANTI-PERTE
  const hasContent = titre || introduction || conclusion || chapters.some(ch => ch.title || ch.content);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasContent && !currentProjetId) {
        e.preventDefault();
        e.returnValue = 'Votre travail sera perdu si vous quittez sans générer le PDF !';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasContent, currentProjetId]);

  // FONCTION APPEL IA
  const handleAIImprove = async (text, action) => {
    try {
      const res = await fetch('/api/ai/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          action,
          projetId: currentProjetId
        })
      });

      const data = await res.json();

      if (data.success) {
        setAiUsageCount(prev => prev + 1);
        if (data.usedExtraCredit) mutateBalance(); // ✅ rafraîchir si crédit débité
        return { success: true, improvedText: data.improvedText };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error("Erreur IA:", err);
      return { success: false, error: "Erreur réseau" };
    }
  };

  const handleChapterCountChange = (count) => {
    setNbChapters(count);
    const newChapters = [...chapters];
    
    if (count > chapters.length) {
      for (let i = chapters.length; i < count; i++) {
        newChapters.push({ title: "", content: "" });
      }
    } else {
      newChapters.length = count;
    }
    
    setChapters(newChapters);
  };

  const updateChapter = (index, field, value) => {
    const newChapters = [...chapters];
    newChapters[index] = { ...newChapters[index], [field]: value };
    setChapters(newChapters);
  };

  // ✅ GÉNÉRATION APERÇU (GRATUIT)
  const handleGeneratePreview = async () => {
    if (!titre || chapters.some((ch) => !ch.title || !ch.content)) {
      alert("Veuillez remplir tous les champs");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const res = await fetch("/api/express/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titre,
          introduction,
          conclusion,
          chapters: chapters.map((ch, i) => ({
            number: i + 1,
            title: ch.title,
            content: ch.content,
          })),
          template,
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setPreviewProjetId(data.projetId);
        setShowPreviewModal(true);
      } else {
        alert("Erreur : " + (data.error || "Erreur inconnue"));
      }
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue : " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // ✅ ACHAT DEPUIS APERÇU — vérifie crédits puis génère directement
  const handleBuyFromPreview = () => {
    setShowPreviewModal(false);
    requireCredits("express_layout", () => handleGenerate());
  };

  // ✅ BOUTON GÉNÉRER DIRECT — vérifie crédits puis génère
  const handleGenerateDirect = () => {
    if (!titre || chapters.some((ch) => !ch.title || !ch.content)) {
      alert("Veuillez remplir tous les champs");
      return;
    }
    requireCredits("express_layout", () => handleGenerate());
  };

  // ✅ GÉNÉRATION (flow crédits — plus de paiement)
  const handleGenerate = async () => {
    if (!titre || chapters.some((ch) => !ch.title || !ch.content)) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    setIsProcessing(true);

    try {
      const createRes = await fetch("/api/express/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titre,
          introduction,
          conclusion,
          chapters: chapters.map((ch, i) => ({
            number: i + 1,
            title: ch.title,
            content: ch.content,
          })),
          template,
          aiUsed: aiUsageCount
        }),
      });

      const createData = await createRes.json();

      if (createData.insufficientCredits) {
        setShowCreditsModal(true);
        setIsProcessing(false);
        return;
      }

      if (!createData.success) throw new Error(createData.error);

      setCurrentProjetId(createData.projetId);
      setShowModal(true);

      // Lancer la génération PDF
      await fetch("/api/express/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projetId: createData.projetId }),
      });

    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue");
      setIsProcessing(false);
    }
  };

  const isFormValid = titre && chapters.every((ch) => ch.title && ch.content);

  useEffect(() => {
    const hiddenTemplates = TEMPLATES.slice(6).map(t => t.id);
    if (hiddenTemplates.includes(template)) {
      setShowAllTemplates(true);
    }
  }, [template]);

  return (
    <>
      {/* MODALS */}
      <InsufficientCreditsModal
        open={showCreditsModal}
        onClose={() => setShowCreditsModal(false)}
        action={modalAction}
        balance={balance}
      />
      <GenerationModal 
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setIsProcessing(false); // ✅ reset le spinner quand on ferme
        }}
        projetId={currentProjetId}
        titre={titre}
        mutateBalance={mutateBalance}
      />

      <PreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        projetId={previewProjetId}
        onBuy={handleBuyFromPreview}
      />

      <div className="min-h-screen bg-slate-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Header avec bouton retour */}
          <div className="mb-8">
            <Link 
              href="/dashboard/express"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au choix
            </Link>

            <div className="text-center">
              <div className="inline-flex items-center gap-2.5 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-3xl font-black text-slate-900">
                  Éditeur <span className="text-blue-600">Pro</span>
                </h1>
              </div>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                Créez votre ebook avec notre éditeur professionnel et l'IA intégrée
              </p>
              <div className="mt-4 inline-flex items-center gap-6 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-green-500" />
                  Format A4
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-green-500" />
                  Prêt en 20 sec
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-green-500" />
                  5 IA incluses
                </span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Titre de votre eBook
                </label>
                <input
                  type="text"
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  placeholder="Ex: 10 Secrets pour Vendre sur Instagram"
                  className="w-full px-4 py-3 bg-slate-50 border-0 rounded-lg text-slate-900 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* INTRODUCTION AVEC TIPTAP */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3 px-1">
                  Introduction <span className="text-slate-400 font-normal">(optionnelle)</span>
                </label>
                <TipTapEditor
                  content={introduction}
                  onChange={setIntroduction}
                  placeholder="Présentez votre eBook en quelques lignes..."
                  onAIImprove={handleAIImprove}
                  maxHeight="250px"
                />
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Nombre de chapitres
                </label>
                <div className="flex gap-2">
                  {[3, 4, 5, 6, 7, 8, 9, 10].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => handleChapterCountChange(count)}
                      className={`flex-1 py-2.5 rounded-lg font-semibold transition-all ${
                        nbChapters === count
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>

              {/* CHAPITRES AVEC TIPTAP */}
              <div className="space-y-6">
                {chapters.map((chapter, index) => (
                  <div key={index} className="space-y-3">
                    <div className="bg-white rounded-xl p-6 border border-slate-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <h3 className="text-sm font-semibold text-slate-700">
                          Chapitre {index + 1}
                        </h3>
                      </div>
                      
                      <input
                        type="text"
                        value={chapter.title}
                        onChange={(e) => updateChapter(index, "title", e.target.value)}
                        placeholder="Ex: Comment trouver sa niche rentable"
                        className="w-full px-4 py-2.5 bg-slate-50 border-0 rounded-lg text-slate-900 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                    
                    <TipTapEditor
                      content={chapter.content}
                      onChange={(value) => updateChapter(index, "content", value)}
                      placeholder="Écrivez le contenu du chapitre..."
                      onAIImprove={handleAIImprove}
                      maxHeight="400px"
                    />
                  </div>
                ))}
              </div>

              {/* CONCLUSION AVEC TIPTAP */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3 px-1">
                  Conclusion <span className="text-slate-400 font-normal">(optionnelle)</span>
                </label>
                <TipTapEditor
                  content={conclusion}
                  onChange={setConclusion}
                  placeholder="Terminez votre eBook avec un message de clôture..."
                  onAIImprove={handleAIImprove}
                  maxHeight="250px"
                />
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <label className="block text-sm font-semibold text-slate-700 mb-4">
                  Choisir un template
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {(showAllTemplates ? TEMPLATES : TEMPLATES.slice(0, 6)).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTemplate(t.id)}
                      className="flex flex-col items-center gap-2"
                    >
                      <div 
                        className={`w-full aspect-[3/4] rounded-lg transition-all ${
                          template === t.id ? "ring-2 ring-slate-900 ring-offset-2 scale-105" : "hover:scale-105"
                        }`}
                        style={{ background: `linear-gradient(135deg, ${t.primaryColor}, ${t.accentColor})` }}
                      >
                        {template === t.id && (
                          <div className="w-full h-full flex items-center justify-center bg-black/20">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <span className={`text-[10px] font-medium ${template === t.id ? "text-slate-900" : "text-slate-500"}`}>
                        {t.label}
                      </span>
                    </button>
                  ))}
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowAllTemplates(!showAllTemplates)}
                  className="mt-4 w-full py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors flex items-center justify-center gap-1"
                >
                  {showAllTemplates ? (
                    <>↑ Voir moins</>
                  ) : (
                    <>+ 6 autres templates</>
                  )}
                </button>
              </div>

              {/* BOUTONS DE GÉNÉRATION */}
              <div className="space-y-3">
                
                {/* ✅ APERÇU GRATUIT */}
                <button
                  type="button"
                  onClick={handleGeneratePreview}
                  disabled={!isFormValid || isProcessing}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Génération de l'aperçu...
                    </>
                  ) : (
                    <>Voir l'aperçu (GRATUIT)</>
                  )}
                </button>



                {/* GÉNÉRATION DIRECTE PAR CRÉDITS */}
                <button
                  type="button"
                  onClick={handleGenerateDirect}
                  disabled={!isFormValid || isProcessing}
                  className="w-full py-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Traitement...</>
                  ) : (
                    <>Générer le PDF (10 cr)</>
                  )}
                </button>
              </div>

            </div>

            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-8">
                <div className="bg-slate-900 rounded-xl p-8">
                  
                  <MiniBook title={titre} template={template} />
                  
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="text-xs text-white/60 uppercase tracking-wider mb-3">Inclus</div>
                    <div className="space-y-2">
                      {["PDF pro format A4",  "5 améliorations IA", "Prêt en 20 sec"].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-white/80">
                          <Check className="w-4 h-4 text-green-400" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="text-3xl font-black text-white mb-1">
                      10 <span className="text-lg text-white/60">crédits</span>
                    </div>
                    <div className="text-xs text-white/60">
                      Déduits de votre solde à la génération.
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}