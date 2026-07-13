"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store, ShieldCheck, FileText, CheckCircle2, ChevronRight,
  ArrowLeft, Upload, ArrowRight, Sparkles, Building, Image as ImageIcon
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuthStore } from "@/lib/stores/auth-store";
import { cn } from "@/lib/utils";

export default function BecomeMitraPage() {

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);
  const [form, setForm] = useState({
    businessName: "",
    businessType: "perorangan", // "perorangan" | "umkm" | "koperasi"
    whatsapp: "",
    instagram: "",
    storeName: "",
    storeSlug: "",
    description: "",
    location: "Banda Aceh",
    logo: null as string | null,
    banner: null as string | null,
    ktpName: "",
    ktpNumber: "",
    ktpPhoto: null as string | null,
    categories: [] as string[],
  });

  const validateStep = (targetStep: number): string | null => {
    if (targetStep === 1) {
      if (!form.businessName.trim()) return "Isi dulu nama pemilik / usaha Anda.";
      const digits = form.whatsapp.replace(/\D/g, "");
      if (digits.length < 9) return "Isi nomor WhatsApp yang valid (minimal 9 digit).";
      return null;
    }
    if (targetStep === 2) {
      if (!form.storeName.trim()) return "Isi dulu nama toko / brand Anda.";
      if (!form.storeSlug.trim()) return "Slug toko tidak boleh kosong.";
      if (form.description.trim().length < 20) return "Deskripsi toko minimal 20 karakter agar pembeli paham produk Anda.";
      if (form.categories.length === 0) return "Pilih minimal 1 kategori produk.";
      if (!form.logo) return "Unggah logo toko terlebih dahulu.";
      if (!form.banner) return "Unggah banner toko terlebih dahulu.";
      return null;
    }
    if (targetStep === 3) {
      if (!form.ktpName.trim()) return "Isi nama lengkap sesuai KTP.";
      const nik = form.ktpNumber.replace(/\D/g, "");
      if (nik.length !== 16) return "Nomor NIK KTP harus 16 digit.";
      if (!form.ktpPhoto) return "Unggah foto KTP terlebih dahulu.";
      return null;
    }
    return null;
  };

  const handleNext = () => {
    const error = validateStep(step);
    if (error) {
      setStepError(error);
      return;
    }
    setStepError(null);
    setStep((s) => Math.min(4, s + 1));
  };
  const handlePrev = () => {
    setStepError(null);
    setStep((s) => Math.max(1, s - 1));
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    // Fields are intentionally optional in this wizard so people can click
    // through quickly — but the backend still requires a minimum-length
    // store name/slug/description. Fill in sensible defaults for whatever
    // was left blank instead of blocking the user.
    const fallbackSuffix = Math.random().toString(36).slice(2, 6);
    const storeName = form.storeName.trim() || `Toko ${form.businessName.trim() || "Nyiur"} ${fallbackSuffix}`;
    const storeSlug =
      (form.storeSlug.trim() || storeName.toLowerCase().replace(/[^a-z0-9]+/g, "-"))
        .replace(/^-+|-+$/g, "") || `toko-${fallbackSuffix}`;
    const description =
      form.description.trim().length >= 20
        ? form.description.trim()
        : "Mitra baru di Nyiur Nanggroe yang menjual produk olahan kelapa berkualitas.";

    const submit = () =>
      useAuthStore.getState().upgradeToSeller({
        store_name: storeName,
        store_slug: storeSlug,
        store_logo: form.logo,
        description,
        location: form.location,
      });

    let result = await submit();

    // The header/UI trusts a cached login state that can go stale (session
    // expired, cookies cleared, logged out in another tab) while the page
    // still shows you as logged in. If the server says "not authenticated"
    // even though the UI thinks otherwise, re-sync with the real session
    // once and retry before giving up — this avoids a confusing dead end
    // for people who really are logged in.
    if (!result.success && /login/i.test(result.error || "")) {
      await useAuthStore.getState().fetchCurrentUser();
      if (useAuthStore.getState().isAuthenticated) {
        result = await submit();
      }
    }

    setIsSubmitting(false);

    if (!result.success) {
      const authIssue = /login/i.test(result.error || "");
      setSubmitError(
        authIssue
          ? "Sesi Anda sudah berakhir. Silakan masuk ulang, lalu coba lagi."
          : result.error || "Gagal membuat toko. Coba ubah nama toko lalu coba lagi."
      );
      return;
    }

    window.location.href = "/mitra";
  };

  const toggleCategory = (cat: string) => {
    if (form.categories.includes(cat)) {
      setForm({ ...form, categories: form.categories.filter((c) => c !== cat) });
    } else {
      setForm({ ...form, categories: [...form.categories, cat] });
    }
  };

  const handleMockLogoUpload = () => {
    setForm({ ...form, logo: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=150&auto=format&fit=crop" });
  };

  const handleMockBannerUpload = () => {
    setForm({ ...form, banner: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=800&auto=format&fit=crop" });
  };

  const handleMockKtpUpload = () => {
    setForm({ ...form, ktpPhoto: "uploaded" });
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-24 md:pt-28 pb-12">
        <div className="container-base max-w-xl">
          {/* Stepper Progress Bar */}
          <div className="mb-8 flex justify-between items-center text-xs text-charcoal-400">
            {[
              { num: 1, label: "Bisnis" },
              { num: 2, label: "Detail Toko" },
              { num: 3, label: "Verifikasi" },
              { num: 4, label: "Selesai" },
            ].map((s) => (
              <div key={s.num} className="flex flex-col items-center gap-1.5 flex-1 relative">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-colors border",
                  step >= s.num ? "bg-forest-600 text-white border-forest-600" : "bg-white text-charcoal-300 border-charcoal-200"
                )}>
                  {step > s.num ? <CheckCircle2 className="w-5 h-5 text-cream" /> : s.num}
                </div>
                <span className={cn(
                  "font-medium",
                  step === s.num ? "text-forest-700 font-bold" : "text-charcoal-400"
                )}>{s.label}</span>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Business Information */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white rounded-3xl border border-border/60 p-6 sm:p-8 space-y-5"
              >
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-charcoal-800 flex items-center gap-2">
                    <Building className="w-5 h-5 text-forest-600" /> Informasi Usaha
                  </h2>
                  <p className="text-xs text-charcoal-400">Tentukan tipe kepemilikan usaha kelapa Anda.</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "perorangan", label: "Individu", desc: "Petani/Pengrajin Mandiri" },
                    { id: "umkm", label: "UMKM", desc: "Usaha Mikro / Kecil" },
                    { id: "koperasi", label: "Koperasi", desc: "Kelompok Tani / Koperasi" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setForm({ ...form, businessType: t.id })}
                      className={cn(
                        "p-4 rounded-2xl border-2 text-left space-y-1.5 transition-all flex flex-col justify-between min-h-[100px]",
                        form.businessType === t.id ? "border-forest-600 bg-forest-50/40" : "border-border hover:border-charcoal-300"
                      )}
                    >
                      <p className="text-sm font-bold text-charcoal-800">{t.label}</p>
                      <p className="text-[10px] text-charcoal-400 leading-normal">{t.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-charcoal-500 block mb-1">Nama Pemilik / Usaha</label>
                    <input
                      type="text"
                      value={form.businessName}
                      onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                      placeholder="Masukkan nama resmi pemilik atau badan usaha"
                      className="input-base"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-charcoal-500 block mb-1">WhatsApp</label>
                      <input
                        type="text"
                        value={form.whatsapp}
                        onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                        placeholder="08XXXXXXXXXX"
                        className="input-base"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-charcoal-500 block mb-1">Instagram (Opsional)</label>
                      <input
                        type="text"
                        value={form.instagram}
                        onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                        placeholder="@username"
                        className="input-base"
                      />
                    </div>
                  </div>
                </div>

                {stepError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
                    {stepError}
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <button onClick={handleNext} className="btn-primary">
                    Selanjutnya <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Store details */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white rounded-3xl border border-border/60 p-6 sm:p-8 space-y-5"
              >
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-charcoal-800 flex items-center gap-2">
                    <Store className="w-5 h-5 text-forest-600" /> Informasi Toko
                  </h2>
                  <p className="text-xs text-charcoal-400">Detail identitas brand toko Anda di marketplace.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-charcoal-500 block mb-1">Nama Toko / Brand</label>
                    <input
                      type="text"
                      value={form.storeName}
                      onChange={(e) => setForm({ ...form, storeName: e.target.value, storeSlug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-") })}
                      placeholder="Contoh: VCO Lestari Banda"
                      className="input-base"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-charcoal-500 block mb-1">Slug Toko (URL)</label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-charcoal-400 bg-mist px-3 py-3 rounded-xl border border-border">nyiur/toko/</span>
                      <input
                        type="text"
                        value={form.storeSlug}
                        onChange={(e) => setForm({ ...form, storeSlug: e.target.value })}
                        className="input-base flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-charcoal-500 block mb-1">Deskripsi Singkat Toko</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Jelaskan produk unggulan yang toko Anda tawarkan..."
                      className="input-base min-h-[80px] py-2.5"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-charcoal-500 block mb-2">Kategori Produk</label>
                    <div className="flex flex-wrap gap-2">
                      {["Briket", "Kerajinan", "Cocopeat", "Minyak Kelapa", "Olahan Makanan"].map((cat) => {
                        const active = form.categories.includes(cat);
                        return (
                          <button
                            type="button"
                            key={cat}
                            onClick={() => toggleCategory(cat)}
                            className={cn(
                              "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                              active ? "bg-forest-50 border-forest-500 text-forest-700" : "bg-white border-border text-charcoal-600 hover:bg-mist"
                            )}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-charcoal-500 block mb-1">Logo Toko</label>
                      <div
                        onClick={handleMockLogoUpload}
                        className="border border-dashed border-charcoal-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-1 text-center cursor-pointer hover:border-forest-500 transition-colors"
                      >
                        {form.logo ? (
                          <span className="text-[10px] text-forest-600 font-bold">Logo Terunggah ✓</span>
                        ) : (
                          <>
                            <Upload className="w-5 h-5 text-charcoal-400" />
                            <span className="text-[10px] font-semibold text-charcoal-700">Pilih logo</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-charcoal-500 block mb-1">Banner Toko</label>
                      <div
                        onClick={handleMockBannerUpload}
                        className="border border-dashed border-charcoal-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-1 text-center cursor-pointer hover:border-forest-500 transition-colors"
                      >
                        {form.banner ? (
                          <span className="text-[10px] text-forest-600 font-bold">Banner Terunggah ✓</span>
                        ) : (
                          <>
                            <ImageIcon className="w-5 h-5 text-charcoal-400" />
                            <span className="text-[10px] font-semibold text-charcoal-700">Pilih banner</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {stepError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
                    {stepError}
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <button onClick={handlePrev} className="btn-secondary">Kembali</button>
                  <button onClick={handleNext} className="btn-primary">Selanjutnya <ArrowRight className="w-4 h-4" /></button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Identity Verification */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white rounded-3xl border border-border/60 p-6 sm:p-8 space-y-5"
              >
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-charcoal-800 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-forest-600" /> Verifikasi Identitas
                  </h2>
                  <p className="text-xs text-charcoal-400">Verifikasi KTP diwajibkan untuk menjamin keamanan transaksi pembeli.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-charcoal-500 block mb-1">Nama Lengkap Sesuai KTP</label>
                    <input
                      type="text"
                      value={form.ktpName}
                      onChange={(e) => setForm({ ...form, ktpName: e.target.value })}
                      placeholder="Masukkan nama lengkap"
                      className="input-base"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-charcoal-500 block mb-1">Nomor NIK KTP</label>
                    <input
                      type="text"
                      value={form.ktpNumber}
                      onChange={(e) => setForm({ ...form, ktpNumber: e.target.value })}
                      placeholder="Contoh: 1101XXXXXXXXXXXX"
                      className="input-base"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-charcoal-500 block mb-1">Foto KTP / Keterangan Usaha</label>
                    <div
                      onClick={handleMockKtpUpload}
                      className="border-2 border-dashed border-charcoal-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-center cursor-pointer hover:border-forest-500 transition-colors"
                    >
                      {form.ktpPhoto ? (
                        <>
                          <CheckCircle2 className="w-8 h-8 text-forest-600" />
                          <span className="text-xs font-semibold text-forest-700">Foto KTP Terunggah ✓</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-charcoal-400" />
                          <span className="text-xs font-semibold text-charcoal-700">Unggah foto KTP asli</span>
                          <span className="text-[10px] text-charcoal-400">Format gambar harus jelas dan terbaca</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {stepError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
                    {stepError}
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <button onClick={handlePrev} className="btn-secondary">Kembali</button>
                  <button onClick={handleNext} className="btn-primary">Verifikasi Sekarang</button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Success confirmation */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl border border-border/60 p-8 text-center space-y-6"
              >
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-forest-50 border border-forest-200 flex items-center justify-center text-forest-600">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-charcoal-800">Verifikasi Toko Dikirim!</h2>
                  <p className="text-xs text-charcoal-500 mt-1.5 leading-relaxed max-w-sm mx-auto">
                    Dokumen verifikasi Anda sedang diperiksa tim admin Nyiur Nanggroe. Dashboard Mitra Anda kini siap digunakan untuk mengelola katalog produk.
                  </p>
                </div>

                <div className="p-4 bg-forest-50/50 border border-forest-200/60 rounded-2xl flex items-start gap-2.5 text-left text-xs text-forest-700 leading-normal max-w-sm mx-auto">
                  <Sparkles className="w-4 h-4 text-forest-600 flex-shrink-0 mt-0.5" />
                  <span>Dapatkan lencana <strong>Mitra Terverifikasi</strong> di profil toko Anda setelah data disetujui dalam 1x24 jam.</span>
                </div>

                {submitError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 max-w-sm mx-auto text-left">
                    {submitError}
                  </div>
                )}

                <button
                  onClick={handleComplete}
                  disabled={isSubmitting}
                  className="btn-primary w-full justify-center disabled:opacity-60"
                >
                  {isSubmitting ? "Memproses..." : "Masuk ke Dashboard Mitra"}
                  {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}
