"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function SyaratKetentuanPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-cream py-16 md:py-24">
        <div className="container-narrow prose prose-sm max-w-3xl mx-auto">
          <h1 className="text-3xl font-display font-bold text-charcoal-800 mb-2">
            Syarat & Ketentuan
          </h1>
          <p className="text-sm text-charcoal-400 mb-10">Terakhir diperbarui: Juli 2026</p>

          <div className="space-y-8 text-sm text-charcoal-600 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-charcoal-800 mb-2">1. Tentang Nyiur Nanggroe</h2>
              <p>
                Nyiur Nanggroe adalah marketplace yang mempertemukan petani, UMKM, dan
                pengrajin produk berbasis kelapa di Aceh dengan pembeli. Dengan mengakses
                atau menggunakan platform ini, kamu setuju untuk terikat dengan syarat dan
                ketentuan berikut.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-charcoal-800 mb-2">2. Akun Pengguna</h2>
              <p>
                Kamu bertanggung jawab menjaga kerahasiaan akun dan kata sandimu. Informasi
                yang kamu daftarkan harus akurat dan terkini. Nyiur Nanggroe berhak menangguhkan
                akun yang terindikasi melakukan penipuan atau pelanggaran ketentuan.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-charcoal-800 mb-2">3. Transaksi Jual-Beli</h2>
              <p>
                Nyiur Nanggroe menyediakan platform yang mempertemukan penjual dan pembeli.
                Kualitas, deskripsi, dan pengiriman produk menjadi tanggung jawab masing-masing
                Mitra penjual. Pembayaran diproses melalui mitra penyedia jasa pembayaran yang
                bekerja sama dengan kami.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-charcoal-800 mb-2">4. Kewajiban Mitra Penjual</h2>
              <p>
                Mitra penjual wajib memberikan informasi produk yang akurat, memproses pesanan
                tepat waktu, dan mematuhi peraturan perundang-undangan yang berlaku terkait
                produk yang dijual.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-charcoal-800 mb-2">5. Pembatasan Tanggung Jawab</h2>
              <p>
                Nyiur Nanggroe berupaya menjaga kualitas layanan, namun tidak dapat menjamin
                platform akan selalu bebas dari gangguan atau kesalahan teknis. Kami tidak
                bertanggung jawab atas kerugian tidak langsung akibat penggunaan platform.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-charcoal-800 mb-2">6. Perubahan Ketentuan</h2>
              <p>
                Kami dapat memperbarui syarat dan ketentuan ini dari waktu ke waktu. Perubahan
                akan diinformasikan melalui halaman ini.
              </p>
            </section>

            <p className="text-xs text-charcoal-400 pt-4 border-t border-border/60">
              Ada pertanyaan soal syarat & ketentuan ini? Hubungi kami di halaman{" "}
              <a href="/kontak" className="text-forest-600 font-semibold">Kontak</a>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
