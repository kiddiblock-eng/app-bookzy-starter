"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Rocket,
  BookOpen,
  Palette,
  GraduationCap,
  Gem,
  Zap,
  ArrowLeft,
  Quote,
  Loader2
} from "lucide-react";

const templates = {
  modern: {
    name: "Moderne",
    icon: <Rocket className="w-8 h-8 text-blue-500" />,
    color: "from-blue-600 to-blue-800",
    bg: "bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-neutral-900",
    titleColor: "text-blue-700 dark:text-blue-400",
    quoteColor: "text-blue-600 dark:text-blue-300",
  },
  minimal: {
    name: "Minimaliste",
    icon: <BookOpen className="w-8 h-8 text-gray-500" />,
    color: "from-gray-200 to-gray-50",
    bg: "bg-gradient-to-br from-gray-100 to-white dark:from-neutral-900 dark:to-black",
    titleColor: "text-gray-700 dark:text-gray-300",
    quoteColor: "text-gray-500 dark:text-gray-400",
  },
  creative: {
    name: "Créatif",
    icon: <Palette className="w-8 h-8 text-pink-500" />,
    color: "from-fuchsia-600 to-pink-500",
    bg: "bg-gradient-to-br from-pink-50 to-white dark:from-fuchsia-950 dark:to-neutral-900",
    titleColor: "text-fuchsia-600 dark:text-fuchsia-400",
    quoteColor: "text-fuchsia-500 dark:text-fuchsia-300",
  },
  educatif: {
    name: "Éducatif",
    icon: <GraduationCap className="w-8 h-8 text-amber-500" />,
    color: "from-yellow-400 to-amber-600",
    bg: "bg-gradient-to-br from-amber-50 to-white dark:from-amber-950 dark:to-neutral-900",
    titleColor: "text-amber-600 dark:text-amber-400",
    quoteColor: "text-amber-500 dark:text-amber-300",
  },
  luxe: {
    name: "Luxe",
    icon: <Gem className="w-8 h-8 text-yellow-500" />,
    color: "from-gray-900 to-yellow-600",
    bg: "bg-gradient-to-br from-neutral-900 to-black",
    titleColor: "text-yellow-400",
    quoteColor: "text-yellow-500",
  },
  energie: {
    name: "Énergique",
    icon: <Zap className="w-8 h-8 text-orange-500" />,
    color: "from-orange-500 to-red-600",
    bg: "bg-gradient-to-br from-orange-50 to-white dark:from-red-950 dark:to-neutral-900",
    titleColor: "text-orange-600 dark:text-orange-400",
    quoteColor: "text-orange-500 dark:text-orange-300",
  },
};

export default function TemplatePreview() {
  const router = useRouter();
  const { id } = useParams();
  const template = templates[id];
  const [templateData, setTemplateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🔍 Charger le template JSON depuis l’API
  useEffect(() => {
    async function fetchTemplate() {
      try {
        const res = await fetch(`/api/templates/${id}`);
        if (!res.ok) throw new Error("Template introuvable");
        const data = await res.json();
        setTemplateData(data);
      } catch (error) {
        console.error("❌ Erreur chargement template JSON :", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTemplate();
  }, [id]);

  // ⚙️ Fonction : enregistrer le template et rediriger vers le générateur IA
  const handleUseTemplate = async () => {
    if (!templateData) return;
    setSaving(true);

    try {
      // Sauvegarde dans le localStorage pour la page du générateur
      localStorage.setItem("selected_template", JSON.stringify(templateData));

      // Redirection
      router.push(`/dashboard/projets/nouveau?template=${id}`);
    } catch (error) {
      console.error("Erreur enregistrement du template :", error);
    } finally {
      setSaving(false);
    }
  };

  // 🌀 Chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  // 🚫 Template introuvable
  if (!template) {
    return (
      <div className="text-center py-20">
        <p className="text-neutral-500">Template introuvable.</p>
        <button
          onClick={() => router.push("/dashboard/templates")}
          className="mt-4 text-blue-600 hover:underline"
        >
          ← Retour aux templates
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard/templates")}
            className="text-neutral-500 hover:text-neutral-800 dark:hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-semibold">{template.name}</h1>
        </div>

        <button
          onClick={handleUseTemplate}
          disabled={saving || !templateData}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition text-white ${
            saving ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {saving ? "Chargement..." : "Utiliser ce template →"}
        </button>
      </div>

      {/* Aperçu visuel */}
      <div
        className={`relative rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden ${template.bg}`}
      >
        <div className={`h-40 bg-gradient-to-br ${template.color} flex items-center justify-center`}>
          <h2 className="text-3xl font-bold text-white">Les Secrets du Succès</h2>
        </div>

        <div className="p-8 space-y-6">
          <p className="uppercase tracking-widest text-xs text-neutral-500">
            Chapitre 1 — Introduction
          </p>

          <h3 className={`text-xl font-semibold ${template.titleColor}`}>
            Découvre la méthode qui a transformé des milliers d’entrepreneurs.
          </h3>

          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-sm md:text-base">
            Le succès n’est pas une question de chance, mais une science. Dans ce modèle, tu apprendras à structurer ton ebook avec une clarté visuelle et une hiérarchie typographique parfaite.
          </p>

          <div className={`border-l-4 pl-4 italic text-sm ${template.quoteColor}`}>
            <Quote className="inline w-4 h-4 mr-1 opacity-70" />
            “Le design n’est pas seulement ce à quoi cela ressemble. C’est comment cela fonctionne.”
          </div>

          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-sm md:text-base">
            Grâce à l’IA, ton contenu s’adapte automatiquement au style choisi : police, mise en page, contraste et même insertion de visuels cohérents.
          </p>
        </div>

        <div className="bg-neutral-100 dark:bg-neutral-900 p-4 text-xs text-neutral-500 text-center">
          Prévisualisation — Template <b>{template.name}</b> | Bookzy.io © 2025
        </div>
      </div>

      {/* Détails JSON */}
      {templateData && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 shadow-xl mt-10">
          <h2 className="text-xl font-bold mb-4">Détails du Template</h2>
          <p className="text-neutral-700 dark:text-neutral-300 mb-6">
            {templateData.description || "Aucune description disponible."}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-semibold text-neutral-800 dark:text-neutral-200">Catégorie :</p>
              <p className="text-neutral-600 dark:text-neutral-400">
                {templateData.metadata?.category || "—"}
              </p>
            </div>
            <div>
              <p className="font-semibold text-neutral-800 dark:text-neutral-200">Audience :</p>
              <p className="text-neutral-600 dark:text-neutral-400">
                {templateData.metadata?.targetAudience || "—"}
              </p>
            </div>
            <div>
              <p className="font-semibold text-neutral-800 dark:text-neutral-200">Durée estimée :</p>
              <p className="text-neutral-600 dark:text-neutral-400">
                {templateData.metadata?.estimatedReadingTime || "—"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
