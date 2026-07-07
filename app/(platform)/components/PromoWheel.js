"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { X, Gift, Check, Copy } from "lucide-react";
import { WHEEL } from "@/lib/promo";

const SEG = 360 / WHEEL.length;

// Couleur par valeur : plus la remise est grosse, plus le vert est profond (le 15% ressort).
function colorFor(percent) {
  if (percent === 15) return "#047857"; // emerald-700 (jackpot)
  if (percent === 10) return "#10b981"; // emerald-500
  return "#6ee7b7"; // emerald-300 (5%)
}

// Point du cercle pour un angle (degrés) mesuré depuis le haut, sens horaire.
function pt(angleDeg, r, cx = 100, cy = 100) {
  const a = (angleDeg * Math.PI) / 180;
  return [cx + r * Math.sin(a), cy - r * Math.cos(a)];
}

function WheelSVG({ rotation, spinning }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
      <circle cx="100" cy="100" r="99" fill="#fff" />
      <g
        style={{
          transform: `rotate(${rotation}deg)`,
          transformOrigin: "100px 100px",
          transition: spinning ? "transform 4.6s cubic-bezier(0.15,0.9,0.2,1)" : "none",
        }}
      >
        {WHEEL.map((s, i) => {
          const a0 = i * SEG;
          const a1 = (i + 1) * SEG;
          const [x0, y0] = pt(a0, 96);
          const [x1, y1] = pt(a1, 96);
          const [tx, ty] = pt(a0 + SEG / 2, 62);
          return (
            <g key={i}>
              <path
                d={`M100,100 L${x0},${y0} A96,96 0 0 1 ${x1},${y1} Z`}
                fill={colorFor(s.percent)}
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <text
                x={tx}
                y={ty}
                fill="#ffffff"
                fontSize="15"
                fontWeight="800"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${a0 + SEG / 2}, ${tx}, ${ty})`}
              >
                -{s.percent}%
              </text>
            </g>
          );
        })}
        <circle cx="100" cy="100" r="14" fill="#fff" stroke="#e5e7eb" strokeWidth="1" />
      </g>
    </svg>
  );
}

export default function PromoWheel() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState("intro"); // intro | spinning | won
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null); // { percent, code, expiresAt }
  const [copied, setCopied] = useState(false);
  const [left, setLeft] = useState("");
  const busy = useRef(false);

  // Éligibilité
  useEffect(() => {
    let cancelled = false;
    try { if (localStorage.getItem("bookzy_promo_dismissed") === "1") return; } catch { /* ignore */ }
    fetch("/api/promo/status", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d?.success && d.canSpin) {
          setTimeout(() => setOpen(true), 1200);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Compte à rebours 72 h
  useEffect(() => {
    if (!result?.expiresAt) return;
    const tick = () => {
      const ms = new Date(result.expiresAt).getTime() - Date.now();
      if (ms <= 0) { setLeft("00:00:00"); return; }
      const h = Math.floor(ms / 3.6e6);
      const m = Math.floor((ms % 3.6e6) / 6e4);
      const s = Math.floor((ms % 6e4) / 1000);
      setLeft(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [result]);

  const close = useCallback(() => {
    setOpen(false);
    try { localStorage.setItem("bookzy_promo_dismissed", "1"); } catch { /* ignore */ }
  }, []);

  const spin = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    setPhase("spinning");
    try {
      const res = await fetch("/api/promo/spin", { method: "POST", credentials: "include" });
      const d = await res.json();
      if (!d?.success) { busy.current = false; setPhase("intro"); return; }

      // Le segment gagnant doit s'arrêter en haut (sous le curseur).
      const jitter = (Math.random() - 0.5) * (SEG - 12);
      const target = 360 * 6 - (d.index * SEG + SEG / 2) + jitter;
      setSpinning(true);
      setRotation(target);
      setResult({ percent: d.percent, code: d.code, expiresAt: d.expiresAt });
      setTimeout(() => setPhase("won"), 4700);
    } catch {
      busy.current = false;
      setPhase("intro");
    }
  }, []);

  const copy = useCallback(async () => {
    if (!result?.code) return;
    const code = result.code;
    let done = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
        done = true;
      }
    } catch { /* on tente le repli */ }
    if (!done) {
      // Repli pour les contextes non sécurisés (http://IP en test mobile, etc.)
      try {
        const ta = document.createElement("textarea");
        ta.value = code;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        ta.setSelectionRange(0, code.length);
        document.execCommand("copy");
        document.body.removeChild(ta);
        done = true;
      } catch { /* ignore */ }
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [result]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[10050] flex items-center justify-center p-4"
      style={{ background: "rgba(6,78,59,0.55)", backdropFilter: "blur(4px)" }}>
      <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden animate-[bzpop_.3s_ease]">
        <style>{`@keyframes bzpop{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:none}}`}</style>

        <button onClick={close} aria-label="Fermer"
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">
          <X className="w-5 h-5" />
        </button>

        {phase !== "won" ? (
          <>
            {/* Bandeau */}
            <div className="px-6 pt-7 pb-4 text-center" style={{ background: "linear-gradient(180deg,#ecfdf5,#ffffff)" }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-2"
                style={{ background: "rgba(5,150,105,0.12)", color: "#059669" }}>
                <Gift className="w-3.5 h-3.5" /> Cadeau de bienvenue
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">Tourne la roue</h2>
              <p className="mt-1.5 text-sm text-slate-500">Une remise garantie sur ton premier pack, une seule chance.</p>
            </div>

            {/* Roue */}
            <div className="relative px-6 pb-2">
              <div className="relative mx-auto w-64 h-64 max-w-full">
                <div className="absolute left-1/2 -top-1 -translate-x-1/2 z-20"
                  style={{ width: 0, height: 0, borderLeft: "11px solid transparent", borderRight: "11px solid transparent", borderTop: "18px solid #059669" }} />
                <WheelSVG rotation={rotation} spinning={spinning} />
              </div>
            </div>

            <div className="px-6 pb-7 pt-2">
              <button
                onClick={spin}
                disabled={phase === "spinning"}
                className="w-full py-4 rounded-2xl text-white font-bold text-base transition-all disabled:opacity-70"
                style={{ background: "#059669" }}
              >
                {phase === "spinning" ? "La roue tourne…" : "Tourner la roue"}
              </button>
            </div>
          </>
        ) : (
          /* ── Écran de résultat chic ── */
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(120% 75% at 50% -10%, #d1fae5 0%, #ffffff 68%)" }} />
            <div className="relative px-7 pt-9 pb-7 text-center">
              <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                style={{ background: "linear-gradient(160deg,#10b981,#047857)" }}>
                <Gift className="w-8 h-8 text-white" />
              </div>

              <p className="text-sm font-semibold" style={{ color: "#059669" }}>Félicitations, tu as gagné</p>
              <p className="text-6xl font-black tracking-tight leading-none mt-1" style={{ color: "#059669" }}>
                -{result.percent}%
              </p>
              <p className="mt-2 text-sm text-slate-500">sur les packs Créateur &amp; Pro</p>

              {/* Code */}
              <button onClick={copy}
                className="mt-5 w-full flex items-center justify-between gap-2 px-4 py-3.5 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/70">
                <span className="font-mono font-bold tracking-[0.2em] text-emerald-800">{result.code}</span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  {copied ? <><Check className="w-4 h-4" /> Copié</> : <><Copy className="w-4 h-4" /> Copier</>}
                </span>
              </button>

              {/* Urgence 24h */}
              <div className="mt-4 rounded-2xl bg-red-50 border border-red-100 px-4 py-3">
                <p className="text-xs font-semibold text-red-600 leading-snug">
                  Utilise-la dans les prochaines 24h, sinon tu perds ta réduction.
                </p>
                <p className="text-2xl font-black text-red-600 tabular-nums mt-1 tracking-wide">{left}</p>
              </div>

              <button
                onClick={() => { close(); router.push("/dashboard/tarifs"); }}
                className="mt-5 w-full py-4 rounded-2xl text-white font-bold text-base transition-all shadow-lg"
                style={{ background: "#059669" }}
              >
                Profiter de ma remise
              </button>
              <button onClick={close} className="mt-2 w-full py-2 text-sm text-slate-400 hover:text-slate-600">
                Plus tard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
