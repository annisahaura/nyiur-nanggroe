"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Store,
  Sparkles,
  ArrowRight,
  Leaf,
  Users,
  TrendingUp,
} from "lucide-react";

const HERO_STATS = [
  { value: "480+", label: "Penjual Aktif", icon: Users },
  { value: "2.400+", label: "Produk", icon: ShoppingBag },
  { value: "12 Ton", label: "Karbon Terhemat", icon: Leaf },
  { value: "15k+", label: "Transaksi", icon: TrendingUp },
];

export function HeroSection() {
  const [searchVal, setSearchVal] = useState("");

  const triggerAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    // Dispatch custom event to open Nyai Nyiur and pass initial question
    const event = new CustomEvent("nyiur:open-ai-chat", {
      detail: { question: searchVal.trim() },
    });
    window.dispatchEvent(event);
    setSearchVal("");
  };

  return (
    <section className="relative w-full bg-[#FAF7F0] overflow-hidden" aria-label="Hero">
      {/* ── Slide Container (Height: 80vh to match Tesla look) ──────────────────── */}
      <div className="relative w-full min-h-[82vh] md:min-h-[88vh] bg-charcoal-900 overflow-hidden flex flex-col justify-between">
        
        {/* Full-bleed Background Image */}
        <div className="absolute inset-0 pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero-plantation.png"
            alt="Perkebunan Kelapa di Aceh"
            className="w-full h-full object-cover object-center"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/45" />
        </div>

        {/* Center-aligned Hero Text & Actions */}
        <div className="relative z-10 w-full max-w-4xl mx-auto text-center px-6 pt-36 md:pt-40 flex-1 flex flex-col justify-center items-center">
          
          {/* Eyebrow Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold tracking-wide uppercase mb-6"
          >
            <Leaf className="w-3.5 h-3.5 text-moss-300" aria-hidden="true" />
            Ekonomi Sirkular Kelapa · Aceh
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tight drop-shadow-lg mb-6 max-w-3xl"
          >
            Dari Sisa Nyiur <br />
            <span className="text-[#E5B57A] drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
              Menjadi Nilai
            </span>{" "}
            untuk Nanggroe.
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/90 text-sm sm:text-base md:text-lg max-w-2xl mb-10 leading-relaxed font-light drop-shadow-sm"
          >
            Memberdayakan ekosistem kelapa Aceh lewat marketplace bertenaga AI, edukasi, dan inovasi ekonomi sirkular yang ramah lingkungan.
          </motion.p>

          {/* Side-by-side Cta Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md px-4 mb-12 md:mb-16"
          >
            <Link
              href="/produk"
              className="w-full sm:w-1/2 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#6B7C3D] hover:bg-[#566432] text-white font-semibold text-sm transition-all duration-200 shadow-md active:scale-98"
            >
              <ShoppingBag className="w-4 h-4" />
              Jelajahi Produk
            </Link>
            <Link
              href="/daftar-mitra"
              className="w-full sm:w-1/2 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/30 font-semibold text-sm transition-all duration-200 shadow-md active:scale-98"
            >
              <Store className="w-4 h-4" />
              Gabung Mitra
            </Link>
          </motion.div>
        </div>

        {/* Bottom Overlay Stats (Centered, semi-transparent panel) */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 px-6 rounded-3xl bg-black/20 backdrop-blur-sm border border-white/5"
          >
            {HERO_STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1.5 text-white mb-0.5">
                    <Icon className="w-4 h-4 text-moss-300" />
                    <span className="font-display font-bold text-lg sm:text-xl md:text-2xl text-white">
                      {stat.value}
                    </span>
                  </div>
                  <span className="text-white/70 text-[10px] sm:text-xs font-medium tracking-wide uppercase">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </motion.div>
        </div>

      </div>

      {/* ── Tesla-style Bottom Interactive Action Bar (Width: full) ──────────────── */}
      <div className="bg-white border-b border-border py-4 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Ask AI Input Field */}
          <form
            onSubmit={triggerAI}
            className="w-full md:max-w-xl flex items-center gap-2 bg-[#FAF7F0] border border-border/80 rounded-full px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#6B7C3D]/20 focus-within:border-[#6B7C3D] transition-all"
          >
            <Sparkles className="w-4 h-4 text-[#6B7C3D] flex-shrink-0 animate-pulse" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Tanya AI: 'Bagaimana olah limbah kelapa?'"
              className="flex-1 bg-transparent text-xs sm:text-sm text-charcoal outline-none placeholder:text-charcoal-300 font-medium"
            />
            <button
              type="submit"
              className="px-4 py-1.5 rounded-full bg-[#6B7C3D] hover:bg-[#566432] text-white text-[11px] sm:text-xs font-semibold transition-all active:scale-95 flex items-center gap-1"
            >
              Kirim <ArrowRight className="w-3 h-3" />
            </button>
          </form>

          {/* Become Seller CTA Button */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <Link
              href="/daftar-mitra"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-forest-50/50 text-charcoal-700 hover:text-[#6B7C3D] border border-border font-bold text-xs sm:text-sm transition-all active:scale-98 shadow-sm"
            >
              <Store className="w-4 h-4" />
              Mulai Jualan di Nyiur
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
