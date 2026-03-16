"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft, Zap, Download, Star, ChevronDown, ChevronLeft, ChevronRight,
  Flame, Check, ShoppingBag, MessageCircle,
  X, Loader2, Mail, Smartphone, Clock, FileText, Heart, Leaf, Quote, Package, Shield
} from "lucide-react";

const currencies = { XOF: "FCFA", XAF: "FCFA", EUR: "€", USD: "$", GBP: "£" };
const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`;

// ── MODAL LEAD ────────────────────────────────────────────────────────────────
function LeadCaptureModal({ isOpen, onClose, onSubmit, isLoading, productTitle, isFree }) {
  const [contact, setContact] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault(); setError("");
    const trimmed = contact.trim();
    if (!trimmed) { setError("Ce champ est requis"); return; }
    const isEmail = trimmed.includes("@") && trimmed.includes(".");
    const digitsOnly = trimmed.replace(/[^\d]/g, "");
    const isPhone = digitsOnly.length >= 10;
    if (!isEmail && !isPhone) { setError("Entre un email valide ou un numéro avec indicatif"); return; }
    if (!isEmail && isPhone && !trimmed.startsWith("+") && digitsOnly.length < 11) { setError("Ajoute l'indicatif pays"); return; }
    onSubmit(trimmed);
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="w-full sm:max-w-md bg-white sm:rounded-2xl rounded-t-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="font-black text-slate-900 text-sm">{isFree ? "Recevoir gratuitement" : "Finaliser ma commande"}</h3>
            <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[220px]">{productTitle}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"><X className="w-4 h-4 text-slate-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5">
          <p className="text-sm text-slate-500 mb-4">Entre ton email ou ton numéro WhatsApp pour recevoir le lien.</p>
          <div className="mb-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="email@exemple.com ou +22507XXXXXXXX"
                className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none transition-colors ${error ? "border-red-300 bg-red-50" : "border-slate-200 focus:border-slate-900"}`} autoFocus />
            </div>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          </div>
          <button type="submit" disabled={isLoading}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> {isFree ? "Recevoir gratuitement" : "Confirmer"}</>}
          </button>
          <p className="text-center text-[10px] text-slate-400 mt-3">Aucun spam. Livraison immédiate.</p>
        </form>
      </div>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 01 — CLEAN
// Layout : Editorial magazine. Cover à gauche, contenu à droite en sticky.
// Fond #F5F2ED grain. Typographie condensée. Sections séparées par filets.
// ══════════════════════════════════════════════════════════════════════════════
function CleanTemplate({ shop, product, username, onCTAClick, isFree, currencySymbol, hasDiscount, discountPercent }) {
  const [openFaq, setOpenFaq] = useState(null);
  return (
    <div className="min-h-screen font-sans" style={{ background: "#F5F2ED" }}>
      <div className="fixed inset-0 opacity-[0.035] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#F5F2ED]/90 backdrop-blur-md border-b border-[#C8BFB0]">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href={`/shop/${username}`} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> {shop.name}
          </Link>
          {shop.logo && <img src={shop.logo} alt="" className="w-7 h-7 rounded-full object-cover border border-[#C8BFB0]" />}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-10 relative z-10">
        <div className="grid lg:grid-cols-5 gap-10">

          {/* Colonne gauche — sticky */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24 space-y-5">
              {/* Cover */}
              <div className="relative">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-[#C8BFB0] shadow-md bg-[#EDE8E0]">
                  {product.cover ? <img src={product.cover} alt={product.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><FileText className="w-12 h-12 text-slate-300" /></div>}
                </div>
                {hasDiscount && <div className="absolute top-3 right-3 bg-slate-900 text-white px-2.5 py-1 rounded-full text-[10px] font-black">-{discountPercent}%</div>}
              </div>

              {/* Prix + CTA */}
              <div className="bg-white border border-[#C8BFB0] rounded-2xl p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">{shop.name}</p>
                <div className="flex items-baseline gap-2 mb-4">
                  {hasDiscount && <span className="line-through text-sm text-slate-300">{product.comparePrice?.toLocaleString()} {currencySymbol}</span>}
                  <span className="text-3xl font-black text-slate-900">{isFree ? "Gratuit" : `${product.price?.toLocaleString()} ${currencySymbol}`}</span>
                </div>
                {product.testimonials?.length > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}</div>
                    <span className="text-xs text-slate-400">({product.testimonials.length} avis)</span>
                  </div>
                )}
                {product.fomo && <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-4"><Flame className="w-3.5 h-3.5 text-orange-400" /> {product.fomo} {isFree ? "téléchargements" : "achats"}</div>}
                <button onClick={onCTAClick} className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition">
                  {isFree ? <Download className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                  {product.buttonText || (isFree ? "Télécharger" : "Acheter")}
                </button>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {[{ icon: Zap, text: "Instantané" }, { icon: FileText, text: "PDF" }, { icon: Smartphone, text: "Mobile" }].map((f, i) => (
                    <div key={i} className="text-center p-2 bg-[#F5F2ED] rounded-lg">
                      <f.icon className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{f.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Colonne droite — contenu */}
          <div className="lg:col-span-3 space-y-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-slate-900 leading-tight tracking-tight mb-4">{product.title}</h1>
              <div className="w-12 h-1 bg-slate-900 rounded" />
            </div>

            {product.description && (
              <div className="pb-8 border-b border-[#C8BFB0]">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Description</p>
                <div className="prose prose-sm text-slate-600 leading-relaxed [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5 [&_p]:mb-3" dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
            )}

            {product.testimonials?.length > 0 && (
              <div className="pb-8 border-b border-[#C8BFB0]">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-5">Témoignages</p>
                <div className="space-y-4">
                  {product.testimonials.map((t, i) => (
                    <div key={i} className="flex gap-4 p-5 bg-white border border-[#C8BFB0] rounded-xl">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-600 text-sm flex-shrink-0">{t.name[0]}</div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-black text-slate-900 text-sm">{t.name}</span>
                          <div className="flex">{[...Array(t.rating)].map((_, j) => <Star key={j} className="w-3 h-3 text-amber-400 fill-amber-400" />)}</div>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed">"{t.text}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.faqs?.length > 0 && (
              <div className="pb-8">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-5">Questions fréquentes</p>
                <div className="space-y-2">
                  {product.faqs.map((faq, i) => (
                    <div key={i} className={`border rounded-xl overflow-hidden transition-colors ${openFaq === i ? "border-slate-400" : "border-[#C8BFB0]"}`}>
                      <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left">
                        <span className="font-bold text-slate-900 text-sm">{faq.question}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                      </button>
                      {openFaq === i && <div className="px-4 pb-4 text-sm text-slate-500 leading-relaxed">{faq.answer}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button onClick={onCTAClick} className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition">
              {isFree ? <Download className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
              {product.buttonText || (isFree ? "Télécharger gratuitement" : `Acheter — ${product.price?.toLocaleString()} ${currencySymbol}`)}
            </button>
            <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-300">Propulsé par Bookzy</p>
          </div>
        </div>
      </main>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 02 — STONE
// Layout : Cover hero plein écran. Contenu en carte claire qui remonte.
// Fond #EDEBE6 pierre chaude. Accents ardoise + or pâle. Sections épurées.
// ══════════════════════════════════════════════════════════════════════════════
function StoneTemplate({ shop, product, username, onCTAClick, isFree, currencySymbol, hasDiscount, discountPercent }) {
  const [openFaq, setOpenFaq] = useState(null);
  return (
    <div className="min-h-screen font-sans" style={{ background: "#EDEBE6" }}>

      {/* Header flottant transparent */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 h-14">
        <Link href={`/shop/${username}`} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/70 hover:text-white transition-colors drop-shadow-sm">
          <ArrowLeft className="w-3.5 h-3.5" /> {shop.name}
        </Link>
        {shop.logo && <img src={shop.logo} alt="" className="w-7 h-7 rounded-full object-cover ring-1 ring-white/40" />}
      </header>

      {/* Hero cover plein écran */}
      <div className="relative h-[65vh] min-h-[480px] overflow-hidden">
        {product.cover
          ? <img src={product.cover} alt={product.title} className="w-full h-full object-cover object-center" />
          : <div className="w-full h-full bg-[#D8D4CC] flex items-center justify-center"><FileText className="w-20 h-20 text-[#B8B0A4]" /></div>}
        <div className="absolute inset-0 bg-gradient-to-t from-[#EDEBE6] via-[#EDEBE6]/20 to-transparent" />
        {hasDiscount && <div className="absolute top-16 right-5 bg-[#5A4E3A] text-white px-3 py-2 rounded-lg">
          <p className="text-[9px] font-bold uppercase tracking-widest text-white/60">Économisez</p>
          <p className="text-xl font-black">-{discountPercent}%</p>
        </div>}
      </div>

      {/* Contenu qui remonte */}
      <main className="relative z-10 max-w-xl mx-auto px-5 -mt-10 space-y-4 pb-10">

        {/* Titre + infos */}
        <div className="bg-white border border-[#D8D4CC] rounded-2xl p-6 shadow-sm">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#8A8070] mb-2">{shop.name}</p>
          <h1 className="text-2xl font-black text-[#2C2820] leading-tight tracking-tight mb-4">{product.title}</h1>
          {product.testimonials?.length > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-[#8A7A5A] fill-[#8A7A5A]" />)}</div>
              <span className="text-xs text-[#8A8070]">({product.testimonials.length} avis)</span>
            </div>
          )}
          <div className="flex items-baseline gap-2 mb-3">
            {hasDiscount && <span className="line-through text-sm text-[#C0B8A8]">{product.comparePrice?.toLocaleString()} {currencySymbol}</span>}
            <span className="text-3xl font-black text-[#2C2820]">{isFree ? "Gratuit" : `${product.price?.toLocaleString()} ${currencySymbol}`}</span>
          </div>
          {product.fomo && <div className="flex items-center gap-2 text-xs font-bold text-[#8A8070]"><Flame className="w-3.5 h-3.5 text-[#A08060]" /> {product.fomo} {isFree ? "téléchargements" : "achats"}</div>}
        </div>

        {/* CTA */}
        <button onClick={onCTAClick} className="w-full py-4 bg-[#2C2820] hover:bg-[#1C1810] text-white font-black text-[10px] uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 transition shadow-sm">
          {isFree ? <Download className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          {product.buttonText || (isFree ? "Télécharger" : `Acheter — ${product.price?.toLocaleString()} ${currencySymbol}`)}
        </button>

        {/* Garanties */}
        <div className="bg-white border border-[#D8D4CC] rounded-2xl p-5">
          <div className="grid grid-cols-3 gap-3">
            {[{ icon: Zap, text: "Instantané" }, { icon: FileText, text: "PDF premium" }, { icon: Smartphone, text: "Partout" }].map((f, i) => (
              <div key={i} className="text-center p-3 bg-[#F5F2EC] rounded-xl">
                <f.icon className="w-4 h-4 text-[#8A7A5A] mx-auto mb-1.5" />
                <p className="text-[9px] font-bold text-[#8A8070] uppercase tracking-wider">{f.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="bg-white border border-[#D8D4CC] rounded-2xl p-6">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#8A8070] mb-4">À propos</p>
            <div className="prose prose-sm text-[#5A5248] leading-relaxed [&_ul]:list-disc [&_ul]:ml-5 [&_p]:mb-3" dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>
        )}

        {/* Testimonials */}
        {product.testimonials?.length > 0 && (
          <div className="bg-white border border-[#D8D4CC] rounded-2xl p-6">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#8A8070] mb-5">Ce qu'ils disent</p>
            <div className="space-y-5">
              {product.testimonials.map((t, i) => (
                <div key={i} className="border-l-2 border-[#8A7A5A] pl-5">
                  <p className="text-sm text-[#5A5248] italic leading-relaxed mb-3">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#2C2820] flex items-center justify-center text-white font-black text-xs">{t.name[0]}</div>
                    <span className="text-xs font-black text-[#2C2820] uppercase tracking-wider">{t.name}</span>
                    <div className="flex ml-auto">{[...Array(t.rating)].map((_, j) => <Star key={j} className="w-3 h-3 text-[#8A7A5A] fill-[#8A7A5A]" />)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        {product.faqs?.length > 0 && (
          <div className="bg-white border border-[#D8D4CC] rounded-2xl p-6">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#8A8070] mb-5">FAQ</p>
            <div className="divide-y divide-[#F0EDE8]">
              {product.faqs.map((faq, i) => (
                <div key={i}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between py-4 text-left">
                    <span className="font-bold text-[#2C2820] text-sm">{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-[#8A8070] flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && <p className="pb-4 text-sm text-[#7A7068] leading-relaxed">{faq.answer}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={onCTAClick} className="w-full py-4 bg-[#2C2820] hover:bg-[#1C1810] text-white font-black text-[10px] uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 transition">
          {isFree ? <Download className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          {product.buttonText || (isFree ? "Télécharger" : "Acheter")}
        </button>
        <p className="text-center text-[9px] font-bold uppercase tracking-widest text-[#8A8070]/50">Propulsé par Bookzy</p>
      </main>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 03 — BRUTALIST
// Layout : Typographie massive. Pas de cards. Sections délimitées par filets.
// Fond #F5F2ED crème. Rouge vif comme seul accent. Tout dans la structure.
// ══════════════════════════════════════════════════════════════════════════════
function BrutalistTemplate({ shop, product, username, onCTAClick, isFree, currencySymbol, hasDiscount, discountPercent }) {
  const [openFaq, setOpenFaq] = useState(null);
  return (
    <div className="min-h-screen font-sans" style={{ background: "#F5F2ED" }}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#F5F2ED]/95 backdrop-blur-sm border-b-2 border-black">
        <div className="max-w-2xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href={`/shop/${username}`} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-black hover:text-red-600 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> {shop.name}
          </Link>
          {shop.logo && <img src={shop.logo} alt="" className="w-7 h-7 object-cover grayscale" />}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5">

        {/* TITRE MASSIF */}
        <div className="py-10 border-b-2 border-black">
          <p className="text-[9px] font-black uppercase tracking-[0.6em] text-black/30 mb-4">{shop.name}</p>
          <h1 className="font-black text-black uppercase leading-[0.85] tracking-tighter mb-6" style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)" }}>{product.title}</h1>
          <div className="flex flex-wrap items-center gap-6">
            {product.testimonials?.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-black fill-black" />)}</div>
                <span className="text-xs font-black text-black/40 uppercase tracking-wider">({product.testimonials.length})</span>
              </div>
            )}
            {product.fomo && <span className="text-xs font-black text-red-600 uppercase tracking-wider">{product.fomo} {isFree ? "téléchargements" : "achats"}</span>}
          </div>
        </div>

        {/* COVER + PRIX côte à côte */}
        <div className="grid grid-cols-5 gap-0 border-b-2 border-black">
          <div className="col-span-2 border-r-2 border-black">
            <div className="relative aspect-[3/4] overflow-hidden bg-black/5">
              {product.cover
                ? <img src={product.cover} alt={product.title} className="w-full h-full object-cover grayscale-[20%]" />
                : <div className="w-full h-full flex items-center justify-center"><FileText className="w-12 h-12 text-black/20" /></div>}
              {hasDiscount && <div className="absolute top-0 right-0 bg-red-600 text-white px-3 py-2 text-xs font-black">-{discountPercent}%</div>}
            </div>
          </div>
          <div className="col-span-3 p-6 flex flex-col justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.5em] text-black/30 mb-3">Prix</p>
              {hasDiscount && <p className="line-through text-sm text-black/30 font-black">{product.comparePrice?.toLocaleString()} {currencySymbol}</p>}
              <p className="font-black text-black leading-none mb-6" style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)" }}>{isFree ? "Gratuit" : `${product.price?.toLocaleString()} ${currencySymbol}`}</p>
            </div>
            <div className="space-y-2">
              {[{ text: "Accès immédiat" }, { text: "PDF haute qualité" }, { text: "Multi-appareils" }].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black/50">
                  <div className="w-4 h-px bg-black/40" /> {f.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-6 border-b-2 border-black">
          <button onClick={onCTAClick} className="w-full py-5 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest flex items-center justify-center gap-2 transition text-sm">
            {isFree ? <Download className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
            {product.buttonText || (isFree ? "Télécharger maintenant" : `Acheter — ${product.price?.toLocaleString()} ${currencySymbol}`)}
          </button>
        </div>

        {/* Description */}
        {product.description && (
          <div className="py-8 border-b-2 border-black">
            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-black/30 mb-6">Description</p>
            <div className="prose prose-sm text-black/70 leading-loose [&_ul]:list-disc [&_ul]:ml-5 [&_p]:mb-4 [&_strong]:text-black" dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>
        )}

        {/* Testimonials — citations brutes */}
        {product.testimonials?.length > 0 && (
          <div className="py-8 border-b-2 border-black">
            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-black/30 mb-6">Témoignages</p>
            <div className="space-y-6">
              {product.testimonials.map((t, i) => (
                <div key={i} className="flex gap-4">
                  <div className="text-6xl font-black text-black/5 leading-none flex-shrink-0 -mt-2">"</div>
                  <div>
                    <p className="font-bold text-black leading-relaxed mb-2">{t.text}"</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-black/30">— {t.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ — accordéon épuré */}
        {product.faqs?.length > 0 && (
          <div className="py-8 border-b-2 border-black">
            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-black/30 mb-6">FAQ</p>
            {product.faqs.map((faq, i) => (
              <div key={i} className="border-t border-black/10">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between py-4 text-left">
                  <span className="font-black text-black text-sm uppercase tracking-wide">{faq.question}</span>
                  <span className="font-black text-black text-lg ml-4">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && <p className="pb-4 text-sm text-black/60 leading-loose font-medium">{faq.answer}</p>}
              </div>
            ))}
          </div>
        )}

        <div className="py-8">
          <button onClick={onCTAClick} className="w-full py-5 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest flex items-center justify-center gap-2 transition text-sm mb-6">
            {isFree ? <Download className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
            {product.buttonText || (isFree ? "Télécharger" : "Acheter")}
          </button>
          <p className="text-center text-[9px] font-black uppercase tracking-[0.4em] text-black/20">Propulsé par Bookzy</p>
        </div>
      </main>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 04 — NEON
// Layout : Editorial tech glamour. Grille stricte. Cover en pleine hauteur.
// Fond #F8F9FA blanc froid. Noir mat. Lignes fines. Chiffres en mono.
// ══════════════════════════════════════════════════════════════════════════════
function NeonTemplate({ shop, product, username, onCTAClick, isFree, currencySymbol, hasDiscount, discountPercent }) {
  const [openFaq, setOpenFaq] = useState(null);
  return (
    <div className="min-h-screen font-sans" style={{ background: "#F8F9FA" }}>

      {/* Header épuré */}
      <header className="sticky top-0 z-40 bg-[#F8F9FA]/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href={`/shop/${username}`} className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.4em] text-slate-400 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-3 h-3" /> {shop.name}
          </Link>
          {shop.logo && <img src={shop.logo} alt="" className="w-6 h-6 rounded-full object-cover grayscale" />}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6">

        {/* Grid principale — cover pleine hauteur à gauche */}
        <div className="grid lg:grid-cols-2 min-h-[85vh] border-b border-slate-200">

          {/* Cover pleine hauteur */}
          <div className="relative border-r border-slate-200 overflow-hidden" style={{ minHeight: "480px" }}>
            {product.cover
              ? <img src={product.cover} alt={product.title} className="absolute inset-0 w-full h-full object-cover object-center" />
              : <div className="absolute inset-0 bg-slate-100 flex items-center justify-center"><FileText className="w-16 h-16 text-slate-300" /></div>}
            {hasDiscount && (
              <div className="absolute top-6 left-6 bg-slate-900 text-white px-3 py-1.5">
                <p className="text-[9px] font-bold uppercase tracking-widest">Économisez</p>
                <p className="text-xl font-black leading-none">-{discountPercent}%</p>
              </div>
            )}
          </div>

          {/* Contenu droite */}
          <div className="flex flex-col justify-between p-8 lg:p-12">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-slate-400 mb-6">{shop.name}</p>
              <h1 className="text-3xl lg:text-4xl font-black text-slate-900 leading-tight tracking-tight mb-6">{product.title}</h1>

              {product.testimonials?.length > 0 && (
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-200">
                  <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-slate-900 fill-slate-900" />)}</div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">{product.testimonials.length} avis</span>
                </div>
              )}

              <div className="mb-6 pb-6 border-b border-slate-200">
                <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-slate-400 mb-2">Prix</p>
                <div className="flex items-baseline gap-3">
                  {hasDiscount && <span className="line-through text-base text-slate-300 font-mono">{product.comparePrice?.toLocaleString()} {currencySymbol}</span>}
                  <span className="font-black text-slate-900 font-mono" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>{isFree ? "Gratuit" : `${product.price?.toLocaleString()} ${currencySymbol}`}</span>
                </div>
              </div>

              {product.fomo && (
                <div className="flex items-center gap-2 mb-6 pb-6 border-b border-slate-200">
                  <div className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">{product.fomo} {isFree ? "téléchargements" : "achats"}</span>
                </div>
              )}

              <div className="space-y-3 mb-8">
                {[{ text: "Accès immédiat" }, { text: "PDF haute qualité" }, { text: "Multi-appareils" }].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <Check className="w-3.5 h-3.5 text-slate-900 flex-shrink-0" /> {f.text}
                  </div>
                ))}
              </div>
            </div>

            <button onClick={onCTAClick} className="w-full py-5 bg-slate-900 hover:bg-black text-white font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 transition">
              {isFree ? <Download className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
              {product.buttonText || (isFree ? "Télécharger" : `Acheter — ${product.price?.toLocaleString()} ${currencySymbol}`)}
            </button>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="grid lg:grid-cols-2 border-b border-slate-200">
            <div className="border-r border-slate-200 p-8 lg:p-12 flex items-center">
              <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-slate-300">Description</p>
            </div>
            <div className="p-8 lg:p-12">
              <div className="prose prose-sm text-slate-600 leading-loose [&_ul]:list-disc [&_ul]:ml-5 [&_p]:mb-3" dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>
          </div>
        )}

        {/* Testimonials */}
        {product.testimonials?.length > 0 && (
          <div className="border-b border-slate-200">
            <div className="p-8 lg:p-12 border-b border-slate-100">
              <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-slate-300">Témoignages</p>
            </div>
            <div className="divide-y divide-slate-100">
              {product.testimonials.map((t, i) => (
                <div key={i} className="grid lg:grid-cols-2 border-slate-100">
                  <div className="p-8 border-r border-slate-100 flex items-start gap-4">
                    <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white font-black text-xs flex-shrink-0">{t.name[0]}</div>
                    <div>
                      <p className="text-xs font-black text-slate-900 uppercase tracking-wider mb-1">{t.name}</p>
                      <div className="flex">{[...Array(t.rating)].map((_, j) => <Star key={j} className="w-3 h-3 text-slate-900 fill-slate-900" />)}</div>
                    </div>
                  </div>
                  <div className="p-8">
                    <p className="text-sm text-slate-600 leading-loose italic">"{t.text}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        {product.faqs?.length > 0 && (
          <div className="border-b border-slate-200">
            <div className="p-8 border-b border-slate-100">
              <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-slate-300">FAQ</p>
            </div>
            <div className="divide-y divide-slate-100">
              {product.faqs.map((faq, i) => (
                <div key={i}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-8 text-left">
                    <span className="font-bold text-slate-900">{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 ml-4 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && <div className="px-8 pb-8 text-sm text-slate-500 leading-loose">{faq.answer}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-8 lg:p-12">
          <button onClick={onCTAClick} className="w-full py-5 bg-slate-900 hover:bg-black text-white font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 transition mb-4">
            {isFree ? <Download className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            {product.buttonText || (isFree ? "Télécharger gratuitement" : "Acheter")}
          </button>
          <p className="text-center text-[9px] font-bold uppercase tracking-widest text-slate-300">Propulsé par Bookzy</p>
        </div>
      </main>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 05 — LOVE
// Layout : Centré, aéré, émotionnel. Cover grand format centré.
// #FAF6F3 crème rosé. Serif italic pour les titres. Tons rosés doux.
// ══════════════════════════════════════════════════════════════════════════════
function LoveTemplate({ shop, product, username, onCTAClick, isFree, currencySymbol, hasDiscount, discountPercent }) {
  const [openFaq, setOpenFaq] = useState(null);
  return (
    <div className="min-h-screen font-sans" style={{ background: "#FAF6F3" }}>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-rose-100/80 bg-[#FAF6F3]/90 backdrop-blur-md">
        <div className="max-w-2xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href={`/shop/${username}`} className="flex items-center gap-2 text-xs font-semibold text-rose-300 hover:text-rose-500 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> {shop.name}
          </Link>
          {shop.logo && <img src={shop.logo} alt="" className="w-7 h-7 rounded-full object-cover ring-2 ring-rose-100" />}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-12">

        {/* Hero centré */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-8">
            <div className="w-48 h-64 md:w-56 md:h-72 rounded-[32px] overflow-hidden shadow-2xl mx-auto" style={{ boxShadow: "0 25px 60px rgba(200, 100, 100, 0.15)" }}>
              {product.cover
                ? <img src={product.cover} alt={product.title} className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-rose-50 flex items-center justify-center"><Heart className="w-12 h-12 text-rose-200" /></div>}
            </div>
            {hasDiscount && <div className="absolute -top-3 -right-3 bg-rose-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xs font-black shadow-lg">-{discountPercent}%</div>}
          </div>

          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-rose-300 mb-3">{shop.name}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-rose-950 leading-snug mb-5" style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}>{product.title}</h1>

          {product.testimonials?.length > 0 && (
            <div className="flex items-center justify-center gap-2 mb-5">
              <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-rose-300 fill-rose-300" />)}</div>
              <span className="text-sm text-rose-300">({product.testimonials.length} avis)</span>
            </div>
          )}

          <div className="flex items-baseline justify-center gap-3 mb-6">
            {hasDiscount && <span className="line-through text-lg text-rose-200">{product.comparePrice?.toLocaleString()} {currencySymbol}</span>}
            <span className="text-4xl font-bold text-rose-900" style={{ fontFamily: "Georgia, serif" }}>{isFree ? "Gratuit" : `${product.price?.toLocaleString()} ${currencySymbol}`}</span>
          </div>

          {product.fomo && <div className="inline-flex items-center gap-2 text-sm text-rose-400 bg-rose-50 border border-rose-100 px-4 py-2 rounded-full mb-6"><Heart className="w-4 h-4 fill-rose-300" /> {product.fomo} personnes ont adoré</div>}

          <button onClick={onCTAClick} className="w-full max-w-sm mx-auto flex py-4 bg-rose-900 hover:bg-rose-800 text-white font-semibold rounded-2xl items-center justify-center gap-2 transition shadow-lg" style={{ boxShadow: "0 8px 24px rgba(136, 19, 55, 0.2)" }}>
            <Heart className="w-4 h-4" />
            {product.buttonText || (isFree ? "Recevoir gratuitement" : `Obtenir — ${product.price?.toLocaleString()} ${currencySymbol}`)}
          </button>
        </div>

        {/* Garanties */}
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 mb-8">
          <div className="grid grid-cols-3 gap-3">
            {[{ icon: Zap, text: "Accès immédiat" }, { icon: FileText, text: "PDF premium" }, { icon: Smartphone, text: "Partout" }].map((f, i) => (
              <div key={i} className="text-center">
                <f.icon className="w-5 h-5 text-rose-300 mx-auto mb-2" />
                <p className="text-xs text-rose-400 font-medium">{f.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mb-10 pb-10 border-b border-rose-100">
            <h2 className="text-lg font-semibold text-rose-900 mb-4" style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}>À propos</h2>
            <div className="prose prose-sm text-rose-800/70 leading-relaxed [&_ul]:list-disc [&_ul]:ml-5 [&_p]:mb-3" dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>
        )}

        {/* Testimonials */}
        {product.testimonials?.length > 0 && (
          <div className="mb-10 pb-10 border-b border-rose-100">
            <h2 className="text-lg font-semibold text-rose-900 mb-6 text-center" style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}>Ce qu'elles en disent</h2>
            <div className="space-y-5">
              {product.testimonials.map((t, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-rose-50">
                  <p className="text-sm text-rose-800/60 italic leading-relaxed mb-4" style={{ fontFamily: "Georgia, serif" }}>"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 font-bold text-sm">{t.name[0]}</div>
                    <div>
                      <p className="text-xs font-semibold text-rose-800">{t.name}</p>
                      <div className="flex mt-0.5">{[...Array(t.rating)].map((_, j) => <Star key={j} className="w-2.5 h-2.5 text-rose-300 fill-rose-300" />)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        {product.faqs?.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-rose-900 mb-5" style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}>Questions fréquentes</h2>
            <div className="space-y-2">
              {product.faqs.map((faq, i) => (
                <div key={i} className={`bg-white border rounded-2xl overflow-hidden transition-colors ${openFaq === i ? "border-rose-200" : "border-rose-50"}`}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left">
                    <span className="font-medium text-rose-900 text-sm">{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-rose-300 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && <div className="px-4 pb-4 text-sm text-rose-700/60 leading-relaxed">{faq.answer}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={onCTAClick} className="w-full py-4 bg-rose-900 hover:bg-rose-800 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 transition mb-6">
          <Heart className="w-4 h-4" />
          {product.buttonText || (isFree ? "Recevoir gratuitement" : "Obtenir")}
        </button>
        <p className="text-center text-[10px] font-semibold text-rose-200">Propulsé par Bookzy</p>
      </main>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 06 — ELEGANT
// Layout : Like an open book. 2 colonnes. Left = cover + texte courant.
// Right = prix + contenu. Fond ivoire. Serif Georgia. Filets fins or.
// ══════════════════════════════════════════════════════════════════════════════
function ElegantTemplate({ shop, product, username, onCTAClick, isFree, currencySymbol, hasDiscount, discountPercent }) {
  const [openFaq, setOpenFaq] = useState(null);
  return (
    <div className="min-h-screen font-sans" style={{ background: "#FAFAF7" }}>
      {/* Header très discret */}
      <header className="sticky top-0 z-40 bg-[#FAFAF7]/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href={`/shop/${username}`} className="flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.5em] text-stone-400 hover:text-stone-700 transition-colors">
            <ArrowLeft className="w-3 h-3" /> {shop.name}
          </Link>
          {shop.logo && <img src={shop.logo} alt="" className="w-6 h-6 rounded-full object-cover" />}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">

        {/* Titre centré comme un livre */}
        <div className="text-center mb-14 pb-10 border-b border-stone-200">
          <p className="text-[9px] font-medium uppercase tracking-[0.6em] text-stone-300 mb-4">{shop.name}</p>
          <h1 className="text-4xl md:text-5xl text-stone-900 leading-tight mb-4 max-w-2xl mx-auto" style={{ fontFamily: "Georgia, serif" }}>{product.title}</h1>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-16 bg-stone-300" />
            <div className="w-1.5 h-1.5 rounded-full bg-stone-300" />
            <div className="h-px w-16 bg-stone-300" />
          </div>
          {product.testimonials?.length > 0 && (
            <div className="flex items-center justify-center gap-2">
              <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-stone-400 fill-stone-400" />)}</div>
              <span className="text-xs text-stone-400" style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}>{product.testimonials.length} témoignages</span>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-5 gap-16">

          {/* Left — cover + prix */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              <div className="relative mb-6">
                <div className="aspect-[3/4] rounded-sm overflow-hidden shadow-lg border border-stone-200">
                  {product.cover
                    ? <img src={product.cover} alt={product.title} className="w-full h-full object-cover" />
                    : <div className="w-full h-full bg-stone-100 flex items-center justify-center"><FileText className="w-10 h-10 text-stone-300" /></div>}
                </div>
                {hasDiscount && <div className="absolute top-3 right-3 bg-stone-800 text-white px-2 py-0.5 text-[9px] font-medium uppercase tracking-widest">-{discountPercent}%</div>}
              </div>

              <div className="text-center mb-6">
                <p className="text-[9px] font-medium uppercase tracking-[0.5em] text-stone-300 mb-3">Prix</p>
                <div className="flex items-baseline justify-center gap-2 mb-5">
                  {hasDiscount && <span className="line-through text-sm text-stone-300">{product.comparePrice?.toLocaleString()} {currencySymbol}</span>}
                  <span className="text-3xl text-stone-900" style={{ fontFamily: "Georgia, serif" }}>{isFree ? "Gratuit" : `${product.price?.toLocaleString()} ${currencySymbol}`}</span>
                </div>
                {product.fomo && <p className="text-xs text-stone-400 mb-5" style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}>{product.fomo} lecteurs ont déjà acquis cet ouvrage</p>}
              </div>

              <button onClick={onCTAClick} className="w-full py-4 bg-stone-900 hover:bg-stone-800 text-white text-[10px] uppercase tracking-[0.3em] font-medium flex items-center justify-center gap-2 transition rounded-sm mb-4">
                {isFree ? <Download className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                {product.buttonText || (isFree ? "Télécharger" : "Acquérir")}
              </button>

              <div className="border border-stone-200 rounded-sm p-4">
                {[{ icon: Zap, text: "Accès immédiat" }, { icon: FileText, text: "PDF haute qualité" }, { icon: Smartphone, text: "Multi-appareils" }].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 py-2.5 border-b border-stone-100 last:border-0">
                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full flex-shrink-0" />
                    <span className="text-xs text-stone-500" style={{ fontFamily: "Georgia, serif" }}>{f.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — contenu */}
          <div className="lg:col-span-3">
            {product.description && (
              <div className="mb-10 pb-10 border-b border-stone-200">
                <h2 className="text-[9px] font-medium uppercase tracking-[0.5em] text-stone-300 mb-6">Description</h2>
                <div className="prose prose-sm text-stone-600 leading-loose [&_ul]:list-disc [&_ul]:ml-5 [&_p]:mb-4 [&_p]:leading-loose" style={{ fontFamily: "Georgia, serif", fontSize: "15px" }} dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
            )}

            {product.testimonials?.length > 0 && (
              <div className="mb-10 pb-10 border-b border-stone-200">
                <h2 className="text-[9px] font-medium uppercase tracking-[0.5em] text-stone-300 mb-6">Ce que nos lecteurs disent</h2>
                <div className="space-y-6">
                  {product.testimonials.map((t, i) => (
                    <div key={i} className="flex gap-5">
                      <Quote className="w-6 h-6 text-stone-200 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-stone-600 leading-loose mb-3" style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}>{t.text}</p>
                        <p className="text-[9px] font-medium uppercase tracking-widest text-stone-400">{t.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.faqs?.length > 0 && (
              <div className="mb-10">
                <h2 className="text-[9px] font-medium uppercase tracking-[0.5em] text-stone-300 mb-6">Questions fréquentes</h2>
                <div className="divide-y divide-stone-100">
                  {product.faqs.map((faq, i) => (
                    <div key={i}>
                      <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-start justify-between py-4 text-left gap-4">
                        <span className="text-sm text-stone-800" style={{ fontFamily: "Georgia, serif" }}>{faq.question}</span>
                        <ChevronDown className={`w-4 h-4 text-stone-300 flex-shrink-0 mt-0.5 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                      </button>
                      {openFaq === i && <p className="pb-4 text-sm text-stone-500 leading-relaxed" style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}>{faq.answer}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button onClick={onCTAClick} className="w-full py-4 bg-stone-900 hover:bg-stone-800 text-white text-[10px] uppercase tracking-[0.3em] font-medium flex items-center justify-center gap-2 transition rounded-sm mb-6">
              {isFree ? <Download className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
              {product.buttonText || (isFree ? "Télécharger gratuitement" : `Acquérir — ${product.price?.toLocaleString()} ${currencySymbol}`)}
            </button>
            <p className="text-center text-[9px] font-medium uppercase tracking-[0.4em] text-stone-300">Propulsé par Bookzy</p>
          </div>
        </div>
      </main>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 07 — NATURE
// Layout : Cover en bannière haut de page. Contenu single col aéré.
// #EEE9E0 lin chaud. Vert sauge. Typographie douce. Sections organiques.
// ══════════════════════════════════════════════════════════════════════════════
function NatureTemplate({ shop, product, username, onCTAClick, isFree, currencySymbol, hasDiscount, discountPercent }) {
  const [openFaq, setOpenFaq] = useState(null);
  return (
    <div className="min-h-screen font-sans" style={{ background: "#EEE9E0" }}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#EEE9E0]/90 backdrop-blur-md border-b border-[#C8C0B0]">
        <div className="max-w-xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href={`/shop/${username}`} className="flex items-center gap-2 text-xs font-semibold text-[#6B7A5E] hover:text-[#3D4E30] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> <span className="uppercase tracking-widest text-[10px]">{shop.name}</span>
          </Link>
          {shop.logo && <img src={shop.logo} alt="" className="w-7 h-7 rounded-full object-cover ring-2 ring-[#C8C0B0]" />}
        </div>
      </header>

      {/* Bannière cover */}
      <div className="relative h-56 md:h-72 overflow-hidden">
        {product.cover
          ? <img src={product.cover} alt={product.title} className="w-full h-full object-cover object-top" />
          : <div className="w-full h-full bg-[#D8D0C0] flex items-center justify-center"><Leaf className="w-16 h-16 text-[#6B7A5E]/30" /></div>}
        <div className="absolute inset-0 bg-gradient-to-t from-[#EEE9E0] to-transparent" />
        {hasDiscount && <div className="absolute top-4 right-4 bg-[#3D4E30] text-white px-3 py-1 rounded-full text-[10px] font-bold">-{discountPercent}%</div>}
      </div>

      <main className="max-w-xl mx-auto px-5 relative z-10 -mt-6">

        {/* Card flottante */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#C8C0B0] p-6 mb-8">
          <p className="text-[9px] font-semibold uppercase tracking-[0.4em] text-[#8A9A7A] mb-2">{shop.name}</p>
          <h1 className="text-2xl font-bold text-[#2C3520] leading-tight mb-4 tracking-tight">{product.title}</h1>

          {product.testimonials?.length > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-[#8A9A7A] fill-[#8A9A7A]" />)}</div>
              <span className="text-xs text-[#8A9A7A]">({product.testimonials.length} avis)</span>
            </div>
          )}

          <div className="flex items-baseline gap-2 mb-5">
            {hasDiscount && <span className="line-through text-sm text-[#C8C0B0]">{product.comparePrice?.toLocaleString()} {currencySymbol}</span>}
            <span className="text-3xl font-bold text-[#2C3520]">{isFree ? "Gratuit" : `${product.price?.toLocaleString()} ${currencySymbol}`}</span>
          </div>

          {product.fomo && <div className="flex items-center gap-2 text-xs text-[#6B7A5E] mb-5"><Flame className="w-3.5 h-3.5 text-[#8A9A7A]" /> {product.fomo} {isFree ? "téléchargements" : "achats"}</div>}

          <button onClick={onCTAClick} className="w-full py-4 bg-[#3D4E30] hover:bg-[#2C3A22] text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition mb-4">
            <Leaf className="w-4 h-4" />
            {product.buttonText || (isFree ? "Télécharger" : `Obtenir — ${product.price?.toLocaleString()} ${currencySymbol}`)}
          </button>

          <div className="grid grid-cols-3 gap-2">
            {[{ icon: Zap, text: "Immédiat" }, { icon: FileText, text: "PDF" }, { icon: Smartphone, text: "Mobile" }].map((f, i) => (
              <div key={i} className="text-center p-2.5 bg-[#EEE9E0] rounded-xl">
                <f.icon className="w-4 h-4 text-[#8A9A7A] mx-auto mb-1" />
                <p className="text-[9px] font-semibold text-[#8A9A7A] uppercase tracking-wider">{f.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mb-8 pb-8 border-b border-[#C8C0B0]">
            <h2 className="text-[9px] font-semibold uppercase tracking-[0.4em] text-[#8A9A7A] mb-5">À propos</h2>
            <div className="prose prose-sm text-[#4A5038] leading-relaxed [&_ul]:list-disc [&_ul]:ml-5 [&_p]:mb-3" dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>
        )}

        {/* Testimonials style cartes naturelles */}
        {product.testimonials?.length > 0 && (
          <div className="mb-8 pb-8 border-b border-[#C8C0B0]">
            <h2 className="text-[9px] font-semibold uppercase tracking-[0.4em] text-[#8A9A7A] mb-5">Témoignages</h2>
            <div className="space-y-4">
              {product.testimonials.map((t, i) => (
                <div key={i} className="bg-white border border-[#C8C0B0] rounded-2xl p-5">
                  <p className="text-sm text-[#4A5038] leading-relaxed mb-4">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#EEE9E0] flex items-center justify-center text-[#6B7A5E] font-bold text-sm">{t.name[0]}</div>
                    <div>
                      <p className="text-xs font-bold text-[#2C3520]">{t.name}</p>
                      <div className="flex mt-0.5">{[...Array(t.rating)].map((_, j) => <Star key={j} className="w-2.5 h-2.5 text-[#8A9A7A] fill-[#8A9A7A]" />)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        {product.faqs?.length > 0 && (
          <div className="mb-10">
            <h2 className="text-[9px] font-semibold uppercase tracking-[0.4em] text-[#8A9A7A] mb-5">Questions fréquentes</h2>
            <div className="space-y-2">
              {product.faqs.map((faq, i) => (
                <div key={i} className={`bg-white border rounded-2xl overflow-hidden transition-colors ${openFaq === i ? "border-[#6B7A5E]" : "border-[#C8C0B0]"}`}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left">
                    <span className="font-semibold text-[#2C3520] text-sm">{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-[#8A9A7A] flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && <div className="px-4 pb-4 text-sm text-[#6B7A5E] leading-relaxed">{faq.answer}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={onCTAClick} className="w-full py-4 bg-[#3D4E30] hover:bg-[#2C3A22] text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition mb-6">
          <Leaf className="w-4 h-4" />
          {product.buttonText || (isFree ? "Télécharger" : "Obtenir")}
        </button>
        <p className="text-center text-[9px] font-semibold uppercase tracking-widest text-[#8A9A7A]/50 pb-8">Propulsé par Bookzy</p>
      </main>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 08 — MIDNIGHT
// Layout : Magazine luxe. Fond #F0EDE8 lin chaud. Cover en aside sticky.
// Accents bleu marine profond. Lignes fines. Typographie serrée élégante.
// ══════════════════════════════════════════════════════════════════════════════
function MidnightTemplate({ shop, product, username, onCTAClick, isFree, currencySymbol, hasDiscount, discountPercent }) {
  const [openFaq, setOpenFaq] = useState(null);
  return (
    <div className="min-h-screen font-sans" style={{ background: "#F0EDE8" }}>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#F0EDE8]/95 backdrop-blur-md border-b border-[#D8D0C4]">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href={`/shop/${username}`} className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.4em] text-[#8A7E72] hover:text-[#1A2744] transition-colors">
            <ArrowLeft className="w-3 h-3" /> {shop.name}
          </Link>
          {shop.logo && <img src={shop.logo} alt="" className="w-6 h-6 rounded-full object-cover" />}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-5 gap-12">

          {/* Aside sticky — cover */}
          <aside className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              <div className="relative mb-6">
                <div className="aspect-[3/4] rounded-xl overflow-hidden border border-[#D8D0C4]">
                  {product.cover
                    ? <img src={product.cover} alt={product.title} className="w-full h-full object-cover" />
                    : <div className="w-full h-full bg-[#E4DFD8] flex items-center justify-center"><FileText className="w-10 h-10 text-[#B8AFA6]" /></div>}
                </div>
                {hasDiscount && <div className="absolute top-4 left-4 bg-[#1A2744] text-white px-3 py-1.5 rounded-lg">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/60">Économisez</p>
                  <p className="text-lg font-black leading-none">-{discountPercent}%</p>
                </div>}
              </div>

              {/* Prix */}
              <div className="bg-[#1A2744] rounded-xl p-6 mb-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/30 mb-2">{shop.name}</p>
                <div className="flex items-baseline gap-2 mb-4">
                  {hasDiscount && <span className="line-through text-sm text-white/30">{product.comparePrice?.toLocaleString()} {currencySymbol}</span>}
                  <span className="text-3xl font-black text-white">{isFree ? "Gratuit" : `${product.price?.toLocaleString()} ${currencySymbol}`}</span>
                </div>
                {product.testimonials?.length > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-white/60 fill-white/60" />)}</div>
                    <span className="text-[10px] text-white/30">({product.testimonials.length})</span>
                  </div>
                )}
                {product.fomo && <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-4">{product.fomo} {isFree ? "téléchargements" : "achats"}</p>}
                <button onClick={onCTAClick} className="w-full py-4 bg-white hover:bg-[#F0EDE8] text-[#1A2744] font-black text-[10px] uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition">
                  {isFree ? <Download className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                  {product.buttonText || (isFree ? "Télécharger" : "Acheter")}
                </button>
              </div>

              <div className="bg-white border border-[#D8D0C4] rounded-xl p-5">
                {[{ icon: Zap, text: "Accès immédiat" }, { icon: FileText, text: "PDF haute qualité" }, { icon: Smartphone, text: "Multi-appareils" }].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 py-2.5 border-b border-[#F0EDE8] last:border-0">
                    <f.icon className="w-4 h-4 text-[#1A2744] flex-shrink-0" />
                    <span className="text-sm text-[#5A5248]">{f.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Contenu principal */}
          <div className="lg:col-span-3 space-y-8">
            <div className="pb-8 border-b border-[#D8D0C4]">
              <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-[#8A7E72] mb-4">Présentation</p>
              <h1 className="text-3xl md:text-4xl font-black text-[#1A2744] leading-tight tracking-tight">{product.title}</h1>
            </div>

            {product.description && (
              <div className="pb-8 border-b border-[#D8D0C4]">
                <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-[#8A7E72] mb-5">Description</p>
                <div className="prose prose-sm text-[#5A5248] leading-loose [&_ul]:list-disc [&_ul]:ml-5 [&_p]:mb-3" dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
            )}

            {product.testimonials?.length > 0 && (
              <div className="pb-8 border-b border-[#D8D0C4]">
                <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-[#8A7E72] mb-5">Ce qu'ils en disent</p>
                <div className="space-y-4">
                  {product.testimonials.map((t, i) => (
                    <div key={i} className="bg-white border border-[#D8D0C4] rounded-xl p-5">
                      <p className="text-sm text-[#5A5248] italic leading-loose mb-3">"{t.text}"</p>
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-[#1A2744] flex items-center justify-center text-white font-black text-xs">{t.name[0]}</div>
                        <span className="text-xs font-black text-[#1A2744] uppercase tracking-wider">{t.name}</span>
                        <div className="flex ml-auto">{[...Array(t.rating)].map((_, j) => <Star key={j} className="w-3 h-3 text-[#1A2744] fill-[#1A2744]" />)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.faqs?.length > 0 && (
              <div className="pb-8">
                <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-[#8A7E72] mb-5">FAQ</p>
                <div className="space-y-2">
                  {product.faqs.map((faq, i) => (
                    <div key={i} className={`bg-white border rounded-xl overflow-hidden transition-colors ${openFaq === i ? "border-[#1A2744]" : "border-[#D8D0C4]"}`}>
                      <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left">
                        <span className="font-bold text-[#1A2744] text-sm">{faq.question}</span>
                        <ChevronDown className={`w-4 h-4 text-[#8A7E72] flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                      </button>
                      {openFaq === i && <div className="px-4 pb-4 text-sm text-[#7A7068] leading-relaxed">{faq.answer}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button onClick={onCTAClick} className="w-full py-5 bg-[#1A2744] hover:bg-[#0F1A30] text-white font-black text-[10px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition">
              {isFree ? <Download className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
              {product.buttonText || (isFree ? "Télécharger gratuitement" : `Acheter — ${product.price?.toLocaleString()} ${currencySymbol}`)}
            </button>
            <p className="text-center text-[9px] font-bold uppercase tracking-widest text-[#8A7E72]/50">Propulsé par Bookzy</p>
          </div>
        </div>
      </main>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 09 — GRADIENT
// Layout : Hero avec cover en background flou + overlay gradient. CTA bold.
// Fond blanc. Bandeau top avec dégradé sobre violet→slate. Sections claires.
// ══════════════════════════════════════════════════════════════════════════════
function GradientTemplate({ shop, product, username, onCTAClick, isFree, currencySymbol, hasDiscount, discountPercent }) {
  const [openFaq, setOpenFaq] = useState(null);
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href={`/shop/${username}`} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-slate-700 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> {shop.name}
          </Link>
          {shop.logo && <img src={shop.logo} alt="" className="w-7 h-7 rounded-full object-cover" />}
        </div>
      </header>

      {/* Hero avec background flou */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #EDE9FE 0%, #F1F5F9 100%)" }}>
        {product.cover && (
          <img src={product.cover} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.06] blur-sm scale-110" />
        )}
        <div className="relative z-10 max-w-2xl mx-auto px-5 py-12 flex gap-6 items-end">
          <div className="relative flex-shrink-0">
            <div className="w-32 h-44 rounded-xl overflow-hidden shadow-2xl border-2 border-white/20">
              {product.cover
                ? <img src={product.cover} alt={product.title} className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-white/10 flex items-center justify-center"><FileText className="w-8 h-8 text-white/30" /></div>}
            </div>
            {hasDiscount && <div className="absolute -top-2 -right-2 bg-white text-slate-900 px-2 py-0.5 rounded-full text-[10px] font-black">-{discountPercent}%</div>}
          </div>
          <div className="flex-1 pb-2">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-violet-400 mb-2">{shop.name}</p>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-3 tracking-tight">{product.title}</h1>
            {product.testimonials?.length > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-violet-400 fill-violet-400" />)}</div>
                <span className="text-[10px] text-slate-400">({product.testimonials.length})</span>
              </div>
            )}
            <div className="flex items-baseline gap-2">
              {hasDiscount && <span className="line-through text-sm text-slate-400">{product.comparePrice?.toLocaleString()} {currencySymbol}</span>}
              <span className="text-3xl font-black text-slate-900">{isFree ? "Gratuit" : `${product.price?.toLocaleString()} ${currencySymbol}`}</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-5 py-8 space-y-6">

        {/* CTA + features */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
          {product.fomo && <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-4"><Flame className="w-3.5 h-3.5 text-orange-400" /> {product.fomo} {isFree ? "téléchargements" : "achats récents"}</div>}
          <button onClick={onCTAClick} className="w-full py-4 font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition mb-4 text-white" style={{ background: "linear-gradient(135deg, #4C1D95, #1E293B)" }}>
            {isFree ? <Download className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            {product.buttonText || (isFree ? "Télécharger gratuitement" : `Acheter — ${product.price?.toLocaleString()} ${currencySymbol}`)}
          </button>
          <div className="grid grid-cols-3 gap-3">
            {[{ icon: Zap, text: "Instantané" }, { icon: FileText, text: "PDF" }, { icon: Smartphone, text: "Mobile" }].map((f, i) => (
              <div key={i} className="text-center p-3 bg-white border border-slate-100 rounded-xl">
                <f.icon className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{f.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="pb-6 border-b border-slate-100">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-300 mb-4">À propos</p>
            <div className="prose prose-sm text-slate-600 leading-relaxed [&_ul]:list-disc [&_ul]:ml-5 [&_p]:mb-3" dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>
        )}

        {/* Testimonials */}
        {product.testimonials?.length > 0 && (
          <div className="pb-6 border-b border-slate-100">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-300 mb-5">Avis</p>
            <div className="space-y-3">
              {product.testimonials.map((t, i) => (
                <div key={i} className="flex gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-white text-sm flex-shrink-0" style={{ background: "linear-gradient(135deg, #4C1D95, #1E293B)" }}>{t.name[0]}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-slate-900 text-sm">{t.name}</span>
                      <div className="flex">{[...Array(t.rating)].map((_, j) => <Star key={j} className="w-3 h-3 text-amber-400 fill-amber-400" />)}</div>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">"{t.text}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        {product.faqs?.length > 0 && (
          <div className="pb-6">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-300 mb-5">FAQ</p>
            <div className="space-y-2">
              {product.faqs.map((faq, i) => (
                <div key={i} className={`border rounded-xl overflow-hidden transition-colors ${openFaq === i ? "border-slate-300" : "border-slate-100"}`}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left">
                    <span className="font-bold text-slate-800 text-sm">{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-300 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && <div className="px-4 pb-4 text-sm text-slate-500 leading-relaxed">{faq.answer}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={onCTAClick} className="w-full py-4 font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition text-white" style={{ background: "linear-gradient(135deg, #4C1D95, #1E293B)" }}>
          {isFree ? <Download className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          {product.buttonText || (isFree ? "Télécharger" : "Acheter")}
        </button>
        <p className="text-center text-[9px] font-bold uppercase tracking-widest text-slate-200 pb-4">Propulsé par Bookzy</p>
      </main>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 10 — WARM
// Layout : Cards empilées. Cover en format portrait isolé. Tons terre chauds.
// #F8F2EC crème chaud. Terracotta. Bordures douces. Fond sections alternés.
// ══════════════════════════════════════════════════════════════════════════════
function WarmTemplate({ shop, product, username, onCTAClick, isFree, currencySymbol, hasDiscount, discountPercent }) {
  const [openFaq, setOpenFaq] = useState(null);
  return (
    <div className="min-h-screen font-sans" style={{ background: "#F8F2EC" }}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#F8F2EC]/90 backdrop-blur-md border-b border-[#E2D0C0]">
        <div className="max-w-xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href={`/shop/${username}`} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#A07060] hover:text-[#6B3D28] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> {shop.name}
          </Link>
          {shop.logo && <img src={shop.logo} alt="" className="w-7 h-7 rounded-full object-cover ring-2 ring-[#E2D0C0]" />}
        </div>
      </header>

      <main className="max-w-xl mx-auto px-5 py-10 space-y-5">

        {/* Card principale — cover + prix */}
        <div className="bg-white border border-[#E2D0C0] rounded-3xl overflow-hidden shadow-sm">
          {/* Cover en bannière */}
          <div className="relative h-48 overflow-hidden bg-[#EDE4D8]">
            {product.cover
              ? <img src={product.cover} alt={product.title} className="w-full h-full object-cover object-center" />
              : <div className="w-full h-full flex items-center justify-center"><Package className="w-12 h-12 text-[#C0A090]/40" /></div>}
            <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
            {hasDiscount && <div className="absolute top-4 right-4 bg-[#8B3A2A] text-white px-3 py-1 rounded-full text-[10px] font-black">-{discountPercent}%</div>}
          </div>
          <div className="p-6">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#A07060] mb-2">{shop.name}</p>
            <h1 className="text-2xl font-black text-[#2C1810] leading-tight mb-3 tracking-tight">{product.title}</h1>
            {product.testimonials?.length > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-[#C08060] fill-[#C08060]" />)}</div>
                <span className="text-xs text-[#A07060]">({product.testimonials.length} avis)</span>
              </div>
            )}
            <div className="flex items-baseline gap-2 mb-2">
              {hasDiscount && <span className="line-through text-sm text-[#C0A090]">{product.comparePrice?.toLocaleString()} {currencySymbol}</span>}
              <span className="text-3xl font-black text-[#2C1810]">{isFree ? "Gratuit" : `${product.price?.toLocaleString()} ${currencySymbol}`}</span>
            </div>
            {product.fomo && <div className="flex items-center gap-2 text-xs font-bold text-[#A07060] mb-5"><Flame className="w-3.5 h-3.5 text-[#C08060]" /> {product.fomo} {isFree ? "téléchargements" : "achats"}</div>}
          </div>
        </div>

        {/* CTA card */}
        <div className="bg-[#8B3A2A] rounded-3xl p-6">
          <div className="flex inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: GRAIN }} />
          <button onClick={onCTAClick} className="w-full py-4 bg-white hover:bg-[#F8F2EC] text-[#8B3A2A] font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 transition mb-4">
            {isFree ? <Download className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            {product.buttonText || (isFree ? "Télécharger" : `Acheter — ${product.price?.toLocaleString()} ${currencySymbol}`)}
          </button>
          <div className="grid grid-cols-3 gap-2">
            {[{ icon: Zap, text: "Immédiat" }, { icon: FileText, text: "PDF" }, { icon: Smartphone, text: "Mobile" }].map((f, i) => (
              <div key={i} className="text-center p-2.5 bg-white/10 rounded-xl">
                <f.icon className="w-4 h-4 text-white/50 mx-auto mb-1" />
                <p className="text-[9px] font-bold text-white/40 uppercase tracking-wider">{f.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="bg-white border border-[#E2D0C0] rounded-3xl p-6">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#A07060] mb-4">À propos</p>
            <div className="prose prose-sm text-[#5A3828] leading-relaxed [&_ul]:list-disc [&_ul]:ml-5 [&_p]:mb-3" dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>
        )}

        {/* Features */}
        <div className="bg-[#EDE4D8] border border-[#E2D0C0] rounded-3xl p-6">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#A07060] mb-4">Ce que tu reçois</p>
          <div className="space-y-3">
            {[{ icon: Zap, text: "Accès immédiat après achat" }, { icon: FileText, text: "PDF haute qualité prêt à vendre" }, { icon: Smartphone, text: "Compatible tous appareils" }].map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-[#E2D0C0]">
                <f.icon className="w-4 h-4 text-[#8B3A2A] flex-shrink-0" />
                <span className="text-sm font-medium text-[#4A2818]">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        {product.testimonials?.length > 0 && (
          <div className="bg-white border border-[#E2D0C0] rounded-3xl p-6">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#A07060] mb-5">Témoignages</p>
            <div className="space-y-4">
              {product.testimonials.map((t, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-9 h-9 rounded-full bg-[#EDE4D8] flex items-center justify-center font-black text-[#8B3A2A] text-sm flex-shrink-0">{t.name[0]}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-black text-[#2C1810] text-sm">{t.name}</span>
                      <div className="flex ml-auto">{[...Array(t.rating)].map((_, j) => <Star key={j} className="w-3 h-3 text-[#C08060] fill-[#C08060]" />)}</div>
                    </div>
                    <p className="text-sm text-[#7A5040] leading-relaxed">"{t.text}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        {product.faqs?.length > 0 && (
          <div className="bg-white border border-[#E2D0C0] rounded-3xl p-6">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#A07060] mb-5">FAQ</p>
            <div className="divide-y divide-[#F0E4D8]">
              {product.faqs.map((faq, i) => (
                <div key={i}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between py-4 text-left">
                    <span className="font-bold text-[#2C1810] text-sm">{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-[#A07060] flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && <p className="pb-4 text-sm text-[#7A5040] leading-relaxed">{faq.answer}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={onCTAClick} className="w-full py-4 bg-[#8B3A2A] hover:bg-[#6B2A1A] text-white font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 transition">
          {isFree ? <Download className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          {product.buttonText || (isFree ? "Télécharger" : "Acheter")}
        </button>
        <p className="text-center text-[9px] font-bold uppercase tracking-widest text-[#A07060]/40 pb-4">Propulsé par Bookzy</p>
      </main>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 11 — MINIMAL
// Layout : Une seule colonne. Zéro décoration. Tout dans la typographie.
// Blanc pur. Noir. Espacement généreux. Filets ultra fins. Sobriété totale.
// ══════════════════════════════════════════════════════════════════════════════
function MinimalTemplate({ shop, product, username, onCTAClick, isFree, currencySymbol, hasDiscount, discountPercent }) {
  const [openFaq, setOpenFaq] = useState(null);
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header ultra fin */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100">
        <div className="max-w-lg mx-auto px-6 h-12 flex items-center justify-between">
          <Link href={`/shop/${username}`} className="flex items-center gap-1.5 text-[9px] text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">
            <ArrowLeft className="w-3 h-3" /> {shop.name}
          </Link>
          {shop.logo && <img src={shop.logo} alt="" className="w-6 h-6 rounded-full object-cover" />}
        </div>
      </header>

      <main className="max-w-lg mx-auto px-6 py-16">

        {/* Cover */}
        <div className="mb-10">
          <div className="w-40 h-56 overflow-hidden mb-8">
            {product.cover
              ? <img src={product.cover} alt={product.title} className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-slate-50 border border-slate-100 flex items-center justify-center"><FileText className="w-8 h-8 text-slate-200" /></div>}
          </div>
          {hasDiscount && <div className="inline-block text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-200 px-2 py-0.5 mb-3">-{discountPercent}%</div>}
          <p className="text-[9px] text-slate-300 uppercase tracking-[0.5em] mb-3">{shop.name}</p>
          <h1 className="text-2xl font-semibold text-slate-900 leading-snug mb-4">{product.title}</h1>
          {product.testimonials?.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-slate-300 fill-slate-300" />)}</div>
              <span className="text-xs text-slate-300">({product.testimonials.length})</span>
            </div>
          )}
          <div className="flex items-baseline gap-2">
            {hasDiscount && <span className="line-through text-sm text-slate-300">{product.comparePrice?.toLocaleString()} {currencySymbol}</span>}
            <span className="text-3xl font-semibold text-slate-900">{isFree ? "Gratuit" : `${product.price?.toLocaleString()} ${currencySymbol}`}</span>
          </div>
          {product.fomo && <p className="text-xs text-slate-400 mt-2">{product.fomo} {isFree ? "téléchargements" : "achats"}</p>}
        </div>

        <div className="h-px bg-slate-100 mb-8" />

        <button onClick={onCTAClick} className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium tracking-widest flex items-center justify-center gap-2 transition mb-8">
          {isFree ? <Download className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          {product.buttonText || (isFree ? "Télécharger" : `${product.price?.toLocaleString()} ${currencySymbol} — Acheter`)}
        </button>

        <div className="flex gap-8 mb-10 pb-10 border-b border-slate-100">
          {[{ text: "Accès immédiat" }, { text: "PDF" }, { text: "Multi-appareils" }].map((f, i) => (
            <div key={i} className="text-center">
              <p className="text-[9px] text-slate-300 uppercase tracking-widest">{f.text}</p>
            </div>
          ))}
        </div>

        {product.description && (
          <div className="mb-10 pb-10 border-b border-slate-100">
            <p className="text-[9px] text-slate-300 uppercase tracking-[0.5em] mb-6">Description</p>
            <div className="prose prose-sm text-slate-500 leading-loose [&_ul]:list-disc [&_ul]:ml-5 [&_p]:mb-4 [&_p]:text-slate-500 [&_p]:leading-loose" dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>
        )}

        {product.testimonials?.length > 0 && (
          <div className="mb-10 pb-10 border-b border-slate-100">
            <p className="text-[9px] text-slate-300 uppercase tracking-[0.5em] mb-6">Avis</p>
            <div className="space-y-6">
              {product.testimonials.map((t, i) => (
                <div key={i}>
                  <p className="text-sm text-slate-500 leading-loose mb-2">"{t.text}"</p>
                  <p className="text-[9px] text-slate-300 uppercase tracking-widest">{t.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {product.faqs?.length > 0 && (
          <div className="mb-10 pb-10 border-b border-slate-100">
            <p className="text-[9px] text-slate-300 uppercase tracking-[0.5em] mb-6">FAQ</p>
            <div className="divide-y divide-slate-50">
              {product.faqs.map((faq, i) => (
                <div key={i}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between py-4 text-left">
                    <span className="text-sm text-slate-700">{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-200 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && <p className="pb-4 text-sm text-slate-400 leading-loose">{faq.answer}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={onCTAClick} className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium tracking-widest flex items-center justify-center gap-2 transition mb-8">
          {isFree ? <Download className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          {product.buttonText || (isFree ? "Télécharger" : "Acheter")}
        </button>
        <p className="text-center text-[9px] text-slate-200 uppercase tracking-widest">Bookzy</p>
      </main>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 12 — GLASS
// Layout : Cards glass flottantes sur fond dégradé bleu-gris perle.
// Glassmorphism réel. Profondeur. Lumière. Tons froids perle.
// ══════════════════════════════════════════════════════════════════════════════
function GlassTemplate({ shop, product, username, onCTAClick, isFree, currencySymbol, hasDiscount, discountPercent }) {
  const [openFaq, setOpenFaq] = useState(null);
  return (
    <div className="min-h-screen font-sans relative" style={{ background: "linear-gradient(145deg, #DCE4F0 0%, #E8EDF8 40%, #D8E2EE 100%)" }}>
      {/* Sphères décoratives */}
      <div className="fixed top-[-10%] right-[-5%] w-80 h-80 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(147,197,253,0.4) 0%, transparent 70%)" }} />
      <div className="fixed bottom-[-10%] left-[-5%] w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(196,181,253,0.25) 0%, transparent 70%)" }} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(219,234,254,0.3) 0%, transparent 70%)" }} />

      {/* Header glass */}
      <header className="sticky top-0 z-40 border-b border-white/50 backdrop-blur-xl" style={{ background: "rgba(220,228,240,0.7)" }}>
        <div className="max-w-2xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href={`/shop/${username}`} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> {shop.name}
          </Link>
          {shop.logo && <img src={shop.logo} alt="" className="w-7 h-7 rounded-full object-cover ring-2 ring-white/60" />}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-10 relative z-10 space-y-4">

        {/* Card hero glass */}
        <div className="rounded-3xl overflow-hidden border border-white/60 shadow-xl" style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(20px)" }}>
          <div className="flex gap-5 p-6">
            <div className="relative flex-shrink-0">
              <div className="w-28 h-40 rounded-2xl overflow-hidden shadow-lg border border-white/80">
                {product.cover
                  ? <img src={product.cover} alt={product.title} className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-white/50 flex items-center justify-center"><FileText className="w-8 h-8 text-slate-300" /></div>}
              </div>
              {hasDiscount && <div className="absolute -top-2 -right-2 bg-blue-500 text-white px-2 py-0.5 rounded-full text-[10px] font-black shadow-lg">-{discountPercent}%</div>}
            </div>
            <div className="flex-1">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-400/60 mb-2">{shop.name}</p>
              <h1 className="text-xl font-black text-slate-800 leading-tight mb-3">{product.title}</h1>
              {product.testimonials?.length > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-blue-400 fill-blue-400" />)}</div>
                  <span className="text-[10px] text-slate-400">({product.testimonials.length})</span>
                </div>
              )}
              <div className="flex items-baseline gap-2 mb-2">
                {hasDiscount && <span className="line-through text-sm text-slate-300">{product.comparePrice?.toLocaleString()} {currencySymbol}</span>}
                <span className="text-2xl font-black text-slate-900">{isFree ? "Gratuit" : `${product.price?.toLocaleString()} ${currencySymbol}`}</span>
              </div>
              {product.fomo && <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400"><Flame className="w-3 h-3 text-orange-300" /> {product.fomo} {isFree ? "téléchargements" : "achats"}</div>}
            </div>
          </div>
          <div className="px-6 pb-6">
            <button onClick={onCTAClick} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 transition shadow-lg">
              {isFree ? <Download className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
              {product.buttonText || (isFree ? "Télécharger" : `Acheter — ${product.price?.toLocaleString()} ${currencySymbol}`)}
            </button>
          </div>
        </div>

        {/* Features card glass */}
        <div className="rounded-3xl p-5 border border-white/60 shadow-md" style={{ background: "rgba(255,255,255,0.4)", backdropFilter: "blur(16px)" }}>
          <div className="grid grid-cols-3 gap-3">
            {[{ icon: Zap, text: "Accès immédiat" }, { icon: FileText, text: "PDF premium" }, { icon: Smartphone, text: "Multi-appareils" }].map((f, i) => (
              <div key={i} className="text-center p-3 rounded-2xl" style={{ background: "rgba(255,255,255,0.5)" }}>
                <f.icon className="w-4 h-4 text-blue-400 mx-auto mb-1.5" />
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{f.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Description glass */}
        {product.description && (
          <div className="rounded-3xl p-6 border border-white/60 shadow-md" style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(16px)" }}>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-400/50 mb-4">À propos</p>
            <div className="prose prose-sm text-slate-600 leading-relaxed [&_ul]:list-disc [&_ul]:ml-5 [&_p]:mb-3" dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>
        )}

        {/* Testimonials glass */}
        {product.testimonials?.length > 0 && (
          <div className="rounded-3xl p-6 border border-white/60 shadow-md" style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(16px)" }}>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-400/50 mb-5">Avis</p>
            <div className="space-y-4">
              {product.testimonials.map((t, i) => (
                <div key={i} className="rounded-2xl p-4 border border-white/70 shadow-sm" style={{ background: "rgba(255,255,255,0.6)" }}>
                  <p className="text-sm text-slate-600 italic leading-relaxed mb-3">"{t.text}"</p>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center font-black text-blue-500 text-xs">{t.name[0]}</div>
                    <span className="text-xs font-black text-slate-600">{t.name}</span>
                    <div className="flex ml-auto">{[...Array(t.rating)].map((_, j) => <Star key={j} className="w-3 h-3 text-blue-400 fill-blue-400" />)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ glass */}
        {product.faqs?.length > 0 && (
          <div className="rounded-3xl p-6 border border-white/60 shadow-md" style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(16px)" }}>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-400/50 mb-5">FAQ</p>
            <div className="space-y-1">
              {product.faqs.map((faq, i) => (
                <div key={i} className={`rounded-2xl overflow-hidden border transition-colors ${openFaq === i ? "border-blue-200/60" : "border-white/60"}`} style={{ background: openFaq === i ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.4)" }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left">
                    <span className="font-bold text-slate-700 text-sm">{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-300 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && <div className="px-4 pb-4 text-sm text-slate-500 leading-relaxed">{faq.answer}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={onCTAClick} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 transition shadow-lg">
          {isFree ? <Download className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          {product.buttonText || (isFree ? "Télécharger" : "Acheter")}
        </button>
        <p className="text-center text-[9px] font-bold uppercase tracking-widest text-slate-400 pb-4">Propulsé par Bookzy</p>
      </main>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 13 — PLAYFUL
// Layout : Cover en grand cercle centré. Sections alternées blanc/jaune pâle.
// Jaune + noir. Zéro ombres portées. Typographie extra-bold condensée.
// ══════════════════════════════════════════════════════════════════════════════
function PlayfulTemplate({ shop, product, username, onCTAClick, isFree, currencySymbol, hasDiscount, discountPercent }) {
  const [openFaq, setOpenFaq] = useState(null);
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Header jaune */}
      <header className="sticky top-0 z-40 bg-yellow-400 border-b border-yellow-500">
        <div className="max-w-xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href={`/shop/${username}`} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/60 hover:text-black transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> {shop.name}
          </Link>
          {shop.logo && <img src={shop.logo} alt="" className="w-7 h-7 rounded-full object-cover border-2 border-black/20" />}
        </div>
      </header>

      {/* Section 1 — Hero centré */}
      <div className="bg-white px-5 pt-12 pb-10 text-center border-b border-slate-100">
        {/* Cover en cercle */}
        <div className="relative inline-block mb-8">
          <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-black mx-auto bg-yellow-50">
            {product.cover
              ? <img src={product.cover} alt={product.title} className="w-full h-full object-cover object-top" />
              : <div className="w-full h-full flex items-center justify-center"><FileText className="w-12 h-12 text-yellow-300" /></div>}
          </div>
          {hasDiscount && <div className="absolute -top-2 -right-2 bg-yellow-400 border-2 border-black text-black w-12 h-12 rounded-full flex items-center justify-center font-black text-[10px]">-{discountPercent}%</div>}
        </div>

        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-black/30 mb-3">{shop.name}</p>
        <h1 className="font-black text-black leading-tight mb-4" style={{ fontSize: "clamp(1.8rem, 6vw, 3rem)" }}>{product.title}</h1>

        {product.testimonials?.length > 0 && (
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}</div>
            <span className="text-xs font-black text-black/40">{product.testimonials.length} avis</span>
          </div>
        )}

        <div className="flex items-baseline justify-center gap-2 mb-3">
          {hasDiscount && <span className="line-through text-base text-black/30 font-black">{product.comparePrice?.toLocaleString()} {currencySymbol}</span>}
          <span className="font-black text-black" style={{ fontSize: "clamp(2rem, 6vw, 3rem)" }}>{isFree ? "Gratuit" : `${product.price?.toLocaleString()} ${currencySymbol}`}</span>
        </div>
        {product.fomo && <p className="text-xs font-black text-black/40 uppercase tracking-wider mb-6">{product.fomo} {isFree ? "téléchargements" : "achats"}</p>}
      </div>

      {/* Section 2 — CTA jaune */}
      <div className="bg-yellow-400 px-5 py-6 border-b border-yellow-500">
        <div className="max-w-xl mx-auto">
          <button onClick={onCTAClick} className="w-full py-5 bg-black hover:bg-slate-800 text-white font-black uppercase tracking-widest flex items-center justify-center gap-2 transition text-sm rounded-2xl">
            {isFree ? <Download className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
            {product.buttonText || (isFree ? "Télécharger gratuitement" : `Acheter — ${product.price?.toLocaleString()} ${currencySymbol}`)}
          </button>
          <div className="flex justify-center gap-8 mt-4">
            {[{ icon: Zap, text: "Immédiat" }, { icon: FileText, text: "PDF" }, { icon: Smartphone, text: "Partout" }].map((f, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-black/60">
                <f.icon className="w-3.5 h-3.5" /> {f.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 3 — Description blanche */}
      {product.description && (
        <div className="bg-white px-5 py-10 border-b border-slate-100">
          <div className="max-w-xl mx-auto">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-black/30 mb-5">À propos</p>
            <div className="prose prose-sm text-black/70 leading-relaxed [&_ul]:list-disc [&_ul]:ml-5 [&_p]:mb-3" dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>
        </div>
      )}

      {/* Section 4 — Testimonials fond jaune pâle */}
      {product.testimonials?.length > 0 && (
        <div className="px-5 py-10 border-b border-yellow-100" style={{ background: "#FFFBEB" }}>
          <div className="max-w-xl mx-auto">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-black/30 mb-6">Avis</p>
            <div className="space-y-4">
              {product.testimonials.map((t, i) => (
                <div key={i} className="bg-white border border-yellow-200 rounded-2xl p-5">
                  <p className="font-bold text-black/70 leading-relaxed mb-3">"{t.text}"</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-black/40 uppercase tracking-wider">{t.name}</span>
                    <div className="flex">{[...Array(t.rating)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Section 5 — FAQ blanche */}
      {product.faqs?.length > 0 && (
        <div className="bg-white px-5 py-10 border-b border-slate-100">
          <div className="max-w-xl mx-auto">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-black/30 mb-5">FAQ</p>
            <div className="space-y-2">
              {product.faqs.map((faq, i) => (
                <div key={i} className={`border-2 rounded-2xl overflow-hidden transition-colors ${openFaq === i ? "border-yellow-400" : "border-slate-100"}`}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left">
                    <span className="font-black text-black text-sm">{faq.question}</span>
                    <span className="font-black text-lg text-yellow-400 flex-shrink-0 ml-4">{openFaq === i ? "−" : "+"}</span>
                  </button>
                  {openFaq === i && <div className="px-4 pb-4 text-sm text-black/60 font-medium leading-relaxed">{faq.answer}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA final */}
      <div className="bg-yellow-400 px-5 py-8">
        <div className="max-w-xl mx-auto">
          <button onClick={onCTAClick} className="w-full py-5 bg-black hover:bg-slate-800 text-white font-black uppercase tracking-widest flex items-center justify-center gap-2 transition text-sm rounded-2xl mb-4">
            {isFree ? <Download className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
            {product.buttonText || (isFree ? "Télécharger" : "Acheter")}
          </button>
          <p className="text-center text-[9px] font-black uppercase tracking-widest text-black/30">Propulsé par Bookzy</p>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROUTER PRINCIPAL
// ══════════════════════════════════════════════════════════════════════════════
export default function ProductPageClient({ shop, product, username }) {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);

  const templateId = shop.theme?.style || "clean";
  const currencySymbol = currencies[shop.currency] || "FCFA";
  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const discountPercent = hasDiscount ? Math.round((1 - product.price / product.comparePrice) * 100) : 0;
  const isFree = product.checkoutType === "free";

  const handleCTAClick = () => {
    if (leadCaptured) { proceedToAction(); return; }
    setShowModal(true);
  };

  const handleLeadSubmit = async (contact) => {
    setIsSubmitting(true);
    try {
      await fetch("/api/smart-shop/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopId: shop._id, productId: product._id, contact, source: product.checkoutType }),
      });
      setLeadCaptured(true);
      setShowModal(false);
      proceedToAction();
    } catch (error) { console.error("Erreur:", error); }
    finally { setIsSubmitting(false); }
  };

  const proceedToAction = () => {
    if (product.checkoutType === "whatsapp") {
      const message = encodeURIComponent((product.whatsappMessage || "Bonjour, je suis intéressé par : {product}").replace("{product}", product.title));
      window.open(`https://wa.me/${product.whatsappNumber}?text=${message}`, "_blank");
    } else if (product.checkoutType === "link") {
      let url = product.externalLink || "";
      if (url && !url.startsWith("http")) url = "https://" + url;
      if (url) window.open(url, "_blank");
    } else if (product.checkoutType === "free") {
      window.location.href = `/shop/${username}/${product.slug}/download`;
    } else {
      window.location.href = `/shop/${username}/${product.slug}/checkout`;
    }
  };

  const templateProps = { shop, product, username, onCTAClick: handleCTAClick, isFree, currencySymbol, hasDiscount, discountPercent };

  const templates = {
    clean:     CleanTemplate,
    stone:     StoneTemplate,
    brutalist: BrutalistTemplate,
    neon:      NeonTemplate,
    love:      LoveTemplate,
    elegant:   ElegantTemplate,
    nature:    NatureTemplate,
    midnight:  MidnightTemplate,
    gradient:  GradientTemplate,
    warm:      WarmTemplate,
    minimal:   MinimalTemplate,
    glass:     GlassTemplate,
    playful:   PlayfulTemplate,
  };

  const TemplateComponent = templates[templateId] || CleanTemplate;

  return (
    <>
      <TemplateComponent {...templateProps} />
      <LeadCaptureModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleLeadSubmit}
        isLoading={isSubmitting}
        productTitle={product.title}
        isFree={isFree}
      />
    </>
  );
}