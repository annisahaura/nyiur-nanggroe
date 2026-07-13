"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console (or external services in production)
    console.error("[GLOBAL ERROR BOUNDARY]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-6 bg-white rounded-3xl p-8 shadow-xl border border-border/40">
        <div className="w-16 h-16 mx-auto flex items-center justify-center bg-red-50 text-red-500 rounded-full">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-display font-bold text-charcoal-800">
            Terjadi Kesalahan
          </h1>
          <p className="text-sm text-charcoal-400 leading-relaxed">
            Maaf atas ketidaknyamanannya. Terjadi kesalahan sistem yang tidak terduga. Tim kami telah menerima laporan ini.
          </p>
          {error.digest && (
            <p className="text-[10px] text-charcoal-300 font-mono bg-mist p-1 rounded">
              ID Error: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 bg-[#6B7C3D] hover:bg-[#566432] text-white"
          >
            <RotateCcw className="w-4 h-4" /> Coba Lagi
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Kembali ke Beranda
          </Button>
        </div>
      </div>
    </div>
  );
}
