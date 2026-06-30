"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  X,
  Loader2,
  FileText,
  Link as LinkIcon,
  ImageIcon,
  Target,
  Tag,
  ArrowLeft,
  PenTool
} from "lucide-react";

export default function EditBlogPage({ params }) {
  const router = useRouter();
  const { id } = params; // Récupère l'ID depuis l'URL

  const [loading, setLoading] = useState(true);
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

  // --- 1. CHARGEMENT DES DONNÉES ---
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        // Adapte l'URL selon ton API (ex: /api/admin/blogs/get?id=...)
        const res = await fetch(`/api/admin/blogs/${id}`); 
        const data = await res.json();

        if (data.success && data.blog) {
          const b = data.blog;
          setTitle(b.title || "");
          setSlug(b.slug || "");
          setCover(b.cover || "");
          setExcerpt(b.excerpt || "");
          setContent(b.content || "");
          setSeoTitle(b.seoTitle || "");
          setSeoDescription(b.seoDescription || "");
          setSeoKeywords(b.seoKeywords || "");
        } else {
          alert("Article introuvable");
          router.push("/admin/blog");
        }
      } catch (error) {
        console.error("Erreur chargement:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBlog();
  }, [id, router]);

  // --- 2. SAUVEGARDE ---
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/blogs/update/${id}`, { // Vérifie ton endpoint d'update
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, slug, cover, excerpt, content, seoTitle, seoDescription, seoKeywords
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Article mis à jour !");
        router.push("/admin/blog"); // Retour à la liste
      } else {
        alert("❌ Erreur : " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Erreur réseau");
    } finally {
      setSaving(false);
    }
  };

  const generateSlug = (text) =>
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");

  // --- RENDER ---

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center text-neutral-500">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-6 md:p-8 font-sans text-neutral-900">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-black text-neutral-900 tracking-tight flex items-center gap-2">
                Éditer l'article
              </h1>
              <p className="text-sm text-neutral-500 font-mono text-xs">{id}</p>
            </div>
          </div>
          <button
            onClick={() => router.push("/admin/blog")}
            className="text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* FORMULAIRE (Zero-Block Design) */}
        <form onSubmit={handleUpdate} className="space-y-16">

          {/* SECTION 1: CONTENU */}
          <div>
            <div className="mb-8">
                <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                  <FileText size={18} className="text-emerald-600" /> Contenu Principal
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
              <div className="md:col-span-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase mb-2 block">Titre</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => { setTitle(e.target.value); if(!slug) setSlug(generateSlug(e.target.value)); }}
                    className="w-full bg-white border border-neutral-200 text-neutral-900 text-sm rounded-lg p-4 focus:ring-2 focus:ring-neutral-900 focus:outline-none placeholder:text-neutral-400 transition-all"
                    required
                  />
              </div>

              <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase mb-2 block">Slug (URL)</label>
                  <div className="relative">
                    <LinkIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"/>
                    <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(generateSlug(e.target.value))}
                        className="w-full bg-white border border-neutral-200 text-neutral-700 font-mono text-xs rounded-lg pl-10 pr-4 py-4 focus:ring-2 focus:ring-neutral-900 focus:outline-none"
                        required
                    />
                  </div>
              </div>

              <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase mb-2 block">Cover URL</label>
                  <div className="relative">
                    <ImageIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"/>
                    <input
                        type="url"
                        value={cover}
                        onChange={(e) => setCover(e.target.value)}
                        className="w-full bg-white border border-neutral-200 text-neutral-700 text-sm rounded-lg pl-10 pr-4 py-4 focus:ring-2 focus:ring-neutral-900 focus:outline-none"
                    />
                  </div>
              </div>

              <div className="md:col-span-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase mb-2 block">Extrait</label>
                  <textarea
                    rows={2}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full bg-white border border-neutral-200 text-neutral-700 text-sm rounded-lg p-4 focus:ring-2 focus:ring-neutral-900 focus:outline-none resize-none"
                  />
              </div>

              <div className="md:col-span-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase mb-2 block">Contenu (HTML)</label>
                  <textarea
                    rows={12}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-white border border-neutral-200 text-neutral-700 font-mono text-sm rounded-lg p-4 focus:ring-2 focus:ring-neutral-900 focus:outline-none"
                    required
                  />
              </div>
            </div>
          </div>

          {/* SECTION 2: SEO */}
          <div className="pt-8 border-t border-neutral-200">
            <div className="mb-8">
                <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                  <Target size={18} className="text-emerald-600" /> SEO
                </h3>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase mb-2 block">Meta Title</label>
                  <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="w-full bg-white border border-neutral-200 text-neutral-900 text-sm rounded-lg p-4 focus:ring-2 focus:ring-neutral-900 focus:outline-none" />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase mb-2 block">Meta Description</label>
                  <textarea rows={3} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} className="w-full bg-white border border-neutral-200 text-neutral-700 text-sm rounded-lg p-4 focus:ring-2 focus:ring-neutral-900 focus:outline-none resize-none" />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase mb-2 block">Mots-clés</label>
                  <div className="relative">
                      <Tag size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"/>
                      <input type="text" value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} className="w-full bg-white border border-neutral-200 text-neutral-700 text-sm rounded-lg pl-10 pr-4 py-4 focus:ring-2 focus:ring-neutral-900 focus:outline-none" />
                  </div>
                </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center justify-end gap-6 pt-8 border-t border-neutral-200 sticky bottom-0 bg-neutral-50/95 backdrop-blur py-4 z-10">
            <button
              type="button"
              onClick={() => router.push("/admin/blog")}
              className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl disabled:opacity-50 flex items-center gap-2 transition-all"
            >
              {saving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
              {saving ? "Enregistrement..." : "Mettre à jour"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}