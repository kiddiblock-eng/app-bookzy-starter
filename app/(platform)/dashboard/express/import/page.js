"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, Loader2, Check, ArrowLeft, FileText, HelpCircle, X, Download, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
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
            maxPages: 15
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
            <p className="text-slate-400 text-xs hidden sm:block">Avec watermark - Version finale après paiement</p>
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
              Modifier le template
            </button>
            <button
              onClick={onBuy}
              className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors text-sm sm:text-base"
            >
              Générer le PDF (10 crédits)
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
// 💡 MODAL GUIDE
// ============================================================================
const GuideModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        <div className="bg-slate-900 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold">Comment structurer votre Word</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          
          <p className="text-slate-600 text-base">
            Pour que votre PDF et ebook soient bien structurés, organisez votre document Word comme ceci :
          </p>

          <div className="border-l-4 border-blue-600 pl-4">
            <h3 className="font-bold text-slate-900 mb-2">Titre du document</h3>
            <p className="text-slate-700 text-sm mb-3">
              Mettez votre titre principal en gras au début du fichier.
            </p>
            <div className="bg-slate-50 rounded p-3 text-sm">
              <span className="text-slate-500">Exemple :</span>
              <p className="font-bold mt-1">Guide de l'Infopreneur 2024</p>
            </div>
          </div>

          <div className="border-l-4 border-blue-600 pl-4">
            <h3 className="font-bold text-slate-900 mb-2">Chapitres</h3>
            <p className="text-slate-700 text-sm mb-3">
              Pour chaque chapitre, mettez le titre en MAJUSCULES et en gras.
            </p>
            <div className="bg-slate-50 rounded p-3 text-sm space-y-1">
              <span className="text-slate-500">Exemples :</span>
              <p className="font-bold mt-1">INTRODUCTION</p>
              <p className="font-bold">CHAPITRE 1 : LES BASES</p>
              <p className="font-bold">CONCLUSION</p>
            </div>
          </div>

          <div className="border-l-4 border-blue-600 pl-4">
            <h3 className="font-bold text-slate-900 mb-2">Contenu</h3>
            <p className="text-slate-700 text-sm mb-3">
              Écrivez votre texte normalement, sans mettre tout en gras.
            </p>
            <div className="bg-slate-50 rounded p-3 text-sm">
              <p className="text-slate-700">
                L'infopreneur est une personne qui crée et vend des produits d'information. 
                Ce modèle économique permet de monétiser son expertise...
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-slate-700">
              <strong className="text-slate-900">Note :</strong> Si votre document contient un sommaire, 
              pas besoin de le retirer. Notre système le détecte automatiquement.
            </p>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-bold text-slate-900 mb-3">En bref</h4>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <span>Titre principal en gras</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <span>Titres de chapitres en MAJUSCULES + gras</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <span>Contenu en texte normal</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="bg-slate-50 p-6 rounded-b-2xl border-t">
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};

// ============================================================================
// 🎉 MODAL SUCCÈS AVEC TÉLÉCHARGEMENT
// ============================================================================
const SuccessModal = ({ isOpen, onClose, pdfUrl, titre }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            PDF généré avec succès !
          </h2>
          
          <p className="text-slate-600 mb-6">
            {titre}
          </p>

          <div className="space-y-3">
            {pdfUrl && (
              <a
                href={pdfUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
              >
                <div className="flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  <span>Télécharger le PDF</span>
                </div>
              </a>
            )}
            
            <button
              onClick={() => window.location.href = "/dashboard/projets"}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
            >
              Voir mes projets
            </button>
            
            <button
              onClick={onClose}
              className="w-full py-3 text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

// ============================================================================
// 📄 COMPOSANT PRINCIPAL
// ============================================================================
export default function ExpressImport() {
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [template, setTemplate] = useState("modern");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  
  // ✅ MODALS
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewProjetId, setPreviewProjetId] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState(null);
  const [generatedTitre, setGeneratedTitre] = useState("");

  // CRÉDITS
  const { balance, requireCredits, showModal: showCreditsModal, setShowModal: setShowCreditsModal, modalAction, mutateBalance } = useCredits();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".docx")) {
      alert("Seuls les fichiers .docx sont acceptés");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/extract-docx", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setExtractedData(data);
        setStep(2);
      } else {
        alert("Erreur : " + data.error);
      }
    } catch (error) {
      alert("Erreur d'import : " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  // ✅ GÉNÉRATION APERÇU (GRATUIT)
  const handleGeneratePreview = async () => {
    if (!extractedData) return;

    setIsProcessing(true);

    try {
      const res = await fetch("/api/express/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titre: extractedData.titre || "Document Word",
          introduction: "",
          conclusion: "",
          chapters: extractedData.chapters.map((ch, i) => ({
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

  // ✅ BOUTON GÉNÉRER DIRECT
  const handleGenerateDirect = () => {
    requireCredits("express_layout", () => handleGenerate());
  };

  // ✅ GÉNÉRATION (flow crédits — plus de paiement)
  const handleGenerate = async () => {
    if (!extractedData) return;
    setIsProcessing(true);
    try {
      const createRes = await fetch("/api/express/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titre: extractedData.titre || "Document Word",
          introduction: "",
          conclusion: "",
          chapters: extractedData.chapters.map((ch, i) => ({
            number: i + 1,
            title: ch.title,
            content: ch.content,
          })),
          template,
        }),
      });

      const createData = await createRes.json();

      if (createData.insufficientCredits) {
        setShowCreditsModal(true);
        setIsProcessing(false);
        return;
      }

      if (!createData.success) throw new Error(createData.error);

      setGeneratedTitre(extractedData.titre || "Document Word");

      // Lancer la génération PDF
      const genRes = await fetch("/api/express/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projetId: createData.projetId }),
      });

      const genData = await genRes.json();
      if (genData.success) {
        setGeneratedPdfUrl(genData.pdfUrl);
        setShowSuccessModal(true);
        mutateBalance(); // ✅ rafraîchir le solde
      } else {
        throw new Error(genData.error || "Erreur génération");
      }
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue : " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <InsufficientCreditsModal
        open={showCreditsModal}
        onClose={() => setShowCreditsModal(false)}
        action={modalAction}
        balance={balance}
      />
      <GuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />
      
      <PreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        projetId={previewProjetId}
        onBuy={handleBuyFromPreview}
      />
      
      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)}
        pdfUrl={generatedPdfUrl}
        titre={generatedTitre}
      />

      <div className="min-h-screen bg-slate-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          
          <div className="mb-8">
            <Link 
              href="/dashboard/express"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au choix
            </Link>
            
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
              📄 Import depuis Word
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              Uploadez votre fichier .docx et générez votre PDF et ebook pro
            </p>
          </div>

          {/* ÉTAPE 1 : UPLOAD */}
          {step === 1 && (
            <div className="bg-white rounded-2xl p-4 sm:p-8 border border-slate-200">
              
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                    1
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    Uploadez votre document
                  </h2>
                </div>
                
                <button
                  onClick={() => setShowGuide(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors group border border-blue-200"
                >
                  <HelpCircle className="w-5 h-5 group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span className="font-medium text-sm">Comment structurer mon Word ?</span>
                </button>
              </div>
              
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 sm:p-12 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400 mx-auto mb-4" />
                
                <p className="text-slate-600 mb-1 font-medium text-sm sm:text-base">
                  Glissez votre fichier .docx ici
                </p>
                <p className="text-slate-500 text-xs sm:text-sm mb-4">
                  ou cliquez pour choisir un fichier
                </p>
                
                <input
                  type="file"
                  accept=".docx"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                  id="file-upload"
                />
                
                <label
                  htmlFor="file-upload"
                  className="inline-block px-5 py-2.5 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-semibold rounded-lg cursor-pointer transition-colors"
                >
                  {isUploading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Import en cours...
                    </span>
                  ) : (
                    'Choisir un fichier'
                  )}
                </label>
              </div>
            </div>
          )}

          {/* ÉTAPE 2 : APERÇU */}
          {step === 2 && extractedData && (
            <div className="space-y-6">
              
              <div className="bg-white rounded-2xl p-4 sm:p-8 border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">
                    <Check className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    Contenu détecté avec succès
                  </h2>
                </div>
                
                <div className="space-y-4">
                  
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="text-sm font-semibold text-slate-600 mb-2">
                      📖 Titre
                    </div>
                    <div className="font-semibold text-slate-900 text-sm sm:text-base">
                      {extractedData.titre || "Sans titre"}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="text-sm font-semibold text-slate-600 mb-3">
                      📚 Chapitres détectés : {extractedData.chapters?.length || 0}
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {extractedData.chapters?.map((ch, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200">
                          <FileText className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-slate-900 truncate text-sm sm:text-base">
                              {ch.title}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                              {ch.content.length} caractères
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* TEMPLATES */}
              <div className="bg-white rounded-2xl p-4 sm:p-8 border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    Choisissez un template
                  </h2>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {(showAllTemplates ? TEMPLATES : TEMPLATES.slice(0, 6)).map((t) => (
                    <button
                      key={t.id}
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
                  onClick={() => setShowAllTemplates(!showAllTemplates)}
                  className="mt-4 w-full py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {showAllTemplates ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      <span>Voir moins</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      <span>Voir 6 templates supplémentaires</span>
                    </>
                  )}
                </button>
              </div>

              {/* ✅ BOUTONS AVEC APERÇU */}
              <div className="space-y-3">
                
                {/* APERÇU GRATUIT */}
                <button
                  onClick={handleGeneratePreview}
                  disabled={isProcessing}
                  className="w-full py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Génération de l'aperçu...
                    </>
                  ) : (
                    <>👁️ Voir l'aperçu (GRATUIT)</>
                  )}
                </button>



                {/* PRODUCTION */}
                <button
                  onClick={handleGenerateDirect}
                  disabled={isProcessing}
                  className="w-full py-3 sm:py-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {isProcessing ? (
                    <><Loader2 className="w-5 h-5 animate-spin" />Génération en cours...</>
                  ) : (
                    <>🚀 Générer le PDF (10 cr)</>
                  )}
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </>
  );
}