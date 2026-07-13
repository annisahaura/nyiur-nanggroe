"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((s) => s.login);

  const redirectUrl = searchParams.get("redirect") ?? "/";
  const alasan = searchParams.get("alasan");

  const alasanMessage: Record<string, string> = {
    keranjang: "Masuk dulu yuk, biar keranjang belanjamu tersimpan dan siap di-checkout.",
    wishlist: "Masuk dulu untuk melihat dan menyimpan produk yang kamu sukai.",
    checkout: "Masuk dulu untuk melanjutkan pembayaran.",
    pesanan: "Masuk dulu untuk melihat riwayat pesananmu.",
    jualan: "Masuk dulu untuk mulai berjualan di Nyiur Nanggroe.",
    mitra: "Masuk dengan akun Mitra untuk membuka halaman ini.",
    kuis: "Masuk dulu untuk mengikuti kuis dan mengumpulkan poin edukasi.",
    umum: "Masuk atau daftar dulu untuk mengakses halaman ini.",
  };
  const banner = alasan ? alasanMessage[alasan] ?? alasanMessage.umum : null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        router.push(redirectUrl);
      } else {
        setError(res.error ?? "Terjadi kesalahan saat masuk.");
      }
    } catch (err) {
      setError("Koneksi gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass dark:glass-dark rounded-3xl p-8 shadow-2xl space-y-6 border border-white/20 dark:border-white/5 text-foreground"
    >
      <div className="text-center space-y-1.5">
        <h1 className="text-2xl font-display font-bold text-foreground">
          Selamat Datang Kembali
        </h1>
        <p className="text-sm text-charcoal-400 dark:text-foreground/60">
          Masuk ke akun Anda untuk melanjutkan aktivitas ekonomi sirkular.
        </p>
      </div>

      {banner && (
        <div className="bg-forest-50 border border-forest-200 text-forest-700 dark:bg-forest-500/10 dark:border-forest-500/20 dark:text-forest-400 rounded-xl p-3.5 text-xs text-center font-medium">
          🔒 {banner}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 rounded-xl p-3.5 text-xs text-center font-medium animate-shake">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <Input
          type="email"
          label="Alamat Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="nama@email.com"
        />

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label htmlFor="password-input" className="text-xs font-semibold text-charcoal-700 dark:text-foreground/75">
              Kata Sandi
            </label>
            <Link
              href="/lupa-kata-sandi"
              className="text-xs font-semibold text-forest-600 hover:text-forest-700 dark:text-ring dark:hover:text-ring/80 transition-colors"
            >
              Lupa Kata Sandi?
            </Link>
          </div>
          <Input
            id="password-input"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-charcoal-400 hover:text-charcoal-600 dark:text-foreground/45 dark:hover:text-foreground transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          className="w-full justify-center shadow-lg shadow-forest-600/10 dark:shadow-none mt-2"
          isLoading={loading}
        >
          <span>Masuk Sekarang</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </form>

      {/* Google social login option */}
      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-border/60"></div>
        <span className="flex-shrink mx-4 text-charcoal-400 dark:text-foreground/40 text-xs font-medium bg-transparent">
          Atau masuk dengan
        </span>
        <div className="flex-grow border-t border-border/60"></div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={() => {
          setEmail("siti@nyiurnanggroe.id");
          setPassword("Password123");
        }}
        className="w-full justify-center bg-card/50 text-foreground border-border/60"
      >
        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.2-5.136 4.2A5.736 5.736 0 018.2 12.8a5.736 5.736 0 015.791-5.8 5.632 5.632 0 013.882 1.5l3.158-3.158A9.92 9.92 0 0013.99 2c-5.523 0-10 4.477-10 10s4.477 10 10 10c5.782 0 10.14-4.056 10.14-10.222 0-.613-.075-1.16-.185-1.493H12.24z"
          />
        </svg>
        <span>Gunakan Akun Demo (Siti Aisyah)</span>
      </Button>

      <p className="text-center text-xs text-charcoal-400 dark:text-foreground/50">
        Belum punya akun?{" "}
        <Link
          href="/daftar"
          className="font-bold text-forest-600 hover:text-forest-700 dark:text-ring dark:hover:text-ring/80 transition-colors"
        >
          Daftar Gratis
        </Link>
      </p>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center text-white">Memuat...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
