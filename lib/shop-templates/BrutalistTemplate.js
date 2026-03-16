// lib/shop-templates/BrutalistTemplate.jsx

export default function BrutalistTemplate({ shop, products, onProductClick }) {
  return (
    <div className="min-h-screen bg-yellow-300">
      {/* HEADER */}
      <div className="pt-12 pb-8 px-6 text-center">
        {/* Photo de profil */}
        <div className="mb-4">
          {shop.logo ? (
            <img
              src={shop.logo}
              alt={shop.name}
              className="w-24 h-24 mx-auto object-cover border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            />
          ) : (
            <div className="w-24 h-24 mx-auto bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
              <span className="text-3xl font-black text-black">
                {shop.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Nom */}
        <h1 className="text-3xl font-black text-black mb-1 uppercase tracking-tight">
          {shop.name}
        </h1>

        {/* Username */}
        <p className="text-black/60 text-sm mb-3 font-mono">
          @{shop.slug}
        </p>

        {/* Bio */}
        {shop.bio && (
          <p className="text-black/80 text-sm max-w-xs mx-auto leading-relaxed font-medium">
            {shop.bio}
          </p>
        )}

        {/* Réseaux sociaux */}
        {shop.socials && Object.values(shop.socials).some(v => v) && (
          <div className="flex items-center justify-center gap-3 mt-4">
            {shop.socials.instagram && (
              <a href={`https://instagram.com/${shop.socials.instagram}`} target="_blank" rel="noopener noreferrer" 
                className="w-10 h-10 bg-white border-4 border-black flex items-center justify-center text-black hover:bg-black hover:text-yellow-300 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            )}
            {shop.socials.tiktok && (
              <a href={`https://tiktok.com/@${shop.socials.tiktok}`} target="_blank" rel="noopener noreferrer" 
                className="w-10 h-10 bg-white border-4 border-black flex items-center justify-center text-black hover:bg-black hover:text-yellow-300 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
              </a>
            )}
            {shop.socials.youtube && (
              <a href={`https://youtube.com/${shop.socials.youtube}`} target="_blank" rel="noopener noreferrer" 
                className="w-10 h-10 bg-white border-4 border-black flex items-center justify-center text-black hover:bg-black hover:text-yellow-300 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            )}
            {shop.socials.website && (
              <a href={shop.socials.website} target="_blank" rel="noopener noreferrer" 
                className="w-10 h-10 bg-white border-4 border-black flex items-center justify-center text-black hover:bg-black hover:text-yellow-300 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
              </a>
            )}
          </div>
        )}
      </div>

      {/* PRODUITS */}
      <div className="px-4 pb-8 max-w-md mx-auto">
        <div className="space-y-5">
          {products?.map((product) => (
            <div
              key={product._id}
              onClick={() => onProductClick?.(product)}
              className="group bg-white border-4 border-black p-4 flex gap-4 cursor-pointer 
                shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] 
                hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] 
                hover:-translate-x-1 hover:-translate-y-1
                transition-all duration-200"
            >
              {/* Cover */}
              {product.cover ? (
                <img
                  src={product.cover}
                  alt={product.title}
                  className="w-16 h-16 object-cover flex-shrink-0 border-2 border-black"
                />
              ) : (
                <div className="w-16 h-16 bg-yellow-300 border-2 border-black flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              )}

              {/* Infos */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-black text-sm mb-1 truncate uppercase">
                  {product.title}
                </h3>
                {product.description && (
                  <p className="text-black/60 text-xs line-clamp-2 mb-2">
                    {product.description}
                  </p>
                )}
                <p className="text-black font-black text-base">
                  {product.price?.toLocaleString()} FCFA
                </p>
              </div>

              {/* Flèche */}
              <div className="flex items-center">
                <svg className="w-6 h-6 text-black group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}

          {(!products || products.length === 0) && (
            <div className="text-center py-12 bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <svg className="w-12 h-12 mx-auto mb-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-sm font-bold uppercase">Aucun produit disponible</p>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="py-6 text-center border-t-4 border-black bg-black">
        <a 
          href="https://bookzy.io" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-yellow-300 hover:text-white transition-colors font-bold uppercase tracking-wider"
        >
          ▲ Propulsé par <span className="underline">Bookzy</span> ▲
        </a>
      </div>
    </div>
  );
}