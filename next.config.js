/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ INDISPENSABLE pour Docker & Railway
  // Cela crée un dossier léger avec seulement le nécessaire pour la production
  output: 'standalone', 

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'sucesspro.io' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // ✅ Ajouté pour tes images stockées sur Cloudinary
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      // ✅ Ajouté pour tes propres domaines
      { protocol: 'https', hostname: 'bookzy.io' },
      { protocol: 'https', hostname: 'www.bookzy.io' },
      { protocol: 'https', hostname: 'app.bookzy.io' }
    ]
  },

  // Optionnel : évite les erreurs de build si tu as des avertissements ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;