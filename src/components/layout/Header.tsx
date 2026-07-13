"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  Camera,
  Sparkles,
  Leaf,
  BookOpen,
  TreePine,
  Store,
  LogOut,
  Package,
  BarChart3,
  Settings,
  Bell,
  FileText,
  Brain,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";
import { useCurrentUser, useAuthStore } from "@/lib/stores/auth-store";
import { useNotificationStore, initNotifications } from "@/lib/stores/notification-store";
import { NotificationPanel } from "@/components/ui/NotificationPanel";

const NAV_ITEMS = [
  {
    label: "Produk",
    href: "/produk",
    icon: Package,
    children: null,
  },
  {
    label: "Edukasi",
    href: "/edukasi",
    icon: BookOpen,
    children: [
      { label: "Artikel", href: "/edukasi/artikel", icon: FileText },
      { label: "Kuis Kelapa", href: "/edukasi/kuis", icon: Brain },
      { label: "Panduan UMKM", href: "/edukasi/artikel?kategori=panduan-umkm", icon: LayoutDashboard },
    ],
  },
  {
    label: "Dampak",
    href: "/dampak",
    icon: TreePine,
    children: null,
  },
  {
    label: "Jualan",
    href: "/daftar-mitra",
    icon: Store,
    children: null,
  },
];

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const user = useCurrentUser();
  const logout = useAuthStore((s) => s.logout);
  const profile = user;
  const isLoading = false;

  // When on the homepage and not scrolled, the header sits over the dark hero image
  const isHeroPage = pathname === "/";
  const heroTransparent = isHeroPage && !isScrolled;
  const unreadNotifCount = useNotificationStore((s) => s.unreadCount);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initialize notifications on user load
  useEffect(() => {
    if (user && user.role !== "guest") {
      initNotifications(user.role);
    }
  }, [user]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
    setActiveDropdown(null);
    setSearchOpen(false);
  }, [pathname]);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideNav = dropdownRef.current?.contains(target);
      const insideUserMenu = userMenuRef.current?.contains(target);
      if (!insideNav && !insideUserMenu) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await logout();
    window.location.href = "/masuk";
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/produk?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[60] transition-all duration-300",
          isScrolled
            ? "glass-nav"
            : "bg-transparent",
          className
        )}
      >
        <div className="container-base">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <Link
              href="/"
              onClick={(e) => {
                // If already on the homepage, Next.js won't re-navigate,
                // so force a scroll-to-top instead of doing nothing.
                if (pathname === "/") {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  return;
                }
                // Explicit navigation fallback: guarantees the click always
                // takes the user home even if the native <Link> navigation
                // gets swallowed (e.g. by a gesture handler from an
                // animated wrapper sitting on top of it).
                e.preventDefault();
                router.push("/");
              }}
              className="flex items-center gap-2.5 group flex-shrink-0"
              aria-label="Nyiur Nanggroe — Halaman Utama"
            >
              {/* Real logo image */}
              <div className="relative w-9 h-9 flex-shrink-0">
                <motion.div
                  className="w-9 h-9 rounded-xl overflow-hidden shadow-sm"
                  whileHover={{ rotate: [0, -5, 5, 0], scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/Logo-NyiurNanggroe.png"
                    alt="Logo Nyiur Nanggroe"
                    className="w-full h-full object-contain"
                  />
                </motion.div>
              </div>

              <div className="hidden sm:block">
                <div className={cn("font-display font-bold text-base leading-tight transition-colors dark:text-foreground", heroTransparent ? "text-white" : "text-forest-700")}>
                  Nyiur Nanggroe
                </div>
                <div className={cn("text-[10px] font-medium leading-none transition-colors dark:text-foreground/60", heroTransparent ? "text-white/70" : "text-charcoal-400")}>
                  Circular Economy Kelapa
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav
              className="hidden lg:flex items-center gap-1"
              aria-label="Navigasi utama"
              ref={dropdownRef}
            >
              {NAV_ITEMS.map((item) => (
                <div key={item.href} className="relative">
                  {item.children ? (
                    <div
                      className={cn(
                        "flex items-center rounded-lg text-sm font-medium transition-all duration-150",
                        heroTransparent
                          ? isActive(item.href)
                            ? "text-white bg-white/15"
                            : "text-white/90 hover:text-white hover:bg-white/10"
                          : isActive(item.href)
                            ? "text-forest-600 dark:text-ring bg-forest-50 dark:bg-secondary"
                            : "text-charcoal-600 dark:text-foreground/80 hover:text-forest-600 dark:hover:text-ring hover:bg-mist dark:hover:bg-secondary"
                      )}
                    >
                      {/* Clicking the label navigates straight to the section's main page */}
                      <Link
                        href={item.href}
                        className="pl-3 pr-1.5 py-2 rounded-l-lg"
                      >
                        {item.label}
                      </Link>
                      {/* Clicking the chevron only toggles the dropdown */}
                      <button
                        className="pr-2.5 pl-1 py-2 rounded-r-lg"
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === item.label ? null : item.label
                          )
                        }
                        aria-expanded={activeDropdown === item.label}
                        aria-haspopup="true"
                        aria-label={`Buka submenu ${item.label}`}
                      >
                        <ChevronDown
                          className={cn(
                            "w-3.5 h-3.5 transition-transform duration-200",
                            activeDropdown === item.label ? "rotate-180" : ""
                          )}
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                        heroTransparent
                          ? isActive(item.href)
                            ? "text-white bg-white/15"
                            : "text-white/90 hover:text-white hover:bg-white/10"
                          : isActive(item.href)
                            ? "text-forest-600 dark:text-ring bg-forest-50 dark:bg-secondary"
                            : "text-charcoal-600 dark:text-foreground/80 hover:text-forest-600 dark:hover:text-ring hover:bg-mist dark:hover:bg-secondary"
                      )}
                    >
                      {item.label}
                    </Link>
                  )}

                  {/* Dropdown */}
                  <AnimatePresence>
                    {item.children && activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 w-52 bg-popover text-popover-foreground rounded-2xl shadow-glass-lg border border-border/60 overflow-hidden"
                        role="menu"
                        aria-label={`Menu ${item.label}`}
                      >
                        <div className="p-1.5">
                        {item.children.map((child) => {
                            const ChildIcon = child.icon;
                            return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground/80 hover:text-primary dark:hover:text-ring hover:bg-secondary transition-colors"
                              role="menuitem"
                            >
                              <ChildIcon className="w-4 h-4 text-forest-500 flex-shrink-0" aria-hidden="true" />
                              {child.label}
                            </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className={cn("p-2 rounded-lg transition-all duration-150 dark:text-foreground/80 dark:hover:bg-secondary", heroTransparent ? "text-white/90 hover:text-white hover:bg-white/10" : "text-charcoal-500 hover:text-forest-600 hover:bg-mist")}
                aria-label="Buka pencarian"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Visual Search (AI) */}
              <button
                onClick={() => (window.location.href = "/produk?visual=1")}
                className={cn("hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150", heroTransparent ? "text-amber-200 bg-white/10 hover:bg-white/20 border border-white/15" : "text-amber-700 bg-amber-50 hover:bg-amber-100")}
                aria-label="Cari dengan foto (AI Visual Search)"
              >
                <Camera className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden md:inline">Visual AI</span>
              </button>

              {profile ? (
                <>
                  {/* Wishlist */}
                  <Link
                    href="/wishlist"
                    className={cn("relative p-2 rounded-lg transition-all duration-150 dark:text-foreground/80 dark:hover:bg-secondary", heroTransparent ? "text-white/90 hover:text-white hover:bg-white/10" : "text-charcoal-500 hover:text-forest-600 hover:bg-mist")}
                    aria-label="Daftar Keinginan"
                  >
                    <Heart className="w-5 h-5" />
                  </Link>

                  {/* Cart */}
                  <Link
                    href="/keranjang"
                    className={cn("relative p-2 rounded-lg transition-all duration-150 dark:text-foreground/80 dark:hover:bg-secondary", heroTransparent ? "text-white/90 hover:text-white hover:bg-white/10" : "text-charcoal-500 hover:text-forest-600 hover:bg-mist")}
                    aria-label="Keranjang Belanja"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </Link>

                  {/* Notifications */}
                  <div className="relative">
                    <button
                      onClick={() => setNotificationsOpen(!notificationsOpen)}
                      className={cn("relative p-2 rounded-lg transition-all duration-150 dark:text-foreground/80 dark:hover:bg-secondary", heroTransparent ? "text-white/90 hover:text-white hover:bg-white/10" : "text-charcoal-500 hover:text-forest-600 hover:bg-mist")}
                      aria-label="Notifikasi"
                    >
                      <Bell className="w-5 h-5" />
                      {unreadNotifCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      )}
                    </button>
                    {notificationsOpen && (
                      <NotificationPanel onClose={() => setNotificationsOpen(false)} />
                    )}
                  </div>

                  {/* User Menu */}
                  <div className="relative ml-1" ref={userMenuRef}>
                    <button
                      className={cn("flex items-center gap-2 rounded-xl p-1.5 transition-colors", heroTransparent ? "hover:bg-white/10" : "hover:bg-mist")}
                      aria-label="Menu pengguna"
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === "user" ? null : "user"
                        )
                      }
                    >
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm", heroTransparent ? "bg-white/20 text-white" : "bg-forest-100 text-forest-700")}>
                        {profile.full_name?.charAt(0).toUpperCase() ?? "U"}
                      </div>
                    </button>

                    <AnimatePresence>
                      {activeDropdown === "user" && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-glass-lg border border-border/60 overflow-hidden"
                        >
                          <div className="px-4 py-3 border-b border-border/60">
                            <p className="text-sm font-semibold text-charcoal-800">
                              {profile.full_name}
                            </p>
                              <p className="text-xs text-charcoal-400 mt-0.5">
                                {profile.role === "seller" ? (
                                  <span className="flex items-center gap-1">
                                    <Leaf className="w-3 h-3 text-forest-500" aria-hidden="true" /> Mitra Nyiur
                                  </span>
                                ) : "Member"}
                              </p>
                          </div>
                          <div className="p-1.5">
                            <Link
                              href="/akun"
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-charcoal-600 hover:text-forest-600 hover:bg-forest-50 transition-colors"
                            >
                              <User className="w-4 h-4" /> Profil Saya
                            </Link>
                            <Link
                              href="/pesanan"
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-charcoal-600 hover:text-forest-600 hover:bg-forest-50 transition-colors"
                            >
                              <Package className="w-4 h-4" /> Pesanan
                            </Link>
                            {profile.role === "seller" && (
                              <>
                                <Link
                                  href="/mitra/analitik"
                                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-charcoal-600 hover:text-forest-600 hover:bg-forest-50 transition-colors"
                                >
                                  <BarChart3 className="w-4 h-4" /> Analitik Toko
                                </Link>
                                <Link
                                  href="/mitra/produk"
                                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-charcoal-600 hover:text-forest-600 hover:bg-forest-50 transition-colors"
                                >
                                  <Store className="w-4 h-4" /> Kelola Toko
                                </Link>
                              </>
                            )}
                            {profile.role === "admin" && (
                              <Link
                                href="/admin"
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-charcoal-600 hover:text-forest-600 hover:bg-forest-50 transition-colors"
                              >
                                <Settings className="w-4 h-4" /> Admin Panel
                              </Link>
                            )}
                            <div className="border-t border-border/60 mt-1.5 pt-1.5">
                              <button
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <LogOut className="w-4 h-4" /> Keluar
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                !isLoading && (
                  <div className="hidden sm:flex items-center gap-2 ml-1 relative z-10 pointer-events-auto">
                    <button
                      type="button"
                      onClick={() => router.push("/masuk")}
                      className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150", heroTransparent ? "text-white/90 hover:text-white hover:bg-white/10" : "text-forest-600 hover:bg-forest-50")}
                    >
                      Masuk
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push("/daftar")}
                      className={cn("px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 shadow-sm", heroTransparent ? "bg-white text-forest-700 hover:bg-white/90" : "bg-forest-600 text-cream hover:bg-forest-500")}
                    >
                      Daftar
                    </button>
                  </div>
                )
              )}

              {/* Mobile Menu Toggle */}
              <button
                className={cn("lg:hidden p-2 rounded-lg ml-1 transition-all duration-150 dark:text-foreground/80 dark:hover:bg-secondary", heroTransparent ? "text-white hover:bg-white/10" : "text-charcoal-600 hover:bg-mist")}
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                aria-label={isMobileOpen ? "Tutup menu" : "Buka menu"}
                aria-expanded={isMobileOpen}
              >
                <AnimatePresence mode="wait">
                  {isMobileOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-charcoal-900/40 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, delay: 0.05 }}
              className="w-full bg-white border-b border-border shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="container-base py-4">
                <form onSubmit={handleSearch} className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-charcoal-400 flex-shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari produk kelapa, kerajinan, briket, minyak..."
                    className="flex-1 text-base text-charcoal placeholder:text-charcoal-300 bg-transparent border-none outline-none"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => (window.location.href = "/produk?visual=1")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-xs font-medium hover:bg-amber-100 transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    Foto
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="p-2 rounded-lg text-charcoal-400 hover:text-charcoal hover:bg-mist transition-colors"
                    aria-label="Tutup pencarian"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs text-charcoal-400">Populer:</span>
                  {["Briket kelapa", "Cocopeat", "Tempurung", "Minyak VCO"].map(
                    (term) => (
                      <button
                        key={term}
                        onClick={() => {
                          setSearchQuery(term);
                          window.location.href = `/produk?q=${encodeURIComponent(term)}`;
                        }}
                        className="px-2.5 py-1 rounded-full bg-mist text-charcoal-600 text-xs hover:bg-forest-50 hover:text-forest-600 transition-colors"
                      >
                        {term}
                      </button>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-charcoal-900/40 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-80 bg-white shadow-xl lg:hidden overflow-y-auto"
            >
              {/* Mobile Nav Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-forest-600 rounded-lg flex items-center justify-center">
                    <Leaf className="w-4 h-4 text-cream" />
                  </div>
                  <span className="font-display font-bold text-forest-700">
                    Nyiur Nanggroe
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-lg text-charcoal-400 hover:bg-mist"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="px-4 py-3 border-b border-border/60">
                <div className="flex items-center gap-2.5 px-4 py-3 bg-mist rounded-xl">
                  <Search className="w-4 h-4 text-charcoal-400" />
                  <input
                    type="search"
                    placeholder="Cari produk..."
                    className="flex-1 text-sm bg-transparent border-none outline-none text-charcoal placeholder:text-charcoal-300"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const query = (e.target as HTMLInputElement).value;
                        if (query) window.location.href = `/produk?q=${encodeURIComponent(query)}`;
                      }
                    }}
                  />
                </div>
              </div>

              {/* Mobile Nav Items */}
              <nav className="p-4 space-y-1" aria-label="Navigasi mobile">
                {NAV_ITEMS.map((item) => (
                  <div key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                        isActive(item.href)
                          ? "text-forest-600 bg-forest-50"
                          : "text-charcoal-700 hover:text-forest-600 hover:bg-mist"
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                    {item.children && (
                      <div className="ml-7 mt-1 space-y-0.5">
                        {item.children.map((child) => {
                          const ChildIcon = child.icon;
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-charcoal-500 hover:text-forest-600 hover:bg-mist transition-colors"
                            >
                              <ChildIcon className="w-4 h-4 text-forest-500 flex-shrink-0" aria-hidden="true" />
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Mobile Visual Search */}
              <div className="px-4 pb-4">
                <button
                  onClick={() => (window.location.href = "/produk?visual=1")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-50 text-amber-700 font-medium text-sm border border-amber-200 hover:bg-amber-100 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  AI Visual Search — Cari Pakai Foto
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Mobile Auth */}
              <div className="px-4 pb-8 border-t border-border/60 pt-4">
                {profile ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 px-4 py-3 bg-forest-50 rounded-xl">
                      <div className="w-10 h-10 rounded-xl bg-forest-200 flex items-center justify-center font-bold text-forest-700">
                        {profile.full_name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-charcoal-800">
                          {profile.full_name}
                        </p>
                        <p className="text-xs text-charcoal-400">
                          {profile.role === "seller" ? (
                            <span className="flex items-center gap-1">
                              <Leaf className="w-3 h-3 text-forest-500" aria-hidden="true" /> Mitra Nyiur
                            </span>
                          ) : "Member"}
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/akun"
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-charcoal-600 hover:text-forest-600 hover:bg-mist transition-colors"
                    >
                      <User className="w-4 h-4" /> Profil Saya
                    </Link>
                    <Link
                      href="/pesanan"
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-charcoal-600 hover:text-forest-600 hover:bg-mist transition-colors"
                    >
                      <Package className="w-4 h-4" /> Pesanan
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/daftar"
                      onClick={() => setIsMobileOpen(false)}
                      className="w-full btn-primary justify-center"
                    >
                      Daftar Sekarang
                    </Link>
                    <Link
                      href="/masuk"
                      onClick={() => setIsMobileOpen(false)}
                      className="w-full btn-secondary justify-center"
                    >
                      Masuk
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
