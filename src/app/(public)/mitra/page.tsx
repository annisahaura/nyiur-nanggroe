"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Package, ShoppingBag, BarChart3, Settings,
  Store, ShieldCheck, Leaf, Landmark, ArrowUpRight, TrendingUp,
  AlertTriangle, DollarSign, Users, Award, HelpCircle
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

// Mock stats removed. Data fetched from API.

import { useEffect } from "react";
import { useCurrentUser } from "@/lib/stores/auth-store";

export default function MitraDashboardPage() {
  const [activeMenu, setActiveMenu] = useState("overview");
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const user = useCurrentUser();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/dashboard/overview");
        const json = await res.json();
        if (json.success) {
          setDashboardData(json.data);
        }
      } catch (err) {
        console.error("Gagal memuat data dashboard", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const statsList = dashboardData ? [
    { label: "Total Pendapatan", value: dashboardData.statistics.total_revenue || 0, change: "N/A", trend: "neutral", icon: DollarSign, color: "text-forest-600 bg-forest-50" },
    { label: "Pesanan Selesai", value: dashboardData.statistics.completed_orders || 0, change: "N/A", trend: "neutral", icon: ShoppingBag, color: "text-amber bg-amber-50" },
    { label: "Total Pelanggan", value: dashboardData.statistics.total_customers || 0, change: "N/A", trend: "neutral", icon: Users, color: "text-blue-600 bg-blue-50" },
    { label: "Total Review", value: dashboardData.statistics.total_reviews || 0, change: "N/A", trend: "neutral", icon: Award, color: "text-moss-600 bg-moss-50" },
  ] : [];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-24 md:pt-28 pb-8">
        <div className="container-base">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Menu Dashboard */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl border border-border/60 p-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center font-bold text-forest-700 text-lg uppercase">
                  {user?.store_name?.charAt(0) || "T"}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-bold text-charcoal-800">{user?.store_name || "Toko Mitra"}</p>
                    <ShieldCheck className="w-3.5 h-3.5 text-forest-500" />
                  </div>
                  <p className="text-xs text-charcoal-400">Mitra Terverifikasi 🌿</p>
                </div>
              </div>

              {/* Navigation list */}
              <div className="bg-white rounded-2xl border border-border/60 p-3 space-y-1">
                {[
                  { id: "overview", label: "Ringkasan", href: "/mitra", icon: LayoutDashboard },
                  { id: "products", label: "Kelola Produk", href: "/mitra/produk", icon: Package },
                  { id: "orders", label: "Kelola Pesanan", href: "/mitra/pesanan", icon: ShoppingBag },
                  { id: "analytics", label: "Analitik Toko", href: "/mitra/analitik", icon: BarChart3 },
                ].map((menu) => {
                  const Icon = menu.icon;
                  const isCurrent = activeMenu === menu.id;
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

            {/* Main Content Dashboard */}
            <div className="lg:col-span-3 space-y-6">
              {/* Alert low stock */}
              {dashboardData?.lowStockAlerts?.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold">Stok Hampir Habis</h4>
                    <p className="text-xs text-amber-700 mt-0.5">
                      Ada {dashboardData.lowStockAlerts.length} produk yang menyisakan stok di bawah 5 unit (mis. {dashboardData.lowStockAlerts[0]?.name}). Segera update stok di menu kelola produk.
                    </p>
                  </div>
                </div>
              )}

              {/* Stats widgets */}
              {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-2xl border border-border/60 p-4 h-28" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {statsList.map((s, idx) => {
                    const Icon = s.icon;
                    return (
                      <div key={idx} className="bg-white rounded-2xl border border-border/60 p-4 space-y-3 shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-charcoal-400 font-medium">{s.label}</span>
                          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", s.color)}>
                            <Icon className="w-4 h-4" />
                          </div>
                        </div>
                        <div>
                          <p className="text-base sm:text-lg font-bold text-charcoal-800">
                            {s.label.includes("Pendapatan") ? formatPrice(s.value, { compact: true }) : s.value}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Chart and Activity placeholder layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Visual metric placeholder chart */}
                <div className="md:col-span-2 bg-white rounded-2xl border border-border/60 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-charcoal-800">Grafik Penjualan Mingguan</h3>
                    <span className="text-xs text-forest-600 font-semibold flex items-center gap-0.5">
                      Lihat Detail <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  {/* Mock visual bar chart */}
                  <div className="h-48 flex items-end justify-between gap-2.5 pt-4 px-2">
                    {[12, 18, 15, 25, 32, 28, 42].map((val, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full bg-forest-600 rounded-t-lg transition-all hover:bg-forest-500 cursor-pointer" style={{ height: `${val * 3}px` }} />
                        <span className="text-[10px] text-charcoal-400 font-medium">Hari {idx + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right achievements metrics */}
                <div className="md:col-span-1 bg-gradient-to-br from-forest-700 to-moss rounded-2xl border border-forest-600 p-5 text-white flex flex-col justify-between">
                  <div>
                    <Award className="w-7 h-7 text-amber-300 mb-3" />
                    <h3 className="text-sm font-bold">Dampak Keberlanjutan Toko</h3>
                    <p className="text-xs text-white/80 mt-1 leading-relaxed">Toko Anda telah berkontribusi mencegah emisi sebesar 4.8 ton CO₂ di Nyiur Nanggroe.</p>
                  </div>
                  <div className="border-t border-white/20 pt-3 mt-4 flex items-center justify-between text-xs">
                    <span className="text-white/60">Peringkat Dampak</span>
                    <span className="font-bold text-amber-300">Top 5% Mitra 🏆</span>
                  </div>
                </div>
              </div>

              {/* Recent Orders table */}
              <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-charcoal-800">Pesanan Terbaru</h3>
                  <Link href="/mitra/pesanan" className="text-xs text-forest-600 font-semibold hover:text-forest-500">
                    Lihat Semua Pesanan
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-mist/30 text-charcoal-500 font-semibold border-b border-border/60">
                        <th className="p-4">ID Pesanan</th>
                        <th className="p-4">Pelanggan</th>
                        <th className="p-4">Produk</th>
                        <th className="p-4">Total</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {loading ? (
                        <tr><td colSpan={5} className="p-4 text-center text-charcoal-400 text-xs">Memuat pesanan...</td></tr>
                      ) : dashboardData?.recentOrders?.length === 0 ? (
                        <tr><td colSpan={5} className="p-4 text-center text-charcoal-400 text-xs">Belum ada pesanan masuk.</td></tr>
                      ) : (
                        dashboardData?.recentOrders?.map((order: any) => (
                          <tr key={order.id} className="hover:bg-mist/20 transition-colors">
                            <td className="p-4 font-semibold text-charcoal-800">{order.order_number}</td>
                            <td className="p-4 text-charcoal-600">Pelanggan #{order.buyer_id.substring(0,6)}</td>
                            <td className="p-4 text-charcoal-500 truncate max-w-[150px]">-</td>
                            <td className="p-4 font-bold text-forest-700">{formatPrice(order.total)}</td>
                            <td className="p-4">
                              <span className={cn(
                                "px-2.5 py-0.5 rounded-full text-[10px] font-semibold border uppercase",
                                order.status === "completed" ? "bg-moss-50 text-moss-600 border-moss-200" : "bg-amber-50 text-amber-700 border-amber-200"
                              )}>{order.status}</span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
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
