"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, Instagram } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function KontakPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-cream py-16 md:py-24">
        <div className="container-narrow max-w-3xl mx-auto">
          <h1 className="text-3xl font-display font-bold text-charcoal-800 mb-2">
            Hubungi Kami
          </h1>
          <p className="text-charcoal-500 mb-10">
            Ada pertanyaan soal produk, pesanan, atau ingin jadi Mitra? Tim kami siap membantu.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact info */}
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-forest-50 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4.5 h-4.5 text-forest-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-charcoal-800">Email</p>
                  <p className="text-sm text-charcoal-500">halo@nyiurnanggroe.id</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-forest-50 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4.5 h-4.5 text-forest-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-charcoal-800">WhatsApp</p>
                  <p className="text-sm text-charcoal-500">+62 811-XXXX-XXXX</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-forest-50 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4.5 h-4.5 text-forest-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-charcoal-800">Alamat</p>
                  <p className="text-sm text-charcoal-500">Banda Aceh, Aceh, Indonesia</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-forest-50 flex items-center justify-center flex-shrink-0">
                  <Instagram className="w-4.5 h-4.5 text-forest-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-charcoal-800">Instagram</p>
                  <p className="text-sm text-charcoal-500">@nyiurnanggroe</p>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="bg-white rounded-2xl border border-border/60 p-6">
              {sent ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-forest-50 flex items-center justify-center">
                    <Send className="w-6 h-6 text-forest-600" />
                  </div>
                  <h2 className="font-bold text-charcoal-800 mb-1">Pesan Terkirim!</h2>
                  <p className="text-sm text-charcoal-500">
                    Terima kasih, tim kami akan segera menghubungimu kembali.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-charcoal-500 block mb-1">Nama</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input-base"
                      placeholder="Nama lengkap kamu"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-charcoal-500 block mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input-base"
                      placeholder="email@kamu.com"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-charcoal-500 block mb-1">Pesan</label>
                    <textarea
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="input-base min-h-[120px] py-2.5"
                      placeholder="Tulis pertanyaan atau pesanmu di sini..."
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full justify-center">
                    <Send className="w-4 h-4" />
                    Kirim Pesan
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
