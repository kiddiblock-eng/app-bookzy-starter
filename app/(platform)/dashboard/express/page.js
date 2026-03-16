"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, FileUp, Check, X, Info } from "lucide-react";

// ============================================================================
// 💡 MODAL DÉTAILS
// ============================================================================
const DetailsModal = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  const content = {
    editor: {
      title: "✍️ Écrire mon contenu",
      color: "blue",
      features: [
        "Éditeur riche (gras, titres, listes, alignement)",
        "IA intégrée (améliorer, corriger, reformuler)",
        "10 améliorations IA incluses",
        "Copier-coller depuis Word possible",
        "Aperçu en temps réel du rendu",
        "Choix parmi 12 templates professionnels"
      ]
    },
    import: {
      title: "📄 Importer depuis Word",
      color: "purple",
      features: [
        "Import .docx automatique",
        "Détection des chapitres intelligente",
        "Mise en page automatique",
        "Génération ultra-rapide",
        "Supporte les documents structurés",
        "Choix du template après import"
      ]
    }
  };

  const data = content[type];
  const colorClasses = {
    blue: "from-blue-600 to-indigo-600",
    purple: "from-purple-600 to-pink-600"
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        
        <div className={`bg-gradient-to-r ${colorClasses[data.color]} text-white p-6 rounded-t-2xl`}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">{data.title}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <h3 className="font-bold text-slate-900 mb-4">Fonctionnalités incluses :</h3>
          <div className="space-y-3">
            {data.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-b-2xl border-t">
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};

// ============================================================================
// 📄 COMPOSANT PRINCIPAL
// ============================================================================
export default function ExpressHome() {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  return (
    <>
      <DetailsModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        type={modalType}
      />

      <div className="min-h-screen bg-slate-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg">
                <FileUp className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-black text-slate-900">
                Ebook  <span className="text-blue-600">Designer</span>
              </h1>
            </div>
            <p className="text-slate-600">
              Transformez vos textes bruts et  fichiers word en ebooks ou PDF de prestige en moins de 20 secondes
            </p>
          </div>

          {/* Options Compactes */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            
            {/* OPTION 1 : ÉDITEUR */}
            <div className="bg-white rounded-xl p-6 border-2 border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Pencil className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-slate-900 mb-1">
                    Écrire mon contenu
                  </h2>
                  <p className="text-xs text-slate-600">
                    Éditeur avec IA intégrée
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                  <span>10 améliorations IA incluses</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                  <span>Éditeur riche complet</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href="/dashboard/express/editor"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors text-center"
                >
                  Commencer →
                </Link>
                <button
                  onClick={() => openModal('editor')}
                  className="px-3 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  title="Voir les détails"
                >
                  <Info className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>

            {/* OPTION 2 : IMPORT WORD */}
            <div className="bg-white rounded-xl p-6 border-2 border-slate-200 hover:border-purple-500 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <FileUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-slate-900 mb-1">
                    Importer depuis Word
                  </h2>
                  <p className="text-xs text-slate-600">
                    Upload .docx automatique
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                  <span>Détection chapitres IA</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                  <span>Mise en page automatique</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href="/dashboard/express/import"
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors text-center"
                >
                  Importer →
                </Link>
                <button
                  onClick={() => openModal('import')}
                  className="px-3 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  title="Voir les détails"
                >
                  <Info className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>

          </div>

          {/* Info Prix */}
          

        </div>
      </div>
    </>
  );
}