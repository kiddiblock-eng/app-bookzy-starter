"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "@/app/(platform)/components/DashboardSidebar";
import DashboardHeader from "@/app/(platform)/components/DashboardHeader";
import EmailVerificationBanner from "@/app/(platform)/components/EmailVerificationBanner";
import WhatsNewBanner from "@/app/(platform)/components/WhatsNewBanner";
import V11SplashScreen from "@/app/(platform)/components/V11SplashScreen";
import { MessageCircle, X, Send } from "lucide-react";

function useActiveUserPing() {
  useEffect(() => {
    const sendPing = () => {
      fetch("/api/activity/track", { method: "POST" }).catch(() => {});
    };
    sendPing();
    const interval = setInterval(sendPing, 30_000);
    return () => clearInterval(interval);
  }, []);
}

function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let intervalId = null;
    const fetchData = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.id) {
          setUser((prevUser) => {
            if (!prevUser || prevUser.emailVerified !== data.emailVerified) return data;
            return prevUser;
          });
          if (data.emailVerified && intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
        }
      } catch (err) {
        console.error("Erreur fetch user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    intervalId = setInterval(fetchData, 30_000);
    return () => { if (intervalId) clearInterval(intervalId); };
  }, []);

  return { user, loading };
}

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useActiveUserPing();
  const { user, loading } = useCurrentUser();

  const sidebarWidth = collapsed ? "lg:ml-[64px]" : "lg:ml-[256px]";
  const headerLeft   = collapsed ? "lg:left-[64px]" : "lg:left-[256px]";

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex w-full overflow-x-hidden">

      {/* SPLASH SCREEN V1.1 */}
      {!loading && user && <V11SplashScreen user={user} />}

      {/* SIDEBAR */}
      <DashboardSidebar
        open={open}
        setOpen={setOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* CONTENU */}
      <div className={`flex-1 flex flex-col ${sidebarWidth} relative max-w-full transition-all duration-300`}>

        {/* HEADER */}
        <div className={`fixed top-0 left-0 ${headerLeft} right-0 z-30 bg-white/80 dark:bg-neutral-950/80 border-b border-neutral-200 dark:border-neutral-800 backdrop-blur-xl shadow-sm transition-all duration-300`}
          style={{ height: "56px" }}>
          <DashboardHeader onMenuClick={() => setOpen(true)} />
        </div>

        {/* BANNER */}
        <div className="pt-[56px] lg:ml-0">
          {!loading && user && <WhatsNewBanner user={user} />}
          {!loading && user && <EmailVerificationBanner user={user} />}
        </div>

        {/* MAIN */}
        <main className="bg-neutral-50 dark:bg-neutral-950 min-h-screen overflow-x-hidden">
          <div className="p-4 md:p-6 lg:p-8 w-full max-w-full">
            {children}
          </div>
        </main>
      </div>

      {/* SUPPORT FLOTTANT */}
      <FloatingSupport open={chatOpen} setOpen={setChatOpen} />
    </div>
  );
}

function FloatingSupport({ open, setOpen }) {
  const [messages, setMessages] = useState([{ from: "bot", text: "Hey ! 👋 Comment puis-je t'aider ?" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useState(null)[0];

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/support/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, history: messages.slice(-6) }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { from: "bot", text: data.reply || "Désolé, je n'ai pas compris. Reformule ? 🤔" }]);
    } catch {
      setMessages((prev) => [...prev, { from: "bot", text: "Oups ! Erreur de connexion. Réessaie. 🔌" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${open ? "bg-slate-700 text-white" : "bg-slate-900 hover:bg-slate-800 text-white"}`}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] h-[480px] max-h-[70vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
          <div className="bg-slate-900 text-white px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Support Bookzy</h3>
              <p className="text-[10px] text-slate-400">Réponse instantanée</p>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/10 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-3 py-2 text-sm rounded-xl ${m.from === "bot" ? "bg-white text-slate-700 border border-slate-100" : "bg-slate-900 text-white"}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 px-4 py-2 rounded-xl">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="p-3 bg-white border-t border-slate-100 flex-shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Écris ton message..."
                className="flex-1 px-3 py-2.5 bg-slate-100 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <button onClick={sendMessage} disabled={loading || !input.trim()}
                className="w-10 h-10 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white rounded-xl flex items-center justify-center transition-all">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}