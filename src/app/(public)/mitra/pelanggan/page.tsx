"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MitraSidebar } from "@/components/layout/MitraSidebar";
import { Search, MapPin, Calendar, Heart, FileText, ShoppingBag } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";

// Mock customer database for the seller
const MOCK_CUSTOMERS = [
  {
    id: "cust-1",
    name: "Ahmad Maulana",
    email: "ahmad.maulana@gmail.com",
    avatar: null,
    location: "Banda Aceh, Aceh",
    joinedDate: "2025-02-14",
    totalOrders: 6,
    totalSpent: 840000,
    favProduct: "Briket Kelapa Premium Hexagon",
    notes: "Lebih menyukai pengiriman via J&T Express. Respon selalu cepat.",
    lastOrderDate: "2026-06-25",
  },
  {
    id: "cust-2",
    name: "Budi Santoso",
    email: "budi.santoso@yahoo.com",
    avatar: null,
    location: "Langsa, Aceh",
    joinedDate: "2025-05-18",
    totalOrders: 3,
    totalSpent: 425000,
    favProduct: "Arang Aktif Kelapa 1kg",
    notes: "Pembeli korporasi. Sering meminta invoice resmi cetak.",
    lastOrderDate: "2026-06-24",
  },
  {
    id: "cust-3",
    name: "Siti Aisyah",
    email: "siti.aisyah@gmail.com",
    avatar: null,
    location: "Lhokseumawe, Aceh",
    joinedDate: "2025-09-02",
    totalOrders: 2,
    totalSpent: 185000,
    favProduct: "Pot Sabut Kelapa (Cocopot)",
    notes: "Pegiat urban farming. Sangat peduli kemasan ramah lingkungan.",
    lastOrderDate: "2026-06-23",
  },
];

export default function MitraCustomersPage() {
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  const [search, setSearch] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>("cust-1");

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-24 md:pt-28 pb-8">
        <div className="container-base">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <MitraSidebar activeId="customers" />
            </aside>

            <div className="lg:col-span-3 space-y-6">
              <div>
                <h1 className="text-xl font-bold text-charcoal-800">Manajemen Pelanggan</h1>
                <p className="text-xs text-charcoal-500 mt-0.5">Pantau daftar pelanggan setia, riwayat belanja, dan preferensi produk mereka.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Customer List Column */}
                <div className="md:col-span-1 bg-white border border-border/60 rounded-3xl p-4 space-y-4 shadow-sm flex flex-col h-[520px]">
                  <div className="flex items-center gap-2 border px-3 py-2 rounded-xl bg-mist/20 shrink-0">
                    <Search className="w-4 h-4 text-charcoal-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Cari pelanggan..."
                      className="bg-transparent border-none outline-none text-xs w-full text-charcoal placeholder:text-charcoal-350"
                    />
                  </div>

                  <div className="overflow-y-auto flex-1 space-y-1.5 scrollbar-none pr-1">
                    {filteredCustomers.length === 0 ? (
                      <p className="text-center text-xs text-charcoal-400 py-10 font-medium">Pelanggan tidak ditemukan.</p>
                    ) : (
                      filteredCustomers.map(cust => (
                        <button
                          key={cust.id}
                          onClick={() => setSelectedCustomerId(cust.id)}
                          className={cn(
                            "w-full text-left p-3 rounded-2xl border transition-all flex items-center gap-3",
                            selectedCustomerId === cust.id
                              ? "bg-forest-50 border-forest-300 shadow-sm"
                              : "border-border hover:bg-mist/20"
                          )}
                        >
                          <div className="w-9 h-9 rounded-xl bg-forest-100 flex items-center justify-center font-bold text-forest-700 text-sm shrink-0">
                            {cust.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-xs font-bold text-charcoal-800 truncate">{cust.name}</h3>
                            <p className="text-[10px] text-charcoal-400 truncate">{cust.email}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Customer Details Display Column */}
                <div className="md:col-span-2 bg-white border border-border/60 rounded-3xl p-6 shadow-sm min-h-[520px] flex flex-col justify-between">
                  {selectedCustomer ? (
                    <div className="space-y-6">
                      {/* Customer Card Header */}
                      <div className="flex items-center gap-4 border-b border-border pb-5">
                        <div className="w-14 h-14 rounded-2xl bg-forest-100 flex items-center justify-center font-bold text-forest-700 text-2xl">
                          {selectedCustomer.name.charAt(0)}
                        </div>
                        <div className="space-y-0.5">
                          <h2 className="text-base font-bold text-charcoal-800">{selectedCustomer.name}</h2>
                          <p className="text-xs text-charcoal-500">{selectedCustomer.email}</p>
                          <p className="text-[10px] text-charcoal-400 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-charcoal-350" /> {selectedCustomer.location}
                          </p>
                        </div>
                      </div>

                      {/* Summary Metrics */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border border-border/60 p-4 rounded-xl flex items-center gap-3">
                          <ShoppingBag className="w-5 h-5 text-forest-600" />
                          <div>
                            <p className="text-sm font-bold text-charcoal-800">{selectedCustomer.totalOrders} Transaksi</p>
                            <p className="text-[10px] text-charcoal-400">Frekuensi Belanja</p>
                          </div>
                        </div>
                        <div className="border border-border/60 p-4 rounded-xl flex items-center gap-3">
                          <p className="text-sm font-bold text-forest-700">{formatPrice(selectedCustomer.totalSpent)}</p>
                          <div>
                            <p className="text-sm font-bold text-charcoal-800"></p>
                            <p className="text-[10px] text-charcoal-400">Total Akumulasi Pembelian</p>
                          </div>
                        </div>
                      </div>

                      {/* Detail Section details */}
                      <div className="space-y-4 pt-2">
                        {/* Favorite Product */}
                        <div className="flex items-start gap-3">
                          <Heart className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <p className="text-xs font-semibold text-charcoal-700">Produk Terfavorit</p>
                            <p className="text-xs text-charcoal-500 font-medium">{selectedCustomer.favProduct}</p>
                          </div>
                        </div>

                        {/* Customer Notes */}
                        <div className="flex items-start gap-3">
                          <FileText className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <p className="text-xs font-semibold text-charcoal-700">Catatan Pelanggan</p>
                            <p className="text-xs text-charcoal-500 leading-relaxed italic">&ldquo;{selectedCustomer.notes}&rdquo;</p>
                          </div>
                        </div>

                        {/* Timeline */}
                        <div className="flex items-start gap-3">
                          <Calendar className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <p className="text-xs font-semibold text-charcoal-700">Aktivitas Terakhir</p>
                            <p className="text-xs text-charcoal-500">
                              Order terakhir tanggal <span className="font-semibold text-charcoal-700">{new Date(selectedCustomer.lastOrderDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-charcoal-400 text-xs font-medium">
                      Pilih pelanggan untuk melihat rincian detail.
                    </div>
                  )}
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
