"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

export default function ScreenFrame({ src, alt = "", aspect = "16/11", float = false, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: EASE }}
      className={className}
    >
      <motion.div
        animate={float ? { y: [0, -10, 0] } : undefined}
        transition={float ? { duration: 6, repeat: Infinity, ease: "easeInOut" } : undefined}
        className="rounded-2xl border border-neutral-200 bg-white shadow-[0_30px_70px_-25px_rgba(0,0,0,0.25)] overflow-hidden"
      >
        <div className="h-9 flex items-center gap-1.5 px-4 border-b border-neutral-100 bg-neutral-50">
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
        </div>
        <div className="overflow-hidden bg-white" style={{ aspectRatio: aspect }}>
          <img src={src} alt={alt} className="w-full h-full object-cover object-top" />
        </div>
      </motion.div>
    </motion.div>
  );
}
