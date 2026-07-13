"use client";

import { motion } from "framer-motion";
import { Sparkles, RefreshCcw, Users } from "lucide-react";

const CARDS = [
  {
    icon: Sparkles,
    title: "Marketplace Bertenaga AI",
    description:
      "Membantu pengguna menemukan produk kelapa lebih cepat dan lebih tepat lewat teknologi kecerdasan buatan canggih.",
    color: "amber",
    image: "/images/product-vco.png",  // AI-generated: coconut oil products
  },
  {
    icon: RefreshCcw,
    title: "Ekonomi Sirkular",
    description:
      "Mengubah setiap bagian limbah kelapa menjadi peluang ekonomi nyata untuk UMKM dan koperasi lokal.",
    color: "moss",
    image: "/images/product-cocopeat.png",  // AI-generated: cocopeat (circular economy)
  },
  {
    icon: Users,
    title: "Memberdayakan Komunitas Lokal",
    description:
      "Menghubungkan petani, UMKM, koperasi, dan pembeli dari seluruh Indonesia dan mancanegara.",
    color: "forest",
    image: "/images/hero-plantation.png",  // AI-generated: coconut plantation community
  },
];

export function WhyNyiurNanggroe() {
  return (
    <section
      className="section-padding bg-white relative overflow-hidden"
      id="why-nyiur"
    >
      {/* Top edge gradient */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container-base relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-50 border border-forest-200 text-forest-700 text-xs font-semibold tracking-wide uppercase mb-5">
            Mengapa Kami
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-charcoal mb-5 leading-tight">
            Kenapa Nyiur Nanggroe?
          </h2>
          <p className="text-charcoal-400 text-lg leading-relaxed">
            Kami membangun masa depan industri kelapa lewat keberlanjutan,
            teknologi, dan dampak sosial nyata.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.55, delay: i * 0.15 }}
                className="group relative rounded-3xl overflow-hidden border border-border/50 bg-white shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-400"
              >
                {/* Top image strip */}
                <div className="relative h-40 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />

                  {/* Icon floating */}
                  <div
                    className={`absolute bottom-4 left-6 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border border-white/40
                    ${
                      card.color === "amber"
                        ? "bg-amber-400 text-white"
                        : card.color === "moss"
                        ? "bg-moss-500 text-white"
                        : "bg-forest-600 text-white"
                    }`}
                  >
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                </div>

                {/* Content */}
                <div className="px-7 pb-8 pt-3">
                  <h3 className="text-xl font-bold font-display text-charcoal mb-3 leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-charcoal-400 leading-relaxed text-[0.95rem]">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
