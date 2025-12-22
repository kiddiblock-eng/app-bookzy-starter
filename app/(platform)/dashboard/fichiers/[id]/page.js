"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, FileText, Download, Image as ImageIcon,
  Calendar, Copy, Check, Package, 
  MessageCircle, Smartphone, Layout, Zap, PenTool
} from "lucide-react";

export default function FichierDetailPage({ params }) {
  const router = useRouter();
  const { id } = params || {};

  const [ebook, setEbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tous"); 
  const [copiedStates, setCopiedStates] = useState({});

  useEffect(() => {
    if (!id) return;
    let mounted = true;

    async function fetchData() {
      try {
        const res = await fetch(`/api/ebooks/${id}`, {
          method: "GET", 
          headers: { "Content-Type": "application/json" },
        });

        if (res.status === 401) return;

        const data = await res.json();
        
        if (!mounted) return;
        
        if (data.success && data.projet) {
             setEbook(data.projet);
        } else {
             setEbook(null);
        }

      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchData();
    return () => { mounted = false; };
  }, [id]);

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [key]: true }));
    setTimeout(() => setCopiedStates(prev => ({ ...prev, [key]: false })), 2000);
  };

  if (loading) return <LoadingSkeleton />;
  if (!ebook) return <NotFoundState router={router} />;

  // --- LOGIQUE DE RÉCUPÉRATION (SYNC AVEC TON API) ---
  const ads = ebook.adsTexts || {};
  
  const sections = [
    { 
        id: "fb", 
        label: "Facebook & Insta", 
        icon: MessageCircle, 
        content: ads.facebook, 
        color: "text-blue-600", 
        bg: "bg-blue-50" 
    },
    { 
        id: "whatsapp", 
        label: "Séquence WhatsApp", 
        icon: Smartphone, 
        content: ads.whatsapp, 
        color: "text-green-600", 
        bg: "bg-green-50" 
    },
    { 
        id: "landing", 
        label: "Page de Vente", 
        icon: Layout, 
        // ✅ Cible 'landing' généré par ton API
        content: ads.landing || ads.salesPage || ebook.marketingDescription, 
        color: "text-purple-600", 
        bg: "bg-purple-50" 
    },
    { 
        id: "long", 
        label: "Post Marketing (Long)", 
        icon: PenTool, 
        // ✅ Cible 'long' généré par ton API
        content: ads.long, 
        color: "text-orange-600", 
        bg: "bg-orange-50" 
    },
    { 
        id: "email", 
        label: "Email Marketing", 
        icon: FileText, 
        content: ads.email, 
        color: "text-indigo-600", 
        bg: "bg-indigo-50" 
    },
  ].filter(s => s.content && s.content.length > 10); // Filtre les textes trop courts ou vides

  const filteredSections = activeTab === "tous" ? sections : sections.filter(s => s.id === activeTab);
  const adsImages = ebook.adsImages || [];

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-900 pb-20">
      
      {/* HEADER */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
           <button onClick={() => router.back()} className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-bold">
              <div className="p-1.5 rounded-lg group-hover:bg-slate-100 transition-colors"><ArrowLeft className="w-4 h-4" /></div>
              <span>Retour</span>
           </button>
           <div className="text-xs font-medium text-slate-400 uppercase tracking-widest hidden sm:block">Détails du Kit</div>
           <div className="w-8"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* EN-TÊTE */}
        <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider">
                    Modèle {ebook.template || "Standard"}
                </span>
                <span className="text-slate-400 text-sm flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5"/> {new Date(ebook.createdAt).toLocaleDateString()}
                </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">{ebook.titre || ebook.title}</h1>
        </div>

        <div className="flex flex-col lg:flex-row-reverse gap-8 lg:gap-12">
            
            {/* --- BARRE LATÉRALE (Fichiers) --- */}
            <div className="lg:w-80 flex-shrink-0 space-y-6">
                <div className="bg-white p-1 rounded-3xl border border-slate-200 shadow-xl">
                    <div className="bg-slate-900 rounded-[20px] p-6 text-white text-center relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10 backdrop-blur-md">
                                <FileText className="w-6 h-6 text-white"/>
                            </div>
                            <h3 className="font-bold text-lg mb-1">Ebook PDF</h3>
                            <p className="text-slate-400 text-xs mb-6">{ebook.pages} Pages • Prêt à l'emploi</p>
                            
                            {ebook.pdfUrl || ebook.fileUrl ? (
                                <a href={ebook.pdfUrl || ebook.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3.5 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-lg active:scale-95">
                                    <Download className="w-4 h-4"/> Télécharger
                                </a>
                            ) : (
                                <div className="py-3.5 bg-white/10 rounded-xl text-xs font-bold text-slate-400">En cours...</div>
                            )}
                        </div>
                    </div>
                </div>

                {adsImages.length > 0 && (
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-slate-400"/>
                            <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Images Pub</h4>
                        </div>
                        <div className="p-4 grid grid-cols-2 gap-3">
                            {adsImages.map((img, i) => (
                                <a key={i} href={img} target="_blank" className="group block relative aspect-square bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                                    <img src={img} alt="Marketing" className="w-full h-full object-cover"/>
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Download className="w-5 h-5 text-white"/>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* --- CONTENU (Textes Marketing) --- */}
            <div className="flex-1 min-w-0">
                
                {/* ONGLETS */}
                <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 pb-1">
                    <TabButton label="Tout voir" active={activeTab === "tous"} onClick={() => setActiveTab("tous")} />
                    {sections.map(s => (
                        <TabButton key={s.id} label={s.label} icon={s.icon} active={activeTab === s.id} onClick={() => setActiveTab(s.id)} />
                    ))}
                </div>

                {/* LISTE DES SECTIONS */}
                <div className="space-y-6">
                    {filteredSections.map((section) => (
                        <div key={section.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${section.bg} ${section.color}`}>
                                        <section.icon className="w-4 h-4"/>
                                    </div>
                                    <h3 className="font-bold text-slate-700 text-sm">{section.label}</h3>
                                </div>
                                <button 
                                    onClick={() => handleCopy(section.content, section.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${copiedStates[section.id] ? 'bg-green-100 text-green-700 border-green-200' : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300'}`}
                                >
                                    {copiedStates[section.id] ? <Check className="w-3.5 h-3.5"/> : <Copy className="w-3.5 h-3.5"/>}
                                    {copiedStates[section.id] ? "Copié !" : "Copier"}
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="text-slate-600 whitespace-pre-wrap font-medium leading-relaxed text-sm">
                                    {section.content}
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredSections.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
                            <p className="text-slate-400 text-sm font-medium">Contenu marketing non généré pour ce projet.</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}

// --- HELPERS ---

function TabButton({ label, icon: Icon, active, onClick }) {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold transition-all border-b-2 mb-[-2px] ${
                active 
                ? 'border-slate-900 text-slate-900' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
        >
            {Icon && <Icon className="w-4 h-4" />}
            {label}
        </button>
    )
}

function LoadingSkeleton() {
    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center">
             <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4"></div>
             <p className="text-slate-400 font-bold text-xs">Récupération des données...</p>
        </div>
    )
}

function NotFoundState({ router }) {
    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-xl font-bold text-slate-900 mb-2">Kit introuvable</h1>
            <button onClick={() => router.push("https://app.bookzy.io/dashboard/fichiers")} className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm">
                Retour aux fichiers
            </button>
        </div>
    )
}