// lib/shop-templates/LoveTemplate.jsx

export default function LoveTemplate({ shop, products, onProductClick }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-rose-100">
      {/* COVER HERO */}
      <div className="relative h-48 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 overflow-hidden">
        {/* Coeurs subtils */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-[10%] text-6xl">♥</div>
          <div className="absolute top-12 right-[15%] text-4xl">♥</div>
          <div className="absolute bottom-8 left-[30%] text-3xl">♥</div>
          <div className="absolute top-6 right-[40%] text-5xl">♥</div>
          <div className="absolute bottom-4 right-[25%] text-4xl">♥</div>
        </div>
        {shop.cover && (
          <img src={shop.cover} alt="" className="w-full h-full object-cover" />
        )}
      </div>

      {/* PROFILE - chevauche le cover */}
      <div className="relative px-6 -mt-16">
        <div className="text-center">
          {shop.logo ? (
            <img
              src={shop.logo}
              alt={shop.name}
              className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-white shadow-xl ring-4 ring-pink-200"
            />
          ) : (
            <div className="w-28 h-28 rounded-full mx-auto bg-gradient-to-br from-pink-400 to-rose-500 border-4 border-white shadow-xl flex items-center justify-center ring-4 ring-pink-200">
              <span className="text-4xl font-bold text-white">
                {shop.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
          )}

          <h1 className="text-2xl font-bold text-rose-900 mt-4">
            {shop.name}
          </h1>
          <p className="text-rose-400 text-sm">
            @{shop.slug}
          </p>

          {shop.bio && (
            <p className="text-rose-700 text-sm max-w-xs mx-auto leading-relaxed mt-3">
              {shop.bio}
            </p>
          )}

          {/* Réseaux sociaux */}
          {shop.socials && Object.values(shop.socials).some(v => v) && (
            <div className="flex items-center justify-center gap-3 mt-4">
              {shop.socials.instagram && (
                <a href={`https://instagram.com/${shop.socials.instagram}`} target="_blank" rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-rose-500 hover:bg-rose-50 hover:scale-110 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              )}
              {shop.socials.tiktok && (
                <a href={`https://tiktok.com/@${shop.socials.tiktok}`} target="_blank" rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-rose-500 hover:bg-rose-50 hover:scale-110 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                </a>
              )}
              {shop.socials.youtube && (
                <a href={`https://youtube.com/${shop.socials.youtube}`} target="_blank" rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-rose-500 hover:bg-rose-50 hover:scale-110 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              )}
              {shop.socials.website && (
                <a href={shop.socials.website} target="_blank" rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-rose-500 hover:bg-rose-50 hover:scale-110 transition-all">
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
          {products?.map((product) => (
            <div
              key={product._id}
              onClick={() => onProductClick?.(product)}
              className="group bg-white rounded-3xl p-4 flex gap-4 cursor-pointer shadow-sm hover:shadow-lg border border-rose-100 transition-all"
            >
              {product.cover ? (
                <img src={product.cover} alt={product.title} className="w-16 h-20 rounded-2xl object-cover flex-shrink-0" />
              ) : (
                <div className="w-16 h-20 rounded-2xl bg-gradient-to-br from-pink-100 to-rose-200 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-rose-900 text-sm mb-1 truncate">{product.title}</h3>
                {product.description && <p className="text-rose-400 text-xs line-clamp-2 mb-2">{product.description}</p>}
                <p className="text-rose-600 font-bold text-sm">{product.price?.toLocaleString()} FCFA</p>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
              </div>
            </div>
          ))}

          {(!products || products.length === 0) && (
            <div className="text-center py-12 bg-white rounded-3xl border border-rose-100">
              <div className="text-4xl mb-3">💕</div>
              <p className="text-sm text-rose-400">Aucun produit disponible</p>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="py-6 text-center">
        <a href="https://bookzy.io" target="_blank" rel="noopener noreferrer" className="text-xs text-rose-400 hover:text-rose-600 transition-colors">
          Fait avec 💕 sur Bookzy
        </a>
      </div>
    </div>
  );
}