import React from "react";
import Link from "next/link";
import { BackButton } from "@/components/ui/BackButton";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-800 via-forest-900 to-charcoal-900 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <BackButton />
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] aspect-square rounded-full bg-forest-700/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] aspect-square rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />

      {/* Header / Brand Logo */}
      <div className="flex justify-center z-10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-12 h-12 bg-cream/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 group-hover:scale-105 transition-all duration-300 overflow-hidden">
            <img src="/images/Logo-NyiurNanggroe.png" alt="Logo Nyiur Nanggroe" className="w-full h-full object-contain p-1" />
          </div>
          <div>
            <span className="font-display font-bold text-lg text-white leading-none block">
              Nyiur Nanggroe
            </span>
            <span className="text-[10px] font-medium text-white/60 tracking-wider">
              EKONOMI SIRKULAR KELAPA
            </span>
          </div>
        </Link>
      </div>

      {/* Main Form Card Container */}
      <div className="flex-1 flex items-center justify-center py-10 z-10">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-white/40 z-10">
        <p>© {new Date().getFullYear()} Nyiur Nanggroe. Dibuat dengan penuh rasa bangga di Aceh.</p>
        <div className="mt-2 space-x-4">
          <Link href="/syarat-ketentuan" className="hover:text-white/60 transition-colors">
            Ketentuan Layanan
          </Link>
          <span>•</span>
          <Link href="/privasi" className="hover:text-white/60 transition-colors">
            Kebijakan Privasi
          </Link>
        </div>
      </div>
    </div>
  );
}
