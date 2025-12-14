"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Rocket,
  BookOpen,
  Palette,
  GraduationCap,
  Gem,
  Zap,
  Eye,
  Check,
  Sparkles,
  ArrowRight
} from "lucide-react";

const templates = [
  {
    id: "modern",
    name: "Moderne",
    icon: Rocket,
    iconColor: "text-blue-500",
    bgGradient: "from-blue-500 to-blue-600",
    image: "https://sucesspro.io/wp-content/uploads/2025/11/idees-art-creatif-conception-mot-concept-scaled.jpg",
    desc: "Style professionnel, moderne et motivant.",
    tags: ["Business", "Professionnel", "Startup"],
    popular: true
  },
  {
    id: "minimal",
    name: "Minimaliste",
    icon: BookOpen,
    iconColor: "text-gray-600",
    bgGradient: "from-gray-500 to-gray-600",
    image: "https://sucesspro.io/wp-content/uploads/2025/11/IMG_5223.jpg",
    desc: "Épuré, clair et professionnel.",
    tags: ["Simple", "Élégant", "Lecture"],
  },
  {
    id: "creative",
    name: "Créatif",
    icon: Palette,
    iconColor: "text-pink-500",
    bgGradient: "from-pink-500 to-pink-600",
    image: "https://sucesspro.io/wp-content/uploads/2025/11/IMG_5225.jpg",
    desc: "Dynamique et inspirant, parfait pour les créateurs.",
    tags: ["Artistique", "Coloré", "Original"],
  },
  {
    id: "educatif",
    name: "Éducatif",
    icon: GraduationCap,
    iconColor: "text-amber-500",
    bgGradient: "from-amber-500 to-amber-600",
    image: "https://sucesspro.io/wp-content/uploads/2025/11/l-ecole-fournit-une-vue-de-dessus-sur-le-tableau-scaled.jpg",
    desc: "Structuré et pédagogique, idéal pour les formations.",
    tags: ["Formation", "Académique", "Structuré"],
  },
  {
    id: "luxe",
    name: "Luxe",
    icon: Gem,
    iconColor: "text-yellow-500",
    bgGradient: "from-yellow-500 to-yellow-600",
    image: "https://sucesspro.io/wp-content/uploads/2025/11/IMG_5224.jpg",
    desc: "Élégant, sobre et haut de gamme.",
    tags: ["Premium", "Élégant", "Raffiné"],
    premium: true
  },
  {
    id: "energie",
    name: "Énergique",
    icon: Zap,
    iconColor: "text-orange-500",
    bgGradient: "from-orange-500 to-orange-600",
    image: "https://sucesspro.io/wp-content/uploads/2025/11/481839509643-scaled.jpg",
    desc: "Vibrant et motivant, parfait pour l'action.",
    tags: ["Sport", "Motivation", "Dynamique"],
  },
];

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [hoveredTemplate, setHoveredTemplate] = useState(null);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="text-center space-y-4 pb-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 rounded-full border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Personnalisation IA
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-700 dark:from-white dark:via-neutral-200 dark:to-neutral-300 bg-clip-text text-transparent">
            Choisis ton style d'eBook
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Sélectionne un template adapté à ton contenu. Il sera automatiquement personnalisé par l’IA selon ta thématique.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {templates.map((template) => {
            const Icon = template.icon;
            const isHovered = hoveredTemplate === template.id;
            const isSelected = selectedTemplate === template.id;
            return (
              <div
                key={template.id}
                onMouseEnter={() => setHoveredTemplate(template.id)}
                onMouseLeave={() => setHoveredTemplate(null)}
                className={`group relative bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
                  isSelected
                    ? "border-blue-500 ring-2 ring-blue-500/20 scale-[1.02]"
                    : "border-neutral-200 hover:border-neutral-300 hover:shadow-xl"
                }`}
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={template.image}
                    alt={template.name}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      isHovered ? "scale-110" : ""
                    }`}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent`} />
                  <div className={`absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br ${template.bgGradient} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <h3 className="text-xl font-bold">{template.name}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{template.desc}</p>

                  <div className="flex flex-wrap gap-2">
                    {template.tags.map((t, i) => (
                      <span key={i} className="px-2.5 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => router.push(`/dashboard/templates/${template.id}`)}
                      className="flex-1 py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 rounded-xl font-medium flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" /> Aperçu
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTemplate(template.id);
                        setTimeout(() => router.push(`/dashboard/projets/nouveau?template=${template.id}`), 300);
                      }}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 flex items-center justify-center gap-2"
                    >
                      <span>Choisir</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}