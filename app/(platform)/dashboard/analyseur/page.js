"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, BarChart2, TrendingUp, Globe, DollarSign, Users, Target, CheckCircle, Loader2, TrendingDown, Minus, Calendar, BookOpen } from "lucide-react";

export default function AnalyseurPage() {
  const router = useRouter();
  const [sujet, setSujet] = useState("");
  const [error, setError] = useState("");
  const [limitReached, setLimitReached] = useState(false);

  // Animation state
  const [phase, setPhase] = useState("idle"); // idle | scanning | generating | done
  const [steps, setSteps] = useState({
    fb: { status: "waiting", annonceurs: [], total: 0 },
    trends: { status: "waiting", tendance: null },
    marches: { status: "waiting", paysScores: null },
    ia: { status: "waiting" },
    rapport: { status: "waiting" },
  });

  const updateStep = (key, data) => setSteps(prev => ({ ...prev, [key]: { ...prev[key], ...data } }));
  const wait = ms => new Promise(r => setTimeout(r, ms));

  const handleAnalyse = async () => {
    if (!sujet.trim()) return;
    setError("");
    setLimitReached(false);

    // ── Vérifier le quota AVANT de lancer l'animation ────────────────────────
    try {
      const checkRes = await fetch("/api/analyseur/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ sujet: sujet.trim(), checkOnly: true }),
      });
      const checkData = await checkRes.json();
      if (!checkData.success && checkData.limitReached) {
        setLimitReached(true);
        return;
      }
    } catch {}

    // Quota ok → lancer l'animation
    setPhase("scanning");
    setSteps({
      fb: { status: "waiting", annonceurs: [], total: 0 },
      trends: { status: "waiting", tendance: null },
      marches: { status: "waiting", paysScores: null },
      ia: { status: "waiting" },
      rapport: { status: "waiting" },
    });

    try {
      // ── ÉTAPE 1 : FB Ads (via scan route) ────────────────────────────────
      updateStep("fb", { status: "loading" });
      const scanRes = await fetch("/api/analyseur/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ sujet: sujet.trim() }),
      });
      const scanData = await scanRes.json();

      if (!scanData.success) {
        setPhase("idle");
        if (scanData.limitReached) setLimitReached(true);
        else setError("Erreur lors du scan. Réessayez.");
        return;
      }

      if (scanData.success) {
        updateStep("fb", { status: "done", total: scanData.fb.totalAnnonceurs, annonceurs: scanData.fb.annonceurs });
      } else {
        updateStep("fb", { status: "done", total: 0, annonceurs: [] });
      }

      // ── ÉTAPE 2 : Google Trends ───────────────────────────────────────────
      updateStep("trends", { status: "loading" });
      await wait(400); // petit délai visuel
      updateStep("trends", { status: "done", tendance: scanData.trends?.tendance || "stable" });

      // ── ÉTAPE 3 : Comparaison marchés ────────────────────────────────────
      updateStep("marches", { status: "loading" });
      await wait(800);
      updateStep("marches", { status: "done", paysScores: scanData.trends?.paysScores });

      // ── ÉTAPE 4 : Gemini analyse (lancer /analyse en parallèle) ──────────
      updateStep("ia", { status: "loading" });
      setPhase("generating");

      const analyseRes = await fetch("/api/analyseur/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          sujet: sujet.trim(),
          scanData: scanData.success ? { fb: scanData.fb, trends: scanData.trends } : null,
        }),
      });
      const analyseData = await analyseRes.json();

      if (!analyseData.success) {
        setPhase("idle");
        if (analyseData.limitReached) setLimitReached(true);
        else if (analyseData.insufficientCredits) setError(`Crédits insuffisants. Il vous faut ${analyseData.required} crédits.`);
        else setError(analyseData.message || "Erreur.");
        return;
      }

      updateStep("ia", { status: "done" });

      // ── ÉTAPE 5 : Rapport généré ──────────────────────────────────────────
      updateStep("rapport", { status: "loading" });
      await wait(600);
      updateStep("rapport", { status: "done" });

      setPhase("done");
      await wait(400);
      router.push(`/dashboard/analyseur/${analyseData.data.id}?premium=${analyseData.isPremium}`);

    } catch {
      setPhase("idle");
      setError("Erreur serveur. Réessayez.");
    }
  };

  function TendanceLabel({ tendance }) {
    if (tendance === "montante") return <span style={{ color: "#16a34a", fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center", gap: "3px" }}><TrendingUp size={11} /> Montante</span>;
    if (tendance === "descendante") return <span style={{ color: "#dc2626", fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center", gap: "3px" }}><TrendingDown size={11} /> Descendante</span>;
    return <span style={{ color: "#94a3b8", fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center", gap: "3px" }}><Minus size={11} /> Stable</span>;
  }

  const STEP_CONFIG = [
    { key: "fb",      Icon: Users,      color: "#1877f2", label: "Scan Facebook Ads" },
    { key: "trends",  Icon: TrendingUp, color: "#16a34a", label: "Google Trends" },
    { key: "marches", Icon: Globe,      color: "#0891b2", label: "Comparaison des marchés" },
    { key: "ia",      Icon: BarChart2,  color: "#7c3aed", label: "Analyse IA" },
    { key: "rapport", Icon: Target,     color: "#f59e0b", label: "Génération du rapport" },
  ];

  // Vue animation
  if (phase !== "idle") return (
    <div style={{ minHeight: "100vh", background: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>

        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "20px", marginBottom: "14px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#16a34a", animation: "pulse 1.5s ease-in-out infinite" }} />
            <span style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>Analyse en cours</span>
          </div>
          <h2 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px", lineHeight: "1.3" }}>"{sujet}"</h2>
          <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>Analyse sur plusieurs sources de données réelles</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
          {STEP_CONFIG.map(({ key, Icon, color, label }) => {
            const step = steps[key];
            const done = step.status === "done";
            const loading = step.status === "loading";
            const waiting = step.status === "waiting";

            return (
              <div key={key} style={{
                padding: "14px 16px", borderRadius: "12px",
                background: done ? "#f0fdf4" : loading ? "white" : "#f8fafc",
                border: `1px solid ${done ? "#bbf7d0" : loading ? "#e2e8f0" : "#f1f5f9"}`,
                boxShadow: loading ? "0 2px 12px rgba(0,0,0,0.06)" : "none",
                opacity: waiting ? 0.4 : 1,
                transition: "all 0.3s ease",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "34px", height: "34px", borderRadius: "9px", flexShrink: 0, background: done ? "#dcfce7" : loading ? `${color}15` : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {done ? <CheckCircle size={17} color="#16a34a" /> : <Icon size={17} color={loading ? color : "#cbd5e1"} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "13px", fontWeight: "700", color: done ? "#15803d" : loading ? "#0f172a" : "#94a3b8", margin: 0 }}>{label}</p>

                    {/* Détails FB Ads */}
                    {key === "fb" && done && (
                      <div style={{ marginTop: "8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                          <span style={{ fontSize: "12px", fontWeight: "700", color: "#1877f2" }}>{step.total} annonceurs actifs</span>
                        </div>
                        {step.annonceurs.length > 0 && (
                          <div style={{ display: "flex" }}>
                            {step.annonceurs.slice(0, 4).map((a, i) => (
                              <div key={i} style={{ width: "28px", height: "28px", borderRadius: "50%", overflow: "hidden", border: "2px solid white", marginLeft: i > 0 ? "-8px" : "0", background: "#e2e8f0", flexShrink: 0 }}>
                                {a.photo && <img src={a.photo} alt={a.nom} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                              </div>
                            ))}
                            {step.total > 4 && (
                              <div style={{ width: "28px", height: "28px", borderRadius: "50%", border: "2px solid white", marginLeft: "-8px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: "700", color: "#64748b" }}>
                                +{step.total - 4}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tendance Google */}
                    {key === "trends" && done && step.tendance && (
                      <div style={{ marginTop: "4px" }}>
                        <TendanceLabel tendance={step.tendance} />
                      </div>
                    )}

                    {/* Pays */}
                    {key === "marches" && done && step.paysScores && (
                      <div style={{ marginTop: "6px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {Object.entries(step.paysScores).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([code, score]) => {
                          const flags = { CI: "🇨🇮", SN: "🇸🇳", CM: "🇨🇲", ML: "🇲🇱", BJ: "🇧🇯", TG: "🇹🇬", FR: "🇫🇷" };
                          return (
                            <div key={code} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "2px 8px", background: "white", border: "1px solid #e2e8f0", borderRadius: "20px" }}>
                              <span style={{ fontSize: "12px" }}>{flags[code]}</span>
                              <span style={{ fontSize: "10px", fontWeight: "700", color: "#0f172a" }}>{score}/100</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* IA */}
                    {key === "ia" && loading && (
                      <p style={{ fontSize: "11px", color: "#94a3b8", margin: "3px 0 0" }}>Bookzy analyse vos données de marché...</p>
                    )}
                    {key === "rapport" && loading && (
                      <p style={{ fontSize: "11px", color: "#94a3b8", margin: "3px 0 0" }}>Score, verdict, revenus, titres accrocheurs...</p>
                    )}
                  </div>
                  {loading && <Loader2 size={15} color={color} style={{ flexShrink: 0, animation: "spin 1s linear infinite" }} />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Barre progression */}
        <div style={{ background: "#f1f5f9", borderRadius: "4px", height: "4px", overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: "4px", background: "#0f172a",
            width: `${Math.max(5, (Object.values(steps).filter(s => s.status === "done").length / STEP_CONFIG.length) * 100)}%`,
            transition: "width 0.5s ease",
          }} />
        </div>
        <p style={{ fontSize: "11px", color: "#94a3b8", textAlign: "center", marginTop: "8px" }}>
          {Object.values(steps).filter(s => s.status === "done").length}/{STEP_CONFIG.length} étapes complétées
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );

  // Vue normale
  return (
    <div style={{ minHeight: "100vh", background: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>

      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <div style={{ width: "44px", height: "44px", background: "#0f172a", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BarChart2 size={22} color="white" />
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: "900", color: "#0f172a", margin: 0, letterSpacing: "-0.8px", lineHeight: "1.2" }}>
            Ton produit digital va-t-il cartonner ?
          </h1>
        </div>
        <p style={{ fontSize: "15px", color: "#94a3b8", margin: 0 }}>
          Decouvre le potentiel de ton idée de produit digital en quelques secondes grâce à une analyse de données réelles et un rapport clair pour foncer ou pivoter.
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: "600px" }}>
        <div style={{ position: "relative", boxShadow: "0 2px 20px rgba(0,0,0,0.08)", borderRadius: "16px" }}>
          <input type="text" value={sujet} onChange={e => setSujet(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sujet.trim() && handleAnalyse()}
            placeholder="Ton idée ici..."
            style={{ width: "100%", padding: "22px 68px 22px 22px", fontSize: "16px", border: "2px solid #e2e8f0", borderRadius: "16px", outline: "none", color: "#0f172a", background: "white", boxSizing: "border-box", transition: "border 0.2s" }}
            onFocus={e => e.target.style.borderColor = "#0f172a"}
            onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
          <button onClick={handleAnalyse} disabled={!sujet.trim()}
            style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", width: "44px", height: "44px", background: sujet.trim() ? "#0f172a" : "#e2e8f0", border: "none", borderRadius: "10px", cursor: sujet.trim() ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}>
            <Search size={17} color={sujet.trim() ? "white" : "#94a3b8"} />
          </button>
        </div>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "10px 16px", marginTop: "12px", color: "#dc2626", fontSize: "13px" }}>{error}</div>
        )}

        {limitReached && (
          <div style={{ background: "#0f172a", borderRadius: "12px", padding: "20px", marginTop: "16px" }}>
            <p style={{ fontSize: "14px", fontWeight: "800", color: "white", margin: "0 0 6px" }}>Passez à un abonnement pour analyser</p>
            <p style={{ fontSize: "13px", color: "#94a3b8", margin: "0 0 16px", lineHeight: "1.6" }}>Analysez autant de sujets que vous voulez et accédez aux rapports complets.</p>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => router.push("/dashboard/tarifs")} style={{ flex: 1, padding: "11px", background: "#f59e0b", color: "#0f172a", border: "none", borderRadius: "9px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>Voir les plans →</button>
              <button onClick={() => router.push("/dashboard/analyseur/historique")} style={{ padding: "11px 16px", background: "transparent", color: "#64748b", border: "1px solid #1e293b", borderRadius: "9px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>Mes analyses</button>
            </div>
          </div>
        )}
      </div>

      <div style={{ width: "100%", maxWidth: "900px", marginTop: "48px" }}>
        <p style={{ fontSize: "11px", fontWeight: "700", color: "#cbd5e1", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "16px", textAlign: "center" }}>Votre rapport contiendra</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
          <style>{`@media(max-width:600px){.promises-grid{grid-template-columns:1fr 1fr!important;}}`}</style>
          {[
            { Icon: TrendingUp, color: "#16a34a", titre: "Score de marché", desc: "Un verdict clair sur 100 pour savoir si tu dois foncer" },
            { Icon: Users, color: "#1877f2", titre: "Annonceurs Facebook actifs", desc: "Qui investit déjà sur ce sujet avec leurs photos de profil" },
            { Icon: Globe, color: "#0891b2", titre: "Pays les plus rentables", desc: "Score par pays pour concentrer tes efforts de vente" },
            { Icon: Target, color: "#7c3aed", titre: "Positionnement concurrents", desc: "Leur stratégie et comment te différencier" },
            { Icon: DollarSign, color: "#f59e0b", titre: "Revenus estimés", desc: "Ce que ce produit peut te rapporter semaine / mois / an" },
            { Icon: BarChart2, color: "#10b981", titre: "Plan de vente complet", desc: "Pratiques pour vendre rapidement via Taliopay" },
            { Icon: TrendingUp, color: "#dc2626", titre: "Verdict honnête", desc: "Fonce / Attends / Évite — basé sur les vraies données" },
            { Icon: Target, color: "#0f172a", titre: "Battre la concurrence", desc: "Ton angle gagnant pour dominer le marché" },
            { Icon: Calendar, color: "#7c3aed", titre: "Plan de lancement", desc: "4 semaines d'actions concrètes" },
            { Icon: BookOpen, color: "#0f172a", titre: "Titres accrocheurs", desc: "3 titres optimisés pour vendre immédiatement" },
          ].map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "16px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #f1f5f9" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: `${p.color}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <p.Icon size={16} color={p.color} />
              </div>
              <div>
                <p style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px" }}>{p.titre}</p>
                <p style={{ fontSize: "12px", color: "#64748b", margin: 0, lineHeight: "1.5" }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}