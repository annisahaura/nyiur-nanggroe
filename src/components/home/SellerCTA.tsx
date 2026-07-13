"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  ArrowRight,
  Check,
  Store,
  TrendingUp,
  Globe,
  Shield,
  DollarSign,
  Package,
  Star,
} from "lucide-react";

const SELLER_BENEFITS = [
  { icon: Store, text: "Buka toko gratis dalam 10 menit" },
  { icon: TrendingUp, text: "AI Insight untuk optimalkan penjualan" },
  { icon: Globe, text: "Jangkau pembeli nasional & internasional" },
  { icon: Shield, text: "Pembayaran aman & terlindungi" },
];

const SELLER_STATS = [
  { value: "Rp 12,4Jt", label: "Rata-rata omset/bulan", icon: DollarSign },
  { value: "480+", label: "Mitra aktif", icon: Store },
  { value: "4.8/5", label: "Rating kepuasan penjual", icon: Star },
  { value: "23 kota", label: "Jangkauan pengiriman", icon: Package },
];

export function SellerCTA() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section
      ref={ref}
      className="section-padding bg-white"
      aria-label="Undangan bergabung sebagai Mitra Nyiur"
    >
      <div className="container-base">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="rounded-3xl overflow-hidden border border-forest-100 bg-[#F0F7F3]"
        >
          <div className="p-8 md:p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

              {/* Left: text & benefits */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-100 border border-forest-200 text-forest-700 text-xs font-semibold uppercase mb-6">
                  Program Mitra Nyiur
                </div>

                <h2 className="font-display text-3xl md:text-4xl font-bold text-forest-700 mb-4 leading-tight">
                  Jadikan Produk Kelapamu
                  <br />
                  <span className="text-[#C68642]">Dikenal Dunia</span>
                </h2>

                <p className="text-charcoal-500 text-base mb-8 leading-relaxed max-w-md">
                  Bergabunglah dengan 480+ UMKM yang telah mempercayakan
                  pertumbuhan bisnis mereka ke Nyiur Nanggroe. Gratis untuk
                  memulai, bayar hanya saat transaksi.
                </p>

                {/* Benefits */}
                <div className="space-y-3 mb-8">
                  {SELLER_BENEFITS.map((benefit) => (
                    <div key={benefit.text} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-forest-100 border border-forest-200 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 text-forest-600" aria-hidden="true" />
                      </div>
                      <span className="text-charcoal-600 text-sm">{benefit.text}</span>
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/daftar-mitra"
                    className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-forest-600 hover:bg-forest-500 text-white font-semibold text-sm shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                  >
                    Daftar Gratis Sekarang
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/daftar-mitra"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-forest-600 text-forest-700 font-medium text-sm hover:bg-forest-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                  >
                    Pelajari Lebih Lanjut
                  </Link>
                </div>
              </div>

              {/* Right: stat cards */}
              <div className="grid grid-cols-2 gap-4">
                {SELLER_STATS.map((stat) => {
                  const SIcon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="p-5 rounded-2xl bg-white border border-forest-100 shadow-sm"
                    >
                      <div className="w-9 h-9 rounded-lg bg-forest-50 border border-forest-100 flex items-center justify-center mb-3">
                        <SIcon className="w-5 h-5 text-forest-600" aria-hidden="true" />
                      </div>
                      <div className="font-display font-bold text-forest-700 text-xl mb-0.5">
                        {stat.value}
                      </div>
                      <div className="text-charcoal-400 text-xs">{stat.label}</div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
