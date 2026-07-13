"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingBag, BarChart3,
  Users, MessageSquare, Store, Bell, Settings, ShieldCheck, Box
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/lib/stores/auth-store";

interface SidebarProps {
  activeId: string;
}

export function MitraSidebar({ activeId }: SidebarProps) {
  const pathname = usePathname();
  const user = useCurrentUser();

  const storeName = user?.store_name || "Karya Nyiur Aceh";

  const MENU_ITEMS = [
    { id: "overview", label: "Ringkasan", href: "/mitra", icon: LayoutDashboard },
    { id: "products", label: "Kelola Produk", href: "/mitra/produk", icon: Package },
    { id: "orders", label: "Kelola Pesanan", href: "/mitra/pesanan", icon: ShoppingBag },
    { id: "inventory", label: "Inventaris", href: "/mitra/inventaris", icon: Box },
    { id: "analytics", label: "Analitik Toko", href: "/mitra/analitik", icon: BarChart3 },
    { id: "customers", label: "Pelanggan", href: "/mitra/pelanggan", icon: Users },
    { id: "messages", label: "Pesan", href: "/mitra/pesan", icon: MessageSquare },
    { id: "profile", label: "Profil Toko", href: "/mitra/profil-toko", icon: Store },
    { id: "notifications", label: "Notifikasi Toko", href: "/mitra/notifikasi", icon: Bell },
    { id: "settings", label: "Pengaturan", href: "/mitra/pengaturan", icon: Settings },
  ];

  return (
    <div className="space-y-6">
      {/* Mini Profile Card */}
      <div className="bg-white rounded-2xl border border-border/60 p-5 flex items-center gap-3 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center font-bold text-forest-700 text-lg">
          {storeName.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="flex items-center gap-1">
            <p className="text-sm font-bold text-charcoal-800 line-clamp-1">{storeName}</p>
            <ShieldCheck className="w-3.5 h-3.5 text-forest-500 flex-shrink-0" />
          </div>
          <p className="text-xs text-charcoal-400 flex items-center gap-0.5">
            Mitra Terverifikasi <ShieldCheck className="w-3.5 h-3.5 text-forest-500" aria-hidden="true" />
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="bg-white rounded-2xl border border-border/60 p-3 space-y-1 shadow-sm">
        {MENU_ITEMS.map((menu) => {
          const Icon = menu.icon;
          const isCurrent = activeId === menu.id || pathname === menu.href;
          return (
            <Link
              key={menu.id}
              href={menu.href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors",
                isCurrent
                  ? "bg-forest-600 text-white font-semibold shadow-sm"
                  : "text-charcoal-600 hover:bg-mist"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {menu.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
