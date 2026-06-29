// app/(marketing)/suggestions/Components/SuggestionsNav.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function SuggestionsNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        .snav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          transition: background .25s, box-shadow .25s, backdrop-filter .25s;
          font-family: -apple-system, 'Helvetica Neue', sans-serif;
        }
        .snav-scrolled {
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 1px 0 rgba(0,0,0,0.08);
        }
        .snav-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        /* Logo */
        .snav-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .snav-logo-mark {
          width: 30px; height: 30px;
          border-radius: 8px;
          background: #0D0D0D;
          display: flex; align-items: center; justify-content: center;
          transition: opacity .15s;
        }
        .snav-logo:hover .snav-logo-mark { opacity: 0.75; }
        .snav-logo-mark svg { width: 16px; height: 16px; }
        .snav-logo-name {
          font-size: 15px;
          font-weight: 700;
          letter-spacing: -0.02em;
          transition: color .15s;
        }
        .snav-scrolled .snav-logo-name { color: #0D0D0D; }
        .snav-transparent .snav-logo-name { color: #fff; }

        /* Centre — badge */
        .snav-badge {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 5px 14px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.04em;
          transition: background .25s, border-color .25s, color .25s;
        }
        .snav-scrolled .snav-badge {
          background: #F2F0EB;
          border: 1px solid #E8E6E0;
          color: #0D0D0D;
        }
        .snav-transparent .snav-badge {
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.22);
          color: rgba(255,255,255,0.85);
        }
        .snav-badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #e74c3c;
          animation: snav-pulse 2s ease infinite;
        }
        @keyframes snav-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.8); }
        }

        /* Droite */
        .snav-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .snav-link {
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          padding: 6px 12px;
          border-radius: 8px;
          transition: color .15s, background .15s;
          display: none;
        }
        @media (min-width: 500px) { .snav-link { display: block; } }
        .snav-scrolled .snav-link { color: #666; }
        .snav-scrolled .snav-link:hover { color: #0D0D0D; background: #F5F4F0; }
        .snav-transparent .snav-link { color: rgba(255,255,255,0.65); }
        .snav-transparent .snav-link:hover { color: #fff; background: rgba(255,255,255,0.1); }

        .snav-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: opacity .15s;
          white-space: nowrap;
        }
        .snav-scrolled .snav-btn {
          background: #0D0D0D;
          color: #fff;
        }
        .snav-transparent .snav-btn {
          background: rgba(255,255,255,0.18);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.28);
        }
        .snav-btn:hover { opacity: 0.8; }
      `}</style>

      <nav className={`snav ${scrolled ? "snav-scrolled" : "snav-transparent"}`}>
        <div className="snav-inner">

          {/* Logo → bookzy.io */}
          <Link href="https://bookzy.io" className="snav-logo">
            <img src="/logo12.webp" alt="Bookzy" className="h-7 w-auto object-contain" />
          </Link>

          {/* Centre — badge roadmap */}
          <div className="snav-badge">
            <div className="snav-badge-dot" />
            Roadmap — MARS
          </div>

          {/* Droite */}
          <div className="snav-right">
            <Link href="/changelog" className="snav-link">
              Nouveautés
            </Link>
            <Link href="/auth/login" className="snav-btn">
              Connexion
            </Link>
          </div>

        </div>
      </nav>
    </>
  );
}