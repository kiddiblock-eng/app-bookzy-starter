import "./globals.css"; // On garde l'import au cas où il existe
import { Inter, Roboto_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

// ✅ 1. VIEWPORT : Bloque le zoom avec les doigts
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
};

export const metadata = {
  title: "Bookzy — Créez vos ebooks et produits digitaux",
  description: "Bookzy vous aide à créer, et automatiser vos ebooks et produits digitaux facilement.",
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased bg-white dark:bg-black text-gray-900 dark:text-gray-100`}
        // ✅ 2. CSS FORCÉ ICI : Remplaçant du globals.css introuvable
        // Ça empêche le site de bouger de gauche à droite
        style={{
          maxWidth: "100vw",
          overflowX: "hidden",
          touchAction: "manipulation" // Rend le tactile plus réactif
        }}
      >
        {children}
      </body>
    </html>
  );
}