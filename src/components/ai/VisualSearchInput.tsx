"use client";

import { useState, useRef } from "react";
import { Camera, Upload, X, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface VisualSearchInputProps {
  onSearchResults: (products: any[], keyword: string) => void;
}

export function VisualSearchInput({ onSearchResults }: VisualSearchInputProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setAnalysisResult(null);

    // Validasi tipe file
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Format file tidak didukung. Gunakan JPG, PNG, atau WebP.");
      return;
    }

    // Validasi ukuran (maksimal 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file terlalu besar. Maksimal 5MB.");
      return;
    }

    // Tampilkan preview gambar
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setIsAnalyzing(true);
    setIsModalOpen(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/ai/visual-search", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal menganalisis gambar.");
      }

      const data = await response.json();
      setAnalysisResult(data.analysis);
      
      // Kirim produk hasil pencarian visual ke parent component
      onSearchResults(data.products, data.analysis.search_query);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menghubungi AI.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetSearch = () => {
    setImagePreview(null);
    setAnalysisResult(null);
    setError(null);
    setIsModalOpen(false);
  };

  return (
    <div className="relative">
      {/* Search Input Trigger Camera */}
      <button
        type="button"
        onClick={triggerFileSelect}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl text-charcoal-400 hover:text-forest-600 hover:bg-forest-50/50 transition-colors"
        title="Cari produk kelapa menggunakan foto (AI)"
      >
        <Camera className="w-5 h-5" />
      </button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />

      {/* Analysis Result Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-border/80"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-gradient-to-r from-forest-700 to-forest-800 text-white">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span className="font-bold text-sm">Pencarian Visual AI</span>
                </div>
                <button
                  onClick={resetSearch}
                  className="p-1.5 rounded-xl hover:bg-white/10 text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Image Preview Container */}
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-cream flex items-center justify-center border-2 border-dashed border-border">
                  {imagePreview && (
                    <Image
                      src={imagePreview}
                      alt="Gambar pencarian"
                      fill
                      className="object-contain"
                    />
                  )}
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex flex-col items-center justify-center gap-3">
                      <Loader2 className="w-8 h-8 text-forest-600 animate-spin" />
                      <p className="text-xs font-semibold text-charcoal-700 animate-pulse">
                        Nyai Nyiur sedang mengidentifikasi foto...
                      </p>
                    </div>
                  )}
                </div>

                {/* Error Box */}
                {error && (
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex gap-3 text-rose-700 text-xs">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <p className="font-bold">Gagal Menganalisis</p>
                      <p className="mt-0.5">{error}</p>
                    </div>
                  </div>
                )}

                {/* Analysis Info */}
                {analysisResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-mist/60 rounded-2xl border border-border/40">
                        <span className="text-[10px] text-charcoal-400 font-bold block uppercase tracking-wider">
                          Objek Terdeteksi
                        </span>
                        <span className="text-sm font-extrabold text-forest-800 mt-1 block">
                          {analysisResult.detected_product}
                        </span>
                      </div>
                      <div className="p-4 bg-mist/60 rounded-2xl border border-border/40">
                        <span className="text-[10px] text-charcoal-400 font-bold block uppercase tracking-wider">
                          Tingkat Keyakinan
                        </span>
                        <span className="text-sm font-extrabold text-amber-600 mt-1 block">
                          {Math.round(analysisResult.confidence * 100)}%
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-charcoal-400 font-bold block uppercase tracking-wider">
                        Deskripsi AI
                      </span>
                      <p className="text-xs text-charcoal-700 mt-1 leading-relaxed">
                        {analysisResult.description}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] text-charcoal-400 font-bold block uppercase tracking-wider">
                        Rekomendasi Kata Kunci
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {analysisResult.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="text-[10px] bg-forest-50 border border-forest-100 text-forest-700 px-3 py-1 rounded-full font-semibold"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-cream/30 border-t border-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetSearch}
                  className="px-5 py-2.5 rounded-2xl border border-border text-xs font-semibold text-charcoal-600 hover:bg-mist transition-colors"
                >
                  Batal
                </button>
                {analysisResult && (
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-2xl bg-forest-600 hover:bg-forest-500 text-xs font-semibold text-white transition-all shadow-sm"
                  >
                    Tampilkan Hasil Produk
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
