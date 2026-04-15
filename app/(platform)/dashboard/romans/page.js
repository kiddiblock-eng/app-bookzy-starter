"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, ArrowRight, ArrowLeft, Plus, Trash2, Loader2, Wand2, User, Heart, Compass, Shield, Search, BookMarked, FileText, Feather, Swords, Moon } from "lucide-react";
import { useCredits } from "@/hooks/useCredits";

const GENRES = [
  { id: "thriller", label: "Thriller", Icon: Shield, color: "#dc2626", desc: "Suspense et danger" },
  { id: "romance", label: "Romance", Icon: Heart, color: "#be185d", desc: "Histoire d'amour" },
  { id: "aventure", label: "Aventure", Icon: Compass, color: "#d97706", desc: "Action et découvertes" },
  { id: "drame", label: "Drame", Icon: Feather, color: "#7c3aed", desc: "Émotions profondes" },
  { id: "fantasy", label: "Fantasy", Icon: Moon, color: "#0891b2", desc: "Magie et mondes imaginaires" },
  { id: "policier", label: "Policier", Icon: Search, color: "#475569", desc: "Enquête et mystère" },
];

const CADRES = [
  { id: "afrique", label: "Afrique", flag: "🌍" },
  { id: "europe", label: "Europe", flag: "🏰" },
  { id: "amerique", label: "Amérique", flag: "🗽" },
  { id: "universel", label: "Universel", flag: "🌐" },
];

const LONGUEURS = [
  { id: "court", label: "Court", pages: "20-30 pages", chapitres: "6 chapitres", credits: 20, Icon: BookOpen },
  { id: "moyen", label: "Moyen", pages: "50-70 pages", chapitres: "10 chapitres", credits: 35, Icon: BookMarked },
  { id: "long", label: "Long", pages: "100+ pages", chapitres: "15 chapitres", credits: 50, Icon: FileText },
];

const TONS = [
  { id: "dramatique", label: "Dramatique" },
  { id: "sombre", label: "Sombre" },
  { id: "leger", label: "Léger" },
  { id: "humoristique", label: "Humoristique" },
];

const EPOQUES = [
  { id: "contemporaine", label: "Contemporaine" },
  { id: "historique", label: "Historique" },
  { id: "futuriste", label: "Futuriste" },
  { id: "medievale", label: "Médiévale" },
];

const ROLES = [
  { id: "heros", label: "Héros/Héroïne" },
  { id: "antagoniste", label: "Antagoniste" },
  { id: "love_interest", label: "Intérêt romantique" },
  { id: "secondaire", label: "Personnage secondaire" },
];

const TEMPLATES = [
  { id: "classique", label: "Classique", desc: "Élégant, serif, livre de poche", color: "#1e293b", bg: "#ffffff", titleColor: "#0f172a", lineColor: "#94a3b8", accent: true, ornement: null },
  { id: "sombre", label: "Sombre", desc: "Fond noir, accents dorés, thriller", color: "#d4af37", bg: "#0a0a0a", titleColor: "#ffffff", lineColor: "#475569", accent: false, ornement: "◆" },
  { id: "romance", label: "Romance", desc: "Tons crème, ornements floraux", color: "#be185d", bg: "#fdf8f3", titleColor: "#1e1b4b", lineColor: "#be185d", accent: false, ornement: "❧" },
  { id: "moderne", label: "Moderne", desc: "Minimaliste, bold, contemporain", color: "#2563eb", bg: "#ffffff", titleColor: "#111111", lineColor: "#94a3b8", accent: true, ornement: null },
];

const PUBLIC_CIBLE = [
  { id: "adulte", label: "Adulte" },
  { id: "jeunes_adultes", label: "Jeunes adultes (18-25)" },
  { id: "ados", label: "Adolescents" },
];

export default function RomansPage() {
  const router = useRouter();
  const { mutateBalance } = useCredits();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Config
  const [genre, setGenre] = useState("");
  const [cadre, setCadre] = useState("afrique");
  const [longueur, setLongueur] = useState("moyen");
  const [ton, setTon] = useState("dramatique");
  const [publicCible, setPublicCible] = useState("adulte");
  const [template, setTemplate] = useState("classique");

  // Personnages
  const [personnages, setPersonnages] = useState([
    { nom: "", age: "", role: "heros", description: "" }
  ]);

  // Histoire
  const [decor, setDecor] = useState("");
  const [epoque, setEpoque] = useState("contemporaine");
  const [intrigue, setIntrigue] = useState("");
  const [twist, setTwist] = useState("");

  const selectedLongueur = LONGUEURS.find(l => l.id === longueur);

  const addPersonnage = () => {
    setPersonnages([...personnages, { nom: "", age: "", role: "secondaire", description: "" }]);
  };

  const removePersonnage = (idx) => {
    setPersonnages(personnages.filter((_, i) => i !== idx));
  };

  const updatePersonnage = (idx, field, value) => {
    const updated = [...personnages];
    updated[idx][field] = value;
    setPersonnages(updated);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/romans/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          genre, cadre, longueur, ton, publicCible, template,
          personnages: personnages.filter(p => p.nom.trim()),
          decor, epoque, intrigue, twist,
        }),
      });
      const data = await res.json();

      if (!data.success) {
        if (data.insufficientCredits) {
          setError(`Crédits insuffisants. Il vous faut ${data.required} crédits (solde: ${data.balance} cr.)`);
        } else {
          setError(data.message || "Erreur lors de la génération.");
        }
        setLoading(false);
        return;
      }

      mutateBalance();
      router.push(`/dashboard/romans/${data.data.romanId}`);
    } catch (e) {
      setError("Erreur serveur. Réessayez.");
      setLoading(false);
    }
  };

  // ── LOADING ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <BookOpen size={28} color="white" />
        </div>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", margin: "0 0 8px" }}>Génération de votre roman...</h2>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>L'IA écrit chaque chapitre. Cela peut prendre 1 à 3 minutes.</p>
        </div>
        <Loader2 size={32} color="#6366f1" style={{ animation: "spin 1s linear infinite" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "300px", width: "100%" }}>
          {["Création du plan narratif...", "Écriture des chapitres...", "Finalisation du roman..."].map((msg, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <Loader2 size={14} color="#6366f1" style={{ animation: "spin 1s linear infinite", flexShrink: 0 }} />
              <span style={{ fontSize: "13px", color: "#475569" }}>{msg}</span>
            </div>
          ))}
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 24px" }}>

      {/* HEADER */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
          <BookOpen size={24} color="white" />
        </div>
        <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", margin: "0 0 6px" }}>Romans IA</h1>
        <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>Créez un roman complet en quelques minutes grâce à l'IA</p>
      </div>

      {/* PROGRESS */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "28px" }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ flex: 1, height: "4px", borderRadius: "2px", background: i <= step ? "#0f172a" : "#e2e8f0", transition: "background 0.3s" }} />
        ))}
      </div>

      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", color: "#dc2626", fontSize: "13px" }}>
          {error}
        </div>
      )}

      {/* ── ÉTAPE 1 : Genre + Longueur + Template ── */}
      {step === 1 && (
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "16px" }}>Genre & Format</h2>

          <p style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", letterSpacing: "0.08em", marginBottom: "8px" }}>GENRE</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "8px", marginBottom: "20px" }}>
            {GENRES.map(g => (
              <button key={g.id} onClick={() => setGenre(g.id)}
                style={{ padding: "12px 8px", border: `2px solid ${genre === g.id ? g.color : "#e2e8f0"}`, borderRadius: "10px", background: genre === g.id ? g.color : "white", cursor: "pointer", textAlign: "center", transition: "all 0.15s" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "6px" }}>
                  <g.Icon size={20} color={genre === g.id ? "white" : g.color} />
                </div>
                <p style={{ fontSize: "12px", fontWeight: "700", color: genre === g.id ? "white" : "#0f172a", margin: "0 0 2px" }}>{g.label}</p>
                <p style={{ fontSize: "10px", color: genre === g.id ? "rgba(255,255,255,0.7)" : "#64748b", margin: 0 }}>{g.desc}</p>
              </button>
            ))}
          </div>

          <p style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", letterSpacing: "0.08em", marginBottom: "8px" }}>LONGUEUR</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "20px" }}>
            {LONGUEURS.map(l => (
              <button key={l.id} onClick={() => setLongueur(l.id)}
                style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", border: `2px solid ${longueur === l.id ? "#0f172a" : "#e2e8f0"}`, borderRadius: "10px", background: longueur === l.id ? "#f8fafc" : "white", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: longueur === l.id ? "#0f172a" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <l.Icon size={18} color={longueur === l.id ? "white" : "#64748b"} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 2px" }}>{l.label}</p>
                  <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>{l.pages} · {l.chapitres}</p>
                </div>
                <span style={{ fontSize: "13px", fontWeight: "700", color: longueur === l.id ? "#0f172a" : "#94a3b8", background: longueur === l.id ? "#e2e8f0" : "#f8fafc", padding: "4px 10px", borderRadius: "20px" }}>
                  {l.credits} cr.
                </span>
              </button>
            ))}
          </div>

          <p style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", letterSpacing: "0.08em", marginBottom: "8px" }}>TEMPLATE</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "24px" }}>
            {TEMPLATES.map(t => (
              <button key={t.id} onClick={() => setTemplate(t.id)}
                style={{ padding: "0", border: `2px solid ${template === t.id ? t.color : "#e2e8f0"}`, borderRadius: "12px", background: "white", cursor: "pointer", overflow: "hidden", textAlign: "left", transition: "all 0.15s" }}>
                {/* Mini aperçu */}
                <div style={{ height: "90px", background: t.bg, padding: "10px 12px", display: "flex", flexDirection: "column", gap: "5px", position: "relative", overflow: "hidden" }}>
                  {/* Ligne titre */}
                  <div style={{ height: "8px", width: "70%", borderRadius: "2px", background: t.titleColor, opacity: 0.9 }} />
                  {/* Lignes texte */}
                  <div style={{ height: "4px", width: "90%", borderRadius: "2px", background: t.lineColor, opacity: 0.5 }} />
                  <div style={{ height: "4px", width: "80%", borderRadius: "2px", background: t.lineColor, opacity: 0.4 }} />
                  <div style={{ height: "4px", width: "85%", borderRadius: "2px", background: t.lineColor, opacity: 0.3 }} />
                  {/* Ornement */}
                  {t.ornement && <div style={{ position: "absolute", right: "10px", bottom: "8px", fontSize: "18px", opacity: 0.4 }}>{t.ornement}</div>}
                  {/* Accent */}
                  {t.accent && <div style={{ position: "absolute", left: "0", top: "0", bottom: "0", width: "3px", background: t.color }} />}
                </div>
                {/* Label */}
                <div style={{ padding: "8px 12px" }}>
                  <p style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", margin: "0 0 2px" }}>{t.label}</p>
                  <p style={{ fontSize: "11px", color: "#64748b", margin: 0 }}>{t.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <button onClick={() => genre && setStep(2)} disabled={!genre}
            style={{ width: "100%", padding: "13px", background: genre ? "#0f172a" : "#e2e8f0", color: genre ? "white" : "#94a3b8", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: genre ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            Continuer <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* ── ÉTAPE 2 : Personnages ── */}
      {step === 2 && (
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>Personnages</h2>
          <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "8px" }}>Définissez vos personnages. Plus vous donnez de détails, plus le roman sera fidèle à votre vision.</p>
          <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", fontSize: "12px", color: "#92400e" }}>
            💡 <strong>Recommandé :</strong> Ajoutez au moins 2-3 personnages — un héros, un antagoniste, et un personnage secondaire. Plus vos descriptions sont riches, plus l'histoire sera cohérente.
          </div>

          {personnages.map((p, idx) => (
            <div key={idx} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "16px", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <User size={14} color="#94a3b8" />
                  <span style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Personnage {idx + 1}</span>
                </div>
                {idx > 0 && (
                  <button onClick={() => removePersonnage(idx)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
                <input type="text" placeholder="Prénom *" value={p.nom} onChange={e => updatePersonnage(idx, "nom", e.target.value)}
                  style={{ padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", color: "#0f172a", outline: "none", background: "white" }} />
                <input type="text" placeholder="Âge (recommandé)" value={p.age} onChange={e => updatePersonnage(idx, "age", e.target.value)}
                  style={{ padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", color: "#0f172a", outline: "none", background: "white" }} />
              </div>
              <select value={p.role} onChange={e => updatePersonnage(idx, "role", e.target.value)}
                style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", color: "#0f172a", background: "white", marginBottom: "8px", outline: "none" }}>
                {ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
              </select>
              <textarea placeholder="Description du personnage — recommandé pour plus de profondeur" value={p.description} onChange={e => updatePersonnage(idx, "description", e.target.value)}
                rows={2}
                style={{ width: "100%", padding: "9px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", color: "#0f172a", background: "white", outline: "none", resize: "none", boxSizing: "border-box" }} />
            </div>
          ))}

          {personnages.length < 5 && (
            <button onClick={addPersonnage}
              style={{ width: "100%", padding: "10px", background: "white", border: "1px dashed #cbd5e1", borderRadius: "10px", fontSize: "13px", fontWeight: "600", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginBottom: "20px" }}>
              <Plus size={14} /> Ajouter un personnage
            </button>
          )}

          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => setStep(1)}
              style={{ flex: 1, padding: "13px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
              <ArrowLeft size={16} /> Retour
            </button>
            <button onClick={() => setStep(3)}
              style={{ flex: 2, padding: "13px", background: "#0f172a", color: "white", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              Continuer <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── ÉTAPE 3 : Décor + Intrigue ── */}
      {step === 3 && (
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>Cadre & Histoire</h2>
          <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px" }}>Plus vous donnez de détails, plus le roman sera unique. L'IA invente le reste.</p>

          <p style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", letterSpacing: "0.08em", marginBottom: "8px" }}>CADRE GÉOGRAPHIQUE</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "14px" }}>
            {CADRES.map(c => (
              <button key={c.id} onClick={() => setCadre(c.id)}
                style={{ padding: "10px", border: `1.5px solid ${cadre === c.id ? "#0f172a" : "#e2e8f0"}`, borderRadius: "8px", background: cadre === c.id ? "#0f172a" : "white", color: cadre === c.id ? "white" : "#475569", cursor: "pointer", fontSize: "13px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>{c.emoji}</span>{c.label}
              </button>
            ))}
          </div>

          <input type="text" placeholder="Lieu précis (ex: Abidjan, Paris, forêt mystérieuse...)" value={decor} onChange={e => setDecor(e.target.value)}
            style={{ width: "100%", padding: "11px 14px", border: "1px solid #e2e8f0", borderRadius: "9px", fontSize: "13px", color: "#0f172a", outline: "none", marginBottom: "14px", boxSizing: "border-box" }} />

          <p style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", letterSpacing: "0.08em", marginBottom: "8px" }}>ÉPOQUE</p>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "14px" }}>
            {EPOQUES.map(e => (
              <button key={e.id} onClick={() => setEpoque(e.id)}
                style={{ padding: "7px 14px", border: `1.5px solid ${epoque === e.id ? "#0f172a" : "#e2e8f0"}`, borderRadius: "20px", background: epoque === e.id ? "#0f172a" : "white", color: epoque === e.id ? "white" : "#475569", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>
                {e.label}
              </button>
            ))}
          </div>

          <p style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", letterSpacing: "0.08em", marginBottom: "8px" }}>TON DU ROMAN</p>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "14px" }}>
            {TONS.map(t => (
              <button key={t.id} onClick={() => setTon(t.id)}
                style={{ padding: "7px 14px", border: `1.5px solid ${ton === t.id ? "#0f172a" : "#e2e8f0"}`, borderRadius: "20px", background: ton === t.id ? "#0f172a" : "white", color: ton === t.id ? "white" : "#475569", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>
                {t.label}
              </button>
            ))}
          </div>

          <p style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", letterSpacing: "0.08em", marginBottom: "8px" }}>INTRIGUE PRINCIPALE</p>
          <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "8px", padding: "10px 14px", marginBottom: "8px", fontSize: "12px", color: "#92400e" }}>
            💡 <strong>Recommandé :</strong> Décrivez le point de départ, le conflit principal et comment vous imaginez la fin. Ex: "Un détective découvre une corruption, est traqué, et doit choisir entre fuir ou exposer la vérité."
          </div>
          <textarea placeholder="Décrivez votre histoire — plus c'est détaillé, plus le roman vous ressemble..."
            value={intrigue} onChange={e => setIntrigue(e.target.value)} rows={4}
            style={{ width: "100%", padding: "11px 14px", border: "1px solid #e2e8f0", borderRadius: "9px", fontSize: "13px", color: "#0f172a", outline: "none", resize: "none", marginBottom: "10px", boxSizing: "border-box" }} />

          <input type="text" placeholder="Rebondissement/twist — recommandé pour un roman captivant" value={twist} onChange={e => setTwist(e.target.value)}
            style={{ width: "100%", padding: "11px 14px", border: "1px solid #e2e8f0", borderRadius: "9px", fontSize: "13px", color: "#0f172a", outline: "none", marginBottom: "20px", boxSizing: "border-box" }} />

          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => setStep(2)}
              style={{ flex: 1, padding: "13px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
              <ArrowLeft size={16} /> Retour
            </button>
            <button onClick={() => setStep(4)}
              style={{ flex: 2, padding: "13px", background: "#0f172a", color: "white", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              Continuer <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── ÉTAPE 4 : Récap + Lancer ── */}
      {step === 4 && (
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>Récapitulatif</h2>
          <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px" }}>Vérifiez et lancez la génération de votre roman.</p>

          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
            {[
              ["Genre", GENRES.find(g => g.id === genre)?.label || genre],
              ["Longueur", `${selectedLongueur?.label} — ${selectedLongueur?.pages} · ${selectedLongueur?.chapitres}`],
              ["Template", TEMPLATES.find(t => t.id === template)?.label],
              ["Cadre", `${CADRES.find(c => c.id === cadre)?.label}${decor ? " — " + decor : ""}`],
              ["Époque", EPOQUES.find(e => e.id === epoque)?.label],
              ["Ton", TONS.find(t => t.id === ton)?.label],
              ["Personnages", personnages.filter(p => p.nom).map(p => p.nom).join(", ") || "Définis par l'IA"],
              ["Intrigue", intrigue || "Inventée par l'IA"],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>{label}</span>
                <span style={{ fontSize: "12px", color: "#0f172a", fontWeight: "500", textAlign: "right", maxWidth: "60%" }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Aperçu gratuit */}
          

          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => setStep(3)}
              style={{ flex: 1, padding: "13px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
              <ArrowLeft size={16} /> Retour
            </button>
            <button onClick={handleGenerate}
              style={{ flex: 2, padding: "13px", background: "#0f172a", color: "white", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <BookOpen size={16} /> Générer l'aperçu gratuit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}