"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight } from "lucide-react";

// AI-generated coconut plantation — local static image
const IMPACT_IMAGE = "/images/hero-plantation.png";

export function EnvironmentalImpact() {
  const [count, setCount] = useState(0);
  const [targetWaste, setTargetWaste] = useState(12450);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });

  // Pull the real figure from the database when available
  useEffect(() => {
    fetch("/api/impact")
      .then((res) => res.json())
      .then((json) => {
        if (json?.success && json?.data?.total_waste_diverted) {
          setTargetWaste(Math.round(json.data.total_waste_diverted));
        }
      })
      .catch(() => {
        // Fallback demo value is used
      });
  }, []);

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const duration = 2500; // 2.5 seconds
    const increment = targetWaste / (duration / 16); // 60fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetWaste) {
        setCount(targetWaste);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [inView, targetWaste]);

  return (
    <section
      id="impact"
      className="relative py-24 bg-white overflow-hidden border-t border-b border-forest-100/40"
      aria-label="Dampak lingkungan Nyiur Nanggroe"
    >
      <div className="container-base relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Text & Counter */}
          <div className="lg:col-span-7 flex flex-col items-start text-left" ref={ref}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-50 border border-forest-200 text-forest-700 text-xs font-semibold uppercase mb-6">
              Dampak Lingkungan
            </div>

            <h2 className="text-3xl md:text-5xl font-display font-bold text-forest-700 mb-6 leading-tight text-balance">
              Setiap Transaksi Mengurangi Limbah Kelapa
            </h2>

            <div className="text-6xl md:text-8xl font-display font-extrabold text-[#6B7C3D] mb-6 drop-shadow-sm tracking-tight">
              {count.toLocaleString("id-ID")}
              <span className="text-3xl md:text-5xl text-[#C68642] ml-2">kg+</span>
            </div>

            <p className="text-charcoal-500 text-base md:text-lg leading-relaxed mb-8">
              Bersama, kita telah mengalihkan ratusan ton limbah sabut dan tempurung kelapa dari tempat pembuangan akhir di Aceh, lalu mengolahnya kembali menjadi media tanam cocopeat dan briket kelapa ekspor berkualitas tinggi.
            </p>

            <a
              href="/dampak"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-forest-600 text-forest-600 font-semibold text-sm hover:bg-forest-50 active:scale-[0.98] transition-all"
            >
              Lihat Rincian Dampak
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>

          {/* Right: High-quality photograph of real farmer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 relative w-full h-[300px] sm:h-[400px] rounded-3xl overflow-hidden shadow-sm"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={IMPACT_IMAGE}
              alt="Petani Kelapa Aceh"
              className="w-full h-full object-cover object-center"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
