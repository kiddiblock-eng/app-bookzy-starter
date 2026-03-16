// lib/shop-templates/MidnightTemplate.jsx

export default function MidnightTemplate({ shop, products, onProductClick }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900">
      {/* COVER HERO avec étoiles */}
      <div className="relative h-52 overflow-hidden">
        {/* Fond étoilé */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 to-slate-900">
          {/* Étoiles */}
          <div className="absolute inset-0">
            <div className="absolute top-4 left-[10%] w-1 h-1 bg-white rounded-full animate-pulse" />
            <div className="absolute top-8 left-[25%] w-1.5 h-1.5 bg-white rounded-full" />
            <div className="absolute top-6 left-[40%] w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute top-12 left-[55%] w-0.5 h-0.5 bg-white rounded-full" />
            <div className="absolute top-4 left-[70%] w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-10 left-[85%] w-1 h-1 bg-white rounded-full" />
            <div className="absolute top-16 left-[15%] w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
            <div className="absolute top-20 left-[60%] w-1 h-1 bg-white rounded-full" />
            <div className="absolute top-14 left-[45%] w-1 h-1 bg-blue-300 rounded-full animate-pulse" style={{ animationDelay: '0.7s' }} />
            <div className="absolute top-24 left-[30%] w-1.5 h-1.5 bg-white rounded-full" />
            <div className="absolute top-28 left-[75%] w-0.5 h-0.5 bg-white rounded-full animate-pulse" />
            <div className="absolute top-32 left-[20%] w-1 h-1 bg-purple-300 rounded-full" />
          </div>
          {/* Lune */}
          <div className="absolute top-6 right-8 w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 shadow-[0_0_40px_rgba(255,255,255,0.3)]" />
        </div>
        {shop.cover && (
          <img src={shop.cover} alt="" className="w-full h-full object-cover opacity-40" />
        )}
      </div>

      {/* PROFILE */}
      <div className="relative px-6 -mt-16">
        <div className="text-center">
          {shop.logo ? (
            <div className="relative inline-block">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full blur opacity-60" />
              <img
                src={shop.logo}
                alt={shop.name}
                className="relative w-28 h-28 rounded-full mx-auto object-cover border-2 border-indigo-400 shadow-2xl"
              />
            </div>
          ) : (
            <div className="relative inline-block">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full blur opacity-60" />
              <div className="relative w-28 h-28 rounded-full mx-auto bg-gradient-to-br from-indigo-800 to-slate-900 border-2 border-indigo-400 shadow-2xl flex items-center justify-center">
                <span className="text-4xl font-bold text-white">
                  {shop.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            </div>
          )}

          <h1 className="text-2xl font-bold text-white mt-4">
            {shop.name}
          </h1>
          <p className="text-indigo-400 text-sm">
            @{shop.slug}
          </p>

          {shop.bio && (
            <p className="text-indigo-200 text-sm max-w-xs mx-auto leading-relaxed mt-3 opacity-80">
              {shop.bio}
            </p>
          )}

          {/* Réseaux sociaux */}
          {shop.socials && Object.values(shop.socials).some(v => v) && (
            <div className="flex items-center justify-center gap-3 mt-4">
              {shop.socials.instagram && (
                <a href={`https://instagram.com/${shop.socials.instagram}`} target="_blank" rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full bg-indigo-900/50 border border-indigo-500/30 flex items-center justify-center text-indigo-300 hover:bg-indigo-500 hover:text-white hover:border-transparent transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              )}
              {shop.socials.tiktok && (
                <a href={`https://tiktok.com/@${shop.socials.tiktok}`} target="_blank" rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full bg-indigo-900/50 border border-indigo-500/30 flex items-center justify-center text-indigo-300 hover:bg-indigo-500 hover:text-white hover:border-transparent transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                </a>
              )}
              {shop.socials.youtube && (
                <a href={`https://youtube.com/${shop.socials.youtube}`} target="_blank" rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full bg-indigo-900/50 border border-indigo-500/30 flex items-center justify-center text-indigo-300 hover:bg-indigo-500 hover:text-white hover:border-transparent transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              )}
              {shop.socials.website && (
                <a href={shop.socials.website} target="_blank" rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full bg-indigo-900/50 border border-indigo-500/30 flex items-center justify-center text-indigo-300 hover:bg-indigo-500 hover:text-white hover:border-transparent transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Séparateur étoilé */}
      <div className="flex items-center justify-center gap-4 my-8 px-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-indigo-500/50" />
        <div className="text-indigo-400">✦</div>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-indigo-500/50" />
      </div>

      {/* PRODUITS */}
      <div className="px-4 pb-8 max-w-md mx-auto">
        <div className="space-y-4">
          {products?.map((product) => (
            <div
              key={product._id}
              onClick={() => onProductClick?.(product)}
              className="group bg-indigo-950/50 backdrop-blur rounded-2xl p-4 flex gap-4 cursor-pointer border border-indigo-500/20 hover:border-indigo-400/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] transition-all"
            >
              {product.cover ? (
                <img src={product.cover} alt={product.title} className="w-16 h-20 rounded-xl object-cover flex-shrink-0 border border-indigo-500/30" />
              ) : (
                <div className="w-16 h-20 rounded-xl bg-gradient-to-br from-indigo-900 to-slate-900 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🌙</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm mb-1 truncate">{product.title}</h3>
                {product.description && <p className="text-indigo-300 text-xs line-clamp-2 mb-2 opacity-70">{product.description}</p>}
                <p className="text-indigo-400 font-bold text-sm">{product.price?.toLocaleString()} FCFA</p>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-900/50 border border-indigo-500/30 flex items-center justify-center group-hover:bg-indigo-500 group-hover:border-transparent text-indigo-400 group-hover:text-white transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
              </div>
            </div>
          ))}

          {(!products || products.length === 0) && (
            <div className="text-center py-12 bg-indigo-950/50 backdrop-blur rounded-2xl border border-indigo-500/20">
              <div className="text-5xl mb-3">🌙</div>
              <p className="text-sm text-indigo-300">Aucun produit disponible</p>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="py-6 text-center border-t border-indigo-500/20">
        <a href="https://bookzy.io" target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
          ✦ Propulsé par Bookzy ✦
        </a>
      </div>
    </div>
  );
}