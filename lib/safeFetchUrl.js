// Garde anti-SSRF : n'autorise que les URLs https vers Cloudinary
// (où sont stockés les fichiers/PDF de l'app). Bloque tout le reste
// (IP internes, métadonnées cloud, localhost, hôtes arbitraires).
export function isAllowedCloudinaryUrl(raw) {
  try {
    const u = new URL(String(raw));
    if (u.protocol !== "https:") return false;
    const h = u.hostname.toLowerCase();
    return h === "res.cloudinary.com" || h === "cloudinary.com" || h.endsWith(".cloudinary.com");
  } catch {
    return false;
  }
}
