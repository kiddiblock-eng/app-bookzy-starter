"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function PaiementPage() {
  const { id } = useParams();

  useEffect(() => {
    async function createPayment() {
      try {
        const res = await fetch("/api/payments/create-moneroo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ projetId: id }),
        });

        const data = await res.json();

        if (data.success && data.paymentUrl) {
          // 🚀 Redirection vers Moneroo Checkout
          window.location.href = data.paymentUrl;
        } else {
          console.error("❌ Erreur Moneroo :", data);
        }
      } catch (e) {
        console.error("❌ Erreur:", e);
      }
    }

    createPayment();
  }, [id]);

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center">
      <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
      <p className="text-slate-600">Redirection vers le paiement sécurisé...</p>
    </div>
  );
}