"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight, ShoppingBag, Store } from "lucide-react";
import Link from "next/link";

// AI-generated — local static image
const CTA_IMAGE = "/images/hero-plantation.png";


export function CallToAction() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <section
      id="cta"
      ref={ref}
      className="py-24 bg-[#FAF7F0] border-t border-forest-100/40"
      aria-label="Bergabung dengan Nyiur Nanggroe"
    >
      <div className="container-base">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left: photograph */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 relative h-[300px] sm:h-[420px] rounded-3xl overflow-hidden shadow-sm"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={CTA_IMAGE}
              alt="Produksi kelapa Aceh"
              className="w-full h-full object-cover object-center"
            />
            {/* Very soft warm vignette – no dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#6B7C3D]/10 to-transparent pointer-events-none" />
          </motion.div>

          {/* Right: text & buttons */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-50 border border-forest-200 text-forest-700 text-xs font-semibold uppercase mb-6">
              Mulai Sekarang
            </div>

            <h2 className="text-3xl md:text-5xl font-display font-bold text-forest-700 leading-tight mb-5 text-balance">
              Siap Bergabung dengan Revolusi Industri Kelapa?
            </h2>

            <p className="text-charcoal-500 text-base md:text-lg leading-relaxed mb-10 max-w-lg">
              Bergabunglah dengan ribuan pembeli dan penjual yang sudah menjadi
              bagian dari ekosistem ekonomi sirkular kelapa Aceh yang berkelanjutan.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4 mb-8">
              <Link
                href="/daftar-mitra"
                className="group inline-flex items-center gap-2.5 px-8 py-4 bg-forest-600 hover:bg-forest-500 text-white rounded-xl font-semibold text-sm shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <Store className="w-4 h-4" aria-hidden="true" />
                Mulai Berjualan
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/produk"
                className="group inline-flex items-center gap-2.5 px-8 py-4 bg-white border border-forest-600 text-forest-700 rounded-xl font-semibold text-sm hover:bg-forest-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                Mulai Belanja
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <p className="text-charcoal-400 text-sm">
              Gratis bergabung &middot; Bayar hanya saat transaksi &middot; 480+ Mitra aktif
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
