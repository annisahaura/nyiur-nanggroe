"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Package, ShoppingBag, BarChart3,
  Calendar, ArrowUpRight, TrendingUp, TrendingDown,
  DollarSign, ShoppingCart, Percent, Heart, Sparkles, MapPin
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

const BEST_SELLERS = [
  { name: "Briket Kelapa Premium Hexagon", sold: 120, revenue: 5400000, co2: "288 kg" },
  { name: "VCO Murni Cold-Pressed 500ml", sold: 85, revenue: 8075000, co2: "25.5 kg" },
  { name: "Cocopeat Premium Organik 50L", sold: 62, revenue: 5270000, co2: "49.6 kg" },
];

const CUSTOMER_LOCATIONS = [
  { province: "DKI Jakarta", count: 48, percentage: 42 },
  { province: "Aceh", count: 28, percentage: 25 },
  { province: "Jawa Barat", count: 22, percentage: 19 },
  { province: "Sumatera Utara", count: 16, percentage: 14 },
];

export default function MitraAnalyticsPage() {
  const [timeframe, setTimeframe] = useState("month");

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-24 md:pt-28 pb-8">
        <div className="container-base">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl border border-border/60 p-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center font-bold text-forest-700 text-lg">
                  K
                </div>
                <div>
                  <p className="text-sm font-bold text-charcoal-800">Karya Nyiur Aceh</p>
                  <p className="text-xs text-charcoal-400">Mitra Terverifikasi 🌿</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-border/60 p-3 space-y-1">
                {[
                  { id: "overview", label: "Ringkasan", href: "/mitra", icon: LayoutDashboard },
                  { id: "products", label: "Kelola Produk", href: "/mitra/produk", icon: Package },
                  { id: "orders", label: "Kelola Pesanan", href: "/mitra/pesanan", icon: ShoppingBag },
                  { id: "analytics", label: "Analitik Toko", href: "/mitra/analitik", icon: BarChart3 },
                ].map((menu) => {
                  const Icon = menu.icon;
                  const isCurrent = menu.id === "analytics";
                  return (
                    <Link
                      key={menu.id}
                      href={menu.href}
                      className={cn(
                        "flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-colors",
                        isCurrent
                          ? "bg-forest-600 text-white font-semibold"
                          : "text-charcoal-600 hover:bg-mist"
                      )}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {menu.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Analytics Content */}
            <div className="lg:col-span-3 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-charcoal-800">Analitik & Laporan Penjualan</h1>
                  <p className="text-xs text-charcoal-500 mt-0.5">Analisis performa finansial, konversi pesanan, dan distribusi pasar toko Anda.</p>
                </div>
                <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-border self-start sm:self-auto">
                  {[
                    { id: "week", label: "Minggu Ini" },
                    { id: "month", label: "Bulan Ini" },
                    { id: "year", label: "Tahun Ini" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTimeframe(t.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                        timeframe === t.id ? "bg-forest-600 text-white" : "text-charcoal-600 hover:bg-mist"
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Metric Card Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Rata-rata Nilai Pesanan", value: 240800, change: "+5.2%", status: "up", icon: DollarSign },
                  { label: "Tingkat Konversi", value: "3.24%", change: "+1.1%", status: "up", icon: Percent },
                  { label: "Tingkat Retensi Pelanggan", value: "28.5%", change: "-2.3%", status: "down", icon: Heart },
                ].map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <div key={idx} className="bg-white rounded-2xl border border-border/60 p-5 space-y-3 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-charcoal-400 font-semibold">{card.label}</span>
                        <div className="w-8 h-8 rounded-lg bg-mist flex items-center justify-center text-forest-600">
                          <Icon className="w-4.5 h-4.5" />
                        </div>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-charcoal-800">
                          {typeof card.value === "number" ? formatPrice(card.value) : card.value}
                        </p>
                        <p className={cn(
                          "text-[10px] flex items-center gap-0.5 font-bold mt-1",
                          card.status === "up" ? "text-moss-600" : "text-red-500"
                        )}>
                          {card.status === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {card.change} vs periode sebelumnya
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Best selling products */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-border/60 p-5 space-y-4">
                  <h3 className="text-sm font-bold text-charcoal-800 border-b border-border/40 pb-3">Produk Terlaris</h3>
                  <div className="space-y-4">
                    {BEST_SELLERS.map((p, idx) => (
                      <div key={idx} className="flex justify-between items-center gap-4 text-xs sm:text-sm">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-charcoal-800 truncate">{p.name}</p>
                          <p className="text-[10px] text-charcoal-400 mt-0.5">{p.sold} unit terjual · hemat {p.co2} CO₂</p>
                        </div>
                        <span className="font-bold text-forest-700">{formatPrice(p.revenue)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer locations breakdown */}
                <div className="bg-white rounded-2xl border border-border/60 p-5 space-y-4">
                  <h3 className="text-sm font-bold text-charcoal-800 border-b border-border/40 pb-3 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-forest-600" /> Demografi Pelanggan
                  </h3>
                  <div className="space-y-3">
                    {CUSTOMER_LOCATIONS.map((loc, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-charcoal-700">
                          <span>{loc.province}</span>
                          <span>{loc.count} orders ({loc.percentage}%)</span>
                        </div>
                        <div className="h-1.5 bg-charcoal-100 rounded-full overflow-hidden">
                          <div className="h-full bg-forest-600 rounded-full" style={{ width: `${loc.percentage}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Weekly Analytics report */}
              <div className="bg-white rounded-2xl border border-border/60 p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h3 className="text-sm font-bold text-charcoal-800">Rekomendasi Nyai Nyiur AI</h3>
                </div>
                <div className="text-xs text-charcoal-600 leading-relaxed space-y-3">
                  <p>🔹 <strong>Peluang Pasar DKI Jakarta:</strong> Penjualan di daerah Jakarta mengalami kenaikan 42%. Anda disarankan meluncurkan promo gratis ongkir dengan kurir ekspres khusus daerah Jabodetabek untuk memaksimalkan konversi.</p>
                  <p>🔹 <strong>Optimalkan Stok Briket:</strong> Tingkat retensi pembeli briket hexagon cukup tinggi. Pertimbangkan untuk menyediakan opsi paket berlangganan atau grosir 10kg untuk restoran/lounge.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
