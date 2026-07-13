"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard, Package, ShoppingBag, BarChart3,
  Plus, Edit2, Trash2, Eye, Search, ToggleLeft, ToggleRight
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useCurrentUser } from "@/lib/stores/auth-store";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export default function MitraProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const user = useCurrentUser();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/dashboard/products");
        const json = await res.json();
        if (json.success) {
          setProducts(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentStatus })
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, is_active: !currentStatus } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProduct = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini dari katalog?")) {
      try {
        const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
        if (res.ok) {
          setProducts((prev) => prev.filter((p) => p.id !== id));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

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
                  const isCurrent = menu.id === "products";
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

            {/* Catalog Content */}
            <div className="lg:col-span-3 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-charcoal-800">Katalog Produk Toko</h1>
                  <p className="text-xs text-charcoal-500 mt-0.5">Kelola informasi harga, stok, dan deskripsi produk kelapa Anda.</p>
                </div>
                <Link href="/mitra/produk/tambah" className="btn-primary gap-1.5 self-start sm:self-auto text-xs py-2.5">
                  <Plus className="w-4 h-4" /> Tambah Produk Baru
                </Link>
              </div>

              {/* Filters / Search catalog */}
              <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-border/60">
                <Search className="w-5 h-5 text-charcoal-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama produk di katalog..."
                  className="bg-transparent border-none outline-none text-sm text-charcoal-700 w-full placeholder:text-charcoal-300"
                />
              </div>

              {/* Product catalog table */}
              <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-mist/30 text-charcoal-500 font-semibold border-b border-border/60">
                        <th className="p-4">Produk</th>
                        <th className="p-4">Kategori</th>
                        <th className="p-4">Harga</th>
                        <th className="p-4">Stok</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {loading ? (
                        <tr><td colSpan={6} className="p-4 text-center text-charcoal-400 text-xs">Memuat produk...</td></tr>
                      ) : filteredProducts.length === 0 ? (
                        <tr><td colSpan={6} className="p-4 text-center text-charcoal-400 text-xs">Tidak ada produk ditemukan.</td></tr>
                      ) : (
                        filteredProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-mist/20 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-mist flex-shrink-0">
                                  {p.images?.[0] && (
                                    <Image
                                      src={p.images[0].url || p.images[0]}
                                      alt={p.name}
                                      fill
                                      className="object-cover"
                                    />
                                  )}
                                </div>
                                <span className="font-semibold text-charcoal-800 line-clamp-1">{p.name}</span>
                              </div>
                            </td>
                            <td className="p-4 text-charcoal-500">{p.categories?.name || p.category?.name || "Lainnya"}</td>
                            <td className="p-4 font-bold text-forest-700">{formatPrice(p.price)}</td>
                            <td className="p-4 text-charcoal-600">{p.stock} {p.unit}</td>
                            <td className="p-4">
                              <button
                                onClick={() => toggleStatus(p.slug || p.id, p.is_active)}
                                className="text-charcoal-600 hover:text-forest-600"
                                aria-label="Ubah status aktif"
                              >
                                {p.is_active ? (
                                  <span className="flex items-center gap-1 text-moss-600 font-semibold">
                                    <ToggleRight className="w-6 h-6" /> Aktif
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 text-charcoal-400">
                                    <ToggleLeft className="w-6 h-6" /> Nonaktif
                                  </span>
                                )}
                              </button>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-center gap-2">
                                <Link href={`/produk/${p.slug}`} className="p-1.5 rounded-lg text-charcoal-400 hover:text-forest-600 hover:bg-mist transition-colors">
                                  <Eye className="w-4 h-4" />
                                </Link>
                                <button className="p-1.5 rounded-lg text-charcoal-400 hover:text-amber hover:bg-mist transition-colors">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => deleteProduct(p.slug || p.id)} className="p-1.5 rounded-lg text-charcoal-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
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
