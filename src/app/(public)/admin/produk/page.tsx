"use client";

import { useState } from "react";
import AdminLayout from "../layout";
import { Search, AlertTriangle, Eye, ShieldAlert, Check } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";

// Mock products database for admin view
const INITIAL_PRODUCTS = [
  { id: "p-1", name: "Briket Kelapa Premium Hexagon 1kg", store: "Karya Nyiur Aceh", price: 45000, stock: 120, status: "active", isEco: true },
  { id: "p-2", name: "VCO Murni Cold-Pressed 500ml", store: "Minyak Kelapa Sejahtera", price: 95000, stock: 3, status: "active", isEco: false },
  { id: "p-3", name: "Kerajinan Mangkok Tempurung Kelapa", store: "Koperasi Nanggroe Lestari", price: 35000, stock: 45, status: "active", isEco: true },
  { id: "p-4", name: "Cocopeat Premium Organik 50L", store: "Toko B", price: 25000, stock: 0, status: "flagged", isEco: false }
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "flagged">("all");

  const handleToggleStatus = (id: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, status: p.status === "active" ? "flagged" : "active" };
      }
      return p;
    }));
  };

  const handleToggleEco = (id: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, isEco: !p.isEco };
      }
      return p;
    }));
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.store.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-charcoal-800">Katalog Produk Terdaftar</h1>
          <p className="text-xs text-charcoal-500 mt-0.5">Kendalikan peredaran produk lintas mitra, tinjau status sertifikasi ramah lingkungan, atau tandai produk palsu.</p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-2xl border border-border/60 shadow-sm">
          <div className="flex-1 flex items-center gap-2 border px-3.5 py-2.5 rounded-xl bg-mist/20">
            <Search className="w-4.5 h-4.5 text-charcoal-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari berdasarkan nama produk atau nama toko..."
              className="bg-transparent border-none outline-none text-xs w-full text-charcoal placeholder:text-charcoal-350"
            />
          </div>
          <div className="flex gap-2.5 overflow-x-auto">
            {[
              { id: "all", label: "Semua Produk" },
              { id: "active", label: "Aktif" },
              { id: "flagged", label: "Ditandai (Flagged)" }
            ].map(btn => (
              <button
                key={btn.id}
                onClick={() => setFilter(btn.id as any)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all",
                  filter === btn.id
                    ? "bg-forest-600 border-forest-600 text-white shadow-sm"
                    : "bg-white border-border text-charcoal hover:bg-mist"
                )}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Table List */}
        <div className="bg-white rounded-3xl border border-border/60 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-mist/35 border-b border-border text-xs text-charcoal-500 font-bold uppercase">
                  <th className="px-5 py-4">Nama Produk / Toko</th>
                  <th className="px-5 py-4">Harga Unit</th>
                  <th className="px-5 py-4 text-center">Eco-Sertifikasi</th>
                  <th className="px-5 py-4 text-center">Status</th>
                  <th className="px-5 py-4 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-sm">
                {filteredProducts.map(p => (
                  <tr key={p.id} className="hover:bg-mist/10 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-bold text-charcoal-850">{p.name}</p>
                      <p className="text-[10px] text-charcoal-450 mt-0.5">Toko: {p.store}</p>
                    </td>
                    <td className="px-5 py-4 font-semibold text-charcoal-700">{formatPrice(p.price)}</td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => handleToggleEco(p.id)}
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-[9px] font-bold border transition-colors",
                          p.isEco
                            ? "bg-forest-50 text-forest-750 border-forest-150"
                            : "bg-charcoal-50 text-charcoal-400 border-charcoal-200"
                        )}
                      >
                        {p.isEco ? "🌿 Bersertifikat" : "Tidak"}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                        p.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-700 border-red-150"
                      )}>
                        {p.status === "active" ? "Aktif" : "Ditandai"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => handleToggleStatus(p.id)}
                          className={cn(
                            "text-xs font-bold transition-all",
                            p.status === "active" ? "text-red-500 hover:text-red-600" : "text-emerald-650 hover:text-emerald-705"
                          )}
                        >
                          {p.status === "active" ? "Tandai Pelanggaran" : "Aktifkan"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
