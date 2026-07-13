"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Ahmad Rizki",
    role: "Petani Kelapa",
    content: "Sejak bergabung dengan Nyiur Nanggroe, pendapatan saya naik 40%. Platform ini menghubungkan saya langsung dengan pembeli dari Eropa yang peduli praktik berkelanjutan.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150&auto=format&fit=crop"
  },
  {
    name: "Sarah Wijaya",
    role: "Pemilik Butik",
    content: "Kerajinan tempurung kelapa yang saya temukan di sini luar biasa! Kualitasnya premium, dan saya senang tahu belanja saya mendukung pengrajin lokal.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
  },
  {
    name: "Budi Santoso",
    role: "Manajer Restoran",
    content: "Kami beralih ke briket kelapa dari Nyiur Nanggroe untuk BBQ. Asapnya lebih sedikit, tahan bakar lebih lama, dan jauh lebih ramah lingkungan. Sangat direkomendasikan!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
  },
  {
    name: "Linda Chen",
    role: "Pembeli Peduli Lingkungan",
    content: "Fitur AI Visual Search-nya luar biasa. Saya unggah foto keset sabut yang saya lihat online, dan langsung ketemu alternatif buatan lokal yang lebih bagus di sini.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop"
  },
  {
    name: "Hasanuddin",
    role: "Pemilik UMKM",
    content: "Wawasan dari Seller AI membantu saya mengoptimalkan produksi cocopeat. Sekarang saya tahu persis kapan harus menambah stok dan grade mana yang paling dicari.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop"
  }
];

export function Testimonial() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="section-padding bg-[#F7F5F0] relative overflow-hidden" id="testimonials">
      <div className="container-base relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold tracking-wide uppercase mb-5">
            Cerita Komunitas
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-charcoal mb-4 leading-tight">
            Dipercaya oleh <span className="text-gradient-amber">Pembeli &amp; Penjual</span>
          </h2>
          <p className="text-charcoal-400 text-lg leading-relaxed">
            Dengarkan cerita dari komunitas yang menggerakkan revolusi kelapa berkelanjutan.
          </p>
        </motion.div>
      </div>

      {/* Marquee Wrapper */}
      <div className="relative flex overflow-x-hidden w-full py-8 group">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#F7F5F0] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#F7F5F0] to-transparent z-10" />
        
        {/* Animated Marquee */}
        <div className="flex animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap">
          {[...TESTIMONIALS, ...TESTIMONIALS].map((testimonial, i) => (
            <div
              key={i}
              className="w-[350px] md:w-[450px] mx-4 card-base p-8 whitespace-normal flex-shrink-0 border border-border/50 shadow-lg shadow-charcoal-900/5 transition-transform hover:-translate-y-2"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, idx) => (
                  <Star key={idx} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-charcoal-600 text-lg leading-relaxed mb-6 italic">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-4 mt-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-forest-100"
                />
                <div>
                  <h4 className="font-bold text-charcoal">{testimonial.name}</h4>
                  <p className="text-sm text-forest-600 font-medium">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
