"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Camera, Sparkles, X, TrendingUp, Clock, Leaf, Flame, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchStore, POPULAR_SEARCHES, TRENDING_SEARCHES } from "@/lib/stores/search-store";

interface MarketplaceHeroProps {
  initialQuery?: string;
}

const PLACEHOLDER_CYCLE = [
  "Cari briket kelapa premium...",
  "Temukan cocopeat organik...",
  "Jelajahi VCO murni cold-pressed...",
  "Cari kerajinan tempurung kelapa...",
  "Temukan arang aktif industri...",
];

export function MarketplaceHero({ initialQuery = "" }: MarketplaceHeroProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const { recentSearches, addRecentSearch, openVisualSearch } = useSearchStore();

  // Cycle placeholder text
  useEffect(() => {
    if (isFocused) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % PLACEHOLDER_CYCLE.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isFocused]);

  const handleSearch = (term?: string) => {
    const q = (term ?? query).trim();
    if (!q) return;
    addRecentSearch(q);
    router.push(`/produk?q=${encodeURIComponent(q)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
    if (e.key === "Escape") {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const showSuggestions = isFocused;

  return (
    <section className="relative bg-gradient-to-br from-forest-700 via-forest-600 to-moss overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 40%)`,
          }}
        />
      </div>

      {/* Floating leaves */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[Leaf, Flame, Droplets].map((Icon, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-10 text-white"
            style={{
              left: `${20 + i * 30}%`,
              top: `${15 + i * 20}%`,
            }}
            animate={{
              y: [0, -15, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 1.5,
            }}
          >
            <Icon className="w-8 h-8" aria-hidden="true" />
          </motion.div>
        ))}
      </div>

      <div className="container-base py-12 md:py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-xs font-medium mb-4 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Marketplace Ekonomi Sirkular Kelapa #1 Indonesia
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-3 leading-tight">
            Temukan Produk Kelapa
            <br />
            <span className="text-amber-300">Berkualitas Premium</span>
          </h1>
          <p className="text-white/70 text-sm md:text-base mb-8">
            {MOCK_PRODUCTS_COUNT}+ produk dari {MOCK_SELLERS_COUNT}+ Mitra Nyiur terpercaya
          </p>

          {/* Search Bar */}
          <div className="relative">
            <div
              className={cn(
                "flex items-center gap-2 bg-white rounded-2xl shadow-xl transition-all duration-200 px-4",
                isFocused ? "ring-2 ring-amber ring-offset-2 ring-offset-forest-600" : ""
              )}
            >
              <Search className="w-5 h-5 text-charcoal-400 flex-shrink-0" aria-hidden />

              <div className="flex-1 relative overflow-hidden">
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                  onKeyDown={handleKeyDown}
                  className="w-full py-4 text-sm md:text-base text-charcoal placeholder-transparent bg-transparent border-none outline-none"
                  placeholder={PLACEHOLDER_CYCLE[placeholderIndex]}
                  aria-label="Cari produk"
                  autoComplete="off"
                />
                {/* Animated placeholder */}
                {!query && !isFocused && (
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={placeholderIndex}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-y-0 left-0 flex items-center text-sm md:text-base text-charcoal-300 pointer-events-none"
                    >
                      {PLACEHOLDER_CYCLE[placeholderIndex]}
                    </motion.span>
                  </AnimatePresence>
                )}
              </div>

              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 text-charcoal-400 hover:text-charcoal transition-colors"
                  aria-label="Hapus pencarian"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Visual Search button */}
              <button
                onClick={openVisualSearch}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 text-amber-700 text-xs font-semibold hover:bg-amber-100 transition-colors border border-amber-200 flex-shrink-0"
                aria-label="Cari dengan foto (Visual AI Search)"
              >
                <Camera className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Visual AI</span>
              </button>

              <button
                onClick={() => handleSearch()}
                className="px-4 py-2.5 bg-forest-600 text-white rounded-xl text-sm font-semibold hover:bg-forest-500 transition-colors flex-shrink-0"
              >
                Cari
              </button>
            </div>

            {/* Suggestions dropdown */}
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-glass-lg border border-border/60 overflow-hidden z-50 text-left"
                >
                  {recentSearches.length > 0 && (
                    <div className="p-3">
                      <p className="text-[10px] font-semibold text-charcoal-400 uppercase tracking-wider mb-2 px-2">
                        Pencarian Terakhir
                      </p>
                      {recentSearches.slice(0, 4).map((term) => (
                        <button
                          key={term}
                          onClick={() => handleSearch(term)}
                          className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-mist text-sm text-charcoal-700 transition-colors"
                        >
                          <Clock className="w-3.5 h-3.5 text-charcoal-300 flex-shrink-0" />
                          {term}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="p-3 border-t border-border/40">
                    <p className="text-[10px] font-semibold text-charcoal-400 uppercase tracking-wider mb-2 px-2">
                      Sedang Trending
                    </p>
                    <div className="flex flex-wrap gap-1.5 px-2">
                      {TRENDING_SEARCHES.slice(0, 6).map((term) => (
                        <button
                          key={term}
                          onClick={() => handleSearch(term)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-forest-50 text-forest-700 text-xs font-medium hover:bg-forest-100 transition-colors"
                        >
                          <TrendingUp className="w-2.5 h-2.5" />
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Popular searches */}
          <div className="flex items-center justify-center gap-2 flex-wrap mt-4">
            <span className="text-white/50 text-xs">Populer:</span>
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                onClick={() => handleSearch(term)}
                className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs hover:bg-white/20 transition-colors border border-white/20"
              >
                {term}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Helper constants
const MOCK_PRODUCTS_COUNT = 24;
const MOCK_SELLERS_COUNT = 6;
