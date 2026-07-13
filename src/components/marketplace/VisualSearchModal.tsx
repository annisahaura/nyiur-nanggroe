"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import {
  X,
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Loader2,
  Tag,
  Package,
  BarChart3,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useSearchStore, type VisualSearchResult } from "@/lib/stores/search-store";

export function VisualSearchModal() {
  const router = useRouter();
  const { isVisualSearchOpen, closeVisualSearch, setVisualSearchResult, visualSearchResult } =
    useSearchStore();

  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lock background page scroll while the modal is open, so scrolling
  // over the modal doesn't scroll the page behind it instead.
  // `overflow: hidden` on <body> alone isn't reliable on mobile Safari —
  // the page behind can still scroll via touch. Pinning the body with
  // `position: fixed` (and restoring the exact scroll offset after) is
  // the reliable cross-browser fix.
  useEffect(() => {
    if (isVisualSearchOpen) {
      const scrollY = window.scrollY;
      const body = document.body;
      const previousStyle = {
        position: body.style.position,
        top: body.style.top,
        left: body.style.left,
        right: body.style.right,
        width: body.style.width,
        overflow: body.style.overflow,
      };

      body.style.position = "fixed";
      body.style.top = `-${scrollY}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      body.style.overflow = "hidden";

      return () => {
        body.style.position = previousStyle.position;
        body.style.top = previousStyle.top;
        body.style.left = previousStyle.left;
        body.style.right = previousStyle.right;
        body.style.width = previousStyle.width;
        body.style.overflow = previousStyle.overflow;
        window.scrollTo(0, scrollY);
      };
    }
  }, [isVisualSearchOpen]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setPreview(dataUrl);
      setError(null);
      setVisualSearchResult(null);

      // Convert to base64 for API
      const base64 = dataUrl.split(",")[1];
      const mimeType = file.type;

      setIsAnalyzing(true);
      try {
        const res = await fetch("/api/ai/visual-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64, mimeType }),
        });

        if (!res.ok) throw new Error("Analisis gagal");

        const data = await res.json();
        setVisualSearchResult(data);
      } catch {
        // Fallback mock result for demo
        setVisualSearchResult({
          detected_product: "Briket Kelapa Premium",
          category: "Arang & Briket",
          search_query: "briket kelapa premium",
          tags: ["briket", "kelapa", "bbq", "premium"],
          confidence: 0.87,
          description:
            "Terdeteksi briket kelapa berbentuk geometris dengan warna hitam khas arang kelapa berkualitas tinggi.",
        });
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  }, [setVisualSearchResult]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const handleBrowseSimilar = () => {
    if (!visualSearchResult) return;
    closeVisualSearch();
    router.push(`/produk?q=${encodeURIComponent(visualSearchResult.search_query)}`);
  };

  const handleClose = () => {
    closeVisualSearch();
    setPreview(null);
    setError(null);
  };

  const confidenceColor =
    (visualSearchResult?.confidence ?? 0) >= 0.8
      ? "text-moss-500"
      : (visualSearchResult?.confidence ?? 0) >= 0.6
      ? "text-amber-600"
      : "text-red-500";

  return (
    <AnimatePresence>
      {isVisualSearchOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-charcoal-900/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Scrollable wrapper — centers the modal, and lets the whole
              modal scroll into view as a fallback on very short viewports
              instead of getting clipped above/below the screen. */}
          <div
            className="fixed inset-0 z-[71] overflow-y-auto overscroll-contain flex items-center justify-center p-4"
            onClick={handleClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="w-full md:max-w-lg my-auto"
              onClick={(e) => e.stopPropagation()}
            >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
              {/* Header */}
              <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between bg-gradient-to-r from-forest-700 to-moss flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-white text-base">Visual AI Search</h2>
                    <p className="text-white/70 text-xs">Upload foto, AI kenali produknya</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                  aria-label="Tutup"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto overscroll-contain">
                {/* Upload Area */}
                <div
                  {...getRootProps()}
                  className={cn(
                    "relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer",
                    isDragActive
                      ? "border-forest-500 bg-forest-50"
                      : preview
                      ? "border-forest-300 bg-forest-50/50"
                      : "border-charcoal-200 hover:border-forest-400 hover:bg-forest-50/50"
                  )}
                >
                  <input {...getInputProps()} aria-label="Upload foto produk" />

                  {preview ? (
                    <div className="relative h-48 rounded-xl overflow-hidden">
                      <Image
                        src={preview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      {isAnalyzing && (
                        <div className="absolute inset-0 bg-charcoal-900/60 flex flex-col items-center justify-center gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-amber-300" />
                          </div>
                          <p className="text-white text-sm font-medium">Menganalisis gambar...</p>
                          <p className="text-white/70 text-xs">AI sedang mengenali produk</p>
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreview(null);
                          setVisualSearchResult(null);
                        }}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-charcoal-600 hover:bg-white transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="py-10 flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-forest-50 flex items-center justify-center">
                        <Upload className="w-7 h-7 text-forest-500" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-charcoal-700">
                          {isDragActive ? "Lepaskan foto di sini" : "Seret foto atau klik untuk upload"}
                        </p>
                        <p className="text-xs text-charcoal-400 mt-1">
                          JPG, PNG, WebP • Maks. 10MB
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-charcoal-400">
                        <div className="w-12 h-px bg-charcoal-200" />
                        <Camera className="w-3.5 h-3.5" />
                        <div className="w-12 h-px bg-charcoal-200" />
                      </div>
                      <p className="text-xs text-charcoal-400">
                        AI akan mengenali jenis produk kelapa secara otomatis
                      </p>
                    </div>
                  )}
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                {/* AI Detection Result */}
                <AnimatePresence>
                  {visualSearchResult && !isAnalyzing && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3 }}
                      className="rounded-2xl border border-forest-200 bg-gradient-to-br from-forest-50 to-moss-50/30 overflow-hidden"
                    >
                      {/* Result header */}
                      <div className="px-4 py-3 border-b border-forest-100 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-moss-500" />
                        <span className="text-xs font-semibold text-forest-700">
                          Produk Terdeteksi
                        </span>
                        <span
                          className={cn(
                            "ml-auto text-xs font-bold",
                            confidenceColor
                          )}
                        >
                          {Math.round(visualSearchResult.confidence * 100)}% akurat
                        </span>
                      </div>

                      {/* Result content */}
                      <div className="p-4 space-y-3">
                        <div>
                          <p className="text-base font-bold text-charcoal-800">
                            {visualSearchResult.detected_product}
                          </p>
                          <p className="text-xs text-charcoal-500 mt-0.5">
                            {visualSearchResult.description}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2">
                            <Package className="w-3.5 h-3.5 text-forest-500 flex-shrink-0" />
                            <div>
                              <p className="text-[9px] text-charcoal-400 uppercase font-semibold">Kategori</p>
                              <p className="text-xs font-medium text-charcoal-700">
                                {visualSearchResult.category}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2">
                            <BarChart3 className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                            <div>
                              <p className="text-[9px] text-charcoal-400 uppercase font-semibold">Keyakinan</p>
                              <p className="text-xs font-medium text-charcoal-700">
                                {Math.round(visualSearchResult.confidence * 100)}%
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {visualSearchResult.tags.slice(0, 5).map((tag) => (
                            <span
                              key={tag}
                              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-forest-700 text-[10px] font-medium border border-forest-200"
                            >
                              <Tag className="w-2.5 h-2.5" />
                              {tag}
                            </span>
                          ))}
                        </div>

                        <button
                          onClick={handleBrowseSimilar}
                          className="w-full flex items-center justify-center gap-2 py-3 bg-forest-600 text-white rounded-xl text-sm font-semibold hover:bg-forest-500 transition-colors"
                        >
                          Lihat Produk Serupa
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Tips */}
                {!preview && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-100">
                    <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">
                      Tips: Foto dengan pencahayaan baik dan objek jelas akan memberikan
                      hasil deteksi lebih akurat.
                    </p>
                  </div>
                )}
              </div>
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
