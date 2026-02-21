"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="bg-slate-50 py-16 lg:py-20">
      <div className="max-w-3xl mx-auto px-5 sm:px-6 text-center">

        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
          Prêt à créer votre premier ebook ?
        </h2>
        
        <p className="text-slate-500 text-base sm:text-lg mb-8 max-w-lg mx-auto">
          Rejoignez 1,300+ créateurs qui utilisent Bookzy pour générer des revenus.
        </p>

        <Link 
          href="/auth/register"
          className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl transition-colors"
        >
          Commencer gratuitement
          <ArrowRight className="w-5 h-5" />
        </Link>

        <p className="text-slate-400 text-sm mt-4">
          Pas d'abonnement - Payez uniquement à l'usage.
        </p>

      </div>
    </section>
  );
}