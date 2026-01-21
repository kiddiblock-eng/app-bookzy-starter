import { Toaster } from "react-hot-toast"; // ✅ 1. IMPORT

export const metadata = {
  title: "Espace Affiliation | Bookzy",
  description: "Gagnez de l'argent en recommandant Bookzy.",
};

export default function AffiliationLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      {/* ✅ 2. AJOUT DU TOASTER ICI */}
      <Toaster position="bottom-right" toastOptions={{ duration: 4000 }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}