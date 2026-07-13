"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();
  
  return (
    <button 
      onClick={() => router.back()} 
      className="fixed top-4 left-4 md:top-8 md:left-8 z-[55] flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full transition-all text-sm font-medium shadow-lg hover:scale-105"
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="hidden sm:inline">Kembali</span>
    </button>
  );
}
