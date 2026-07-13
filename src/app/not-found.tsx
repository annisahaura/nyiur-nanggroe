"use client";

import Link from "next/link";
import { ArrowLeft, Home, Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-6 bg-white rounded-3xl p-8 shadow-xl border border-border/40">
        {/* Animated Icon */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center bg-forest-50 text-forest-600 rounded-full animate-bounce">
          <span className="text-5xl font-extrabold">404</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-display font-bold text-charcoal-800">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-sm text-charcoal-400 leading-relaxed">
            Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan ke alamat lain.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Button>
          <Link href="/" className="w-full sm:w-auto">
            <Button className="w-full flex items-center justify-center gap-2 bg-[#6B7C3D] hover:bg-[#566432] text-white">
              <Home className="w-4 h-4" /> Beranda
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
