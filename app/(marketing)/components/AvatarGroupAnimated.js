"use client";

// Groupe d'avatars animé (façon Animate UI, sans dépendance) :
// avatars qui se chevauchent, celui survolé remonte au premier plan + tooltip avec le nom.
const DEFAULT = [
  { src: "/t1.jpg", fallback: "MD", name: "Mamadou Diop · Sénégal" },
  { src: "/T2.jpg", fallback: "KY", name: "Kouadio Yao · Côte d'Ivoire" },
  { src: "/T3.jpg", fallback: "FA", name: "Fadel Adjovi · Bénin" },
  { src: "/T4.jpg", fallback: "IT", name: "Ibrahim Traoré · Mali" },
  { src: "/T5.jpg", fallback: "SN", name: "Serge Nkeng · Cameroun" },
];

// z-index de base par classes (pas d'inline, sinon ça écrase le hover). Chevauchement gauche→droite.
const Z_BASE = ["z-[50]", "z-[40]", "z-[30]", "z-[20]", "z-[10]"];

export default function AvatarGroupAnimated({ items = DEFAULT, size = "w-10 h-10" }) {
  return (
    <div className="flex items-center">
      {items.map((a, i) => (
        <div
          key={i}
          className={`group relative -ml-3 first:ml-0 ${Z_BASE[i] ?? "z-[10]"} hover:z-[60]`}
        >
          {/* Tooltip */}
          <span className="pointer-events-none absolute -top-9 left-1/2 z-[70] -translate-x-1/2 whitespace-nowrap rounded-lg bg-neutral-900 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-200 scale-90 group-hover:scale-100 group-hover:opacity-100">
            {a.name}
            <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-neutral-900" />
          </span>

          {/* Avatar (l'initiale reste derrière si l'image ne charge pas) */}
          <div className={`${size} relative overflow-hidden rounded-full border-[3px] border-white bg-neutral-100 shadow-sm ring-1 ring-black/5 transition-transform duration-200 group-hover:-translate-y-1.5`}>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-neutral-500">{a.fallback}</span>
            <img src={a.src} alt={a.name} className="relative h-full w-full object-cover" />
          </div>
        </div>
      ))}
    </div>
  );
}
