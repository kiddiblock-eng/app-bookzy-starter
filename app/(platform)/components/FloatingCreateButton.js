"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

export default function FloatingCreateButton() {
  return (
    <Link
      href="https://app.bookzy.io/dashboard/projets/nouveau"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center 
      w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl 
      transition-transform duration-200 ease-out active:scale-95"
    >
      <Plus className="w-6 h-6" />
    </Link>
  );
}