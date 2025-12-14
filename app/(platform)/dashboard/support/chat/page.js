"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, MessageSquare, Sparkles } from "lucide-react";

export default function SupportChatPage() {
  const [messages, setMessages] = useState([
    { 
      from: "bot", 
      text: "Salut ! 👋 Je suis l’assistant intelligent Bookzy.\nJe peux t'aider à configurer ton compte, créer ton premier eBook ou résoudre un problème technique.\n\nQuelle est ta question ?",
      timestamp: new Date()
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/support/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { from: "bot", text: data.reply, timestamp: new Date() }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Oups, j'ai eu un petit problème de connexion. Peux-tu réessayer ?", timestamp: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Petit utilitaire pour l'heure
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 p-4 md:p-8 flex items-center justify-center">
      
      {/* Container Principal */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl shadow-indigo-100 overflow-hidden border border-slate-200 flex flex-col h-[85vh]">
        
        {/* ─── Header Premium ─── */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-inner">
                        <Bot className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-indigo-600 rounded-full animate-pulse"></div>
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white tracking-tight">Support Bookzy IA</h1>
                    <p className="text-blue-100 text-xs font-medium flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Réponses instantanées 24/7
                    </p>
                </div>
            </div>
            <div className="hidden sm:block">
                <div className="px-3 py-1 bg-white/10 rounded-full border border-white/20 text-white text-xs font-medium">
                    En ligne
                </div>
            </div>
        </div>

        {/* ─── Zone de messages ─── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50">
          
          {/* Date de début */}
          <div className="text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">Aujourd'hui</span>
          </div>

          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex items-end gap-3 ${
                m.from === "user" ? "flex-row-reverse" : ""
              }`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  m.from === "bot" ? "bg-indigo-100 text-indigo-600" : "bg-slate-200 text-slate-600"
              }`}>
                  {m.from === "bot" ? <Bot size={18} /> : <User size={18} />}
              </div>

              {/* Bulle */}
              <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${m.from === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`px-5 py-3.5 text-sm sm:text-base leading-relaxed shadow-sm whitespace-pre-wrap ${
                      m.from === "bot"
                        ? "bg-white text-slate-700 rounded-2xl rounded-bl-none border border-slate-100"
                        : "bg-blue-600 text-white rounded-2xl rounded-br-none"
                    }`}
                  >
                    {m.text}
                  </div>
                  {/* Timestamp */}
                  <span className="text-[10px] text-slate-400 mt-1 px-1 font-medium">
                      {m.timestamp ? formatTime(m.timestamp) : ""}
                  </span>
              </div>
            </div>
          ))}

          {/* Indicateur de frappe (Loading) */}
          {loading && (
             <div className="flex items-end gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <Bot size={18} />
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-slate-100 shadow-sm">
                    <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                </div>
             </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* ─── Zone de saisie ─── */}
        <div className="p-4 bg-white border-t border-slate-200">
            <form
                onSubmit={sendMessage}
                className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:ring-4 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all shadow-sm"
            >
                <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Posez votre question ici..."
                className="flex-1 px-4 py-3 bg-transparent text-slate-900 placeholder:text-slate-400 text-sm sm:text-base focus:outline-none"
                />
                <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
                >
                <Send size={20} className={loading ? "hidden" : "block ml-0.5"} />
                {loading && <Loader2 size={20} className="animate-spin" />}
                </button>
            </form>
            <div className="text-center mt-3">
                <p className="text-[10px] text-slate-400">L'IA peut faire des erreurs. Vérifiez les informations importantes.</p>
            </div>
        </div>

      </div>
    </div>
  );
}