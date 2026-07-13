"use client";

import { useState } from "react";
import AdminLayout from "../layout";
import { Search, Plus, Trash2, Edit3, BookOpen, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock articles database for admin controls
const INITIAL_ARTICLES = [
  { id: "art-1", title: "Mengolah Sabut Kelapa Menjadi Media Tanam Organik", category: "circular_economy", readTime: 5, status: "published" },
  { id: "art-2", title: "Panduan Lengkap Ekspor Briket Arang Kelapa untuk UMKM", category: "business_guide", readTime: 8, status: "published" },
  { id: "art-3", title: "Cara Tepat Menghasilkan Minyak Kelapa (VCO) Berkualitas Ekspor", category: "technology", readTime: 6, status: "draft" }
];

// Mock quizzes database for admin controls
const INITIAL_QUIZZES = [
  { id: "qz-1", title: "Kuis Dasar Ekonomi Sirkular Kelapa", questions: 5, difficulty: "Mudah", status: "active" },
  { id: "qz-2", title: "Kuis Standar Ekspor Briket Tempurung", questions: 8, difficulty: "Sedang", status: "active" }
];

export default function AdminContentPage() {
  const [activeSubTab, setActiveSubTab] = useState<"articles" | "quizzes">("articles");
  const [articles, setArticles] = useState(INITIAL_ARTICLES);
  const [quizzes, setQuizzes] = useState(INITIAL_QUIZZES);
  const [search, setSearch] = useState("");

  const handleDeleteArticle = (id: string) => {
    if (confirm("Hapus artikel ini secara permanen?")) {
      setArticles(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleDeleteQuiz = (id: string) => {
    if (confirm("Hapus kuis ini secara permanen?")) {
      setQuizzes(prev => prev.filter(q => q.id !== id));
    }
  };

  const handleToggleArticleStatus = (id: string) => {
    setArticles(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, status: a.status === "published" ? "draft" : "published" };
      }
      return a;
    }));
  };

  const handleToggleQuizStatus = (id: string) => {
    setQuizzes(prev => prev.map(q => {
      if (q.id === id) {
        return { ...q, status: q.status === "active" ? "draft" : "active" };
      }
      return q;
    }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
          <div>
            <h1 className="text-xl font-bold text-charcoal-800">Pengelolaan Konten Edukasi</h1>
            <p className="text-xs text-charcoal-500 mt-0.5">Tulis artikel baru, susun bank soal kuis, atau nonaktifkan modul belajar yang sudah kedaluwarsa.</p>
          </div>
          <button className="btn-primary gap-1.5 text-xs py-2.5 self-start sm:self-auto">
            <Plus className="w-4 h-4" /> Tambah Konten Baru
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2.5 overflow-x-auto border-b pb-2">
          <button
            onClick={() => { setActiveSubTab("articles"); setSearch(""); }}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all flex items-center gap-1.5",
              activeSubTab === "articles"
                ? "bg-forest-600 border-forest-600 text-white shadow-sm"
                : "bg-white border-border text-charcoal hover:bg-mist"
            )}
          >
            <BookOpen className="w-4 h-4" /> Artikel Belajar ({articles.length})
          </button>
          <button
            onClick={() => { setActiveSubTab("quizzes"); setSearch(""); }}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all flex items-center gap-1.5",
              activeSubTab === "quizzes"
                ? "bg-forest-600 border-forest-600 text-white shadow-sm"
                : "bg-white border-border text-charcoal hover:bg-mist"
            )}
          >
            <BrainCircuit className="w-4 h-4" /> Kuis Interaktif ({quizzes.length})
          </button>
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-2 border px-3.5 py-2.5 rounded-xl bg-white shadow-sm max-w-md">
          <Search className="w-4.5 h-4.5 text-charcoal-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={activeSubTab === "articles" ? "Cari artikel belajar..." : "Cari kuis..."}
            className="bg-transparent border-none outline-none text-xs w-full text-charcoal placeholder:text-charcoal-350"
          />
        </div>

        {/* Content Table displaying current Tab selection */}
        <div className="bg-white rounded-3xl border border-border/60 overflow-hidden shadow-sm">
          {activeSubTab === "articles" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-mist/35 border-b border-border text-xs text-charcoal-500 font-bold uppercase">
                    <th className="px-5 py-4">Judul Artikel</th>
                    <th className="px-5 py-4">Kategori</th>
                    <th className="px-5 py-4">Estimasi Baca</th>
                    <th className="px-5 py-4 text-center">Status</th>
                    <th className="px-5 py-4 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-sm">
                  {articles.filter(a => a.title.toLowerCase().includes(search.toLowerCase())).map(art => (
                    <tr key={art.id} className="hover:bg-mist/10 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-bold text-charcoal-850">{art.title}</p>
                      </td>
                      <td className="px-5 py-4 text-xs font-semibold text-charcoal-500 capitalize">{art.category.replace("_", " ")}</td>
                      <td className="px-5 py-4 text-xs text-charcoal-550 font-medium">{art.readTime} Menit</td>
                      <td className="px-5 py-4 text-center">
                        <span className={cn(
                          "px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
                          art.status === "published" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-charcoal-50 text-charcoal-450 border-charcoal-200"
                        )}>
                          {art.status === "published" ? "Rilis" : "Draf"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleToggleArticleStatus(art.id)}
                            className="text-xs font-bold text-forest-650 hover:text-forest-700 hover:underline"
                          >
                            {art.status === "published" ? "Arsip" : "Rilis"}
                          </button>
                          <button onClick={() => handleDeleteArticle(art.id)} className="text-charcoal-300 hover:text-red-500 transition-colors p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-mist/35 border-b border-border text-xs text-charcoal-500 font-bold uppercase">
                    <th className="px-5 py-4">Judul Kuis</th>
                    <th className="px-5 py-4">Jumlah Soal</th>
                    <th className="px-5 py-4">Tingkat Kesulitan</th>
                    <th className="px-5 py-4 text-center">Status</th>
                    <th className="px-5 py-4 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-sm">
                  {quizzes.filter(q => q.title.toLowerCase().includes(search.toLowerCase())).map(qz => (
                    <tr key={qz.id} className="hover:bg-mist/10 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-bold text-charcoal-850">{qz.title}</p>
                      </td>
                      <td className="px-5 py-4 text-xs font-semibold text-charcoal-550">{qz.questions} Butir Soal</td>
                      <td className="px-5 py-4 text-xs text-charcoal-500 font-medium">{qz.difficulty}</td>
                      <td className="px-5 py-4 text-center">
                        <span className={cn(
                          "px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
                          qz.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-charcoal-50 text-charcoal-450 border-charcoal-200"
                        )}>
                          {qz.status === "active" ? "Aktif" : "Draf"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleToggleQuizStatus(qz.id)}
                            className="text-xs font-bold text-forest-650 hover:text-forest-700 hover:underline"
                          >
                            {qz.status === "active" ? "Arsip" : "Aktifkan"}
                          </button>
                          <button onClick={() => handleDeleteQuiz(qz.id)} className="text-charcoal-300 hover:text-red-500 transition-colors p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
