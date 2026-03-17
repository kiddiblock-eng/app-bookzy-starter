import "./globals.css";
import { Inter, Roboto_Mono } from "next/font/google";
import Script from 'next/script';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
  viewportFit: "cover",
};

export const metadata = {
  title: "Bookzy — Génère ton ebook en 60 secondes",
  description: "La plateforme  de génération d'ebooks par IA pour les créateurs africains. 16 templates, Smart Shop, Niche Hunter, Youbook. +10 000 créateurs.",
  metadataBase: new URL("https://bookzy.io"),
  openGraph: {
    title: "Bookzy — Génère ton ebook en 60 secondes",
    description: "La plateforme ebook des créateurs africains. +10 000 créateurs font confiance à Bookzy.",
    url: "https://bookzy.io",
    siteName: "Bookzy",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Bookzy — Génère ton ebook en 60 secondes" }],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bookzy — Génère ton ebook en 60 secondes",
    description: "La plateforme ebook des créateurs africains.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({ children }) {
  const PIXEL_ID = "9384354691604798";

  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* ✅ Facebook Pixel */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
      </head>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased bg-white dark:bg-black text-gray-900 dark:text-gray-100`}
        style={{
          maxWidth: "100vw",
          overflowX: "hidden",
          touchAction: "manipulation"
        }}
      >
        {children}
      </body>
    </html>
  );
}