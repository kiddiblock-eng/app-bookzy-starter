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
          <br />
          <span className="text-2xl md:text-3xl text-gray-600">Tu choisis lequel ?</span>
        </h2>

        <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
          <span className="hidden md:inline">
            À gauche : ce que ChatGPT te donne (amateur)
            <br />
            À droite : ce que Bookzy génère (premium)
          </span>
          <span className="md:hidden">
            Compare ce que ChatGPT te donne (amateur)
            <br />
            vs ce que Bookzy génère (premium)
          </span>
        </p>
      </div>

      {/* COMPARISON CONTAINER - RESPONSIVE */}
      <div className="relative max-w-7xl mx-auto px-6">
        
        {/* DESKTOP : Horizontal split */}
        <div className="hidden md:block">
          <div className="relative h-[800px] overflow-hidden rounded-3xl shadow-2xl border border-gray-200">
            
            {/* GAUCHE - CHATGPT ULTRA MOCHE */}
            <div className="absolute inset-y-0 left-0 w-1/2 bg-gray-300">
              
              <div className="absolute top-8 left-8 z-20">
                <div className="bg-red-600 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2">
                  <X className="w-5 h-5" />
                  <span className="font-bold text-sm">ChatGPT</span>
                </div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="w-full max-w-md h-[600px] bg-white shadow border-2 border-gray-500">
                  
                  <div className="p-6 h-full overflow-y-auto" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                    
                    {/* Header MOCHE style ChatGPT */}
                    <div className="mb-4 pb-3 border-b border-gray-300">
                      <h3 className="text-base font-semibold text-gray-900 mb-1">
                        Les 3 Piliers du Marketing Digital
                      </h3>
                    </div>

                    {/* Contenu style ChatGPT BRUT */}
                    <div className="space-y-3 text-sm text-gray-800 leading-relaxed">
                      
                      <p className="font-semibold">1. Les Réseaux Sociaux</p>
                      <p>
                        Les réseaux sociaux sont devenus incontournables pour toute stratégie marketing moderne. Facebook, Instagram et LinkedIn permettent d&apos;atteindre précisément votre audience cible avec un budget maîtrisé.
                      </p>

                      <p className="font-semibold mt-4">2. Le Référencement (SEO)</p>
                      <p>
                        Le SEO est crucial pour améliorer votre visibilité sur Google. En optimisant votre contenu avec les bons mots-clés et une structure adaptée, vous pouvez attirer du trafic qualifié gratuitement sur votre site.
                      </p>

                      <p className="font-semibold mt-4">3. L&apos;Email Marketing</p>
                      <p>
                        L&apos;email marketing reste le canal le plus rentable avec un ROI moyen de 42€ pour chaque euro investi. C&apos;est l&apos;outil parfait pour fidéliser vos clients et automatiser vos ventes.
                      </p>

                      <p className="mt-4">
                        En combinant ces trois piliers, vous créez une stratégie marketing complète qui génère des résultats mesurables et durables.
                      </p>

                    </div>

                    {/* Placeholders ULTRA MOCHES */}
                    <div className="mt-4 space-y-2">
                      <div className="h-10 bg-gray-200 border border-gray-400 flex items-center justify-center">
                        <span className="text-xs text-gray-500">[Aucune image]</span>
                      </div>
                      <div className="h-10 bg-gray-200 border border-gray-400 flex items-center justify-center">
                        <span className="text-xs text-gray-500">[Aucune image]</span>
                      </div>
                      <div className="h-10 bg-gray-200 border border-gray-400 flex items-center justify-center">
                        <span className="text-xs text-gray-500">[Aucune image]</span>
                      </div>
                    </div>

                  </div>

                </div>
              </div>

              <div className="absolute bottom-8 left-8 right-8">
                <div className="bg-red-100 border-l-4 border-red-700 p-4 rounded-r shadow-lg">
                  <p className="text-xs font-black text-red-900 mb-2 flex items-center gap-2">
                    <X className="w-4 h-4" />
                    Le VRAI problème :
                  </p>
                  <ul className="space-y-1 text-xs text-red-900">
                    <li>❌ Texte brut sans design</li>
                    <li>❌ Zéro couleur, zéro mise en page</li>
                    <li>❌ [Aucune image] partout</li>
                    <li>❌ Bordures grises moches</li>
                    <li>❌ Personne paiera 100 FCFA pour ça</li>
                  </ul>
                </div>
              </div>

            </div>

            {/* DROITE - BOOKZY PREMIUM */}
            <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-br from-slate-50 to-gray-100">
              
              <div className="absolute top-8 right-8 z-20">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span className="font-bold text-sm">Bookzy</span>
                </div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="w-full max-w-md h-[600px] bg-white rounded-lg shadow-2xl overflow-hidden">
                  
                  <div className="h-full overflow-hidden relative">
                    
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
                      <div className="relative z-10">
                        <div className="text-white/80 text-xs font-bold mb-2 uppercase tracking-wider">Chapitre 03</div>
                        <h3 className="text-2xl font-black text-white leading-tight">
                          Les 3 Piliers du<br/>Marketing Digital
                        </h3>
                      </div>
                    </div>

                    <div className="p-8 space-y-5 overflow-y-auto" style={{maxHeight: 'calc(600px - 160px)'}}>
                      
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border-l-4 border-blue-500 shadow-sm">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                            <span className="text-2xl">📱</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-black text-gray-900 text-sm mb-2">1. Les Réseaux Sociaux</h4>
                            <p className="text-xs text-gray-700 leading-relaxed">
                              Les réseaux sociaux sont devenus incontournables pour toute stratégie marketing moderne. 
                              Facebook, Instagram et LinkedIn permettent d&apos;atteindre précisément votre audience cible 
                              avec un budget maîtrisé.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border-l-4 border-purple-500 shadow-sm">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                            <span className="text-2xl">🔍</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-black text-gray-900 text-sm mb-2">2. Le Référencement (SEO)</h4>
                            <p className="text-xs text-gray-700 leading-relaxed">
                              Le SEO est crucial pour améliorer votre visibilité sur Google. En optimisant votre contenu 
                              avec les bons mots-clés et une structure adaptée, vous pouvez attirer du trafic qualifié 
                              gratuitement sur votre site.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-l-4 border-green-500 shadow-sm">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                            <span className="text-2xl">📧</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-black text-gray-900 text-sm mb-2">3. L&apos;Email Marketing</h4>
                            <p className="text-xs text-gray-700 leading-relaxed">
                              L&apos;email marketing reste le canal le plus rentable avec un ROI moyen de 42€ pour chaque 
                              euro investi. C&apos;est l&apos;outil parfait pour fidéliser vos clients et automatiser vos ventes.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-200">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="text-2xl">💡</div>
                          <h4 className="font-black text-gray-900 text-sm">Résultat Final</h4>
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          En combinant ces trois piliers, vous créez une stratégie marketing complète qui génère 
                          des résultats mesurables et durables.
                        </p>
                      </div>

                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 py-3 px-8">
                      <div className="flex items-center justify-between">
                        <div className="text-white/80 text-xs font-bold">Marketing Digital 2024</div>
                        <div className="text-white font-black text-sm">12</div>
                      </div>
                    </div>

                  </div>

                </div>
              </div>

              <div className="absolute bottom-8 left-8 right-8">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-4 rounded-r-lg shadow-lg">
                  <p className="text-xs font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    La solution :
                  </p>
                  <ul className="space-y-1 text-xs text-gray-800">
                    <li>✅ <strong>Design magazine</strong> premium</li>
                    <li>✅ <strong>Icons et couleurs</strong> pros</li>
                    <li>✅ <strong>Envie de lire</strong> immédiate</li>
                    <li>✅ <strong>Se vend</strong> 2 500 FCFA+</li>
                  </ul>
                </div>
              </div>

            </div>

            <div className="absolute inset-y-0 left-1/2 w-1 bg-gradient-to-b from-transparent via-white to-transparent transform -translate-x-1/2 z-30"></div>
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
              <div className="w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-gray-200">
                <span className="text-gray-900 font-black text-sm">VS</span>
              </div>
            </div>

          </div>
        </div>

        {/* MOBILE : Vertical stack */}
        <div className="md:hidden space-y-8">
          
          {/* HAUT - CHATGPT ULTRA MOCHE */}
          <div className="relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
              <div className="bg-red-600 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2">
                <X className="w-4 h-4" />
                <span className="font-bold text-xs">ChatGPT</span>
              </div>
            </div>

            <div className="bg-gray-300 rounded-3xl p-6 pt-12 shadow-xl">
              <div className="w-full max-h-[500px] bg-white shadow border-2 border-gray-500 overflow-hidden">
                
                <div className="p-4 overflow-y-auto max-h-[500px]" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
                  
                  <div className="mb-3 pb-2 border-b border-gray-300">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Les 3 Piliers du Marketing Digital
                    </h3>
                  </div>

                  <div className="space-y-2 text-xs text-gray-800 leading-relaxed">
                    
                    <p className="font-semibold">1. Les Réseaux Sociaux</p>
                    <p>
                      Les réseaux sociaux sont devenus incontournables pour toute stratégie marketing moderne. Facebook, Instagram et LinkedIn permettent d&apos;atteindre précisément votre audience cible.
                    </p>

                    <p className="font-semibold mt-3">2. Le Référencement (SEO)</p>
                    <p>
                      Le SEO est crucial pour améliorer votre visibilité sur Google. En optimisant votre contenu avec les bons mots-clés, vous pouvez attirer du trafic qualifié gratuitement.
                    </p>

                    <p className="font-semibold mt-3">3. L&apos;Email Marketing</p>
                    <p>
                      L&apos;email marketing reste le canal le plus rentable avec un ROI moyen de 42€ pour chaque euro investi.
                    </p>

                    <div className="mt-3 space-y-2">
                      <div className="h-8 bg-gray-200 border border-gray-400 flex items-center justify-center">
                        <span className="text-xs text-gray-500">[Aucune image]</span>
                      </div>
                      <div className="h-8 bg-gray-200 border border-gray-400 flex items-center justify-center">
                        <span className="text-xs text-gray-500">[Aucune image]</span>
                      </div>
                    </div>

                  </div>

                </div>

              </div>

              <div className="mt-4 bg-red-100 border-l-4 border-red-700 p-3 rounded-r shadow">
                <p className="text-xs font-black text-red-900 mb-1">❌ Le problème :</p>
                <p className="text-xs text-red-900">Texte brut ChatGPT, ZÉRO design, ZÉRO couleur</p>
              </div>

              {/* STAT CHATGPT - MOBILE */}
              <div className="mt-4 bg-red-100 border-2 border-red-500 rounded-2xl p-4 text-center shadow-lg">
                <div className="text-3xl font-black text-red-700 mb-1">3 jours</div>
                <p className="text-gray-800 font-semibold text-xs">Pour designer sur Canva</p>
                <p className="text-xs text-gray-700 mt-1">+ Compétences design</p>
              </div>
            </div>
          </div>

          {/* BADGE VS */}
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-gray-200">
              <span className="text-gray-900 font-black text-xs">VS</span>
            </div>
          </div>

          {/* BAS - BOOKZY PREMIUM */}
          <div className="relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span className="font-bold text-xs">Bookzy</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-3xl p-6 pt-12 shadow-2xl">
              <div className="w-full max-h-[500px] bg-white rounded-lg shadow-2xl overflow-hidden">
                
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="relative z-10">
                    <div className="text-white/80 text-xs font-bold mb-1 uppercase tracking-wider">Chapitre 03</div>
                    <h3 className="text-xl font-black text-white leading-tight">
                      Les 3 Piliers du<br/>Marketing Digital
                    </h3>
                  </div>
                </div>

                <div className="p-4 space-y-3 max-h-[350px] overflow-y-auto">
                  
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-3 border-l-4 border-blue-500">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">📱</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black text-gray-900 text-xs mb-1">1. Les Réseaux Sociaux</h4>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          Les réseaux sociaux sont devenus incontournables pour toute stratégie marketing moderne.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 border-l-4 border-purple-500">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">🔍</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black text-gray-900 text-xs mb-1">2. Le Référencement (SEO)</h4>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          Le SEO est crucial pour améliorer votre visibilité sur Google gratuitement.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border-l-4 border-green-500">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">📧</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black text-gray-900 text-xs mb-1">3. L&apos;Email Marketing</h4>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          ROI moyen de 42€ pour 1€ investi. Le canal le plus rentable.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="bg-gradient-to-r from-blue-500 to-purple-600 py-2 px-4">
                  <div className="flex items-center justify-between">
                    <div className="text-white/80 text-xs font-bold">Marketing Digital</div>
                    <div className="text-white font-black text-sm">12</div>
                  </div>
                </div>

              </div>

              <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-3 rounded-r-lg shadow">
                <p className="text-xs font-bold text-gray-900 mb-1">✅ La solution :</p>
                <p className="text-xs text-gray-800">Design premium qui se vend 2 500 FCFA+</p>
              </div>

              {/* STAT BOOKZY - MOBILE */}
              <div className="mt-4 bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-500 rounded-2xl p-4 text-center shadow-lg">
                <div className="text-3xl font-black text-green-700 mb-1">5 min</div>
                <p className="text-gray-800 font-semibold text-xs">Design automatique</p>
                <p className="text-xs text-gray-700 mt-1">Zéro compétence requise</p>
              </div>
            </div>
          </div>

        </div>

        {/* Stats DESKTOP ONLY */}
        <div className="hidden md:grid md:grid-cols-2 gap-8 mt-12">
          
          <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-6 text-center">
            <div className="text-5xl font-black text-red-600 mb-2">3 jours</div>
            <p className="text-gray-700 font-semibold">Pour designer sur Canva</p>
            <p className="text-sm text-gray-600 mt-2">+ Compétences design requises</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-6 text-center">
            <div className="text-5xl font-black text-green-600 mb-2">5 min</div>
            <p className="text-gray-700 font-semibold">Design automatique</p>
            <p className="text-sm text-gray-600 mt-2">Zéro compétence nécessaire</p>
          </div>

        </div>

      </div>

      {/* CTA */}
      <div className="text-center mt-12 px-6">
        <Link
          href="/auth/register"
          className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-sm md:text-base shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
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