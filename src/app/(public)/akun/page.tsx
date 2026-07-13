"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User, Package, Heart, Bell, Settings, LogOut, ShieldCheck,
  ChevronRight, MapPin, Phone, Mail, Store, AlertCircle, ExternalLink,
  BookOpen, Leaf, Plus, Trash2, Camera
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ui/ProductCard";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { useAuthStore, useCurrentUser } from "@/lib/stores/auth-store";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

// Saved address mock data
const INITIAL_ADDRESSES = [
  { id: "addr-1", label: "Rumah Utama", recipient: "Siti Aisyah", phone: "0811234567", details: "Jl. Teuku Umar No. 45, Kampung Baru", city: "Banda Aceh", province: "Aceh", postalCode: "23242", isDefault: true },
  { id: "addr-2", label: "Kantor", recipient: "Siti Aisyah", phone: "0811234567", details: "Gedung IT Center Lantai 2, Jl. Syiah Kuala", city: "Banda Aceh", province: "Aceh", postalCode: "23111", isDefault: false }
];

export default function UserProfilePage() {
  const user = useCurrentUser();
  const logout = useAuthStore((s) => s.logout);
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "wishlist" | "learning" | "impact" | "notifications" | "settings">("profile");
  const wishlist = useWishlistStore((s) => s.items);

  // Profile forms
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Address State
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "", recipient: "", phone: "", details: "", city: "", province: "Aceh", postalCode: ""
  });

  // Sync state with store on mount/change
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setLocation(`${user.city || ""}, ${user.province || ""}`.replace(/^,\s*/, ""));
      setBio(user.bio || "");
    }
  }, [user]);

  // Fetch orders when tab changes
  useEffect(() => {
    if (activeTab === "orders" && user) {
      const fetchOrders = async () => {
        setOrdersLoading(true);
        try {
          const res = await fetch("/api/orders");
          const json = await res.json();
          if (json.success) {
            setOrders(json.data);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setOrdersLoading(false);
        }
      };
      fetchOrders();
    }
  }, [activeTab, user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const parts = location.split(",");
      const city = parts[0]?.trim() || "";
      const province = parts[1]?.trim() || "";
      updateProfile({
        full_name: fullName,
        email,
        phone,
        city,
        province,
        bio
      });
      setIsEditing(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/masuk";
  };

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `addr-${Date.now()}`;
    setAddresses([...addresses, { id, ...newAddress, isDefault: addresses.length === 0 }]);
    setShowAddAddress(false);
    setNewAddress({ label: "", recipient: "", phone: "", details: "", city: "", province: "Aceh", postalCode: "" });
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  if (!user) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-cream flex items-center justify-center py-20 text-center">
          <div className="bg-white border p-8 rounded-3xl max-w-sm space-y-4 shadow-xl">
            <AlertCircle className="w-12 h-12 text-forest-600 mx-auto" />
            <h2 className="text-xl font-bold text-charcoal-800">Sesi Berakhir</h2>
            <p className="text-sm text-charcoal-500">Silakan masuk kembali untuk mengakses informasi profil Anda.</p>
            <Link href="/masuk" className="btn-primary w-full justify-center">Masuk Akun</Link>
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Menu */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl border border-border/60 p-5 text-center relative overflow-hidden">
                {/* Visual Glow */}
                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-forest-500 to-amber-500" />
                
                {/* Avatar Mock with Edit option */}
                <div className="relative w-20 h-20 mx-auto mb-3 group">
                  <div className="w-full h-full rounded-2xl bg-forest-100 flex items-center justify-center font-bold text-forest-700 text-3xl shadow-sm overflow-hidden">
                    {user.avatar_url ? (
                      <Image src={user.avatar_url} alt={user.full_name} width={80} height={80} className="object-cover" />
                    ) : (
                      user.full_name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white border border-border p-1.5 rounded-lg text-charcoal hover:bg-mist shadow-sm">
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h2 className="font-bold text-charcoal-800 text-base">{user.full_name}</h2>
                <p className="text-xs text-charcoal-400 capitalize mt-0.5">
                  {user.role === "seller" ? "Mitra Nyiur 🌿" : user.role === "admin" ? "Administrator 🛡️" : "Anggota Kelapa"}
                </p>

                {user.role === "user" && (
                  <Link
                    href="/daftar-mitra"
                    className="mt-4 flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-700 text-xs font-semibold border border-forest-200 transition-colors"
                  >
                    <Store className="w-3.5 h-3.5" /> Aktifkan Mode Penjual
                  </Link>
                )}

                {user.role === "seller" && (
                  <Link
                    href="/mitra"
                    className="mt-4 flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-xs font-semibold transition-colors"
                  >
                    <Store className="w-3.5 h-3.5" /> Masuk Panel Mitra
                  </Link>
                )}
              </div>

              {/* Tab Navigation */}
              <div className="bg-white rounded-2xl border border-border/60 p-3 space-y-1">
                {[
                  { id: "profile", label: "Informasi Pribadi", icon: User },
                  { id: "orders", label: "Pesanan Saya", icon: Package },
                  { id: "wishlist", label: "Wishlist", icon: Heart },
                  { id: "learning", label: "Kemajuan Belajar", icon: BookOpen },
                  { id: "impact", label: "Kontribusi Lingkungan", icon: Leaf },
                  { id: "notifications", label: "Notifikasi", icon: Bell },
                  { id: "settings", label: "Pengaturan", icon: Settings },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                        activeTab === tab.id
                          ? "bg-forest-600 text-white font-semibold shadow-sm"
                          : "text-charcoal-600 hover:bg-mist"
                      )}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {tab.label}
                    </button>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors mt-2 pt-2 border-t border-border/40"
                >
                  <LogOut className="w-4 h-4 flex-shrink-0" />
                  Keluar Akun
                </button>
              </div>
            </div>

            {/* Tab Contents */}
            <div className="lg:col-span-3">
              {/* Profile Info */}
              {activeTab === "profile" && (
                <div className="space-y-8">
                  <div className="bg-white rounded-2xl border border-border/60 p-6 space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-border/40">
                      <h2 className="text-lg font-bold text-charcoal-800 flex items-center gap-2">
                        <User className="w-5 h-5 text-forest-600" /> Profil Pribadi
                      </h2>
                      {!isEditing && (
                        <button onClick={() => setIsEditing(true)} className="text-xs text-forest-600 hover:text-forest-500 font-semibold">
                          Edit Profil
                        </button>
                      )}
                    </div>

                    <form onSubmit={handleSave} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-charcoal-500 block mb-1">Nama Lengkap</label>
                          <input
                            type="text"
                            value={fullName}
                            disabled={!isEditing}
                            onChange={(e) => setFullName(e.target.value)}
                            className="input-base disabled:bg-mist/30"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-charcoal-500 block mb-1">Email</label>
                          <input
                            type="email"
                            value={email}
                            disabled={!isEditing}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-base disabled:bg-mist/30"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-charcoal-500 block mb-1">Nomor Telepon</label>
                          <input
                            type="text"
                            value={phone}
                            disabled={!isEditing}
                            onChange={(e) => setPhone(e.target.value)}
                            className="input-base disabled:bg-mist/30"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-charcoal-500 block mb-1">Lokasi (Kota, Provinsi)</label>
                          <input
                            type="text"
                            value={location}
                            disabled={!isEditing}
                            onChange={(e) => setLocation(e.target.value)}
                            className="input-base disabled:bg-mist/30"
                            placeholder="Contoh: Banda Aceh, Aceh"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-charcoal-500 block">Bio singkat</label>
                        <textarea
                          rows={3}
                          value={bio}
                          disabled={!isEditing}
                          onChange={(e) => setBio(e.target.value)}
                          className="input-base disabled:bg-mist/30"
                          placeholder="Ceritakan tentang ketertarikan Anda pada kelapa..."
                        />
                      </div>

                      {isEditing && (
                        <div className="flex gap-2 justify-end pt-2">
                          <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary py-2 text-xs">
                            Batal
                          </button>
                          <button type="submit" className="btn-primary py-2 text-xs">
                            Simpan Perubahan
                          </button>
                        </div>
                      )}
                    </form>
                  </div>

                  {/* Saved Addresses list */}
                  <div className="bg-white rounded-2xl border border-border/60 p-6 space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-border/40">
                      <h2 className="text-base font-bold text-charcoal-800 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-forest-600" /> Daftar Alamat Pengiriman
                      </h2>
                      <button
                        onClick={() => setShowAddAddress(true)}
                        className="text-xs text-forest-600 hover:text-forest-500 font-semibold flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Tambah Alamat
                      </button>
                    </div>

                    {showAddAddress && (
                      <form onSubmit={handleAddAddressSubmit} className="bg-mist/30 border p-4 rounded-xl space-y-3.5">
                        <h3 className="text-sm font-bold text-charcoal-700">Alamat Baru</h3>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Label Alamat (ex: Kantor, Rumah)"
                            value={newAddress.label}
                            onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
                            required
                            className="input-base text-xs py-2"
                          />
                          <input
                            type="text"
                            placeholder="Nama Penerima"
                            value={newAddress.recipient}
                            onChange={(e) => setNewAddress({...newAddress, recipient: e.target.value})}
                            required
                            className="input-base text-xs py-2"
                          />
                          <input
                            type="text"
                            placeholder="Telepon Penerima"
                            value={newAddress.phone}
                            onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                            required
                            className="input-base text-xs py-2"
                          />
                          <input
                            type="text"
                            placeholder="Kode Pos"
                            value={newAddress.postalCode}
                            onChange={(e) => setNewAddress({...newAddress, postalCode: e.target.value})}
                            required
                            className="input-base text-xs py-2"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Alamat Detail (Jalan, No. Rumah, RT/RW)"
                          value={newAddress.details}
                          onChange={(e) => setNewAddress({...newAddress, details: e.target.value})}
                          required
                          className="input-base text-xs py-2 w-full"
                        />
                        <div className="flex gap-2 justify-end pt-1">
                          <button type="button" onClick={() => setShowAddAddress(false)} className="btn-secondary py-1.5 px-3 text-xs">Batal</button>
                          <button type="submit" className="btn-primary py-1.5 px-3 text-xs">Simpan Alamat</button>
                        </div>
                      </form>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((addr) => (
                        <div key={addr.id} className="border border-border/80 p-4 rounded-2xl relative bg-mist/10 hover:border-forest-500/30 transition-all">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs font-bold text-charcoal-800">{addr.label}</span>
                            {addr.isDefault && (
                              <span className="text-[10px] bg-forest-50 text-forest-700 px-2 py-0.5 rounded-full font-bold">Utama</span>
                            )}
                          </div>
                          <p className="text-xs text-charcoal-700 font-medium">{addr.recipient}</p>
                          <p className="text-xs text-charcoal-500 mt-1">{addr.details}, {addr.city}, {addr.province} - {addr.postalCode}</p>
                          <p className="text-xs text-charcoal-400 mt-1.5 flex items-center gap-1"><Phone className="w-3 h-3" /> {addr.phone}</p>
                          
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="absolute top-4 right-4 text-charcoal-300 hover:text-red-500 transition-colors p-1"
                            title="Hapus alamat"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* My Orders */}
              {activeTab === "orders" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-charcoal-800 mb-2">Riwayat Pesanan</h2>
                  {ordersLoading ? (
                    <div className="bg-white rounded-2xl border border-border/60 p-8 text-center text-charcoal-500 text-sm animate-pulse">
                      Memuat pesanan...
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-border/60 p-8 text-center text-charcoal-500 text-sm">
                      Anda belum memiliki riwayat pesanan.
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div key={order.id} className="bg-white rounded-2xl border border-border/60 p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-border/40 pb-3 flex-wrap gap-2 text-xs sm:text-sm">
                          <div>
                            <p className="font-semibold text-charcoal-800">No. Pesanan: {order.order_number}</p>
                            <p className="text-xs text-charcoal-400 mt-0.5">Dipesan pada {new Date(order.created_at).toLocaleDateString("id-ID")}</p>
                          </div>
                          <span className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-semibold border",
                            order.status === "completed" ? "bg-moss-50 text-moss-700 border-moss-200" :
                            order.status === "shipped" ? "bg-amber-50 text-amber-700 border-amber-200" :
                            order.status === "cancelled" ? "bg-red-50 text-red-700 border-red-200" :
                            "bg-blue-50 text-blue-700 border-blue-200"
                          )}>
                            {order.status === "completed" ? "Selesai" :
                             order.status === "shipped" ? "Dikirim" :
                             order.status === "cancelled" ? "Dibatalkan" : "Menunggu"}
                          </span>
                        </div>
  
                        <div className="space-y-3">
                          {order.order_items?.map((item: any) => (
                            <div key={item.id} className="flex justify-between items-center text-xs sm:text-sm">
                              <div className="min-w-0 flex-1 pr-4">
                                <p className="font-medium text-charcoal-800 truncate">{item.products?.name}</p>
                                <p className="text-xs text-charcoal-400">{item.quantity} x {formatPrice(item.price)}</p>
                              </div>
                              <span className="font-semibold text-charcoal-700">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
  
                        <div className="border-t border-border/40 pt-3 flex items-center justify-between flex-wrap gap-2 text-xs sm:text-sm">
                          <div className="text-charcoal-500">
                            {order.status === "shipped" && <span>Resi Pengiriman belum diupdate.</span>}
                          </div>
                          <div>
                            <span className="text-charcoal-500 mr-2">Total Pembayaran:</span>
                            <span className="font-bold text-forest-700">{formatPrice(order.total)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Wishlist */}
              {activeTab === "wishlist" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-charcoal-800 mb-2">Daftar Keinginan</h2>
                  {wishlist.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-border/60 p-8 text-center text-charcoal-500 text-sm">
                      Belum ada produk yang disimpan di wishlist Anda.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {wishlist.map((p) => (
                        <ProductCard key={p.id} product={p} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Learning Progress Tab */}
              {activeTab === "learning" && (
                <div className="bg-white rounded-2xl border border-border/60 p-6 space-y-6">
                  <h2 className="text-lg font-bold text-charcoal-800 border-b border-border/40 pb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-forest-600" /> Kemajuan Belajar
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-border/60 p-4 rounded-xl text-center">
                      <p className="text-2xl font-bold text-forest-600">{user.articles_read || 0}</p>
                      <p className="text-xs font-semibold text-charcoal-600 mt-1">Artikel Dibaca</p>
                    </div>
                    <div className="border border-border/60 p-4 rounded-xl text-center">
                      <p className="text-2xl font-bold text-amber-600">{user.quizzes_passed || 0}</p>
                      <p className="text-xs font-semibold text-charcoal-600 mt-1">Kuis Diselesaikan</p>
                    </div>
                    <div className="border border-border/60 p-4 rounded-xl text-center">
                      <p className="text-2xl font-bold text-blue-600">{(user.quizzes_passed || 0) * 100}</p>
                      <p className="text-xs font-semibold text-charcoal-600 mt-1">Learning Points</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-bold text-charcoal-700">Rekomendasi Pembelajaran</h3>
                    <div className="border border-border/60 p-4 rounded-xl flex items-center justify-between hover:border-forest-500 transition-colors">
                      <div className="space-y-1">
                        <p className="text-xs text-forest-600 font-bold uppercase tracking-wider">Business Guide</p>
                        <p className="text-sm font-bold text-charcoal-800">Panduan Lengkap Ekspor Briket Arang Kelapa</p>
                        <p className="text-xs text-charcoal-500">Mempelajari regulasi ekspor dan standardisasi kualitas.</p>
                      </div>
                      <Link href="/edukasi" className="btn-secondary py-1.5 text-xs">Mulai</Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Environmental Contribution Tab */}
              {activeTab === "impact" && (
                <div className="bg-white rounded-2xl border border-border/60 p-6 space-y-6">
                  <h2 className="text-lg font-bold text-charcoal-800 border-b border-border/40 pb-3 flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-forest-600" /> Kontribusi Lingkungan
                  </h2>

                  <div className="bg-forest-50/50 border border-forest-100 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-forest-100 flex items-center justify-center text-forest-600 shrink-0">
                      <Leaf className="w-10 h-10" />
                    </div>
                    <div className="text-center md:text-left space-y-2">
                      <h3 className="text-base font-bold text-charcoal-800">Jejak Hijau Anda</h3>
                      <p className="text-xs text-charcoal-500 leading-relaxed">
                        Setiap transaksi produk daur ulang atau olahan kelapa di Nyiur Nanggroe berkontribusi pada pengurangan emisi karbon dan penyerapan limbah kelapa organik.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-border/60 p-4 rounded-xl flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center font-bold text-forest-700 text-lg">
                        🍃
                      </div>
                      <div>
                        <p className="text-lg font-bold text-charcoal-800">{user.co2_saved_kg || 0} kg</p>
                        <p className="text-xs text-charcoal-400">Total CO2 Terhindar</p>
                      </div>
                    </div>
                    <div className="border border-border/60 p-4 rounded-xl flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center font-bold text-amber-700 text-lg">
                        🥥
                      </div>
                      <div>
                        <p className="text-lg font-bold text-charcoal-800">{((user.co2_saved_kg || 0) * 1.25).toFixed(1)} kg</p>
                        <p className="text-xs text-charcoal-400">Limbah Kelapa Didaur Ulang</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeTab === "notifications" && (
                <div className="bg-white rounded-2xl border border-border/60 p-6 space-y-4">
                  <h2 className="text-lg font-bold text-charcoal-800 border-b border-border/40 pb-3 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-forest-600" /> Notifikasi
                  </h2>
                  <div className="divide-y divide-border/40">
                    {[
                      { title: "Pesanan Dikirim 🚚", desc: "Pesanan #NN-892714 sedang menuju alamat tujuan via J&T Express.", date: "1 hari yang lalu" },
                      { title: "Kuis Mingguan Baru 🧠", desc: "Uji wawasan Anda mengenai kelapa circular dan dapatkan 100 Learning Points!", date: "3 hari yang lalu" },
                      { title: "Voucher Spesial Hijau 🎉", desc: "Gunakan voucher HIJAU20 untuk mendapatkan potongan belanja sebesar 20%.", date: "5 hari yang lalu" },
                    ].map((n, idx) => (
                      <div key={idx} className="py-3.5 first:pt-0 last:pb-0 space-y-0.5">
                        <p className="text-sm font-semibold text-charcoal-800">{n.title}</p>
                        <p className="text-xs text-charcoal-500">{n.desc}</p>
                        <p className="text-[10px] text-charcoal-400 pt-1">{n.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Settings */}
              {activeTab === "settings" && (
                <div className="bg-white rounded-2xl border border-border/60 p-6 space-y-6">
                  <h2 className="text-lg font-bold text-charcoal-800 border-b border-border/40 pb-3 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-forest-600" /> Pengaturan Akun
                  </h2>
                  <div className="space-y-4 text-sm text-charcoal-700">
                    <div className="flex justify-between items-center py-2 border-b border-border/40">
                      <div>
                        <p className="font-semibold">Notifikasi Email</p>
                        <p className="text-xs text-charcoal-400">Dapatkan update pengiriman pesanan lewat email.</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 accent-forest-600" />
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/40">
                      <div>
                        <p className="font-semibold">Notifikasi Promo & Edukasi</p>
                        <p className="text-xs text-charcoal-400">Dapatkan info seputar voucher belanja terbaru.</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 accent-forest-600" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
