// /app/dashboard/projets/[id]/page.js
"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import {
  Loader2,
  Lock,
  CheckCircle2,
  FileText,
  Download,
  CreditCard,
  X,
  ArrowLeft,
  Calendar,
  Eye,
  Sparkles,
  Package,
  Shield,
  Zap,
  Image as ImageIcon,
  Quote,
} from "lucide-react";

export default function ProjetPage({ params }) {
  // -----------------------------
  // STATE
  // -----------------------------
  const projetId = params?.id;
  const [projet, setProjet] = useState(null);
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);

  // évite d’attacher plusieurs fois les listeners Kkiapay
  const listenersBoundRef = useRef(false);

  // -----------------------------
  // FETCH PROJET (on garde ton endpoint)
  // -----------------------------
  useEffect(() => {
    let stop = false;
    async function fetchProjet() {
      try {
        if (!projetId) return;
        const res = await fetch(`/api/ebooks/getOne?id=${projetId}`, {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();

        // supporte {projet: {...}} ou {...direct}
        const p = data?.projet || data;

        if (!stop && p) {
          setProjet(p);
          setPaid(Boolean(p?.isPaid) || p?.status === "paid");
        }
      } catch (e) {
        console.error("Erreur chargement projet :", e);
      }
    }
    fetchProjet();
    return () => {
      stop = true;
    };
  }, [projetId]);

  // -----------------------------
  // KKIAPAY - SDK LOADED
  // -----------------------------
  const handleSdkLoad = () => {
    const ok =
      typeof window !== "undefined" &&
      typeof window.openKkiapayWidget === "function" &&
      (typeof window.addKkiapayListener === "function" ||
        typeof window.addSuccessListener === "function"); // selon version SDK

    if (ok) {
      setSdkLoaded(true);
    } else {
      // second check tardif si le script met du temps
      const t = setInterval(() => {
        if (
          typeof window.openKkiapayWidget === "function" &&
          (typeof window.addKkiapayListener === "function" ||
            typeof window.addSuccessListener === "function")
        ) {
          clearInterval(t);
          setSdkLoaded(true);
        }
      }, 200);
      setTimeout(() => clearInterval(t), 6000);
    }
  };

  // -----------------------------
  // KKIAPAY - LISTENERS (succès/échec/pending)
  // -----------------------------
  useEffect(() => {
    if (!sdkLoaded || listenersBoundRef.current) return;

    const useNewApi = typeof window.addKkiapayListener === "function";
    const onSuccess = async (response) => {
      try {
        const payload =
          response && response.transactionId
            ? response
            : response?.detail || response?.data || {};
        const transactionId = payload?.transactionId;

        if (!transactionId) {
          console.error("Réponse Kkiapay sans transactionId :", payload);
          setLoading(false);
          return;
        }

        // confirme côté serveur (webhook contrôlé)
        const confirm = await fetch("/api/webhooks/kkiapay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transactionId, projetId }),
        });
        const result = await confirm.json();

        if (result?.success) {
          setPaid(true);
          setPaymentDone(true);
          setProjet((prev) => ({
            ...prev,
            isPaid: true,
            status: "paid",
            paymentId: transactionId,
            paidAt: new Date().toISOString(),
          }));
          setTimeout(() => setShowModal(false), 1200);
        } else {
          console.error("Erreur validation serveur :", result?.message);
          alert("Erreur lors de la validation du paiement.");
        }
      } catch (err) {
        console.error("Erreur confirmation paiement :", err);
        alert("Erreur lors de la confirmation du paiement.");
      } finally {
        setLoading(false);
      }
    };

    const onFailed = () => {
      setLoading(false);
      alert("Le paiement a échoué. Réessaie s'il te plaît.");
    };

    const onPending = () => {
      // Optionnel
    };

    if (useNewApi) {
      window.addKkiapayListener("success", onSuccess);
      window.addKkiapayListener("failed", onFailed);
      window.addKkiapayListener("pending", onPending);
    } else {
      // anciennes fonctions si présentes
      if (typeof window.addSuccessListener === "function")
        window.addSuccessListener(onSuccess);
      if (typeof window.addFailureListener === "function")
        window.addFailureListener(onFailed);
    }

    listenersBoundRef.current = true;
  }, [sdkLoaded, projetId]);

  // -----------------------------
  // ACTION: OUVRIR LE WIDGET (inchangé visuellement)
  // -----------------------------
  const handlePay = () => {
    if (!sdkLoaded || typeof window.openKkiapayWidget !== "function") {
      alert("Le système de paiement n'est pas encore chargé. Réessaie dans quelques secondes.");
      return;
    }
    setLoading(true);

    try {
      window.openKkiapayWidget({
        amount: 3000, // FCFA
        api_key: process.env.NEXT_PUBLIC_KKIAPAY_PUBLIC_KEY,
        sandbox: true, // test
        email: projet?.userEmail || "client@example.com",
        phone: projet?.userPhone || "",
        name: projet?.titre || "eBook",
        reason: projet?.titre || "Paiement eBook IA",
        data: JSON.stringify({ projetId }),
        theme: "#0066FF",
      });
    } catch (err) {
      console.error("Erreur ouverture widget Kkiapay :", err);
      setLoading(false);
      alert("Impossible d'ouvrir le système de paiement.");
    }
  };
  // -----------------------------
  // AFFICHAGE: CHARGEMENT GLOBAL
  // -----------------------------
  if (!projet) {
    return (
      <>
        <Script src="https://cdn.kkiapay.me/k.js" strategy="afterInteractive" onLoad={handleSdkLoad} />
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-600 animate-pulse" />
          </div>
          <p className="mt-4 text-neutral-600 font-medium">Chargement de votre projet...</p>
        </div>
      </>
    );
  }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <>
      {/* SDK Kkiapay */}
      <Script src="https://cdn.kkiapay.me/k.js" strategy="afterInteractive" onLoad={handleSdkLoad} />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* HEADER AVEC RETOUR */}
          <div className="mb-6">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors mb-4 group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Retour aux projets</span>
            </button>
          </div>

          {/* CONTENU CENTRÉ */}
          <div className="space-y-6">
            {/* HEADER DU PROJET */}
            <div className="bg-white rounded-3xl shadow-lg border border-neutral-200 overflow-hidden">
              {/* Hero gradient */}
              <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
                {/* Badge statut */}
                <div className="absolute top-4 right-4">
                  {paid ? (
                    <div className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      <CheckCircle2 size={16} />
                      Débloqué
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      <Lock size={16} />
                      Verrouillé
                    </div>
                  )}
                </div>
              </div>

              {/* Contenu */}
              <div className="p-8">
                <h1 className="text-3xl font-bold text-neutral-900 mb-4 leading-tight">
                  {projet.titre}
                </h1>

                {/* Métadonnées */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Calendar size={16} />
                    <span className="text-sm">
                      Créé le{" "}
                      {new Date(projet.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-600">
                    <FileText size={16} />
                    <span className="text-sm">{projet.pages || 20} pages</span>
                  </div>
                </div>

                {/* Description */}
                {projet.description && (
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                    <h2 className="text-lg font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                      <Eye size={20} className="text-blue-600" />
                      À propos de ce projet
                    </h2>
                    <p className="text-neutral-700 leading-relaxed">{projet.description}</p>
                  </div>
                )}
              </div>
            </div>
            {/* CONTENU DU KIT */}
            <div className="bg-white rounded-3xl shadow-lg border border-neutral-200 p-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                Contenu du kit
              </h2>
              <p className="text-neutral-600 mb-6">
                {paid ? "Téléchargez tous vos fichiers ci-dessous" : "Débloquez pour accéder à vos fichiers"}
              </p>

              {!paid ? (
                <div className="relative">
                  {/* Effet de flou sur le contenu */}
                  <div className="absolute inset-0 backdrop-blur-sm bg-white/60 z-10 rounded-2xl" />
                  {/* Aperçu flouté */}
                  <div className="space-y-3 opacity-40 pointer-events-none">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-neutral-400" />
                          <span className="text-neutral-600">Fichier {i}.pdf</span>
                        </div>
                        <Download className="w-5 h-5 text-neutral-400" />
                      </div>
                    ))}
                  </div>

                  {/* CTA de déblocage */}
                  <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <div className="text-center bg-white rounded-3xl p-8 shadow-2xl border-2 border-blue-100 max-w-md mx-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Lock className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-neutral-900 mb-2">Kit verrouillé 🔒</h3>
                      <p className="text-neutral-600 text-sm mb-6">
                        Débloquez ce kit pour accéder à votre eBook complet et tous les fichiers marketing
                      </p>
                      <button
                        onClick={() => setShowModal(true)}
                        disabled={!sdkLoaded}
                        className={`group w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                          !sdkLoaded ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        {sdkLoaded ? "Débloquer maintenant" : "Chargement..."}
                        <Sparkles className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {projet.contenu?.length ? (
                    projet.contenu.map((file, i) => (
                      <div
                        key={i}
                        className="group flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border border-blue-200 rounded-xl px-5 py-4 transition-all hover:shadow-md"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <span className="font-medium text-neutral-900">{file.nom}</span>
                        </div>
                        <a
                          href={file.url}
                          download
                          className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group-hover:translate-x-1 transition-transform"
                        >
                          <Download className="w-5 h-5" />
                          Télécharger
                        </a>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-neutral-50 rounded-2xl border border-dashed border-neutral-300">
                      <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                      <p className="text-neutral-600 font-medium">Aucun fichier disponible</p>
                      <p className="text-neutral-500 text-sm mt-1">Les fichiers seront générés prochainement</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Card succès si payé */}
            {paid && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-lg border-2 border-green-200 p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">Kit débloqué ! 🎉</h3>
                  <p className="text-neutral-700 text-sm">
                    Vous avez accès à tous vos fichiers. Téléchargez-les quand vous voulez !
                  </p>
                </div>
              </div>
            )}
            {/* === SECTION IA MARKETING (affichage conditionnel, aucun impact si vide) === */}
            {(projet?.cover_url ||
              projet?.marketing_description ||
              (projet?.ads_texts && projet.ads_texts.length) ||
              (projet?.ads_images && projet.ads_images.length)) && (
              <div className="bg-white rounded-3xl shadow-lg border border-neutral-200 p-8">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  Kit marketing généré par l’IA
                </h2>

                {/* Couverture 3D */}
                {projet?.cover_url && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-purple-600" />
                      Couverture 3D (livre / box)
                    </h3>
                    <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4">
                      <img
                        src={projet.cover_url}
                        alt="Couverture eBook"
                        className="w-full h-auto rounded-xl object-cover"
                        loading="lazy"
                      />
                      <div className="text-right mt-3">
                        <a
                          href={projet.cover_url}
                          download
                          className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700"
                        >
                          <Download className="w-5 h-5" />
                          Télécharger la couverture
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Description marketing */}
                {projet?.marketing_description && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                      <Quote className="w-5 h-5 text-purple-600" />
                      Description marketing
                    </h3>
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                      <p className="text-neutral-800 leading-relaxed whitespace-pre-wrap">
                        {projet.marketing_description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Textes publicitaires */}
                {projet?.ads_texts?.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      Textes publicitaires
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {projet.ads_texts.map((txt, i) => (
                        <div
                          key={i}
                          className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <p className="text-neutral-800 whitespace-pre-wrap">{txt}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Affiches publicitaires */}
                {projet?.ads_images?.length > 0 && (
                  <div className="mb-2">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-purple-600" />
                      Affiches publicitaires
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {projet.ads_images.map((img, i) => (
                        <div key={i} className="bg-neutral-50 border border-neutral-200 rounded-2xl p-3">
                          <img
                            src={img}
                            alt={`Affiche ${i + 1}`}
                            className="w-full h-auto rounded-xl object-cover"
                            loading="lazy"
                          />
                          <div className="text-right mt-3">
                            <a
                              href={img}
                              download
                              className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700"
                            >
                              <Download className="w-5 h-5" />
                              Télécharger
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL DE PAIEMENT (inchangé visuellement) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-neutral-200 relative animate-scale-in">
            {!loading && !paymentDone && (
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors z-10"
              >
                <X className="w-5 h-5 text-neutral-600" />
              </button>
            )}

            {paymentDone ? (
              <div className="text-center py-16 px-8">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-once shadow-lg">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-3">Paiement réussi ! 🎉</h3>
                <p className="text-neutral-600">
                  Votre kit est maintenant débloqué. Vous pouvez télécharger tous vos fichiers.
                </p>
              </div>
            ) : loading ? (
              <div className="text-center py-16 px-8">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                  <CreditCard className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">Paiement en cours...</h3>
                <p className="text-neutral-600 text-sm">Ne fermez pas cette fenêtre</p>
                <div className="mt-6 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                </div>
              </div>
            ) : (
              <div className="p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">Débloquer votre kit</h3>
                  <p className="text-neutral-600 text-sm">{projet.titre}</p>
                </div>

                {/* Détails */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-6 border border-blue-100">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-blue-200">
                    <span className="text-neutral-700 font-medium">Montant total</span>
                    <span className="text-3xl font-bold text-neutral-900">3000 F</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-neutral-700">eBook complet</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-neutral-700">Visuels marketing</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-neutral-700">Textes prêts à l'emploi</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-neutral-700">Accès immédiat</span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={handlePay}
                  disabled={!sdkLoaded}
                  className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                    !sdkLoaded ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  {sdkLoaded ? "Payer maintenant" : "Chargement..."}
                </button>

                {/* Sécurité */}
                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-neutral-500">
                  <Shield className="w-4 h-4" />
                  Paiement sécurisé par Kkiapay
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Animations locales (inchangées) */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes bounce-once {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
        .animate-bounce-once { animation: bounce-once 0.6s ease-out; }
      `}</style>
    </>
  );
}
