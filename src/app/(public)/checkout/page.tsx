"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ShieldCheck, MapPin, Truck, CreditCard, ChevronRight,
  ArrowLeft, Check, Ticket, Wallet, Landmark, QrCode, Loader2, AlertTriangle
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useCartStore } from "@/lib/stores/cart-store";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

const COURIER_OPTIONS = [
  { id: "jne", name: "JNE REG", desc: "Estimasi 2-4 hari", price: 15000 },
  { id: "jnt", name: "J&T Express", desc: "Estimasi 1-3 hari", price: 12000 },
  { id: "sicepat", name: "SiCepat REG", desc: "Estimasi 1-3 hari", price: 14000 },
];

// id -> nilai enum payment_method yang diterima backend
const PAYMENT_METHODS = [
  { id: "qris", backendValue: "qris" as const, name: "QRIS", desc: "LinkAja, GoPay, OVO, ShopeePay", icon: QrCode },
  { id: "va_bni", backendValue: "bank_transfer" as const, name: "Transfer Virtual Account BNI", desc: "Verifikasi Otomatis", icon: Landmark },
  { id: "va_mandiri", backendValue: "bank_transfer" as const, name: "Transfer Virtual Account Mandiri", desc: "Verifikasi Otomatis", icon: Landmark },
  { id: "gopay", backendValue: "e_wallet" as const, name: "GoPay E-Wallet", desc: "Instan dengan GoPay app", icon: Wallet },
];

export default function CheckoutPage() {
  const { items: allItems, voucher, voucherDiscount, removeItems } = useCartStore();

  // Only checkout the items that were ticked on the Keranjang page. If
  // nothing was stashed (e.g. user came here directly), fall back to
  // everything in the cart so the page still works.
  const [selectedIds, setSelectedIds] = useState<string[] | null>(null);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("nyiur_checkout_selection");
      setSelectedIds(raw ? JSON.parse(raw) : null);
    } catch {
      setSelectedIds(null);
    }
  }, []);

  const items = selectedIds ? allItems.filter((i) => selectedIds.includes(i.product.id)) : allItems;

  const [step, setStep] = useState<"address" | "courier" | "payment" | "processing">("address");
  const [orderError, setOrderError] = useState<string | null>(null);
  const [address, setAddress] = useState({
    name: "Ahmad Maulana",
    phone: "081234567890",
    street: "Jl. Teuku Umar No. 45, Kampung Baru",
    city: "Banda Aceh",
    province: "Aceh",
    postalCode: "23242",
  });
  const [selectedCourier, setSelectedCourier] = useState(COURIER_OPTIONS[0]);
  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_METHODS[0]);
  const [notes, setNotes] = useState("");

  const sub = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const platformFee = Math.round(sub * 0.02);
  const discountAmount = Math.round(sub * (voucherDiscount / 100));
  const shippingCost = selectedCourier.price;
  const total = sub + shippingCost + platformFee - discountAmount;

  const handleOrder = async () => {
    setOrderError(null);
    setStep("processing");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shipping_address: {
            full_name: address.name,
            phone: address.phone,
            address: address.street,
            city: address.city,
            province: address.province,
            postal_code: address.postalCode,
          },
          payment_method: selectedPayment.backendValue,
          notes: notes || undefined,
          items: items.map((i) => ({ product_id: i.product.id, quantity: i.quantity })),
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setOrderError(
          json.error ||
            "Gagal membuat pesanan. Coba periksa kembali data yang kamu isi."
        );
        setStep("payment");
        return;
      }

      // Only clear the items that were actually just checked out, so
      // anything the user left un-ticked stays safely in the cart.
      removeItems(items.map((i) => i.product.id));
      sessionStorage.removeItem("nyiur_checkout_selection");

      const order = json.data;
      window.location.href = `/pesanan/sukses?order=${order.order_number}&total=${order.total ?? total}&courier=${encodeURIComponent(selectedCourier.name)}`;
    } catch (err) {
      setOrderError("Gagal terhubung ke server. Periksa koneksi internetmu dan coba lagi.");
      setStep("payment");
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-[70vh] flex items-center justify-center bg-cream">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-charcoal-800 mb-4">Tidak ada item untuk Checkout</h1>
            <Link href="/produk" className="btn-primary">Belanja Sekarang</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-24 md:pt-28 pb-8">
        <div className="container-base">
          <div className="mb-6 flex items-center gap-4">
            <Link href="/keranjang" className="flex items-center gap-1.5 text-sm text-charcoal-500 hover:text-forest-600 font-medium">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Keranjang
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Main Steps */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stepper Header */}
              {step !== "processing" && (
              <div className="bg-white rounded-2xl border border-border/60 p-4 flex justify-between items-center text-xs sm:text-sm">
                {[
                  { id: "address", label: "Alamat Pengiriman" },
                  { id: "courier", label: "Kurir" },
                  { id: "payment", label: "Pembayaran" },
                ].map((s, idx) => {
                  const isActive = step === s.id;
                  const isDone = (step === "courier" && s.id === "address") || (step === "payment" && (s.id === "address" || s.id === "courier"));
                  return (
                    <div key={s.id} className="flex items-center gap-2">
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center font-semibold text-xs transition-colors",
                        isActive ? "bg-forest-600 text-white" : isDone ? "bg-moss text-white" : "bg-mist text-charcoal-400"
                      )}>
                        {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                      </div>
                      <span className={cn(
                        "font-medium",
                        isActive ? "text-forest-700 font-bold" : "text-charcoal-500"
                      )}>{s.label}</span>
                      {idx < 2 && <ChevronRight className="w-3.5 h-3.5 text-charcoal-300" />}
                    </div>
                  );
                })}
              </div>
              )}

              {/* Step: Processing payment */}
              {step === "processing" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-2xl border border-border/60 p-12 flex flex-col items-center justify-center text-center gap-4"
                >
                  <Loader2 className="w-10 h-10 text-forest-600 animate-spin" />
                  <div>
                    <h2 className="text-lg font-bold text-charcoal-800">Memproses Pesananmu</h2>
                    <p className="text-sm text-charcoal-500 mt-1">
                      Mohon tunggu sebentar, jangan tutup atau muat ulang halaman ini ya.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step 1: Address */}
              {step === "address" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-border/60 p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-forest-600" />
                    <h2 className="text-lg font-bold text-charcoal-800">Alamat Pengiriman</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-charcoal-500 block mb-1">Nama Lengkap</label>
                      <input
                        type="text"
                        value={address.name}
                        onChange={(e) => setAddress({ ...address, name: e.target.value })}
                        className="input-base"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-charcoal-500 block mb-1">Nomor Telepon</label>
                      <input
                        type="text"
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        className="input-base"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold text-charcoal-500 block mb-1">Alamat Lengkap</label>
                      <textarea
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                        className="input-base min-h-[80px] py-2"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-charcoal-500 block mb-1">Kota / Kabupaten</label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className="input-base"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-charcoal-500 block mb-1">Provinsi</label>
                      <input
                        type="text"
                        value={address.province}
                        onChange={(e) => setAddress({ ...address, province: e.target.value })}
                        className="input-base"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-charcoal-500 block mb-1">Kode Pos</label>
                      <input
                        type="text"
                        value={address.postalCode}
                        onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                        className="input-base"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <button onClick={() => setStep("courier")} className="btn-primary">
                      Lanjut ke Kurir <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Courier */}
              {step === "courier" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-border/60 p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="w-5 h-5 text-forest-600" />
                    <h2 className="text-lg font-bold text-charcoal-800">Pilih Opsi Pengiriman</h2>
                  </div>
                  <div className="space-y-3">
                    {COURIER_OPTIONS.map((c) => (
                      <label
                        key={c.id}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all",
                          selectedCourier.id === c.id ? "border-forest-600 bg-forest-50/40" : "border-border hover:border-charcoal-300"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="courier"
                            checked={selectedCourier.id === c.id}
                            onChange={() => setSelectedCourier(c)}
                            className="accent-forest-600"
                          />
                          <div>
                            <p className="text-sm font-semibold text-charcoal-800">{c.name}</p>
                            <p className="text-xs text-charcoal-400">{c.desc}</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-forest-700">{formatPrice(c.price)}</span>
                      </label>
                    ))}
                  </div>

                  {/* Notes to seller */}
                  <div>
                    <label className="text-xs font-semibold text-charcoal-500 block mb-1">Catatan Tambahan untuk Penjual (Opsional)</label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Contoh: Titipkan di satpam, kemasan plastik tebal, dll."
                      className="input-base"
                    />
                  </div>

                  <div className="flex justify-between pt-4">
                    <button onClick={() => setStep("address")} className="btn-secondary">
                      Kembali
                    </button>
                    <button onClick={() => setStep("payment")} className="btn-primary">
                      Lanjut ke Pembayaran <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment */}
              {step === "payment" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-border/60 p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-5 h-5 text-forest-600" />
                    <h2 className="text-lg font-bold text-charcoal-800">Pilih Metode Pembayaran</h2>
                  </div>

                  {orderError && (
                    <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3.5 text-xs text-red-600">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{orderError}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-1 gap-3">
                    {PAYMENT_METHODS.map((p) => {
                      const Icon = p.icon;
                      return (
                        <label
                          key={p.id}
                          className={cn(
                            "flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all",
                            selectedPayment.id === p.id ? "border-forest-600 bg-forest-50/40" : "border-border hover:border-charcoal-300"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="payment"
                              checked={selectedPayment.id === p.id}
                              onChange={() => setSelectedPayment(p)}
                              className="accent-forest-600"
                            />
                            <div className="w-10 h-10 rounded-lg bg-mist flex items-center justify-center text-forest-600">
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-charcoal-800">{p.name}</p>
                              <p className="text-xs text-charcoal-400">{p.desc}</p>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  <div className="flex justify-between pt-4">
                    <button onClick={() => setStep("courier")} className="btn-secondary">
                      Kembali
                    </button>
                    <button onClick={handleOrder} className="btn-primary bg-amber hover:bg-amber-600">
                      Buat Pesanan & Bayar
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right: Sidebar Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-border/60 p-5 space-y-4">
                <h3 className="font-bold text-charcoal-800 border-b border-border/40 pb-3">Ringkasan Pesanan</h3>

                {/* Items preview */}
                <div className="max-h-60 overflow-y-auto space-y-3 pr-1 scrollbar-none">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-mist flex-shrink-0">
                        {item.product.images?.[0] && (
                          <Image
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-charcoal-800 truncate">{item.product.name}</p>
                        <p className="text-[10px] text-charcoal-400">{item.quantity} {item.product.unit} x {formatPrice(item.product.price)}</p>
                      </div>
                      <span className="text-xs font-bold text-charcoal-700">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border/40 pt-3 space-y-2 text-sm">
                  <div className="flex justify-between text-charcoal-500">
                    <span>Subtotal</span>
                    <span className="font-medium text-charcoal-800">{formatPrice(sub)}</span>
                  </div>
                  {voucherDiscount > 0 && (
                    <div className="flex justify-between text-forest-600 font-medium">
                      <span>Voucher Discount</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-charcoal-500">
                    <span>Ongkos Kirim</span>
                    <span className="font-medium text-charcoal-800">{formatPrice(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-charcoal-500">
                    <span>Biaya Platform</span>
                    <span className="font-medium text-charcoal-800">{formatPrice(platformFee)}</span>
                  </div>
                  <div className="border-t border-border/40 pt-3 flex justify-between items-center">
                    <span className="font-bold text-charcoal-800">Total Pembayaran</span>
                    <span className="text-lg font-bold text-forest-700">{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="p-3 bg-forest-50 border border-forest-100 rounded-xl flex items-start gap-2 text-[11px] text-forest-700 leading-normal">
                  <ShieldCheck className="w-4 h-4 text-forest-600 flex-shrink-0 mt-0.5" />
                  <span>Garansi Perlindungan Pembeli Nyiur Nanggroe. Dana aman dengan sistem rekening bersama.</span>
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
