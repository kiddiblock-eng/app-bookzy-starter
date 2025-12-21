/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ CRITIQUE : Empêche Vercel de bundler Chromium
  serverExternalPackages: ["@sparticuz/chromium"],
  
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'sucesspro.io' },
      { protocol: 'https', hostname: 'images.unsplash.com' }
    ]
  }
};

export default nextConfig;