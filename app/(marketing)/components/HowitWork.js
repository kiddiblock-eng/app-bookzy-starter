"use client";

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Configurez votre ebook",
      description: "Sujet, description, ton, chapitres, pages et template. 30 secondes.",
      visual: (
        <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-200 space-y-2">
          {/* Sujet */}
          <div>
            <div className="text-[9px] font-medium text-slate-400 mb-1">Sujet</div>
            <div className="bg-slate-50 rounded-md px-2 py-1.5 border border-slate-100">
              <span className="text-[10px] text-slate-600">Dresser son chien en 30 jours</span>
            </div>
          </div>
          
          {/* Row: Ton + Chapitres */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-[9px] font-medium text-slate-400 mb-1">Ton</div>
              <div className="bg-slate-50 rounded-md px-2 py-1.5 border border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-600">Pro</span>
                <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <div>
              <div className="text-[9px] font-medium text-slate-400 mb-1">Chapitres</div>
              <div className="bg-slate-50 rounded-md px-2 py-1.5 border border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-600">8</span>
                <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Row: Pages + Template */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-[9px] font-medium text-slate-400 mb-1">Pages</div>
              <div className="bg-slate-50 rounded-md px-2 py-1.5 border border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-600">60</span>
                <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <div>
              <div className="text-[9px] font-medium text-slate-400 mb-1">Template</div>
              <div className="bg-slate-50 rounded-md px-2 py-1.5 border border-slate-100 flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-gradient-to-br from-blue-400 to-blue-600" />
                <span className="text-[10px] text-slate-600">Moderne</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      number: "2",
      title: "L'IA génère tout",
      description: "Contenu, mise en page, cover 3D, textes marketing. 60 secondes.",
      visual: (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-center py-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-blue-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-slate-400">IA</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-1 mt-2">
            <div className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )
    },
    {
      number: "3",
      title: "Téléchargez & vendez",
      description: "PDF pro, cover, posts sociaux. Prêt à monétiser.",
      visual: (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex gap-2 justify-center">
            {/* Mini PDF */}
            <div className="w-12 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-[8px] font-bold text-white">PDF</span>
            </div>
            {/* Mini Cover */}
            <div className="w-12 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-md" />
            {/* Mini Marketing */}
            <div className="w-12 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-[8px] font-bold text-white">TXT</span>
            </div>
          </div>
          <div className="flex justify-center mt-3">
            <div className="px-3 py-1 bg-green-100 rounded-full">
              <span className="text-[10px] font-semibold text-green-700">✓ Prêt</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="howitWorks" className="bg-slate-50 py-16 lg:py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-blue-600 text-sm font-semibold tracking-wide uppercase mb-4">
            Comment ça marche
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            De l'idée à l'ebook en 3 clics
          </h2>
        </div>

        {/* Steps */}
        <div className="relative">
          
          {/* Connection line - desktop */}
          <div className="hidden lg:block absolute top-1/2 left-[20%] right-[20%] h-px bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200" />
          
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                
                {/* Card */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300 h-full">
                  
                  {/* Number badge */}
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg mb-5 shadow-lg shadow-blue-600/20">
                    {step.number}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-500 text-sm mb-5">
                    {step.description}
                  </p>

                  {/* Visual */}
                  {step.visual}

                </div>

                {/* Arrow between cards - mobile only */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center py-4 lg:hidden">
                    <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}