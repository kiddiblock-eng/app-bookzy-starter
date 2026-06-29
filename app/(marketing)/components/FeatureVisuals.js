"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];
const ACCENT = "#5f7aa6";
const view = { once: true, margin: "-60px" };

/* ── L'IA rédige : lignes de texte qui se dessinent ────────────────────────── */
export function VisualWriting() {
  const lines = [
    { y: 116, w: 200 }, { y: 138, w: 168 }, { y: 160, w: 210 },
    { y: 182, w: 150 }, { y: 204, w: 196 }, { y: 226, w: 118 },
  ];
  return (
    <svg viewBox="0 0 360 300" className="w-full h-auto">
      <rect x="40" y="24" width="280" height="252" rx="18" fill="#fff" stroke="#e5e7eb" />
      <motion.g initial={{ opacity: 0, y: -8 }} whileInView={{ opacity: 1, y: 0 }} viewport={view} transition={{ duration: 0.5, delay: 0.15, ease: EASE }}>
        <rect x="60" y="46" width="128" height="24" rx="12" fill="rgba(95,122,166,0.12)" />
        <circle cx="74" cy="58" r="3" fill={ACCENT} />
        <text x="84" y="62" fontSize="11" fontWeight="700" fill={ACCENT}>Rédigé par l'IA</text>
      </motion.g>
      <motion.rect x="60" y="88" height="13" rx="6.5" fill="#111827" initial={{ width: 0 }} whileInView={{ width: 170 }} viewport={view} transition={{ duration: 0.5, delay: 0.3, ease: EASE }} />
      {lines.map((l, i) => (
        <motion.rect key={i} x="60" y={l.y} height="9" rx="4.5" fill="#e5e7eb"
          initial={{ width: 0 }} whileInView={{ width: l.w }} viewport={view}
          transition={{ duration: 0.45, delay: 0.5 + i * 0.12, ease: EASE }} />
      ))}
      <motion.rect x="180" y="226" width="2.5" height="9" fill={ACCENT} animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} />
    </svg>
  );
}

/* ── Design pro : cover qui s'assemble + nuancier ──────────────────────────── */
export function VisualDesign() {
  const swatches = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b"];
  return (
    <svg viewBox="0 0 360 300" className="w-full h-auto">
      <defs>
        <linearGradient id="cov" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#6366f1" /><stop offset="1" stopColor="#8b5cf6" /></linearGradient>
      </defs>
      <rect x="64" y="44" width="170" height="226" rx="14" fill="#f3f4f6" stroke="#e5e7eb" />
      <motion.g initial={{ opacity: 0, scale: 0.92, y: 10 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={view} transition={{ duration: 0.6, ease: EASE }} style={{ transformOrigin: "150px 150px", transformBox: "view-box" }}>
        <rect x="92" y="30" width="170" height="240" rx="16" fill="url(#cov)" />
        <motion.rect x="112" y="78" height="15" rx="7.5" fill="rgba(255,255,255,0.92)" initial={{ width: 0 }} whileInView={{ width: 130 }} viewport={view} transition={{ delay: 0.45, duration: 0.5, ease: EASE }} />
        <motion.rect x="112" y="100" height="15" rx="7.5" fill="rgba(255,255,255,0.7)" initial={{ width: 0 }} whileInView={{ width: 86 }} viewport={view} transition={{ delay: 0.6, duration: 0.5, ease: EASE }} />
        <motion.rect x="112" y="140" width="130" height="74" rx="10" fill="rgba(255,255,255,0.18)" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={view} transition={{ delay: 0.78, duration: 0.5 }} />
      </motion.g>
      {swatches.map((c, i) => (
        <motion.circle key={i} cx="300" cy={78 + i * 30} fill={c} stroke="#fff" strokeWidth="2"
          initial={{ r: 0 }} whileInView={{ r: 9 }} viewport={view}
          transition={{ delay: 0.95 + i * 0.1, type: "spring", stiffness: 320, damping: 14 }} />
      ))}
    </svg>
  );
}

/* ── Stratégie : jauge de score + barres + annonceurs ──────────────────────── */
export function VisualMarket() {
  const bars = [42, 72, 56, 92];
  return (
    <svg viewBox="0 0 360 300" className="w-full h-auto">
      <rect x="40" y="30" width="280" height="240" rx="18" fill="#fff" stroke="#e5e7eb" />
      <circle cx="118" cy="108" r="46" fill="none" stroke="#eef2f7" strokeWidth="12" />
      <motion.circle cx="118" cy="108" r="46" fill="none" stroke={ACCENT} strokeWidth="12" strokeLinecap="round"
        transform="rotate(-90 118 108)" initial={{ pathLength: 0 }} whileInView={{ pathLength: 0.87 }} viewport={view} transition={{ duration: 1, delay: 0.3, ease: EASE }} />
      <text x="118" y="116" textAnchor="middle" fontSize="28" fontWeight="800" fill="#111827">87</text>
      <text x="118" y="176" textAnchor="middle" fontSize="10" fontWeight="700" fill="#9ca3af" letterSpacing="1">SCORE / 100</text>
      {bars.map((h, i) => {
        const x = 196 + i * 28, base = 224;
        return (
          <motion.rect key={i} x={x} width="16" rx="4" fill={i === 3 ? ACCENT : "#d6deea"}
            initial={{ height: 0, y: base }} whileInView={{ height: h, y: base - h }} viewport={view}
            transition={{ delay: 0.5 + i * 0.12, duration: 0.5, ease: EASE }} />
        );
      })}
      {[0, 1, 2].map((i) => (
        <motion.circle key={i} cx={66 + i * 24} cy={214} fill={["#6366f1", "#10b981", "#f59e0b"][i]} stroke="#fff" strokeWidth="2"
          initial={{ r: 0 }} whileInView={{ r: 12 }} viewport={view} transition={{ delay: 0.95 + i * 0.1, type: "spring", stiffness: 280, damping: 14 }} />
      ))}
    </svg>
  );
}
