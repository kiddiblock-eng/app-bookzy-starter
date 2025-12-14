"use client";
import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  MessageCircle,
  X,
  LifeBuoy
} from "lucide-react";

export default function SupportPage() {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hey ! 👋 Je suis BookzyBot, ton expert personnel.\n\nJe suis là pour t'aider à créer, optimiser et vendre tes ebooks. Tu peux me poser des questions techniques ou me demander des conseils marketing.\n\nComment puis-je t'aider aujourd'hui ? 😊",
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  // ✅ 1. AJOUT DE L'ÉTAT POUR LA DATE (CORRECTION HYDRATION)
  const [todayDate, setTodayDate] = useState("");

  const chatEndRef = useRef(null);
  const textareaRef = useRef(null); 

  // 🔹 Questions rapides
  const quickQuestions = [
    "Comment créer mon premier ebook ?",
    "Quel template choisir ?",
    "Comment vendre mon ebook ?",
    "C'est quoi Niche Hunter ?",
    "J'ai un problème technique",
  ];

  // ✅ 2. CALCUL DE LA DATE UNIQUEMENT CÔTÉ CLIENT
  useEffect(() => {
    setTodayDate(new Date().toLocaleDateString('fr-FR', {
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    }));
  }, []);

  // 🔁 Scroll auto vers le bas
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // 🔹 Gestion de la hauteur auto du Textarea
  const handleInputResize = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; 
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`; 
    }
  };

  // 🔹 Envoi du message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      from: "user",
      text: input,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    if (textareaRef.current) textareaRef.current.style.height = "48px";

    try {
      const recentHistory = messages.slice(-6); 

      const res = await fetch("/api/support/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: input,
          history: recentHistory 
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      const botResponse = {
        from: "bot",
        text: data.reply || "Désolé, je n'ai pas bien compris. Peux-tu reformuler ? 🤔",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);

    } catch (err) {
      console.error("❌ Erreur chat:", err);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Oups ! Une erreur de connexion est survenue. Réessaie dans un instant. 🔌",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setInput(question);
    if (textareaRef.current) textareaRef.current.value = question;
    setTimeout(() => {
        const userMessage = { from: "user", text: question, timestamp: new Date() };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);
        
        fetch("/api/support/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: question, history: messages.slice(-6) }),
        })
        .then(r => r.json())
        .then(data => {
            setMessages(prev => [...prev, {
                from: "bot", 
                text: data.reply || "Je regarde ça pour toi...", 
                timestamp: new Date() 
            }]);
            setLoading(false);
        })
        .catch(() => setLoading(false));
    }, 300);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) =>
    date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-neutral-900 pb-10">
      <div className="max-w-5xl mx-auto px-4 py-8">
        
        {/* HEADER PAGE */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-blue-700">Assistant IA 24/7</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
            Centre d'Aide Bookzy
          </h1>
          <p className="text-slate-500 max-w-lg mx-auto">
            Un expert dédié qui connaît la plateforme par cœur pour débloquer ta situation.
          </p>
        </div>

        {/* CONTAINER CHAT */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 flex flex-col h-[75vh] md:h-[700px]">
          
          {/* EN-TÊTE DU CHAT */}
          <div className="bg-slate-900 p-4 md:p-6 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg border border-white/10">
                    <Bot className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-slate-900 rounded-full"></div>
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg leading-tight">
                    BookzyBot
                  </h2>
                  <p className="text-blue-200 text-xs font-medium">Réponse instantanée</p>
                </div>
              </div>
              <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                 <LifeBuoy className="w-5 h-5 text-white/80" />
              </div>
            </div>
          </div>

          {/* ZONE DES MESSAGES (SCROLLABLE) */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50">
            
            {/* ✅ 3. UTILISATION DE L'ÉTAT SECURISE POUR L'AFFICHAGE */}
            <div className="text-center">
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full capitalize">
                    {todayDate ? `Aujourd'hui, ${todayDate}` : "Aujourd'hui"}
                </span>
            </div>

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex items-end gap-3 ${m.from === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                    m.from === "bot" ? "bg-indigo-100 text-indigo-600" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {m.from === "bot" ? <Bot size={16} /> : <User size={16} />}
                </div>

                {/* Bulle Message */}
                <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${m.from === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`px-5 py-3.5 text-sm md:text-base leading-relaxed shadow-sm whitespace-pre-wrap ${
                      m.from === "bot"
                        ? "bg-white text-slate-700 rounded-2xl rounded-bl-none border border-slate-100"
                        : "bg-blue-600 text-white rounded-2xl rounded-br-none"
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 mt-1 px-1">
                    {formatTime(m.timestamp)}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-end gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Bot size={16} />
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-slate-100 shadow-sm">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.3s]"></div>
                  </div>
                </div>
              </div>
            )}

            {messages.length < 3 && !loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                    {quickQuestions.map((q, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleQuickQuestion(q)}
                            className="text-left px-4 py-2.5 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-600 hover:text-blue-700 rounded-xl text-sm font-medium transition-all shadow-sm active:scale-95"
                        >
                            {q}
                        </button>
                    ))}
                </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* ZONE DE SAISIE */}
          <div className="p-4 bg-white border-t border-slate-200">
            <div className="flex items-end gap-2 bg-slate-100 rounded-3xl p-2 border border-transparent focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
              
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputResize}
                  onKeyDown={handleKeyDown}
                  placeholder="Posez votre question ici..."
                  rows={1}
                  className="w-full px-4 py-3 bg-transparent border-none text-slate-900 placeholder:text-slate-400 focus:ring-0 text-sm resize-none max-h-[120px] overflow-y-auto"
                  style={{ minHeight: "44px" }}
                />
              </div>

              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="w-11 h-11 flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-90"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-0.5" />}
              </button>
            </div>
            
            <div className="text-center mt-3">
                <p className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1">
                    <Sparkles size={10} /> IA propulsée par Bookzy Intelligence
                </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}