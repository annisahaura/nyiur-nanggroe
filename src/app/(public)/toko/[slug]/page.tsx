"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin, Star, MessageSquare, ShieldCheck, Leaf, Calendar,
  Briefcase, BarChart3, HelpCircle, Package, ArrowRight
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ui/ProductCard";
import { getStoreBySlug, getStoreProducts } from "@/lib/data/marketplace-data";
import { formatNumber } from "@/lib/utils";

import { use } from "react";

export default function StoreProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const store = getStoreBySlug(resolvedParams.slug);
  if (!store) notFound();

  const products = getStoreProducts(store.id);

  // Hardcode environmental impacts based on seller type/products for realism
  const co2Saved = store.id === "store-1" ? 1420 : store.id === "store-2" ? 3420 : 850;
  const wasteDiverted = store.id === "store-1" ? 2840 : store.id === "store-2" ? 6200 : 1800;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-24 md:pt-28">
        {/* Banner */}
        <div className="relative h-48 sm:h-64 md:h-80 bg-forest-700 overflow-hidden">
          {store.banner_url && (
            <Image
              src={store.banner_url}
              alt={`${store.name} banner`}
              fill
              className="object-cover opacity-60"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 to-transparent" />
        </div>

        {/* Store Profile Card Header */}
        <div className="container-base -mt-16 sm:-mt-24 relative z-10 mb-8">
          <div className="bg-white rounded-3xl border border-border/60 p-6 md:p-8 shadow-lg flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Logo */}
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-white border border-border/40 shadow-sm flex-shrink-0">
              {store.logo_url && (
                <Image
                  src={store.logo_url}
                  alt={`${store.name} logo`}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            {/* Info details */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-display font-bold text-charcoal-800">
                  {store.name}
                </h1>
                {store.is_verified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-forest-50 border border-forest-200 text-forest-700 text-xs font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
                    Verified Mitra
                  </span>
                )}
                {store.owner_id === "user-2" && (
                  <span className="badge-eco">
                    <Leaf className="w-3 h-3" /> Eco Certified
                  </span>
                )}
              </div>

              <p className="text-sm text-charcoal-600 max-w-2xl leading-relaxed">
                {store.description}
              </p>

              <div className="flex items-center gap-4 flex-wrap text-xs sm:text-sm text-charcoal-500">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-charcoal-400" />
                  {store.location}
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber text-amber" />
                  <strong>{store.rating.toFixed(1)}</strong> ({formatNumber(store.total_sales)} Penjualan)
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-charcoal-400" />
                  Mitra Sejak {new Date(store.created_at).getFullYear()}
                </div>
              </div>
            </div>

            {/* CTA action contact */}
            <div className="w-full md:w-auto flex-shrink-0 flex gap-2">
              <a
                href={`https://wa.me/${store.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 md:flex-none btn-primary gap-2 text-xs sm:text-sm px-5 py-3"
              >
                <MessageSquare className="w-4 h-4" /> Hubungi Penjual
              </a>
            </div>
          </div>
        </div>

        {/* Environmental contribution and Stats Grid */}
        <div className="container-base mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-moss-50 to-white rounded-2xl border border-moss-200/60 p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-moss-100 flex items-center justify-center text-moss-600 flex-shrink-0">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-moss-700">{co2Saved} kg</p>
                <p className="text-xs text-moss-600 font-semibold uppercase tracking-wider">Potensi Emisi CO₂ Dikurangi</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-forest-50/50 to-white rounded-2xl border border-forest-200/60 p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-forest-100 flex items-center justify-center text-forest-600 flex-shrink-0">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-forest-700">{wasteDiverted} kg</p>
                <p className="text-xs text-forest-600 font-semibold uppercase tracking-wider">Limbah Kelapa Dialihkan</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border/60 p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-mist flex items-center justify-center text-charcoal-600 flex-shrink-0">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-charcoal-800">{products.length}</p>
                <p className="text-xs text-charcoal-400 font-semibold uppercase tracking-wider">Katalog Produk Aktif</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Catalog */}
        <div className="container-base pb-16">
          <h2 className="text-xl font-bold text-charcoal-800 mb-6">Semua Produk Penjual</h2>
          {products.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-border/60">
              <p className="text-charcoal-500">Penjual belum menambahkan produk.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
