// lib/shop-templates/PlayfulTemplate.jsx

export default function PlayfulTemplate({ shop, products, onProductClick }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-100 via-pink-50 to-cyan-100">
      {/* COVER HERO */}
      <div className="relative h-44 overflow-hidden">
        {/* Fond coloré avec formes */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-pink-500 to-orange-400">
          {/* Formes géométriques */}
          <div className="absolute top-4 left-8 w-16 h-16 bg-yellow-300 rounded-full opacity-60 animate-pulse" />
          <div className="absolute top-12 right-12 w-12 h-12 bg-cyan-300 rotate-45 opacity-60" />
          <div className="absolute bottom-6 left-1/4 w-10 h-10 bg-green-300 rounded-full opacity-60" />
          <div className="absolute bottom-8 right-1/4 w-14 h-14 bg-pink-300 rounded-2xl rotate-12 opacity-60" />
          <div className="absolute top-6 left-1/2 w-8 h-8 bg-orange-300 rounded-full opacity-60" />
        </div>
        {shop.cover && (
          <img src={shop.cover} alt="" className="w-full h-full object-cover" />
        )}
        {/* Wave bottom */}
        <svg className="absolute bottom-0 left-0 right-0" viewBox="0 0 1440 60" fill="none">
          <path d="M0 60V30C240 50 480 10 720 30C960 50 1200 10 1440 30V60H0Z" className="fill-violet-100" />
        </svg>
      </div>

      {/* PROFILE */}
      <div className="relative px-6 -mt-14 z-10">
        <div className="text-center">
          {shop.logo ? (
            <div className="relative inline-block">
              <div className="absolute -inset-2 bg-gradient-to-r from-violet-500 via-pink-500 to-orange-400 rounded-full blur-sm opacity-70" />
              <img
                src={shop.logo}
                alt={shop.name}
                className="relative w-28 h-28 rounded-full mx-auto object-cover border-4 border-white shadow-xl"
              />
            </div>
          ) : (
            <div className="relative inline-block">
              <div className="absolute -inset-2 bg-gradient-to-r from-violet-500 via-pink-500 to-orange-400 rounded-full blur-sm opacity-70" />
              <div className="relative w-28 h-28 rounded-full mx-auto bg-gradient-to-br from-violet-500 to-pink-500 border-4 border-white shadow-xl flex items-center justify-center">
                <span className="text-4xl font-bold text-white">
                  {shop.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            </div>
          )}

          <h1 className="text-2xl font-bold text-gray-800 mt-4">
            {shop.name} <span className="inline-block">✨</span>
          </h1>
          <p className="text-pink-500 text-sm font-medium">
            @{shop.slug}
          </p>

          {shop.bio && (
            <p className="text-gray-600 text-sm max-w-xs mx-auto leading-relaxed mt-3 bg-white/50 backdrop-blur rounded-2xl px-4 py-2">
              {shop.bio}
            </p>
          )}

          {/* Réseaux sociaux */}
          {shop.socials && Object.values(shop.socials).some(v => v) && (
            <div className="flex items-center justify-center gap-3 mt-4">
              {shop.socials.instagram && (
                <a href={`https://instagram.com/${shop.socials.instagram}`} target="_blank" rel="noopener noreferrer" 
                  className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white shadow-lg hover:scale-110 hover:rotate-3 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              )}
              {shop.socials.tiktok && (
                <a href={`https://tiktok.com/@${shop.socials.tiktok}`} target="_blank" rel="noopener noreferrer" 
                  className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white shadow-lg hover:scale-110 hover:-rotate-3 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                </a>
              )}
              {shop.socials.youtube && (
                <a href={`https://youtube.com/${shop.socials.youtube}`} target="_blank" rel="noopener noreferrer" 
                  className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white shadow-lg hover:scale-110 hover:rotate-3 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              )}
              {shop.socials.website && (
                <a href={shop.socials.website} target="_blank" rel="noopener noreferrer" 
                  className="w-11 h-11 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white shadow-lg hover:scale-110 hover:-rotate-3 transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* PRODUITS */}
      <div className="px-4 py-8 max-w-md mx-auto">
        <div className="space-y-4">
          {products?.map((product, i) => {
            const colors = [
              "from-violet-500 to-purple-600",
              "from-pink-500 to-rose-600",
              "from-orange-500 to-red-500",
              "from-cyan-500 to-blue-600",
              "from-green-500 to-emerald-600"
            ];
            const color = colors[i % colors.length];
            
            return (
              <div
                key={product._id}
                onClick={() => onProductClick?.(product)}
                className="group bg-white rounded-3xl p-4 flex gap-4 cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                {product.cover ? (
                  <img src={product.cover} alt={product.title} className="w-16 h-20 rounded-2xl object-cover flex-shrink-0" />
                ) : (
                  <div className={`w-16 h-20 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-2xl">📚</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-sm mb-1 truncate">{product.title}</h3>
                  {product.description && <p className="text-gray-500 text-xs line-clamp-2 mb-2">{product.description}</p>}
                  <div className={`inline-block bg-gradient-to-r ${color} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                    {product.price?.toLocaleString()} FCFA
                  </div>
                </div>
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>
              </div>
            );
          })}

          {(!products || products.length === 0) && (
            <div className="text-center py-12 bg-white rounded-3xl shadow-md">
              <div className="text-5xl mb-3">🎨</div>
              <p className="text-sm text-gray-500">Aucun produit disponible</p>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="py-6 text-center">
        <a href="https://bookzy.io" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-pink-500 transition-colors font-medium">
          ✨ Propulsé par Bookzy ✨
        </a>
      </div>
    </div>
  );
}