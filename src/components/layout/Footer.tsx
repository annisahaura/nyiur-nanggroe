"use client";

import Link from "next/link";
import { Leaf, Instagram, Twitter, Facebook, Youtube, Mail, ArrowRight, Heart } from "lucide-react";

const FOOTER_LINKS = {
  platform: {
    label: "Platform",
    links: [
      { label: "Semua Produk", href: "/produk" },
      { label: "Arang & Briket", href: "/produk?kategori=arang" },
      { label: "Sabut & Cocopeat", href: "/produk?kategori=sabut" },
      { label: "Kerajinan Tangan", href: "/produk?kategori=kerajinan" },
      { label: "Minyak Kelapa", href: "/produk?kategori=minyak" },
    ],
  },
  mitra: {
    label: "Mitra Nyiur",
    links: [
      { label: "Mulai Berjualan", href: "/daftar-mitra" },
      { label: "Pusat Edukasi", href: "/edukasi" },
      { label: "Dampak Kami", href: "/dampak" },
    ],
  },
  legal: {
    label: "Info",
    links: [
      { label: "Syarat & Ketentuan", href: "/syarat-ketentuan" },
      { label: "Kebijakan Privasi", href: "/privasi" },
      { label: "Hubungi Kami", href: "/kontak" },
    ],
  },
};

const SOCIAL_LINKS = [
  { label: "Instagram", icon: Instagram, href: "https://instagram.com/nyiurnanggroe" },
  { label: "Twitter", icon: Twitter, href: "https://twitter.com/nyiurnanggroe" },
  { label: "Facebook", icon: Facebook, href: "https://facebook.com/nyiurnanggroe" },
  { label: "YouTube", icon: Youtube, href: "https://youtube.com/@nyiurnanggroe" },
];

export function Footer() {
  return (
    <footer className="bg-charcoal-900 text-white relative pt-20" aria-label="Nyiur Nanggroe Footer">
      <div className="container-base">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-5 pr-0 lg:pr-12">
            <Link href="/" className="flex items-center gap-2.5 mb-6 group">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-forest-900/50 group-hover:scale-105 transition-transform flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/Logo-NyiurNanggroe.png"
                  alt="Logo Nyiur Nanggroe"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="font-display font-bold text-white text-xl tracking-tight">
                  Nyiur Nanggroe
                </div>
                <div className="text-xs text-charcoal-400">
                  Ekonomi Sirkular Berbasis AI
                </div>
              </div>
            </Link>

            <p className="text-charcoal-300 text-sm leading-relaxed mb-8 max-w-sm">
              Memberdayakan petani lokal dan UMKM dengan mengubah sampah kelapa menjadi produk berkelanjutan kelas dunia.
            </p>

            <div className="bg-charcoal-800/50 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <h3 className="text-white font-display font-semibold text-lg mb-2 relative z-10">
                Gabung Newsletter Kami
              </h3>
              <p className="text-charcoal-400 text-sm mb-4 relative z-10">
                Dapatkan info terbaru soal produk berkelanjutan, wawasan pasar, dan fitur baru.
              </p>
              <form
                className="flex gap-2 relative z-10"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="Masukkan email kamu"
                  className="flex-1 px-4 py-3 rounded-xl bg-charcoal-900/80 border border-white/10 text-white placeholder:text-charcoal-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="submit"
                  className="w-12 h-12 flex items-center justify-center rounded-xl bg-amber-500 hover:bg-amber-400 text-charcoal-900 transition-colors flex-shrink-0"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            {Object.entries(FOOTER_LINKS).map(([key, section]) => (
              <div key={key}>
                <h3 className="text-white font-display font-semibold text-lg mb-6">
                  {section.label}
                </h3>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-charcoal-400 hover:text-amber-400 text-sm transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-charcoal-500 text-sm">
            © {new Date().getFullYear()} Nyiur Nanggroe. Hak cipta dilindungi.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-charcoal-800 flex items-center justify-center text-charcoal-400 hover:text-white hover:bg-forest-600 transition-all duration-300"
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          <p className="text-charcoal-500 text-sm flex items-center gap-1.5">
            Dibuat dengan <Heart className="w-4 h-4 text-red-500" fill="currentColor" /> di Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
