"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    if (saved === "dark") document.documentElement.classList.add("dark");
    if (saved === "light") document.documentElement.classList.remove("dark");
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);

  const toggle = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      setDark(false);
      localStorage.setItem("theme", "light");
    } else {
      html.classList.add("dark");
      setDark(true);
      localStorage.setItem("theme", "dark");
    }
  };

  if (!mounted) return null;
  return (
    <button onClick={toggle} className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800">
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
