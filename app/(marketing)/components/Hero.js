"use client";

import Link from 'next/link';
import { ArrowRight, Wand2, CheckCircle2, FileText, Download } from 'lucide-react';

export default function Hero() {
  
  const users = [
    { src: "/images/garcon1.jpg", alt: "User 1" },
    { src: "/images/fillenoir.jpg", alt: "User 2" },
    { src: "/images/filleblanche1.jpg", alt: "User 4" },
    { src: "/images/garcon3.jpg", alt: "User 5" },
  ];

  return (
    <section className="relative pt-32 pb-24 lg:pt-36 lg:pb-32 overflow-hidden bg-white">
      
      {/* FOND DÉGRADÉ STYLE STRIPE */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-violet-50 lg:from-blue-50 lg:via-white lg:to-violet-50"></div>
      
      {/* LUEURS BLEU-VIOLET - Style Stripe */}
      <div className="absolute top-[-15%] right-[-15%] w-[700px] h-[700px] lg:w-[900px] lg:h-[900px] bg-gradient-to-br from-blue-400/20 via-indigo-400/15 to-transparent rounded-full blur-[120px] pointer-events-none z-0 animate-pulse-slow"></div>
      <div className="absolute bottom-[-15%] left-[-15%] w-[600px] h-[600px] lg:w-[800px] lg:h-[800px] bg-gradient-to-tr from-violet-400/20 via-purple-400/15 to-transparent rounded-full blur-[120px] pointer-events-none z-0 animate-pulse-slow" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-indigo-400/10 to-transparent rounded-full blur-[100px] pointer-events-none z-0"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* COLONNE GAUCHE */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left relative max-w-2xl mx-auto lg:mx-0">
            
            {/* Badge - Minimaliste */}
            <div className="inline-flex items-center gap-2.5 px-0 lg:px-4 py-0 lg:py-1.5 rounded-full bg-transparent lg:bg-white border-0 lg:border lg:border-slate-200 shadow-none lg:shadow-sm mb-10 lg:mb-8">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span className="text-sm lg:text-xs font-bold text-slate-900 lg:text-slate-600 uppercase tracking-wider">
                IA GÉNÉRATIVE V2.0
              </span>
            </div>

            {/* Titre - TRÈS GRAND et IMPOSANT comme dans l'artifact */}
            <h1 className="text-[3.5rem] leading-[1.05] sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight mb-10 lg:mb-6 lg:tracking-tighter lg:leading-[1.05]">
              Générer votre eBook pro{" "}
              <span className="text-blue-600 lg:text-transparent lg:bg-clip-text lg:bg-gradient-to-r lg:from-blue-600 lg:via-indigo-600 lg:to-violet-600">
                en 1 min
              </span>
            </h1>

            {/* Description - Grande et lisible */}
            <p className="text-xl leading-relaxed lg:text-xl text-slate-700 lg:text-slate-600 mb-12 lg:mb-10 max-w-2xl font-normal lg:font-medium">
               Notre IA ne génère pas seulement du texte brut . Elle structure, rédige, met en page et prépare le kit marketing. Vous obtenez un produit digital fini,  <strong className="text-slate-900 font-bold">prêt à vendre</strong>, sans attendre.
            </p>

            {/* CTAs - Grands et espacés */}
            <div className="flex flex-col gap-4 lg:flex-row lg:gap-4 w-full lg:w-auto mb-16 lg:mb-12">
              <Link
                href="/auth/register"
                className="h-16 lg:h-14 px-12 lg:px-8 bg-slate-900 text-white text-lg lg:text-base font-bold rounded-2xl lg:rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10 hover:shadow-2xl hover:-translate-y-1"
              >
                <span>Essayer gratuitement</span>
              </Link>

              <button
                onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                className="group h-16 lg:h-14 px-12 lg:px-8 bg-white text-slate-900 lg:text-slate-700 border-2 border-slate-200 text-lg lg:text-base font-bold rounded-2xl lg:rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                <span>Voir la démo</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Preuve sociale - Simple et clean */}
            <div className="flex items-center gap-4">
               <div className="flex -space-x-2">
                  {users.map((user, index) => (
                      <img 
                          key={index}
                          src={user.src} 
                          alt={user.alt} 
                          className="w-10 h-10 rounded-full border-2 border-white object-cover"
                      />
                  ))}
               </div>
               <div className="flex flex-col text-left">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => <span key={i} className="text-orange-400 text-sm">★</span>)}
                  </div>
                  <span className="text-sm font-bold text-slate-900">+1,200 eBooks créés</span>
               </div>
            </div>

          </div>

          {/* COLONNE DROITE : VISUEL PC - Inchangé */}
          <div className="relative h-[600px] w-full hidden lg:flex items-center justify-center perspective-1000">
             
             {/* Halo */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-tr from-blue-100/50 to-violet-100/50 rounded-full blur-[80px] animate-pulse-slow"></div>

             {/* Ligne de connexion animée entre les cartes */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none z-5" xmlns="http://www.w3.org/2000/svg">
               <path
                 d="M 100 120 Q 200 250, 280 280 T 420 480"
                 stroke="url(#gradient)"
                 strokeWidth="2"
                 fill="none"
                 strokeDasharray="5,5"
                 className="animate-dash"
               />
               <defs>
                 <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                   <stop offset="0%" style={{stopColor: '#3b82f6', stopOpacity: 0.3}} />
                   <stop offset="100%" style={{stopColor: '#8b5cf6', stopOpacity: 0.3}} />
                 </linearGradient>
               </defs>
             </svg>

             {/* CARTE 1 : INPUT */}
             <div className="absolute top-20 left-10 w-64 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 animate-float-slow z-10 hover:scale-105 transition-transform">
                <div className="flex items-center gap-3 mb-3">
                   <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <Wand2 className="w-4 h-4" />
                   </div>
                   <div className="text-xs font-bold text-slate-400 uppercase">Votre sujet</div>
                </div>
                <div className="space-y-2">
                   <div className="h-2 w-full bg-gradient-to-r from-slate-200 to-slate-100 rounded-full"></div>
                   <div className="h-2 w-2/3 bg-gradient-to-r from-slate-200 to-slate-100 rounded-full"></div>
                </div>
             </div>

             {/* CARTE 2 : PROCESS */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 animate-float-medium z-20 hover:scale-105 transition-transform">
                <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                   <span className="text-xs font-bold text-slate-900">Génération IA...</span>
                   <div className="animate-spin w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full"></div>
                </div>
                <div className="space-y-3">
                   <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Structure</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                   </div>
                   <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Rédaction</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                   </div>
                   <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Mise en page</span>
                      <div className="w-4 h-4 border-2 border-slate-200 border-t-violet-500 rounded-full animate-spin"></div>
                   </div>
                   <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                       <div className="bg-gradient-to-r from-blue-500 to-violet-500 h-1.5 rounded-full w-[75%] animate-pulse"></div>
                   </div>
                </div>
             </div>

             {/* CARTE 3 : RÉSULTAT */}
             <div className="absolute bottom-20 right-0 w-72 bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl shadow-2xl shadow-violet-900/30 animate-float-fast z-30 border border-slate-700/50 hover:scale-105 transition-transform">
                <div className="flex items-center gap-4 mb-4">
                   <div className="w-12 h-14 bg-gradient-to-br from-slate-700 to-slate-600 rounded-lg flex items-center justify-center border border-slate-600/50 shadow-inner">
                      <FileText className="w-6 h-6 text-white" />
                   </div>
                   <div>
                      <h3 className="text-white font-bold text-sm leading-tight">MonEbook_Final.pdf</h3>
                      <p className="text-slate-400 text-xs mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Prêt à vendre
                      </p>
                   </div>
                </div>
                <button className="w-full py-3 bg-white text-slate-900 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors shadow-lg">
                   <Download className="w-4 h-4" />
                   Télécharger maintenant
                </button>
             </div>

          </div>

        </div>
      </div>
      
      <style jsx global>{`
        .perspective-1000 { perspective: 1000px; }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        .animate-pulse-slow { animation: pulse-slow 8s infinite ease-in-out; }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float-slow { animation: float 6s ease-in-out infinite; }
        .animate-float-medium { animation: float 5s ease-in-out infinite; animation-delay: 1s; }
        .animate-float-fast { animation: float 4s ease-in-out infinite; animation-delay: 0.5s; }
        
        @keyframes dash {
          to { stroke-dashoffset: -20; }
        }
        .animate-dash { animation: dash 2s linear infinite; }
      `}</style>
    </section>
  );
}