// lib/cookies.js
// ──────────────────────────────────────────────────────────────────────────
// Domaine du cookie d'auth, calculé depuis l'hôte de la requête.
//
//   - bookzy.io / *.bookzy.io  → ".bookzy.io"  (cookie partagé www ↔ app)
//   - tout autre hôte (app-bookzy-starter.onrender.com, localhost, …)
//                              → undefined      (cookie host-only)
//
// Évite de coder en dur ".bookzy.io" : un cookie domain=.bookzy.io posé
// depuis onrender.com est rejeté par le navigateur (→ boucle de login).
// ──────────────────────────────────────────────────────────────────────────
export function getCookieDomain(req) {
  const host = (req?.headers?.get("host") || "").split(":")[0].toLowerCase();
  if (host === "bookzy.io" || host.endsWith(".bookzy.io")) {
    return ".bookzy.io";
  }
  return undefined;
}
