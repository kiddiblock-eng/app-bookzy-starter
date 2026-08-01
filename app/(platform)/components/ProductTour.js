"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

const TIP_W = 288;

// Parcours DESKTOP (sidebar visible) → spotlight sur chaque fonctionnalité
const DESKTOP = [
  { sel: '[data-tour="generate"]', title: "Générer un ebook", text: "Le cœur de Bookzy : crée un ebook complet (texte + design + PDF) à partir d'un simple titre." },
  { sel: '[data-tour="/dashboard/youbook"]', title: "Youbook", text: "Transforme n'importe quelle vidéo YouTube en ebook prêt à vendre." },
  { sel: '[data-tour="/dashboard/express"]', title: "Ebook Designer", text: "Mets en page et personnalise le design de tes ebooks en quelques clics." },
  { sel: '[data-tour="/dashboard/romans"]', title: "Romans IA", text: "Génère des histoires et romans longs, chapitre par chapitre, avec l'IA." },
  { sel: '[data-tour="/dashboard/niche-hunter"]', title: "Niche Hunter", text: "Repère les niches d'ebooks qui se vendent le mieux sur le marché." },
  { sel: '[data-tour="/dashboard/radar-cash"]', title: "Radar Cash", text: "Détecte les produits et offres qui rapportent, pour t'inspirer." },
  { sel: '[data-tour="/dashboard/analyseur"]', title: "Validateur d'idée", text: "Analyse le potentiel d'une idée avant d'investir ton temps à la créer." },
  { sel: '[data-tour="/dashboard/fichiers"]', title: "Mes Ebooks", text: "Retrouve tes ebooks : télécharge le PDF, ou vends-les sur Taliopay via le menu (⋮)." },
  { sel: '[data-tour="ebooks"]', title: "Tes ebooks", text: "Le nombre d'ebooks qu'il te reste. 1 création = 1 ebook. Ils n'expirent jamais." },
  { sel: '[data-tour="plan"]', title: "Ton offre", text: "Passe à Créateur ou Pro pour débloquer tous les outils et créer plus d'ebooks." },
];

// Parcours MOBILE : le tiroir s'ouvre automatiquement (drawer:true) pour pointer les vrais
// items de la sidebar, puis on le referme pour le solde + l'offre (visibles dans le header).
const MOBILE = [
  { sel: '[data-tour="menu"]', title: "Ton menu", text: "Voici ton menu (☰). On l'ouvre pour toi : découvre chaque fonctionnalité juste ici." },
  { sel: '[data-tour="generate"]', drawer: true, title: "Générer un ebook", text: "Le cœur de Bookzy : crée un ebook complet (texte + design + PDF) à partir d'un titre." },
  { sel: '[data-tour="/dashboard/youbook"]', drawer: true, title: "Youbook", text: "Transforme n'importe quelle vidéo YouTube en ebook prêt à vendre." },
  { sel: '[data-tour="/dashboard/express"]', drawer: true, title: "Ebook Designer", text: "Mets en page et personnalise le design de tes ebooks en quelques clics." },
  { sel: '[data-tour="/dashboard/romans"]', drawer: true, title: "Romans IA", text: "Génère des histoires et romans longs, chapitre par chapitre, avec l'IA." },
  { sel: '[data-tour="/dashboard/niche-hunter"]', drawer: true, title: "Niche Hunter", text: "Repère les niches d'ebooks qui se vendent le mieux sur le marché." },
  { sel: '[data-tour="/dashboard/radar-cash"]', drawer: true, title: "Radar Cash", text: "Détecte les produits et offres qui rapportent, pour t'inspirer." },
  { sel: '[data-tour="/dashboard/analyseur"]', drawer: true, title: "Validateur d'idée", text: "Analyse le potentiel d'une idée avant d'investir ton temps à la créer." },
  { sel: '[data-tour="/dashboard/fichiers"]', drawer: true, title: "Mes Ebooks", text: "Retrouve tes ebooks : télécharge le PDF ou vends-les sur Taliopay." },
  { sel: '[data-tour="ebooks"]', title: "Tes ebooks", text: "Le nombre d'ebooks qu'il te reste. 1 création = 1 ebook. Ils n'expirent jamais." },
  { sel: '[data-tour="plan"]', title: "Ton offre", text: "Passe à Créateur ou Pro pour débloquer tous les outils et créer plus d'ebooks." },
];

// Petit "blip" au clic (Web Audio, sans fichier). Joué sur un geste utilisateur → non bloqué.
function blip() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = 660;
    o.connect(g); g.connect(ctx.destination);
    const now = ctx.currentTime;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.15, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
    o.start(now); o.stop(now + 0.18);
  } catch { /* ignore */ }
}

export default function ProductTour() {
  const [active, setActive] = useState(false);
  const [steps, setSteps] = useState([]);
  const [i, setI] = useState(0);
  const [rect, setRect] = useState(null);

  useEffect(() => {
    let cancelled = false;
    // Garde locale : si le tour a déjà été vu sur cet appareil, on ne le rejoue pas
    // (couvre le cas où l'écriture en base échoue/tarde).
    try {
      if (localStorage.getItem("bookzy_tour_done") === "1") return;
    } catch { /* ignore */ }
    // La roue promo est prioritaire : si elle va s'afficher, on ne lance pas le tour cette fois.
    Promise.all([
      fetch("/api/profile/get", { credentials: "include" }).then((r) => r.json()).catch(() => null),
      fetch("/api/promo/status", { credentials: "include" }).then((r) => r.json()).catch(() => null),
    ])
      .then(([d, promo]) => {
        const user = d?.user || d;
        let dismissed = false;
        try { dismissed = localStorage.getItem("bookzy_promo_dismissed") === "1"; } catch { /* ignore */ }
        // La roue s'affiche seulement si éligible ET pas déjà fermée sur cet appareil.
        const wheelWillShow = promo?.success && promo.canSpin && !dismissed;
        if (!cancelled && !wheelWillShow && user && user.tourDone === false) {
          setSteps(window.innerWidth < 1024 ? MOBILE : DESKTOP);
          setTimeout(() => setActive(true), 900);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const setDrawer = useCallback((wantOpen) => {
    window.dispatchEvent(new CustomEvent("bookzy:sidebar", { detail: { open: wantOpen } }));
  }, []);

  const finish = useCallback(() => {
    setActive(false);
    setDrawer(false);
    // On mémorise tout de suite côté navigateur, puis on persiste en base.
    try { localStorage.setItem("bookzy_tour_done", "1"); } catch { /* ignore */ }
    fetch("/api/profile/tour-done", { method: "POST", credentials: "include" }).catch(() => {});
  }, [setDrawer]);

  const updateRect = useCallback(() => {
    const step = steps[i];
    // Plusieurs éléments peuvent partager le même data-tour (sidebar desktop cachée + tiroir mobile) :
    // on retient le premier réellement visible à l'écran.
    const els = step?.sel ? document.querySelectorAll(step.sel) : [];
    let found = null;
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0 && r.bottom > 0 && r.right > 0) { found = el; break; }
    }
    if (found) {
      found.scrollIntoView({ block: "center", behavior: "smooth" });
      const r = found.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
      return;
    }
    setRect(null); // introuvable → bulle centrée, sans spotlight (pas de saut d'étape)
  }, [steps, i]);

  useEffect(() => {
    if (!active) return;
    const needDrawer = !!steps[i]?.drawer;
    setDrawer(needDrawer);
    // On mesure APRÈS l'ouverture/fermeture du tiroir (sinon on viserait un élément encore caché).
    const t = setTimeout(updateRect, needDrawer ? 340 : 60);
    const on = () => updateRect();
    window.addEventListener("resize", on);
    window.addEventListener("scroll", on, true);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", on);
      window.removeEventListener("scroll", on, true);
    };
  }, [active, i, updateRect, steps, setDrawer]);

  if (!active || typeof document === "undefined" || steps.length === 0) return null;

  const step = steps[i];
  const pad = 8;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let top, left;
  let centered = false;
  if (rect) {
    const canRight = rect.left < 300 && rect.left + rect.width + TIP_W + 24 < vw;
    if (canRight) {
      left = rect.left + rect.width + 14;
      top = Math.min(Math.max(12, rect.top), vh - 190);
    } else {
      left = Math.min(Math.max(12, rect.left), vw - TIP_W - 12);
      top = rect.top + rect.height + 14;
      if (top + 175 > vh) top = Math.max(12, rect.top - 175);
    }
  } else {
    centered = true;
  }

  const tipStyle = centered
    ? { top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: TIP_W, maxWidth: "calc(100vw - 24px)" }
    : { top, left, width: TIP_W, maxWidth: "calc(100vw - 24px)" };

  return createPortal(
    <div className="fixed inset-0 z-[10001]">
      <div className="absolute inset-0" />

      {rect ? (
        <div
          className="absolute rounded-xl transition-all duration-300 ease-out"
          style={{
            top: rect.top - pad,
            left: rect.left - pad,
            width: rect.width + pad * 2,
            height: rect.height + pad * 2,
            boxShadow: "0 0 0 9999px rgba(15,23,42,0.72)",
            pointerEvents: "none",
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-[rgba(15,23,42,0.72)]" />
      )}

      <div className="absolute bg-white rounded-2xl shadow-2xl p-4 z-[10002]" style={tipStyle}>
        <div className="text-[11px] font-bold text-emerald-600 mb-1">
          Étape {i + 1}/{steps.length}
        </div>
        <h4 className="text-sm font-bold text-neutral-900">{step.title}</h4>
        <p className="text-sm text-neutral-500 mt-1 leading-snug">{step.text}</p>

        <div className="flex items-center justify-between mt-4">
          <button onClick={finish} className="text-xs text-neutral-400 hover:text-neutral-600">
            Passer
          </button>
          <div className="flex items-center gap-2">
            {i > 0 && (
              <button
                onClick={() => { blip(); setI((v) => v - 1); }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors"
              >
                Précédent
              </button>
            )}
            {i < steps.length - 1 ? (
              <button
                onClick={() => { blip(); setI((v) => v + 1); }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 transition-colors"
              >
                Suivant
              </button>
            ) : (
              <button
                onClick={() => { blip(); finish(); }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
              >
                Terminer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
