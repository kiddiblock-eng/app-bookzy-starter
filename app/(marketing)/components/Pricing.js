"use client";

import Link from "next/link";
import { Check, X } from "lucide-react";

export default function Pricing() {
  return (
    <section id="pricing" className="bg-slate-50 py-16 lg:py-20">
      <div className="max-w-5xl mx-auto px-5 sm:px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-blue-600 text-sm font-semibold tracking-wide uppercase mb-4">
            Tarifs
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Simple et transparent
          </h2>
          <p className="text-slate-500 text-base sm:text-lg max-w-lg mx-auto">
            Pas d'abonnement. Payez uniquement quand vous générez.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">

          {/* Free plan */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200">
            
            <h3 className="text-lg font-bold text-slate-900 mb-2">Gratuit</h3>
            <p className="text-slate-500 text-sm mb-6">Explorez sans payer</p>

            <div className="mb-6">
              <span className="text-4xl font-black text-slate-900">0</span>
              <span className="text-slate-500 text-sm ml-1">FCFA</span>
            </div>

            <Link 
              href="/auth/register"
              className="block w-full py-3 text-center text-sm font-semibold text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors mb-8"
            >
              Commencer
            </Link>

            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-sm text-slate-700">Niche Hunter (3 recherches/jour)</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-sm text-slate-700">Tendances illimitées</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-sm text-slate-700">Youbook (3 analyses/jour)</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-sm text-slate-700">Aperçu du sommaire</span>
              </li>
              <li className="flex items-center gap-3 opacity-50">
                <X className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-sm text-slate-500">Ebook PDF complet</span>
              </li>
              <li className="flex items-center gap-3 opacity-50">
                <X className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-sm text-slate-500">Kit marketing</span>
              </li>
            </ul>

          </div>

          {/* Pro plan */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-blue-600 relative">
            
            {/* Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                Populaire
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">Par ebook</h3>
            <p className="text-slate-500 text-sm mb-6">Tout ce qu'il faut pour vendre</p>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900">2 000</span>
                <span className="text-slate-500 text-sm">FCFA</span>
              </div>
              <p className="text-slate-400 text-xs mt-1">par ebook généré</p>
            </div>

            <Link 
              href="/auth/register"
              className="block w-full py-3 text-center text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors mb-8"
            >
              Créer mon ebook
            </Link>

            <ul className="space-y-3">
              <li className="flex items-center gap-3 pb-3 mb-3 border-b border-slate-100">
                <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-sm font-semibold text-slate-900">Tout le plan Gratuit, plus :</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-sm text-slate-700">Ebook PDF complet (20-90 pages)</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-sm text-slate-700">Cover 3D professionnelle</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-sm text-slate-700">6 templates premium</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-sm text-slate-700">Posts Facebook & Instagram</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-sm text-slate-700">Scripts WhatsApp</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-sm text-slate-700">Licence commerciale 100%</span>
              </li>
            </ul>

          </div>

        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-slate-500">
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            Sans engagement
          </span>
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            Paiement sécurisé
          </span>
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            Support 24/7
          </span>
        </div>

      </div>
    </section>
  );
}