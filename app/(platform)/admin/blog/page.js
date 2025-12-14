"use client";

import { useEffect, useState } from "react";
import {
  PlusCircle,
  Trash2,
  Edit3,
  Loader2,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Save,
  X,
  Search,
  Target,
  Tag,
  PenTool,
  Eye,
  ArrowLeft
} from "lucide-react";

export default function AdminBlogsPage() {
  const [tab, setTab] = useState("list");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  // --- FORM STATES ---
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [cover, setCover] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");

  // --- LOGIQUE (STRICTEMENT INTACTE) ---
  async function loadBlogs() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/blogs/list");
      const data = await res.json();
      if (data.success) setBlogs(data.blogs);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadBlogs(); }, []);

  const generateSlug = (text) =>
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");

  async function handleCreateBlog(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, cover, excerpt, content, seoTitle, seoDescription, seoKeywords }),
      });
      const data = await res.json();
      if (data.success) {
        setTitle(""); setSlug(""); setCover(""); setExcerpt(""); setContent(""); setSeoTitle(""); setSeoDescription(""); setSeoKeywords("");
        setTab("list");
        loadBlogs();
        alert("✅ Blog créé avec succès !");
      } else { alert("❌ " + (data.message || "Erreur lors de la création")); }
    } catch (err) { console.error(err); alert("❌ Erreur réseau"); } 
    finally { setSaving(false); }
  }

  async function deleteBlog(id) {
    if (!confirm("⚠️ Supprimer définitivement ce blog ?")) return;
    const res = await fetch(`/api/admin/blogs/delete/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) { loadBlogs(); alert("✅ Blog supprimé"); }
  }

  const filteredBlogs = blogs.filter((b) => b.title.toLowerCase().includes(search.toLowerCase()));

  // --- RENDER ---

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center gap-4 text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
        <p className="text-xs font-mono tracking-widest uppercase">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] p-6 md:p-8 font-sans text-slate-200">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800/50 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
              Gestion Blog
            </h1>
            <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
               <PenTool size={14} className="text-purple-500" />
               Publication et SEO
            </p>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex p-1 bg-slate-900/50 border border-slate-800 rounded-lg">
                <button
                  onClick={() => setTab("list")}
                  className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center gap-2 ${
                    tab === "list" ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <FileText size={14} /> Articles ({blogs.length})
                </button>
                <button
                  onClick={() => setTab("create")}
                  className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center gap-2 ${
                    tab === "create" ? "bg-purple-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <PlusCircle size={14} /> Nouveau
                </button>
             </div>
          </div>
        </div>

        {/* CONTENU */}
        <div className="min-h-[600px]">
           
           {/* LISTE */}
           {tab === "list" && (
             <div className="space-y-8">
               <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher un article..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-transparent border border-slate-800 text-slate-200 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:border-purple-500 focus:outline-none transition-all placeholder:text-slate-600"
                  />
               </div>

               {filteredBlogs.length === 0 ? (
                  <div className="text-center py-20 border border-dashed border-slate-800 rounded-xl">
                     <FileText className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                     <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide">Aucun article</h3>
                  </div>
               ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {filteredBlogs.map((blog) => (
                        <div key={blog._id} className="group flex flex-col">
                           {/* Cover Image - Floating */}
                           <div className="h-48 rounded-2xl bg-slate-900 relative overflow-hidden mb-4 border border-slate-800 group-hover:border-purple-500/30 transition-all">
                              {blog.cover ? (
                                 <img src={blog.cover} alt={blog.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                              ) : (
                                 <div className="w-full h-full flex items-center justify-center text-slate-700"><ImageIcon size={32}/></div>
                              )}
                           </div>

                           <div className="flex-1 flex flex-col">
                              <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-purple-400 transition-colors">
                                 {blog.title}
                              </h3>
                              <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
                                 {blog.excerpt || "Pas d'extrait disponible..."}
                              </p>

                              <div className="flex items-center justify-between pt-2 border-t border-slate-800/50">
                                 <span className="text-xs text-slate-600 font-mono">{new Date(blog.createdAt).toLocaleDateString()}</span>
                                 <div className="flex gap-3">
                                    <a href={`/blog/${blog.slug}`} target="_blank" className="text-slate-500 hover:text-white transition-colors" title="Voir"><Eye size={14} /></a>
                                    <a href={`/admin/blog/edit/${blog._id}`} className="text-slate-500 hover:text-blue-400 transition-colors" title="Éditer"><Edit3 size={14} /></a>
                                    <button onClick={() => deleteBlog(blog._id)} className="text-slate-500 hover:text-red-400 transition-colors" title="Supprimer"><Trash2 size={14} /></button>
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
             </div>
           )}

           {/* FORMULAIRE - 100% TRANSPARENT */}
           {tab === "create" && (
             <div className="max-w-4xl mx-auto">
                <form onSubmit={handleCreateBlog} className="space-y-16">
                   
                   {/* SECTION 1 */}
                   <div>
                      <div className="mb-8">
                         <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <FileText size={18} className="text-purple-400" /> Contenu Principal
                         </h3>
                         <p className="text-sm text-slate-500 mt-1">Informations de base de l'article</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                        <div className="md:col-span-2">
                           <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Titre</label>
                           <input 
                              type="text" 
                              value={title} 
                              onChange={(e) => { setTitle(e.target.value); setSlug(generateSlug(e.target.value)); if(!seoTitle) setSeoTitle(e.target.value); }}
                              placeholder="Titre de l'article"
                              className="w-full bg-transparent border border-slate-700 text-white text-sm rounded-lg p-4 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none placeholder:text-slate-700 transition-all"
                              required
                           />
                        </div>
                        
                        <div>
                           <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Slug (URL)</label>
                           <div className="relative">
                              <LinkIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"/>
                              <input 
                                 type="text" 
                                 value={slug} 
                                 onChange={(e) => setSlug(generateSlug(e.target.value))}
                                 className="w-full bg-transparent border border-slate-700 text-slate-300 font-mono text-xs rounded-lg pl-10 pr-4 py-4 focus:border-purple-500 focus:outline-none"
                                 required
                              />
                           </div>
                        </div>

                        <div>
                           <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Image Couverture (URL)</label>
                           <div className="relative">
                              <ImageIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"/>
                              <input 
                                 type="url" 
                                 value={cover} 
                                 onChange={(e) => setCover(e.target.value)}
                                 placeholder="https://..."
                                 className="w-full bg-transparent border border-slate-700 text-slate-300 text-sm rounded-lg pl-10 pr-4 py-4 focus:border-purple-500 focus:outline-none placeholder:text-slate-700"
                              />
                           </div>
                        </div>

                        <div className="md:col-span-2">
                           <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Extrait (Résumé)</label>
                           <textarea 
                              rows={2} 
                              value={excerpt} 
                              onChange={(e) => setExcerpt(e.target.value)}
                              placeholder="Court résumé pour les cartes..."
                              className="w-full bg-transparent border border-slate-700 text-slate-300 text-sm rounded-lg p-4 focus:border-purple-500 focus:outline-none resize-none placeholder:text-slate-700"
                           />
                        </div>

                        <div className="md:col-span-2">
                           <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Contenu (HTML)</label>
                           <textarea 
                              rows={12}
                              value={content} 
                              onChange={(e) => setContent(e.target.value)}
                              placeholder="<p>Votre contenu ici...</p>"
                              className="w-full bg-transparent border border-slate-700 text-slate-300 font-mono text-sm rounded-lg p-4 focus:border-purple-500 focus:outline-none placeholder:text-slate-700"
                              required
                           />
                        </div>
                      </div>
                   </div>

                   {/* SECTION 2 */}
                   <div className="pt-8 border-t border-slate-800">
                      <div className="mb-8">
                         <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Target size={18} className="text-emerald-400" /> SEO & Métadonnées
                         </h3>
                         <p className="text-sm text-slate-500 mt-1">Optimisation pour les moteurs de recherche</p>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-8">
                         <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Meta Title</label>
                            <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="w-full bg-transparent border border-slate-700 text-white text-sm rounded-lg p-4 focus:border-emerald-500 focus:outline-none" />
                            <div className="flex justify-between mt-2 px-1">
                               <span className="text-[10px] text-slate-600">Recommandé : 50-60 caractères</span>
                               <span className={`text-[10px] font-mono ${seoTitle.length > 60 ? 'text-red-400' : 'text-emerald-400'}`}>{seoTitle.length}/60</span>
                            </div>
                         </div>

                         <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Meta Description</label>
                            <textarea rows={3} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} className="w-full bg-transparent border border-slate-700 text-slate-300 text-sm rounded-lg p-4 focus:border-emerald-500 focus:outline-none resize-none" />
                            <div className="flex justify-between mt-2 px-1">
                               <span className="text-[10px] text-slate-600">Recommandé : 150-160 caractères</span>
                               <span className={`text-[10px] font-mono ${seoDescription.length > 160 ? 'text-red-400' : 'text-emerald-400'}`}>{seoDescription.length}/160</span>
                            </div>
                         </div>

                         <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Mots-clés</label>
                            <div className="relative">
                               <Tag size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"/>
                               <input type="text" value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} placeholder="tag1, tag2, tag3" className="w-full bg-transparent border border-slate-700 text-slate-300 text-sm rounded-lg pl-10 pr-4 py-4 focus:border-emerald-500 focus:outline-none placeholder:text-slate-700" />
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* ACTIONS */}
                   <div className="flex items-center justify-end gap-6 pt-8 border-t border-slate-800 sticky bottom-0 bg-[#020617]/95 backdrop-blur py-4 z-10">
                      <button type="button" onClick={() => setTab("list")} className="text-sm font-medium text-slate-500 hover:text-white transition-colors">
                         Annuler
                      </button>
                      <button type="submit" disabled={saving} className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg shadow-lg shadow-purple-900/20 disabled:opacity-50 flex items-center gap-2 transition-all">
                         {saving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
                         {saving ? "Publication..." : "Publier l'article"}
                      </button>
                   </div>

                </form>
             </div>
           )}

        </div>
      </div>
    </div>
  );
}