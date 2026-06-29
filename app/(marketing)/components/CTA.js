"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";

export default function CTA() {
  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="max-w-4xl mx-auto px-5 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-neutral-900 px-6 py-16 sm:py-20 text-center">
            {/* halo accent */}
            <div className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(ellipse 60% 70% at 50% 0%, rgba(95,122,166,0.45), transparent 70%)" }} />
            <div className="relative">
              <h2 className="text-white text-3xl sm:text-5xl font-extrabold tracking-tight">Ton premier ebook t'attend.</h2>
              <p className="text-neutral-400 mt-4 max-w-lg mx-auto leading-relaxed">
                Rejoins 25 000+ créateurs. Trouve un sujet, génère ton ebook, vends-le. Gratuit pour commencer.
              </p>
              <Link href="/auth/register"
                className="group mt-8 inline-flex items-center gap-2 px-7 py-3.5 bg-white text-neutral-900 rounded-full text-sm font-semibold hover:bg-neutral-100 transition-colors">
                Commencer gratuitement
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <p className="text-xs text-neutral-500 mt-4">Sans carte bancaire · Premier ebook en 1 minute</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
