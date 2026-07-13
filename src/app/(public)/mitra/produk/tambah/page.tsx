"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Package, ShoppingBag, BarChart3,
  ArrowLeft, Upload, Sparkles, Check, Info
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "cat-1", name: "Tempurung Kelapa" },
  { id: "cat-2", name: "Sabut & Cocopeat" },
  { id: "cat-3", name: "Arang & Briket" },
  { id: "cat-4", name: "Minyak Kelapa" },
  { id: "cat-5", name: "Kerajinan Tangan" },
  { id: "cat-6", name: "Produk Olahan" },
];

export default function AddProductPage() {
  const [form, setForm] = useState({
    name: "",
    category: "cat-1",
    description: "",
    price: "",
    stock: "",
    weight: "",
    unit: "kg",
    minOrder: "1",
    productType: "raw", // "raw" | "processed"
    rawMaterial: "sabut",
    isEcoCertified: false,
    co2Saved: "",
    wasteDiverted: "",
  });

  const [aiSuggestions, setAiSuggestions] = useState({
    title: "",
    desc: "",
    co2: "",
    suggestedPrice: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAI = () => {
    if (!form.name) {
      alert("Masukkan nama produk terlebih dahulu.");
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      setAiSuggestions({
        title: form.name + " Premium Organik",
        desc: `Produk ${form.name} berkualitas tinggi yang diolah langsung oleh kelompok tani lokal Aceh secara berkelanjutan. Sangat ramah lingkungan dengan kandungan nutrisi/karbon maksimal.`,
        co2: "1.8",
        suggestedPrice: "48000",
      });
      setIsGenerating(false);
    }, 1200);
  };

  const handleApplySuggestion = () => {
    setForm({
      ...form,
      name: aiSuggestions.title || form.name,
      description: aiSuggestions.desc || form.description,
      co2Saved: aiSuggestions.co2 || form.co2Saved,
      price: aiSuggestions.suggestedPrice || form.price,
    });
    setAiSuggestions({ title: "", desc: "", co2: "", suggestedPrice: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Produk berhasil ditambahkan ke katalog!");
    window.location.href = "/mitra/produk";
  };

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

            {/* Form Content */}
            <div className="lg:col-span-3 space-y-6">
              <div className="flex items-center gap-4">
                <Link href="/mitra/produk" className="p-2 rounded-xl bg-white border border-border text-charcoal-500 hover:bg-mist">
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <div>
                  <h1 className="text-xl font-bold text-charcoal-800">Tambah Produk</h1>
                  <p className="text-xs text-charcoal-500 mt-0.5">Unggah produk kelapa inovatif baru ke marketplace Nyiur Nanggroe.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                {/* Form Inputs */}
                <form onSubmit={handleSubmit} className="xl:col-span-2 bg-white rounded-2xl border border-border/60 p-6 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold text-charcoal-500 block mb-1">Nama Produk</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Contoh: Cocopeat Organik Blok 5kg"
                          className="input-base"
                          required
                        />
                        <button
                          type="button"
                          onClick={handleGenerateAI}
                          className="px-3.5 py-3 rounded-xl bg-forest-50 border border-forest-200 text-forest-600 font-semibold text-xs hover:bg-forest-100 flex items-center gap-1.5 flex-shrink-0"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber" /> AI Generate
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-charcoal-500 block mb-1">Kategori Produk</label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="input-base bg-white"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-charcoal-500 block mb-1">Tipe Produk</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, productType: "raw" })}
                          className={cn(
                            "py-2.5 rounded-xl border text-xs font-semibold text-center transition-colors",
                            form.productType === "raw" ? "border-forest-600 bg-forest-50 text-forest-700" : "border-border hover:border-charcoal-300"
                          )}
                        >
                          Bahan Mentah
                        </button>
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, productType: "processed" })}
                          className={cn(
                            "py-2.5 rounded-xl border text-xs font-semibold text-center transition-colors",
                            form.productType === "processed" ? "border-forest-600 bg-forest-50 text-forest-700" : "border-border hover:border-charcoal-300"
                          )}
                        >
                          Produk Olahan
                        </button>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold text-charcoal-500 block mb-1">Deskripsi Lengkap</label>
                      <textarea
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="Jelaskan kualitas, ukuran, manfaat, dan petunjuk pemakaian produk..."
                        className="input-base min-h-[120px] py-2.5"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-charcoal-500 block mb-1">Harga Satuan (Rp)</label>
                      <input
                        type="number"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        placeholder="Contoh: 15000"
                        className="input-base"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-charcoal-500 block mb-1">Stok Awal</label>
                      <input
                        type="number"
                        value={form.stock}
                        onChange={(e) => setForm({ ...form, stock: e.target.value })}
                        placeholder="Contoh: 100"
                        className="input-base"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-charcoal-500 block mb-1">Berat Produk (gram)</label>
                      <input
                        type="number"
                        value={form.weight}
                        onChange={(e) => setForm({ ...form, weight: e.target.value })}
                        placeholder="Contoh: 5000"
                        className="input-base"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-charcoal-500 block mb-1">Satuan Jual / Kemasan</label>
                      <input
                        type="text"
                        value={form.unit}
                        onChange={(e) => setForm({ ...form, unit: e.target.value })}
                        placeholder="Contoh: kg, karung, botol, pcs"
                        className="input-base"
                        required
                      />
                    </div>

                    <div className="md:col-span-2 border-t border-border/40 pt-4 mt-2">
                      <h3 className="text-xs font-bold text-charcoal-800 mb-3 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-forest-600" /> Metrik Keberlanjutan & Dampak
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-charcoal-500 block mb-1">Potensi CO₂ Dihemat (kg / unit)</label>
                          <input
                            type="text"
                            value={form.co2Saved}
                            onChange={(e) => setForm({ ...form, co2Saved: e.target.value })}
                            placeholder="Contoh: 1.2"
                            className="input-base"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-charcoal-500 block mb-1">Potensi Limbah Dialihkan (kg / unit)</label>
                          <input
                            type="text"
                            value={form.wasteDiverted}
                            onChange={(e) => setForm({ ...form, wasteDiverted: e.target.value })}
                            placeholder="Contoh: 5.0"
                            className="input-base"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold text-charcoal-500 block mb-1">Foto Produk</label>
                      <div className="border-2 border-dashed border-charcoal-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-center cursor-pointer hover:border-forest-500 transition-colors">
                        <Upload className="w-8 h-8 text-charcoal-400" />
                        <span className="text-xs font-semibold text-charcoal-700">Unggah foto produk</span>
                        <span className="text-[10px] text-charcoal-400">Maks. 5 foto (ukuran maks. 5MB)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-4 border-t border-border/40">
                    <Link href="/mitra/produk" className="btn-secondary py-3 text-xs">Batal</Link>
                    <button type="submit" className="btn-primary py-3 text-xs">Simpan Produk</button>
                  </div>
                </form>

                {/* AI Assistant Suggestions Sidebar */}
                <div className="xl:col-span-1 space-y-4">
                  <div className="bg-white rounded-2xl border border-border/60 p-5 space-y-4">
                    <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                      <h3 className="text-sm font-bold text-charcoal-800">Nyai Nyiur AI Assistant</h3>
                    </div>
                    {isGenerating ? (
                      <div className="py-8 text-center text-xs text-charcoal-400 flex flex-col items-center justify-center gap-2">
                        <div className="w-6 h-6 border-2 border-forest-600 border-t-transparent animate-spin rounded-full" />
                        Membuat deskripsi & metrik dampak optimal...
                      </div>
                    ) : aiSuggestions.title ? (
                      <div className="space-y-4">
                        <div className="p-3.5 bg-forest-50 border border-forest-200 rounded-xl space-y-2 text-xs">
                          <p className="font-bold text-forest-700">Saran Judul Premium:</p>
                          <p className="text-charcoal-700">{aiSuggestions.title}</p>
                          <p className="font-bold text-forest-700 mt-2">Saran Deskripsi:</p>
                          <p className="text-charcoal-700 leading-normal">{aiSuggestions.desc}</p>
                          <p className="font-bold text-forest-700 mt-2">Estimasi CO₂:</p>
                          <p className="text-charcoal-700">{aiSuggestions.co2} kg CO₂/unit</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleApplySuggestion}
                          className="w-full btn-primary gap-1.5 py-2.5 text-xs justify-center"
                        >
                          <Check className="w-4 h-4" /> Terapkan Saran AI
                        </button>
                      </div>
                    ) : (
                      <div className="text-xs text-charcoal-500 leading-relaxed flex items-start gap-2">
                        <Info className="w-4 h-4 text-forest-500 flex-shrink-0" />
                        <span>Ketikkan Nama Produk dan klik tombol &ldquo;AI Generate&rdquo; untuk dibantu melengkapi judul premium, deskripsi produk, harga optimal, dan estimasi CO₂ dihemat.</span>
                      </div>
                    )}
                  </div>
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
