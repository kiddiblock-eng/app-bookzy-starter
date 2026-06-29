"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Reveal, Stagger, staggerItem } from "./Reveal";

const ACCENT = "#5f7aa6";

const AVATARS = [
  "https://sucesspro.io/wp-content/uploads/2025/10/bc04d7c785a05a60584b5edc85860f47.jpg",
  "https://sucesspro.io/wp-content/uploads/2025/10/IMG_4306.jpg",
  "https://sucesspro.io/wp-content/uploads/2025/10/ef7c836ef8bee61bfcb4d5ff4bde5702.jpg",
];

const DATA = [
  { name: "Aïcha K.", role: "Coach · Abidjan", avatar: AVATARS[0], text: "J'ai créé mon premier ebook en 10 minutes et vendu 18 exemplaires sur WhatsApp la première semaine." },
  { name: "Moussa D.", role: "Infopreneur · Dakar", avatar: AVATARS[1], text: "Le Validateur m'a évité de perdre du temps sur une mauvaise idée. Maintenant je ne crée que ce qui se vend." },
  { name: "Grâce N.", role: "Créatrice · Douala", avatar: AVATARS[2], text: "Le design est tellement pro que les gens pensent que j'ai payé un graphiste. Tout est fait par l'IA." },
];

export default function Testimonials() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: ACCENT }}>Ils en parlent</p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900">Ils créent et vendent déjà.</h2>
        </Reveal>

        <Stagger className="grid md:grid-cols-3 gap-5">
          {DATA.map((t) => (
            <motion.div key={t.name} variants={staggerItem} className="rounded-2xl border border-neutral-200 bg-white p-7 flex flex-col">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={15} className="fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-[15px] text-neutral-700 leading-relaxed flex-1">« {t.text} »</p>
              <div className="flex items-center gap-3 mt-6">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold text-neutral-900">{t.name}</p>
                  <p className="text-xs text-neutral-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
