"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen, Sparkles, Award, ShieldCheck, Bookmark,
  Clock, ArrowRight, BrainCircuit, PlayCircle, Star, ThumbsUp, ChevronRight
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MOCK_ARTICLES, MOCK_QUIZ } from "@/lib/data/marketplace-data";
import { cn } from "@/lib/utils";

const PROGRESS = {
  completedArticles: 5,
  totalArticles: 12,
  learningPoints: 340,
  badges: [
    { title: "Sobat Nyiur", desc: "Mulai belajar tentang kelapa", icon: "🌱" },
    { title: "Circular Pioneer", desc: "Selesaikan 3 artikel circular", icon: "♻️" },
    { title: "Briket Master", desc: "Nilai kuis briket sempurna", icon: "🔥" },
  ],
};

// Komponen kecil yang membaca search params dan membuka chat AI jika ?ai=1
function OpenAIChatFromParams() {
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get("ai") === "1") {
      window.dispatchEvent(new Event("nyiur:open-ai-chat"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

export default function EducationHubPage() {
  const [category, setCategory] = useState("all");

  const filteredArticles = category === "all"
    ? MOCK_ARTICLES
    : MOCK_ARTICLES.filter((art) => art.category_slug === category);

  const featuredArticle = MOCK_ARTICLES.find((a) => a.is_featured);

  return (
    <>
      <Suspense fallback={null}><OpenAIChatFromParams /></Suspense>
      <Header />
      <main className="min-h-screen bg-cream pt-24 md:pt-28 pb-8">
        <div className="container-base">
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-forest-700 via-forest-600 to-moss rounded-3xl p-6 sm:p-10 text-white mb-10 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 w-64 h-64 pointer-events-none">
              <BookOpen className="w-full h-full" />
            </div>
            <div className="max-w-xl space-y-4 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Nyiur Learning Center
              </span>
              <h1 className="text-2xl sm:text-4xl font-display font-bold leading-tight">
                Pusat Inovasi & Edukasi Kelapa Indonesia
              </h1>
              <p className="text-white/80 text-sm">
                Pelajari cara mengoptimalkan pengolahan kelapa, sirkularitas limbah, dan bangun bisnis UMKM Anda menjadi go-internasional.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column: Progress & Gamification */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl border border-border/60 p-5 space-y-5">
                <h3 className="text-sm font-bold text-charcoal-800 pb-3 border-b border-border/40 flex items-center gap-2">
                  <BrainCircuit className="w-4.5 h-4.5 text-forest-600" /> Progress Belajar
                </h3>
                <div className="space-y-3.5">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-charcoal-700 mb-1">
                      <span>Topik Selesai</span>
                      <span>{PROGRESS.completedArticles}/{PROGRESS.totalArticles}</span>
                    </div>
                    <div className="h-2 bg-charcoal-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-forest-600 rounded-full"
                        style={{ width: `${(PROGRESS.completedArticles / PROGRESS.totalArticles) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-charcoal-500 font-medium">Learning Points</span>
                    <span className="font-bold text-forest-700 flex items-center gap-1">
                      ⭐ {PROGRESS.learningPoints} LP
                    </span>
                  </div>
                </div>
              </div>

              {/* Achievements Badges */}
              <div className="bg-white rounded-2xl border border-border/60 p-5 space-y-4">
                <h3 className="text-sm font-bold text-charcoal-800 pb-3 border-b border-border/40 flex items-center gap-2">
                  <Award className="w-4.5 h-4.5 text-forest-600" /> Lencana Prestasi
                </h3>
                <div className="space-y-3">
                  {PROGRESS.badges.map((badge, idx) => (
                    <div key={idx} className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-xl bg-mist flex items-center justify-center text-xl">
                        {badge.icon}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-charcoal-800">{badge.title}</p>
                        <p className="text-[10px] text-charcoal-400 mt-0.5">{badge.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly quiz card */}
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl border border-amber-600 p-5 text-white flex flex-col justify-between h-48">
                <div>
                  <h4 className="font-bold text-sm">Kuis Mingguan</h4>
                  <p className="text-xs text-white/80 mt-1 leading-normal">Ikuti kuis mingguan & uji pengetahuan kelapa circular Anda!</p>
                </div>
                <Link
                  href="/edukasi/kuis"
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-white text-amber-700 text-xs font-semibold hover:bg-cream transition-all shadow"
                >
                  Mulai Kuis <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: Articles hub */}
            <div className="lg:col-span-3 space-y-6">
              {/* Category Filter bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 border-b border-border/40 pb-4">
                {[
                  { id: "all", label: "Semua Topik" },
                  { id: "panduan-umkm", label: "Panduan UMKM" },
                  { id: "produk-kelapa", label: "Produk Kelapa" },
                  { id: "ekonomi-sirkular", label: "Ekonomi Sirkular" },
                  { id: "tips-pertanian", label: "Pertanian" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setCategory(tab.id)}
                    className={cn(
                      "px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors",
                      category === tab.id
                        ? "bg-forest-600 text-white"
                        : "bg-white border border-border text-charcoal-600 hover:bg-mist"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Featured article if category === all */}
              {category === "all" && featuredArticle && (
                <div className="bg-white rounded-3xl border border-border/60 overflow-hidden shadow-sm flex flex-col md:flex-row">
                  <div className="relative h-48 md:h-auto md:w-1/2 bg-mist flex-shrink-0">
                    <Image
                      src={featuredArticle.cover_image}
                      alt={featuredArticle.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="badge-new text-[10px] px-2 py-0.5">✦ Featured</span>
                      <h3 className="text-lg font-bold text-charcoal-800 leading-snug">
                        {featuredArticle.title}
                      </h3>
                      <p className="text-xs text-charcoal-500 line-clamp-3 leading-relaxed">
                        {featuredArticle.excerpt}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border/40 mt-4 text-[10px] sm:text-xs text-charcoal-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {featuredArticle.read_time} menit baca
                      </div>
                      <Link href={`/edukasi/artikel/${featuredArticle.slug}`} className="text-xs font-bold text-forest-600 hover:text-forest-500 flex items-center gap-0.5">
                        Baca Selengkapnya <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredArticles.map((art) => (
                  <div key={art.id} className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm flex flex-col justify-between">
                    <div className="relative h-40 bg-mist">
                      <Image
                        src={art.cover_image}
                        alt={art.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-forest-600 uppercase tracking-wide">
                          {art.category}
                        </span>
                        <h4 className="text-sm font-bold text-charcoal-800 leading-snug line-clamp-2">
                          {art.title}
                        </h4>
                        <p className="text-xs text-charcoal-500 line-clamp-2 leading-relaxed">
                          {art.excerpt}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-border/40 text-[10px] sm:text-xs text-charcoal-400 mt-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {art.read_time} min
                        </div>
                        <Link href={`/edukasi/artikel/${art.slug}`} className="text-xs font-bold text-forest-600 hover:text-forest-500 flex items-center gap-0.5">
                          Detail <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
