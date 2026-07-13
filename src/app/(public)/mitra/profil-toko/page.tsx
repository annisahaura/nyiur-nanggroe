"use client";

import { useState } from "react";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MitraSidebar } from "@/components/layout/MitraSidebar";
import { Upload, Store, MapPin, Clock, Share2, Shield, Plus, Trash2, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MitraStoreProfilePage() {
  const [storeData, setStoreData] = useState({
    name: "Karya Nyiur Aceh",
    description: "Produsen briket kelapa premium, arang kelapa, dan berbagai kerajinan ramah lingkungan berbahan dasar kelapa asal Banda Aceh.",
    story: "Toko kami berdiri sejak tahun 2024 dengan misi mengolah seluruh bagian dari buah kelapa menjadi produk bernilai tinggi untuk mengurangi limbah kelapa dan memajukan petani lokal Aceh.",
    location: "Jl. Teuku Umar No. 45, Kampung Baru, Banda Aceh",
    hours: "Setiap Hari (08:00 - 18:00 WIB)",
    whatsapp: "0811234567",
    instagram: "@karyanyiur.aceh",
    logo: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=150&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1520408222757-6f9f95d87d5d?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=500&auto=format&fit=crop"
    ],
    policy: "Pengembalian barang berlaku jika produk rusak dalam pengiriman dengan menyertakan video unboxing maksimal 2x24 jam setelah barang tiba."
  });

  const [isEditing, setIsEditing] = useState(false);
  const [newGalleryUrl, setNewGalleryUrl] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
  };

  const handleAddGallery = () => {
    if (newGalleryUrl.trim()) {
      setStoreData({
        ...storeData,
        gallery: [...storeData.gallery, newGalleryUrl.trim()]
      });
      setNewGalleryUrl("");
    }
  };

  const handleRemoveGallery = (index: number) => {
    setStoreData({
      ...storeData,
      gallery: storeData.gallery.filter((_, i) => i !== index)
    });
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-24 md:pt-28 pb-8">
        <div className="container-base">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <MitraSidebar activeId="profile" />
            </aside>

            <div className="lg:col-span-3 space-y-6">
              <div className="flex justify-between items-center pb-2">
                <div>
                  <h1 className="text-xl font-bold text-charcoal-800">Profil Toko</h1>
                  <p className="text-xs text-charcoal-500 mt-0.5">Kelola identitas publik, galeri produk, jam operasional, dan info legalitas toko.</p>
                </div>
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="btn-primary text-xs py-2 px-4">
                    Edit Profil Toko
                  </button>
                )}
              </div>

              {/* Banner & Logo Preview */}
              <div className="bg-white border border-border/60 rounded-3xl overflow-hidden shadow-sm relative">
                {/* Banner Image */}
                <div className="h-40 relative bg-mist">
                  {storeData.banner && (
                    <Image src={storeData.banner} alt="Banner Toko" fill className="object-cover" />
                  )}
                  {isEditing && (
                    <button className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-xl text-xs flex items-center gap-1.5 backdrop-blur-sm">
                      <Camera className="w-3.5 h-3.5" /> Ganti Banner
                    </button>
                  )}
                </div>

                {/* Profile Details header */}
                <div className="px-6 pb-6 pt-16 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  {/* Logo overlayed */}
                  <div className="absolute -top-12 left-6 w-24 h-24 rounded-2xl border-4 border-white bg-forest-100 flex items-center justify-center overflow-hidden shadow-md">
                    {storeData.logo ? (
                      <Image src={storeData.logo} alt="Logo Toko" width={96} height={96} className="object-cover" />
                    ) : (
                      <Store className="w-10 h-10 text-forest-700" />
                    )}
                    {isEditing && (
                      <button className="absolute inset-0 bg-black/50 text-white flex items-center justify-center">
                        <Upload className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-charcoal-800 flex items-center gap-1.5">
                      {storeData.name}
                      <span className="text-[10px] bg-forest-50 text-forest-700 px-2 py-0.5 rounded-full font-bold">Terverifikasi 🌿</span>
                    </h2>
                    <p className="text-xs text-charcoal-500 mt-1 max-w-xl leading-relaxed">{storeData.description}</p>
                  </div>
                </div>
              </div>

              {/* Form Info Detail */}
              <form onSubmit={handleSave} className="space-y-6">
                <div className="bg-white border border-border/60 rounded-3xl p-6 space-y-6 shadow-sm">
                  <h3 className="text-sm font-bold text-charcoal-800 border-b pb-3 flex items-center gap-2">
                    <Store className="w-4 h-4 text-forest-600" /> Informasi Umum Toko
                  </h3>

                  <div className="space-y-4">
                    {/* Story */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-charcoal-500 block">Kisah Toko (Story)</label>
                      <textarea
                        rows={3}
                        value={storeData.story}
                        disabled={!isEditing}
                        onChange={(e) => setStoreData({ ...storeData, story: e.target.value })}
                        className="input-base disabled:bg-mist/30"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Location */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-charcoal-500 block">Alamat Toko / Pengiriman</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={storeData.location}
                            disabled={!isEditing}
                            onChange={(e) => setStoreData({ ...storeData, location: e.target.value })}
                            className="input-base disabled:bg-mist/30 pl-9"
                          />
                          <MapPin className="absolute left-3 top-3 w-4 h-4 text-charcoal-450" />
                        </div>
                      </div>
                      {/* Hours */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-charcoal-500 block">Jam Operasional Toko</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={storeData.hours}
                            disabled={!isEditing}
                            onChange={(e) => setStoreData({ ...storeData, hours: e.target.value })}
                            className="input-base disabled:bg-mist/30 pl-9"
                          />
                          <Clock className="absolute left-3 top-3 w-4 h-4 text-charcoal-450" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* WhatsApp */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-charcoal-500 block">Nomor WhatsApp Bisnis</label>
                        <input
                          type="text"
                          value={storeData.whatsapp}
                          disabled={!isEditing}
                          onChange={(e) => setStoreData({ ...storeData, whatsapp: e.target.value })}
                          className="input-base disabled:bg-mist/30"
                        />
                      </div>
                      {/* Instagram */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-charcoal-500 block">Instagram Toko</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={storeData.instagram}
                            disabled={!isEditing}
                            onChange={(e) => setStoreData({ ...storeData, instagram: e.target.value })}
                            className="input-base disabled:bg-mist/30 pl-9"
                          />
                          <Share2 className="absolute left-3 top-3.5 w-4 h-4 text-charcoal-450" />
                        </div>
                      </div>
                    </div>

                    {/* Policies */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-charcoal-500 block">Kebijakan Pengembalian & Garansi</label>
                      <textarea
                        rows={3}
                        value={storeData.policy}
                        disabled={!isEditing}
                        onChange={(e) => setStoreData({ ...storeData, policy: e.target.value })}
                        className="input-base disabled:bg-mist/30"
                      />
                    </div>
                  </div>
                </div>

                {/* Gallery Card */}
                <div className="bg-white border border-border/60 rounded-3xl p-6 space-y-6 shadow-sm">
                  <h3 className="text-sm font-bold text-charcoal-800 border-b pb-3 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-forest-600" /> Galeri Foto Toko (Showcase)
                  </h3>

                  {isEditing && (
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="Tempel URL gambar baru..."
                        value={newGalleryUrl}
                        onChange={(e) => setNewGalleryUrl(e.target.value)}
                        className="input-base text-xs flex-1"
                      />
                      <button
                        type="button"
                        onClick={handleAddGallery}
                        className="btn-primary py-2 px-4 text-xs font-bold shrink-0 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Tambah
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {storeData.gallery.map((img, idx) => (
                      <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border bg-mist group">
                        <Image src={img} alt={`Gallery image ${idx}`} fill className="object-cover" />
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => handleRemoveGallery(idx)}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-lg shadow hover:bg-red-700 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-2.5">
                    <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary py-2.5 px-4 text-xs font-bold">
                      Batal
                    </button>
                    <button type="submit" className="btn-primary py-2.5 px-4 text-xs font-bold">
                      Simpan Perubahan
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
// Importing ImageIcon since it was used in code
import { Image as ImageIcon } from "lucide-react";
