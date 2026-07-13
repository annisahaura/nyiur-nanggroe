"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  ShoppingBag,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Menunggu Pembayaran",
  confirmed: "Dikonfirmasi",
  processing: "Diproses",
  shipped: "Sedang Dikirim",
  delivered: "Selesai",
  cancelled: "Dibatalkan",
  refunded: "Dana Dikembalikan",
};

const STATUS_STYLE: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-600 border-amber-200",
  confirmed: "bg-blue-50 text-blue-600 border-blue-200",
  processing: "bg-blue-50 text-blue-600 border-blue-200",
  shipped: "bg-forest-50 text-forest-600 border-forest-200",
  delivered: "bg-moss-50 text-moss-600 border-moss-200",
  cancelled: "bg-red-50 text-red-500 border-red-200",
  refunded: "bg-charcoal-50 text-charcoal-500 border-charcoal-200",
};

const STATUS_ICON: Record<OrderStatus, typeof Clock> = {
  pending: Clock,
  confirmed: CheckCircle2,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle2,
  cancelled: XCircle,
  refunded: XCircle,
};

const FILTERS: { id: "all" | OrderStatus; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "pending", label: "Menunggu Pembayaran" },
  { id: "processing", label: "Diproses" },
  { id: "shipped", label: "Dikirim" },
  { id: "delivered", label: "Selesai" },
  { id: "cancelled", label: "Dibatalkan" },
];

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product?: {
    id: string;
    name: string;
    slug: string;
    images?: { url: string; is_primary: boolean }[];
  };
}

interface Order {
  id: string;
  order_number: string;
  status: OrderStatus;
  total: number;
  created_at: string;
  tracking_number?: string | null;
  items?: OrderItem[];
  store?: { id: string; name: string; slug: string; logo_url?: string | null };
}

export default function PesananPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders?scope=buyer");
        const json = await res.json();
        if (json.success) {
          setOrders(json.data ?? []);
        } else {
          setErrorMessage(json.error ?? "Gagal memuat pesanan.");
        }
      } catch (err) {
        setErrorMessage("Gagal terhubung ke server. Coba muat ulang halaman.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-cream pt-24 md:pt-28 pb-8 md:pt-24 md:pt-28 pb-12">
        <div className="container-narrow">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-charcoal-800">
              Pesanan Saya
            </h1>
            <p className="text-sm text-charcoal-500 mt-1">
              Pantau status pengiriman dan riwayat belanja kamu di sini.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 mb-6">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border",
                  filter === f.id
                    ? "bg-forest-600 text-white border-forest-600"
                    : "bg-white text-charcoal-600 border-border/60 hover:bg-mist"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-border/60 p-5 h-32 animate-pulse"
                />
              ))}
            </div>
          ) : errorMessage ? (
            <div className="bg-white rounded-2xl border border-border/60 p-10 text-center">
              <p className="text-sm text-red-500 font-medium">{errorMessage}</p>
              <p className="text-xs text-charcoal-400 mt-2">
                Kalau kamu belum masuk akun, silakan{" "}
                <Link href="/masuk?redirect=/pesanan" className="text-forest-600 font-semibold">
                  masuk dulu
                </Link>
                .
              </p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-border/60 p-12 text-center"
            >
              <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-mist flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-charcoal-300" />
              </div>
              <h2 className="text-lg font-bold text-charcoal-800 mb-1.5">
                Belum Ada Pesanan
              </h2>
              <p className="text-sm text-charcoal-500 mb-6 max-w-sm mx-auto">
                Kamu belum punya pesanan{filter !== "all" ? " dengan status ini" : ""}.
                Yuk mulai belanja produk kelapa dari Mitra Nyiur.
              </p>
              <Link href="/produk" className="btn-primary">
                <Package className="w-4 h-4" />
                Mulai Belanja
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order, index) => {
                const StatusIcon = STATUS_ICON[order.status] ?? Clock;
                const primaryItem = order.items?.[0];
                const extraCount = (order.items?.length ?? 1) - 1;

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-border/50 bg-mist/30">
                      <div className="flex items-center gap-2 min-w-0">
                        <Package className="w-3.5 h-3.5 text-charcoal-400 flex-shrink-0" />
                        <span className="text-xs font-semibold text-charcoal-700 truncate">
                          {order.order_number}
                        </span>
                        <span className="text-xs text-charcoal-400 hidden sm:inline">
                          • {new Date(order.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <span
                        className={cn(
                          "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border flex-shrink-0",
                          STATUS_STYLE[order.status]
                        )}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {STATUS_LABEL[order.status]}
                      </span>
                    </div>

                    <div className="p-5 flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-mist flex-shrink-0">
                        {primaryItem?.product?.images?.[0]?.url ? (
                          <Image
                            src={primaryItem.product.images[0].url}
                            alt={primaryItem.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-charcoal-300" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-charcoal-800 truncate">
                          {primaryItem?.product?.name ?? "Produk"}
                        </p>
                        {extraCount > 0 && (
                          <p className="text-xs text-charcoal-400">
                            +{extraCount} produk lainnya
                          </p>
                        )}
                        {order.store?.name && (
                          <p className="text-xs text-charcoal-400 mt-0.5">
                            Toko {order.store.name}
                          </p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-charcoal-400">Total Belanja</p>
                        <p className="text-sm font-bold text-forest-700">
                          {formatPrice(order.total)}
                        </p>
                      </div>
                    </div>

                    <div className="px-5 pb-4 flex items-center justify-between">
                      {order.tracking_number ? (
                        <p className="text-xs text-charcoal-500">
                          No. Resi: <span className="font-semibold">{order.tracking_number}</span>
                        </p>
                      ) : (
                        <span className="text-xs text-charcoal-400">
                          {order.items?.length ?? 1} produk dalam pesanan ini
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
