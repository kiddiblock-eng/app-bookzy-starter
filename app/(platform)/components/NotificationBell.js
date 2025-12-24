"use client";

import { useState, useEffect, useRef } from "react";
import {
  Bell,
  Sparkles,
  ShoppingCart,
  Info,
  AlertCircle,
  Megaphone,
  Check,
  X,
  Trash2,
  Inbox
} from "lucide-react";
import Link from "next/link";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // --- LOGIQUE API & SSE (INCHANGÉE, ELLE EST TOP) ---
  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications?limit=10", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const evtSource = new EventSource("/api/notifications/stream");
    evtSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!data) return;
        
        // Construction de la notif (Logique conservée)
        const newNotif = data.broadcast ? {
            _id: "broadcast-" + Date.now(),
            ...data,
            read: false,
            createdAt: new Date().toISOString(),
        } : data;

        if (data.broadcast || data._id) {
            setNotifications((prev) => [newNotif, ...prev]);
            setUnreadCount((prev) => prev + 1);
        }
      } catch (err) { console.log(err); }
    };
    return () => evtSource.close();
  }, []);

  const markAllAsRead = async () => {
    try {
      const res = await fetch("/api/notifications/mark-all-read", { method: "POST", credentials: "include" });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (err) { console.error(err); }
  };

  const handleToggleOpen = () => {
    setIsOpen((prev) => {
      if (!prev) markAllAsRead(); // Marquer comme lu à l'ouverture
      return !prev;
    });
  };

  const deleteNotification = async (id, e) => {
    e.stopPropagation(); // Empêcher le clic sur le lien
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: "DELETE", credentials: "include" });
      if (res.ok) {
        const notif = notifications.find((n) => n._id === id);
        setNotifications((prev) => prev.filter((n) => n._id !== id));
        if (!notif?.read) setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* BOUTON CLOCHE - Design plus discret */}
      <button
        onClick={handleToggleOpen}
        className={`relative p-2 rounded-lg transition-all duration-200 
        ${isOpen ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
      >
        <Bell className="w-5 h-5" strokeWidth={1.5} />
        
        {/* Badge : Rouge solide, pas de dégradé, petit et précis */}
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        )}
      </button>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <>
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200/50 z-50 animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
          
          {/* Header Simple (Blanc) */}
          <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Notifications</h3>
            {unreadCount > 0 && (
                <span className="text-[10px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full">
                    {unreadCount} nouvelles
                </span>
            )}
          </div>

          {/* Liste */}
          <div className="max-h-[380px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-12 px-6 text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                    <Inbox className="w-6 h-6 text-slate-300" strokeWidth={1.5} />
                </div>
                <p className="text-slate-900 font-medium text-sm">Tout est calme</p>
                <p className="text-slate-500 text-xs mt-1">Aucune notification pour le moment.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {notifications.map((notif) => (
                  <NotificationItem
                    key={notif._id}
                    notification={notif}
                    onDelete={(e) => deleteNotification(notif._id, e)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-slate-50 bg-slate-50/50">
            <Link
              href="/dashboard/notifications"
              onClick={() => setIsOpen(false)}
              className="block text-center py-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Voir tout l'historique
            </Link>
          </div>
        </div>
        </>
      )}
    </div>
  );
}

/* -------------------------------------------
  🔹 ITEM DE NOTIFICATION (REFAIT)
-------------------------------------------- */
function NotificationItem({ notification, onDelete }) {
  const { icon, color, title, message, read, createdAt, link } = notification;

  // Mapping Icônes
  const iconMap = {
    bell: Bell,
    "check-circle": Check,
    sparkles: Sparkles,
    "shopping-cart": ShoppingCart,
    info: Info,
    alert: AlertCircle,
    megaphone: Megaphone,
  };
  const IconComponent = iconMap[icon] || Bell;

  // Mapping Couleurs (VERSION FLAT : bg-couleur-50 + text-couleur-600)
  const colorStyles = {
    blue:   "bg-blue-50 text-blue-600",
    green:  "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
    red:    "bg-red-50 text-red-600",
  }[color] || "bg-slate-50 text-slate-600";

  const timeAgo = new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const Content = (
    <div className={`group relative p-4 flex gap-3 transition-colors duration-200 cursor-pointer 
      ${read ? "bg-white hover:bg-slate-50" : "bg-blue-50/30 hover:bg-blue-50/50"}`}
    >
      {/* Indicateur Non lu */}
      {!read && (
          <div className="absolute left-0 top-4 bottom-4 w-0.5 bg-blue-500 rounded-r-full"></div>
      )}

      {/* Icône */}
      <div className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center ${colorStyles}`}>
        <IconComponent className="w-4 h-4" />
      </div>

      {/* Texte */}
      <div className="flex-1 min-w-0 pr-6">
        <div className="flex justify-between items-baseline mb-0.5">
           <h4 className={`text-sm ${read ? "font-medium text-slate-700" : "font-bold text-slate-900"}`}>
             {title}
           </h4>
           <span className="text-[10px] text-slate-400 shrink-0 ml-2">{timeAgo}</span>
        </div>
        <p className={`text-xs leading-relaxed ${read ? "text-slate-500" : "text-slate-600"}`}>
            {message}
        </p>
      </div>

      {/* Bouton Supprimer (Visible au hover) */}
      <button
        onClick={onDelete}
        className="absolute right-2 top-2 p-1.5 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
        title="Supprimer"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );

  return link ? <Link href={link}>{Content}</Link> : <div>{Content}</div>;
}