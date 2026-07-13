"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center">
      <div className="space-y-4 flex flex-col items-center">
        <Loader2 className="w-12 h-12 text-[#6B7C3D] animate-spin" />
        <div className="space-y-1">
          <p className="text-base font-semibold text-charcoal-700 font-display">
            Memuat Nyiur Nanggroe...
          </p>
          <p className="text-xs text-charcoal-400">
            Menghubungkan ekonomi sirkular kelapa untuk Anda.
          </p>
        </div>
      </div>
    </div>
  );
}
