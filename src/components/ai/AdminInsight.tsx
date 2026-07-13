"use client";

import { useState, useEffect } from "react";
import { Sparkles, BarChart3, Search, TrendingUp, BookOpen, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function AdminInsight() {
  const [platformStats, setPlatformStats] = useState<any | null>(null);

  useEffect(() => {
    // Data statis analitik platform kelapa Nyiur Nanggroe
    setPlatformStats({
      popularSearches: [
        { query: "briket shisha", count: 245 },
        { query: "vco fermentasi", count: 189 },
        { query: "cocopeat basah", count: 154 },
        { query: "media tanam hidroponik", count: 120 },
      ],
      trendingProducts: [
        { name: "Briket Kelapa Premium Hexagonal", sales: 84 },
        { name: "Virgin Coconut Oil Organik 250ml", sales: 62 },
        { name: "Cocopeat Blok Low EC", sales: 48 },
      ],
      educationInsights: {
        totalQuizParticipants: 320,
        averagePassScore: 82,
        popularArticle: "Cara Mengolah Sabut Kelapa Menjadi Media Tanam",
      }
    });
  }, []);

  if (!platformStats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Popular Searches */}
      <div className="bg-white rounded-3xl p-6 border border-border shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-charcoal flex items-center gap-2">
          <Search className="w-4 h-4 text-forest-600" />
          Pencarian Populer (Marketplace)
        </h3>
        <div className="space-y-2.5">
          {platformStats.popularSearches.map((item: any, i: number) => (
            <div key={i} className="flex items-center justify-between text-xs p-3 bg-mist/40 rounded-2xl border border-border/40">
              <span className="font-semibold text-charcoal-700">"{item.query}"</span>
              <span className="text-charcoal-400 font-bold bg-white px-2 py-0.5 rounded-lg shadow-sm border border-border/50">
                {item.count} pencarian
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Products */}
      <div className="bg-white rounded-3xl p-6 border border-border shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-charcoal flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          Produk Paling Diminati (AI Trend)
        </h3>
        <div className="space-y-3">
          {platformStats.trendingProducts.map((item: any, i: number) => (
            <div key={i} className="flex items-center gap-3 text-xs">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-charcoal-800 truncate">{item.name}</p>
                <p className="text-[10px] text-charcoal-400 mt-0.5">{item.sales} transaksi sukses</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education Engagement */}
      <div className="bg-white rounded-3xl p-6 border border-border shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold text-charcoal flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-600" />
          Aktivitas Belajar & Kuis AI
        </h3>
        <div className="space-y-3 text-xs leading-relaxed text-charcoal-600">
          <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-2xl border border-blue-100/50">
            <span>Partisipan Kuis Lulus</span>
            <span className="font-extrabold text-blue-700">{platformStats.educationInsights.totalQuizParticipants} siswa</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-2xl border border-blue-100/50">
            <span>Rata-Rata Nilai</span>
            <span className="font-extrabold text-blue-700">{platformStats.educationInsights.averagePassScore}%</span>
          </div>
          <div className="p-3 bg-mist/40 rounded-2xl border border-border/40">
            <span className="text-[9px] text-charcoal-400 font-bold uppercase tracking-wider block">
              Artikel Paling Sering Dibaca
            </span>
            <span className="font-bold text-charcoal-700 mt-1 block truncate">
              {platformStats.educationInsights.popularArticle}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
