"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MitraSidebar } from "@/components/layout/MitraSidebar";
import { useNotificationStore, initNotifications } from "@/lib/stores/notification-store";
import { Bell, Check, Trash2, ShieldAlert, Sparkles, ShoppingBag, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MitraNotificationsPage() {
  const notifications = useNotificationStore((s) => s.notifications);
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);
  const clearAll = useNotificationStore((s) => s.clearAll);

  const [filter, setFilter] = useState<"all" | "unread" | "system" | "orders">("all");

  // Pre-seed mock notifications for Mitra/Seller on load
  useEffect(() => {
    initNotifications("seller");
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "order_new":
      case "order_paid":
        return <ShoppingBag className="w-4 h-4 text-forest-650" />;
      case "low_stock":
        return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      case "ai_suggestion":
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === "unread") return !n.is_read;
    if (filter === "orders") return n.type.startsWith("order");
    if (filter === "system") return n.type === "system" || n.type === "low_stock";
    return true;
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-24 md:pt-28 pb-8">
        <div className="container-base">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <MitraSidebar activeId="notifications" />
            </aside>

            <div className="lg:col-span-3 space-y-6">
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
                <div>
                  <h1 className="text-xl font-bold text-charcoal-800">Notifikasi Toko</h1>
                  <p className="text-xs text-charcoal-500 mt-0.5">Pantau pemberitahuan pesanan masuk, ulasan pembeli, laporan stok, dan saran AI.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-forest-600 hover:text-forest-700 font-bold flex items-center gap-1 bg-white border border-border px-3 py-2 rounded-xl transition-all"
                  >
                    <Check className="w-3.5 h-3.5" /> Tandai Semua Dibaca
                  </button>
                  <button
                    onClick={clearAll}
                    className="text-xs text-red-500 hover:text-red-600 font-bold flex items-center gap-1 bg-white border border-border px-3 py-2 rounded-xl transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Bersihkan
                  </button>
                </div>
              </div>

              {/* Filters toolbar */}
              <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-none">
                {[
                  { id: "all", label: "Semua Notifikasi" },
                  { id: "unread", label: "Belum Dibaca" },
                  { id: "orders", label: "Pesanan" },
                  { id: "system", label: "Peringatan & Sistem" }
                ].map(btn => (
                  <button
                    key={btn.id}
                    onClick={() => setFilter(btn.id as any)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all",
                      filter === btn.id
                        ? "bg-forest-600 border-forest-600 text-white shadow-sm"
                        : "bg-white border-border text-charcoal hover:bg-mist"
                    )}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>

              {/* Notifications list display */}
              <div className="bg-white rounded-3xl border border-border/60 overflow-hidden shadow-sm divide-y">
                {filteredNotifications.length === 0 ? (
                  <div className="px-6 py-12 text-center text-charcoal-400 text-xs font-medium space-y-2">
                    <Bell className="w-8 h-8 text-charcoal-300 mx-auto" />
                    <p>Tidak ada notifikasi dalam kategori ini.</p>
                  </div>
                ) : (
                  filteredNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={cn(
                        "p-5 flex items-start gap-4 hover:bg-mist/10 cursor-pointer transition-colors relative",
                        !notif.is_read ? "bg-forest-50/15" : ""
                      )}
                    >
                      {/* Left dot indicator for unread */}
                      {!notif.is_read && (
                        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-forest-600 rounded-full" />
                      )}

                      {/* Icon wrapper */}
                      <div className="w-9 h-9 rounded-xl border bg-mist/20 flex items-center justify-center shrink-0">
                        {getIcon(notif.type)}
                      </div>

                      {/* Content details */}
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-xs font-bold text-charcoal-800 leading-snug">{notif.title}</h3>
                          <span className="text-[9px] text-charcoal-400 whitespace-nowrap">
                            {new Date(notif.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="text-[11px] text-charcoal-550 leading-relaxed">{notif.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
