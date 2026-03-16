"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { 
  Store, Palette, CreditCard, Camera, Check, Copy, ExternalLink,
  Instagram, Youtube, Globe, Loader2, X, Phone, Eye, Package, Pencil,
  Image, Upload, MessageCircle, Link as LinkIcon, Download,
  Bold, Italic, Underline, List, ListOrdered, AlignLeft, AlignCenter, AlignRight,
  Plus, Trash2, Star, ChevronDown, ChevronUp, HelpCircle, MessageSquare, Flame,
  ChevronLeft, ChevronRight
} from "lucide-react";
import Link from "next/link";
import { useCredits } from "@/hooks/useCredits";
import InsufficientCreditsModal from "@/components/ui/InsufficientCreditsModal";

// ============================================
// INFO MODAL (remplace alert)
// ============================================
const InfoModal = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="p-6 text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-orange-500" />
          </div>
          <p className="text-gray-800 font-medium">{message}</p>
        </div>
        <div className="border-t border-gray-100">
          <button onClick={onClose} className="w-full py-4 text-gray-700 font-semibold hover:bg-gray-50">OK</button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// RICH TEXT EDITOR COMPONENT - FIXED
// ============================================

function RichTextEditor({ value, onChange, placeholder, maxLength = 5000 }) {
  const editorRef = useRef(null);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || "";
    }
    setCharCount(editorRef.current?.innerText?.length || 0);
  }, [value]);

  const execCommand = (command, value = null) => {
    // S'assurer que l'éditeur a le focus
    editorRef.current?.focus();
    
    // Pour les listes, on doit s'assurer qu'il y a une sélection ou un curseur valide
    const selection = window.getSelection();
    if (!selection.rangeCount || !editorRef.current.contains(selection.anchorNode)) {
      // Créer une sélection à la fin si aucune ou si hors de l'éditeur
      const range = document.createRange();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    
    document.execCommand(command, false, value);
    handleInput();
  };

  const handleInput = () => {
    const html = editorRef.current?.innerHTML || "";
    const text = editorRef.current?.innerText || "";
    setCharCount(text.length);
    if (text.length <= maxLength) {
      onChange(html);
    }
  };

  // Gérer le paste pour nettoyer le HTML
  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    handleInput();
  };

  // Gérer Enter pour créer des paragraphes
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      // Laisser le comportement par défaut pour les listes
      const selection = window.getSelection();
      if (selection.anchorNode) {
        const parentList = selection.anchorNode.parentElement?.closest('ul, ol');
        if (parentList) {
          return; // Laisser le comportement par défaut dans les listes
        }
      }
    }
  };

  const ToolbarButton = ({ icon: Icon, command, title }) => (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault(); // IMPORTANT: Empêcher la perte de focus/sélection
        execCommand(command);
      }}
      className="p-1.5 sm:p-2 rounded-lg transition-colors text-gray-500 hover:bg-gray-100 hover:text-gray-700"
      title={title}
    >
      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
    </button>
  );

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 sm:gap-1 p-1.5 sm:p-2 bg-gray-50 border-b border-gray-200 flex-wrap">
        <ToolbarButton icon={Bold} command="bold" title="Gras" />
        <ToolbarButton icon={Italic} command="italic" title="Italique" />
        <ToolbarButton icon={Underline} command="underline" title="Souligné" />
        <div className="w-px h-4 sm:h-5 bg-gray-300 mx-0.5 sm:mx-1" />
        <ToolbarButton icon={List} command="insertUnorderedList" title="Liste à puces" />
        <ToolbarButton icon={ListOrdered} command="insertOrderedList" title="Liste numérotée" />
        <div className="w-px h-4 sm:h-5 bg-gray-300 mx-0.5 sm:mx-1" />
        <ToolbarButton icon={AlignLeft} command="justifyLeft" title="Aligner à gauche" />
        <ToolbarButton icon={AlignCenter} command="justifyCenter" title="Centrer" />
        <ToolbarButton icon={AlignRight} command="justifyRight" title="Aligner à droite" />
      </div>
      
      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        className="min-h-[120px] sm:min-h-[150px] max-h-[250px] sm:max-h-[300px] overflow-y-auto p-3 sm:p-4 focus:outline-none text-sm [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5 [&_li]:my-1"
        data-placeholder={placeholder}
      />
      
      {/* Char count */}
      <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-50 border-t border-gray-200 flex justify-end">
        <span className={`text-xs ${charCount > maxLength ? "text-red-500" : "text-gray-400"}`}>
          {charCount}/{maxLength}
        </span>
      </div>
      
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}

// ============================================
// DATA
// ============================================

const templates = [
  { id: "clean", name: "Clean", category: "classic", bg: "bg-white", text: "text-gray-900", card: "bg-gray-50", accent: "bg-gray-200" },
  { id: "stone", name: "Stone", category: "classic", bg: "bg-gray-900", text: "text-white", card: "bg-gray-800", accent: "bg-gray-700" },
  { id: "gradient", name: "Gradient", category: "classic", bg: "bg-gradient-to-br from-violet-600 to-indigo-700", text: "text-white", card: "bg-white/10", accent: "bg-white/20" },
  { id: "warm", name: "Warm", category: "classic", bg: "bg-gradient-to-br from-amber-50 to-orange-50", text: "text-amber-900", card: "bg-white", accent: "bg-amber-100" },
  { id: "neon", name: "Neon", category: "modern", isNew: true, bg: "bg-black", text: "text-white", card: "bg-gray-900/50", accent: "bg-fuchsia-500/20", special: "neon" },
  { id: "minimal", name: "Minimal", category: "modern", isNew: true, bg: "bg-neutral-50", text: "text-neutral-900", card: "bg-white", accent: "bg-neutral-100", special: "minimal" },
  { id: "brutalist", name: "Brutalist", category: "modern", isNew: true, bg: "bg-yellow-300", text: "text-black", card: "bg-white", accent: "bg-black", special: "brutalist" },
  { id: "glass", name: "Glass", category: "modern", isNew: true, bg: "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900", text: "text-white", card: "bg-white/10", accent: "bg-white/20", special: "glass" },
  { id: "love", name: "Love", category: "premium", isNew: true, bg: "bg-gradient-to-b from-pink-100 to-rose-200", text: "text-rose-900", card: "bg-white", accent: "bg-rose-200", special: "love" },
  { id: "elegant", name: "Elegant", category: "premium", isNew: true, bg: "bg-stone-200", text: "text-stone-800", card: "bg-white", accent: "bg-amber-400", special: "elegant" },
  { id: "playful", name: "Playful", category: "premium", isNew: true, bg: "bg-gradient-to-r from-violet-200 via-pink-200 to-orange-200", text: "text-gray-800", card: "bg-white", accent: "bg-pink-300", special: "playful" },
  { id: "nature", name: "Nature", category: "premium", isNew: true, bg: "bg-gradient-to-b from-green-100 to-emerald-200", text: "text-green-900", card: "bg-white", accent: "bg-green-300", special: "nature" },
  { id: "midnight", name: "Midnight", category: "premium", isNew: true, bg: "bg-gradient-to-b from-slate-900 to-indigo-950", text: "text-white", card: "bg-indigo-900/50", accent: "bg-indigo-500/30", special: "midnight" },
];

const currencies = [
  { code: "XOF", symbol: "FCFA", name: "Franc CFA (Afrique Ouest)" },
  { code: "XAF", symbol: "FCFA", name: "Franc CFA (Afrique Centrale)" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "USD", symbol: "$", name: "Dollar US" },
  { code: "GBP", symbol: "£", name: "Livre Sterling" },
];

const paymentMethods = [
  { id: "wave", name: "Wave", color: "bg-cyan-500" },
  { id: "orange_money", name: "Orange Money", color: "bg-orange-500" },
  { id: "mtn_momo", name: "MTN MoMo", color: "bg-yellow-500" },
  { id: "moov_money", name: "Moov Money", color: "bg-blue-500" },
];

const checkoutOptions = [
  { id: "whatsapp", label: "WhatsApp", desc: "Redirection", icon: MessageCircle, color: "bg-gray-900" },
  { id: "link", label: "Lien", desc: "Externe", icon: LinkIcon, color: "bg-gray-900" },
  { id: "free", label: "Gratuit", desc: "Téléchargement", icon: Download, color: "bg-gray-900" },
  { id: "checkout", label: "Paiement", desc: "Bientôt", icon: CreditCard, color: "bg-gray-300", disabled: true },
];

// ============================================
// PHONE PREVIEW COMPONENT
// ============================================

function PhonePreview({ form, products = [], currencies: currencyList }) {
  const template = templates.find(t => t.id === form.template) || templates[0];
  const currency = currencyList.find(c => c.code === form.currency) || currencyList[0];
  const displayProducts = products.filter(p => p.isActive !== false);

  return (
    <div className="relative mx-auto" style={{ width: 280 }}>
      <div className="bg-black rounded-[3rem] p-3 shadow-2xl">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[90px] h-[28px] bg-black rounded-full z-20" />
        <div className={`w-full h-[520px] ${template.bg} rounded-[2.3rem] overflow-hidden relative`}>
          
          {template.special === "neon" && (
            <>
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                backgroundImage: `linear-gradient(rgba(217,70,239,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(217,70,239,0.3) 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
              }} />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-fuchsia-500/30 rounded-full blur-[60px] pointer-events-none" />
            </>
          )}
          {template.special === "glass" && (
            <>
              <div className="absolute top-10 -left-10 w-32 h-32 bg-purple-500/30 rounded-full blur-[50px] pointer-events-none" />
              <div className="absolute bottom-10 -right-10 w-32 h-32 bg-blue-500/30 rounded-full blur-[50px] pointer-events-none" />
            </>
          )}
          
          <div className="h-full overflow-y-auto relative z-10">
            {template.category === "premium" && (
              <div className="relative">
                <div className="h-20 overflow-hidden">
                  {form.banner ? (
                    <img src={form.banner} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full ${
                      template.special === "love" ? "bg-gradient-to-r from-pink-400 to-rose-400" :
                      template.special === "elegant" ? "bg-gradient-to-b from-stone-700 to-stone-800" :
                      template.special === "playful" ? "bg-gradient-to-r from-violet-500 via-pink-500 to-orange-400" :
                      template.special === "nature" ? "bg-gradient-to-br from-green-500 to-emerald-600" :
                      template.special === "midnight" ? "bg-gradient-to-b from-indigo-800 to-slate-900" :
                      "bg-gray-300"
                    }`} />
                  )}
                </div>
                <div className="flex justify-center -mt-8">
                  {form.logo ? (
                    <img src={form.logo} alt="" className="w-16 h-16 object-cover shadow-xl rounded-full border-4 border-white" />
                  ) : (
                    <div className={`w-16 h-16 ${template.accent} flex items-center justify-center shadow-xl rounded-full border-4 border-white`}>
                      <span className={`text-xl font-bold ${template.text}`}>{form.name?.charAt(0)?.toUpperCase() || "?"}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {template.category !== "premium" && (
              <div className="text-center px-4 pt-12 mb-5">
                {form.logo ? (
                  <img src={form.logo} alt="" className={`w-16 h-16 mx-auto mb-2 object-cover shadow-lg ${template.special === "brutalist" ? "border-4 border-black" : "rounded-full border-2 border-white/20"}`} />
                ) : (
                  <div className={`w-16 h-16 mx-auto mb-2 ${template.accent} flex items-center justify-center shadow-lg ${template.special === "brutalist" ? "border-4 border-black" : "rounded-full"}`}>
                    <span className={`text-xl font-bold ${template.text}`}>{form.name?.charAt(0)?.toUpperCase() || "?"}</span>
                  </div>
                )}
                <h2 className={`text-base font-bold ${template.text}`}>{form.name || "Ta boutique"}</h2>
                <p className={`text-[10px] ${template.text} opacity-50`}>@{form.slug || "tonlien"}</p>
                
                {/* Bio */}
                {form.bio && (
                  <p className={`text-[9px] ${template.text} opacity-70 mt-2 px-2 line-clamp-3`}>{form.bio}</p>
                )}
                
                {/* Réseaux sociaux */}
                {(form.socials?.instagram || form.socials?.youtube || form.socials?.tiktok || form.socials?.website) && (
                  <div className="flex items-center justify-center gap-2 mt-3">
                    {form.socials?.instagram && (
                      <div className={`w-6 h-6 rounded-full ${template.accent} flex items-center justify-center`}>
                        <Instagram className={`w-3 h-3 ${template.text} opacity-70`} />
                      </div>
                    )}
                    {form.socials?.youtube && (
                      <div className={`w-6 h-6 rounded-full ${template.accent} flex items-center justify-center`}>
                        <Youtube className={`w-3 h-3 ${template.text} opacity-70`} />
                      </div>
                    )}
                    {form.socials?.tiktok && (
                      <div className={`w-6 h-6 rounded-full ${template.accent} flex items-center justify-center`}>
                        <span className={`text-[10px] ${template.text} opacity-70`}>♪</span>
                      </div>
                    )}
                    {form.socials?.website && (
                      <div className={`w-6 h-6 rounded-full ${template.accent} flex items-center justify-center`}>
                        <Globe className={`w-3 h-3 ${template.text} opacity-70`} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {template.category === "premium" && (
              <div className="text-center px-4 mt-2 mb-4">
                <h2 className={`text-base font-bold ${template.text}`}>{form.name || "Ta boutique"}</h2>
                <p className={`text-[10px] ${template.text} opacity-50`}>@{form.slug || "tonlien"}</p>
                
                {/* Bio */}
                {form.bio && (
                  <p className={`text-[9px] ${template.text} opacity-70 mt-2 px-2 line-clamp-3`}>{form.bio}</p>
                )}
                
                {/* Réseaux sociaux */}
                {(form.socials?.instagram || form.socials?.youtube || form.socials?.tiktok || form.socials?.website) && (
                  <div className="flex items-center justify-center gap-2 mt-3">
                    {form.socials?.instagram && (
                      <div className={`w-6 h-6 rounded-full ${template.accent} flex items-center justify-center`}>
                        <Instagram className={`w-3 h-3 ${template.text} opacity-70`} />
                      </div>
                    )}
                    {form.socials?.youtube && (
                      <div className={`w-6 h-6 rounded-full ${template.accent} flex items-center justify-center`}>
                        <Youtube className={`w-3 h-3 ${template.text} opacity-70`} />
                      </div>
                    )}
                    {form.socials?.tiktok && (
                      <div className={`w-6 h-6 rounded-full ${template.accent} flex items-center justify-center`}>
                        <span className={`text-[10px] ${template.text} opacity-70`}>♪</span>
                      </div>
                    )}
                    {form.socials?.website && (
                      <div className={`w-6 h-6 rounded-full ${template.accent} flex items-center justify-center`}>
                        <Globe className={`w-3 h-3 ${template.text} opacity-70`} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="px-4 pb-4 space-y-2">
              {displayProducts.length > 0 ? (
                displayProducts.map((product, i) => (
                  <div key={product._id || i} className={`${template.card} ${template.special === "brutalist" ? "border-2 border-black" : "rounded-xl"} p-2.5 flex gap-2.5 shadow-sm`}>
                    <div className={`w-10 h-12 overflow-hidden flex-shrink-0 ${template.special === "brutalist" ? "border-2 border-black" : "rounded-lg"}`}>
                      {product.cover ? <img src={product.cover} alt="" className="w-full h-full object-cover" /> : <div className={`w-full h-full ${template.accent} flex items-center justify-center`}><Package className={`w-4 h-4 ${template.text} opacity-40`} /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[10px] font-semibold ${template.text} truncate`}>{product.title}</p>
                      <p className={`text-[8px] ${template.text} opacity-50 truncate`}>{product.description?.replace(/<[^>]*>/g, '').slice(0, 40) || "eBook PDF"}{product.description?.replace(/<[^>]*>/g, '').length > 40 ? "..." : ""}</p>
                      <p className={`text-[11px] font-bold mt-1 ${template.text}`}>{product.checkoutType === "free" ? "Gratuit" : `${product.price?.toLocaleString()} ${currency.symbol}`}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`${template.card} ${template.special === "brutalist" ? "border-2 border-black" : "rounded-xl"} p-4 text-center`}>
                  <Package className={`w-6 h-6 ${template.text} opacity-30 mx-auto mb-1`} />
                  <p className={`text-[9px] ${template.text} opacity-50`}>Aucun produit</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Fetcher optimisé
const fetcher = (url) => fetch(url, { 
  credentials: "include",
  cache: "no-store", 
  headers: { "Content-Type": "application/json" }
}).then(r => r.ok ? r.json() : null);

// ============================================
// MAIN COMPONENT
// ============================================

export default function BoutiquePage() {
  const { data: shopData, isLoading: loadingShop, mutate: mutateShop } = useSWR("/api/smart-shop/boutique", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  });
  const { data: productsData, isLoading: loadingProducts, mutate: mutateProducts } = useSWR("/api/smart-shop/produits", fetcher, {
    revalidateOnFocus: true,
    revalidateOnMount: true,
    dedupingInterval: 0,
  });

  const loading = loadingShop || loadingProducts;
  const shop = shopData?.shop || null;
  const products = (productsData?.products || []).filter(p => !p._id.startsWith("projet_"));
  const isNewShop = !loadingShop && !shop;

  const searchParams = useSearchParams();

  const { balance, requireCredits, showModal, setShowModal, modalAction, mutateBalance } = useCredits();

  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");
  const showInfo = (msg) => setInfoMessage(msg);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "profil");
  const [isMobile, setIsMobile] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  const [form, setForm] = useState({
    name: "", slug: "", bio: "", logo: "", banner: "", template: "neon", currency: "XOF",
    socials: { instagram: "", tiktok: "", twitter: "", youtube: "", website: "" },
    paymentInfo: { method: "wave", phoneNumber: "" },
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    description: "", price: "", comparePrice: "", cover: "",
    checkoutType: "checkout", whatsappNumber: "", whatsappMessage: "Bonjour, je suis intéressé par : {product}",
    externalLink: "", buttonText: "Récupérer mon guide",
    fomo: "", faqs: [], testimonials: []
  });
  const [savingProduct, setSavingProduct] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [activeEditTab, setActiveEditTab] = useState("general");
  const coverInputRef = useRef(null);

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingShopCover, setUploadingShopCover] = useState(false);
  const shopCoverInputRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (shop) {
      setForm({
        name: shop.name || "", slug: shop.slug || "", bio: shop.bio || "",
        logo: shop.logo || "", banner: shop.banner || "", template: shop.theme?.style || "neon",
        currency: shop.currency || "XOF", socials: shop.socials || {},
        paymentInfo: shop.paymentInfo || { method: "wave", phoneNumber: "" },
      });
    }
  }, [shop]);

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "avatar");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success && data.url) setForm(prev => ({ ...prev, logo: data.url }));
    } catch (error) { console.error("Erreur upload:", error); }
    finally { setUploadingLogo(false); }
  };

  const handleShopCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingShopCover(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "cover");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success && data.url) setForm(prev => ({ ...prev, banner: data.url }));
    } catch (error) { console.error("Erreur upload:", error); }
    finally { setUploadingShopCover(false); }
  };

  const saveShop = async () => {
    if (!form.name || !form.slug) { showInfo("Nom et lien requis"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/smart-shop/boutique", {
        method: shop ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name, slug: form.slug, bio: form.bio, logo: form.logo, banner: form.banner,
          theme: { style: form.template }, currency: form.currency, socials: form.socials, paymentInfo: form.paymentInfo,
        }),
      });
      const data = await res.json();
      if (data.success) { mutateShop(); }
      else showInfo(data.error || "Erreur");
    } catch { showInfo("Erreur réseau"); }
    finally { setSaving(false); }
  };

  const publishShop = () => {
    if (!shop) { showInfo("Sauvegarde ta boutique d'abord."); return; }
    if (shop.isPublished) { showInfo("Ta boutique est déjà publiée !"); return; }
    requireCredits("smart_shop", doPublishShop);
  };

  const doPublishShop = async () => {
    setPublishing(true);
    try {
      const res = await fetch("/api/smart-shop/boutique", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "publish" }),
      });
      const data = await res.json();
      if (data.success) { mutateShop(); mutateBalance(); }
      else if (data.insufficientCredits) { setShowModal(true); }
      else showInfo(data.error || "Erreur");
    } catch { showInfo("Erreur réseau"); }
    finally { setPublishing(false); }
  };

  const copyLink = () => {
    if (shop?.slug) {
      navigator.clipboard.writeText(`${window.location.origin}/shop/${shop.slug}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleProductActive = async (product) => {
    const currentStatus = product.isActive !== false;
    const newStatus = !currentStatus;
    
    mutateProducts(
      (data) => ({
        ...data,
        products: data.products.map(p => 
          p._id === product._id ? { ...p, isActive: newStatus } : p
        )
      }),
      false
    );
    
    try {
      await fetch(`/api/smart-shop/produits/${product._id}`, {
        method: "PUT", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus })
      });
    } catch (error) {
      mutateProducts();
    }
  };

  const openProductEdit = (product) => {
    setEditingProduct(product);
    setProductForm({
      description: product.description || "",
      price: product.price?.toString() || "2000",
      comparePrice: product.comparePrice?.toString() || "",
      cover: product.cover || "",
      checkoutType: product.checkoutType || "checkout",
      whatsappNumber: product.whatsappNumber || "",
      whatsappMessage: product.whatsappMessage || "Bonjour, je suis intéressé par : {product}",
      externalLink: product.externalLink || "",
      buttonText: product.buttonText || "Récupérer mon guide",
      fomo: product.fomo?.toString() || "",
      faqs: product.faqs || [],
      testimonials: product.testimonials || []
    });
    setActiveEditTab("general");
  };

  const closeProductEdit = () => {
    setEditingProduct(null);
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "cover");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success && data.url) setProductForm(prev => ({ ...prev, cover: data.url }));
    } catch (error) { console.error("Erreur upload:", error); }
    finally { setUploadingCover(false); }
  };

  const addFaq = () => {
    setProductForm(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }]
    }));
  };

  const updateFaq = (index, field, value) => {
    setProductForm(prev => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) => i === index ? { ...faq, [field]: value } : faq)
    }));
  };

  const removeFaq = (index) => {
    setProductForm(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  const addTestimonial = () => {
    setProductForm(prev => ({
      ...prev,
      testimonials: [...prev.testimonials, { name: "", text: "", rating: 5 }]
    }));
  };

  const updateTestimonial = (index, field, value) => {
    setProductForm(prev => ({
      ...prev,
      testimonials: prev.testimonials.map((t, i) => i === index ? { ...t, [field]: value } : t)
    }));
  };

  const removeTestimonial = (index) => {
    setProductForm(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== index)
    }));
  };

  const saveProduct = async () => {
    if (!editingProduct) return;
    const price = parseInt(productForm.price) || 0;
    const comparePrice = productForm.comparePrice ? parseInt(productForm.comparePrice) : null;
    const fomo = productForm.fomo ? parseInt(productForm.fomo) : null;
    
    if (productForm.checkoutType !== "free" && price < 100) { showInfo("Minimum 100 FCFA"); return; }
    if (comparePrice && comparePrice <= price) { showInfo("Le prix barré doit être supérieur"); return; }
    if (productForm.checkoutType === "whatsapp" && !productForm.whatsappNumber) { showInfo("Numéro WhatsApp requis"); return; }
    if (productForm.checkoutType === "link" && !productForm.externalLink) { showInfo("Lien externe requis"); return; }

    const faqs = productForm.faqs.filter(f => f.question.trim() && f.answer.trim());
    const testimonials = productForm.testimonials.filter(t => t.name.trim() && t.text.trim());

    setSavingProduct(true);
    try {
      const res = await fetch(`/api/smart-shop/produits/${editingProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: productForm.description,
          price: productForm.checkoutType === "free" ? 0 : price,
          comparePrice,
          cover: productForm.cover,
          checkoutType: productForm.checkoutType,
          whatsappNumber: productForm.whatsappNumber,
          whatsappMessage: productForm.whatsappMessage,
          externalLink: productForm.externalLink,
          buttonText: productForm.buttonText,
          fomo,
          faqs,
          testimonials
        })
      });
      const data = await res.json();
      if (data.success && data.product) {
        mutateProducts();
        closeProductEdit();
      } else { showInfo(data.error || "Erreur"); }
    } catch (error) { showInfo("Erreur réseau"); }
    finally { setSavingProduct(false); }
  };

  const getCheckoutColor = (type) => {
    switch(type) {
      case "whatsapp": return "bg-gray-700";
      case "link": return "bg-gray-600";
      case "free": return "bg-emerald-600";
      case "checkout": return "bg-gray-400";
      default: return "bg-gray-500";
    }
  };

  // Navigation entre onglets
  const goToNextTab = () => {
    if (activeTab === "profil") setActiveTab("design");
    else if (activeTab === "design") setActiveTab("produits");
  };

  const goToPrevTab = () => {
    if (activeTab === "produits") setActiveTab("design");
    else if (activeTab === "design") setActiveTab("profil");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const tabs = [
    { id: "profil", label: "Profil", icon: Store },
    { id: "design", label: "Design", icon: Palette },
    { id: "produits", label: "Produits", icon: Package },
  ];

  const editTabs = [
    { id: "general", label: "Général", icon: Package },
    { id: "page", label: "Page produit", icon: Eye },
  ];

  const classicTemplates = templates.filter(t => t.category === "classic");
  const modernTemplates = templates.filter(t => t.category === "modern");
  const premiumTemplates = templates.filter(t => t.category === "premium");

  const currentTabIndex = tabs.findIndex(t => t.id === activeTab);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <InsufficientCreditsModal
        open={showModal}
        onClose={() => setShowModal(false)}
        action={modalAction}
        balance={balance}
      />
      <InfoModal message={infoMessage} onClose={() => setInfoMessage("")} />
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        
        {/* HEADER - Plus compact sur mobile */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Ma Boutique</h1>
            {shop?.slug && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs sm:text-sm text-gray-500 truncate">bookzy.io/shop/{shop.slug}</span>
                <button onClick={copyLink} className="p-1 hover:bg-gray-100 rounded flex-shrink-0">
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {shop?.slug && shop?.isPublished && (
              <Link href={`/shop/${shop.slug}`} target="_blank" className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white rounded-lg border border-gray-200">
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">Voir</span>
                <span className="sm:hidden">Voir</span>
              </Link>
            )}
            {shop && !shop.isPublished && (
              <button onClick={publishShop} disabled={publishing} className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50">
                {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>Publier (5 cr.)</span>
              </button>
            )}
            {shop?.isPublished && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200">
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Publiée</span>
              </span>
            )}
            <button onClick={saveShop} disabled={saving} className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>{isNewShop ? "Créer" : "Sauver"}</span>
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* LEFT SIDE - FORM */}
          <div className="flex-1 min-w-0">
            {/* TABS - Plus compact sur mobile */}
            <div className="flex gap-1 mb-4 sm:mb-6 bg-white p-1 rounded-xl border border-gray-200">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex-1 ${activeTab === tab.id ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}>
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
              
              {/* PROFIL TAB - Compact */}
              {activeTab === "profil" && (
                <div className="space-y-4">
                  {/* Logo upload */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      {form.logo ? <img src={form.logo} alt="" className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover" /> : <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-100 flex items-center justify-center"><Store className="w-6 h-6 text-gray-400" /></div>}
                      <label className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 bg-gray-900 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-800">
                        {uploadingLogo ? <Loader2 className="w-3 h-3 text-white animate-spin" /> : <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />}
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" disabled={uploadingLogo} />
                      </label>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm">Photo de profil</p>
                      <p className="text-xs text-gray-500">JPG, PNG. Max 2MB</p>
                    </div>
                  </div>

                  {/* Nom et Lien - Stack sur mobile */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la boutique</label>
                      <input type="text" value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} placeholder="Ma Boutique" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lien unique</label>
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                        <span className="text-xs text-gray-400 pl-3 pr-1 flex-shrink-0 bg-gray-50 py-2.5 border-r border-gray-200">bookzy.io/</span>
                        <input type="text" value={form.slug} onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))} placeholder="maboutique" className="flex-1 px-3 py-2.5 focus:outline-none text-sm min-w-0" />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description courte</label>
                    <textarea value={form.bio} onChange={(e) => setForm(prev => ({ ...prev, bio: e.target.value }))} placeholder="Décrivez votre boutique..." rows={2} maxLength={300} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none resize-none text-sm" />
                  </div>

                  {/* Réseaux sociaux */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Réseaux sociaux</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl">
                        <Instagram className="w-4 h-4 text-pink-500 flex-shrink-0" />
                        <input type="text" value={form.socials?.instagram || ""} onChange={(e) => setForm(prev => ({ ...prev, socials: { ...prev.socials, instagram: e.target.value } }))} placeholder="Instagram" className="flex-1 focus:outline-none text-sm min-w-0" />
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl">
                        <Youtube className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <input type="text" value={form.socials?.youtube || ""} onChange={(e) => setForm(prev => ({ ...prev, socials: { ...prev.socials, youtube: e.target.value } }))} placeholder="YouTube" className="flex-1 focus:outline-none text-sm min-w-0" />
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl">
                        <span className="text-sm flex-shrink-0">🎵</span>
                        <input type="text" value={form.socials?.tiktok || ""} onChange={(e) => setForm(prev => ({ ...prev, socials: { ...prev.socials, tiktok: e.target.value } }))} placeholder="TikTok" className="flex-1 focus:outline-none text-sm min-w-0" />
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl">
                        <Globe className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <input type="text" value={form.socials?.website || ""} onChange={(e) => setForm(prev => ({ ...prev, socials: { ...prev.socials, website: e.target.value } }))} placeholder="Site web" className="flex-1 focus:outline-none text-sm min-w-0" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* DESIGN TAB */}
              {activeTab === "design" && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">Choisis ton style</label>
                    <div className="flex items-center gap-1 text-xs text-fuchsia-600 bg-fuchsia-50 px-2 py-1 rounded-full">
                      4 nouveaux
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-medium">Classiques</p>
                    <div className="grid grid-cols-4 gap-2 sm:gap-3">
                      {classicTemplates.map(t => (
                        <button key={t.id} onClick={() => setForm(prev => ({ ...prev, template: t.id }))} className={`relative rounded-xl overflow-hidden border-2 transition-all ${form.template === t.id ? "border-gray-900 ring-2 ring-gray-900/20" : "border-gray-200 hover:border-gray-300"}`}>
                          <div className={`h-14 sm:h-20 ${t.bg} p-2 sm:p-3`}>
                            <div className={`w-4 h-4 sm:w-6 sm:h-6 rounded-full ${t.accent} mx-auto mb-1`} />
                            <div className={`h-1 w-6 sm:w-10 ${t.accent} rounded mx-auto`} />
                          </div>
                          <div className="p-1.5 sm:p-2 bg-white text-center border-t"><span className="text-[10px] sm:text-xs font-medium text-gray-900">{t.name}</span></div>
                          {form.template === t.id && <div className="absolute top-1 right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gray-900 rounded-full flex items-center justify-center"><Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" /></div>}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-medium">Modernes</p>
                    <div className="grid grid-cols-4 gap-2 sm:gap-3">
                      {modernTemplates.map(t => (
                        <button key={t.id} onClick={() => setForm(prev => ({ ...prev, template: t.id }))} className={`relative rounded-xl overflow-hidden border-2 transition-all ${form.template === t.id ? "border-gray-900 ring-2 ring-gray-900/20" : "border-gray-200 hover:border-gray-300"}`}>
                          {t.isNew && <div className="absolute top-0.5 left-0.5 z-10 px-1 py-0.5 bg-fuchsia-500 text-white text-[7px] sm:text-[8px] font-bold rounded">NEW</div>}
                          <div className={`h-14 sm:h-20 ${t.bg} p-2 sm:p-3 relative overflow-hidden`}>
                            <div className={`w-4 h-4 sm:w-6 sm:h-6 mx-auto mb-1 relative z-10 ${t.accent} ${t.special === "brutalist" ? "border-2 border-black" : "rounded-full"}`} />
                            <div className={`h-1 w-6 sm:w-10 mx-auto relative z-10 ${t.accent} ${t.special === "brutalist" ? "" : "rounded"}`} />
                          </div>
                          <div className="p-1.5 sm:p-2 bg-white text-center border-t"><span className="text-[10px] sm:text-xs font-medium text-gray-900">{t.name}</span></div>
                          {form.template === t.id && <div className="absolute top-1 right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gray-900 rounded-full flex items-center justify-center z-20"><Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" /></div>}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-medium flex items-center gap-1">Premium <span className="text-amber-500">★</span></p>
                    <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
                      {premiumTemplates.map(t => (
                        <button key={t.id} onClick={() => setForm(prev => ({ ...prev, template: t.id }))} className={`relative rounded-xl overflow-hidden border-2 transition-all ${form.template === t.id ? "border-gray-900 ring-2 ring-gray-900/20" : "border-gray-200 hover:border-gray-300"}`}>
                          {t.isNew && <div className="absolute top-0.5 left-0.5 z-10 px-1 py-0.5 bg-amber-500 text-white text-[7px] font-bold rounded">NEW</div>}
                          <div className={`h-12 sm:h-20 ${t.bg} p-2 relative overflow-hidden`}>
                            <div className={`w-3 h-3 sm:w-6 sm:h-6 mx-auto mb-1 relative z-10 ${t.accent} rounded-full`} />
                          </div>
                          <div className="p-1 sm:p-2 bg-white text-center border-t"><span className="text-[9px] sm:text-xs font-medium text-gray-900">{t.name}</span></div>
                          {form.template === t.id && <div className="absolute top-1 right-1 w-4 h-4 bg-gray-900 rounded-full flex items-center justify-center z-20"><Check className="w-2.5 h-2.5 text-white" /></div>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {["love", "elegant", "playful", "nature", "midnight"].includes(form.template) && (
                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Image de couverture</p>
                          <p className="text-xs text-gray-500">En haut de ta boutique</p>
                        </div>
                        <input ref={shopCoverInputRef} type="file" accept="image/*" onChange={handleShopCoverUpload} className="hidden" />
                        <button onClick={() => shopCoverInputRef.current?.click()} disabled={uploadingShopCover} className="px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center gap-1.5">
                          {uploadingShopCover ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                          {form.banner ? "Changer" : "Ajouter"}
                        </button>
                      </div>
                      {form.banner ? (
                        <div className="relative rounded-xl overflow-hidden">
                          <img src={form.banner} alt="" className="w-full h-24 sm:h-32 object-cover" />
                          <button onClick={() => setForm(prev => ({ ...prev, banner: "" }))} className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div onClick={() => shopCoverInputRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-xl h-24 flex items-center justify-center cursor-pointer hover:border-gray-300 hover:bg-gray-50">
                          <div className="text-center">
                            <Image className="w-6 h-6 text-gray-300 mx-auto mb-1" />
                            <p className="text-xs text-gray-400">Clique pour ajouter</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* PRODUITS TAB */}
              {activeTab === "produits" && (
                <div className="space-y-3">
                  <p className="text-xs sm:text-sm text-gray-500 mb-3">Configure chaque produit : couverture, description, prix et mode de vente.</p>
                  
                  {/* Boutons d'ajout */}
                  <div className="flex gap-2 mb-4">
                    <Link 
                      href="/dashboard/smart-shop/produits" 
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl text-sm transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter un existant
                    </Link>
                    <Link 
                      href="/dashboard/projets/nouveau" 
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl text-sm transition-colors"
                    >
                      Créer un ebook
                    </Link>
                  </div>

                  {products.length === 0 ? (
                    <div className="text-center py-8 sm:py-12 border border-dashed border-gray-200 rounded-xl">
                      <Package className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">Aucun produit dans votre boutique</p>
                      <p className="text-gray-400 text-xs mt-1">Ajoutez un ebook existant ou créez-en un nouveau</p>
                    </div>
                  ) : (
                    <div className="space-y-2 sm:space-y-3">
                      {products.map(product => (
                        <div key={product._id} className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl border transition-all ${product.isActive !== false ? "bg-white border-gray-200" : "bg-gray-50 border-gray-100 opacity-60"}`}>
                          <div className="w-12 h-16 sm:w-14 sm:h-18 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {product.cover ? <img src={product.cover} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Package className="w-5 h-5 text-gray-300" /></div>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate text-sm">{product.title}</h4>
                            <p className="text-xs text-gray-500 truncate">{product.description?.replace(/<[^>]*>/g, '') || "Pas de description"}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs sm:text-sm font-semibold text-gray-900">{product.checkoutType === "free" ? "Gratuit" : `${product.price?.toLocaleString()} FCFA`}</span>
                              <span className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full text-white ${getCheckoutColor(product.checkoutType || "checkout")}`}>{checkoutOptions.find(o => o.id === (product.checkoutType || "checkout"))?.label}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                            {product.isActive !== false && <button onClick={() => openProductEdit(product)} className="p-1.5 sm:p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"><Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></button>}
                            <button onClick={() => toggleProductActive(product)} className={`relative w-9 h-5 sm:w-11 sm:h-6 rounded-full transition-colors ${product.isActive !== false ? "bg-emerald-500" : "bg-gray-300"}`}>
                              <span className={`absolute top-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow transition-all ${product.isActive !== false ? "left-4 sm:left-5" : "left-0.5"}`} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* NAVIGATION MOBILE - Suivant/Retour */}
              <div className="lg:hidden flex gap-3 mt-6 pt-4 border-t border-gray-100">
                {currentTabIndex > 0 && (
                  <button 
                    onClick={goToPrevTab} 
                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl flex items-center justify-center gap-1.5 text-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Retour
                  </button>
                )}
                {currentTabIndex < tabs.length - 1 && (
                  <button 
                    onClick={goToNextTab} 
                    className="flex-1 py-2.5 bg-gray-900 text-white font-medium rounded-xl flex items-center justify-center gap-1.5 text-sm"
                  >
                    Suivant
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
                {currentTabIndex === tabs.length - 1 && (
                  <button 
                    onClick={saveShop}
                    disabled={saving}
                    className="flex-1 py-2.5 bg-gray-900 text-white font-medium rounded-xl flex items-center justify-center gap-1.5 text-sm disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    {isNewShop ? "Créer" : "Enregistrer"}
                  </button>
                )}
              </div>

              {/* PREVIEW MOBILE - sous les boutons */}
              <div className="lg:hidden mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-500 text-center mb-4">Aperçu en direct</p>
                <div className="flex justify-center">
                  <PhonePreview form={form} products={products} currencies={currencies} />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - PREVIEW desktop */}
          {!isMobile && (
            <div className="w-[320px] flex-shrink-0">
              <div className="sticky top-6">
                <p className="text-sm font-medium text-gray-500 text-center mb-4">Aperçu en direct</p>
                <PhonePreview form={form} products={products} currencies={currencies} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PRODUCT EDIT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center" onClick={closeProductEdit}>
          <div className="w-full max-w-2xl bg-white rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{editingProduct.title}</h3>
              <button onClick={closeProductEdit} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5 text-gray-500" /></button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100">
              {editTabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button key={tab.id} onClick={() => setActiveEditTab(tab.id)} className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors ${activeEditTab === tab.id ? "border-gray-900 text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                    <Icon className="w-4 h-4" /> {tab.label}
                  </button>
                );
              })}
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              
              {/* GENERAL TAB */}
              {activeEditTab === "general" && (
                <div className="space-y-4 sm:space-y-5">
                  {/* Cover */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Couverture</label>
                    <div className="flex gap-3 sm:gap-4 items-start">
                      <div className="w-20 h-28 sm:w-24 sm:h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        {productForm.cover ? <img src={productForm.cover} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Image className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300" /></div>}
                      </div>
                      <div className="flex-1">
                        <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                        <button onClick={() => coverInputRef.current?.click()} disabled={uploadingCover} className="w-full py-2 px-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                          {uploadingCover ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                          {uploadingCover ? "Upload..." : "Changer"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <RichTextEditor 
                      value={productForm.description} 
                      onChange={(html) => setProductForm(prev => ({ ...prev, description: html }))}
                      placeholder="Décrivez votre produit..."
                      maxLength={5000}
                    />
                  </div>

                  {/* Price */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prix</label>
                      <div className="relative">
                        <input type="number" value={productForm.price} onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))} className="w-full px-3 py-2.5 pr-14 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none text-sm" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">FCFA</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prix barré</label>
                      <div className="relative">
                        <input type="number" value={productForm.comparePrice} onChange={(e) => setProductForm(prev => ({ ...prev, comparePrice: e.target.value }))} placeholder="Optionnel" className="w-full px-3 py-2.5 pr-14 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none text-sm" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">FCFA</span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mode de vente</label>
                    <div className="grid grid-cols-2 gap-2">
                      {checkoutOptions.map(option => {
                        const Icon = option.icon;
                        const isDisabled = option.disabled;
                        const isSelected = productForm.checkoutType === option.id;
                        
                        return (
                          <button 
                            key={option.id} 
                            onClick={() => !isDisabled && setProductForm(prev => ({ ...prev, checkoutType: option.id }))} 
                            disabled={isDisabled}
                            className={`relative flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl border-2 transition-all ${
                              isDisabled 
                                ? "border-gray-100 bg-gray-50 cursor-not-allowed opacity-60" 
                                : isSelected 
                                  ? "border-gray-900 bg-gray-50" 
                                  : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className={`w-7 h-7 sm:w-8 sm:h-8 ${option.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                            </div>
                            <div className="text-left min-w-0">
                              <p className={`font-medium text-xs sm:text-sm ${isDisabled ? "text-gray-400" : "text-gray-900"}`}>{option.label}</p>
                              <p className={`text-[10px] sm:text-xs ${isDisabled ? "text-gray-400" : "text-gray-500"}`}>{option.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* WhatsApp options */}
                  {productForm.checkoutType === "whatsapp" && (
                    <div className="space-y-3 p-3 sm:p-4 bg-green-50 rounded-xl">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Numéro WhatsApp</label>
                        <input 
                          type="tel" 
                          value={productForm.whatsappNumber} 
                          onChange={(e) => {
                            const cleaned = e.target.value.replace(/[^\d+]/g, '');
                            setProductForm(prev => ({ ...prev, whatsappNumber: cleaned }));
                          }} 
                          placeholder="22507XXXXXXXX" 
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-sm" 
                        />
                        <p className="text-xs text-gray-500 mt-1">Avec indicatif pays</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea value={productForm.whatsappMessage} onChange={(e) => setProductForm(prev => ({ ...prev, whatsappMessage: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-green-500 focus:outline-none resize-none text-sm" />
                      </div>
                    </div>
                  )}

                  {/* Link options */}
                  {productForm.checkoutType === "link" && (
                    <div className="p-3 sm:p-4 bg-gray-50 rounded-xl">
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Lien externe</label>
                      <input type="url" value={productForm.externalLink} onChange={(e) => setProductForm(prev => ({ ...prev, externalLink: e.target.value }))} placeholder="https://..." className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none text-sm" />
                    </div>
                  )}

                  {/* Button Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Texte du bouton</label>
                    <input type="text" value={productForm.buttonText} onChange={(e) => setProductForm(prev => ({ ...prev, buttonText: e.target.value }))} placeholder="Récupérer mon guide" maxLength={30} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none text-sm" />
                  </div>
                </div>
              )}

              {/* PAGE TAB */}
              {activeEditTab === "page" && (
                <div className="space-y-5">
                  {/* FOMO */}
                  <div className="p-3 sm:p-4 bg-orange-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <label className="text-sm font-medium text-gray-900">FOMO</label>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">Affiche "🔥 X personnes ont téléchargé/acheté"</p>
                    <input 
                      type="number" 
                      value={productForm.fomo} 
                      onChange={(e) => setProductForm(prev => ({ ...prev, fomo: e.target.value }))} 
                      placeholder="Ex: 47" 
                      className="w-full px-3 py-2 border border-orange-200 rounded-xl focus:border-orange-400 focus:outline-none bg-white text-sm"
                    />
                  </div>

                  {/* FAQ */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-blue-500" />
                        <label className="text-sm font-medium text-gray-900">FAQ</label>
                      </div>
                      <button onClick={addFaq} className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                        <Plus className="w-3.5 h-3.5" /> Ajouter
                      </button>
                    </div>
                    
                    {productForm.faqs.length === 0 ? (
                      <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl">
                        <p className="text-xs text-gray-500">Aucune FAQ</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {productForm.faqs.map((faq, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-xl">
                            <div className="flex gap-2 mb-2">
                              <input type="text" value={faq.question} onChange={(e) => updateFaq(index, "question", e.target.value)} placeholder="Question..." className="flex-1 px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm" />
                              <button onClick={() => removeFaq(index)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                            </div>
                            <textarea value={faq.answer} onChange={(e) => updateFaq(index, "answer", e.target.value)} placeholder="Réponse..." rows={2} className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm resize-none" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Testimonials */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-purple-500" />
                        <label className="text-sm font-medium text-gray-900">Témoignages</label>
                      </div>
                      <button onClick={addTestimonial} className="flex items-center gap-1 text-xs text-purple-600 font-medium">
                        <Plus className="w-3.5 h-3.5" /> Ajouter
                      </button>
                    </div>
                    
                    {productForm.testimonials.length === 0 ? (
                      <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl">
                        <p className="text-xs text-gray-500">Aucun témoignage</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {productForm.testimonials.map((testimonial, index) => (
                          <div key={index} className="p-3 bg-purple-50 rounded-xl">
                            <div className="flex gap-2 mb-2">
                              <input type="text" value={testimonial.name} onChange={(e) => updateTestimonial(index, "name", e.target.value)} placeholder="Nom..." className="flex-1 px-2.5 py-1.5 border border-purple-200 rounded-lg text-sm" />
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <button key={star} onClick={() => updateTestimonial(index, "rating", star)} className={`${testimonial.rating >= star ? "text-yellow-400" : "text-gray-300"}`}>
                                    <Star className="w-3.5 h-3.5 fill-current" />
                                  </button>
                                ))}
                              </div>
                              <button onClick={() => removeTestimonial(index)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                            </div>
                            <textarea value={testimonial.text} onChange={(e) => updateTestimonial(index, "text", e.target.value)} placeholder="Témoignage..." rows={2} className="w-full px-2.5 py-1.5 border border-purple-200 rounded-lg text-sm resize-none" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-4 sm:p-5 border-t border-gray-100">
              <button onClick={closeProductEdit} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 text-sm">Annuler</button>
              <button onClick={saveProduct} disabled={savingProduct} className="flex-1 py-2.5 bg-gray-900 text-white font-medium rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                {savingProduct ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}