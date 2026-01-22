"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Calculator, 
  DollarSign, 
  Users, 
  Repeat, 
  CheckCircle2, 
  HelpCircle, 
  Smartphone,
  Globe,
  Wallet,
  Menu,
  X,
  Instagram,
  Twitter,
  Coins,
  TrendingUp,
  Check,
  Zap
} from "lucide-react";

// --- CONFIGURATION ---
const COMMISSION_AMOUNT = 600; // FCFA par ebook généré

// --- FONCTION DE SCROLL DOUX ---
const handleScroll = (e, id) => {
  e.preventDefault();
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

// --- NAVBAR (LIGHT) ---
const AffiliationNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter text-slate-900">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">B</div>
          Bookzy <span className="text-slate-500">Partners</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#dashboard" onClick={(e) => handleScroll(e, 'dashboard')} className="hover:text-indigo-600 transition-colors cursor-pointer">Dashboard</a>
          <a href="#comment-ca-marche" onClick={(e) => handleScroll(e, 'comment-ca-marche')} className="hover:text-indigo-600 transition-colors cursor-pointer">Comment ça marche</a>
          <a href="#simulateur" onClick={(e) => handleScroll(e, 'simulateur')} className="hover:text-indigo-600 transition-colors cursor-pointer">Simulateur</a>
          <a href="#faq" onClick={(e) => handleScroll(e, 'faq')} className="hover:text-indigo-600 transition-colors cursor-pointer">FAQ</a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/auth/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
            Connexion
          </Link>
          <Link href="/auth/register" className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-full hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
            Commencer
          </Link>
        </div>

        <button className="md:hidden text-slate-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-slate-100 p-6 flex flex-col gap-4 md:hidden shadow-xl">
          <a href="#dashboard" onClick={(e) => { handleScroll(e, 'dashboard'); setMobileMenuOpen(false); }} className="text-slate-600 py-2">Dashboard</a>
          <a href="#comment-ca-marche" onClick={(e) => { handleScroll(e, 'comment-ca-marche'); setMobileMenuOpen(false); }} className="text-slate-600 py-2">Comment ça marche</a>
          <a href="#simulateur" onClick={(e) => { handleScroll(e, 'simulateur'); setMobileMenuOpen(false); }} className="text-slate-600 py-2">Simulateur</a>
          <Link href="/auth/login" className="text-slate-600 py-2">Connexion</Link>
          <Link href="/auth/register" className="bg-indigo-600 text-white py-3 rounded-lg text-center font-bold">Commencer</Link>
        </div>
      )}
    </nav>
  );
};

// --- FOOTER (LIGHT) ---
const AffiliationFooter = () => {
  return (
    <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tighter text-slate-900 mb-6">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">B</div>
              Bookzy
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Gagnez de l'argent en recommandant l'outil de création d'ebooks n°1 en Afrique.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Programme</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link href="/auth/register" className="hover:text-indigo-600">S'inscrire</Link></li>
              <li><Link href="/auth/login" className="hover:text-indigo-600">Espace Affilié</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Légal</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link href="/legal/terms" className="hover:text-indigo-600">Conditions</Link></li>
              <li><Link href="/legal/confidentialite" className="hover:text-indigo-600">Confidentialité</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Réseaux</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all"><Instagram className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
          <p>© 2026 Bookzy Inc.</p>
          
        </div>
      </div>
    </footer>
  );
};

// --- PAGE PRINCIPALE ---
export default function AffiliationPage() {
  const [referrals, setReferrals] = useState(50); 
  const [ebooksPerMonth, setEbooksPerMonth] = useState(5); 

  const monthlyEarnings = referrals * ebooksPerMonth * COMMISSION_AMOUNT;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      
      <AffiliationNavbar />
      
      {/* SECTION 1 : HERO */}
      <section className="relative pt-40 pb-20 overflow-hidden bg-white">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-50 via-white to-white opacity-50 pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-semibold mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Chaque utilisateur a son lien affilié
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-slate-900">
                Recommande Bookzy. <br />
                Encaisse <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">600 FCFA</span> à vie.
              </h1>

              <p className="text-lg md:text-xl text-slate-500 max-w-xl mx-auto lg:mx-0 mb-10">
                Ton lien affilié est automatiquement créé quand tu t'inscris. Dashboard complet inclus pour tout suivre.
              </p>

              <div className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4">
                <Link 
                  href="/auth/register" 
                  className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 text-lg shadow-xl shadow-indigo-200 transform hover:scale-105"
                >
                  Créer mon compte gratuit
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a 
                  href="#simulateur" 
                  onClick={(e) => handleScroll(e, 'simulateur')}
                  className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-semibold rounded-full hover:bg-slate-50 transition-all border border-slate-200 shadow-sm"
                >
                  Simuler mes gains
                </a>
              </div>
            </div>

            {/* VISUEL PIÈCE */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
              <div className="relative w-64 h-64 md:w-80 md:h-80 animate-float">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-100 via-slate-300 to-slate-400 border-4 border-white shadow-2xl flex items-center justify-center relative overflow-hidden group">
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.8),transparent)] pointer-events-none" />
                   <div className="text-center transform rotate-12 transition-transform duration-700 group-hover:rotate-0">
                      <span className="block text-6xl font-black text-slate-500 opacity-50">600F</span>
                      <Coins className="w-20 h-20 text-slate-600 mx-auto mt-2" />
                   </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ★ NOUVELLE SECTION : APERÇU DASHBOARD (TABLEAUX BANNIÈRE) ★ */}
      <section id="dashboard" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-slate-900">Ton Dashboard Affilié</h2>
            <p className="text-slate-500">Automatiquement créé dès ton inscription. Tout est là.</p>
          </div>

          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* TABLEAU 1 : STATS (FORMAT BANNIÈRE) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-200">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-indigo-600" />
                  Vue d'ensemble
                </h3>
              </div>
              
              <div className="p-6 grid md:grid-cols-3 gap-6">
                {/* Solde */}
                <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-medium opacity-90">Solde disponible</div>
                    <Wallet className="w-6 h-6 opacity-80" />
                  </div>
                  <div className="text-3xl font-black mb-1">625 000 F</div>
                  <div className="text-xs opacity-75">Prêt à retirer</div>
                </div>

                {/* Filleuls */}
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-medium text-slate-600">Filleuls inscrits</div>
                    <Users className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="text-3xl font-black text-slate-900 mb-1">142</div>
                  <div className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +23 ce mois
                  </div>
                </div>

                {/* Commissions */}
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-medium text-slate-600">Ce mois</div>
                    <DollarSign className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="text-3xl font-black text-slate-900 mb-1">84 600 F</div>
                  <div className="text-xs text-slate-500">141 ebooks vendus</div>
                </div>
              </div>
            </div>

            {/* TABLEAU 2 : HISTORIQUE (FORMAT BANNIÈRE) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  Historique des paiements
                </h3>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">TOUT PAYÉ</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-400 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-3 text-left font-medium text-xs uppercase">Date</th>
                      <th className="px-6 py-3 text-left font-medium text-xs uppercase">Méthode</th>
                      <th className="px-6 py-3 text-right font-medium text-xs uppercase">Montant</th>
                      <th className="px-6 py-3 text-center font-medium text-xs uppercase">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {[
                      { date: "12 Jan 2026", method: "Orange Money", amount: "150 000" },
                      { date: "05 Jan 2026", method: "Wave CI", amount: "75 000" },
                      { date: "28 Dec 2025", method: "USDT", amount: "210 000" },
                      { date: "15 Dec 2025", method: "MTN MoMo", amount: "55 000" },
                      { date: "01 Dec 2025", method: "Orange Money", amount: "90 000" },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-slate-500 font-mono text-xs">{row.date}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              row.method.includes('Wave') ? 'bg-blue-400' : 
                              row.method.includes('Orange') ? 'bg-orange-500' : 
                              'bg-green-500'
                            }`}></div>
                            <span className="font-medium text-slate-700">{row.method}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-bold text-slate-900">{row.amount} F</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600 border border-green-100">
                            <Check className="w-3 h-3" /> PAYÉ
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-400">
                  Total retiré cette année : <span className="font-bold text-slate-700">630 000 FCFA</span>
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2 : SIMULATEUR */}
      <section id="simulateur" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-12 shadow-2xl shadow-slate-200 relative overflow-hidden">
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-900">
                    <Calculator className="w-6 h-6 text-indigo-600" />
                    Combien allez-vous gagner ?
                  </h2>
                  <p className="text-slate-500 mt-2 text-sm">
                    Déplacez les curseurs pour voir votre potentiel mensuel.
                  </p>
                </div>

                {/* Slider 1 : FILLEULS (Max 2000) */}
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-medium">Nombre de Filleuls</span>
                    <span className="text-2xl font-bold text-slate-900">{referrals}</span>
                  </div>
                  <input 
                    type="range" min="1" max="2000" step="1"
                    value={referrals}
                    onChange={(e) => setReferrals(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>1</span>
                    <span>2000+</span>
                  </div>
                </div>

                {/* Slider 2 : EBOOKS (Max 50) */}
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-medium">Ebooks générés / mois / pers.</span>
                    <span className="text-2xl font-bold text-slate-900">{ebooksPerMonth}</span>
                  </div>
                  <input 
                    type="range" min="1" max="50" step="1"
                    value={ebooksPerMonth}
                    onChange={(e) => setEbooksPerMonth(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                   <div className="flex justify-between text-xs text-slate-400">
                    <span>1</span>
                    <span>50 (Whale)</span>
                  </div>
                </div>
              </div>

              {/* RÉSULTATS */}
              <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-2xl p-8 text-center text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Wallet className="w-20 h-20" />
                </div>
                
                <p className="text-indigo-200 font-medium mb-1">Vos commissions mensuelles</p>
                <div className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">
                  {monthlyEarnings.toLocaleString('fr-FR')} <span className="text-2xl">FCFA</span>
                </div>
                <p className="text-indigo-200 text-sm mb-6">Paiement chaque mois</p>

                <div className="bg-white/10 rounded-xl p-4 text-left space-y-2 backdrop-blur-sm border border-white/10">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Total Ebooks vendus :</span>
                    <span className="font-bold">{referrals * ebooksPerMonth}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Votre part (30%) :</span>
                    <span className="font-bold text-green-400">600 FCFA / unité</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3 : PROCESS */}
      <section id="comment-ca-marche" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-slate-900">C'est simple comme 1, 2, 3</h2>
            <p className="text-slate-500">Aucune compétence technique requise.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white border border-slate-100 hover:border-indigo-200 transition-colors relative group">
              <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-xl font-bold text-indigo-600 shadow-sm mb-6">1</div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Crée ton compte</h3>
              <p className="text-slate-600 leading-relaxed">
                Ton lien affilié est automatiquement créé. Dashboard complet inclus pour suivre tes gains en temps réel.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-white border border-slate-100 hover:border-indigo-200 transition-colors relative group">
              <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-xl font-bold text-indigo-600 shadow-sm mb-6">2</div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Partage ton lien</h3>
              <p className="text-slate-600 leading-relaxed">
                Envoi ton lien sur WhatsApp, TikTok ou Facebook. Ressources marketing fournies dans ton dashboard.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-white border border-slate-100 hover:border-indigo-200 transition-colors relative group">
              <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-xl font-bold text-indigo-600 shadow-sm mb-6">3</div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Encaisse</h3>
              <p className="text-slate-600 leading-relaxed">
                Chaque ebook généré = 600 FCFA. Retire par Wave, Orange Money ou Crypto depuis ton dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 : ARGUMENTS */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">Pourquoi promouvoir Bookzy ?</h2>
              <div className="space-y-6">
                
                <div className="flex gap-4">
                  <div className="mt-1 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <Repeat className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">Revenus à Vie (LTV)</h4>
                    <p className="text-slate-600">Vous apportez le client une fois, vous gagnez sur lui pour toujours. S'il fait 10 ebooks, vous êtes payé 10 fois.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">Marché Énorme</h4>
                    <p className="text-slate-600">Tout le monde veut gagner de l'argent en ligne. Bookzy est l'outil parfait à recommander aux débutants.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                    <Smartphone className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">Paiement Mobile</h4>
                    <p className="text-slate-600">Vos gains sont envoyés directement sur votre téléphone. Simple et rapide.</p>
                  </div>
                </div>

              </div>
            </div>

            <div className="relative">
               <div className="aspect-square rounded-3xl bg-white border border-slate-200 p-8 flex flex-col justify-center items-center text-center shadow-2xl shadow-slate-200">
                  <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                    <DollarSign className="w-12 h-12 text-indigo-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-slate-900">30% de Commission</h3>
                  <p className="text-slate-500">Le taux le plus généreux du marché.</p>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5 : FAQ */}
      <section id="faq" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Questions Fréquentes</h2>
          
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 border border-slate-100">
              <h3 className="font-bold text-lg text-slate-900 mb-2 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                Comment suis-je payé ?
              </h3>
              <p className="text-slate-600">
                Par Wave, Orange Money, MTN ou Crypto. Tu peux retirer ton solde à tout moment depuis ton dashboard affilié .
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-100">
              <h3 className="font-bold text-lg text-slate-900 mb-2 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                Où est mon dashboard affilié ?
              </h3>
              <p className="text-slate-600">
                Dès que tu crées ton compte Bookzy, ton dashboard affilié est automatiquement disponible dans ton espace. Lien unique, analytics, retraits, ressources : tout est là.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-100">
              <h3 className="font-bold text-lg text-slate-900 mb-2 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                Est-ce gratuit ?
              </h3>
              <p className="text-slate-600">
                Oui, 100% gratuit. Vous n'avez pas besoin de payer un abonnement pour devenir partenaire.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 : CTA */}
      <section className="py-24 bg-slate-900 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Rejoins l'aventure Bookzy</h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Dashboard affilié inclus automatiquement. Commence à créer ton revenu passif aujourd'hui.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/auth/register" 
              className="px-10 py-5 bg-white text-slate-900 font-bold rounded-full hover:bg-slate-100 transition-all text-xl shadow-2xl"
            >
              Créer mon compte gratuit
            </Link>
          </div>
          <p className="mt-6 text-slate-500 text-sm flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            Lien affilié + Dashboard automatique
          </p>
        </div>
      </section>

      <AffiliationFooter />

    </main>
  );
}