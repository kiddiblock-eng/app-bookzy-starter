"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpenCheck,
  Quote,
  CheckCircle2,
  ImageIcon,
  LayoutGrid
} from "lucide-react";

// 🧩 Import Recharts
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, CartesianGrid
} from "recharts";

import luxe from "../../../../data/templates/luxe.json";
import modern from "../../../../data/templates/modern.json";
import minimal from "../../../../data/templates/minimal.json";
import creative from "../../../../data/templates/creative.json";
import educatif from "../../../../data/templates/educatif.json";
import energie from "../../../../data/templates/energie.json";

const styleMap = {
  luxe: {
    name: "Luxe",
    coverClass: "bg-gradient-to-br from-zinc-900 via-black to-zinc-900",
    coverTitle: "text-yellow-300",
    pageBg: "bg-neutral-50 dark:bg-neutral-950",
    card: "bg-white/95 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 shadow-xl",
    accent: "text-yellow-600 dark:text-yellow-400",
    accentBg: "bg-yellow-400/10 border-yellow-400/30",
    divider: "border-yellow-300/40",
    quoteLeft: "border-l-4 border-yellow-400/70 bg-yellow-50/50 dark:bg-yellow-950/20",
    checkIcon: "text-yellow-500",
    listBg: "bg-yellow-50/80 dark:bg-yellow-950/30 border-yellow-400/20"
  },
  modern: {
    name: "Moderne",
    coverClass: "bg-gradient-to-br from-blue-600 to-blue-800",
    coverTitle: "text-white",
    pageBg: "bg-neutral-50 dark:bg-neutral-950",
    card: "bg-white/95 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 shadow-xl",
    accent: "text-blue-600 dark:text-blue-400",
    accentBg: "bg-blue-50/80 dark:bg-blue-950/30 border-blue-400/30",
    divider: "border-blue-300/40",
    quoteLeft: "border-l-4 border-blue-500/70 bg-blue-50/50 dark:bg-blue-950/20",
    checkIcon: "text-blue-500",
    listBg: "bg-blue-50/80 dark:bg-blue-950/30 border-blue-400/20"
  },
  minimal: {
    name: "Minimaliste",
    coverClass: "bg-gradient-to-br from-neutral-200 to-white dark:from-neutral-900 dark:to-black",
    coverTitle: "text-neutral-900 dark:text-neutral-100",
    pageBg: "bg-white dark:bg-black",
    card: "bg-white/95 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 shadow-xl",
    accent: "text-neutral-700 dark:text-neutral-300",
    accentBg: "bg-neutral-100/80 dark:bg-neutral-800/50 border-neutral-300/30",
    divider: "border-neutral-300/40 dark:border-neutral-700/40",
    quoteLeft: "border-l-4 border-neutral-400/70 bg-neutral-50/50 dark:bg-neutral-900/20",
    checkIcon: "text-neutral-600 dark:text-neutral-400",
    listBg: "bg-neutral-50/80 dark:bg-neutral-900/50 border-neutral-300/20"
  },
  creative: {
    name: "Créatif",
    coverClass: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500",
    coverTitle: "text-white",
    pageBg: "bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-neutral-950 dark:to-purple-950/30",
    card: "bg-white/95 dark:bg-neutral-900/90 border-2 border-purple-300/50 dark:border-purple-700/50 shadow-2xl",
    accent: "text-purple-600 dark:text-purple-400",
    accentBg: "bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950/50 dark:to-pink-950/50 border-purple-400/30",
    divider: "border-purple-300/40",
    quoteLeft: "border-l-4 border-pink-500/70 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20",
    checkIcon: "text-pink-500",
    listBg: "bg-gradient-to-br from-purple-50/80 via-pink-50/80 to-orange-50/80 dark:from-purple-950/30 dark:to-orange-950/30 border-purple-400/20"
  },
  educatif: {
    name: "Éducatif",
    coverClass: "bg-gradient-to-br from-green-600 to-teal-700",
    coverTitle: "text-white",
    pageBg: "bg-green-50/30 dark:bg-neutral-950",
    card: "bg-white/95 dark:bg-neutral-900/90 border border-green-200 dark:border-green-800 shadow-xl",
    accent: "text-green-600 dark:text-green-400",
    accentBg: "bg-green-50/80 dark:bg-green-950/30 border-green-400/30",
    divider: "border-green-300/40",
    quoteLeft: "border-l-4 border-green-500/70 bg-green-50/50 dark:bg-green-950/20",
    checkIcon: "text-green-500",
    listBg: "bg-green-50/80 dark:bg-green-950/30 border-green-400/20"
  },
  energie: {
    name: "Énergique",
    coverClass: "bg-gradient-to-br from-red-600 via-orange-600 to-yellow-500",
    coverTitle: "text-white",
    pageBg: "bg-gradient-to-br from-orange-50 to-red-50 dark:from-neutral-950 dark:to-red-950/20",
    card: "bg-white/95 dark:bg-neutral-900/90 border-2 border-orange-300/50 dark:border-orange-700/50 shadow-2xl",
    accent: "text-orange-600 dark:text-orange-400",
    accentBg: "bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-950/50 dark:to-red-950/50 border-orange-400/30",
    divider: "border-orange-300/40",
    quoteLeft: "border-l-4 border-red-500/70 bg-gradient-to-r from-orange-50/50 to-red-50/50 dark:from-orange-950/20 dark:to-red-950/20",
    checkIcon: "text-red-500",
    listBg: "bg-gradient-to-br from-orange-50/80 to-red-50/80 dark:from-orange-950/30 dark:to-red-950/30 border-orange-400/20"
  }
};

const contentRegistry = { luxe, modern, minimal, creative, educatif, energie };

export default function TemplateScrollView() {
  const { id } = useParams();
  const router = useRouter();

  const tplId = Array.isArray(id) ? id[0] : id;
  const content = contentRegistry[tplId];
  const styles = styleMap[tplId] || styleMap.modern;

  const scrollRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // DÉTECTION MOBILE : On utilise window.scrollY car le conteneur n'a plus de hauteur fixe
      if (window.innerWidth < 768) {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        // Evite la division par zéro
        const percentage = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        setProgress(Math.min(100, Math.max(0, percentage)));
      } else {
        // MODE DESKTOP : On garde le ref scroll
        const element = scrollRef.current;
        if (element) {
          const total = element.scrollHeight - element.clientHeight;
          const scrolled = element.scrollTop;
          const percentage = (scrolled / total) * 100;
          setProgress(Math.min(100, Math.max(0, percentage)));
        }
      }
    };

    window.addEventListener("scroll", handleScroll); // Essentiel pour mobile
    const container = scrollRef.current;
    if (container) container.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (container) container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!content) return null;

  const getChartColors = () => {
    switch (tplId) {
      case "luxe": return { primary: "#eab308", secondary: "#fbbf24", tertiary: "#fcd34d" };
      case "creative": return { primary: "#a855f7", secondary: "#ec4899", tertiary: "#f97316" };
      case "educatif": return { primary: "#16a34a", secondary: "#22c55e", tertiary: "#4ade80" };
      case "energie": return { primary: "#dc2626", secondary: "#f97316", tertiary: "#fb923c" };
      case "minimal": return { primary: "#525252", secondary: "#737373", tertiary: "#a3a3a3" };
      default: return { primary: "#2563eb", secondary: "#3b82f6", tertiary: "#60a5fa" };
    }
  };

  const chartColors = getChartColors();
  const pieColors = [chartColors.primary, chartColors.secondary, chartColors.tertiary, "#10b981", "#ef4444", "#8b5cf6"];

  return (
    // IMPORTANT: 'min-h-screen' sur le parent, mais PAS de 'h-screen' ou 'overflow-hidden' qui bloquerait le scroll mobile
    <div className={`${styles.pageBg} min-h-screen transition-colors duration-300 pb-0`}>
      
      {/* 🟢 HEADER OPTIMISÉ MOBILE : Plus petit padding, sticky */}
      <div className="sticky top-0 z-[100] bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border-b border-neutral-200/50 dark:border-neutral-800/50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.push("/dashboard/templates")}
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={20} /> 
            {/* Masquer le texte "Retour" sur très petits écrans si nécessaire */}
            <span className="font-medium">Retour</span>
          </button>

          {/* Titre masqué sur mobile pour laisser place au bouton d'action */}
          <div className="hidden md:flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
            <BookOpenCheck size={16} className={styles.accent} />
            <span>Template <strong className={styles.accent}>{styles.name}</strong></span>
          </div>
          
          <Link
            href={`/dashboard/projets/nouveau?template=${tplId}`}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-sm shadow-md transition-transform active:scale-95 ${
              tplId === "luxe" ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black"
              : tplId === "creative" ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              : tplId === "energie" ? "bg-gradient-to-r from-red-600 to-orange-600 text-white"
              : "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
            }`}
          >
            <BookOpenCheck size={16} /> 
            <span>Utiliser</span>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-4 md:py-6 relative">
        {/* 🔴 POINT CRITIQUE DE LA CORRECTION : 
            Mobile: h-auto (laisse le contenu pousser la page), overflow-visible, snap-none
            Desktop: h-[82vh], overflow-y-scroll, snap-y
        */}
        <div
          ref={scrollRef}
          className="
            w-full
            h-auto overflow-visible snap-none
            md:h-[82vh] md:overflow-y-scroll md:snap-y md:snap-mandatory md:scroll-smooth 
            space-y-8 md:space-y-10 
            pb-24 md:pb-20 
            pt-4 md:pt-0
            scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700 scrollbar-track-transparent
          "
        >
          {/* COUVERTURE */}
          <section
            className={`
              md:snap-start 
              min-h-[50vh] md:min-h-[82vh] 
              flex flex-col items-center justify-center text-center 
              rounded-2xl md:rounded-3xl 
              ${styles.coverClass} 
              p-8 md:p-20 
              relative overflow-hidden shadow-xl
            `}
          >
            <div className="relative z-10">
              <div className="mb-4 inline-block">
                <BookOpenCheck size={40} className={`${styles.coverTitle} opacity-80`} />
              </div>
              <h1 className={`text-4xl md:text-7xl font-black ${styles.coverTitle} mb-4 leading-tight`}>
                {content.title}
              </h1>
              <div className={`w-20 h-1 mx-auto my-4 rounded-full ${styles.coverTitle.replace('text-', 'bg-')} opacity-60`}></div>
              <p className={`text-lg md:text-2xl font-light ${styles.coverTitle} opacity-90`}>
                {content.subtitle}
              </p>
            </div>
          </section>

          {/* CHAPITRES */}
          {content.chapters.map((ch, idx) => (
            <section
              key={idx}
              className={`
                md:snap-start 
                rounded-2xl md:rounded-3xl 
                p-5 md:p-12 
                ${styles.card} 
              `}
            >
              {/* Header Chapitre */}
              <div className="mb-6 border-b pb-4 border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`flex items-center justify-center w-8 h-8 rounded-full ${styles.accentBg} ${styles.accent} font-bold`}>
                    {idx + 1}
                  </span>
                  <h2 className={`text-2xl md:text-4xl font-bold ${styles.accent}`}>
                    {ch.title}
                  </h2>
                </div>
              </div>

              {ch.image && (
                <div className="relative w-full h-48 md:h-80 mb-6 rounded-xl overflow-hidden shadow-sm">
                  <Image src={ch.image} alt={ch.title} fill className="object-cover" />
                </div>
              )}

              {/* Contenu Sections */}
              {ch.sections.map((s, i) => (
                <div key={i} className="mb-8 last:mb-0">
                  {s.heading && (
                    <h3 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3 flex items-center gap-2">
                       <span className={`w-1.5 h-6 rounded-full ${styles.accent.replace('text-', 'bg-')}`}></span>
                       {s.heading}
                    </h3>
                  )}

                  {s.text && (
                    // Augmentation de la taille du texte sur mobile (text-base) vs desktop (text-lg)
                    <div className="prose prose-base md:prose-lg dark:prose-invert max-w-none mb-4 text-justify leading-relaxed text-neutral-700 dark:text-neutral-300">
                      {s.text.split('\n\n').map((paragraph, pIdx) => (
                        <p key={pIdx} className="mb-3">{paragraph}</p>
                      ))}
                    </div>
                  )}

                  {s.quote && (
                    <div className={`my-6 p-5 rounded-xl ${styles.quoteLeft} border-l-4 bg-opacity-50`}>
                      <Quote className={`w-6 h-6 mb-2 ${styles.accent} opacity-50`} />
                      <p className="text-lg italic text-neutral-800 dark:text-neutral-200">
                        {s.quote}
                      </p>
                    </div>
                  )}

                  {s.list && Array.isArray(s.list) && (
                    <ul className={`my-6 space-y-3 p-4 rounded-xl ${styles.listBg} border`}>
                      {s.list.map((item, listIdx) => (
                        <li key={listIdx} className="flex items-start gap-3">
                          <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${styles.checkIcon} mt-1`} />
                          <span className="text-neutral-800 dark:text-neutral-200">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {s.table && (
                    <div className="my-6 overflow-x-auto border rounded-xl border-neutral-200 dark:border-neutral-800">
                      <table className="w-full text-sm min-w-[300px]">
                        <thead>
                          <tr className={`${styles.accentBg} border-b`}>
                            {s.table.headers.map((h, j) => (
                              <th key={j} className="px-4 py-3 text-left font-semibold text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {s.table.rows.map((r, j) => (
                            <tr key={j} className="border-b border-neutral-100 dark:border-neutral-800 last:border-0">
                              {r.map((c, k) => (
                                <td key={k} className="px-4 py-3 text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
                                  {c}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {s.gallery && Array.isArray(s.gallery) && (
                    <div className="grid grid-cols-2 gap-3 my-6">
                       {s.gallery.map((imgUrl, gIdx) => (
                          <div key={gIdx} className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100">
                            <Image src={imgUrl} alt="Gallery" fill className="object-cover" />
                          </div>
                       ))}
                    </div>
                  )}

                  {s.elements?.map((el, j) => {
                    if (el.type === "chart") {
                      return (
                        <div key={j} className={`my-8 p-4 rounded-xl ${styles.accentBg} border overflow-hidden`}>
                          <p className="font-bold mb-4 text-neutral-900 dark:text-neutral-100">{el.title}</p>
                          <div className="-ml-2">
                             <ResponsiveContainer width="100%" height={250}>
                                {el.chartType === "line" ? (
                                  <LineChart data={el.data}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                                    <XAxis dataKey={el.xKey} tick={{fontSize: 10}} />
                                    <YAxis tick={{fontSize: 10}} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey={el.yKey} stroke={chartColors.primary} strokeWidth={3} dot={false} />
                                  </LineChart>
                                ) : el.chartType === "bar" ? (
                                  <BarChart data={el.data}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                                    <XAxis dataKey={el.xKey} tick={{fontSize: 10}} />
                                    <YAxis tick={{fontSize: 10}} />
                                    <Tooltip />
                                    <Bar dataKey={el.yKey || "views"} fill={chartColors.secondary} radius={[4, 4, 0, 0]} />
                                  </BarChart>
                                ) : (
                                  <PieChart>
                                    <Pie data={el.data} dataKey="value" cx="50%" cy="50%" outerRadius={70}>
                                      {el.data.map((_, index) => <Cell key={index} fill={pieColors[index % pieColors.length]} />)}
                                    </Pie>
                                    <Tooltip />
                                  </PieChart>
                                )}
                             </ResponsiveContainer>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              ))}
            </section>
          ))}
        </div>

        {/* Barre de progression */}
        <div className="fixed bottom-0 left-0 right-0 h-1.5 md:h-2 bg-neutral-200/50 dark:bg-neutral-800/50 z-[100]">
          <div
            className={`h-full transition-all duration-300 ${
              tplId === "luxe" ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
              : tplId === "creative" ? "bg-gradient-to-r from-purple-600 to-pink-600"
              : tplId === "energie" ? "bg-gradient-to-r from-red-600 to-orange-600"
              : "bg-gradient-to-r from-blue-600 to-blue-700"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}