"use client";
import React from "react";
import { X, Check, Sparkles, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ComparisonSection() {
  return (
    <section className="relative w-full bg-white py-16 md:py-24 overflow-hidden">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 text-center mb-12 relative z-10">
        <div className="inline-flex items-center gap-2 bg-orange-100 border border-orange-300 px-5 py-2 rounded-full mb-6 shadow-sm">
          <Zap className="w-4 h-4 text-orange-600" />
          <span className="text-orange-900 text-sm font-semibold">La différence qui tue</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] mb-5">
          Le même contenu,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
            2 mondes différents
          </span>
        </h2>

        <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
          Compare ce que ChatGPT te donne (amateur) vs ce que Bookzy génère (premium)
        </p>
      </div>

      {/* COMPARISON - Responsive unifié */}
      <div className="relative max-w-7xl mx-auto px-6">
        
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* CHATGPT - Simplifié */}
          <div className="relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0 md:top-8 z-20">
              <div className="bg-red-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                <X className="w-4 h-4" />
                <span className="font-bold text-sm">ChatGPT</span>
              </div>
            </div>

            <div className="bg-gray-200 rounded-3xl p-6 pt-16 md:pt-24 shadow-lg">
              <div className="bg-white border-2 border-gray-400 p-6 rounded-lg">
                
                <h3 className="text-base font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-300">
                  Les 3 Piliers du Marketing Digital
                </h3>

                <div className="space-y-4 text-sm text-gray-800">
                  <div>
                    <p className="font-semibold mb-2">1. Les Réseaux Sociaux</p>
                    <p className="text-xs">Les réseaux sociaux sont devenus incontournables pour toute stratégie marketing moderne.</p>
                  </div>

                  <div>
                    <p className="font-semibold mb-2">2. Le Référencement (SEO)</p>
                    <p className="text-xs">Le SEO est crucial pour améliorer votre visibilité sur Google gratuitement.</p>
                  </div>

                  <div>
                    <p className="font-semibold mb-2">3. L&apos;Email Marketing</p>
                    <p className="text-xs">L&apos;email marketing reste le canal le plus rentable avec un ROI moyen de 42€.</p>
                  </div>

                  <div className="space-y-2 mt-4">
                    <div className="h-10 bg-gray-200 border border-gray-400 flex items-center justify-center">
                      <span className="text-xs text-gray-500">[Aucune image]</span>
                    </div>
                    <div className="h-10 bg-gray-200 border border-gray-400 flex items-center justify-center">
                      <span className="text-xs text-gray-500">[Aucune image]</span>
                    </div>
                  </div>
                </div>

              </div>

              <div className="mt-6 bg-red-100 border-l-4 border-red-700 p-4 rounded-r shadow">
                <p className="text-xs font-black text-red-900 mb-2 flex items-center gap-2">
                  <X className="w-4 h-4" />
                  Le problème :
                </p>
                <ul className="space-y-1 text-xs text-red-900">
                  <li>❌ Texte brut sans design</li>
                  <li>❌ Zéro couleur, zéro mise en page</li>
                  <li>❌ Personne paiera pour ça</li>
                </ul>
              </div>

              <div className="mt-4 bg-red-100 border-2 border-red-500 rounded-2xl p-4 text-center shadow-lg">
                <div className="text-3xl font-black text-red-700 mb-1">3 jours</div>
                <p className="text-gray-800 font-semibold text-xs">Pour designer sur Canva</p>
              </div>
            </div>
          </div>

          {/* BOOKZY - Simplifié */}
          <div className="relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 md:right-8 md:left-auto md:translate-x-0 md:top-8 z-20">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span className="font-bold text-sm">Bookzy</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-100 to-gray-100 rounded-3xl p-6 pt-16 md:pt-24 shadow-xl">
              <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                  <div className="text-white/80 text-xs font-bold mb-2 uppercase">Chapitre 03</div>
                  <h3 className="text-xl md:text-2xl font-black text-white leading-tight">
                    Les 3 Piliers du<br/>Marketing Digital
                  </h3>
                </div>

                <div className="p-6 space-y-4">
                  
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border-l-4 border-blue-500">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">📱</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black text-gray-900 text-sm mb-1">1. Les Réseaux Sociaux</h4>
                        <p className="text-xs text-gray-700">Incontournables pour toute stratégie marketing moderne.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-l-4 border-purple-500">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">🔍</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black text-gray-900 text-sm mb-1">2. Le Référencement (SEO)</h4>
                        <p className="text-xs text-gray-700">Améliore votre visibilité sur Google gratuitement.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-l-4 border-green-500">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">📧</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black text-gray-900 text-sm mb-1">3. L&apos;Email Marketing</h4>
                        <p className="text-xs text-gray-700">ROI moyen de 42€ pour 1€ investi.</p>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="bg-gradient-to-r from-blue-500 to-purple-600 py-3 px-6">
                  <div className="flex items-center justify-between">
                    <div className="text-white/80 text-xs font-bold">Marketing Digital</div>
                    <div className="text-white font-black text-sm">12</div>
                  </div>
                </div>

              </div>

              <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-4 rounded-r-lg shadow">
                <p className="text-xs font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  La solution :
                </p>
                <ul className="space-y-1 text-xs text-gray-800">
                  <li>✅ Design premium</li>
                  <li>✅ Icons et couleurs pros</li>
                  <li>✅ Se vend 2 500 FCFA+</li>
                </ul>
              </div>

              <div className="mt-4 bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-500 rounded-2xl p-4 text-center shadow-lg">
                <div className="text-3xl font-black text-green-700 mb-1">5 min</div>
                <p className="text-gray-800 font-semibold text-xs">Design automatique</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* CTA */}
      <div className="text-center mt-12 px-6">
        <Link
          href="https://app.bookzy.io/auth/register"
          className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-sm md:text-base shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
        >
          <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
          <span>Générer mon ebook design maintenant</span>
          <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
        
        <p className="mt-4 text-gray-500 text-xs md:text-sm">
          Même contenu, design 100x meilleur — En 5 minutes
        </p>
      </div>

    </section>
  );
}