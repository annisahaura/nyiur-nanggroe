"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, Store, Package, BookOpen, Settings,
  LogOut, ShieldAlert, Home, Menu, X, ArrowLeft
} from "lucide-react";
import { useCurrentUser } from "@/lib/stores/auth-store";
import { cn } from "@/lib/utils";

const ADMIN_MENU = [
  { id: "overview", label: "Ringkasan", href: "/admin", icon: LayoutDashboard },
  { id: "users", label: "Manajemen Pengguna", href: "/admin/pengguna", icon: Users },
  { id: "sellers", label: "Manajemen Penjual", href: "/admin/penjual", icon: Store },
  { id: "products", label: "Katalog Produk", href: "/admin/produk", icon: Package },
  { id: "content", label: "Kelola Konten", href: "/admin/konten", icon: BookOpen },
  { id: "settings", label: "Pengaturan Sistem", href: "/admin/pengaturan", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Client-side role checking guard
    if (user && user.role !== "admin") {
      router.push("/");
    }
  }, [user, router]);

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center py-20 text-center">
        <div className="bg-white border p-8 rounded-3xl max-w-sm space-y-4 shadow-xl">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto animate-pulse" />
          <h2 className="text-xl font-bold text-charcoal-800">Akses Ditolak</h2>
          <p className="text-sm text-charcoal-500">Anda tidak memiliki hak akses administrator untuk melihat halaman ini.</p>
          <Link href="/" className="btn-primary w-full justify-center gap-1.5"><ArrowLeft className="w-4 h-4" /> Kembali ke Beranda</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col md:flex-row">
      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-forest-800 text-white px-5 py-4 flex items-center justify-between shrink-0 shadow-md">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display font-bold text-sm">Nyiur Admin Panel</span>
        </Link>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1 text-white">
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar - Desktop and Mobile Drawer */}
      <aside className={cn(
        "md:w-64 bg-forest-900 text-white shrink-0 flex flex-col justify-between py-6 px-4 z-40 transition-all md:relative md:translate-x-0",
        mobileMenuOpen ? "fixed inset-y-0 left-0 w-64 translate-x-0" : "fixed inset-y-0 left-0 -translate-x-full md:translate-x-0"
      )}>
        <div className="space-y-8">
          {/* Logo Brand */}
          <div className="px-3 border-b border-white/10 pb-4">
            <h2 className="font-display font-bold text-lg text-white">Nyiur Nanggroe</h2>
            <p className="text-[10px] text-white/50 font-medium tracking-widest mt-0.5">ADMINISTRATOR SYSTEM</p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {ADMIN_MENU.map(menu => {
              const Icon = menu.icon;
              const isCurrent = pathname === menu.href;
              return (
                <Link
                  key={menu.id}
                  href={menu.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-colors",
                    isCurrent
                      ? "bg-amber-400 text-charcoal-900 font-bold"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {menu.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-white/10 pt-4 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Home className="w-4 h-4 shrink-0" />
            Ke Halaman Utama
          </Link>
          <button
            onClick={() => {
              document.cookie = "nyiur_mock_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
              document.cookie = "nyiur_mock_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
              window.location.href = "/masuk";
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Keluar Sesi
          </button>
        </div>
      </aside>

      {/* Dimmer for mobile drawer */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      {/* Main Panel Content Box */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto min-w-0">
        {children}
      </main>
    </div>
  );
}
