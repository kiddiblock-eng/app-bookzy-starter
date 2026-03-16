"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon,
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  List,
  ListOrdered,
  Loader2
} from "lucide-react";
import { useState } from "react";
import TiptapUnderline from "@tiptap/extension-underline";
import { BulletList } from "@tiptap/extension-bullet-list";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { ListItem } from "@tiptap/extension-list-item";

export default function TipTapEditor({ 
  content, 
  onChange, 
  placeholder = "Écrivez votre contenu ici...",
  onAIImprove,
  maxHeight = "400px" // ✅ Hauteur configurable
}) {
  const [aiAction, setAiAction] = useState(null);
  const [isAILoading, setIsAILoading] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      TiptapUnderline,
      BulletList.configure({
        HTMLAttributes: {
          class: 'list-disc pl-6',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'list-decimal pl-6',
        },
      }),
      ListItem,
      TextAlign.configure({
        types: ["paragraph"],
        alignments: ["left", "center", "right"],
      }),
    ],
    
    content,
    
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose max-w-none focus:outline-none min-h-[200px] px-4 py-3",
      },
      transformPastedHTML(html) {
        return html
          .replace(/style="[^"]*"/g, '')
          .replace(/class="[^"]*"/g, '')
          .replace(/<font[^>]*>/g, '')
          .replace(/<\/font>/g, '')
          .replace(/&nbsp;/g, ' ');
      },
    },
    
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return (
      <div className="bg-white rounded-xl border-2 border-slate-200 p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-8 bg-slate-200 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  const handleAI = async (action) => {
    if (!onAIImprove) return;
    
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, ' ');
    const currentText = selectedText.trim() || editor.getText();
    
    if (!currentText || currentText.trim().length === 0) {
      alert("Veuillez d'abord écrire du texte avant d'utiliser l'IA");
      return;
    }

    setAiAction(action);
    setIsAILoading(true);

    try {
      const actionMap = {
        'improve': 'améliorer',
        'fix': 'corriger',
        'rephrase': 'reformuler'
      };

      const result = await onAIImprove(currentText, actionMap[action]);
      
      if (result.success) {
        if (selectedText.trim()) {
          editor.chain()
            .focus()
            .deleteRange({ from, to })
            .insertContent(result.improvedText)
            .run();
        } else {
          editor.commands.setContent(result.improvedText);
        }
      } else {
        alert("Erreur IA : " + (result.error || "Erreur inconnue"));
      }
    } catch (error) {
      console.error("Erreur IA:", error);
      alert("Une erreur est survenue");
    } finally {
      setIsAILoading(false);
      setAiAction(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden">
      
      {/* TOOLBAR */}
      <div className="border-b border-slate-200 bg-slate-50 p-2 flex flex-wrap gap-1">
        
        {/* Formatage texte */}
        <div className="flex items-center gap-1 pr-2 border-r border-slate-300">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-slate-200 transition-colors ${
              editor.isActive("bold") ? "bg-slate-300 text-slate-900" : "text-slate-600"
            }`}
            title="Gras (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-slate-200 transition-colors ${
              editor.isActive("italic") ? "bg-slate-300 text-slate-900" : "text-slate-600"
            }`}
            title="Italique (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-slate-200 transition-colors ${
              editor.isActive("underline") ? "bg-slate-300 text-slate-900" : "text-slate-600"
            }`}
            title="Souligné (Ctrl+U)"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Listes */}
        <div className="flex items-center gap-1 pr-2 border-r border-slate-300">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-slate-200 transition-colors ${
              editor.isActive("bulletList") ? "bg-slate-300 text-slate-900" : "text-slate-600"
            }`}
            title="Liste à puces"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-slate-200 transition-colors ${
              editor.isActive("orderedList") ? "bg-slate-300 text-slate-900" : "text-slate-600"
            }`}
            title="Liste numérotée"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
        </div>

        {/* Alignement */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`p-2 rounded hover:bg-slate-200 transition-colors ${
              editor.isActive({ textAlign: "left" }) ? "bg-slate-300 text-slate-900" : "text-slate-600"
            }`}
            title="Aligner à gauche"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`p-2 rounded hover:bg-slate-200 transition-colors ${
              editor.isActive({ textAlign: "center" }) ? "bg-slate-300 text-slate-900" : "text-slate-600"
            }`}
            title="Centrer"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`p-2 rounded hover:bg-slate-200 transition-colors ${
              editor.isActive({ textAlign: "right" }) ? "bg-slate-300 text-slate-900" : "text-slate-600"
            }`}
            title="Aligner à droite"
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* ✅ ÉDITEUR AVEC SCROLL */}
      <div 
        className="relative overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100"
        style={{ maxHeight }}
      >
        {!content && (
          <div className="absolute top-3 left-4 text-slate-400 pointer-events-none text-sm z-10">
            {placeholder}
          </div>
        )}
        <EditorContent editor={editor} />
      </div>

      {/* BOUTONS IA */}
      {onAIImprove && (
        <div className="border-t border-slate-200 bg-slate-50 p-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleAI("improve")}
              disabled={isAILoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {isAILoading && aiAction === "improve" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Amélioration...</span>
                </>
              ) : (
                <span>Améliorer</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleAI("fix")}
              disabled={isAILoading}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {isAILoading && aiAction === "fix" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Correction...</span>
                </>
              ) : (
                <span>Corriger</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleAI("rephrase")}
              disabled={isAILoading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {isAILoading && aiAction === "rephrase" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Reformulation...</span>
                </>
              ) : (
                <span>Reformuler</span>
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}