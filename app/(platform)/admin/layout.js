"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);

  // Tracking activité (toutes les 20s)
  useEffect(() => {
    const track = async () => {
      try {
        await fetch("/api/activity/track", { method: "POST", credentials: "include" });
      } catch (e) {}
    };
    track();
    const interval = setInterval(track, 20_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex w-full min-h-screen bg-neutral-50 text-neutral-900">
      <AdminSidebar open={open} setOpen={setOpen} />

      <div className="flex-1 flex flex-col min-h-screen lg:ml-[260px]">
        <AdminHeader onMenuClick={() => setOpen(true)} />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 overflow-y-auto overflow-x-hidden">
          <div className="max-w-[1500px] mx-auto">{children}</div>
        </main>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/30 lg:hidden z-40" onClick={() => setOpen(false)} />
      )}
    </div>
  );
}
