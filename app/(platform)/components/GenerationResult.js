"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import { sfxSuccess } from "@/lib/sfx";
import {
  FileText, FileEdit, Image as ImageIcon, Megaphone, MessageSquareText,
  Download, ArrowRight, BookOpen, X, Store,
} from "lucide-react";

// Cases images (couverture + affiche) branchées côté back (Phase 2, OpenRouter).
const IMAGES_READY = true;

// Définition des cases (livrables) du kit.
const SLOTS = {
  pdf:   { label: "Ebook PDF",            sub: "Version complète, prête à vendre",  Icon: FileText },
  docx:  { label: "Version Word",         sub: "Éditable dans Word / Google Docs",  Icon: FileEdit },
  cover: { label: "Couverture",           sub: "Visuel de couverture pro",          Icon: ImageIcon },
  ads:   { label: "Affiche publicitaire", sub: "Visuel prêt à publier",             Icon: Megaphone },
  texts: { label: "Textes marketing",     sub: "Facebook, WhatsApp, page de vente", Icon: MessageSquareText },
};

function hasData(key, d) {
  if (!d) return false;
  switch (key) {
    case "pdf":   return !!d.pdfUrl;
    case "docx":  return !!d.docxUrl;
    case "cover": return !!d.coverUrl;
    case "ads":   return Array.isArray(d.adsImages) && d.adsImages.length > 0;
    case "texts": return !!(d.adsTexts && Object.values(d.adsTexts).some((v) => v && String(v).trim()));
    default:      return false;
  }
}

export default function GenerationResult({ projetId, kit, onClose }) {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const [data, setData] = useState(null);
  const credited = useRef(false);

  const isEbookOnly = kit?.outputType === "ebook";
  const slotKeys = isEbookOnly
    ? ["pdf", "docx"]
    : (IMAGES_READY ? ["pdf", "docx", "cover", "ads", "texts"] : ["pdf", "docx", "texts"]);

  // Polling de la progression jusqu'à COMPLETED / ERROR (dès qu'on a un projetId).
  useEffect(() => {
    if (!projetId) return;
    let cancelled = false, attempts = 0, timer = null;
    const poll = async () => {
      if (cancelled) return;
      try {
        const r = await fetch(`/api/ebooks/progress/${projetId}`, { credentials: "include" });
        const d = await r.json();
        if (cancelled) return;
        setData(d);
        if (d.status === "COMPLETED") {
          if (!credited.current) { credited.current = true; sfxSuccess(); mutate("/api/credits/balance"); mutate("/api/profile/get"); }
          return; // stop
        }
        if (d.status === "ERROR") return; // stop
      } catch (_) { /* on retente */ }
      if (attempts++ < 180) timer = setTimeout(poll, 2000);
    };
    poll();
    return () => { cancelled = true; if (timer) clearTimeout(timer); };
  }, [projetId, mutate]);

  const starting = !projetId;
  const done = data?.status === "COMPLETED";
  const errored = data?.status === "ERROR";
  const progress = errored ? 0 : Math.min(100, Math.max(4, data?.progress || 4));
  const readyCount = slotKeys.filter((k) => hasData(k, data)).length;

  const downloadAll = useCallback(() => {
    const urls = [];
    if (data?.pdfUrl) urls.push(data.pdfUrl);
    if (data?.docxUrl) urls.push(data.docxUrl);
    if (data?.coverUrl) urls.push(data.coverUrl);
    if (Array.isArray(data?.adsImages)) urls.push(...data.adsImages);
    urls.forEach((u, i) => setTimeout(() => {
      const a = document.createElement("a");
      a.href = u; a.download = ""; a.target = "_blank"; a.rel = "noopener";
      document.body.appendChild(a); a.click(); a.remove();
    }, i * 400));
  }, [data]);

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <style>{`@keyframes bzpulse{0%,100%{opacity:1}50%{opacity:.5}}@keyframes bzslide{0%{transform:translateX(-120%)}100%{transform:translateX(360%)}}`}</style>

      {/* En-tête (style Mes Ebooks) */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {errored ? "Génération échouée" : done ? "Ton kit est prêt" : "Création en cours"}
          </h1>
          <p className="text-sm text-slate-400 mt-0.5 truncate">{kit?.titre}</p>
        </div>
        <button onClick={onClose} title="Fermer"
          className="shrink-0 p-2 bg-white text-slate-300 hover:text-slate-600 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progression */}
      {!errored && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">
              {starting ? "Préparation de vos livrables…" : done ? "Terminé" : `${Math.round(progress)}%`}
            </span>
            <span className="text-xs text-slate-400">{readyCount}/{slotKeys.length} prêts</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
            {starting
              ? <div className="h-full w-1/3 rounded-full bg-emerald-500" style={{ animation: "bzslide 1.2s ease-in-out infinite" }} />
              : <div className="h-full rounded-full bg-emerald-500 transition-[width] duration-700 ease-out" style={{ width: `${progress}%` }} />}
          </div>
        </div>
      )}

      {errored ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
          <p className="text-sm text-slate-600 mb-4">Une erreur est survenue pendant la génération. Tes crédits t'ont été rendus.</p>
          <button onClick={onClose} className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors">Réessayer</button>
        </div>
      ) : (
        <>
          {/* Cases */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {slotKeys.map((key) => (
              <Slot key={key} slotKey={key} data={data} done={done} router={router} projetId={projetId} big={key === "pdf"} />
            ))}
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={downloadAll}
              disabled={readyCount === 0}
              className="flex-1 py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
            >
              <Download className="w-4 h-4" /> Tout télécharger
            </button>
            <button
              onClick={() => router.push("/dashboard/fichiers")}
              className="flex-1 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-colors"
            >
              <BookOpen className="w-4 h-4" /> Ma bibliothèque
            </button>
          </div>

          {done && (
            <a href="https://taliopay.com" target="_blank" rel="noopener noreferrer"
              className="mt-3 flex items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3.5 hover:border-slate-300 hover:shadow-sm transition-all group">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center shrink-0">
                  <Store className="w-4 h-4 text-white" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">Vends ton ebook</p>
                  <p className="text-xs text-slate-400 truncate">Encaisse par Mobile Money sur Taliopay</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all shrink-0" />
            </a>
          )}
        </>
      )}
    </div>
  );
}

// ── Une case (livrable) ────────────────────────────────────────────────────────
function Slot({ slotKey, data, done, router, projetId, big }) {
  const def = SLOTS[slotKey];
  const ready = hasData(slotKey, data);
  const status = ready ? "ready" : done ? "empty" : "pending";

  return (
    <div className={`bg-white border rounded-xl p-4 flex flex-col transition-all ${ready ? "border-slate-300 shadow-sm" : "border-slate-200"} ${big ? "sm:col-span-2" : ""}`}>
      <div className="flex items-center gap-3">
        <span className={`w-10 h-12 rounded-md flex items-center justify-center shrink-0 border ${ready ? "bg-emerald-50 border-emerald-100" : "bg-slate-50 border-slate-100"}`}>
          <def.Icon className={`w-4 h-4 ${ready ? "text-emerald-600" : "text-slate-400"}`} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">{def.label}</p>
          <p className="text-[11px] text-slate-400 truncate">{def.sub}</p>
        </div>
        <StatusPill status={status} />
      </div>

      <div className="mt-3.5">
        <SlotBody slotKey={slotKey} status={status} data={data} router={router} projetId={projetId} />
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  if (status === "ready")
    return <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 shrink-0"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Prêt</span>;
  if (status === "pending")
    return <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-400 shrink-0"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" style={{ animation: "bzpulse 1.2s ease-in-out infinite" }} /> En cours</span>;
  return <span className="text-[11px] font-medium text-slate-300 shrink-0">Bientôt</span>;
}

function Shimmer({ className = "" }) {
  return <div className={`bg-slate-100 rounded-md ${className}`} style={{ animation: "bzpulse 1.4s ease-in-out infinite" }} />;
}

function SlotBody({ slotKey, status, data, router, projetId }) {
  // En attente → squelette
  if (status === "pending") {
    if (slotKey === "cover" || slotKey === "ads") return <Shimmer className="w-full aspect-[3/4] max-w-[120px]" />;
    return (
      <div className="space-y-2">
        <Shimmer className="h-2.5 w-full" />
        <Shimmer className="h-2.5 w-2/3" />
      </div>
    );
  }

  // Terminé mais pas de données → à venir
  if (status === "empty") {
    return <p className="text-xs text-slate-300 py-1.5">Bientôt disponible pour cet ebook.</p>;
  }

  // Prêt
  switch (slotKey) {
    case "pdf":
      return (
        <a href={data.pdfUrl} download
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors">
          <Download className="w-4 h-4" /> Télécharger l'ebook (PDF)
        </a>
      );
    case "docx":
      return (
        <a href={data.docxUrl} download
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-semibold text-sm transition-all">
          <Download className="w-4 h-4" /> Télécharger (.docx)
        </a>
      );
    case "cover":
      return (
        <div className="flex items-center gap-3">
          <img src={data.coverUrl} alt="Couverture" className="w-[72px] aspect-[3/4] object-cover rounded-md border border-slate-200" />
          <a href={data.coverUrl} download
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-xs font-semibold transition-all">
            <Download className="w-3.5 h-3.5" /> Télécharger
          </a>
        </div>
      );
    case "ads": {
      const imgs = (data.adsImages || []).slice(0, 6);
      return (
        <div className="flex gap-2 flex-wrap">
          {imgs.map((src, i) => (
            <a key={i} href={src} download target="_blank" rel="noopener" className="block relative group w-[100px]">
              <img src={src} alt={`Affiche ${i + 1}`} className="w-full aspect-[3/4] object-cover rounded-md border border-slate-200" />
              <span className="absolute inset-0 rounded-md bg-slate-900/0 group-hover:bg-slate-900/40 flex items-center justify-center transition-colors">
                <Download className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
            </a>
          ))}
        </div>
      );
    }
    case "texts": {
      const LABELS = { facebook: "Facebook", instagram: "Instagram", whatsapp: "WhatsApp", long: "Post long", landing: "Page de vente" };
      const keys = Object.keys(data.adsTexts || {}).filter((k) => data.adsTexts[k] && String(data.adsTexts[k]).trim());
      return (
        <div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {keys.slice(0, 5).map((k) => (
              <span key={k} className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{LABELS[k] || k}</span>
            ))}
          </div>
          <button onClick={() => router.push(`/dashboard/fichiers/${projetId}`)}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-semibold text-sm transition-all">
            Voir et copier les textes <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      );
    }
    default:
      return null;
  }
}
