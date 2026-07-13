"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Heart,
  Star,
  ShoppingCart,
  MapPin,
  Shield,
  ArrowRight,
  Leaf,
  Eye,
  Flame,
  TreeDeciduous,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

// Product images — AI-generated locally hosted (products 1–6) + Pexels for 7–8
const PRODUCT_IMAGES: Record<string, string> = {
  "1": "/images/product-briket.png",    // AI-generated: coconut charcoal briquettes
  "2": "/images/product-cocopeat.png",  // AI-generated: cocopeat block
  "3": "/images/product-vco.png",       // AI-generated: virgin coconut oil
  "4": "/images/product-keset.png",     // AI-generated: coir doormat
  "5": "/images/product-mangkuk.png",   // AI-generated: coconut shell bowls
  "6": "/images/product-arang-aktif.png",  // activated charcoal powder
  "7": "/images/product-tali-sabut.png",    // coir rope
  "8": "/images/product-gula-kelapa.png",   // coconut sugar
};


// Mock featured products for homepage display
// In production, these are fetched from Supabase
const MOCK_PRODUCTS: Partial<Product>[] = [
  {
    id: "1",
    name: "Briket Kelapa Premium BBQ Grade A",
    slug: "briket-kelapa-premium-bbq-grade-a",
    price: 85000,
    unit: "kg",
    min_order: 5,
    rating: 4.9,
    review_count: 234,
    total_sold: 1820,
    is_eco_certified: true,
    tags: ["briket", "bbq", "ekspor"],
    store: {
      id: "s1",
      name: "Karya Arang Aceh",
      slug: "karya-arang-aceh",
      location: "Banda Aceh",
      is_verified: true,
    } as any,
    images: [{ url: "/products/briket-bbq.jpg", is_primary: true } as any],
    co2_saved: 2.3,
    waste_diverted: 1.5,
  },
  {
    id: "2",
    name: "Cocopeat Blok Premium Hortikultura",
    slug: "cocopeat-blok-premium-hortikultura",
    price: 45000,
    unit: "blok 5kg",
    min_order: 10,
    rating: 4.8,
    review_count: 189,
    total_sold: 2340,
    is_eco_certified: true,
    tags: ["cocopeat", "hortikultura", "media-tanam"],
    store: {
      id: "s2",
      name: "Sabut Lestari",
      slug: "sabut-lestari",
      location: "Aceh Besar",
      is_verified: true,
    } as any,
    images: [{ url: "/products/cocopeat.jpg", is_primary: true } as any],
    co2_saved: 1.2,
    waste_diverted: 5.0,
  },
  {
    id: "3",
    name: "Virgin Coconut Oil (VCO) Cold Pressed 500ml",
    slug: "vco-cold-pressed-500ml",
    price: 120000,
    unit: "botol",
    min_order: 1,
    rating: 5.0,
    review_count: 412,
    total_sold: 3105,
    is_eco_certified: true,
    tags: ["vco", "minyak-kelapa", "organik"],
    store: {
      id: "s3",
      name: "Nira Natural",
      slug: "nira-natural",
      location: "Pidie",
      is_verified: true,
    } as any,
    images: [{ url: "/products/vco.jpg", is_primary: true } as any],
    co2_saved: 0.8,
    waste_diverted: 0.5,
  },
  {
    id: "4",
    name: "Keset Sabut Kelapa Handmade 40x60cm",
    slug: "keset-sabut-kelapa-handmade",
    price: 55000,
    unit: "pcs",
    min_order: 1,
    rating: 4.7,
    review_count: 98,
    total_sold: 560,
    is_eco_certified: false,
    tags: ["keset", "kerajinan", "handmade"],
    store: {
      id: "s4",
      name: "Anyam Aceh",
      slug: "anyam-aceh",
      location: "Sabang",
      is_verified: false,
    } as any,
    images: [{ url: "/products/keset.jpg", is_primary: true } as any],
    co2_saved: 0.3,
    waste_diverted: 0.8,
  },
  {
    id: "5",
    name: "Mangkuk Tempurung Kelapa Finishing Natural",
    slug: "mangkuk-tempurung-finishing-natural",
    price: 75000,
    unit: "set 3 pcs",
    min_order: 1,
    rating: 4.9,
    review_count: 167,
    total_sold: 890,
    is_eco_certified: true,
    tags: ["tempurung", "kerajinan", "dekorasi"],
    store: {
      id: "s5",
      name: "Kriya Nyiur",
      slug: "kriya-nyiur",
      location: "Aceh Utara",
      is_verified: true,
    } as any,
    images: [{ url: "/products/mangkuk.jpg", is_primary: true } as any],
    co2_saved: 1.1,
    waste_diverted: 0.6,
  },
  {
    id: "6",
    name: "Arang Aktif Tempurung Kelapa 200 Mesh",
    slug: "arang-aktif-200-mesh",
    price: 180000,
    unit: "kg",
    min_order: 5,
    rating: 4.8,
    review_count: 76,
    total_sold: 420,
    is_eco_certified: true,
    tags: ["arang-aktif", "industri", "filtrasi"],
    store: {
      id: "s1",
      name: "Karya Arang Aceh",
      slug: "karya-arang-aceh",
      location: "Banda Aceh",
      is_verified: true,
    } as any,
    images: [{ url: "/products/arang-aktif.jpg", is_primary: true } as any],
    co2_saved: 3.2,
    waste_diverted: 1.0,
  },
  {
    id: "7",
    name: "Tali Sabut Kelapa (Coir Rope) Premium",
    slug: "tali-sabut-kelapa-premium",
    price: 15000,
    unit: "roll (10m)",
    min_order: 10,
    rating: 4.6,
    review_count: 124,
    total_sold: 890,
    is_eco_certified: true,
    tags: ["tali-sabut", "pertanian", "coir"],
    store: {
      id: "s2",
      name: "Sabut Lestari",
      slug: "sabut-lestari",
      location: "Aceh Besar",
      is_verified: true,
    } as any,
    images: [{ url: "/products/tali.jpg", is_primary: true } as any],
    co2_saved: 0.5,
    waste_diverted: 2.0,
  },
  {
    id: "8",
    name: "Gula Kelapa Organik (Coconut Sugar) 500g",
    slug: "gula-kelapa-organik-500g",
    price: 35000,
    unit: "pouch",
    min_order: 2,
    rating: 4.9,
    review_count: 310,
    total_sold: 1540,
    is_eco_certified: true,
    tags: ["gula-kelapa", "organik", "pemanis"],
    store: {
      id: "s6",
      name: "Manis Alami",
      slug: "manis-alami",
      location: "Bireuen",
      is_verified: true,
    } as any,
    images: [{ url: "/products/gula.jpg", is_primary: true } as any],
    co2_saved: 1.0,
    waste_diverted: 0.0,
  },
];

// Product Card Component
interface ProductCardProps {
  product: Partial<Product>;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const fallbackGradients = [
    "from-amber-100 to-amber-50",
    "from-forest-100 to-forest-50",
    "from-moss-100 to-moss-50",
    "from-yellow-100 to-yellow-50",
  ];

  const photoUrl = PRODUCT_IMAGES[product.id ?? ""] ?? null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group card-base overflow-hidden"
    >
      {/* Product Image */}
      <Link
        href={`/produk/${product.slug}`}
        className="block relative aspect-product overflow-hidden bg-mist"
        aria-label={`Lihat ${product.name}`}
      >
        {/* Placeholder gradient background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${fallbackGradients[index % 4]}`}
        />

        {/* Real product photo */}
        {photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt={product.name ?? "Produk kelapa"}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-107 transition-transform duration-700"
          />
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-charcoal-900/0 group-hover:bg-charcoal-900/20 transition-colors duration-300 z-10 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-full px-4 py-2 text-forest-700 text-xs font-medium flex items-center gap-1.5 shadow-lg">
            <Eye className="w-3.5 h-3.5" aria-hidden="true" /> Lihat Produk
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
          {product.is_eco_certified && (
            <span className="badge-eco shadow-sm">
              <Leaf className="w-3 h-3" aria-hidden="true" />
              Eco
            </span>
          )}
          {product.total_sold && product.total_sold > 1000 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
              <Flame className="w-3 h-3" aria-hidden="true" /> Laris
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted((prev) => !prev);
          }}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110 active:scale-95"
          aria-label={isWishlisted ? "Hapus dari wishlist" : "Tambah ke wishlist"}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? "text-red-500 fill-current" : "text-charcoal-400"
            }`}
          />
        </button>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {/* Store info */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-charcoal-400 text-xs truncate">
            {product.store?.name}
          </span>
          {product.store?.is_verified && (
            <Shield
              className="w-3 h-3 text-moss-500 flex-shrink-0"
              aria-label="Toko terverifikasi"
            />
          )}
          <span className="text-charcoal-200 text-xs">·</span>
          <div className="flex items-center gap-0.5">
            <MapPin className="w-3 h-3 text-charcoal-300 flex-shrink-0" aria-hidden="true" />
            <span className="text-charcoal-400 text-xs truncate">
              {product.store?.location}
            </span>
          </div>
        </div>

        {/* Name */}
        <Link href={`/produk/${product.slug}`}>
          <h3 className="font-semibold text-charcoal-800 text-sm leading-snug line-clamp-2 hover:text-forest-600 transition-colors mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star
            className="w-3.5 h-3.5 text-amber-400 fill-current"
            aria-hidden="true"
          />
          <span className="text-xs font-medium text-charcoal-700">
            {product.rating?.toFixed(1)}
          </span>
          <span className="text-xs text-charcoal-400">
            ({product.review_count?.toLocaleString("id-ID")})
          </span>
          {product.total_sold && (
            <>
              <span className="text-charcoal-200">·</span>
              <span className="text-xs text-charcoal-400">
                {product.total_sold.toLocaleString("id-ID")} terjual
              </span>
            </>
          )}
        </div>

        {/* Price & CTA */}
        <div className="flex items-end justify-between gap-2">
          <div>
            <div className="font-display font-bold text-forest-700 text-base">
              {formatPrice(product.price ?? 0)}
            </div>
            <div className="text-charcoal-400 text-xs">
              per {product.unit} · min. {product.min_order} {product.unit}
            </div>
          </div>
          <button
            className="flex-shrink-0 w-9 h-9 rounded-xl bg-forest-600 hover:bg-forest-500 text-white flex items-center justify-center shadow-sm hover:shadow-glass active:scale-95 transition-all duration-150"
            aria-label={`Tambah ${product.name} ke keranjang`}
          >
            <ShoppingCart className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Eco impact */}
        {product.co2_saved && (
          <div className="mt-2.5 pt-2.5 border-t border-border/60 flex items-center gap-1.5">
            <TreeDeciduous className="w-3 h-3 text-moss-500 flex-shrink-0" aria-hidden="true" />
            <span className="text-[10px] text-moss-600 font-medium">
              Hemat {product.co2_saved} kg CO₂ per pembelian
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Featured Products Section
export function FeaturedProducts() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="section-padding bg-white"
      aria-label="Produk unggulan Nyiur Nanggroe"
    >
      <div className="container-base">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold tracking-wide uppercase mb-4">
              <Star className="w-3 h-3 fill-current" aria-hidden="true" />
              Produk Pilihan Minggu Ini
            </div>
            <h2 className="font-display text-display-md font-bold text-charcoal-800 leading-tight">
              Produk{" "}
              <span className="text-gradient-amber">Terlaris &amp; Terpilih</span>
            </h2>
            <p className="text-charcoal-500 text-base mt-2 max-w-md">
              Dikurasi oleh tim kami dan direkomendasikan oleh AI berdasarkan
              kualitas, ulasan, dan dampak lingkungan.
            </p>
          </div>
          <Link
            href="/produk"
            className="group flex items-center gap-2 text-forest-600 font-semibold text-sm hover:text-forest-700 transition-colors flex-shrink-0"
          >
            Lihat Semua
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {MOCK_PRODUCTS.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-14"
        >
          <Link
            href="/produk"
            className="inline-flex items-center gap-2 btn-primary px-8 py-3.5 text-base"
          >
            Jelajahi 2.400+ Produk
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <p className="text-charcoal-400 text-sm mt-3">
            Dari petani dan UMKM terpercaya di seluruh Aceh dan Indonesia
          </p>
        </motion.div>
      </div>
    </section>
  );
}
