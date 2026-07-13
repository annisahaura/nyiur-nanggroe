"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, ShieldCheck, Star, Store, Search } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MOCK_STORES } from "@/lib/data/marketplace-data";
import { formatNumber } from "@/lib/utils";

export default function PenjualDirectoryPage() {
  const [query, setQuery] = useState("");

  const stores = MOCK_STORES.filter(
    (s) =>
      s.is_active &&
      (s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.location.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-24 md:pt-28 pb-8">
        <div className="container-base">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center">
              <Store className="w-5 h-5 text-forest-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-charcoal-800">
              Direktori Penjual
            </h1>
          </div>
          <p className="text-charcoal-500 mb-6">
            Temukan petani, UMKM, dan mitra terverifikasi yang menjual produk kelapa di Nyiur Nanggroe.
          </p>

          {/* Search */}
          <div className="relative max-w-md mb-8">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-300" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama toko atau lokasi..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm outline-none focus:border-forest-400"
            />
          </div>

          {/* Store grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store, index) => (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
              >
                <Link href={`/toko/${store.slug}`} className="group card-base flex flex-col overflow-hidden h-full">
                  <div className="relative h-28 w-full bg-forest-700">
                    {store.banner_url && (
                      <Image
                        src={store.banner_url}
                        alt={`${store.name} banner`}
                        fill
                        className="object-cover opacity-80"
                      />
                    )}
                  </div>
                  <div className="p-4 pt-0 flex flex-col flex-1">
                    <div className="-mt-8 mb-3">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-sm bg-forest-100 flex items-center justify-center">
                        {store.logo_url ? (
                          <Image
                            src={store.logo_url}
                            alt={store.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <Store className="w-6 h-6 text-forest-500" />
                        )}
                      </div>
                    </div>
                    <h3 className="font-bold text-charcoal-800 flex items-center gap-1.5 group-hover:text-forest-600 transition-colors">
                      {store.name}
                      {store.is_verified && (
                        <ShieldCheck className="w-4 h-4 text-forest-500 flex-shrink-0" />
                      )}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-charcoal-400 mt-1 mb-3">
                      <MapPin className="w-3.5 h-3.5" /> {store.location}
                    </div>
                    <p className="text-sm text-charcoal-500 line-clamp-2 mb-4 flex-1">
                      {store.description}
                    </p>
                    <div className="flex items-center justify-between text-xs pt-3 border-t border-border/60">
                      <span className="flex items-center gap-1 font-semibold text-charcoal-700">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        {store.rating.toFixed(1)}
                      </span>
                      <span className="text-charcoal-400">
                        {formatNumber(store.total_sales)} terjual
                      </span>
                      <span className="text-charcoal-400">
                        {store.total_products} produk
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {stores.length === 0 && (
            <p className="text-center text-charcoal-400 py-16">
              Tidak ada penjual yang cocok dengan pencarian &quot;{query}&quot;.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
