"use client";

import { motion } from "framer-motion";
import { Search, Link as LinkIcon, ShoppingBag, Leaf, ArrowRight } from "lucide-react";
import Link from "next/link";

const STEPS = [
  {
    title: "Temukan",
    description: "Cari produk kelapa berkelanjutan lewat teks, kategori, atau AI Visual Search.",
    icon: Search,
    color: "amber"
  },
  {
    title: "Terhubung",
    description: "Terhubung langsung dengan petani lokal, koperasi, dan UMKM yang terverifikasi.",
    icon: LinkIcon,
    color: "forest"
  },
  {
    title: "Bertransaksi",
    description: "Pembayaran aman dan mudah, dengan logistik terintegrasi langsung ke depan pintu.",
    icon: ShoppingBag,
    color: "moss"
  },
  {
    title: "Berdampak",
    description: "Setiap pembelian mengurangi sampah dan memberdayakan ekonomi komunitas lokal.",
    icon: Leaf,
    color: "leaf"
  }
];

export function HowItWorks() {
  return (
    <section className="section-padding bg-white relative overflow-hidden" id="how-it-works">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container-base relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-50 border border-forest-200 text-forest-700 text-xs font-semibold tracking-wide uppercase mb-5">
            Cara Kerjanya
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-charcoal mb-4 leading-tight">
            Perjalanan dari Kebun ke Dampak
          </h2>
          <p className="text-charcoal-400 text-lg leading-relaxed">
            Perjalanan mudah dari menemukan produk berkelanjutan hingga menciptakan dampak nyata.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting Path */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-amber-200 via-forest-200 to-leaf-200 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className={`w-24 h-24 rounded-full bg-white shadow-xl shadow-${step.color}-900/5 flex items-center justify-center mb-6 relative z-10 border-4 border-cream group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className={`w-10 h-10 text-${step.color}-600`} />
                  </div>
                  <h3 className="text-xl font-bold font-display text-charcoal mb-3">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="text-charcoal-400 leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-20"
        >
          <Link href="/produk" className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-lg">
            Mulai Sekarang <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
