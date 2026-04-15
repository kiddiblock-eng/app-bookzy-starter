"use client";

import Image from "next/image";

export default function ChangelogHero() {
  return (
    <section className="relative w-full overflow-hidden" style={{ height: "100svh", minHeight: 500 }}>

      {/* IMAGE DESKTOP */}
      <div className="hidden md:block absolute inset-0">
        <Image
          src="/Marsp.png"
          alt="Bookzy V1.2 MARS"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* IMAGE MOBILE */}
      <div className="block md:hidden absolute inset-0">
        <Image
          src="/Marsm.png"
          alt="Bookzy V1.2 MARS"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/40" />

      {/* CONTENU */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">

        {/* Eyebrow */}
        <p className="text-white/80 text-sm md:text-base font-bold tracking-widest uppercase mb-4 md:mb-6">
          Bookzy<span className="text-white mx-1">|</span>EXplorez votre univers
        </p>

        {/* Version + Nom */}
        <h1 className="font-black leading-none tracking-tight mb-4 md:mb-6">
          <span className="text-white text-6xl md:text-8xl lg:text-9xl">V1.2 </span>
          <span className="text-blue-400 text-6xl md:text-8xl lg:text-9xl">MARS</span>
        </h1>

        {/* Tagline */}
        <p className="text-white/90 text-sm md:text-lg font-semibold max-w-md md:max-w-xl leading-relaxed">
          Espionnez. Créez. Publiez. Le tout en quelques minutes.
        </p>

        {/* Badge date */}
        <div className="mt-8 md:mt-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-white/80 text-xs font-semibold uppercase tracking-widest">
            Avril 2026 — Version actuelle
          </span>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
          <span className="text-white text-xs font-semibold uppercase tracking-widest">Découvrir</span>
          <div className="w-px h-8 bg-white/50 animate-pulse" />
        </div>

      </div>
    </section>
  );
}