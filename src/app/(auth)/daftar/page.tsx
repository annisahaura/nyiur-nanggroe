"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Loader2, Shield } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    country: "Indonesia",
    province: "",
    city: "",
    acceptTerms: false,
  });

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }
    if (formData.password.length < 8) {
      setError("Kata sandi harus minimal 8 karakter.");
      return;
    }
    if (!/[A-Z]/.test(formData.password)) {
      setError("Kata sandi harus mengandung minimal 1 huruf kapital.");
      return;
    }
    if (!/[0-9]/.test(formData.password)) {
      setError("Kata sandi harus mengandung minimal 1 angka.");
      return;
    }

    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.acceptTerms) {
      setError("Anda harus menyetujui Ketentuan Layanan.");
      return;
    }

    setLoading(true);

    try {
      const res = await register({
        full_name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        country: formData.country,
        province: formData.province,
        city: formData.city,
      });

      if (res.success) {
        router.push("/selamat-datang");
      } else {
        // Show specific error from API
        setError(res.error ?? "Terjadi kesalahan saat pendaftaran.");
        // If validation error is about password, go back to step 1
        if (res.error?.toLowerCase().includes("sandi") || res.error?.toLowerCase().includes("kapital") || res.error?.toLowerCase().includes("password")) {
          setStep(1);
        }
      }
    } catch (err) {
      setError("Koneksi gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="glass" className="p-8 shadow-2xl space-y-6 border border-white/20 dark:border-white/5 text-foreground rounded-3xl">
      {/* Header and Step Indicators */}
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-display font-bold text-foreground">
          Buat Akun Baru
        </h1>
        <div className="flex items-center justify-center gap-1.5">
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              step === 1 ? "w-8 bg-forest-600 dark:bg-ring" : "w-2 bg-charcoal-200 dark:bg-charcoal-700"
            }`}
          />
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              step === 2 ? "w-8 bg-forest-600 dark:bg-ring" : "w-2 bg-charcoal-200 dark:bg-charcoal-700"
            }`}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 rounded-xl p-3.5 text-xs text-center font-medium">
          ⚠️ {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.form
            key="step1"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 15 }}
            transition={{ duration: 0.25 }}
            onSubmit={handleNext}
            className="space-y-4"
          >
            {/* Full Name */}
            <Input
              label="Nama Lengkap"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
              placeholder="Nama lengkap sesuai KTP"
            />

            {/* Email */}
            <Input
              type="email"
              label="Alamat Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="nama@email.com"
            />

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="password"
                label="Kata Sandi"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder="Min. 8 karakter, ada kapital & angka"
              />
              <Input
                type="password"
                label="Konfirmasi Sandi"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                placeholder="Ulangi sandi"
              />
            </div>

            <Button
              type="submit"
              className="w-full justify-center mt-2"
            >
              Lanjutkan <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.form>
        ) : (
          <motion.form
            key="step2"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.25 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Phone */}
            <Input
              type="tel"
              label="Nomor Telepon / WhatsApp"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              placeholder="Contoh: 081234567890"
            />

            {/* Country / Province / City */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-charcoal-500 dark:text-foreground/70 ml-1">Provinsi</label>
                <select
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value, city: "" })}
                  required
                  className="w-full bg-white dark:bg-background border border-border text-foreground text-sm rounded-xl px-4 py-3 outline-none focus:border-forest-500 focus:ring-1 focus:ring-forest-500 transition-all"
                >
                  <option value="" disabled>Pilih Provinsi</option>
                  <option value="Aceh">Aceh</option>
                  <option value="Sumatera Utara">Sumatera Utara</option>
                  <option value="Sumatera Barat">Sumatera Barat</option>
                  <option value="Riau">Riau</option>
                  <option value="DKI Jakarta">DKI Jakarta</option>
                  <option value="Jawa Barat">Jawa Barat</option>
                  <option value="Jawa Tengah">Jawa Tengah</option>
                  <option value="Jawa Timur">Jawa Timur</option>
                  <option value="Provinsi Lainnya">Provinsi Lainnya...</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-charcoal-500 dark:text-foreground/70 ml-1">Kota / Kabupaten</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                  disabled={!formData.province}
                  className="w-full bg-white dark:bg-background border border-border text-foreground text-sm rounded-xl px-4 py-3 outline-none focus:border-forest-500 focus:ring-1 focus:ring-forest-500 transition-all disabled:opacity-50"
                >
                  <option value="" disabled>Pilih Kota/Kabupaten</option>
                  {formData.province === "Aceh" ? (
                    <>
                      <option value="Banda Aceh">Banda Aceh</option>
                      <option value="Sabang">Sabang</option>
                      <option value="Lhokseumawe">Lhokseumawe</option>
                      <option value="Langsa">Langsa</option>
                      <option value="Aceh Besar">Aceh Besar</option>
                      <option value="Pidie">Pidie</option>
                      <option value="Bireuen">Bireuen</option>
                      <option value="Aceh Utara">Aceh Utara</option>
                      <option value="Kab/Kota Lainnya">Kab/Kota Lainnya...</option>
                    </>
                  ) : formData.province ? (
                    <>
                      <option value="Ibu Kota Provinsi">Ibu Kota Provinsi</option>
                      <option value="Kab/Kota Lainnya">Kab/Kota Lainnya...</option>
                    </>
                  ) : null}
                </select>
              </div>
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-3 py-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                className="mt-1 rounded border-border text-forest-600 dark:text-ring focus:ring-forest-500 bg-background"
              />
              <span className="text-xs text-charcoal-500 dark:text-foreground/60 leading-normal">
                Saya menyetujui <Link href="/syarat-ketentuan" className="font-bold text-forest-600 dark:text-ring hover:underline">Ketentuan Layanan</Link> dan{" "}
                <Link href="/privasi" className="font-bold text-forest-600 dark:text-ring hover:underline">Kebijakan Privasi</Link> Nyiur Nanggroe.
              </span>
            </label>

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Kembali
              </Button>
              <Button
                type="submit"
                className="flex-1 shadow-lg shadow-forest-600/10 dark:shadow-none"
                isLoading={loading}
              >
                <span>Buat Akun</span>
                <Shield className="w-4 h-4" />
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <p className="text-center text-xs text-charcoal-400 dark:text-foreground/50 pt-2 border-t border-border/40">
        Sudah memiliki akun?{" "}
        <Link
          href="/masuk"
          className="font-bold text-forest-600 hover:text-forest-700 dark:text-ring dark:hover:text-ring/80 transition-colors"
        >
          Masuk di Sini
        </Link>
      </p>
    </Card>
  );
}
