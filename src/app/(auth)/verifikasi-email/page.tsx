"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { MailCheck, ArrowRight, Loader2, RefreshCw } from "lucide-react";

export default function VerificationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setResent(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl text-center space-y-6"
    >
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-2xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-600 animate-pulse">
          <MailCheck className="w-8 h-8" />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-display font-bold text-charcoal-800">
          Verifikasi Email Anda
        </h1>
        <p className="text-sm text-charcoal-500 max-w-xs mx-auto leading-relaxed">
          Kami telah mengirimkan email verifikasi ke alamat email Anda. Klik tautan di dalam email untuk mengaktifkan akun Anda.
        </p>
      </div>

      {resent && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs py-2.5 px-4 rounded-xl font-semibold">
          ✓ Email verifikasi baru telah dikirim!
        </div>
      )}

      <div className="space-y-3 pt-2">
        <button
          onClick={() => router.push("/")}
          className="w-full btn-primary justify-center py-3.5"
        >
          Masuk Halaman Utama <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={handleResend}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-border rounded-xl bg-white text-sm font-semibold text-charcoal-700 hover:bg-mist disabled:opacity-50 transition-all"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          Kirim Ulang Email Verifikasi
        </button>
      </div>

      <p className="text-xs text-charcoal-400">
        Butuh bantuan? Hubungi <Link href="/kontak" className="underline font-bold text-charcoal-600 hover:text-forest-600">Dukungan Nyiur</Link>
      </p>
    </motion.div>
  );
}
