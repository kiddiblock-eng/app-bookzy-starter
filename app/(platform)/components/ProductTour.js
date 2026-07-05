"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

const TIP_W = 288;

// Parcours DESKTOP (sidebar visible)
const DESKTOP = [
  { sel: '[data-tour="generate"]', title: "Crée ton ebook", text: "C'est ici que tu génères tes ebooks (texte + design + PDF) à partir d'un simple titre." },
  { sel: '[data-tour="tools"]', title: "Trouve une idée qui vend", text: "Niche Hunter et le Validateur t'aident à repérer et valider des idées rentables avant de créer." },
  { sel: '[data-tour="myebooks"]', title: "Mes Ebooks", text: "Retrouve tes ebooks : télécharge le PDF, ou vends-les sur Taliopay via le menu (⋮)." },
  { sel: '[data-tour="ebooks"]', title: "Tes ebooks", text: "Le nombre d'ebooks qu'il te reste. 1 création = 1 ebook. Ils n'expirent jamais." },
  { sel: '[data-tour="plan"]', title: "Ton offre", text: "Passe à Créateur ou Pro pour débloquer tous les outils et créer plus d'ebooks." },
];

// Parcours MOBILE (la sidebar est un tiroir fermé) → on pointe des éléments toujours visibles
const MOBILE = [
  { sel: '[data-tour="menu"]', title: "Ton menu", text: "Ouvre ce menu pour créer un ebook et accéder à tous les outils (Niche Hunter, Validateur, Youbook, Designer…)." },
  { sel: '[data-tour="ebooks"]', title: "Tes ebooks", text: "Le nombre d'ebooks qu'il te reste. 1 création = 1 ebook. Ils n'expirent jamais." },
  { sel: '[data-tour="plan"]', title: "Ton offre", text: "Passe à Créateur ou Pro pour débloquer tous les outils et créer plus d'ebooks." },
];

export default function ProductTour() {
  const [active, setActive] = useState(false);
  const [steps, setSteps] = useState([]);
  const [i, setI] = useState(0);
  const [rect, setRect] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/profile/get", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        const user = d?.user || d;
        if (!cancelled && user && user.tourDone === false) {
          setSteps(window.innerWidth < 1024 ? MOBILE : DESKTOP);
          setTimeout(() => setActive(true), 900);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const finish = useCallback(() => {
    setActive(false);
    fetch("/api/profile/tour-done", { method: "POST", credentials: "include" }).catch(() => {});
  }, []);

  const updateRect = useCallback(() => {
    const step = steps[i];
    const el = step ? document.querySelector(step.sel) : null;
    if (el) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0 && r.bottom > 0 && r.right > 0) {
        el.scrollIntoView({ block: "center", behavior: "smooth" });
        setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
        return;
      }
    }
    setRect(null); // introuvable → bulle centrée, sans spotlight (pas de saut d'étape)
  }, [steps, i]);

  useEffect(() => {
    if (!active) return;
    updateRect();
    const on = () => updateRect();
    window.addEventListener("resize", on);
    window.addEventListener("scroll", on, true);
    return () => {
      window.removeEventListener("resize", on);
      window.removeEventListener("scroll", on, true);
    };
  }, [active, i, updateRect]);

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
                onClick={() => setI((v) => v - 1)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors"
              >
                Précédent
              </button>
            )}
            {i < steps.length - 1 ? (
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
