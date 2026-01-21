"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Download, ImageIcon, FileText, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ResourcesTab({ referralLink }) {
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState([]);

  // 1. Récupérer les ressources depuis l'API
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await fetch("/api/affiliation/resources");
        const json = await res.json();
        if (json.success) {
          setAssets(json.data);
        }
      } catch (error) {
        console.error("Erreur chargement ressources", error);
        toast.error("Impossible de charger les ressources marketing");
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  // 2. Séparer les textes et les images
  const textAssets = assets.filter(a => a.type === "TEXT");
  const imageAssets = assets.filter(a => a.type === "IMAGE");

  // 3. Fonction pour injecter le lien parrain dans le texte dynamique
  const getFormattedText = (text) => {
    // Remplace {{LINK}} par le vrai lien ou un placeholder si pas encore chargé
    return text.replace("{{LINK}}", referralLink || "https://app.bookzy.io?ref=...");
  };

  // 4. Fonction de Téléchargement ROBUSTE (Force le download)
  const handleDownload = async (url, title) => {
    try {
      toast.loading("Téléchargement en cours...");

      // On récupère l'image en tant que "Blob" (Fichier brut)
      const response = await fetch(url);
      const blob = await response.blob();
      
      // On crée un lien invisible dans le navigateur
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      
      // On nettoie le titre pour faire un nom de fichier propre
      // Ex: "Story Instagram" -> "story-instagram-bookzy.jpg"
      const safeTitle = (title || "image").replace(/[^a-z0-9]/gi, '-').toLowerCase();
      link.download = `${safeTitle}-bookzy.jpg`; 
      
      // On clique virtuellement
      document.body.appendChild(link);
      link.click();
      
      // Nettoyage
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      
      toast.dismiss();
      toast.success("Image téléchargée !");
    } catch (error) {
      console.error("Download error:", error);
      toast.dismiss();
      // Fallback : Si la sécurité bloque, on ouvre dans un nouvel onglet
      window.open(url, '_blank');
    }
  };

  if (loading) return <ResourcesSkeleton />;

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      
      {/* --- SECTION 1 : MESSAGES PRÉ-ÉCRITS --- */}
      {textAssets.length > 0 && (
        <div className="space-y-6">
          <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
             <div className="p-2 bg-violet-100 text-violet-600 rounded-lg">
               <FileText className="w-5 h-5" />
             </div>
             Scripts & Messages
          </h3>
          
          <div className="grid gap-6">
            {textAssets.map((asset) => {
              const finalContent = getFormattedText(asset.textContent);
              return (
                <div key={asset._id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-violet-200 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-slate-800 text-sm">{asset.title}</h4>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-full font-bold">SCRIPT</span>
                  </div>
                  
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 relative group mb-4">
                    <pre className="text-sm text-slate-600 whitespace-pre-wrap font-sans leading-relaxed">
                      {finalContent}
                    </pre>
                  </div>
                  
                  <div className="flex justify-end">
                     <CopyButton text={finalContent} label="Copier le script" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- SECTION 2 : VISUELS MARKETING --- */}
      {imageAssets.length > 0 && (
        <div>
          <h3 className="font-bold text-slate-900 text-lg mb-6 flex items-center gap-2">
             <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
               <ImageIcon className="w-5 h-5" />
             </div>
             Visuels & Bannières
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {imageAssets.map((banner) => (
              <div 
                key={banner._id} 
                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(banner.imageUrl, banner.title);
                }}
              >
                {/* Image Container */}
                <div className="aspect-video bg-slate-100 relative overflow-hidden">
                  {banner.imageUrl ? (
                    <img 
                      src={banner.imageUrl} 
                      alt={banner.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                  
                  {/* Overlay au survol */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                     <button className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                       <Download className="w-4 h-4" /> Télécharger
                     </button>
                  </div>
                </div>
                
                {/* Info Footer */}
                <div className="p-4 flex justify-between items-center border-t border-slate-50">
                  <div>
                    <p className="font-bold text-slate-900 text-sm truncate pr-2">{banner.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">{banner.format || "Image"}</p>
                  </div>
                  <div className="p-2 text-slate-300 group-hover:text-blue-600 transition-colors bg-slate-50 rounded-lg group-hover:bg-blue-50">
                    <Download className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- ÉTAT VIDE (Si aucune ressource) --- */}
      {assets.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
             <ImageIcon className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-slate-900 font-bold text-lg mb-1">Bientôt disponible</h3>
          <p className="text-slate-500 max-w-sm">
            Les ressources marketing sont en cours de création. Revenez très bientôt !
          </p>
        </div>
      )}

    </div>
  );
}

// --- SOUS-COMPOSANT : BOUTON COPIER ---
function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Script copié !");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all
        ${label 
          ? "bg-slate-900 text-white hover:bg-slate-800 shadow-md hover:shadow-lg active:scale-95" 
          : "bg-white p-2 border border-slate-200 text-slate-500 hover:text-violet-600"
        }
      `}
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      {label && <span>{copied ? "Copié !" : label}</span>}
    </button>
  );
}

// --- SOUS-COMPOSANT : SQUELETTE DE CHARGEMENT ---
function ResourcesSkeleton() {
  return (
    <div className="space-y-12 animate-pulse">
      {/* Text Skeleton */}
      <div className="bg-white border border-slate-200 rounded-xl p-8">
        <div className="h-6 w-48 bg-slate-200 rounded mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-slate-100 rounded"></div>
          <div className="h-4 w-3/4 bg-slate-100 rounded"></div>
          <div className="h-4 w-1/2 bg-slate-100 rounded"></div>
        </div>
      </div>
      
      {/* Image Grid Skeleton */}
      <div>
        <div className="h-6 w-48 bg-slate-200 rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[1,2,3].map(i => (
             <div key={i} className="aspect-video bg-slate-200 rounded-xl border border-slate-200"></div>
           ))}
        </div>
      </div>
    </div>
  )
}