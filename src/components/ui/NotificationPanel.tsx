"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Bell, Check, Trash2, ShoppingBag, ShieldAlert, Sparkles, Info } from "lucide-react";
import { useNotificationStore } from "@/lib/stores/notification-store";
import { cn } from "@/lib/utils";

interface NotificationPanelProps {
  onClose: () => void;
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const notifications = useNotificationStore((s) => s.notifications);
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);
  const clearAll = useNotificationStore((s) => s.clearAll);

  // Click outside to close panel
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  const getIcon = (type: string) => {
    switch (type) {
      case "order_new":
      case "order_paid":
      case "order_shipped":
        return <ShoppingBag className="w-4 h-4 text-forest-650" />;
      case "low_stock":
        return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      case "ai_suggestion":
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-border shadow-xl z-50 overflow-hidden flex flex-col max-h-[420px]"
    >
      {/* Header bar */}
      <div className="px-4 py-3 border-b flex items-center justify-between bg-mist/10 shrink-0">
        <div className="flex items-center gap-1.5">
          <Bell className="w-4 h-4 text-forest-600" />
          <span className="text-xs font-bold text-charcoal-800">Notifikasi</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllAsRead}
            className="text-[10px] text-forest-600 hover:text-forest-750 font-bold flex items-center gap-0.5"
            title="Tandai semua dibaca"
          >
            <Check className="w-3.5 h-3.5" /> Semua
          </button>
          <span className="text-charcoal-200">|</span>
          <button
            onClick={clearAll}
            className="text-[10px] text-red-500 hover:text-red-600 font-bold flex items-center gap-0.5"
            title="Bersihkan semua"
          >
            <Trash2 className="w-3 h-3" /> Hapus
          </button>
        </div>
      </div>

      {/* Notifications list */}
      <div className="overflow-y-auto flex-1 divide-y pr-0.5">
        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-charcoal-400 text-xs font-medium space-y-1.5">
            <Bell className="w-6 h-6 text-charcoal-300 mx-auto" />
            <p>Tidak ada pemberitahuan baru.</p>
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                markAsRead(item.id);
                if (item.href) {
                  onClose();
                  window.location.href = item.href;
                }
              }}
              className={cn(
                "p-3.5 flex gap-3 hover:bg-mist/15 cursor-pointer transition-colors relative text-left",
                !item.is_read ? "bg-forest-50/10" : ""
              )}
            >
              {/* Unread dot */}
              {!item.is_read && (
                <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-forest-600 rounded-full" />
              )}
              {/* Icon */}
              <div className="w-8 h-8 rounded-lg border bg-mist/20 flex items-center justify-center shrink-0 mt-0.5">
                {getIcon(item.type)}
              </div>
              {/* Content */}
              <div className="space-y-0.5 flex-1 min-w-0">
                <h4 className="text-xs font-bold text-charcoal-850 leading-tight truncate">{item.title}</h4>
                <p className="text-[10px] text-charcoal-550 leading-normal line-clamp-2">{item.message}</p>
                <span className="text-[9px] text-charcoal-400 font-medium block pt-0.5">
                  {new Date(item.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer bar */}
      <div className="px-4 py-2 border-t text-center bg-mist/5 shrink-0">
        <Link
          href="/akun"
          onClick={onClose}
          className="text-[10px] font-bold text-forest-650 hover:underline"
        >
          Lihat Semua Aktivitas
        </Link>
      </div>
    </div>
  );
}
