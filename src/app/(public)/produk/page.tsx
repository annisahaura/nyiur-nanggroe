"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, Grid3X3, List, X, ChevronLeft, ChevronRight, Package } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";
import { FilterSidebar, type FilterState, DEFAULT_FILTERS } from "@/components/ui/FilterSidebar";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";
import { MarketplaceHero } from "@/components/marketplace/MarketplaceHero";
import { VisualSearchModal } from "@/components/marketplace/VisualSearchModal";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MOCK_PRODUCTS, MOCK_CATEGORIES, searchProducts } from "@/lib/data/marketplace-data";
import { useSearchStore } from "@/lib/stores/search-store";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

const PRODUCTS_PER_PAGE = 12;

function applyFilters(products: Product[], filters: FilterState, query: string): Product[] {
  let result = query ? searchProducts(query) : products;

  if (filters.category !== "semua") {
    const cat = MOCK_CATEGORIES.find((c) => c.slug === filters.category);
    if (cat) result = result.filter((p) => p.category_id === cat.id);
  }
  if (filters.minPrice > 0) result = result.filter((p) => p.price >= filters.minPrice);
  if (filters.maxPrice < 5000000) result = result.filter((p) => p.price <= filters.maxPrice);
  if (filters.location) result = result.filter((p) => p.store?.province === filters.location || p.store?.city === filters.location);
  if (filters.isEcoCertified) result = result.filter((p) => p.is_eco_certified);
  if (filters.minRating > 0) result = result.filter((p) => p.rating >= filters.minRating);

  switch (filters.sort) {
    case "newest": result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
    case "price_asc": result.sort((a, b) => a.price - b.price); break;
    case "price_desc": result.sort((a, b) => b.price - a.price); break;
    case "rating": result.sort((a, b) => b.rating - a.rating); break;
    default: result.sort((a, b) => b.total_sold - a.total_sold);
  }

  return result;
}

// Inner component that uses useSearchParams — must be inside Suspense
function MarketplaceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery = searchParams.get("q") ?? "";
  const initialCategory = searchParams.get("kategori") ?? "semua";

  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    category: initialCategory,
  });
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(1);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, [filters, query]);

  // Sync URL params
  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    const cat = searchParams.get("kategori") ?? "semua";
    setQuery(q);
    setFilters((f) => ({ ...f, category: cat }));
    setPage(1);
  }, [searchParams]);

  // Landing page links to /produk?visual=1 to jump straight into Visual
  // AI Search instead of just landing on the plain product list.
  const openVisualSearch = useSearchStore((s) => s.openVisualSearch);
  useEffect(() => {
    if (searchParams.get("visual") === "1") {
      openVisualSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredProducts = useMemo(
    () => applyFilters(MOCK_PRODUCTS, filters, query),
    [filters, query]
  );

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE
  );

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleReset = () => {
    setFilters({ ...DEFAULT_FILTERS, category: "semua" });
    setPage(1);
  };

  const activeFilterCount = [
    filters.category !== "semua",
    filters.minPrice > 0,
    filters.maxPrice < 5000000,
    filters.isEcoCertified,
    filters.minRating > 0,
    filters.location !== "",
  ].filter(Boolean).length;

  return (
    <>
      {/* Hero with Search */}
      <MarketplaceHero initialQuery={query} />

      {/* Category tabs */}
      <div className="bg-white border-b border-border/60 sticky top-16 z-30 shadow-sm">
        <div className="container-base">
          <div className="flex items-center gap-0 overflow-x-auto scrollbar-none py-3">
            <button
              onClick={() => handleFilterChange({ ...filters, category: "semua" })}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 mr-2",
                filters.category === "semua"
                  ? "bg-forest-600 text-white shadow-sm"
                  : "text-charcoal-600 hover:bg-mist"
              )}
            >
              🛍️ Semua
            </button>
            {MOCK_CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => handleFilterChange({ ...filters, category: cat.slug })}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 mr-2",
                  filters.category === cat.slug
                    ? "bg-forest-600 text-white shadow-sm"
                    : "text-charcoal-600 hover:bg-mist"
                )}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-base py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-36">
              <FilterSidebar
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleReset}
                productCount={filteredProducts.length}
              />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-5 gap-3">
              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <button
                  onClick={() => setShowMobileFilter(true)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-white text-sm font-medium text-charcoal-700 hover:bg-mist transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filter
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-forest-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Results count */}
                <p className="text-sm text-charcoal-500">
                  {isLoading ? (
                    <span className="skeleton h-4 w-32 rounded-full inline-block" />
                  ) : (
                    <>
                      <span className="font-semibold text-charcoal-800">
                        {filteredProducts.length.toLocaleString("id-ID")}
                      </span>{" "}
                      produk ditemukan
                      {query && (
                        <span className="text-charcoal-400"> untuk &ldquo;{query}&rdquo;</span>
                      )}
                    </>
                  )}
                </p>
              </div>

              {/* Active filter chips */}
              <div className="flex items-center gap-2">
                {filters.isEcoCertified && (
                  <span className="hidden sm:flex badge-eco items-center gap-1 text-xs">
                    🌿 Eco
                    <button onClick={() => handleFilterChange({ ...filters, isEcoCertified: false })}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {/* View mode */}
                <div className="hidden sm:flex items-center border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-2 transition-colors",
                      viewMode === "grid" ? "bg-forest-50 text-forest-600" : "text-charcoal-400 hover:bg-mist"
                    )}
                    aria-label="Tampilan grid"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-2 transition-colors border-l border-border",
                      viewMode === "list" ? "bg-forest-50 text-forest-600" : "text-charcoal-400 hover:bg-mist"
                    )}
                    aria-label="Tampilan daftar"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product grid */}
            {isLoading ? (
              <SkeletonGrid count={PRODUCTS_PER_PAGE} />
            ) : paginatedProducts.length === 0 ? (
              <EmptyState query={query} onReset={handleReset} />
            ) : (
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={`${page}-${filters.category}-${query}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    viewMode === "grid"
                      ? "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4"
                      : "flex flex-col gap-4"
                  )}
                >
                  {paginatedProducts.map((product, i) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      priority={i < 4}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}

            {/* Pagination */}
            {totalPages > 1 && !isLoading && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  disabled={page === 1}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-medium text-charcoal-600 hover:bg-mist disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Sebelumnya
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      className={cn(
                        "w-9 h-9 rounded-lg text-sm font-medium transition-all",
                        p === page
                          ? "bg-forest-600 text-white shadow-sm"
                          : "text-charcoal-600 hover:bg-mist border border-border"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  disabled={page === totalPages}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-sm font-medium text-charcoal-600 hover:bg-mist disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Selanjutnya
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {showMobileFilter && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-charcoal-900/50 backdrop-blur-sm lg:hidden"
              onClick={() => setShowMobileFilter(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-80 bg-white shadow-xl overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
                <span className="font-bold text-charcoal-800">Filter Produk</span>
                <button onClick={() => setShowMobileFilter(false)} className="p-2 rounded-lg hover:bg-mist text-charcoal-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <FilterSidebar
                  filters={filters}
                  onChange={(f) => { handleFilterChange(f); setShowMobileFilter(false); }}
                  onReset={() => { handleReset(); setShowMobileFilter(false); }}
                  productCount={filteredProducts.length}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Visual Search Modal */}
      <VisualSearchModal />
    </>
  );
}

// Skeleton shown while Suspense resolves
function MarketplaceSkeleton() {
  return (
    <div className="container-base py-20">
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square bg-mist rounded-2xl mb-3" />
            <div className="h-4 bg-mist rounded w-3/4 mb-2" />
            <div className="h-4 bg-mist rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Page root — wraps content in Suspense for Next.js 15 compliance
export default function MarketplacePage() {
  return (
    <>
      <Header />
      <main id="main-content" className="pt-24 md:pt-28">
        <Suspense fallback={<MarketplaceSkeleton />}>
          <MarketplaceContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

function EmptyState({ query, onReset }: { query: string; onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-20 h-20 rounded-2xl bg-mist flex items-center justify-center mb-5">
        <Package className="w-10 h-10 text-charcoal-300" />
      </div>
      <h3 className="text-xl font-bold text-charcoal-800 mb-2">
        {query ? `Tidak ada hasil untuk "${query}"` : "Tidak ada produk ditemukan"}
      </h3>
      <p className="text-charcoal-500 text-sm max-w-sm mb-6">
        Coba ubah filter atau kata kunci pencarian Anda untuk menemukan produk yang sesuai.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onReset}
          className="btn-secondary text-sm py-2.5"
        >
          Reset Filter
        </button>
        <button
          onClick={() => window.location.href = "/produk"}
          className="btn-primary text-sm py-2.5"
        >
          Lihat Semua Produk
        </button>
      </div>
    </motion.div>
  );
}
