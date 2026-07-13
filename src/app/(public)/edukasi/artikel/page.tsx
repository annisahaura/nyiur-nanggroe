"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Eye, BookOpen } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MOCK_ARTICLES } from "@/lib/data/marketplace-data";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { label: "Semua", slug: "all" },
  ...Array.from(
    new Map(
      MOCK_ARTICLES.map((a) => [a.category_slug, { label: a.category, slug: a.category_slug }])
    ).values()
  ),
];

function ArtikelListContent() {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState(searchParams.get("kategori") ?? "all");

  // Keep in sync if the URL changes (e.g. navigating here from a link with
  // a different ?kategori= while already on this page).
  useEffect(() => {
    setCategory(searchParams.get("kategori") ?? "all");
  }, [searchParams]);

  const articles =
    category === "all"
      ? MOCK_ARTICLES
      : MOCK_ARTICLES.filter((a) => a.category_slug === category);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-24 md:pt-28 pb-8">
        <div className="container-base max-w-5xl">
          <Link
            href="/edukasi"
            className="inline-flex items-center gap-1 text-sm text-charcoal-500 hover:text-forest-600 font-medium mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Edukasi
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-forest-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-charcoal-800">
              Semua Artikel
            </h1>
          </div>
          <p className="text-charcoal-500 mb-8">
            Kumpulan artikel seputar kelapa, ekonomi sirkular, dan tips UMKM.
          </p>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map((c) => (
              <button
                key={c.slug}
                onClick={() => setCategory(c.slug)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  category === c.slug
                    ? "bg-forest-600 text-cream"
                    : "bg-white border border-border text-charcoal-600 hover:bg-forest-50 hover:text-forest-600"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Article grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link href={`/edukasi/artikel/${article.slug}`} className="group card-base flex flex-col overflow-hidden h-full">
                  <div className="relative h-40 w-full">
                    <Image
                      src={article.cover_image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 text-forest-700 text-[11px] font-semibold">
                      {article.category}
                    </span>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-charcoal-800 leading-snug mb-2 group-hover:text-forest-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-charcoal-500 line-clamp-2 mb-4 flex-1">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-charcoal-400 pt-3 border-t border-border/60">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {article.read_time} menit
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> {article.view_count.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {articles.length === 0 && (
            <p className="text-center text-charcoal-400 py-16">
              Belum ada artikel di kategori ini.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ArtikelListPage() {
  return (
    <Suspense fallback={null}>
      <ArtikelListContent />
    </Suspense>
  );
}
