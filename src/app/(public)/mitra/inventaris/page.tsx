"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MitraSidebar } from "@/components/layout/MitraSidebar";
import { cn, formatPrice } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Info, Search, Edit3 } from "lucide-react";

// Mock products for inventory management
const INITIAL_INVENTORY = [
  { id: "p-1", name: "Briket Kelapa Premium Hexagon 1kg", sku: "NN-BRIK-001", stock: 120, price: 45000, category: "Arang & Briket", status: "normal" },
  { id: "p-2", name: "VCO Murni Cold-Pressed 500ml", sku: "NN-VCO-002", stock: 3, price: 95000, category: "Minyak Kelapa", status: "low" },
  { id: "p-3", name: "Kerajinan Mangkok Tempurung Kelapa", sku: "NN-CRAF-003", stock: 45, price: 35000, category: "Kerajinan Tangan", status: "normal" },
  { id: "p-4", name: "Cocopeat Premium Organik 50L", sku: "NN-PEAT-004", stock: 0, price: 25000, category: "Sabut & Cocopeat", status: "empty" },
  { id: "p-5", name: "Pot Sabut Kelapa (Cocopot) Diameter 15cm", sku: "NN-POT-005", stock: 85, price: 15000, category: "Sabut & Cocopeat", status: "normal" }
];

export default function MitraInventoryPage() {
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [filter, setFilter] = useState<"all" | "low" | "empty" | "normal">("all");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState(0);

  const handleUpdateStock = (id: string) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        let status = "normal";
        if (editStock === 0) status = "empty";
        else if (editStock <= 5) status = "low";
        return { ...item, stock: editStock, status };
      }
      return item;
    }));
    setEditingId(null);
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || item.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-24 md:pt-28 pb-8">
        <div className="container-base">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <MitraSidebar activeId="inventory" />
            </aside>

            <div className="lg:col-span-3 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-charcoal-800">Manajemen Inventaris</h1>
                  <p className="text-xs text-charcoal-500 mt-0.5">Pantau jumlah stok dan lakukan pembaruan persediaan produk secara instan.</p>
                </div>
              </div>

              {/* Status Alert Panels */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-forest-50 flex items-center justify-center text-forest-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-charcoal-850">{inventory.filter(i => i.status === "normal").length}</p>
                    <p className="text-[11px] text-charcoal-400 font-semibold uppercase">Stok Aman</p>
                  </div>
                </div>
                <div className="bg-white border rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-charcoal-850">{inventory.filter(i => i.status === "low").length}</p>
                    <p className="text-[11px] text-charcoal-400 font-semibold uppercase">Stok Menipis</p>
                  </div>
                </div>
                <div className="bg-white border rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-650">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-charcoal-850">{inventory.filter(i => i.status === "empty").length}</p>
                    <p className="text-[11px] text-charcoal-400 font-semibold uppercase">Stok Habis</p>
                  </div>
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-2xl border border-border/60">
                <div className="flex-1 flex items-center gap-2 border px-3.5 py-2.5 rounded-xl bg-mist/20">
                  <Search className="w-4.5 h-4.5 text-charcoal-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari berdasarkan nama produk atau SKU..."
                    className="bg-transparent border-none outline-none text-sm w-full text-charcoal placeholder:text-charcoal-350"
                  />
                </div>
                <div className="flex gap-2.5 overflow-x-auto">
                  {[
                    { id: "all", label: "Semua" },
                    { id: "normal", label: "Aman" },
                    { id: "low", label: "Menipis" },
                    { id: "empty", label: "Habis" }
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

              {/* Inventory Table Card */}
              <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-mist/35 border-b border-border text-xs text-charcoal-500 font-bold uppercase">
                        <th className="px-5 py-4">SKU / Nama Produk</th>
                        <th className="px-5 py-4">Kategori</th>
                        <th className="px-5 py-4">Harga Unit</th>
                        <th className="px-5 py-4 text-center">Status</th>
                        <th className="px-5 py-4 text-right">Stok</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60 text-sm">
                      {filteredInventory.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-5 py-10 text-center text-charcoal-400 text-xs font-medium">
                            Tidak ada produk inventaris yang cocok dengan kriteria filter.
                          </td>
                        </tr>
                      ) : (
                        filteredInventory.map((item) => (
                          <tr key={item.id} className="hover:bg-mist/10 transition-colors">
                            <td className="px-5 py-4">
                              <span className="text-[10px] bg-mist/60 border font-mono px-2 py-0.5 rounded text-charcoal-500">{item.sku}</span>
                              <p className="font-semibold text-charcoal-800 mt-1 max-w-[280px] leading-snug">{item.name}</p>
                            </td>
                            <td className="px-5 py-4 text-xs font-semibold text-charcoal-500">{item.category}</td>
                            <td className="px-5 py-4 font-semibold text-charcoal-700">{formatPrice(item.price)}</td>
                            <td className="px-5 py-4 text-center">
                              <span className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize",
                                item.status === "normal" && "bg-forest-50 text-forest-750 border-forest-100",
                                item.status === "low" && "bg-amber-50 text-amber-700 border-amber-100",
                                item.status === "empty" && "bg-red-50 text-red-705 border-red-100"
                              )}>
                                {item.status === "normal" ? "Aman" : item.status === "low" ? "Menipis" : "Habis"}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-right">
                              {editingId === item.id ? (
                                <div className="flex items-center justify-end gap-1.5">
                                  <input
                                    type="number"
                                    value={editStock}
                                    onChange={(e) => setEditStock(parseInt(e.target.value) || 0)}
                                    className="w-16 px-2 py-1 border rounded-lg text-center font-bold text-xs"
                                    min="0"
                                  />
                                  <button
                                    onClick={() => handleUpdateStock(item.id)}
                                    className="px-2.5 py-1 bg-forest-600 text-white rounded-lg text-xs font-bold"
                                  >
                                    Simpan
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-end gap-2 group">
                                  <span className="font-bold text-charcoal-850">{item.stock}</span>
                                  <button
                                    onClick={() => { setEditingId(item.id); setEditStock(item.stock); }}
                                    className="p-1 rounded hover:bg-mist text-charcoal-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
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
