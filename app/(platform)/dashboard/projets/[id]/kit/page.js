"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Lock, Download, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";

export default function KitPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const paidParam = searchParams.get("paid");

  const [projet, setProjet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState(null);

  // 🔄 Charger le projet
  useEffect(() => {
    async function fetchProjet() {
      try {
        const res = await fetch(`/api/projets/${id}`, {
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Erreur chargement projet");

        setProjet(data.projet || data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProjet();
  }, [id]);


  // 💰 Paiement Moneroo
  async function handlePay() {
    if (!projet) return;

    setPaying(true);

    try {
      const res = await fetch("/api/payments/create-moneroo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          projetId: projet._id,
          kitData: projet.kitData || {}, // au cas où tu l'utilises
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Erreur lors du paiement.");
      }

      // 🔁 Redirection Moneroo
      window.location.href = data.paymentUrl;

    } catch (err) {
      console.error("❌ Paiement Moneroo:", err);
      alert("Erreur : " + err.message);
      setPaying(false);
    }
  }


  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-slate-500">Chargement du projet...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center text-slate-600">
        <AlertTriangle className="w-10 h-10 text-red-500 mb-3" />
        <p className="text-lg font-semibold mb-2">Erreur</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!projet) {
    return <div className="text-center mt-20 text-slate-600">Projet introuvable</div>;
  }

  const isPaid = projet.isPaid;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-xl border border-white/50 shadow-xl rounded-3xl p-8">

        {paidParam === "success" && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>Paiement confirmé 🎉 — ton eBook est débloqué !</span>
          </div>
        )}

        <h1 className="text-3xl font-bold mb-2 text-slate-900">{projet.titre}</h1>
        <p className="text-slate-500 mb-8">
          {isPaid
            ? "Ton kit complet est disponible ci-dessous."
            : "Le kit complet sera disponible dès validation du paiement."}
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {projet.contenu?.length > 0 ? (
            projet.contenu.map((file) => (
              <div
                key={file.id || file.nom}
                className={`relative border rounded-2xl p-6 transition-all ${
                  isPaid ? "bg-white hover:shadow-lg" : "bg-slate-100 opacity-60 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">{file.nom}</h3>

                  {isPaid ? (
                    <a
                      href={file.url}
                      download
                      className="text-blue-600 hover:underline flex items-center gap-2"
                    >
                      <Download className="w-5 h-5" /> Télécharger
                    </a>
                  ) : (
                    <Lock className="w-5 h-5 text-slate-400" />
                  )}
                </div>

                <p className="text-sm text-slate-500">
                  {file.format} • {file.taille}
                </p>
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-center col-span-2">
              Aucun fichier trouvé pour ce projet.
            </p>
          )}
        </div>

        {!isPaid && (
          <div className="text-center mt-10">
            <button
              onClick={handlePay}
              disabled={paying}
              className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold shadow-lg transition-all ${
                paying
                  ? "bg-slate-400 text-white cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105"
              }`}
            >
              {paying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Paiement en cours...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" /> Débloquer mon eBook
                </>
              )}
            </button>
          </div>
        )}

        {isPaid && (
          <div className="flex justify-center mt-10 text-green-600 font-semibold">
            <CheckCircle2 className="w-5 h-5 mr-2" /> Kit complet débloqué 🎉
          </div>
        )}
      </div>
    </div>
  );
}