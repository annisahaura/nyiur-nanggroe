"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart, Share2, ShoppingCart, Zap, Minus, Plus, Truck,
  Shield, MapPin, Star, MessageCircle, Store, Leaf, Package,
  ChevronRight, CheckCircle2,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ImageGallery } from "@/components/marketplace/ImageGallery";
import { AIInsightPanel } from "@/components/marketplace/AIInsightPanel";
import { ReviewSection } from "@/components/marketplace/ReviewSection";
import { ProductCard } from "@/components/ui/ProductCard";
import { StarRating } from "@/components/ui/StarRating";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { VisualSearchModal } from "@/components/marketplace/VisualSearchModal";
import {
  MOCK_PRODUCTS, getProductBySlug, getRelatedProducts,
  getProductReviews, getAIInsight,
} from "@/lib/data/marketplace-data";
import { useCartStore } from "@/lib/stores/cart-store";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { formatPrice, formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

import { use } from "react";

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const product = getProductBySlug(resolvedParams.slug);
  if (!product) notFound();

  const relatedProducts = getRelatedProducts(product);
  const reviews = getProductReviews(product.id);
  const aiInsight = getAIInsight(product.slug);

  const addItem = useCartStore((s) => s.addItem);
  const toggle = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id));

  const [quantity, setQuantity] = useState(product.min_order);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "shipping">("description");

  const store = product.store!;
  const images = product.images ?? [];

  const handleAddToCart = () => {
    const added = addItem(product, quantity);
    if (!added) {
      const currentUrl = window.location.pathname + window.location.search;
      router.push(`/masuk?alasan=keranjang&redirect=${encodeURIComponent(currentUrl)}`);
      return;
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    const added = addItem(product, quantity);
    if (!added) {
      const currentUrl = window.location.pathname + window.location.search;
      router.push(`/masuk?alasan=checkout&redirect=${encodeURIComponent(currentUrl)}`);
      return;
    }
    window.location.href = "/checkout";
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const breadcrumbs = [
    { label: "Produk", href: "/produk" },
    { label: product.category?.name ?? "Kategori", href: `/produk?kategori=${product.category?.slug}` },
    { label: product.name },
  ];

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-cream pt-24 md:pt-28">
        <div className="container-base py-6 md:py-8">
          {/* Breadcrumb */}
          <Breadcrumb items={breadcrumbs} className="mb-6" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12 mb-12">
            {/* Left: Gallery */}
            <div>
              <ImageGallery images={images} productName={product.name} />
            </div>

            {/* Right: Product Info */}
            <div className="space-y-5">
              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                {product.is_eco_certified && (
                  <span className="badge-eco">
                    <Leaf className="w-3 h-3" />
                    Eco Certified
                  </span>
                )}
                {product.is_featured && (
                  <span className="badge-new">✦ Produk Unggulan</span>
                )}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-charcoal-100 text-charcoal-600 text-xs font-medium">
                  {product.category?.icon} {product.category?.name}
                </span>
              </div>

              {/* Name */}
              <h1 className="text-2xl md:text-3xl font-display font-bold text-charcoal-800 leading-tight">
                {product.name}
              </h1>

              {/* Rating & Sales */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <StarRating rating={product.rating} size="sm" showValue />
                  <span className="text-xs text-charcoal-400">
                    ({product.review_count.toLocaleString("id-ID")} ulasan)
                  </span>
                </div>
                <div className="w-1 h-1 rounded-full bg-charcoal-200" />
                <span className="text-xs text-charcoal-500">
                  {product.total_sold.toLocaleString("id-ID")}+ terjual
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-bold text-forest-700">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm text-charcoal-400">/ {product.unit}</span>
                {product.min_order > 1 && (
                  <span className="text-xs text-amber-600 font-medium">
                    Min. {product.min_order} {product.unit}
                  </span>
                )}
              </div>

              {/* Eco metrics */}
              {(product.co2_saved || product.waste_diverted) && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-moss-50 border border-moss-200/60">
                  <Leaf className="w-4 h-4 text-moss-600 flex-shrink-0" />
                  <div className="flex gap-4 text-xs">
                    {product.co2_saved && (
                      <span className="text-moss-700">
                        <strong>{product.co2_saved} kg</strong> CO₂ hemat
                      </span>
                    )}
                    {product.waste_diverted && (
                      <span className="text-moss-700">
                        <strong>{product.waste_diverted} kg</strong> limbah dialihkan
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-border/60" />

              {/* Quantity Selector */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-charcoal-700">
                  Jumlah
                  <span className="ml-2 text-xs font-normal text-charcoal-400">
                    Stok: {product.stock.toLocaleString("id-ID")} {product.unit}
                  </span>
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-border rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity((q) => Math.max(product.min_order, q - 1))}
                      className="w-10 h-10 flex items-center justify-center text-charcoal-500 hover:bg-mist transition-colors"
                      aria-label="Kurangi"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-14 text-center text-sm font-semibold text-charcoal-800 border-x border-border">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="w-10 h-10 flex items-center justify-center text-charcoal-500 hover:bg-mist transition-colors"
                      aria-label="Tambah"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm text-charcoal-500">
                    Subtotal:{" "}
                    <span className="font-bold text-forest-700">
                      {formatPrice(product.price * quantity)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-all",
                    addedToCart
                      ? "bg-moss text-white"
                      : "btn-secondary"
                  )}
                >
                  {addedToCart ? (
                    <><CheckCircle2 className="w-4 h-4" /> Ditambahkan!</>
                  ) : (
                    <><ShoppingCart className="w-4 h-4" /> Keranjang</>
                  )}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex-1 btn-primary py-3.5"
                >
                  <Zap className="w-4 h-4" />
                  Beli Sekarang
                </button>
              </div>

              {/* Wishlist & Share */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggle(product)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all",
                    isWishlisted
                      ? "border-red-200 bg-red-50 text-red-500"
                      : "border-border text-charcoal-600 hover:bg-mist"
                  )}
                >
                  <Heart className={cn("w-4 h-4", isWishlisted ? "fill-red-500" : "")} />
                  {isWishlisted ? "Tersimpan" : "Simpan"}
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-charcoal-600 hover:bg-mist transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Bagikan
                </button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { icon: Shield, label: "Pembayaran Aman" },
                  { icon: Truck, label: "Gratis Ongkir*" },
                  { icon: CheckCircle2, label: "Garansi Kualitas" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-mist text-center">
                    <Icon className="w-4 h-4 text-forest-500" />
                    <span className="text-[10px] font-medium text-charcoal-600">{label}</span>
                  </div>
                ))}
              </div>

              {/* Seller mini card */}
              <div className="flex items-center justify-between p-4 rounded-2xl border border-border/60 bg-white hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center text-forest-700 font-bold text-base">
                    {store.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-charcoal-800">{store.name}</p>
                      {store.is_verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-forest-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-charcoal-400">
                      <MapPin className="w-3 h-3" />
                      {store.city}
                      <span>·</span>
                      <Star className="w-3 h-3 fill-amber text-amber" />
                      {store.rating}
                    </div>
                  </div>
                </div>
                <Link
                  href={`/toko/${store.slug}`}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-forest-200 text-forest-600 text-xs font-medium hover:bg-forest-50 transition-colors"
                >
                  <Store className="w-3.5 h-3.5" />
                  Kunjungi
                </Link>
              </div>
            </div>
          </div>

          {/* AI Insight Panel */}
          {aiInsight && (
            <div className="mb-10">
              <AIInsightPanel insight={aiInsight} />
            </div>
          )}

          {/* Product Details Tabs */}
          <div className="bg-white rounded-2xl border border-border/60 mb-10 overflow-hidden">
            <div className="flex border-b border-border/60">
              {(["description", "specs", "shipping"] as const).map((tab) => {
                const labels = { description: "Deskripsi", specs: "Spesifikasi", shipping: "Pengiriman" };
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "flex-1 py-4 text-sm font-semibold transition-all",
                      activeTab === tab
                        ? "text-forest-600 border-b-2 border-forest-600"
                        : "text-charcoal-500 hover:text-charcoal-700"
                    )}
                  >
                    {labels[tab]}
                  </button>
                );
              })}
            </div>

            <div className="p-6">
              {activeTab === "description" && (
                <div className="prose prose-sm max-w-none text-charcoal-700 leading-relaxed">
                  <p>{product.description}</p>
                  {product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 not-prose">
                      {product.tags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/produk?q=${encodeURIComponent(tag)}`}
                          className="px-3 py-1 rounded-full bg-mist text-charcoal-600 text-xs hover:bg-forest-50 hover:text-forest-600 transition-colors"
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "specs" && (
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-border/40">
                    {[
                      { label: "Berat", value: product.weight ? `${product.weight} gram` : "-" },
                      { label: "Satuan", value: product.unit },
                      { label: "Min. Order", value: `${product.min_order} ${product.unit}` },
                      { label: "Stok", value: `${product.stock.toLocaleString("id-ID")} ${product.unit}` },
                      { label: "Kategori", value: product.category?.name },
                      { label: "Eco Certified", value: product.is_eco_certified ? "✅ Ya" : "❌ Tidak" },
                    ].map(({ label, value }) => (
                      <tr key={label}>
                        <td className="py-3 pr-4 font-medium text-charcoal-500 w-40 align-top">{label}</td>
                        <td className="py-3 text-charcoal-800">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "shipping" && (
                <div className="space-y-4">
                  {[
                    { courier: "JNE REG", time: "2-5 hari kerja", price: "Rp 15.000 – 45.000" },
                    { courier: "J&T Express", time: "1-4 hari kerja", price: "Rp 12.000 – 38.000" },
                    { courier: "SiCepat REG", time: "1-3 hari kerja", price: "Rp 14.000 – 40.000" },
                    { courier: "AnterAja", time: "2-5 hari kerja", price: "Rp 10.000 – 32.000" },
                  ].map((c) => (
                    <div key={c.courier} className="flex items-center justify-between py-3 border-b border-border/40 last:border-0">
                      <div className="flex items-center gap-3">
                        <Truck className="w-4 h-4 text-charcoal-400" />
                        <div>
                          <p className="text-sm font-semibold text-charcoal-800">{c.courier}</p>
                          <p className="text-xs text-charcoal-400">{c.time}</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-charcoal-700">{c.price}</span>
                    </div>
                  ))}
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-100">
                    <Package className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">
                      Gratis ongkir untuk pembelian minimum Rp 300.000 ke seluruh Indonesia (kecuali pulau terpencil).
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reviews */}
          <div className="mb-12">
            <ReviewSection
              reviews={reviews}
              rating={product.rating}
              reviewCount={product.review_count}
              productName={product.name}
            />
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-charcoal-800">Produk Serupa</h2>
                <Link
                  href={`/produk?kategori=${product.category?.slug}`}
                  className="text-sm font-medium text-forest-600 hover:text-forest-500 flex items-center gap-1"
                >
                  Lihat Semua <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <VisualSearchModal />
      <Footer />
    </>
  );
}
