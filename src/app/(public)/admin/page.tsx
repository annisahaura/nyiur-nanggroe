"use client";

import AdminLayout from "./layout";
import { Users, Store, Package, DollarSign, TrendingUp, ArrowUpRight, Activity } from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";

const STATS = [
  { label: "Total Pengguna", value: 842, change: "+14.2%", icon: Users, color: "text-blue-600 bg-blue-50 border-blue-100" },
  { label: "Mitra Terverifikasi", value: 32, change: "+6.8%", icon: Store, color: "text-forest-750 bg-forest-50 border-forest-100" },
  { label: "Produk Aktif", value: 184, change: "+11.5%", icon: Package, color: "text-amber bg-amber-50 border-amber-100" },
  { label: "Pendapatan Platform", value: 18240000, change: "+8.9%", icon: DollarSign, color: "text-emerald-700 bg-emerald-50 border-emerald-100" }
];

const RECENT_ACTIVITIES = [
  { id: 1, action: "Registrasi Mitra Baru", user: "Koperasi Kelapa Jaya", time: "5 menit yang lalu" },
  { id: 2, action: "Produk Ditangguhkan", user: "Briket Kelapa Murah oleh Toko B", time: "1 jam yang lalu" },
  { id: 3, action: "Pembaruan Kuis Edukasi", user: "Admin (Kelola Kuis 3)", time: "3 jam yang lalu" },
  { id: 4, action: "Pembayaran Platform Cair", user: "Toko Karya Nyiur (Rp 840.000)", time: "Kemarin" }
];

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-charcoal-800">Dashboard Utama</h1>
          <p className="text-xs text-charcoal-500 mt-0.5">Ringkasan matrik pertumbuhan platform, log transaksi, dan aktivitas sistem Nyiur Nanggroe.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className={`bg-white border rounded-2xl p-5 space-y-3 shadow-sm ${stat.color}`}>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-charcoal-550 font-bold uppercase tracking-wider">{stat.label}</span>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 bg-white">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <p className="text-lg font-bold text-charcoal-850">
                    {typeof stat.value === "number" && stat.label.includes("Pendapatan")
                      ? formatPrice(stat.value)
                      : stat.value}
                  </p>
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> {stat.change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Mock Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Trend chart mock */}
          <div className="lg:col-span-2 bg-white border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="text-xs font-bold text-charcoal-800 uppercase tracking-wider">Trend Volume Penjualan (6 Bulan Terakhir)</h3>
                <p className="text-[10px] text-charcoal-450 mt-0.5">Perkembangan GMV penjualan kelapa sirkular.</p>
              </div>
              <span className="text-[10px] font-bold text-forest-700 bg-forest-50 px-2.5 py-1 rounded-full border border-forest-100 flex items-center gap-0.5">
                Target Tercapai <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>

            {/* Custom Mock Bar Chart graph design */}
            <div className="h-44 flex items-end justify-between pt-4 px-2">
              {[
                { label: "Jan", val: "h-[30%]" },
                { label: "Feb", val: "h-[45%]" },
                { label: "Mar", val: "h-[65%]" },
                { label: "Apr", val: "h-[50%]" },
                { label: "Mei", val: "h-[80%]" },
                { label: "Jun", val: "h-[95%]" }
              ].map((bar, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                  <div className="w-full max-w-[24px] bg-forest-200 group-hover:bg-forest-600 rounded-lg transition-all duration-300 relative" style={{ height: "100%" }}>
                    <div className={cn("absolute bottom-0 inset-x-0 bg-forest-600 rounded-lg", bar.val)} />
                  </div>
                  <span className="text-[10px] text-charcoal-450 font-bold">{bar.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Log */}
          <div className="lg:col-span-1 bg-white border border-border/60 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-charcoal-800 border-b pb-3 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4.5 h-4.5 text-forest-650" /> Log Aktivitas Terkini
            </h3>
            <div className="space-y-4">
              {RECENT_ACTIVITIES.map(act => (
                <div key={act.id} className="flex items-start gap-3 text-xs leading-normal">
                  <div className="w-1.5 h-1.5 bg-forest-500 rounded-full mt-1.5 shrink-0" />
                  <div className="space-y-0.5">
                    <p className="font-bold text-charcoal-850">{act.action}</p>
                    <p className="text-[10px] text-charcoal-500">{act.user}</p>
                    <p className="text-[9px] text-charcoal-400">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
