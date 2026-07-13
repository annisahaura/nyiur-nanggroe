"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Minus, Plus, Trash2, ShoppingCart, Tag, Truck,
  ArrowRight, ChevronRight, Package, Gift, Leaf, Check,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ui/ProductCard";
import { useCartStore } from "@/lib/stores/cart-store";
import { MOCK_PRODUCTS, getFeaturedProducts } from "@/lib/data/marketplace-data";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

const SHIPPING_COST = 15000;
const PLATFORM_FEE_RATE = 0.02;

export default function CartPage() {
  const { items, removeItem, updateQuantity, voucher, voucherDiscount, applyVoucher, removeVoucher, subtotal, totalItems } =
    useCartStore();
  const [voucherInput, setVoucherInput] = useState("");
  const [voucherError, setVoucherError] = useState("");
  const [voucherSuccess, setVoucherSuccess] = useState(false);

  // Which items are ticked to go to checkout. Everything starts selected.
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    items.map((i) => i.product.id)
  );

  // Keep selection in sync if items are added/removed elsewhere (e.g. from
  // a product page) while this page is open.
  useEffect(() => {
    setSelectedIds((prev) => {
      const stillValid = prev.filter((id) => items.some((i) => i.product.id === id));
      const newItems = items
        .map((i) => i.product.id)
        .filter((id) => !prev.includes(id) && !stillValid.includes(id));
      return [...stillValid, ...newItems];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  const toggleSelect = (productId: string) => {
    setSelectedIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const allSelected = items.length > 0 && selectedIds.length === items.length;
  const toggleSelectAll = () => {
    setSelectedIds(allSelected ? [] : items.map((i) => i.product.id));
  };

  const selectedItems = items.filter((i) => selectedIds.includes(i.product.id));
  const storeIds = new Set(selectedItems.map((i) => i.product.store?.id).filter(Boolean));
  const multiStoreWarning = storeIds.size > 1;

  const sub = selectedItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const platformFee = Math.round(sub * PLATFORM_FEE_RATE);
  const discountAmount = Math.round(sub * (voucherDiscount / 100));
  const total = sub + (selectedItems.length > 0 ? SHIPPING_COST : 0) + platformFee - discountAmount;
  const recommendations = getFeaturedProducts(4).filter(
    (p) => !items.some((i) => i.product.id === p.id)
  );

  const handleApplyVoucher = () => {
    setVoucherError("");
    const success = applyVoucher(voucherInput);
    if (success) {
      setVoucherSuccess(true);
    } else {
      setVoucherError("Kode voucher tidak valid atau sudah kadaluarsa.");
    }
  };

  const handleProceedToCheckout = () => {
    // Hand off exactly which items were selected to the checkout page.
    sessionStorage.setItem(
      "nyiur_checkout_selection",
      JSON.stringify(selectedIds)
    );
  };

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main id="main-content" className="min-h-[70vh] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 px-4"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-mist flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-charcoal-300" />
            </div>
            <h1 className="text-2xl font-bold text-charcoal-800 mb-2">Keranjang Kosong</h1>
            <p className="text-charcoal-500 mb-8 max-w-sm mx-auto">
              Belum ada produk di keranjangmu. Jelajahi ribuan produk kelapa premium dari Mitra Nyiur.
            </p>
            <Link href="/produk" className="btn-primary">
              <Package className="w-4 h-4" />
              Mulai Belanja
            </Link>

            {recommendations.length > 0 && (
              <div className="mt-16 text-left container-narrow">
                <h2 className="text-lg font-bold text-charcoal-800 mb-4">Produk Unggulan</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {recommendations.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-cream pt-24 md:pt-28">
        <div className="container-base py-8">
          <h1 className="text-2xl font-display font-bold text-charcoal-800 mb-6 flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-forest-600" />
            Keranjang Belanja
            <span className="text-base font-normal text-charcoal-400">
              ({totalItems()} item)
            </span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5 px-1">
                <button
                  onClick={toggleSelectAll}
                  className={cn(
                    "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors flex-shrink-0",
                    allSelected
                      ? "bg-forest-600 border-forest-600"
                      : "border-charcoal-300 bg-white"
                  )}
                  aria-label="Pilih semua produk"
                >
                  {allSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
                <span className="text-sm font-medium text-charcoal-600">
                  Pilih Semua ({selectedItems.length}/{items.length})
                </span>
              </div>

              {multiStoreWarning && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-700">
                  <span>
                    ⚠️ Produk yang kamu pilih berasal dari lebih dari satu toko. Saat
                    ini checkout hanya bisa untuk satu toko sekaligus — pilih produk
                    dari satu toko yang sama dulu ya.
                  </span>
                </div>
              )}

              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-2xl border border-border/60 p-4 flex gap-4"
                  >
                    {/* Select checkbox */}
                    <button
                      onClick={() => toggleSelect(item.product.id)}
                      className={cn(
                        "w-5 h-5 mt-1 rounded-md border-2 flex items-center justify-center transition-colors flex-shrink-0",
                        selectedIds.includes(item.product.id)
                          ? "bg-forest-600 border-forest-600"
                          : "border-charcoal-300 bg-white"
                      )}
                      aria-label={`Pilih ${item.product.name}`}
                    >
                      {selectedIds.includes(item.product.id) && (
                        <Check className="w-3.5 h-3.5 text-white" />
                      )}
                    </button>

                    {/* Product image */}
                    <Link href={`/produk/${item.product.slug}`} className="flex-shrink-0">
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-mist">
                        {item.product.images?.[0] && (
                          <Image
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                    </Link>

                    {/* Product info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs text-charcoal-400 mb-0.5">
                            {item.product.store?.name}
                          </p>
                          <Link
                            href={`/produk/${item.product.slug}`}
                            className="text-sm font-semibold text-charcoal-800 hover:text-forest-600 transition-colors line-clamp-2"
                          >
                            {item.product.name}
                          </Link>
                          {item.product.is_eco_certified && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-moss-600 mt-1">
                              <Leaf className="w-2.5 h-2.5" />
                              Eco Certified
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="p-1.5 rounded-lg text-charcoal-300 hover:text-red-400 hover:bg-red-50 transition-colors flex-shrink-0"
                          aria-label="Hapus item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity */}
                        <div className="flex items-center border border-border rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-charcoal-500 hover:bg-mist transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-10 text-center text-sm font-semibold text-charcoal-800 border-x border-border">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="w-8 h-8 flex items-center justify-center text-charcoal-500 hover:bg-mist transition-colors disabled:opacity-40"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right">
                          <p className="text-base font-bold text-forest-700">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                          <p className="text-xs text-charcoal-400">
                            {formatPrice(item.product.price)} / {item.product.unit}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Voucher */}
              <div className="bg-white rounded-2xl border border-border/60 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Gift className="w-4 h-4 text-amber-600" />
                  <h2 className="text-sm font-bold text-charcoal-800">Kode Voucher</h2>
                </div>
                {voucher ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-forest-50 border border-forest-200">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-forest-600" />
                      <span className="text-sm font-bold text-forest-700">{voucher}</span>
                      <span className="text-xs text-forest-600">(-{voucherDiscount}% diskon)</span>
                    </div>
                    <button
                      onClick={removeVoucher}
                      className="text-xs text-red-500 hover:text-red-600 font-medium"
                    >
                      Hapus
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={voucherInput}
                        onChange={(e) => {
                          setVoucherInput(e.target.value.toUpperCase());
                          setVoucherError("");
                        }}
                        placeholder="Masukkan kode voucher"
                        className="input-base flex-1 text-sm py-2.5"
                      />
                      <button
                        onClick={handleApplyVoucher}
                        className="px-4 py-2.5 bg-forest-600 text-white rounded-xl text-sm font-semibold hover:bg-forest-500 transition-colors"
                      >
                        Terapkan
                      </button>
                    </div>
                    {voucherError && (
                      <p className="text-xs text-red-500">{voucherError}</p>
                    )}
                    <p className="text-xs text-charcoal-400">
                      Coba: NYIUR10 · KELAPA15 · HIJAU20
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-2xl border border-border/60 overflow-hidden">
                <div className="px-5 py-4 border-b border-border/60">
                  <h2 className="font-bold text-charcoal-800">Ringkasan Pesanan</h2>
                </div>
                <div className="p-5 space-y-3">
                  {/* Summary rows */}
                  {[
                    { label: "Subtotal", value: formatPrice(sub) },
                    { label: "Biaya Pengiriman", value: formatPrice(selectedItems.length > 0 ? SHIPPING_COST : 0) },
                    { label: "Biaya Platform", value: formatPrice(platformFee) },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between text-sm">
                      <span className="text-charcoal-500">{label}</span>
                      <span className="font-medium text-charcoal-700">{value}</span>
                    </div>
                  ))}

                  {voucherDiscount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-forest-600 font-medium">Diskon Voucher</span>
                      <span className="font-bold text-forest-600">
                        -{formatPrice(discountAmount)}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-border/60 pt-3 mt-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-charcoal-800">Total</span>
                      <span className="text-xl font-display font-bold text-forest-700">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>

                  {/* Estimated delivery */}
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-mist">
                    <Truck className="w-4 h-4 text-charcoal-500 flex-shrink-0" />
                    <p className="text-xs text-charcoal-600">
                      Estimasi tiba <strong>3-5 hari kerja</strong>
                    </p>
                  </div>

                  <Link
                    href={selectedItems.length > 0 && !multiStoreWarning ? "/checkout" : "#"}
                    onClick={(e) => {
                      if (selectedItems.length === 0 || multiStoreWarning) {
                        e.preventDefault();
                        return;
                      }
                      handleProceedToCheckout();
                    }}
                    aria-disabled={selectedItems.length === 0 || multiStoreWarning}
                    className={cn(
                      "btn-primary w-full justify-center py-4 text-base mt-2",
                      (selectedItems.length === 0 || multiStoreWarning) &&
                        "opacity-40 pointer-events-none cursor-not-allowed"
                    )}
                  >
                    Lanjut ke Pembayaran {selectedItems.length > 0 && `(${selectedItems.length})`}
                    <ArrowRight className="w-5 h-5" />
                  </Link>

                  <Link
                    href="/produk"
                    className="flex items-center justify-center gap-1.5 text-sm text-charcoal-500 hover:text-forest-600 transition-colors py-2"
                  >
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    Lanjut Belanja
                  </Link>
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
