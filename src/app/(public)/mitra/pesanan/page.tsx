"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Package, ShoppingBag, BarChart3,
  Search, Eye, ArrowRight, Check, Ship, Truck
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

import { useEffect } from "react";
import { useCurrentUser } from "@/lib/stores/auth-store";

export default function MitraOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const user = useCurrentUser();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/dashboard/orders");
        const json = await res.json();
        if (json.success) {
          setOrders(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o.order_number.toLowerCase().includes(search.toLowerCase()) || (o.profiles?.full_name || o.buyer_id).toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filter === "all" || o.status === filter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-24 md:pt-28 pb-8">
        <div className="container-base">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl border border-border/60 p-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center font-bold text-forest-700 text-lg uppercase">
                  {user?.store_name?.charAt(0) || "T"}
                </div>
                <div>
                  <p className="text-sm font-bold text-charcoal-800">{user?.store_name || "Toko Mitra"}</p>
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
                  const isCurrent = menu.id === "orders";
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

            {/* Orders Content */}
            <div className="lg:col-span-3 space-y-6">
              <div>
                <h1 className="text-xl font-bold text-charcoal-800">Daftar Pesanan Pembeli</h1>
                <p className="text-xs text-charcoal-500 mt-0.5">Kelola status pengiriman, nomor resi, dan validasi pesanan masuk.</p>
              </div>

              {/* Toolbar search & filters */}
              <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-border/60 justify-between items-center">
                <div className="flex items-center gap-2 bg-mist/40 px-3 py-2 rounded-xl border border-border/40 w-full sm:max-w-xs">
                  <Search className="w-4 h-4 text-charcoal-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari ID pesanan, nama pembeli..."
                    className="bg-transparent border-none outline-none text-xs text-charcoal-700 w-full placeholder:text-charcoal-300"
                  />
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 w-full sm:w-auto">
                  {[
                    { id: "all", label: "Semua" },
                    { id: "pending", label: "Perlu Diproses" },
                    { id: "shipped", label: "Sedang Dikirim" },
                    { id: "delivered", label: "Selesai" },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => setFilter(btn.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors",
                        filter === btn.id ? "bg-forest-600 text-white" : "bg-mist hover:bg-forest-50 hover:text-forest-600 text-charcoal-600"
                      )}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order List */}
              <div className="space-y-4">
                {loading ? (
                  <div className="bg-white rounded-2xl border border-border/60 p-5 text-center text-charcoal-500 text-sm py-10 animate-pulse">Memuat daftar pesanan...</div>
                ) : filteredOrders.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-border/60 p-5 text-center text-charcoal-500 text-sm py-10">Belum ada pesanan yang sesuai filter.</div>
                ) : (
                  filteredOrders.map((o) => (
                    <div key={o.id} className="bg-white rounded-2xl border border-border/60 p-5 space-y-4 shadow-sm">
                      <div className="flex justify-between items-center border-b border-border/40 pb-3 flex-wrap gap-2 text-xs sm:text-sm">
                        <div>
                          <p className="font-semibold text-charcoal-800">Pesanan {o.order_number}</p>
                          <p className="text-xs text-charcoal-400 mt-0.5">Diterima {new Date(o.created_at).toLocaleDateString("id-ID")}</p>
                        </div>
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-semibold capitalize",
                          o.status === "pending" ? "bg-red-50 text-red-600 border border-red-200" : o.status === "shipped" ? "bg-amber-50 text-amber-600 border border-amber-200" : "bg-moss-50 text-moss-600 border border-moss-200"
                        )}>
                          {o.status === "pending" ? "Perlu Diproses" : o.status === "shipped" ? "Sedang Dikirim" : "Selesai"}
                        </span>
                      </div>
  
                      <div className="text-xs sm:text-sm space-y-2">
                        <p className="text-charcoal-600"><strong>Pembeli:</strong> {o.profiles?.full_name || o.buyer_id} ({o.profiles?.phone || "-"})</p>
                        <p className="text-charcoal-600"><strong>Alamat:</strong> {o.shipping_address ? (o.shipping_address as any).address : "-"}</p>
                        <p className="text-charcoal-500"><strong>Item:</strong> {o.order_items?.map((i: any) => `${i.products?.name} (${i.quantity}x)`).join(", ")}</p>
                      </div>
  
                      <div className="border-t border-border/40 pt-3 flex items-center justify-between flex-wrap gap-3">
                        <div>
                          <span className="text-xs text-charcoal-500 mr-2">Total Pembayaran:</span>
                          <span className="text-sm font-bold text-forest-700">{formatPrice(o.total)}</span>
                        </div>
  
                        {/* Status quick actions */}
                        <div className="flex gap-2">
                          {o.status === "pending" && (
                            <button
                              onClick={() => updateStatus(o.id, "shipped")}
                              className="btn-primary gap-1 py-2 text-xs font-semibold"
                            >
                              <Truck className="w-3.5 h-3.5" /> Konfirmasi Pengiriman
                            </button>
                          )}
                          {o.status === "shipped" && (
                            <button
                              onClick={() => updateStatus(o.id, "completed")}
                              className="btn-primary bg-moss hover:bg-moss-600 gap-1 py-2 text-xs font-semibold"
                            >
                              <Check className="w-3.5 h-3.5" /> Selesaikan Pesanan
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
