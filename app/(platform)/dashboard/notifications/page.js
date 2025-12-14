"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Trash2,
  Check,
  ArrowLeft,
  Sparkles,
  ShoppingCart,
  AlertCircle,
  Info,
  Megaphone,
  CheckCheck,
  Inbox
} from "lucide-react";
import Link from "next/link";

export default function AllNotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH INITIAL ---
  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications?limit=100", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error("Erreur fetch notifications:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // --- ACTIONS ---
  const deleteNotification = async (id, e) => {
    e.stopPropagation(); // Empêche le clic sur le lien parent
    try {
      await fetch(`/api/notifications/${id}`, { method: "DELETE", credentials: "include" });
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) { console.error(err); }
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "PATCH", credentials: "include" });
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    } catch (err) { console.error(err); }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`/api/notifications/mark-all-read`, { method: "POST", credentials: "include" });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) { console.error(err); }
  };

  // --- MAPPING (Même que Bell) ---
  const iconMap = {
    bell: Bell,
    sparkles: Sparkles,
    info: Info,
    alert: AlertCircle,
    "shopping-cart": ShoppingCart,
    megaphone: Megaphone,
    "check-circle": Check,
  };

  const colorStyles = (color) => {
    const map = {
      blue: "bg-blue-50 text-blue-600",
      green: "bg-emerald-50 text-emerald-600",
      purple: "bg-purple-50 text-purple-600",
      orange: "bg-orange-50 text-orange-600",
      red: "bg-red-50 text-red-600",
    };
    return map[color] || "bg-slate-50 text-slate-600";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 text-slate-400 hover:text-slate-800 hover:bg-white rounded-xl transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
                <p className="text-sm text-slate-500">Gérez votre historique d'activité</p>
            </div>
          </div>

          {notifications.some(n => !n.read) && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm"
            >
              <CheckCheck className="w-4 h-4" />
              Tout marquer comme lu
            </button>
          )}
        </div>

        {/* LISTE */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center flex flex-col items-center">
               <div className="w-8 h-8 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
               <span className="text-slate-500 text-sm">Chargement...</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-16 px-6 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Inbox className="w-8 h-8 text-slate-300" strokeWidth={1.5} />
              </div>
              <h3 className="text-slate-900 font-semibold mb-1">C'est calme par ici</h3>
              <p className="text-slate-500 text-sm">Vous n'avez aucune notification pour le moment.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((notif) => {
                const IconComponent = iconMap[notif.icon] || Bell;
                
                return (
                  <div
                    key={notif._id}
                    className={`group relative p-5 flex gap-4 transition-all duration-200 
                    ${!notif.read ? "bg-blue-50/30" : "bg-white hover:bg-slate-50"}`}
                  >
                    {/* Indicateur Non lu */}
                    {!notif.read && (
                       <div className="absolute left-0 top-6 bottom-6 w-1 bg-blue-500 rounded-r-full"></div>
                    )}

                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorStyles(notif.color)}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex justify-between items-start">
                         <h3 
                            className={`text-sm ${!notif.read ? "font-bold text-slate-900" : "font-medium text-slate-700"}`}
                            onClick={() => !notif.read && markAsRead(notif._id)} // Marquer lu au clic titre
                         >
                            {notif.title}
                         </h3>
                         <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                            {formatDate(notif.createdAt)}
                         </span>
                      </div>
                      
                      <p className={`text-sm mt-1 leading-relaxed ${!notif.read ? "text-slate-700" : "text-slate-500"}`}>
                        {notif.message}
                      </p>

                      {notif.link && (
                        <Link
                          href={notif.link}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 mt-3 inline-flex items-center gap-1"
                        >
                          Voir le détail <ArrowLeft className="w-3 h-3 rotate-180" />
                        </Link>
                      )}
                    </div>

                    {/* Delete Action (Visible au hover) */}
                    <button
                      onClick={(e) => deleteNotification(notif._id, e)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}