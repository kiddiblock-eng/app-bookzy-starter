import "./globals.css";
import { Inter, Roboto_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export const metadata = {
  title: "Bookzy — Créez vos ebooks et produits digitaux",
  description: "Bookzy vous aide à créer, vendre et automatiser vos ebooks et produits digitaux facilement.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased bg-white dark:bg-black text-gray-900 dark:text-gray-100`}
      >
        {children}
      </body>
    </html>
  );
}