// lib/shop-templates/ElegantTemplate.jsx

export default function ElegantTemplate({ shop, products, onProductClick }) {
  return (
    <div className="min-h-screen bg-stone-100">
      {/* COVER HERO */}
      <div className="relative h-52 bg-gradient-to-b from-stone-800 to-stone-900 overflow-hidden">
        {/* Motif élégant */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        {/* Ligne dorée */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
        {shop.cover && (
          <img src={shop.cover} alt="" className="w-full h-full object-cover opacity-50" />
        )}
      </div>

      {/* PROFILE */}
      <div className="relative px-6 -mt-20">
        <div className="text-center">
          {shop.logo ? (
            <img
              src={shop.logo}
              alt={shop.name}
              className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-amber-400 shadow-2xl"
            />
          ) : (
            <div className="w-32 h-32 rounded-full mx-auto bg-gradient-to-br from-stone-800 to-stone-900 border-4 border-amber-400 shadow-2xl flex items-center justify-center">
              <span className="text-4xl font-serif text-amber-400">
                {shop.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
          )}

          <h1 className="text-3xl font-serif text-stone-800 mt-5 tracking-wide">
            {shop.name}
          </h1>
          <p className="text-amber-600 text-sm font-light tracking-widest uppercase mt-1">
            @{shop.slug}
          </p>

          {shop.bio && (
            <p className="text-stone-600 text-sm max-w-sm mx-auto leading-relaxed mt-4 font-light italic">
              "{shop.bio}"
            </p>
          )}

          {/* Réseaux sociaux */}
          {shop.socials && Object.values(shop.socials).some(v => v) && (
            <div className="flex items-center justify-center gap-4 mt-5">
              {shop.socials.instagram && (
                <a href={`https://instagram.com/${shop.socials.instagram}`} target="_blank" rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full border border-amber-400 flex items-center justify-center text-amber-600 hover:bg-amber-400 hover:text-white transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              )}
              {shop.socials.tiktok && (
                <a href={`https://tiktok.com/@${shop.socials.tiktok}`} target="_blank" rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full border border-amber-400 flex items-center justify-center text-amber-600 hover:bg-amber-400 hover:text-white transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                </a>
              )}
              {shop.socials.youtube && (
                <a href={`https://youtube.com/${shop.socials.youtube}`} target="_blank" rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full border border-amber-400 flex items-center justify-center text-amber-600 hover:bg-amber-400 hover:text-white transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              )}
              {shop.socials.website && (
                <a href={shop.socials.website} target="_blank" rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full border border-amber-400 flex items-center justify-center text-amber-600 hover:bg-amber-400 hover:text-white transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Séparateur élégant */}
      <div className="flex items-center justify-center gap-4 my-8 px-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-300" />
        <div className="text-amber-400">✦</div>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-300" />
      </div>

      {/* PRODUITS */}
      <div className="px-4 pb-8 max-w-md mx-auto">
        <div className="space-y-4">
          {products?.map((product) => (
            <div
              key={product._id}
              onClick={() => onProductClick?.(product)}
              className="group bg-white rounded-sm p-5 flex gap-4 cursor-pointer shadow-sm hover:shadow-xl border-l-4 border-amber-400 transition-all"
            >
              {product.cover ? (
                <img src={product.cover} alt={product.title} className="w-16 h-20 rounded-sm object-cover flex-shrink-0 shadow-md" />
              ) : (
                <div className="w-16 h-20 rounded-sm bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center flex-shrink-0 shadow-md">
                  <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-stone-800 text-base mb-1 truncate">{product.title}</h3>
                {product.description && <p className="text-stone-500 text-xs line-clamp-2 mb-2 font-light">{product.description}</p>}
                <p className="text-amber-600 font-semibold text-sm">{product.price?.toLocaleString()} FCFA</p>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
            </div>
          ))}

          {(!products || products.length === 0) && (
            <div className="text-center py-12 bg-white border-l-4 border-amber-400">
              <div className="text-3xl text-amber-400 mb-3">✦</div>
              <p className="text-sm text-stone-500 font-light italic">Aucun produit disponible</p>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="py-6 text-center border-t border-stone-200">
        <a href="https://bookzy.io" target="_blank" rel="noopener noreferrer" className="text-xs text-stone-400 hover:text-amber-600 transition-colors tracking-widest uppercase">
          Propulsé par Bookzy
        </a>
      </div>
    </div>
  );
}