"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MitraSidebar } from "@/components/layout/MitraSidebar";
import { Settings, Shield, Bell, Key, Globe, Eye, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MitraSettingsPage() {
  const [activeSubTab, setActiveSubTab] = useState<"store" | "security" | "notifications" | "privacy">("store");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("Pengaturan berhasil disimpan! ✓");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-24 md:pt-28 pb-8">
        <div className="container-base">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <MitraSidebar activeId="settings" />
            </aside>

            <div className="lg:col-span-3 space-y-6">
              <div>
                <h1 className="text-xl font-bold text-charcoal-800">Pengaturan Mitra</h1>
                <p className="text-xs text-charcoal-500 mt-0.5">Kelola preferensi akun, keamanan, pemberitahuan, dan kebijakan privasi toko Anda.</p>
              </div>

              {successMsg && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs py-3 px-4 rounded-xl font-bold">
                  {successMsg}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                {/* Secondary navigation tab list */}
                <div className="md:col-span-1 bg-white border border-border/60 rounded-3xl p-3 space-y-1 shadow-sm">
                  {[
                    { id: "store", label: "Akun Toko", icon: Settings },
                    { id: "security", label: "Keamanan", icon: Shield },
                    { id: "notifications", label: "Notifikasi", icon: Bell },
                    { id: "privacy", label: "Privasi", icon: Eye }
                  ].map(sub => {
                    const Icon = sub.icon;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => setActiveSubTab(sub.id as any)}
                        className={cn(
                          "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors",
                          activeSubTab === sub.id
                            ? "bg-forest-50 text-forest-750 font-bold border border-forest-100 shadow-sm"
                            : "text-charcoal hover:bg-mist/35"
                        )}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {sub.label}
                      </button>
                    );
                  })}
                </div>

                {/* Sub Tab contents Form */}
                <div className="md:col-span-3 bg-white border border-border/60 rounded-3xl p-6 shadow-sm">
                  <form onSubmit={handleSave} className="space-y-6">
                    {/* Akun Toko */}
                    {activeSubTab === "store" && (
                      <div className="space-y-4">
                        <h3 className="text-sm font-bold text-charcoal-800 border-b pb-2">Informasi Akun Toko</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-semibold text-charcoal-500 block mb-1">Mata Uang Default</label>
                            <select className="input-base text-xs py-2">
                              <option>Rupiah (IDR)</option>
                              <option>US Dollar (USD)</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-charcoal-500 block mb-1">Bahasa Dasbor</label>
                            <div className="relative">
                              <select className="input-base text-xs py-2 pl-8">
                                <option>Bahasa Indonesia</option>
                                <option>English</option>
                              </select>
                              <Globe className="absolute left-2.5 top-2.5 w-4 h-4 text-charcoal-400" />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-charcoal-500 block mb-1">Email Korespondensi Bisnis</label>
                          <input type="email" defaultValue="karyanyiur@gmail.com" className="input-base text-xs py-2" />
                        </div>
                      </div>
                    )}

                    {/* Keamanan */}
                    {activeSubTab === "security" && (
                      <div className="space-y-4">
                        <h3 className="text-sm font-bold text-charcoal-800 border-b pb-2">Kata Sandi & Kunci</h3>
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs font-semibold text-charcoal-500 block mb-1">Kata Sandi Lama</label>
                            <input type="password" placeholder="••••••••" className="input-base text-xs py-2" />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-semibold text-charcoal-500 block mb-1">Kata Sandi Baru</label>
                              <input type="password" placeholder="Min. 8 karakter" className="input-base text-xs py-2" />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-charcoal-500 block mb-1">Ulangi Kata Sandi Baru</label>
                              <input type="password" placeholder="Ulangi sandi" className="input-base text-xs py-2" />
                            </div>
                          </div>
                        </div>

                        <div className="border-t pt-4 space-y-3">
                          <h4 className="text-xs font-bold text-charcoal-700">Verifikasi 2 Langkah (2FA)</h4>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-charcoal-500 leading-normal max-w-xs">Tambahkan lapisan keamanan ekstra ke dasbor toko Anda.</span>
                            <button type="button" className="text-xs font-bold text-forest-650 bg-forest-50 border px-3 py-1.5 rounded-xl">Aktifkan</button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Notifikasi */}
                    {activeSubTab === "notifications" && (
                      <div className="space-y-4">
                        <h3 className="text-sm font-bold text-charcoal-800 border-b pb-2">Preferensi Pemberitahuan</h3>
                        <div className="space-y-3">
                          {[
                            { title: "Pesanan Baru Masuk", desc: "Kirim email otomatis saat ada pembeli memesan produk." },
                            { title: "Laporan Stok Menipis", desc: "Beri tahu saya jika persediaan produk di bawah limit aman." },
                            { title: "Notifikasi Kuis Baru", desc: "Dapatkan info edukasi circular kelapa mingguan." }
                          ].map((pref, idx) => (
                            <div key={idx} className="flex justify-between items-center py-2 border-b last:border-b-0">
                              <div>
                                <p className="text-xs font-bold text-charcoal-800">{pref.title}</p>
                                <p className="text-[10px] text-charcoal-450 leading-normal">{pref.desc}</p>
                              </div>
                              <input type="checkbox" defaultChecked className="w-4 h-4 accent-forest-600 rounded" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Privasi */}
                    {activeSubTab === "privacy" && (
                      <div className="space-y-4">
                        <h3 className="text-sm font-bold text-charcoal-800 border-b pb-2">Otorisasi & Akses</h3>
                        <div className="flex justify-between items-center py-2">
                          <div>
                            <p className="text-xs font-bold text-charcoal-800">Tampilkan Toko di Rekomendasi Publik</p>
                            <p className="text-[10px] text-charcoal-450 leading-normal">Aktifkan opsi ini agar toko Anda direkomendasikan AI Nyai Nyiur ke pembeli.</p>
                          </div>
                          <input type="checkbox" defaultChecked className="w-4 h-4 accent-forest-600 rounded" />
                        </div>
                        <div className="flex justify-between items-center py-2 border-t">
                          <div>
                            <p className="text-xs font-bold text-charcoal-800">Bagikan Lokasi Pengiriman</p>
                            <p className="text-[10px] text-charcoal-450 leading-normal">Gunakan koordinat GPS kota untuk menghitung kalkulasi ongkir secara real-time.</p>
                          </div>
                          <input type="checkbox" defaultChecked className="w-4 h-4 accent-forest-600 rounded" />
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end pt-2 border-t">
                      <button type="submit" className="btn-primary py-2.5 px-4 text-xs font-bold shadow-lg shadow-forest-600/10">
                        Simpan Pengaturan
                      </button>
                    </div>
                  </form>
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
