"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";

const fmt = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

export default function CTA() {
  const [creators, setCreators] = useState(11600); // arrondi au 100 inférieur
  useEffect(() => {
    let cancelled = false;
    fetch("/api/stats/users")
      .then((r) => r.json())
      .then((d) => { if (!cancelled && Number.isFinite(d?.count)) setCreators(Math.floor(d.count / 100) * 100); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="max-w-4xl mx-auto px-5 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-neutral-900 px-6 py-16 sm:py-20 text-center">
            {/* halo accent */}
            <div className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(ellipse 60% 70% at 50% 0%, rgba(5,150,105,0.45), transparent 70%)" }} />
            <div className="relative">
              <h2 className="text-white text-3xl sm:text-5xl font-extrabold tracking-tight">Ton premier ebook t'attend.</h2>
              <p className="text-neutral-400 mt-4 max-w-lg mx-auto leading-relaxed">
                Rejoins {fmt(creators)}+ créateurs. Génère ton ebook complet, prêt à vendre : couverture, affiche et textes de vente inclus.
              </p>
              <Link href="/auth/register"
                className="group mt-8 inline-flex items-center gap-2 px-7 py-3.5 bg-white text-neutral-900 rounded-full text-sm font-semibold hover:bg-neutral-100 transition-colors">
                Commencer gratuitement
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <p className="text-xs text-neutral-500 mt-4">Sans carte bancaire · Ton ebook prêt en quelques minutes</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
