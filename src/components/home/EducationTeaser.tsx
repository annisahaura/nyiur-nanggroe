"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Clock,
  TreePine,
  Globe,
  Sprout,
  Sparkles,
  Target,
  FileText,
  Users,
} from "lucide-react";

const ARTICLES = [
  {
    id: "1",
    title: "Panduan Lengkap Budidaya Kelapa untuk UMKM Pemula",
    excerpt:
      "Dari pemilihan bibit hingga panen pertama — panduan komprehensif untuk memulai bisnis kelapa yang menguntungkan.",
    category: "Panduan UMKM",
    categoryColor: "text-forest-600 bg-forest-50 border-forest-200",
    readTime: 12,
    href: "/edukasi/panduan-budidaya-kelapa",
    icon: TreePine,
    isNew: false,
  },
  {
    id: "2",
    title: "Mengapa Briket Kelapa Indonesia Diminati Pasar Eropa?",
    excerpt:
      "Analisis mendalam tentang tren ekspor briket kelapa dan bagaimana UMKM Aceh bisa masuk ke pasar internasional.",
    category: "Ekspor & Pasar",
    categoryColor: "text-amber-700 bg-amber-50 border-amber-200",
    readTime: 8,
    href: "/edukasi/ekspor-briket-kelapa",
    icon: Globe,
    isNew: true,
  },
  {
    id: "3",
    title: "Cocopeat: Revolusi Media Tanam dari Limbah Kelapa",
    excerpt:
      "Cocopeat bukan hanya pengganti tanah biasa — ia adalah solusi pertanian modern yang ramah lingkungan dan menguntungkan.",
    category: "Lingkungan",
    categoryColor: "text-moss-700 bg-moss-50 border-moss-200",
    readTime: 6,
    href: "/edukasi/cocopeat-revolusi-media-tanam",
    icon: Sprout,
    isNew: false,
  },
];

const QUIZ_PREVIEW = {
  title: "Seberapa Paham Kamu tentang Kelapa?",
  questions: 10,
  participants: 2840,
  difficulty: "Mudah-Sedang",
  href: "/edukasi/kuis",
};

export function EducationTeaser() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="section-padding bg-cream"
      aria-label="Edukasi Nyiur Nanggroe"
    >
      <div className="container-base">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold tracking-wide uppercase mb-3">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
              Pusat Edukasi Kelapa
            </div>
            <h2 className="font-display text-display-md font-bold text-charcoal-800 leading-tight">
              Belajar dari{" "}
              <span className="text-gradient-forest">Para Ahlinya</span>
            </h2>
            <p className="text-charcoal-500 text-base mt-2 max-w-lg">
              Dari cara bertani hingga strategi ekspor. Platform kami memberikan
              pengetahuan yang membantu bisnismu berkembang.
            </p>
          </div>
          <Link
            href="/edukasi"
            className="group flex items-center gap-2 text-forest-600 font-semibold text-sm hover:text-forest-700 transition-colors flex-shrink-0"
          >
            Semua Artikel
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Articles */}
          <div className="lg:col-span-2 space-y-4">
            {ARTICLES.map((article, index) => {
              const Icon = article.icon;
              return (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.12 }}
                >
                  <Link
                    href={article.href}
                    className="group flex gap-4 p-4 md:p-5 rounded-2xl border border-border/60 bg-white hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {/* Icon Container */}
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-mist flex items-center justify-center flex-shrink-0 text-charcoal-700 group-hover:scale-105 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-forest-600" aria-hidden="true" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full border ${article.categoryColor}`}
                        >
                          {article.category}
                        </span>
                        {article.isNew && (
                          <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-forest-50 border border-forest-200 text-forest-600">
                            <Sparkles className="w-3 h-3 text-forest-500" aria-hidden="true" />
                            Baru
                          </span>
                        )}
                      </div>

                      <h3 className="font-semibold text-charcoal-800 text-sm md:text-base leading-snug mb-1.5 group-hover:text-forest-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>

                      <p className="text-charcoal-500 text-xs leading-relaxed line-clamp-2 mb-3">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center gap-1.5 text-charcoal-400 text-xs">
                        <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                        {article.readTime} menit baca
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-charcoal-300 group-hover:text-forest-500 group-hover:translate-x-1 flex-shrink-0 self-start mt-1 transition-all duration-200" />
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Quiz Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            {/* Quiz Card */}
            <Link
              href={QUIZ_PREVIEW.href}
              className="group block p-6 rounded-2xl bg-gradient-to-br from-forest-600 to-leaf-500 text-white hover:shadow-glass-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-6 h-6 text-white" aria-hidden="true" />
              </div>

              <div className="flex items-center gap-1 text-xs font-medium text-forest-100 mb-2">
                <Target className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
                Kuis Pengetahuan
              </div>

              <h3 className="font-display font-bold text-lg mb-2 leading-tight">
                {QUIZ_PREVIEW.title}
              </h3>

              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-2 text-sm text-forest-100">
                  <FileText className="w-4 h-4 text-forest-200" aria-hidden="true" />
                  <span>{QUIZ_PREVIEW.questions} Pertanyaan</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-forest-100">
                  <Users className="w-4 h-4 text-forest-200" aria-hidden="true" />
                  <span>
                    {QUIZ_PREVIEW.participants.toLocaleString("id-ID")} peserta
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-forest-100">
                  <Target className="w-4 h-4 text-forest-200" aria-hidden="true" />
                  <span>{QUIZ_PREVIEW.difficulty}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm font-semibold">
                Mulai Kuis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* AI Recommend */}
            <div className="p-5 rounded-2xl border border-border/60 bg-white">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-amber-600" aria-hidden="true" />
                </div>
                <span className="text-sm font-semibold text-charcoal-800">
                  Direkomendasikan AI
                </span>
              </div>
              <p className="text-xs text-charcoal-500 leading-relaxed mb-3">
                Berdasarkan minat dan riwayat baca kamu, AI kami
                merekomendasikan materi tentang pengolahan cocopeat untuk
                ekspor.
              </p>
              <Link
                href="/edukasi?ai=1"
                className="text-xs text-forest-600 font-medium hover:text-forest-700 flex items-center gap-1"
              >
                Lihat rekomendasi
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
