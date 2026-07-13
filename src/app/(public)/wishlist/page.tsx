"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Package, Trash2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ui/ProductCard";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { getFeaturedProducts } from "@/lib/data/marketplace-data";

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const clear = useWishlistStore((s) => s.clear);

  const recommendations = getFeaturedProducts(4).filter(
    (p) => !items.some((i) => i.id === p.id)
  );

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main id="main-content" className="min-h-[70vh] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 px-4"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-mist flex items-center justify-center">
              <Heart className="w-12 h-12 text-charcoal-300" />
            </div>
            <h1 className="text-2xl font-bold text-charcoal-800 mb-2">
              Belum Ada Produk Disukai
            </h1>
            <p className="text-charcoal-500 mb-8 max-w-sm mx-auto">
              Ketuk ikon hati di produk yang kamu suka, biar gampang ditemukan lagi
              nanti di sini.
            </p>
            <Link href="/produk" className="btn-primary">
              <Package className="w-4 h-4" />
              Jelajahi Produk
            </Link>

            {recommendations.length > 0 && (
              <div className="mt-16 text-left container-narrow">
                <h2 className="text-lg font-bold text-charcoal-800 mb-4">
                  Rekomendasi Untukmu
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {recommendations.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-cream pt-24 md:pt-28 pb-8 md:pt-24 md:pt-28 pb-12">
        <div className="container-base">
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-charcoal-800">
                Produk Disukai
              </h1>
              <p className="text-sm text-charcoal-500 mt-1">
                {items.length} produk tersimpan di daftar keinginanmu.
              </p>
            </div>
            <button
              onClick={clear}
              className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Kosongkan Semua
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
