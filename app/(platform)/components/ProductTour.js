"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

// Étapes du tour — ciblent des éléments marqués par data-tour="..."
const STEPS = [
  {
    sel: '[data-tour="generate"]',
    title: "Crée ton ebook",
    text: "Génère un ebook complet (texte + design + PDF) à partir d'un simple titre. C'est ici que tout commence.",
    placement: "right",
  },
  {
    sel: '[data-tour="tools"]',
    title: "Trouve une idée qui vend",
    text: "Niche Hunter et le Validateur t'aident à repérer et valider des idées rentables avant de créer.",
    placement: "right",
  },
  {
    sel: '[data-tour="myebooks"]',
    title: "Mes Ebooks",
    text: "Retrouve tes ebooks : télécharge le PDF, ou vends-les sur Taliopay via le menu (⋮).",
    placement: "right",
  },
  {
    sel: '[data-tour="ebooks"]',
    title: "Tes ebooks",
    text: "Le nombre d'ebooks qu'il te reste. 1 création = 1 ebook. Ils n'expirent jamais.",
    placement: "bottom",
  },
  {
    sel: '[data-tour="plan"]',
    title: "Ton offre",
    text: "Passe à Créateur ou Pro pour débloquer tous les outils et créer plus d'ebooks.",
    placement: "bottom",
  },
];

export default function ProductTour() {
  const [active, setActive] = useState(false);
  const [i, setI] = useState(0);
  const [rect, setRect] = useState(null);

  // Lancer le tour si l'utilisateur ne l'a jamais vu
  useEffect(() => {
    let cancelled = false;
    fetch("/api/profile/get", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        const user = d?.user || d;
        if (!cancelled && user && user.tourDone === false) {
          setTimeout(() => setActive(true), 900); // laisse le DOM se monter
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const updateRect = useCallback(() => {
    const step = STEPS[i];
    const el = step ? document.querySelector(step.sel) : null;
    if (el) {
      el.scrollIntoView({ block: "center", behavior: "smooth" });
      const r = el.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    } else {
      setRect(null); // élément absent → bulle centrée, sans spotlight
    }
  }, [i]);

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

  const finish = () => {
    setActive(false);
    fetch("/api/profile/tour-done", { method: "POST", credentials: "include" }).catch(() => {});
  };

  if (!active || typeof document === "undefined") return null;

  const step = STEPS[i];
  const pad = 8;

  // Position de la bulle
  let tip;
  if (rect) {
    if (step.placement === "right") tip = { top: Math.max(12, rect.top), left: rect.left + rect.width + 14 };
    else tip = { top: rect.top + rect.height + 14, left: Math.max(12, rect.left) };
  } else {
    tip = { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
  }

  return createPortal(
    <div className="fixed inset-0 z-[10001]">
      {/* Bloque l'interaction avec la page pendant le tour */}
      <div className="absolute inset-0" />

      {/* Spotlight sur l'élément courant */}
      {rect && (
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
      )}
      {!rect && <div className="absolute inset-0 bg-[rgba(15,23,42,0.72)]" />}

      {/* Bulle */}
      <div
        className="absolute w-72 max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-2xl p-4 z-[10002]"
        style={tip}
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
                onClick={() => setI(i - 1)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors"
              >
                Précédent
              </button>
            )}
            {i < STEPS.length - 1 ? (
              <button
                onClick={() => setI(i + 1)}
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
