"use client";
import { LayoutDashboard, FileText, Banknote, History } from "lucide-react";

export default function AffiliateNav({ activeTab, setActiveTab }) {
  const tabs = [
    { 
      id: "overview", 
      label: "Aperçu", 
      desktopLabel: "Vue d'ensemble", 
      icon: LayoutDashboard 
    },
    { 
      id: "resources", 
      label: "Marketing", 
      desktopLabel: "Marketing", 
      icon: FileText 
    },
    { 
      id: "withdraw", 
      label: "Retraits", 
      desktopLabel: "Retraits", 
      icon: Banknote 
    },
    { 
      id: "history", 
      label: "Historique", 
      desktopLabel: "Historique", 
      icon: History 
    },
  ];

  return (
    <div className="bg-white border-b border-slate-100 mb-8 sticky top-0 z-20 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)]">
      <nav className="max-w-5xl mx-auto w-full">
        {/* GRID COLS-4 : Force 4 colonnes égales, sans scroll */}
        <div className="grid grid-cols-4 w-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative group flex flex-col md:flex-row items-center justify-center 
                  py-3 md:py-4 px-1 gap-1.5 md:gap-2.5 
                  transition-all duration-200 outline-none
                  ${isActive ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}
                `}
              >
                {/* LIGNE ACTIVE (Barre violette en bas) */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-600 to-violet-600 rounded-t-full mx-2 md:mx-4"></span>
                )}

                {/* ICÔNE */}
                <Icon 
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`
                    w-5 h-5 md:w-4 md:h-4 transition-colors
                    ${isActive ? "text-violet-600" : "text-slate-400 group-hover:text-slate-500"}
                  `} 
                />
                
                {/* TEXTE RESPONSIVE */}
                <span className={`
                  text-[10px] md:text-sm font-medium leading-none tracking-wide
                  ${isActive ? "text-slate-900 font-bold" : "font-normal"}
                `}>
                  <span className="md:hidden">{tab.label}</span>         {/* Mobile */}
                  <span className="hidden md:inline">{tab.desktopLabel}</span> {/* PC */}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}