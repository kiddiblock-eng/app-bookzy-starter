// Cache mémoire ultra-simple (par instance de serveur), TTL en ms.
// Sert à éviter de retaper la base à chaque navigation pour des données
// peu sensibles à la fraîcheur (stats admin). Pas de dépendance externe.
const store = new Map();

export async function withCache(key, ttlMs, producer) {
  const now = Date.now();
  const hit = store.get(key);
  if (hit && now - hit.at < ttlMs) return hit.v;
  const v = await producer();
  store.set(key, { at: now, v });
  return v;
}
