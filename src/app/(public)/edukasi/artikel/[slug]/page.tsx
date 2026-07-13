"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft, Clock, Calendar, User, Eye, Bookmark, Share2,
  ThumbsUp, BookOpen, ChevronRight, Award, MessageCircle
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MOCK_ARTICLES } from "@/lib/data/marketplace-data";

import { use } from "react";

export default function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const article = MOCK_ARTICLES.find((a) => a.slug === resolvedParams.slug);
  if (!article) notFound();

  // Simulating typical content paragraphs for clean reading view
  const paragraphs = [
    `Kelapa merupakan salah satu komoditas perkebunan terbesar di Indonesia yang memiliki peran strategis dalam menopang ekonomi pedesaan. Di Aceh sendiri, potensi kelapa tersebar luas hampir di seluruh kabupaten, namun pemanfaatannya masih terbatas pada penjualan buah mentah atau kopra tradisional. Melalui konsep ekonomi sirkular (circular economy), kita dapat mendiversifikasi seluruh bagian kelapa menjadi produk bernilai tambah tinggi yang ramah lingkungan.`,
    `Dalam siklus ekonomi sirkular, limbah yang dihasilkan dari satu proses diolah menjadi bahan baku untuk proses lainnya. Sebagai contoh, tempurung kelapa yang biasanya dibuang dan dibakar secara terbuka dapat dikarbonisasi menjadi arang aktif (activated carbon) berkualitas premium untuk keperluan filtrasi industri dan farmasi. Alternatif lainnya adalah mengolah tempurung tersebut menjadi briket arang kelapa yang memiliki pasar ekspor sangat besar di Timur Tengah, Eropa, dan Amerika Serikat.`,
    `Selain tempurung, sabut kelapa yang merupakan 35% dari total bobot buah kelapa juga memiliki potensi ekonomi yang besar. Sabut kelapa dapat dipisahkan seratnya menjadi coir fiber dan serbuk halusnya menjadi cocopeat. Coir fiber banyak digunakan sebagai bahan baku kasur alami, peredam suara, dan matras otomotif premium, sedangkan cocopeat sangat populer sebagai media tanam hidroponik karena kemampuannya dalam menahan air yang luar biasa.`,
    `Melalui pendampingan UMKM dan standardisasi teknologi tepat guna, para petani kelapa lokal dapat naik kelas menjadi produsen produk olahan premium. Nyiur Nanggroe berkomitmen penuh menjadi wadah penghubung teknologi, akses permodalan, dan pasar internasional untuk mewujudkan circular economy kelapa yang mandiri dan berkelanjutan.`,
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-24 md:pt-28 pb-8">
        <div className="container-base max-w-3xl">
          <div className="mb-6 flex justify-between items-center">
            <Link href="/edukasi" className="flex items-center gap-1 text-sm text-charcoal-500 hover:text-forest-600 font-medium">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Edukasi
            </Link>
            <button className="p-2 rounded-xl border border-border bg-white text-charcoal-400 hover:text-forest-600 transition-colors">
              <Bookmark className="w-4 h-4" />
            </button>
          </div>

          {/* Article Header Card */}
          <div className="bg-white rounded-3xl border border-border/60 overflow-hidden shadow-sm p-6 sm:p-8 space-y-6">
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full bg-forest-50 border border-forest-100 text-forest-700 text-xs font-semibold">
                {article.category}
              </span>
              <h1 className="text-xl sm:text-3xl font-display font-bold text-charcoal-800 leading-snug">
                {article.title}
              </h1>

              {/* Meta information */}
              <div className="flex items-center gap-4 flex-wrap text-xs text-charcoal-400 pt-1.5">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> {article.author_name}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {new Date(article.published_at).toLocaleDateString("id-ID")}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {article.read_time} menit baca
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> {article.view_count.toLocaleString("id-ID")} pembaca
                </span>
              </div>
            </div>

            {/* Cover Image */}
            <div className="relative h-48 sm:h-72 rounded-2xl overflow-hidden bg-mist">
              <Image
                src={article.cover_image}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Content body */}
            <div className="prose prose-sm sm:prose max-w-none text-charcoal-700 leading-relaxed space-y-4">
              {paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Share & Feedback Actions */}
            <div className="border-t border-border/40 pt-5 flex items-center justify-between text-xs sm:text-sm text-charcoal-500">
              <button className="flex items-center gap-1.5 hover:text-forest-600 transition-colors">
                <ThumbsUp className="w-4 h-4" /> Bermanfaat (128)
              </button>
              <button className="flex items-center gap-1.5 hover:text-forest-600 transition-colors">
                <Share2 className="w-4 h-4" /> Bagikan Artikel
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
