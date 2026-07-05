"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

// Chaque étape a une LISTE de cibles candidates : on prend la 1ʳᵉ visible.
// Sur mobile, la sidebar est un tiroir fermé (hors écran) → on retombe sur le
// burger, et les étapes purement sidebar (outils, mes ebooks) sont sautées.
const STEPS = [
  {
    sels: ['[data-tour="generate"]', '[data-tour="menu"]'],
    sidebar: true,
    title: "Crée ton ebook",
    text: "C'est ici que tu génères tes ebooks (texte + design + PDF) à partir d'un simple titre.",
  },
  {
    sels: ['[data-tour="tools"]'],
    sidebar: true,
    title: "Trouve une idée qui vend",
    text: "Niche Hunter et le Validateur t'aident à repérer et valider des idées rentables avant de créer.",
  },
  {
    sels: ['[data-tour="myebooks"]'],
    sidebar: true,
    title: "Mes Ebooks",
    text: "Retrouve tes ebooks : télécharge le PDF, ou vends-les sur Taliopay via le menu (⋮).",
  },
  {
    sels: ['[data-tour="ebooks"]'],
    sidebar: false,
    title: "Tes ebooks",
    text: "Le nombre d'ebooks qu'il te reste. 1 création = 1 ebook. Ils n'expirent jamais.",
  },
  {
    sels: ['[data-tour="plan"]'],
    sidebar: false,
    title: "Ton offre",
    text: "Passe à Créateur ou Pro pour débloquer tous les outils et créer plus d'ebooks.",
  },
];

function isMobile() {
  return typeof window !== "undefined" && window.innerWidth < 1024;
}

const TIP_W = 288;

function findVisible(sels) {
  if (typeof document === "undefined") return null;
  for (const s of sels) {
    const el = document.querySelector(s);
    if (!el) continue;
    const r = el.getBoundingClientRect();
    const cs = window.getComputedStyle(el);
    const visible =
      r.width > 0 && r.height > 0 &&
      r.bottom > 0 && r.right > 0 &&
      r.top < window.innerHeight && r.left < window.innerWidth &&
      cs.visibility !== "hidden" && cs.display !== "none";
    if (visible) return el;
  }
  return null;
}

export default function ProductTour() {
  const [active, setActive] = useState(false);
  const [i, setI] = useState(0);
  const [rect, setRect] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/profile/get", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        const user = d?.user || d;
        if (!cancelled && user && user.tourDone === false) {
          setTimeout(() => setActive(true), 900);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const finish = useCallback(() => {
    setActive(false);
    if (isMobile()) {
      window.dispatchEvent(new CustomEvent("bookzy:sidebar", { detail: { open: false } }));
    }
    fetch("/api/profile/tour-done", { method: "POST", credentials: "include" }).catch(() => {});
  }, []);

  const updateRect = useCallback(() => {
    const step = STEPS[i];
    const el = step ? findVisible(step.sels) : null;
    if (el) {
      const r = el.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    } else {
      // cible masquée (ex. sidebar fermée sur mobile) → on saute l'étape
      setRect(null);
      if (i < STEPS.length - 1) setI((v) => v + 1);
      else finish();
    }
  }, [i, finish]);

  useEffect(() => {
    if (!active) return;
    const step = STEPS[i];
    let t;
    if (isMobile()) {
      // Ouvre le tiroir pour les étapes sidebar, le ferme pour les étapes header,
      // puis mesure APRÈS l'animation du tiroir.
      window.dispatchEvent(new CustomEvent("bookzy:sidebar", { detail: { open: !!step?.sidebar } }));
      t = setTimeout(updateRect, 400);
    } else {
      updateRect();
    }
    const on = () => updateRect();
    window.addEventListener("resize", on);
    window.addEventListener("scroll", on, true);
    return () => {
      if (t) clearTimeout(t);
      window.removeEventListener("resize", on);
      window.removeEventListener("scroll", on, true);
    };
  }, [active, i, updateRect]);

  if (!active || typeof document === "undefined" || !rect) return null;

  const step = STEPS[i];
  const pad = 8;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Placement : à droite si élément sidebar (à gauche) et si la place existe ; sinon dessous ; sinon dessus.
  let top, left;
  const canRight = rect.left < 300 && rect.top > 90 && rect.left + rect.width + TIP_W + 24 < vw;
  if (canRight) {
    left = rect.left + rect.width + 14;
    top = Math.min(Math.max(12, rect.top), vh - 190);
  } else {
    left = Math.min(Math.max(12, rect.left), vw - TIP_W - 12);
    top = rect.top + rect.height + 14;
    if (top + 175 > vh) top = Math.max(12, rect.top - 175); // pas de place dessous → au-dessus
  }

  return createPortal(
    <div className="fixed inset-0 z-[10001]">
      {/* Bloque l'interaction avec la page pendant le tour */}
      <div className="absolute inset-0" />

      {/* Spotlight */}
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

      {/* Bulle */}
      <div
        className="absolute bg-white rounded-2xl shadow-2xl p-4 z-[10002]"
        style={{ top, left, width: TIP_W, maxWidth: "calc(100vw - 24px)" }}
      >
        <div className="text-[11px] font-bold text-emerald-600 mb-1">
          Étape {i + 1}/{STEPS.length}
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
                onClick={() => setI((v) => v - 1)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors"
              >
                Précédent
              </button>
            )}
            {i < STEPS.length - 1 ? (
              <button
                onClick={() => setI((v) => v + 1)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 transition-colors"
              >
                Suivant
              </button>
            ) : (
              <button
                onClick={finish}
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
