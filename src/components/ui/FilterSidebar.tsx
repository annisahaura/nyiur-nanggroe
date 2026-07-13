"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  SlidersHorizontal,
  ChevronDown,
  Leaf,
  Star,
  MapPin,
  ShoppingBag,
  Coffee,
  Flame,
  Droplets,
  Palette,
  Sparkles,
} from "lucide-react";

function CategoryIcon({ slug }: { slug: string }) {
  switch (slug) {
    case "tempurung":
      return <Coffee className="w-4 h-4 text-forest-600" aria-hidden="true" />;
    case "sabut":
      return <Leaf className="w-4 h-4 text-forest-600" aria-hidden="true" />;
    case "arang":
      return <Flame className="w-4 h-4 text-forest-600" aria-hidden="true" />;
    case "minyak":
      return <Droplets className="w-4 h-4 text-forest-600" aria-hidden="true" />;
    case "kerajinan":
      return <Palette className="w-4 h-4 text-forest-600" aria-hidden="true" />;
    default:
      return <Sparkles className="w-4 h-4 text-forest-600" aria-hidden="true" />;
  }
}
import * as Slider from "@radix-ui/react-slider";
import { cn, formatPrice } from "@/lib/utils";
import { MOCK_CATEGORIES } from "@/lib/data/marketplace-data";

export interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  location: string;
  isEcoCertified: boolean;
  minRating: number;
  sort: "relevance" | "newest" | "price_asc" | "price_desc" | "rating";
}

export const DEFAULT_FILTERS: FilterState = {
  category: "semua",
  minPrice: 0,
  maxPrice: 5000000,
  location: "",
  isEcoCertified: false,
  minRating: 0,
  sort: "relevance",
};

const SORT_OPTIONS = [
  { value: "relevance", label: "Paling Relevan" },
  { value: "newest", label: "Terbaru" },
  { value: "price_asc", label: "Harga: Terendah" },
  { value: "price_desc", label: "Harga: Tertinggi" },
  { value: "rating", label: "Rating Tertinggi" },
];

const PROVINCES = [
  "Aceh",
  "Sumatera Utara",
  "Sumatera Barat",
  "Riau",
  "Jawa Barat",
  "DKI Jakarta",
  "Jawa Tengah",
  "Jawa Timur",
  "DI Yogyakarta",
  "Sulawesi Selatan",
  "Kalimantan Barat",
  "Bali",
];

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  productCount: number;
  className?: string;
}

interface FilterSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function FilterSection({ title, defaultOpen = true, children }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border/60 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-sm font-semibold text-charcoal-700 mb-3 hover:text-forest-600 transition-colors"
      >
        {title}
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform duration-200",
            isOpen ? "rotate-180" : ""
          )}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FilterSidebar({
  filters,
  onChange,
  onReset,
  productCount,
  className,
}: FilterSidebarProps) {
  const hasActiveFilters =
    filters.category !== "semua" ||
    filters.minPrice > 0 ||
    filters.maxPrice < 5000000 ||
    filters.isEcoCertified ||
    filters.minRating > 0 ||
    filters.location !== "";

  return (
    <aside className={cn("bg-white rounded-2xl border border-border/60 p-5", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-forest-600" />
          <span className="font-semibold text-charcoal-800">Filter</span>
          <span className="text-xs text-charcoal-400">({productCount} produk)</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs text-forest-600 hover:text-forest-500 font-medium transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Sort */}
      <FilterSection title="Urutkan">
        <div className="space-y-1.5">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...filters, sort: opt.value as FilterState["sort"] })}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm transition-all",
                filters.sort === opt.value
                  ? "bg-forest-50 text-forest-700 font-medium"
                  : "text-charcoal-600 hover:bg-mist"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Category */}
      <FilterSection title="Kategori">
        <div className="space-y-1.5">
          <button
            onClick={() => onChange({ ...filters, category: "semua" })}
            className={cn(
              "w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2",
              filters.category === "semua"
                ? "bg-forest-50 text-forest-700 font-medium"
                : "text-charcoal-600 hover:bg-mist"
            )}
          >
            <ShoppingBag className="w-4 h-4 text-forest-600" aria-hidden="true" />
            Semua Kategori
          </button>
          {MOCK_CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => onChange({ ...filters, category: cat.slug })}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2",
                filters.category === cat.slug
                  ? "bg-forest-50 text-forest-700 font-medium"
                  : "text-charcoal-600 hover:bg-mist"
              )}
            >
              <CategoryIcon slug={cat.slug} />
              <span className="flex-1 truncate">{cat.name}</span>
              <span className="text-[10px] text-charcoal-400 flex-shrink-0">
                {cat.product_count}
              </span>
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Rentang Harga">
        <div className="px-1">
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5 mb-3"
            min={0}
            max={5000000}
            step={25000}
            value={[filters.minPrice, filters.maxPrice]}
            onValueChange={([min, max]) =>
              onChange({ ...filters, minPrice: min, maxPrice: max })
            }
            aria-label="Rentang harga"
          >
            <Slider.Track className="bg-charcoal-200 relative grow rounded-full h-1.5">
              <Slider.Range className="absolute bg-forest-500 rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb className="block w-4 h-4 bg-white border-2 border-forest-500 rounded-full shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-forest-500 cursor-grab active:cursor-grabbing" />
            <Slider.Thumb className="block w-4 h-4 bg-white border-2 border-forest-500 rounded-full shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-forest-500 cursor-grab active:cursor-grabbing" />
          </Slider.Root>
          <div className="flex items-center justify-between text-xs text-charcoal-500">
            <span>{formatPrice(filters.minPrice, { compact: true })}</span>
            <span>{formatPrice(filters.maxPrice, { compact: true })}</span>
          </div>
        </div>
      </FilterSection>

      {/* Location */}
      <FilterSection title="Lokasi Penjual">
        <select
          value={filters.location}
          onChange={(e) => onChange({ ...filters, location: e.target.value })}
          className="input-base text-sm py-2.5 bg-white"
          aria-label="Pilih provinsi"
        >
          <option value="">Semua Provinsi</option>
          {PROVINCES.map((prov) => (
            <option key={prov} value={prov}>
              {prov}
            </option>
          ))}
        </select>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Rating Minimum">
        <div className="space-y-1.5">
          {[0, 3, 4, 4.5].map((rating) => (
            <button
              key={rating}
              onClick={() => onChange({ ...filters, minRating: rating })}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2",
                filters.minRating === rating
                  ? "bg-forest-50 text-forest-700 font-medium"
                  : "text-charcoal-600 hover:bg-mist"
              )}
            >
              {rating === 0 ? (
                <span>Semua Rating</span>
              ) : (
                <>
                  <Star className="w-3.5 h-3.5 fill-amber text-amber" />
                  <span>≥ {rating}</span>
                </>
              )}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Eco Certified */}
      <FilterSection title="Sertifikasi" defaultOpen={false}>
        <label className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-mist transition-colors">
          <input
            type="checkbox"
            checked={filters.isEcoCertified}
            onChange={(e) => onChange({ ...filters, isEcoCertified: e.target.checked })}
            className="w-4 h-4 rounded border-charcoal-300 text-forest-600 focus:ring-forest-500 accent-forest-600"
          />
          <span className="flex items-center gap-1.5 text-sm text-charcoal-700">
            <Leaf className="w-3.5 h-3.5 text-moss" />
            Eco Certified
          </span>
        </label>
      </FilterSection>
    </aside>
  );
}
