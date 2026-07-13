"use client";

import { useEffect, useState } from "react";

export function SkipToContent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-6 focus:py-3.5 focus:bg-[#6B7C3D] focus:text-white focus:font-bold focus:rounded-xl focus:shadow-xl focus:outline-none focus:ring-4 focus:ring-forest-300 transition-all"
    >
      Lompat ke Konten Utama
    </a>
  );
}
