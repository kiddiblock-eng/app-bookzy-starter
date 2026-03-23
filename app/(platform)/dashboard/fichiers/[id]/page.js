"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, FileText, Download, Image as ImageIcon,
  Calendar, Copy, Check, MessageCircle,
  Smartphone, Layout, PenTool, Loader2
} from "lucide-react";

export default function EbookDetailPage({ params }) {
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
          headers: { "Content-Type": "application/json" },
        });
        if (!mounted) return;
        const data = await res.json();
        setEbook(data.success && data.projet ? data.projet : null);
      } catch {}
      finally { if (mounted) setLoading(false); }
    }
    fetchData();
    return () => { mounted = false; };
  }, [id]);

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedStates(p => ({ ...p, [key]: true }));
    setTimeout(() => setCopiedStates(p => ({ ...p, [key]: false })), 2000);
  };

  if (loading) return <PageLoader />;
  if (!ebook) return <NotFound router={router} />;

  const ads = ebook.adsTexts || {};
  const sections = [
    { id: "fb",       label: "Facebook & Instagram", icon: MessageCircle, content: ads.facebook,                              color: "text-blue-600",   bg: "bg-blue-50"   },
    { id: "whatsapp", label: "Séquence WhatsApp",    icon: Smartphone,    content: ads.whatsapp,                              color: "text-green-600",  bg: "bg-green-50"  },
    { id: "landing",  label: "Page de vente",        icon: Layout,        content: ads.landing || ads.salesPage,              color: "text-purple-600", bg: "bg-purple-50" },
    { id: "long",     label: "Post long format",     icon: PenTool,       content: ads.long,                                  color: "text-orange-600", bg: "bg-orange-50" },
    { id: "email",    label: "Email marketing",      icon: FileText,      content: ads.email,                                 color: "text-indigo-600", bg: "bg-indigo-50" },
  ].filter(s => s.content && s.content.length > 10);

  const visibleSections = activeTab === "tous" ? sections : sections.filter(s => s.id === activeTab);
  const adsImages = ebook.adsImages || [];
  const pdfUrl = ebook.pdfUrl || ebook.fileUrl;
  const docxUrl = ebook.docxUrl || null;

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-900 pb-20">

      {/* Topbar */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          <button onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-widest hidden sm:block">
            Détail ebook
          </span>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">

        {/* Titre */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-semibold uppercase tracking-wider">
              {ebook.template || "Standard"}
            </span>
            <span className="text-slate-400 text-sm flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(ebook.createdAt).toLocaleDateString("fr-FR")}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
            {ebook.titre || ebook.title}
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row-reverse gap-8">

          {/* Sidebar */}
          <div className="lg:w-72 flex-shrink-0 space-y-4">

            {/* PDF card */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-900 p-6 text-white text-center">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-base mb-1">PDF de l'ebook</h3>
                <p className="text-slate-400 text-xs mb-5">{ebook.pages} pages</p>

                {pdfUrl ? (
                  <a href={pdfUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-white text-slate-900 rounded-lg font-semibold text-sm hover:bg-slate-50 transition-colors">
                    <Download className="w-4 h-4" /> Télécharger
                  </a>
                ) : (
                  <div className="py-3 bg-white/10 rounded-lg text-slate-400 text-sm text-center">
                    PDF non disponible
                  </div>
                )}
              </div>
            </div>

            {/* DOCX card */}
            {docxUrl && (
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Version Word</h4>
                </div>
                <div className="p-4">
                  <p className="text-xs text-slate-400 mb-3">Fichier .docx éditable dans Microsoft Word ou Google Docs.</p>
                  <a href={docxUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors">
                    <Download className="w-4 h-4" /> Télécharger .docx
                  </a>
                </div>
              </div>
            )}

            {/* Images marketing */}
            {adsImages.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-slate-400" />
                  <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Visuels pub</h4>
                </div>
                <div className="p-4 grid grid-cols-2 gap-2">
                  {adsImages.map((img, i) => (
                    <a key={i} href={img} target="_blank"
                      className="group relative aspect-square bg-slate-50 rounded-lg overflow-hidden border border-slate-100">
                      <img src={img} alt="Visuel marketing" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Download className="w-4 h-4 text-white" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contenu marketing */}
          <div className="flex-1 min-w-0">

            {sections.length > 0 ? (
              <>
                {/* Onglets */}
                <div className="flex flex-wrap gap-1 mb-6 border-b border-slate-200 pb-0">
                  <TabBtn label="Tout voir" active={activeTab === "tous"} onClick={() => setActiveTab("tous")} />
                  {sections.map(s => (
                    <TabBtn key={s.id} label={s.label} icon={s.icon} active={activeTab === s.id} onClick={() => setActiveTab(s.id)} />
                  ))}
                </div>

                {/* Sections */}
                <div className="space-y-4">
                  {visibleSections.map((section) => (
                    <div key={section.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                      <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-1.5 rounded-lg ${section.bg} ${section.color}`}>
                            <section.icon className="w-3.5 h-3.5" />
                          </div>
                          <h3 className="font-semibold text-slate-700 text-sm">{section.label}</h3>
                        </div>
                        <button
                          onClick={() => handleCopy(section.content, section.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                            copiedStates[section.id]
                              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                              : "bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300"
                          }`}
                        >
                          {copiedStates[section.id] ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedStates[section.id] ? "Copié !" : "Copier"}
                        </button>
                      </div>
                      <div className="p-5 text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                        {section.content}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-xl">
                <MessageCircle className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                <p className="text-sm text-slate-400 font-medium">Aucun contenu marketing généré pour cet ebook.</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Tab button ── */
function TabBtn({ label, icon: Icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-semibold transition-all border-b-2 mb-[-1px] ${
        active ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-600"
      }`}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label}
    </button>
  );
}

/* ── States ── */
function PageLoader() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
    </div>
  );
}

function NotFound({ router }) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-lg font-bold text-slate-900 mb-2">Ebook introuvable</h1>
      <button onClick={() => router.push("/dashboard/fichiers")}
        className="mt-4 px-5 py-2 bg-slate-900 text-white rounded-lg font-semibold text-sm hover:bg-slate-800 transition-colors">
        Retour à mes ebooks
      </button>
    </div>
  );
}