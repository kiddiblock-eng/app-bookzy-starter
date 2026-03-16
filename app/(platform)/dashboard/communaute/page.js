// app/(platform)/dashboard/communaute/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X, ArrowRight, Send, CheckCircle2, Lock, MessageCircle,
  Zap, Sparkles, Gift, TrendingUp, Trophy, Target
} from "lucide-react";

export default function CommunautePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const telegramLink = "https://t.me/+Yad7Hj17d445Mzdk";

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const features = [
    { Icon: Zap,        bg: "#FEF3F2", color: "#EF4444", title: "Idées HOT",           desc: "Titres et thèmes validés, prêts à exploiter." },
    { Icon: MessageCircle,   bg: "#EFF6FF", color: "#3B82F6", title: "Conseils Experts",     desc: "Stratégies pour créer des eBooks rentables." },
    { Icon: Gift,       bg: "#FFFBEB", color: "#F59E0B", title: "Ressources Gratuites", desc: "Templates et outils pour booster vos ventes." },
    { Icon: TrendingUp, bg: "#F0FDF4", color: "#22C55E", title: "Tendances Marché",     desc: "Niches porteuses et opportunités en temps réel." },
    { Icon: Trophy,     bg: "#FDF4FF", color: "#A855F7", title: "Success Stories",      desc: "Inspirez-vous des résultats d'autres créateurs." },
    { Icon: Target,     bg: "#F0F9FF", color: "#0EA5E9", title: "Ciblage Précis",       desc: "Identifiez les micro-niches les plus chaudes." },
  ];

  return (
    <>
      <style>{`
        .cm-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.42);
          display: flex; align-items: flex-end; justify-content: center;
          z-index: 1000;
          animation: cm-fade .18s ease;
        }
        @keyframes cm-fade { from{opacity:0} to{opacity:1} }

        .cm-sheet {
          background: #fff;
          width: 100%;
          border-radius: 20px 20px 0 0;
          overflow: hidden;
          animation: cm-up .24s ease;
          font-family: -apple-system,'Helvetica Neue',sans-serif;
          position: relative;
          display: flex;
          flex-direction: column;
          max-height: 88svh;
        }
        @keyframes cm-up { from{transform:translateY(50px);opacity:0} to{transform:translateY(0);opacity:1} }

        @media (min-width: 700px) {
          .cm-overlay { align-items: center; padding: 24px; }
          .cm-sheet {
            max-width: 900px;
            border-radius: 22px;
            flex-direction: row;
            max-height: 600px;
            animation: cm-pop .22s ease;
          }
          @keyframes cm-pop { from{opacity:0;transform:scale(.97)} to{opacity:1;transform:scale(1)} }
          .cm-handle { display: none !important; }
          .cm-left   { display: flex !important; }
          .cm-hero-mob { display: none !important; }
        }

        /* HANDLE */
        .cm-handle {
          width: 36px; height: 4px;
          background: #E2E2E0; border-radius: 99px;
          margin: 12px auto 0; flex-shrink: 0;
        }

        /* CLOSE */
        .cm-close {
          position: absolute; top: 14px; right: 14px;
          width: 32px; height: 32px; border-radius: 50%;
          border: 1.5px solid #E0E0E0;
          background: #fff; color: #111;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; z-index: 30;
          box-shadow: 0 1px 6px rgba(0,0,0,0.12);
          transition: background .12s;
        }
        .cm-close:hover { background: #F5F5F3; }

        /* LEFT desktop */
        .cm-left {
          display: none;
          width: 300px; flex-shrink: 0;
          background: #111;
          padding: 44px 32px;
          flex-direction: column;
          justify-content: space-between;
        }
        .cm-eyebrow {
          font-size: 10px; font-weight: 700;
          letter-spacing: .13em; text-transform: uppercase;
          color: rgba(255,255,255,.28); margin: 0 0 24px;
        }
        .cm-left-title {
          font-size: 30px; font-weight: 800;
          line-height: 1.1; letter-spacing: -.03em;
          color: #fff; margin: 0 0 14px;
        }
        .cm-left-title em { font-style: italic; font-weight: 300; color: rgba(255,255,255,.35); }
        .cm-left-desc {
          font-size: 13px; line-height: 1.7;
          color: rgba(255,255,255,.38); font-weight: 300; margin: 0;
        }
        .cm-proof-row { display: flex; flex-direction: column; gap: 9px; margin-top: 36px; }
        .cm-proof-item {
          display: flex; align-items: center; gap: 8px;
          font-size: 12px; color: rgba(255,255,255,.38);
        }
        .cm-proof-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: rgba(255,255,255,.2); flex-shrink: 0;
        }

        /* RIGHT */
        .cm-right {
          flex: 1; display: flex; flex-direction: column;
          overflow: hidden;
        }

        /* inner scroll — masqué visuellement */
        .cm-scroll {
          flex: 1; overflow-y: auto;
          display: flex; flex-direction: column;
        }
        .cm-scroll::-webkit-scrollbar { display: none; }
        .cm-scroll { scrollbar-width: none; }

        /* HERO mobile */
        .cm-hero-mob {
          background: #24A1DE;
          padding: 24px 22px 20px;
          text-align: center; flex-shrink: 0;
        }
        .cm-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 12px;
          background: rgba(255,255,255,.18);
          border: 1px solid rgba(255,255,255,.28);
          border-radius: 99px;
          font-size: 9px; font-weight: 700;
          letter-spacing: .1em; text-transform: uppercase;
          color: #fff; margin-bottom: 12px;
        }
        .cm-mob-title {
          font-size: 22px; font-weight: 800;
          color: #fff; letter-spacing: -.02em;
          line-height: 1.15; margin: 0 0 8px;
        }
        .cm-mob-sub {
          font-size: 13px; color: rgba(255,255,255,.85);
          line-height: 1.6; margin: 0;
        }

        /* FEATURES */
        .cm-content {
          padding: 20px 22px 0; flex-shrink: 0;
        }
        @media (min-width: 700px) { .cm-content { padding: 32px 32px 0; } }

        .cm-section-label {
          font-size: 10px; font-weight: 700;
          letter-spacing: .1em; text-transform: uppercase;
          color: #BBBAB7; margin: 0 0 12px;
        }

        .cm-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        @media (max-width: 699px) {
          .cm-grid { grid-template-columns: 1fr; gap: 0; }
        }

        .cm-feature {
          display: flex; align-items: flex-start; gap: 11px;
          padding: 11px 0;
        }
        @media (max-width: 699px) {
          .cm-feature { border-bottom: 1px solid #F2F2F0; }
          .cm-feature:last-child { border-bottom: none; }
        }
        @media (min-width: 700px) {
          .cm-feature {
            padding: 11px 12px; border-radius: 11px;
            transition: background .12s;
          }
          .cm-feature:hover { background: #F8F8F6; }
        }

        .cm-feat-icon {
          width: 34px; height: 34px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .cm-feat-text h4 { font-size: 12.5px; font-weight: 600; color: #0D0D0D; margin: 0 0 2px; }
        .cm-feat-text p  { font-size: 11.5px; color: #999; line-height: 1.5; margin: 0; }

        /* FOOTER */
        .cm-footer {
          padding: 16px 22px 24px; flex-shrink: 0;
        }
        @media (min-width: 700px) { .cm-footer { padding: 20px 32px 32px; } }

        .cm-btn {
          width: 100%;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 14px 20px;
          background: #24A1DE; color: #fff;
          border: none; border-radius: 12px;
          font-size: 14px; font-weight: 700;
          font-family: -apple-system,'Helvetica Neue',sans-serif;
          cursor: pointer;
          transition: opacity .15s, transform .1s;
          -webkit-appearance: none; margin-bottom: 10px;
        }
        .cm-btn:hover { opacity: .88; }
        .cm-btn:active { transform: scale(.98); }

        .cm-trust {
          display: flex; align-items: center; justify-content: center; gap: 14px;
          font-size: 11px; color: #C0BFBC; font-weight: 500;
        }
        .cm-trust span { display: flex; align-items: center; gap: 4px; }
      `}</style>

      <div className="cm-overlay" onClick={(e) => e.target === e.currentTarget && router.back()}>
        <div className="cm-sheet">

          <button className="cm-close" onClick={() => router.back()} aria-label="Fermer">
            <X size={14} strokeWidth={2.5} />
          </button>

          <div className="cm-handle" />

          {/* LEFT desktop */}
          <div className="cm-left">
            <div>
              <p className="cm-eyebrow">Bookzy — Communauté</p>
              <h2 className="cm-left-title">
                Votre réseau<br /><em>de créateurs.</em>
              </h2>
              <p className="cm-left-desc">
                Rejoignez des centaines de créateurs francophones qui construisent leur business d'ebooks chaque jour.
              </p>
              <div className="cm-proof-row">
                {["100% sans pub","Validation experte","Contenu exclusif","Accès immédiat"].map(t => (
                  <div key={t} className="cm-proof-item">
                    <div className="cm-proof-dot" />{t}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="cm-right">
            <div className="cm-scroll">

              {/* Hero mobile */}
              <div className="cm-hero-mob">
                <div className="cm-badge">
                  <MessageCircle size={10} /> Canal Telegram Officiel
                </div>
                <h1 className="cm-mob-title">Club Secret Bookzy</h1>
                <p className="cm-mob-sub">Stratégies d'experts et idées de contenus rentables, gratuitement.</p>
              </div>

              {/* Features */}
              <div className="cm-content">
                <p className="cm-section-label">Ce que vous recevez</p>
                <div className="cm-grid">
                  {features.map(({ Icon, bg, color, title, desc }, i) => (
                    <div key={i} className="cm-feature">
                      <div className="cm-feat-icon" style={{ background: bg }}>
                        <Icon size={16} color={color} strokeWidth={2} />
                      </div>
                      <div className="cm-feat-text">
                        <h4>{title}</h4>
                        <p>{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="cm-footer">
                <button className="cm-btn" onClick={() => window.open(telegramLink, "_blank")}>
                  <Send size={14} />
                  Rejoindre le Canal Telegram
                  <ArrowRight size={14} />
                </button>
                <div className="cm-trust">
                  <span><Lock size={11} /> Sans pub</span>
                  <span><CheckCircle2 size={11} color="#86efac" /> Gratuit</span>
                  <span><CheckCircle2 size={11} color="#86efac" /> Immédiat</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}