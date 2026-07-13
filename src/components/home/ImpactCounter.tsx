"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { Leaf, Zap, Users, TreePine, TreeDeciduous } from "lucide-react";

interface CounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

function AnimatedCounter({
  end,
  duration = 2.2,
  prefix = "",
  suffix = "",
  decimals = 0,
}: CounterProps) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
  const startTimeRef = useRef<number | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!inView) return;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min(
        (timestamp - startTimeRef.current) / (duration * 1000),
        1
      );

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * end;

      setCount(parseFloat(current.toFixed(decimals)));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [inView, end, duration, decimals]);

  return (
    <span ref={ref} className="counter-number">
      {prefix}
      {decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString("id-ID")}
      {suffix}
    </span>
  );
}

const STATS = [
  {
    icon: Leaf,
    value: 12400,
    suffix: " kg",
    label: "Limbah Kelapa Dihemat",
    description: "Total limbah kelapa yang diubah menjadi produk bernilai",
    color: "text-moss-500",
    bgColor: "bg-moss-50",
    borderColor: "border-moss-200",
  },
  {
    icon: Zap,
    value: 2450,
    suffix: "+",
    label: "Produk Aktif",
    description: "Produk turunan kelapa dari seluruh Aceh dan Indonesia",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  {
    icon: Users,
    value: 480,
    suffix: "+",
    label: "Mitra UMKM",
    description: "Pengusaha kelapa yang telah bergabung di platform",
    color: "text-forest-500",
    bgColor: "bg-forest-50",
    borderColor: "border-forest-200",
  },
  {
    icon: TreePine,
    value: 23100,
    suffix: " kg",
    label: "CO₂ Dihemat",
    description: "Emisi karbon yang berhasil dikurangi bersama",
    color: "text-leaf-500",
    bgColor: "bg-leaf-50",
    borderColor: "border-leaf-200",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as any },
  },
};

export function ImpactCounter() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section
      ref={ref}
      className="section-padding bg-[#F7F5F0] relative overflow-hidden"
      aria-label="Dampak lingkungan Nyiur Nanggroe"
    >
      {/* Subtle background decoration */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle at 30% 40%, #6B7C3D 1px, transparent 1px), radial-gradient(circle at 70% 60%, #6B7C3D 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="container-base relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-moss-50 border border-moss-200 text-moss-700 text-xs font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-moss-500 animate-pulse" />
            Dampak Nyata, Data Langsung
          </div>
          <h2 className="font-display text-display-md font-bold text-charcoal-800 mb-3">
            Setiap Transaksi{" "}
            <span className="text-gradient-forest">Memberi Dampak</span>
          </h2>
          <p className="text-charcoal-500 text-base max-w-xl mx-auto">
            Bersama-sama kita membuktikan bahwa bisnis yang baik bagi manusia
            juga baik bagi bumi.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className={`card-base p-6 group cursor-default border ${stat.borderColor}`}
            >
              <div
                className={`w-11 h-11 rounded-xl ${stat.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon className={`w-5 h-5 ${stat.color}`} aria-hidden="true" />
              </div>

              <div className={`font-display font-extrabold text-3xl ${stat.color} mb-1`}>
                <AnimatedCounter
                  end={stat.value}
                  suffix={stat.suffix}
                  decimals={0}
                />
              </div>

              <div className="font-semibold text-charcoal-800 text-sm mb-1.5">
                {stat.label}
              </div>

              <p className="text-charcoal-400 text-xs leading-relaxed">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CO2 trees equivalent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-forest-50 to-moss-50 border border-forest-100 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left"
        >
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-forest-100 flex items-center justify-center">
            <TreeDeciduous className="w-6 h-6 text-forest-600" aria-hidden="true" />
          </div>
          <div>
            <p className="font-semibold text-forest-700 text-base">
              Setara dengan menanam{" "}
              <span className="text-moss-600 font-bold">1.050 pohon</span> per tahun
            </p>
            <p className="text-charcoal-400 text-sm mt-0.5">
              CO₂ yang dihemat melalui platform Nyiur Nanggroe setara dengan dampak
              1.050 pohon tumbuh selama satu tahun penuh.
            </p>
          </div>
          <div className="sm:ml-auto flex-shrink-0">
            <div className="px-4 py-2 rounded-xl bg-white border border-forest-200 text-forest-600 text-sm font-medium">
              Lihat Laporan →
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
