"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShoppingBag, BookOpen, Sparkles, Leaf, ArrowLeft } from "lucide-react";

const STEPS = [
  {
    icon: Leaf,
    color: "bg-forest-50 border-forest-100 text-forest-600",
    title: "Selamat Datang di Nyiur Nanggroe",
    desc: "Platform sirkular ekonomi kelapa pertama di Aceh. Dari limbah nyiur menjadi nilai ekonomi tinggi untuk nanggroe.",
  },
  {
    icon: ShoppingBag,
    color: "bg-amber-50 border-amber-100 text-amber-600",
    title: "Marketplace Kelapa & UMKM",
    desc: "Beli dan jual produk olahan kelapa berkualitas tinggi: briket arang, kerajinan tempurung, cocopeat, dan minyak VCO murni langsung dari produsen lokal.",
  },
  {
    icon: BookOpen,
    color: "bg-blue-50 border-blue-100 text-blue-600",
    title: "Pusat Edukasi & Kuis Interaktif",
    desc: "Akses panduan UMKM, tips bertani kelapa, dan kuis edukatif untuk meningkatkan wawasan Anda sekaligus memantau kemajuan belajar.",
  },
  {
    icon: Sparkles,
    color: "bg-purple-50 border-purple-100 text-purple-600",
    title: "AI Nyai Nyiur & Jejak Dampak",
    desc: "Gunakan asisten AI Nyai Nyiur untuk optimasi bisnis serta lacak secara langsung kontribusi penyelamatan lingkungan dari setiap transaksi Anda.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push("/produk");
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const ActiveIcon = STEPS[currentStep].icon;

  return (
    <div className="bg-white/85 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8 flex flex-col justify-between min-h-[480px]">
      {/* Brand & Progress Bar */}
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <span className="text-xs font-bold text-charcoal-400 tracking-wider">
          ONBOARDING PENGGUNA ({currentStep + 1}/{STEPS.length})
        </span>
        <div className="flex items-center gap-1">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentStep ? "w-6 bg-forest-600" : "w-1.5 bg-charcoal-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Slide Content with AnimatePresence */}
      <div className="flex-1 flex flex-col justify-center py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-6 text-center"
          >
            <div className="flex justify-center">
              <div className={`w-20 h-20 rounded-2xl border flex items-center justify-center shadow-sm ${STEPS[currentStep].color}`}>
                <ActiveIcon className="w-10 h-10" />
              </div>
            </div>

            <div className="space-y-2.5">
              <h2 className="text-2xl font-display font-bold text-charcoal-800 leading-tight">
                {STEPS[currentStep].title}
              </h2>
              <p className="text-sm text-charcoal-500 max-w-sm mx-auto leading-relaxed">
                {STEPS[currentStep].desc}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-border/40">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className={`flex items-center gap-1.5 text-sm font-semibold transition-all ${
            currentStep === 0
              ? "opacity-0 pointer-events-none"
              : "text-charcoal-500 hover:text-charcoal-800"
          }`}
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>

        <button
          onClick={handleNext}
          className="btn-primary px-6 py-3.5 shadow-lg shadow-forest-600/10 hover:shadow-forest-600/20 active:scale-[0.98] transition-all"
        >
          {currentStep === STEPS.length - 1 ? "Mulai Jelajahi" : "Selanjutnya"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
