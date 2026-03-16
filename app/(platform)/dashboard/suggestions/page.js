// app/(platform)/dashboard/suggestions/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Send, Check, ArrowUpRight, X } from "lucide-react";

export default function SuggestionsPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", description: "", isPublic: false });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Lock scroll body sur mobile quand modal ouvert
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, []);

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      setError("Titre et description requis.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setSuccess(true);
      setForm({ title: "", description: "", isPublic: false });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => router.back();

  if (!mounted) return null;

  return (
    <>
      <style>{`
        .sug-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          z-index: 1000;
          animation: sug-fade .2s ease;
          touch-action: none;
          overscroll-behavior: none;
        }
        @media (min-width: 660px) {
          .sug-overlay {
            align-items: center;
            padding: 24px;
          }
        }
        @keyframes sug-fade { from { opacity:0 } to { opacity:1 } }

        .sug-modal {
          background: #fff;
          border-radius: 24px 24px 0 0;
          width: 100%;
          max-width: 100%;
          box-shadow: 0 -8px 40px rgba(0,0,0,0.15);
          animation: sug-slide .25s ease;
          font-family: -apple-system, 'Helvetica Neue', sans-serif;
          position: relative;
          max-height: 92svh;
          overflow-y: auto;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
          touch-action: pan-y;
        }
        @media (min-width: 660px) {
          .sug-modal {
            border-radius: 22px;
            max-width: 820px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            max-height: 90svh;
            overflow: hidden;
            animation: sug-up .25s ease;
          }
        }
        @keyframes sug-slide {
          from { transform: translateY(100%) }
          to   { transform: translateY(0) }
        }
        @keyframes sug-up {
          from { opacity:0; transform:translateY(12px) }
          to   { opacity:1; transform:translateY(0) }
        }

        /* ── BOUTON FERMER ── */
        .sug-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 2px solid #E0E0E0;
          background: #fff;
          color: #111;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 20;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
          transition: background .15s, transform .1s;
        }
        .sug-close:hover { background: #F5F5F5; transform: scale(1.05); }

        /* ── LEFT (desktop only) ── */
        .sug-left {
          display: none;
        }
        @media (min-width: 660px) {
          .sug-left {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background: #111;
            padding: 44px 36px;
            min-height: 500px;
          }
        }
        .sug-eyebrow {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin: 0 0 28px;
        }
        .sug-title {
          font-size: 34px;
          line-height: 1.1;
          color: #fff;
          font-weight: 700;
          letter-spacing: -0.03em;
          margin: 0 0 18px;
        }
        .sug-title em {
          font-style: italic;
          font-weight: 300;
          color: rgba(255,255,255,0.35);
        }
        .sug-desc {
          font-size: 13px;
          line-height: 1.75;
          color: rgba(255,255,255,0.38);
          font-weight: 300;
          margin: 0;
        }
        .sug-bottom { margin-top: 40px; }
        .sug-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11.5px;
          font-weight: 500;
          color: rgba(255,255,255,0.4);
          text-decoration: none;
          transition: color .15s;
        }
        .sug-link:hover { color: #fff; }
        .sug-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 14px;
        }
        .sug-tag {
          font-size: 10px;
          color: rgba(255,255,255,0.22);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 4px 10px;
          border-radius: 999px;
        }

        /* ── RIGHT / mobile full ── */
        .sug-right {
          padding: 28px 20px 32px;
          display: flex;
          flex-direction: column;
        }
        @media (min-width: 660px) {
          .sug-right { padding: 44px 36px; }
        }

        /* handle mobile */
        .sug-handle {
          width: 36px;
          height: 4px;
          background: #E0E0E0;
          border-radius: 999px;
          margin: 0 auto 20px;
        }
        @media (min-width: 660px) {
          .sug-handle { display: none; }
        }

        .sug-right-title {
          font-size: 20px;
          font-weight: 700;
          color: #0D0D0D;
          letter-spacing: -0.02em;
          margin: 0 0 4px;
          padding-right: 40px;
        }
        .sug-right-sub {
          font-size: 12.5px;
          color: #B0AFAC;
          margin: 0 0 24px;
        }

        .sug-field { margin-bottom: 14px; }
        .sug-fieldlabel {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #C0BFBC;
          display: block;
          margin-bottom: 6px;
        }
        .sug-input, .sug-textarea {
          width: 100%;
          padding: 12px 14px;
          border: 1.5px solid #EBEBEB;
          border-radius: 10px;
          font-size: 16px;
          font-family: -apple-system, 'Helvetica Neue', sans-serif;
          color: #0D0D0D;
          background: #FAFAFA;
          outline: none;
          box-sizing: border-box;
          transition: border-color .15s, background .15s;
          -webkit-appearance: none;
          touch-action: manipulation;
        }
        .sug-input::placeholder, .sug-textarea::placeholder { color: #CCC; }
        .sug-input:focus, .sug-textarea:focus { border-color: #0D0D0D; background: #fff; }
        .sug-textarea { resize: none; height: 100px; line-height: 1.6; }
        .sug-counter { font-size: 10px; color: #D0CFCC; text-align: right; margin-top: 3px; }

        .sug-check {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          cursor: pointer;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1.5px solid #EBEBEB;
          background: #FAFAFA;
          margin-bottom: 16px;
          transition: border-color .15s;
        }
        .sug-check:hover { border-color: #C0BFBC; }
        .sug-check input[type="checkbox"] {
          margin-top: 2px;
          width: 15px;
          height: 15px;
          accent-color: #0D0D0D;
          flex-shrink: 0;
          cursor: pointer;
        }
        .sug-check-text p { font-size: 13px; font-weight: 500; color: #333; margin: 0 0 2px; }
        .sug-check-text span { font-size: 11px; color: #BBB; line-height: 1.4; }

        .sug-error {
          font-size: 12px;
          color: #666;
          margin-bottom: 12px;
          padding: 9px 13px;
          background: #F5F4F0;
          border-radius: 8px;
        }

        .sug-btn {
          width: 100%;
          padding: 15px 0;
          background: #0D0D0D;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-family: -apple-system, 'Helvetica Neue', sans-serif;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: opacity .15s;
          -webkit-appearance: none;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }
        .sug-btn:hover:not(:disabled) { opacity: 0.78; }
        .sug-btn:disabled { opacity: 0.35; cursor: default; }

        /* SUCCESS */
        .sug-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 20px 0 10px;
          flex: 1;
        }
        .sug-checkmark {
          width: 52px; height: 52px;
          border-radius: 50%;
          background: #F2F2F0;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 18px;
        }
        .sug-success-title { font-size: 20px; font-weight: 700; color: #0D0D0D; margin: 0 0 8px; letter-spacing: -0.02em; }
        .sug-success-sub { font-size: 13px; color: #AAA; margin: 0 0 24px; line-height: 1.7; }
        .sug-btn-ghost {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 10px 22px;
          border: 1.5px solid #E0E0E0; border-radius: 9px;
          background: transparent;
          font-size: 13px; font-family: -apple-system, 'Helvetica Neue', sans-serif;
          font-weight: 500; color: #444; cursor: pointer;
          transition: border-color .15s;
          -webkit-appearance: none;
        }
        .sug-btn-ghost:hover { border-color: #0D0D0D; }
      `}</style>

      <div className="sug-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
        <div className="sug-modal">

          {/* ✕ toujours visible — fond blanc, bordure, ombre */}
          <button className="sug-close" onClick={handleClose} aria-label="Fermer">
            <X size={16} strokeWidth={2.5} />
          </button>

          {/* LEFT — desktop */}
          <div className="sug-left">
            <div>
              <p className="sug-eyebrow">Bookzy — Roadmap</p>
              <h2 className="sug-title">
                Vous décidez<br />
                <em>la suite.</em>
              </h2>
              <p className="sug-desc">
                Soumettez votre idée. La communauté vote, et les fonctionnalités les plus demandées arrivent en priorité dans la prochaine version.
              </p>
            </div>
            <div className="sug-bottom">
              <a href="/suggestions" className="sug-link">
                Voir les suggestions en cours <ArrowUpRight size={11} />
              </a>
              <div className="sug-tags">
                {["Génération IA","Templates","Smart Shop","Exports","Crédits"].map(t => (
                  <span key={t} className="sug-tag">{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — form */}
          <div className="sug-right">
            <div className="sug-handle" />

            {success ? (
              <div className="sug-success">
                <div className="sug-checkmark">
                  <Check size={22} color="#0D0D0D" strokeWidth={2.5} />
                </div>
                <p className="sug-success-title">Suggestion envoyée</p>
                <p className="sug-success-sub">Notre équipe va l'examiner.<br />Merci pour votre contribution.</p>
                <button className="sug-btn-ghost" onClick={() => setSuccess(false)}>
                  Soumettre une autre idée
                </button>
              </div>
            ) : (
              <>
                <p className="sug-right-title">Votre idée</p>
                <p className="sug-right-sub">Elle sera examinée avant publication</p>

                <div className="sug-field">
                  <label className="sug-fieldlabel">Titre</label>
                  <input
                    className="sug-input"
                    type="text"
                    placeholder="Ex : Export en EPUB, éditeur collaboratif..."
                    value={form.title}
                    maxLength={100}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>

                <div className="sug-field">
                  <label className="sug-fieldlabel">Description</label>
                  <textarea
                    className="sug-textarea"
                    placeholder="Décrivez votre idée. Quel problème ça résout ?"
                    value={form.description}
                    maxLength={1000}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                  <p className="sug-counter">{form.description.length}/1000</p>
                </div>

                <label className="sug-check">
                  <input
                    type="checkbox"
                    checked={form.isPublic}
                    onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
                  />
                  <div className="sug-check-text">
                    <p>Afficher mon nom et ma photo en public</p>
                    <span>Visible avec votre profil sur la page des suggestions</span>
                  </div>
                </label>

                {error && <div className="sug-error">{error}</div>}

                <button className="sug-btn" onClick={handleSubmit} disabled={loading}>
                  {loading ? "Envoi..." : <><Send size={14} /> Soumettre ma suggestion</>}
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </>
  );
}