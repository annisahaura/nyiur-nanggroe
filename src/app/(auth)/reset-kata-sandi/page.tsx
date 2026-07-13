"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Loader2, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }
    if (password.length < 6) {
      setError("Kata sandi harus minimal 6 karakter.");
      return;
    }

    setLoading(true);

    // Simulate reset request
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSuccess(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl space-y-6"
    >
      <div className="text-center space-y-1.5">
        <h1 className="text-2xl font-display font-bold text-charcoal-800">
          Ubah Kata Sandi
        </h1>
        <p className="text-sm text-charcoal-500">
          Masukkan kata sandi baru Anda di bawah ini.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3.5 text-xs text-center font-medium">
          ⚠️ {error}
        </div>
      )}

      {success ? (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-center space-y-4"
        >
          <div className="flex justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 animate-bounce" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-charcoal-800">Kata Sandi Berhasil Diperbarui</h3>
            <p className="text-xs text-charcoal-500">
              Kata sandi Anda telah berhasil diubah. Silakan masuk menggunakan kata sandi baru Anda.
            </p>
          </div>
          <button
            onClick={() => router.push("/masuk")}
            className="w-full btn-primary justify-center py-3"
          >
            Masuk Sekarang
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-charcoal-700 block">
              Kata Sandi Baru
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Minimal 6 karakter"
                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm text-charcoal placeholder:text-charcoal-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all pr-10"
              />
              <Lock className="absolute right-3.5 top-3.5 w-4 h-4 text-charcoal-300 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-charcoal-700 block">
              Konfirmasi Kata Sandi Baru
            </label>
            <div className="relative">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Ulangi kata sandi baru"
                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm text-charcoal placeholder:text-charcoal-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all pr-10"
              />
              <Lock className="absolute right-3.5 top-3.5 w-4 h-4 text-charcoal-300 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary justify-center py-3.5 shadow-lg shadow-forest-600/10"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan sandi baru...
              </>
            ) : (
              "Simpan Kata Sandi"
            )}
          </button>
        </form>
      )}
    </motion.div>
  );
}
