"use client";

import { useState, useEffect } from "react";
import { Sparkles, TrendingUp, AlertCircle, Image as ImageIcon, FileText, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface InsightItem {
  title: string;
  description: string;
  type: "stok" | "promosi" | "saran_foto" | "optimasi_produk";
}

export function NyaiInsight() {
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Tampilkan wawasan awal berbasis data statistik mitra kelapa
    setInsights([
      {
        title: "Keterlibatan Produk Cocopeat Sangat Tinggi",
        description: "Produk Cocopeat Premium Anda mengalami peningkatan kunjungan sebesar 42% minggu ini. Pertimbangkan untuk memperpanjang durasi promosi produk.",
        type: "promosi",
      },
      {
        title: "Perbarui Foto Produk Briket Kelapa",
        description: "Pelanggan cenderung 3x lebih percaya pada produk kelapa yang memiliki foto dengan latar belakang bersih dan pencahayaan terang sesuai saran AI Quality Grading.",
        type: "saran_foto",
      },
      {
        title: "Stok Arang Tempurung Mulai Menipis",
        description: "Sisa persediaan arang tempurung kelapa Anda tersisa 4 unit. Segera lakukan pengisian stok ulang agar tidak kehilangan pesanan potensial.",
        type: "stok",
      },
    ]);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "stok":
        return <AlertCircle className="w-4 h-4 text-rose-500" />;
      case "promosi":
        return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      case "saran_foto":
        return <ImageIcon className="w-4 h-4 text-amber-500" />;
      default:
        return <FileText className="w-4 h-4 text-blue-500" />;
    }
  };

  const getBgClass = (type: string) => {
    switch (type) {
      case "stok":
        return "bg-rose-50 border-rose-100/50";
      case "promosi":
        return "bg-emerald-50 border-emerald-100/50";
      case "saran_foto":
        return "bg-amber-50 border-amber-100/50";
      default:
        return "bg-blue-50 border-blue-100/50";
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-border shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-charcoal flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Nyai Insight — Wawasan Bisnis AI
        </h3>
        <span className="text-[10px] bg-forest-50 border border-forest-100 text-forest-700 font-bold px-2 py-0.5 rounded-full">
          Real-time
        </span>
      </div>

      <div className="space-y-3">
        {insights.map((ins, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-4 rounded-2xl border flex gap-3.5 transition-all hover:shadow-sm ${getBgClass(ins.type)}`}
          >
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
              {getIcon(ins.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-extrabold text-charcoal-800">{ins.title}</h4>
              <p className="text-[11px] text-charcoal-600 mt-1 leading-relaxed">
                {ins.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="pt-2">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("nyiur:open-ai-chat"))}
          className="w-full py-2.5 bg-mist hover:bg-forest-50 border border-border hover:border-forest-200 text-forest-700 text-xs font-bold rounded-2xl transition-all flex items-center justify-center gap-1.5"
        >
          Diskusi Strategi dengan Nyai Nyiur
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
