"use client";

import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative bg-white min-h-[100dvh] overflow-hidden">

      {/* ── FOND SUBTIL ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} 
        />
        {/* Glow bleu top */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-40"
          style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.1) 0%, transparent 70%)' }} 
        />
        {/* Glow bleu bottom */}
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)' }} 
        />
      </div>

      {/* ── FLOATING PARTICLES ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-1.5 h-1.5 bg-blue-500 rounded-full animate-float" style={{ left: '10%', top: '20%' }} />
        <div className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full animate-float-delayed" style={{ left: '20%', top: '60%' }} />
        <div className="absolute w-1.5 h-1.5 bg-blue-500 rounded-full animate-float-slow" style={{ left: '80%', top: '30%' }} />
        <div className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full animate-float" style={{ left: '70%', top: '70%' }} />
        <div className="absolute w-1.5 h-1.5 bg-blue-500 rounded-full animate-float-delayed" style={{ left: '90%', top: '50%' }} />
        <div className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full animate-float-slow" style={{ left: '5%', top: '80%' }} />
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-start px-5 sm:px-6 pt-28 lg:pt-32 pb-12 text-center">

        {/* Text Content */}
        <div className="max-w-2xl w-full flex flex-col items-center">

          {/* Titre */}
          <h1 className="hero-up mb-5" style={{ animationDelay: '0s' }}>
            <span className="block text-[2.25rem] sm:text-[2.75rem] md:text-[3.5rem] lg:text-[4rem] font-black leading-[1.08] tracking-[-0.03em] text-slate-950">
              Génère ton 
            </span>
            <span className="block text-[2.25rem] sm:text-[2.75rem] md:text-[3.5rem] lg:text-[4rem] font-black leading-[1.08] tracking-[-0.03em]">
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"> ebook pro en 1 min
</span>
              <span className="text-slate-950">  avec l'IA</span>
            </span>
          </h1>

          {/* Sous-titre */}
          <p className="hero-up text-base sm:text-lg md:text-xl text-slate-500 leading-relaxed max-w-lg mb-8" style={{ animationDelay: '0.1s' }}>
            Décris ton sujet. L'IA structure, rédige, met en page et génère ta couverture 3D. Tu reçois un PDF prêt à vendre et un kit marketing en 60 secondes


          </p>

          {/* CTAs */}
          <div className="hero-up flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto mb-8" style={{ animationDelay: '0.2s' }}>
            <Link
              href="/auth/register"
              className="group relative inline-flex items-center justify-center gap-2.5 h-14 px-8 rounded-xl text-base font-bold text-white bg-blue-600 overflow-hidden transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/20 hover:-translate-y-0.5 active:scale-[0.98] w-full sm:w-auto"
            >
              Créer mon ebook
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <button
              onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center justify-center gap-2 h-14 px-6 rounded-xl text-base font-semibold text-slate-600 border-2 border-slate-200 transition-all duration-300 hover:border-blue-300 hover:bg-blue-50 active:scale-[0.98] w-full sm:w-auto"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Voir la démo
            </button>
          </div>

        </div>

        {/* ── ROBOT IMAGE ── */}
        <div className="hero-up relative w-full max-w-sm sm:max-w-md md:max-w-lg mt-4" style={{ animationDelay: '0.3s' }}>
          <div className="relative flex items-center justify-center">

            {/* Orbital rings */}
            <div className="absolute inset-0 border border-blue-500/10 rounded-full animate-spin-slow" />
            <div className="absolute -inset-[8%] border border-blue-500/5 rounded-full animate-spin-slower" />

            {/* Glow effect */}
            <div 
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-24 rounded-full blur-3xl opacity-40 animate-pulse-slow"
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)' }}
            />

            {/* Robot Image */}
            <img 
              src="/hero-robot.png" 
              alt="Bookzy AI Assistant" 
              className="relative z-10 w-full h-auto max-h-[400px] sm:max-h-[450px] object-contain"
              style={{ filter: 'drop-shadow(0 25px 50px rgba(59, 130, 246, 0.2))' }}
            />

            {/* Floating tags */}
            <div className="absolute inset-0 pointer-events-none">
              <span className="absolute top-[8%] -left-[5%] sm:-left-[10%] px-3 py-1.5 sm:px-4 sm:py-2 bg-white shadow-lg shadow-slate-900/5 border border-slate-100 rounded-full text-xs font-medium text-slate-600 whitespace-nowrap animate-float">
                 PDF Pro
              </span>
              <span className="absolute top-[25%] -right-[5%] sm:-right-[10%] px-3 py-1.5 sm:px-4 sm:py-2 bg-white shadow-lg shadow-slate-900/5 border border-slate-100 rounded-full text-xs font-medium text-slate-600 whitespace-nowrap animate-float-delayed">
                 Cover 3D
              </span>
              <span className="absolute bottom-[35%] -left-[8%] sm:-left-[12%] px-3 py-1.5 sm:px-4 sm:py-2 bg-white shadow-lg shadow-slate-900/5 border border-slate-100 rounded-full text-xs font-medium text-slate-600 whitespace-nowrap animate-float-slow">
                 60 sec
              </span>
              <span className="absolute bottom-[20%] -right-[8%] sm:-right-[12%] px-3 py-1.5 sm:px-4 sm:py-2 bg-white shadow-lg shadow-slate-900/5 border border-slate-100 rounded-full text-xs font-medium text-slate-600 whitespace-nowrap animate-float">
               kit marketing  
              </span>
            </div>

          </div>
        </div>

        {/* ── STATS ── */}
        <div className="hero-up relative z-20 -mt-12 sm:-mt-16 flex flex-wrap justify-center gap-6 sm:gap-10 px-6 py-5 bg-white/90 backdrop-blur-sm border border-slate-100 rounded-2xl shadow-lg shadow-slate-900/5" style={{ animationDelay: '0.4s' }}>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">1,300+</div>
            <div className="text-xs sm:text-sm text-slate-500 mt-0.5">Utilisateurs</div>
          </div>
          <div className="w-px h-12 bg-slate-200 hidden sm:block" />
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">8,000+</div>
            <div className="text-xs sm:text-sm text-slate-500 mt-0.5">Ebooks créés</div>
          </div>
          <div className="w-px h-12 bg-slate-200 hidden sm:block" />
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">4.9★</div>
            <div className="text-xs sm:text-sm text-slate-500 mt-0.5">Satisfaction</div>
          </div>
        </div>

      </div>

      {/* ── ANIMATIONS ── */}
      <style jsx global>{`
        @keyframes heroUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-up {
          opacity: 0;
          animation: heroUp 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float 5s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 4.5s ease-in-out infinite;
          animation-delay: 0.5s;
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 25s linear infinite;
        }
        .animate-spin-slower {
          animation: spin-slow 35s linear infinite reverse;
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.5; transform: translateX(-50%) scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}