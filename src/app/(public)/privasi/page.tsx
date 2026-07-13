"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function PrivasiPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-cream py-16 md:py-24">
        <div className="container-narrow max-w-3xl mx-auto">
          <h1 className="text-3xl font-display font-bold text-charcoal-800 mb-2">
            Kebijakan Privasi
          </h1>
          <p className="text-sm text-charcoal-400 mb-10">Terakhir diperbarui: Juli 2026</p>

          <div className="space-y-8 text-sm text-charcoal-600 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-charcoal-800 mb-2">1. Data yang Kami Kumpulkan</h2>
              <p>
                Kami mengumpulkan informasi yang kamu berikan langsung, seperti nama, email,
                nomor telepon, dan alamat pengiriman saat mendaftar atau bertransaksi. Kami juga
                mengumpulkan data penggunaan platform untuk meningkatkan layanan.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-charcoal-800 mb-2">2. Penggunaan Data</h2>
              <p>
                Data yang kamu berikan digunakan untuk memproses transaksi, mengirim
                notifikasi terkait pesanan, meningkatkan rekomendasi produk, dan memberikan
                dukungan pelanggan.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-charcoal-800 mb-2">3. Berbagi Data</h2>
              <p>
                Kami membagikan data seperlunya kepada Mitra penjual (untuk memproses
                pesananmu) dan mitra logistik/pembayaran. Kami tidak menjual data pribadimu
                kepada pihak ketiga untuk kepentingan iklan.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-charcoal-800 mb-2">4. Cookie</h2>
              <p>
                Kami menggunakan cookie untuk menjaga sesi login kamu tetap aktif dan
                mengingat preferensi tampilan. Kamu bisa menonaktifkan cookie lewat pengaturan
                browser, namun beberapa fitur mungkin tidak berjalan optimal.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-charcoal-800 mb-2">5. Keamanan Data</h2>
              <p>
                Kami menerapkan langkah-langkah keamanan wajar untuk melindungi data pribadimu
                dari akses yang tidak sah. Namun, tidak ada sistem yang benar-benar 100% aman.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-charcoal-800 mb-2">6. Hak Kamu</h2>
              <p>
                Kamu berhak mengakses, memperbarui, atau meminta penghapusan data pribadimu
                kapan saja lewat halaman Akun, atau dengan menghubungi tim kami.
              </p>
            </section>

            <p className="text-xs text-charcoal-400 pt-4 border-t border-border/60">
              Ada pertanyaan soal privasi datamu? Hubungi kami di halaman{" "}
              <a href="/kontak" className="text-forest-600 font-semibold">Kontak</a>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
