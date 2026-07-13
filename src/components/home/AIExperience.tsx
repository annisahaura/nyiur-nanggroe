"use client";

import { motion } from "framer-motion";
import { Camera, Bot, ArrowRight, Upload, Search, ShoppingBag } from "lucide-react";
import Link from "next/link";

export function AIExperience() {
  return (
    <section className="section-padding bg-[#F0F7F3] relative overflow-hidden" id="ai-experience">
      {/* Subtle brand dots pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #6B7C3D 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container-base relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-100 border border-forest-200 text-forest-700 text-xs font-semibold uppercase mb-4">
              <Bot className="w-3.5 h-3.5 text-forest-600" />
              Ekosistem Cerdas
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-forest-700 mb-4">
              Rasakan Kekuatan AI Kelapa
            </h2>
            <p className="text-charcoal-500 text-base md:text-lg leading-relaxed">
              Nyiur Nanggroe didukung kecerdasan buatan cerdas untuk mempermudah Anda menemukan produk sirkular dan mengelola transaksi dengan efisien.
            </p>
          </motion.div>
        </div>

        {/* Visual Search Section */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
          {/* Visual Search Text */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <h3 className="text-2xl font-display font-bold text-forest-700 mb-4">
              AI Visual Search
            </h3>
            <p className="text-charcoal-500 mb-8 leading-relaxed">
              Menemukan produk kelapa khas daerah tapi bingung namanya? Cukup unggah foto, dan AI kami akan langsung mencocokkannya dengan produk serupa di marketplace kami.
            </p>

            {/* Timeline Steps */}
            <div className="relative border-l border-forest-200 ml-4 space-y-8 pb-4">
              <div className="relative pl-8">
                <div className="absolute -left-[13px] top-1 w-6 h-6 rounded-full bg-white border-2 border-forest-600 flex items-center justify-center">
                  <Upload className="w-3 h-3 text-forest-600" />
                </div>
                <h4 className="text-forest-700 font-bold text-sm mb-1">Upload</h4>
                <p className="text-xs text-charcoal-400">Unggah foto produk kelapa apa saja dari perangkat Anda.</p>
              </div>
              
              <div className="relative pl-8">
                <div className="absolute -left-[13px] top-1 w-6 h-6 rounded-full bg-white border-2 border-[#C68642] flex items-center justify-center">
                  <Search className="w-3 h-3 text-[#C68642]" />
                </div>
                <h4 className="text-forest-700 font-bold text-sm mb-1">Deteksi Otomatis</h4>
                <p className="text-xs text-charcoal-400">Sistem AI mengenali bentuk, jenis bahan, dan kategori produk.</p>
              </div>

              <div className="relative pl-8">
                <div className="absolute -left-[13px] top-1 w-6 h-6 rounded-full bg-forest-600 border-2 border-forest-500 flex items-center justify-center shadow-md">
                  <ShoppingBag className="w-3 h-3 text-white" />
                </div>
                <h4 className="text-forest-700 font-bold text-sm mb-1">Hasil Marketplace</h4>
                <p className="text-xs text-charcoal-400">Temukan produk sejenis dari penjual UMKM terverifikasi di Aceh.</p>
              </div>
            </div>

            <Link href="/produk?visual=1" className="inline-flex items-center gap-1.5 mt-8 text-[#C68642] hover:text-[#A86E32] font-semibold text-sm transition-colors">
              Coba Visual Search <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Visual Search Box Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2 bg-white border border-forest-100 rounded-3xl p-8 shadow-sm relative overflow-hidden"
          >
            <div className="relative bg-[#FAF7F0] border border-forest-100/60 rounded-2xl p-6 shadow-sm">
              <div className="border-2 border-dashed border-forest-200 rounded-xl p-8 flex flex-col items-center justify-center text-center mb-6 bg-white">
                <Camera className="w-10 h-10 text-forest-400 mb-4" />
                <p className="text-charcoal-500 text-xs">Seret dan lepas foto di sini</p>
                <div className="mt-4 px-4 py-2 bg-forest-600 hover:bg-forest-500 rounded-lg text-xs font-semibold text-white cursor-pointer transition-colors">Pilih Berkas</div>
              </div>
              <div className="space-y-3">
                <div className="h-1.5 bg-forest-100 rounded w-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-forest-500 to-[#C68642]"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                <p className="text-[10px] text-center text-charcoal-400 font-medium">Memindai gambar dengan AI...</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Nyai Nyiur Section */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Chat Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white border border-forest-100 rounded-3xl p-8 shadow-sm relative overflow-hidden"
          >
            <div className="relative flex flex-col gap-4">
              <div className="bg-[#FAF7F0] p-4 rounded-xl border border-forest-100/60 ml-8 shadow-sm">
                <p className="text-xs text-charcoal-600 leading-relaxed">Bagaimana cara memulai jualan produk olahan kelapa di sini?</p>
              </div>
              <div className="flex items-start gap-3 mr-8">
                <div className="w-8 h-8 rounded-full bg-forest-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-forest-50 border border-forest-100 text-charcoal-700 p-4 rounded-xl rounded-tl-sm shadow-sm">
                  <p className="text-xs leading-relaxed">Sangat mudah! Anda hanya perlu mendaftar sebagai <strong>Mitra Nyiur</strong>. Saya dapat membimbing Anda langkah demi langkah.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Nyai Nyiur Description */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-display font-bold text-forest-700 mb-4">
              Kenalan dengan Nyai Nyiur
            </h3>
            <p className="text-charcoal-500 mb-6 leading-relaxed">
              Nyai Nyiur adalah asisten cerdas berbasis AI yang siap melayani Anda 24/7 di seluruh halaman platform. Membantu Anda menemukan produk sirkular, menghitung kontribusi hemat CO₂, hingga memberi masukan bisnis bagi penjual.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-charcoal-600 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C68642]" /> Layanan bantuan 24/7 di setiap halaman utama
              </li>
              <li className="flex items-center gap-3 text-charcoal-600 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-forest-500" /> Informasi kalkulasi metrik kelestarian dan sirkularitas
              </li>
              <li className="flex items-center gap-3 text-charcoal-600 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C68642]" /> Panduan lengkap seputar komoditas kelapa Aceh
              </li>
            </ul>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
