"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Leaf,
  Cloud,
  Store,
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  Recycle,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { formatNumber } from "@/lib/utils";

interface ImpactData {
  total_waste_diverted: number;
  total_co2_saved: number;
  total_sellers: number;
  total_products: number;
  total_transactions: number;
  total_communities: number;
  monthly_growth: number;
}

const FALLBACK: ImpactData = {
  total_waste_diverted: 0,
  total_co2_saved: 0,
  total_sellers: 0,
  total_products: 0,
  total_transactions: 0,
  total_communities: 0,
  monthly_growth: 0,
};

export default function DampakPage() {
  const [data, setData] = useState<ImpactData>(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImpact = async () => {
      try {
        const res = await fetch("/api/impact");
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        }
      } catch {
        // Biarkan tampil dengan nilai 0 kalau gagal — jangan bikin halaman error total.
      } finally {
        setLoading(false);
      }
    };
    fetchImpact();
  }, []);

  const stats = [
    {
      icon: Recycle,
      label: "Sampah Kelapa Teralihkan",
      value: `${formatNumber(data.total_waste_diverted)} kg`,
      color: "text-forest-600 bg-forest-50",
    },
    {
      icon: Cloud,
      label: "Emisi CO2 Terselamatkan",
      value: `${formatNumber(data.total_co2_saved)} kg`,
      color: "text-blue-600 bg-blue-50",
    },
    {
      icon: Store,
      label: "Mitra & UMKM Aktif",
      value: formatNumber(data.total_sellers),
      color: "text-amber-600 bg-amber-50",
    },
    {
      icon: Package,
      label: "Produk Terdaftar",
      value: formatNumber(data.total_products),
      color: "text-moss-600 bg-moss-50",
    },
    {
      icon: ShoppingBag,
      label: "Transaksi Berjalan",
      value: formatNumber(data.total_transactions),
      color: "text-forest-600 bg-forest-50",
    },
    {
      icon: Users,
      label: "Komunitas Terlibat",
      value: formatNumber(data.total_communities),
      color: "text-blue-600 bg-blue-50",
    },
  ];

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-cream">
        {/* Hero */}
        <section className="page-hero pt-28 pb-16 md:pt-36 md:pb-20">
          <div className="container-base relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-cream text-xs font-semibold mb-5">
                <Leaf className="w-3.5 h-3.5" />
                Ekonomi Sirkular Kelapa
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
                Dampak Kita Bersama
              </h1>
              <p className="text-white/70 text-base md:text-lg">
                Setiap transaksi di Nyiur Nanggroe ikut mengurangi sampah kelapa
                yang dibuang begitu saja, dan membantu UMKM Aceh berkembang lewat
                ekonomi sirkular.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats grid */}
        <section className="py-14 md:py-20">
          <div className="container-base">
            {data.monthly_growth > 0 && !loading && (
              <div className="flex items-center justify-center gap-2 mb-8 text-sm text-forest-700 font-semibold">
                <TrendingUp className="w-4 h-4" />
                Tumbuh {data.monthly_growth}% dibanding bulan lalu
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl border border-border/60 p-6 shadow-sm"
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${stat.color}`}
                  >
                    <stat.icon className="w-5 h-5" />
                  </div>
                  {loading ? (
                    <div className="h-8 w-24 bg-mist rounded animate-pulse mb-1" />
                  ) : (
                    <p className="text-2xl md:text-3xl font-display font-bold text-charcoal-800">
                      {stat.value}
                    </p>
                  )}
                  <p className="text-sm text-charcoal-500 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Explanation section */}
        <section className="py-14 md:py-20 bg-white border-t border-border/60">
          <div className="container-narrow">
            <h2 className="text-2xl font-display font-bold text-charcoal-800 mb-4 text-center">
              Kenapa Ekonomi Sirkular Kelapa Penting?
            </h2>
            <p className="text-charcoal-500 text-center max-w-2xl mx-auto mb-10">
              Indonesia adalah salah satu penghasil kelapa terbesar di dunia,
              tapi sebagian besar sisa tempurung, sabut, dan air kelapa masih
              berakhir jadi sampah. Nyiur Nanggroe mempertemukan petani, UMKM,
              dan pembeli supaya seluruh bagian kelapa punya nilai — bukan
              cuma dagingnya.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center px-4">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-forest-50 flex items-center justify-center">
                  <Recycle className="w-6 h-6 text-forest-600" />
                </div>
                <h3 className="font-bold text-charcoal-800 mb-1.5">Kurangi Sampah</h3>
                <p className="text-sm text-charcoal-500">
                  Tempurung dan sabut kelapa diolah jadi briket, cocopeat, dan
                  kerajinan — bukan dibakar atau dibuang.
                </p>
              </div>
              <div className="text-center px-4">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Store className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-bold text-charcoal-800 mb-1.5">Dorong UMKM</h3>
                <p className="text-sm text-charcoal-500">
                  Petani dan pengrajin kelapa mendapat pasar yang lebih luas
                  dan harga yang lebih adil.
                </p>
              </div>
              <div className="text-center px-4">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Cloud className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-charcoal-800 mb-1.5">Tekan Emisi</h3>
                <p className="text-sm text-charcoal-500">
                  Mengolah sisa kelapa menjadi produk bernilai memangkas emisi
                  dibanding membakar atau membuangnya begitu saja.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
