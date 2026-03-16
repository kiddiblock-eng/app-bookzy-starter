"use client";

import { useState, useRef } from "react";
import useSWR from "swr";
import { 
  Package, Plus, Search, Pencil, Trash2, Eye, EyeOff,
  Loader2, Upload, X, FileText, Image, Check, AlertCircle,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

// Fetcher optimisé
const fetcher = (url) => fetch(url, { 
  credentials: "include",
  cache: "no-store", 
  headers: { "Content-Type": "application/json" }
}).then(r => r.ok ? r.json() : null);

// ✅ Modal info (remplace alert)
const InfoModal = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="p-6 text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-orange-500" />
          </div>
          <p className="text-gray-800 font-medium mb-1">{message}</p>
          {message.toLowerCase().includes("boutique") && (
            <Link
              href="/dashboard/smart-shop/boutique"
              className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800"
            >
              Créer ma boutique →
            </Link>
          )}
        </div>
        <div className="border-t border-gray-100">
          <button onClick={onClose} className="w-full py-4 text-gray-700 font-semibold hover:bg-gray-50">OK</button>
        </div>
      </div>
    </div>
  );
};

export default function ProduitsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showAllProjets, setShowAllProjets] = useState(false);
  
  // ✅ Info modal (remplace alert)
  const [infoMessage, setInfoMessage] = useState("");
  const showInfo = (msg) => setInfoMessage(msg);

  // Form state
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "0",
    file: null,
    fileName: "",
    cover: "",
  });
  
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [activatingId, setActivatingId] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  // ✅ SWR pour la rapidité
  const { data, isLoading: loading, mutate } = useSWR("/api/smart-shop/produits", fetcher, {
    revalidateOnFocus: true,
    dedupingInterval: 0,
  });

  const products = data?.products || [];

  // Activer un projet Bookzy dans la boutique
  const activateProjet = async (product) => {
    if (!product.projetId) return;
    
    const projetIdToRemove = product._id;
    setActivatingId(projetIdToRemove);
    
    try {
      const res = await fetch("/api/smart-shop/produits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projetId: product.projetId,
          title: product.title,
          description: product.description,
          price: 0,
          cover: product.cover,
          checkoutType: "free",
        }),
      });
      
      const responseData = await res.json();
      
      if (responseData.success && responseData.product) {
        // ✅ Mise à jour IMMÉDIATE : on modifie directement le cache SWR
        mutate(
          (currentData) => {
            if (!currentData || !currentData.products) return currentData;
            
            // 1. Retirer le projet (projet_xxx) de la liste
            const withoutProjet = currentData.products.filter(p => p._id !== projetIdToRemove);
            
            // 2. Ajouter le nouveau produit créé EN PREMIER
            const newProduct = {
              ...responseData.product,
              isFromBookzy: true,
              isActive: true,
            };
            
            return { 
              ...currentData, 
              products: [newProduct, ...withoutProjet] 
            };
          },
          false
        );
      } else {
        showInfo(responseData.error || "Erreur lors de l'activation");
      }
    } catch (error) {
      console.error("Erreur activation:", error);
      showInfo("Erreur réseau. Réessayez.");
    } finally {
      setActivatingId(null);
    }
  };

  const toggleProductActive = async (product) => {
    // Si c'est un projet non lié, on l'active d'abord
    if (product._id.startsWith("projet_")) {
      await activateProjet(product);
      return;
    }
    
    const newStatus = !product.isActive;
    
    // ✅ Mise à jour optimiste IMMÉDIATE
    mutate(
      (data) => ({
        ...data,
        products: data.products.map(p => 
          p._id === product._id ? { ...p, isActive: newStatus } : p
        )
      }),
      false
    );
    
    // Sync en arrière-plan
    try {
      await fetch(`/api/smart-shop/produits/${product._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      });
    } catch (error) {
      mutate(); // Rollback si erreur
    }
  };

  // Ouvrir le modal de confirmation de suppression
  const confirmDelete = (product) => {
    // Ne pas supprimer les projets Bookzy non liés
    if (product._id.startsWith("projet_")) {
      showInfo("Ce projet est dans Mes Projets. Va dans Mes Projets pour le supprimer.");
      return;
    }
    setDeletingProduct(product);
  };

  // Supprimer le produit après confirmation
  const deleteProduct = async () => {
    if (!deletingProduct) return;
    
    const productId = deletingProduct._id;
    
    try {
      await fetch(`/api/smart-shop/produits/${productId}`, {
        method: "DELETE",
      });
      
      // Mise à jour optimiste
      mutate(
        (currentData) => {
          if (!currentData) return currentData;
          return {
            ...currentData,
            products: currentData.products.filter(p => p._id !== productId)
          };
        },
        false
      );
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingProduct(null);
    }
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const allowedTypes = ["application/pdf", "application/epub+zip"];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.epub')) {
      showInfo("Format accepté : PDF ou EPUB");
      return;
    }
    
    if (file.size > 50 * 1024 * 1024) {
      showInfo("Fichier trop volumineux (max 50MB)");
      return;
    }
    
    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "product");
      
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      
      if (data.success && data.url) {
        setNewProduct(prev => ({
          ...prev,
          file: data.url,
          fileName: file.name,
        }));
      } else {
        showInfo("Erreur lors de l'upload");
      }
    } catch (error) {
      console.error("Erreur upload:", error);
      showInfo("Erreur lors de l'upload");
    } finally {
      setUploadingFile(false);
    }
  };

  // Handle cover upload
  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "cover");
      
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      
      if (data.success && data.url) {
        setNewProduct(prev => ({ ...prev, cover: data.url }));
      }
    } catch (error) {
      console.error("Erreur upload:", error);
    } finally {
      setUploadingCover(false);
    }
  };

  // Create product
  const createProduct = async () => {
    if (!newProduct.title.trim()) {
      showInfo("Titre requis");
      return;
    }
    if (!newProduct.file) {
      showInfo("Fichier requis");
      return;
    }
    
    setIsCreating(true);
    try {
      const res = await fetch("/api/smart-shop/produits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newProduct.title,
          description: newProduct.description,
          price: parseInt(newProduct.price) || 0,
          file: {
            url: newProduct.file,
            name: newProduct.fileName,
          },
          cover: newProduct.cover,
          checkoutType: parseInt(newProduct.price) > 0 ? "link" : "free",
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setNewProduct({ title: "", description: "", price: "0", file: null, fileName: "", cover: "" });
        mutate();
      } else {
        showInfo(data.error || "Erreur");
      }
    } catch (error) {
      showInfo("Erreur réseau");
    } finally {
      setIsCreating(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Séparer les produits : activés dans la boutique vs projets disponibles
  const shopProducts = filteredProducts.filter(p => !p._id.startsWith("projet_"));
  const availableProjets = filteredProducts.filter(p => p._id.startsWith("projet_"));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* ✅ Info modal */}
      <InfoModal message={infoMessage} onClose={() => setInfoMessage("")} />

      <div className="max-w-4xl mx-auto px-4 py-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Mes Produits</h1>
            <p className="text-sm text-gray-500 mt-1">{products.length} produit{products.length > 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800"
          >
            <Plus className="w-4 h-4" />
            Importer un produit
          </button>
        </div>

        {/* Search */}
        {products.length > 0 && (
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none"
            />
          </div>
        )}

        {/* Products in boutique */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">Dans ma boutique</h2>
          </div>
          
          {shopProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Aucun produit dans ta boutique</p>
              <p className="text-gray-400 text-xs mt-1">Active un ebook ci-dessous ou ajoute un produit</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {shopProducts.map((product) => (
                <ProductRow 
                  key={product._id} 
                  product={product} 
                  onToggle={toggleProductActive}
                  onDelete={confirmDelete}
                  activatingId={activatingId}
                />
              ))}
            </div>
          )}
        </div>

        {/* Projets Bookzy not yet activated */}
        {availableProjets.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-gray-700">Ebooks Bookzy disponibles</h2>
                    <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full font-medium">{availableProjets.length}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">Clique sur "Activer" pour ajouter à ta boutique</p>
                </div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {availableProjets.slice(0, showAllProjets ? availableProjets.length : 10).map((product) => (
                <ProductRow 
                  key={product._id} 
                  product={product} 
                  onToggle={toggleProductActive}
                  onDelete={confirmDelete}
                  activatingId={activatingId}
                  isProjetPreview
                />
              ))}
            </div>
            
            {availableProjets.length > 10 && !showAllProjets && (
              <button
                onClick={() => setShowAllProjets(true)}
                className="w-full py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 border-t border-gray-100"
              >
                Voir les {availableProjets.length - 10} autres ebooks
              </button>
            )}
          </div>
        )}

        {/* Empty state */}
        {products.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 text-center py-16">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Aucun produit</p>
            <p className="text-sm text-gray-400 mt-1">Génère un ebook ou importe un produit</p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800"
              >
                Importer un produit
              </button>
              <Link
                href="/dashboard/projets/nouveau"
                className="px-4 py-2 text-gray-700 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Générer un ebook
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div 
            className="w-full max-w-lg bg-white rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Importer un produit</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Titre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newProduct.title}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Guide complet du marketing digital"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Fichier <span className="text-red-500">*</span>
                </label>
                <input ref={fileInputRef} type="file" accept=".pdf,.epub" onChange={handleFileUpload} className="hidden" />
                
                {newProduct.file ? (
                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{newProduct.fileName}</p>
                      <p className="text-xs text-green-600">Fichier uploadé</p>
                    </div>
                    <button onClick={() => setNewProduct(prev => ({ ...prev, file: null, fileName: "" }))} className="p-1 hover:bg-green-100 rounded">
                      <X className="w-4 h-4 text-green-600" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingFile}
                    className="w-full p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all"
                  >
                    {uploadingFile ? (
                      <Loader2 className="w-8 h-8 text-gray-400 mx-auto animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Clique pour uploader</p>
                        <p className="text-xs text-gray-400 mt-1">PDF ou EPUB, max 50MB</p>
                      </>
                    )}
                  </button>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Couverture <span className="text-gray-400">(optionnel)</span>
                </label>
                <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                
                <div className="flex gap-4">
                  <div className="w-24 h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {newProduct.cover ? (
                      <img src={newProduct.cover} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <button
                      onClick={() => coverInputRef.current?.click()}
                      disabled={uploadingCover}
                      className="w-full py-2.5 px-4 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                    >
                      {uploadingCover ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      {newProduct.cover ? "Changer" : "Ajouter"}
                    </button>
                    {newProduct.cover && (
                      <button onClick={() => setNewProduct(prev => ({ ...prev, cover: "" }))} className="w-full mt-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl">
                        Supprimer
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description <span className="text-gray-400">(optionnel)</span>
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Décris ton produit..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Prix</label>
                <div className="relative">
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0"
                    className="w-full px-4 py-2.5 pr-16 border border-gray-200 rounded-xl focus:border-gray-400 focus:outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">FCFA</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Mets 0 pour un produit gratuit</p>
              </div>
            </div>
            
            <div className="flex gap-3 p-5 border-t border-gray-100">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200">
                Annuler
              </button>
              <button
                onClick={createProduct}
                disabled={isCreating || !newProduct.title || !newProduct.file}
                className="flex-1 py-3 bg-gray-900 text-white font-medium rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {deletingProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setDeletingProduct(null)}>
          <div className="w-full max-w-sm bg-white rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 text-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Supprimer ce produit ?</h3>
              <p className="text-sm text-gray-500 mb-1">{deletingProduct.title}</p>
              <p className="text-xs text-gray-400">Cette action est irréversible</p>
            </div>
            <div className="flex border-t border-gray-100">
              <button 
                onClick={() => setDeletingProduct(null)} 
                className="flex-1 py-4 text-gray-700 font-medium hover:bg-gray-50 border-r border-gray-100"
              >
                Annuler
              </button>
              <button 
                onClick={deleteProduct} 
                className="flex-1 py-4 text-red-600 font-medium hover:bg-red-50"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Product Row Component
function ProductRow({ product, onToggle, onDelete, activatingId, isProjetPreview }) {
  const isActivating = activatingId === product._id;
  
  return (
    <div className={`flex items-center gap-4 p-4 ${product.isActive || isProjetPreview ? "" : "opacity-50"}`}>
      {/* Cover */}
      <div className="w-14 h-18 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
        {product.cover ? (
          <img src={product.cover} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileText className="w-6 h-6 text-gray-300" />
          </div>
        )}
      </div>
      
      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{product.title}</h3>
        <p className="text-sm text-gray-500 truncate">
          {product.description?.replace(/<[^>]*>/g, '') || "Pas de description"}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold text-gray-900">
            {product.checkoutType === "free" || product.price === 0 ? "Gratuit" : `${product.price?.toLocaleString()} FCFA`}
          </span>
          {product.isFromBookzy && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
              Bookzy
            </span>
          )}
          {!product.isFromBookzy && !product._id.startsWith("projet_") && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              Uploadé
            </span>
          )}
          {product.pages && (
            <span className="text-xs text-gray-400">{product.pages} pages</span>
          )}
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-2">
        {isProjetPreview ? (
          <button
            onClick={() => onToggle(product)}
            disabled={isActivating}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
          >
            {isActivating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Activer
          </button>
        ) : (
          <>
            <Link
              href={`/dashboard/smart-shop/boutique?tab=produits`}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              title="Modifier"
            >
              <Pencil className="w-4 h-4" />
            </Link>
            <button
              onClick={() => onDelete(product)}
              className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
              title="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggle(product)}
              className={`p-2 rounded-lg ${product.isActive ? "text-green-600 bg-green-50" : "text-gray-400 hover:bg-gray-100"}`}
              title={product.isActive ? "Désactiver" : "Activer"}
            >
              {product.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </>
        )}
      </div>
    </div>
  );
}