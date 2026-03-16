"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight, Calculator, DollarSign, Users, Repeat,
  CheckCircle2, HelpCircle, Smartphone, Globe, Wallet,
  Menu, X, Instagram, Twitter, Coins, TrendingUp, Check,
  ChevronDown
} from "lucide-react";

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`;

const COMMISSION_RATE = 0.10;
const PACK_PRICES = { solo: 5100, createur: 19125, agence: 31500 };
const PACK_LABELS = { solo: "Pass Solo", createur: "Pack Créateur", agence: "Pack Agence" };

function BookOpenSVG(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  );
}

// ── NAV ────────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (e, id) => {
    e.preventDefault();
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const links = [
    { label: "Dashboard", id: "dashboard" },
    { label: "Simulateur", id: "simulateur" },
    { label: "Comment ça marche", id: "comment-ca-marche" },
    { label: "FAQ", id: "faq" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#F5F2ED]/95 backdrop-blur-md border-b border-[#D6CFC4] shadow-sm" : "bg-transparent"}`}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
            <BookOpenSVG className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-black text-slate-900 tracking-tight">Bookzy</span>
            <span className="text-slate-400 font-bold"> Partners</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l.id} href={`#${l.id}`} onClick={e => scrollTo(e, l.id)}
              className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/auth/login" className="px-4 py-2 border border-[#C8BFB0] bg-white text-slate-600 text-[11px] font-bold rounded-lg uppercase tracking-widest hover:border-slate-400 transition-colors">
            Connexion
          </Link>
          <Link href="/auth/register" className="px-4 py-2 bg-slate-900 text-white text-[11px] font-bold rounded-lg uppercase tracking-widest hover:bg-slate-800 transition-colors flex items-center gap-1.5">
            Commencer <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg hover:bg-[#E8E2D9]">
          {open ? <X className="w-5 h-5 text-slate-700" /> : <Menu className="w-5 h-5 text-slate-700" />}
        </button>
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-[#F5F2ED] border-b border-[#D6CFC4] p-6 shadow-xl flex flex-col gap-4 md:hidden">
          {links.map(l => (
            <a key={l.id} href={`#${l.id}`} onClick={e => scrollTo(e, l.id)}
              className="text-sm font-black text-slate-700 uppercase tracking-widest py-2 border-b border-[#E8E2D9]">
              {l.label}
            </a>
          ))}
          <div className="flex flex-col gap-3 mt-1">
            <Link href="/auth/login" onClick={() => setOpen(false)} className="text-center py-3 font-bold text-slate-600 border border-[#C8BFB0] rounded-xl text-sm">Connexion</Link>
            <Link href="/auth/register" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-xl font-black text-sm uppercase tracking-widest">
              Commencer gratuitement
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

// ── HERO ────────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#F5F2ED] px-6"
      style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 80px)", paddingBottom: "80px" }}>
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="absolute top-20 right-[-80px] w-[380px] h-[380px] rounded-full border border-[#D6CFC4] opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-60px] left-[-100px] w-[300px] h-[300px] rounded-full bg-emerald-50 opacity-40 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">

        <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#C8BFB0] rounded-full bg-white/60 backdrop-blur-sm mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Programme Affilié Bookzy</span>
        </div>

        <h1 className="font-black text-slate-900 tracking-tight leading-[0.92] mb-8" style={{ fontSize: "clamp(3rem, 9vw, 6.5rem)" }}>
          <span className="block">Recommande Bookzy.</span>
          <span className="block text-emerald-600">Gagne 10% à vie.</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-500 max-w-xl mx-auto mb-12 leading-relaxed">
          Ton lien affilié est créé automatiquement à l'inscription. Dashboard complet inclus pour tout suivre.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 sm:gap-12 mb-14">
          {[
            { val: "10%",    label: "Commission à vie" },
            { val: "0 FCFA", label: "Pour démarrer" },
            { val: "Wave",   label: "Orange · MTN · Crypto" },
            { val: "Auto",   label: "Dashboard inclus" },
          ].map(s => (
            <div key={s.val} className="text-center">
              <p className="text-2xl sm:text-4xl font-black text-slate-900">{s.val}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/register" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-800 transition-colors text-sm uppercase tracking-widest">
            Créer mon compte gratuit <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="#simulateur" onClick={e => { e.preventDefault(); document.getElementById("simulateur")?.scrollIntoView({ behavior: "smooth" }); }}
            className="inline-flex items-center gap-2 px-8 py-4 border border-[#C8BFB0] text-slate-700 font-bold rounded-xl hover:border-slate-400 transition-colors text-sm uppercase tracking-widest">
            Simuler mes gains
          </a>
        </div>
      </div>
    </section>
  );
}

// ── DASHBOARD ──────────────────────────────────────────────────────────────────
function Dashboard() {
  return (
    <section id="dashboard" className="bg-[#EDE8E0] py-16 lg:py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-5xl mx-auto">

        <div className="mb-12 pb-8 border-b border-[#C8BFB0]">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Ton espace</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[0.92]">Dashboard Affilié</h2>
          <p className="text-slate-500 mt-3 text-base">Automatiquement créé dès ton inscription. Tout est là.</p>
        </div>

        <div className="space-y-5">

          {/* Stats */}
          <div className="bg-white border border-[#C8BFB0] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E8E2D9] flex items-center gap-2">
              <Wallet className="w-4 h-4 text-slate-400" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Vue d'ensemble</p>
            </div>
            <div className="p-6 grid md:grid-cols-3 gap-4">
              <div className="bg-slate-900 rounded-xl p-5 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Solde disponible</p>
                  <p className="text-3xl font-black">625 000 F</p>
                  <p className="text-xs text-white/40 mt-1 uppercase tracking-widest">Prêt à retirer</p>
                </div>
              </div>
              <div className="bg-[#F5F2ED] border border-[#D6CFC4] rounded-xl p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Filleuls inscrits</p>
                <p className="text-3xl font-black text-slate-900">142</p>
                <p className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +23 ce mois
                </p>
              </div>
              <div className="bg-[#F5F2ED] border border-[#D6CFC4] rounded-xl p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Ce mois</p>
                <p className="text-3xl font-black text-slate-900">95 625 F</p>
                <p className="text-xs text-slate-400 mt-1">141 ebooks vendus</p>
              </div>
            </div>
          </div>

          {/* Historique */}
          <div className="bg-white border border-[#C8BFB0] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E8E2D9] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Historique des paiements</p>
              </div>
              <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] font-black rounded-full uppercase tracking-widest">Tout payé</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-[#E8E2D9]">
                  <tr>
                    {["Date", "Méthode", "Montant", "Statut"].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F2ED]">
                  {[
                    { date: "12 Jan 2026", method: "Orange Money", amount: "150 000", color: "bg-orange-500" },
                    { date: "05 Jan 2026", method: "Wave CI",       amount: "75 000",  color: "bg-blue-400" },
                    { date: "28 Déc 2025", method: "USDT",          amount: "210 000", color: "bg-emerald-500" },
                    { date: "15 Déc 2025", method: "MTN MoMo",      amount: "55 000",  color: "bg-yellow-500" },
                    { date: "01 Déc 2025", method: "Orange Money",  amount: "90 000",  color: "bg-orange-500" },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-[#F5F2ED]/50 transition-colors">
                      <td className="px-6 py-4 text-slate-400 font-mono text-xs">{row.date}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${row.color}`} />
                          <span className="font-bold text-slate-700 text-sm">{row.method}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-black text-slate-900">{row.amount} F</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black bg-emerald-50 border border-emerald-200 text-emerald-700 uppercase tracking-widest">
                          <Check className="w-2.5 h-2.5" /> Payé
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-[#E8E2D9] text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Total retiré cette année : <span className="text-slate-700">630 000 FCFA</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── SIMULATEUR ─────────────────────────────────────────────────────────────────
function Simulateur() {
  const [referrals, setReferrals] = useState(50);
  const [selectedPack, setSelectedPack] = useState("createur");

  const commissionPerSale = Math.round(PACK_PRICES[selectedPack] * COMMISSION_RATE);
  const monthlyEarnings = referrals * commissionPerSale;

  return (
    <section id="simulateur" className="bg-[#F5F2ED] py-16 lg:py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-5xl mx-auto">

        <div className="mb-12 pb-8 border-b border-[#C8BFB0]">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Potentiel de gains</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[0.92]">Combien allez-vous gagner ?</h2>
          <p className="text-slate-500 mt-3 text-base">Déplacez les curseurs pour voir votre potentiel mensuel.</p>
        </div>

        <div className="bg-white border border-[#C8BFB0] rounded-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">

            {/* Contrôles */}
            <div className="p-6 lg:p-10 space-y-8 border-b lg:border-b-0 lg:border-r border-[#E8E2D9]">

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Nombre de filleuls</p>
                  <span className="text-3xl font-black text-slate-900">{referrals}</span>
                </div>
                <input type="range" min="1" max="2000" step="1" value={referrals}
                  onChange={e => setReferrals(parseInt(e.target.value))}
                  className="w-full h-2 bg-[#E8E2D9] rounded-lg appearance-none cursor-pointer accent-slate-900" />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  <span>1</span><span>2000+</span>
                </div>
              </div>

              <div className="w-full h-px bg-[#E8E2D9]" />

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Pack moyen</p>
                  <span className="text-xl font-black text-emerald-600">{commissionPerSale.toLocaleString()} FCFA / vente</span>
                </div>
                <div className="flex gap-2">
                  {Object.entries(PACK_LABELS).map(([key, label]) => (
                    <button key={key} onClick={() => setSelectedPack(key)}
                      className={`flex-1 py-2.5 rounded-xl text-[10px] font-black border uppercase tracking-widest transition-all ${selectedPack === key ? "bg-slate-900 text-white border-slate-900" : "bg-[#F5F2ED] text-slate-500 border-[#C8BFB0] hover:border-slate-400"}`}>
                      {label}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Commission = 10% du prix du pack</p>
              </div>
            </div>

            {/* Résultat */}
            <div className="p-6 lg:p-10 flex flex-col justify-center items-center text-center bg-slate-900 relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
              <div className="relative z-10 w-full">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30 mb-4">Commissions mensuelles</p>
                <p className="font-black text-white mb-2" style={{ fontSize: "clamp(2.5rem, 8vw, 4rem)", lineHeight: 1 }}>
                  {monthlyEarnings.toLocaleString("fr-FR")}
                </p>
                <p className="text-white/40 font-black uppercase tracking-widest text-sm mb-8">FCFA / mois</p>

                <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-left space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Total ventes</span>
                    <span className="font-black text-white">{referrals}</span>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Votre part (10%)</span>
                    <span className="font-black text-emerald-400">{commissionPerSale.toLocaleString()} FCFA</span>
                  </div>
                </div>

                <Link href="/auth/register"
                  className="mt-6 flex items-center justify-center gap-2 w-full py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-black rounded-xl text-xs uppercase tracking-widest transition-all">
                  Commencer maintenant <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── COMMENT ÇA MARCHE ──────────────────────────────────────────────────────────
function HowItWorks() {
  return (
    <section id="comment-ca-marche" className="bg-[#EDE8E0] py-16 lg:py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-5xl mx-auto">

        <div className="mb-12 pb-8 border-b border-[#C8BFB0]">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">3 étapes</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[0.92]">Simple comme 1, 2, 3</h2>
          <p className="text-slate-500 mt-3 text-base">Aucune compétence technique requise.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 lg:gap-8 mb-16">
          {[
            { num: "01", title: "Crée ton compte", desc: "Ton lien affilié est automatiquement créé. Dashboard complet inclus pour suivre tes gains en temps réel.", icon: Users },
            { num: "02", title: "Partage ton lien", desc: "Envoie ton lien sur WhatsApp, TikTok ou Facebook. Ressources marketing fournies dans ton dashboard.", icon: Globe },
            { num: "03", title: "Encaisse", desc: "Touche 10% sur chaque achat de tes filleuls, à vie. Retire par Wave, Orange Money ou Crypto.", icon: Wallet },
          ].map((step, i) => (
            <div key={i} className="bg-white border border-[#C8BFB0] rounded-2xl p-6 lg:p-8 hover:border-slate-400 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-sm">{step.num}</div>
                <step.icon className="w-5 h-5 text-slate-300" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-3 tracking-tight">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Pourquoi Bookzy */}
        <div className="grid md:grid-cols-2 gap-5 lg:gap-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Pourquoi promouvoir Bookzy ?</p>
            <div className="space-y-4">
              {[
                { icon: Repeat, color: "bg-emerald-50 border-emerald-200 text-emerald-600", title: "Revenus à vie (LTV)", desc: "Vous apportez le client une fois, vous gagnez sur lui pour toujours. S'il fait 10 ebooks, vous êtes payé 10 fois." },
                { icon: Globe, color: "bg-blue-50 border-blue-200 text-blue-600", title: "Marché énorme", desc: "Tout le monde veut gagner de l'argent en ligne. Bookzy est l'outil parfait à recommander aux débutants." },
                { icon: Smartphone, color: "bg-violet-50 border-violet-200 text-violet-600", title: "Paiement mobile", desc: "Vos gains sont envoyés directement sur votre téléphone. Wave, Orange Money, MTN ou Crypto." },
              ].map((f, i) => (
                <div key={i} className="flex gap-4 p-5 bg-white border border-[#C8BFB0] rounded-xl hover:border-slate-400 transition-all">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${f.color}`}>
                    <f.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-sm mb-1">{f.title}</p>
                    <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#C8BFB0] rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-[#F5F2ED] border border-[#C8BFB0] rounded-2xl flex items-center justify-center mb-6">
              <DollarSign className="w-10 h-10 text-slate-500" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">Commission</p>
            <p className="text-6xl font-black text-slate-900 mb-2">10%</p>
            <p className="text-slate-500 text-sm">Sur chaque achat de vos filleuls, pour toujours.</p>
            <div className="w-full h-px bg-[#E8E2D9] my-6" />
            <Link href="/auth/register" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all">
              Rejoindre <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── FAQ ────────────────────────────────────────────────────────────────────────
function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);
  const faqs = [
    { q: "Comment suis-je payé ?", a: "Par Wave, Orange Money, MTN ou Crypto. Tu peux retirer ton solde à tout moment depuis ton dashboard affilié." },
    { q: "Où est mon dashboard affilié ?", a: "Dès que tu crées ton compte Bookzy, ton dashboard affilié est automatiquement disponible dans ton espace. Lien unique, analytics, retraits, ressources : tout est là." },
    { q: "Est-ce gratuit ?", a: "Oui, 100% gratuit. Vous n'avez pas besoin de payer un abonnement pour devenir partenaire." },
    { q: "Combien de temps dure la commission ?", a: "À vie. Dès qu'un de vos filleuls achète un plan ou génère un ebook, vous touchez 10%, pour toujours, même s'il achète 2 ans après." },
    { q: "Quand est-ce que je suis payé ?", a: "Le paiement est traité sous 48h après votre demande de retrait depuis le dashboard. Minimum de retrait : 5 000 FCFA." },
  ];

  return (
    <section id="faq" className="bg-[#F5F2ED] py-16 lg:py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-3xl mx-auto">

        <div className="mb-12 pb-8 border-b border-[#C8BFB0] text-center">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Questions fréquentes</p>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">FAQ</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className={`bg-white border rounded-2xl overflow-hidden transition-all ${openIdx === i ? "border-slate-400" : "border-[#C8BFB0] hover:border-slate-400"}`}>
              <button onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
                className="w-full flex items-center justify-between p-5 text-left gap-4">
                <span className="font-black text-slate-900 text-sm tracking-tight">{faq.q}</span>
                <span className={`w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0 transition-all duration-200 ${openIdx === i ? "bg-slate-900 border-slate-900 text-white rotate-180" : "bg-[#F5F2ED] border-[#C8BFB0] text-slate-400"}`}>
                  <ChevronDown className="w-4 h-4" />
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-200 ${openIdx === i ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="px-5 pb-5">
                  <div className="h-px bg-[#E8E2D9] mb-4" />
                  <p className="text-slate-500 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA FINAL ──────────────────────────────────────────────────────────────────
function CTAFinal() {
  return (
    <section className="bg-slate-900 py-20 lg:py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] rounded-full opacity-[0.05] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #ffffff 0%, transparent 70%)" }} />
      <div className="relative z-10 max-w-3xl mx-auto text-center">

        <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mx-auto mb-8">
          <BookOpenSVG className="w-7 h-7 text-white" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-4">Rejoins l'aventure</p>
        <h2 className="font-black text-white tracking-tight leading-[0.92] mb-6" style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)" }}>
          Commence à créer<br />
          <span className="text-emerald-400">ton revenu passif.</span>
        </h2>
        <p className="text-white/40 text-lg mb-12 max-w-md mx-auto leading-relaxed">
          Dashboard affilié inclus automatiquement. Lien unique. Commissions à vie.
        </p>
        <div className="w-24 h-px bg-white/10 mx-auto mb-10" />
        <Link href="/auth/register"
          className="inline-flex items-center gap-3 px-10 py-5 bg-white hover:bg-slate-100 text-slate-900 font-black rounded-xl transition-all text-xs uppercase tracking-widest shadow-xl">
          Créer mon compte gratuit
          <ArrowRight className="w-4 h-4" />
        </Link>
        <p className="mt-6 text-white/20 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          Lien affilié + Dashboard automatique
        </p>
      </div>
    </section>
  );
}

// ── FOOTER ─────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="relative border-t border-[#C8BFB0]" style={{ background: "#EDE8E0" }}>
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-10">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
                <BookOpenSVG className="w-4 h-4 text-white" />
              </div>
              <span className="font-black text-slate-900 tracking-tight">Bookzy</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">Gagnez de l'argent en recommandant l'outil de création d'ebooks n°1 en Afrique.</p>
          </div>
          <div className="flex gap-12">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-4">Programme</p>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><Link href="/auth/register" className="hover:text-slate-900 transition-colors font-medium">S'inscrire</Link></li>
                <li><Link href="/auth/login" className="hover:text-slate-900 transition-colors font-medium">Espace Affilié</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-4">Légal</p>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><Link href="/legal/terms" className="hover:text-slate-900 transition-colors font-medium">Conditions</Link></li>
                <li><Link href="/legal/confidentialite" className="hover:text-slate-900 transition-colors font-medium">Confidentialité</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-[#C8BFB0] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">© 2026 Bookzy Inc. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

// ── PAGE ───────────────────────────────────────────────────────────────────────
export default function AffiliationPage() {
  return (
    <main className="min-h-screen text-slate-900">
      <Nav />
      <Hero />
      <Dashboard />
      <Simulateur />
      <HowItWorks />
      <FAQ />
      <CTAFinal />
      <Footer />
    </main>
  );
}