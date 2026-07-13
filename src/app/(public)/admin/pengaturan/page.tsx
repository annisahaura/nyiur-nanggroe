"use client";

import { useState } from "react";
import AdminLayout from "../layout";
import { Settings, ShieldCheck, Sparkles, Percent, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminSettingsPage() {
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    commissionRate: 2.5,
    announcement: "Selamat datang di Nyiur Nanggroe! Nikmati kemudahan bertransaksi produk kelapa ramah lingkungan di Aceh.",
    aiModel: "gemini-1.5-flash",
    aiTemperature: 0.7,
    maxTokens: 512,
    adminEmail: "admin@nyiurnanggroe.id"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("Pengaturan sistem berhasil disimpan secara global! ✓");
    setTimeout(() => setSuccess(""), 4000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-charcoal-800">Pengaturan Sistem Global</h1>
          <p className="text-xs text-charcoal-500 mt-0.5">Konfigurasi potongan komisi platform, global banner promo, parameter token AI Nyai Nyiur, dan email admin utama.</p>
        </div>

        {success && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs py-3 px-4 rounded-xl font-bold">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main system config Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* General & Fee */}
            <div className="bg-white border border-border/60 rounded-3xl p-6 space-y-4 shadow-sm">
              <h3 className="text-xs font-bold text-charcoal-800 border-b pb-3 uppercase tracking-wider flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-forest-650" /> Biaya & Komisi Platform
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal-600 block">Persentase Komisi (%)</label>
                  <input
                    type="number"
                    value={formData.commissionRate}
                    onChange={(e) => setFormData({ ...formData, commissionRate: parseFloat(e.target.value) || 0 })}
                    step="0.1"
                    className="input-base text-xs py-2.5 font-bold"
                  />
                  <p className="text-[10px] text-charcoal-400">Potongan otomatis dari total transaksi penjual.</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal-600 block">Email Kontak Administrator</label>
                  <input
                    type="email"
                    value={formData.adminEmail}
                    onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                    className="input-base text-xs py-2.5"
                  />
                </div>
              </div>
            </div>

            {/* Announcement Banner */}
            <div className="bg-white border border-border/60 rounded-3xl p-6 space-y-4 shadow-sm">
              <h3 className="text-xs font-bold text-charcoal-800 border-b pb-3 uppercase tracking-wider flex items-center gap-1.5">
                <Megaphone className="w-4 h-4 text-forest-650" /> Pengumuman Banner Global
              </h3>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-charcoal-600 block">Teks Pengumuman</label>
                <textarea
                  rows={3}
                  value={formData.announcement}
                  onChange={(e) => setFormData({ ...formData, announcement: e.target.value })}
                  className="input-base text-xs py-2.5 leading-relaxed"
                />
                <p className="text-[10px] text-charcoal-400">Teks ini akan bergulir di bagian atas Header platform untuk semua pengunjung.</p>
              </div>
            </div>
          </div>

          {/* AI Settings Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-border/60 rounded-3xl p-6 space-y-4 shadow-sm">
              <h3 className="text-xs font-bold text-charcoal-800 border-b pb-3 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-forest-650" /> Konfigurasi AI Nyai Nyiur
              </h3>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal-600 block">Model LLM Utama</label>
                  <select
                    value={formData.aiModel}
                    onChange={(e) => setFormData({ ...formData, aiModel: e.target.value })}
                    className="input-base text-xs py-2.5"
                  >
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash (Default)</option>
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal-600 block">Temperature ({formData.aiTemperature})</label>
                  <input
                    type="range"
                    min="0.0"
                    max="1.0"
                    step="0.1"
                    value={formData.aiTemperature}
                    onChange={(e) => setFormData({ ...formData, aiTemperature: parseFloat(e.target.value) })}
                    className="w-full accent-forest-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] font-bold text-charcoal-400">
                    <span>FOKUS / AKURAT</span>
                    <span>KREATIF / LUAS</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-charcoal-600 block">Max Completion Tokens</label>
                  <input
                    type="number"
                    value={formData.maxTokens}
                    onChange={(e) => setFormData({ ...formData, maxTokens: parseInt(e.target.value) || 256 })}
                    className="input-base text-xs py-2.5"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-primary justify-center py-3.5 shadow-lg shadow-forest-600/15 font-bold"
            >
              Simpan Semua Perubahan
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
