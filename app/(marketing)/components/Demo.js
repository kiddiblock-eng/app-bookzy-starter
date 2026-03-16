"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const features = [
  {
    id: 1,
    icon: "⚡",
    title: "Génération IA",
    desc: "Ebook complet en 60 secondes",
    color: "#EFF6FF",
    border: "#BFDBFE",
    accent: "#2563EB",
    desktop: { top: "4%", left: "2%" },
    mobile: { top: "2%", left: "0%" },
  },
  {
    id: 2,
    icon: "✏️",
    title: "Mise en page Express",
    desc: "PDF pro depuis ton texte",
    color: "#F0FDF4",
    border: "#BBF7D0",
    accent: "#16A34A",
    desktop: { top: "4%", right: "2%" },
    mobile: { top: "2%", right: "0%" },
  },
  {
    id: 3,
    icon: "🏪",
    title: "Smart Shop",
    desc: "Boutique en ligne gratuite",
    color: "#FFF7ED",
    border: "#FED7AA",
    accent: "#EA580C",
    desktop: { top: "38%", left: "0%" },
    mobile: { top: "38%", left: "0%" },
  },
  {
    id: 4,
    icon: "🎯",
    title: "Niche Hunter",
    desc: "Niches rentables en 1 clic",
    color: "#FDF4FF",
    border: "#E9D5FF",
    accent: "#9333EA",
    desktop: { top: "38%", right: "0%" },
    mobile: { top: "38%", right: "0%" },
  },
  {
    id: 5,
    icon: "🔥",
    title: "Tendances",
    desc: "Ce qui buzz en temps réel",
    color: "#FFF1F2",
    border: "#FECDD3",
    accent: "#E11D48",
    desktop: { bottom: "4%", left: "2%" },
    mobile: { bottom: "2%", left: "0%" },
  },
  {
    id: 6,
    icon: "🎬",
    title: "Youbook",
    desc: "YouTube → Ebook en 1 clic",
    color: "#FEFCE8",
    border: "#FEF08A",
    accent: "#CA8A04",
    desktop: { bottom: "4%", right: "2%" },
    mobile: { bottom: "2%", right: "0%" },
  },
];

const CenterContent = ({ small = false }) => (
  <div className={`text-center ${small ? "px-1" : "max-w-xs px-4"}`}>
    <span className={`inline-block px-3 py-1 bg-slate-100 rounded-full font-semibold text-slate-400 uppercase tracking-widest mb-3 ${small ? "text-[9px]" : "text-[11px]"}`}>
      L'écosystème Bookzy
    </span>
    <h2 className={`font-bold text-slate-900 tracking-tight leading-tight mb-2 ${small ? "text-lg" : "text-4xl lg:text-5xl"}`}>
      Tout pour{" "}
      <span className="text-blue-600">créer & vendre</span>
    </h2>
    <p className={`text-slate-400 leading-relaxed mb-5 ${small ? "text-[10px]" : "text-sm"}`}>
      6 outils. Une seule plateforme.
    </p>
    <Link
      href="/auth/register"
      className={`inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-full transition-all ${small ? "px-4 py-2 text-[10px]" : "px-7 py-3.5 text-sm"}`}
    >
      Commencer
      <ArrowRight className={small ? "w-3 h-3" : "w-4 h-4"} />
    </Link>
  </div>
);

const OrbitalLayout = ({ cardWidth, height, positions, small = false }) => (
  <div className="relative w-full" style={{ height }}>
    {/* Lignes SVG */}
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      {[
        { x1: "50%", y1: "50%", x2: "18%", y2: "14%" },
        { x1: "50%", y1: "50%", x2: "82%", y2: "14%" },
        { x1: "50%", y1: "50%", x2: "10%", y2: "50%" },
        { x1: "50%", y1: "50%", x2: "90%", y2: "50%" },
        { x1: "50%", y1: "50%", x2: "18%", y2: "86%" },
        { x1: "50%", y1: "50%", x2: "82%", y2: "86%" },
      ].map((line, i) => (
        <line key={i} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
          stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
      ))}
      <circle cx="50%" cy="50%" r="4" fill="#CBD5E1" />
    </svg>

    {/* Cards */}
    {features.map((f) => (
      <div
        key={f.id}
        className="absolute rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        style={{
          backgroundColor: f.color,
          borderColor: f.border,
          width: cardWidth,
          padding: small ? "10px" : "16px",
          ...positions[f.id],
        }}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <div
            className="rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: f.border,
              width: small ? "28px" : "36px",
              height: small ? "28px" : "36px",
              fontSize: small ? "14px" : "18px",
            }}
          >
            {f.icon}
          </div>
          <span className="font-bold text-slate-900" style={{ fontSize: small ? "11px" : "14px" }}>
            {f.title}
          </span>
        </div>
        <p style={{ color: f.accent, fontSize: small ? "9px" : "12px" }} className="leading-relaxed">
          {f.desc}
        </p>
      </div>
    ))}

    {/* Centre */}
    <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 1 }}>
      <CenterContent small={small} />
    </div>
  </div>
);

export default function Ecosystem() {
  // Positions desktop
  const desktopPositions = {
    1: { top: "4%", left: "2%" },
    2: { top: "4%", right: "2%" },
    3: { top: "38%", left: "0%" },
    4: { top: "38%", right: "0%" },
    5: { bottom: "4%", left: "2%" },
    6: { bottom: "4%", right: "2%" },
  };

  // Positions mobile — plus serrées
  const mobilePositions = {
    1: { top: "2%", left: "0%" },
    2: { top: "2%", right: "0%" },
    3: { top: "37%", left: "0%" },
    4: { top: "37%", right: "0%" },
    5: { bottom: "2%", left: "0%" },
    6: { bottom: "2%", right: "0%" },
  };

  return (
    <section className="bg-white py-20 lg:py-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">

        {/* MOBILE */}
        <div className="lg:hidden">
          <OrbitalLayout
            cardWidth="130px"
            height="520px"
            positions={mobilePositions}
            small={true}
          />
        </div>

        {/* DESKTOP */}
        <div className="hidden lg:block">
          <OrbitalLayout
            cardWidth="210px"
            height="640px"
            positions={desktopPositions}
            small={false}
          />
        </div>

      </div>
    </section>
  );
}