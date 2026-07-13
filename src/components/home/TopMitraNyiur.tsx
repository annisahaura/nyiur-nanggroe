"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { MapPin, ShieldCheck, Star } from "lucide-react";
import Link from "next/link";
import { MOCK_STORES } from "@/lib/data/marketplace-data";

// Ambil toko dengan rating & penjualan tertinggi dari data yang benar-benar
// ada, supaya kartu di sini selalu bisa diklik ke halaman toko yang valid.
const TOP_SELLERS = [...MOCK_STORES]
  .sort((a, b) => b.rating * b.total_sales - a.rating * a.total_sales)
  .slice(0, 4);

export function TopMitraNyiur() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="section-padding bg-white relative" id="top-mitra">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="container-base relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-50 border border-forest-200 text-forest-700 text-xs font-semibold tracking-wide uppercase mb-5">
            Mitra Terverifikasi
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-charcoal mb-4 leading-tight">
            Kenalan dengan <span className="text-gradient-forest">Mitra Terbaik Kami</span>
          </h2>
          <p className="text-charcoal-400 text-lg leading-relaxed">
            Dukung petani lokal, UMKM, dan koperasi terverifikasi yang menghasilkan
            produk kelapa berkelanjutan kelas dunia.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOP_SELLERS.map((seller, index) => (
            <motion.div
              key={seller.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <Link
                href={`/toko/${seller.slug}`}
                className="group card-base flex flex-col p-6 hover:shadow-xl transition-all duration-300"
              >
                {/* Profile Header */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-forest-100 group-hover:border-forest-300 transition-colors">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={seller.logo_url ?? ""} 
                      alt={seller.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-charcoal group-hover:text-forest-600 transition-colors flex items-center gap-1.5">
                      {seller.name}
                      {seller.is_verified && <ShieldCheck className="w-4 h-4 text-forest-500" />}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-charcoal-400 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {seller.location}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-border mb-4">
                  <div>
                    <p className="text-xs text-charcoal-400 mb-1">Rating</p>
                    <div className="flex items-center gap-1 font-semibold text-charcoal">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      {seller.rating.toFixed(1)}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-charcoal-400 mb-1">Total Penjualan</p>
                    <p className="font-semibold text-charcoal">{seller.total_sales.toLocaleString("id-ID")}+</p>
                  </div>
                </div>

                <p className="text-xs text-charcoal-500 line-clamp-2">
                  {seller.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
