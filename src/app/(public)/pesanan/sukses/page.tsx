"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Truck, Package, ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { formatPrice } from "@/lib/utils";

// Inner component that uses useSearchParams — must live inside Suspense
function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNum = searchParams.get("order") ?? "NN-892714";
  const total = Number(searchParams.get("total") ?? 0);
  const courier = searchParams.get("courier") ?? "J&T Express";

  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const arrivalDate = new Date();
    arrivalDate.setDate(arrivalDate.getDate() + 3);
    setDateStr(arrivalDate.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }));
  }, []);

  return (
    <div className="container-base max-w-md w-full px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-3xl border border-border/60 p-8 shadow-xl text-center space-y-6"
      >
        {/* Animated Success Checkmark */}
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-20 h-20 rounded-full bg-forest-50 border border-forest-200 flex items-center justify-center text-forest-600"
          >
            <CheckCircle className="w-12 h-12" />
          </motion.div>
        </div>

        <div>
          <h1 className="text-2xl font-display font-bold text-charcoal-800">Pesanan Berhasil!</h1>
          <p className="text-sm text-charcoal-500 mt-1">Terima kasih atas kontribusi Anda mendukung ekonomi sirkular kelapa.</p>
        </div>

        {/* Details Box */}
        <div className="bg-mist/50 border border-border/40 rounded-2xl p-5 text-left space-y-3.5">
          <div className="flex justify-between items-center text-xs text-charcoal-500 border-b border-border/40 pb-2">
            <span>Nomor Pesanan</span>
            <span className="font-semibold text-charcoal-800">{orderNum}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-charcoal-500 border-b border-border/40 pb-2">
            <span>Total Pembayaran</span>
            <span className="font-bold text-forest-700">{total > 0 ? formatPrice(total) : "Rp 185.000"}</span>
          </div>
          <div className="flex justify-between items-start text-xs text-charcoal-500 border-b border-border/40 pb-2">
            <span>Metode Pengiriman</span>
            <span className="text-right font-medium text-charcoal-800">{courier}</span>
          </div>
          <div className="flex items-start gap-2.5 pt-1">
            <Truck className="w-4 h-4 text-forest-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-charcoal-800">Estimasi Tiba</p>
              <p className="text-[11px] text-charcoal-500">{dateStr || "3 hari kerja"}</p>
            </div>
          </div>
        </div>

        {/* CTA Actions */}
        <div className="flex flex-col gap-2 pt-2">
          <Link href="/akun" className="btn-primary w-full justify-center">
            <Package className="w-4 h-4" /> Lacak Pesanan
          </Link>
          <Link href="/produk" className="btn-secondary w-full justify-center">
            Lanjut Belanja <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

// Loading skeleton while Suspense resolves
function OrderSuccessSkeleton() {
  return (
    <div className="container-base max-w-md w-full px-4">
      <div className="bg-white rounded-3xl border border-border/60 p-8 shadow-xl text-center space-y-6 animate-pulse">
        <div className="w-20 h-20 rounded-full bg-mist mx-auto" />
        <div className="space-y-2">
          <div className="h-6 bg-mist rounded-xl w-48 mx-auto" />
          <div className="h-4 bg-mist rounded-xl w-64 mx-auto" />
        </div>
        <div className="h-36 bg-mist rounded-2xl" />
        <div className="space-y-2">
          <div className="h-12 bg-mist rounded-xl" />
          <div className="h-12 bg-mist rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// Page component — wraps content in Suspense for useSearchParams compliance
export default function OrderSuccessPage() {
  return (
    <>
      <Header />
      <main className="min-h-[80vh] bg-cream flex items-center justify-center pt-24 md:pt-28 pb-12">
        <Suspense fallback={<OrderSuccessSkeleton />}>
          <OrderSuccessContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
