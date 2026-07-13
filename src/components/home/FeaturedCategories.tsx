"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight, Flame, Leaf, Palette, Droplets, Coffee, Waves, RecycleIcon } from "lucide-react";

const CATEGORIES = [
  {
    id: "arang",
    name: "Arang & Briket",
    name_en: "Charcoal & Briquette",
    description: "Briket BBQ, arang aktif, karbon industri",
    href: "/produk?kategori=arang",
    icon: Flame,
    count: "180+ produk",
    color: "from-charcoal-700 to-charcoal-500",
    lightColor: "from-charcoal-50 to-charcoal-100",
    textColor: "text-charcoal-700",
    borderColor: "border-charcoal-200",
    iconBg: "bg-charcoal-100 text-charcoal-600",
    badge: "Unggulan",
    badgeColor: "bg-charcoal-100 text-charcoal-600",
  },
  {
    id: "sabut",
    name: "Sabut & Cocopeat",
    name_en: "Coir & Cocopeat",
    description: "Media tanam, keset, tali, geotekstil",
    href: "/produk?kategori=sabut",
    icon: Leaf,
    count: "210+ produk",
    color: "from-forest-700 to-leaf-500",
    lightColor: "from-forest-50 to-moss-50",
    textColor: "text-forest-700",
    borderColor: "border-forest-200",
    iconBg: "bg-forest-100 text-forest-600",
    badge: "Ekspor",
    badgeColor: "bg-forest-100 text-forest-700",
  },
  {
    id: "kerajinan",
    name: "Kerajinan Tangan",
    name_en: "Handicrafts",
    description: "Souvenir, aksesoris, dekorasi rumah",
    href: "/produk?kategori=kerajinan",
    icon: Palette,
    count: "460+ produk",
    color: "from-rose-700 to-rose-500",
    lightColor: "from-rose-50 to-pink-50",
    textColor: "text-rose-700",
    borderColor: "border-rose-200",
    iconBg: "bg-rose-100 text-rose-600",
    badge: "Artisan",
    badgeColor: "bg-rose-100 text-rose-600",
  },
  {
    id: "minyak",
    name: "Minyak Kelapa",
    name_en: "Coconut Oil",
    description: "VCO, minyak goreng premium, kosmetik",
    href: "/produk?kategori=minyak",
    icon: Droplets,
    count: "290+ produk",
    color: "from-yellow-600 to-amber-400",
    lightColor: "from-yellow-50 to-amber-50",
    textColor: "text-yellow-700",
    borderColor: "border-yellow-200",
    iconBg: "bg-yellow-100 text-yellow-700",
    badge: "Organik",
    badgeColor: "bg-yellow-100 text-yellow-700",
  },
  {
    id: "tempurung",
    name: "Tempurung Kelapa",
    name_en: "Coconut Shell",
    description: "Kerajinan, arang aktif, bahan baku industri",
    href: "/produk?kategori=tempurung",
    icon: Coffee,
    count: "340+ produk",
    color: "from-amber-800 to-amber-600",
    lightColor: "from-amber-50 to-amber-100",
    textColor: "text-amber-800",
    borderColor: "border-amber-200",
    iconBg: "bg-amber-100 text-amber-700",
    badge: "Terlaris",
    badgeColor: "bg-amber-100 text-amber-700",
  },
  {
    id: "air-kelapa",
    name: "Air & Nata de Coco",
    name_en: "Coconut Water",
    description: "Minuman segar, nata de coco, coconut water",
    href: "/produk?kategori=air-kelapa",
    icon: Waves,
    count: "125+ produk",
    color: "from-cyan-600 to-teal-400",
    lightColor: "from-cyan-50 to-teal-50",
    textColor: "text-cyan-700",
    borderColor: "border-cyan-200",
    iconBg: "bg-cyan-100 text-cyan-600",
    badge: "Segar",
    badgeColor: "bg-cyan-100 text-cyan-700",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: "easeOut" as any },
  },
};

export function FeaturedCategories() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      className="section-padding bg-[#F7F5F0]"
      aria-label="Kategori produk kelapa"
      ref={ref}
    >
      <div className="container-base">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-50 border border-forest-200 text-forest-700 text-xs font-semibold tracking-wide uppercase mb-4">
              Kategori Utama
            </div>
            <h2 className="font-display text-display-md font-bold text-charcoal-800 leading-tight">
              Semua Bagian Kelapa
              <br />
              <span className="text-gradient-forest">Punya Nilainya</span>
            </h2>
            <p className="text-charcoal-500 text-base mt-3 max-w-lg">
              Dari kulit hingga air, kami menghadirkan produk turunan kelapa
              terlengkap untuk kebutuhan personal, bisnis, dan industri.
            </p>
          </div>
          <Link
            href="/produk"
            className="group flex items-center gap-2 text-forest-600 font-semibold text-sm hover:text-forest-700 transition-colors flex-shrink-0"
          >
            Lihat Semua Produk
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <motion.div key={cat.id} variants={itemVariants}>
                <Link
                  href={cat.href}
                  className={`category-card block h-full bg-gradient-to-br ${cat.lightColor} border ${cat.borderColor} rounded-2xl p-5 hover:shadow-card-hover transition-all duration-300 group`}
                  aria-label={`${cat.name} — ${cat.count}`}
                >
                  {/* Badge & Icon Row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.iconBg}`}>
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${cat.badgeColor}`}
                    >
                      {cat.badge}
                    </span>
                  </div>

                  {/* Content */}
                  <h3
                    className={`font-display font-bold text-sm ${cat.textColor} mb-1 leading-tight`}
                  >
                    {cat.name}
                  </h3>
                  <p className="text-charcoal-400 text-xs leading-snug mb-3 line-clamp-2">
                    {cat.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-charcoal-400 text-xs">{cat.count}</span>
                    <ArrowRight
                      className={`w-4 h-4 ${cat.textColor} opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200`}
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Circular Economy Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 p-6 md:p-8 rounded-3xl bg-gradient-to-r from-forest-600 to-leaf-500 text-white relative overflow-hidden acehnese-pattern acehnese-pattern-light"
        >
          {/* dot pattern */}
          <div className="absolute inset-0 opacity-[0.07]">
            <div
              className="w-full h-full"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.8) 1px, transparent 1px), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.8) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
          </div>
          <div className="relative flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                <RecycleIcon className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl md:text-2xl mb-1.5">
                  Ekonomi Sirkular Kelapa
                </h3>
                <p className="text-white/70 text-sm max-w-md leading-relaxed">
                  Di Nyiur Nanggroe, tidak ada yang terbuang. Setiap bagian kelapa
                  — dari buah, sabut, tempurung, hingga airnya — dimanfaatkan
                  secara maksimal oleh ekosistem UMKM kami.
                </p>
              </div>
            </div>
            <Link
              href="/dampak"
              className="flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-forest-700 font-semibold text-sm hover:bg-cream shadow-lg active:scale-[0.98] transition-all"
            >
              Pelajari Dampak
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
