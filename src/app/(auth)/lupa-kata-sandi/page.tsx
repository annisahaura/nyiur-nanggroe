"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AnimatedCard } from "@/components/ui/Card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending recovery email
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  };

  return (
    <AnimatedCard
      variant="glass"
      className="p-8 shadow-2xl space-y-6 border border-white/20 dark:border-white/5 text-foreground rounded-3xl"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center space-y-1.5">
        <h1 className="text-2xl font-display font-bold text-foreground">
          Lupa Kata Sandi?
        </h1>
        <p className="text-sm text-charcoal-400 dark:text-foreground/60">
          Masukkan alamat email Anda untuk menerima instruksi pemulihan kata sandi.
        </p>
      </div>

      {sent ? (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-emerald-50 border border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20 rounded-2xl p-5 text-center space-y-3.5"
        >
          <div className="flex justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 animate-bounce" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">Email Pemulihan Dikirim</h3>
            <p className="text-xs text-charcoal-500 dark:text-foreground/60 leading-relaxed">
              Kami telah mengirim tautan pemulihan kata sandi ke <span className="font-semibold text-foreground">{email}</span>. Silakan periksa kotak masuk dan folder spam Anda.
            </p>
          </div>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="Alamat Email Terdaftar"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="nama@email.com"
            rightIcon={<Mail className="w-4 h-4 text-charcoal-400 dark:text-foreground/45 pointer-events-none" />}
          />

          <Button
            type="submit"
            className="w-full justify-center shadow-lg shadow-forest-600/10 dark:shadow-none"
            isLoading={loading}
          >
            <span>Kirim Tautan Pemulihan</span>
          </Button>
        </form>
      )}

      <div className="text-center pt-2 border-t border-border/40">
        <Link
          href="/masuk"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-600 hover:text-forest-700 dark:text-ring dark:hover:text-ring/80 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Halaman Masuk
        </Link>
      </div>
    </AnimatedCard>
  );
}
