"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Camera,
  MessageCircle,
  Sparkles,
  Bot,
  ArrowRight,
  Upload,
  Search,
  Zap,
  Brain,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Package,
} from "lucide-react";

const AI_FEATURES = [
  {
    id: "nyai",
    icon: Bot,
    badge: "Nyai Nyiur",
    title: "Asisten AI Kelapa",
    description:
      "Tanya apa saja tentang produk kelapa, cara berdagang, atau dampak lingkungan. Nyai Nyiur hadir 24/7 untuk membantumu.",
    preview: "chat",
    color: "text-forest-600",
    bg: "bg-forest-50",
    border: "border-forest-200",
    accent: "#6B7C3D",
    chatMessages: [
      {
        role: "user",
        text: "Apa perbedaan briket kelapa dengan arang biasa?",
      },
      {
        role: "ai",
        text: "Briket kelapa lebih unggul dalam beberapa hal:\n\n• Kalori lebih tinggi (~7.000 kcal/kg vs ~6.000)\n• Asap lebih sedikit — sempurna untuk BBQ\n• Ramah lingkungan: dari limbah kelapa\n• Durasi bakar 2-3x lebih lama\n\nMau saya carikan briket terbaik di platform?",
      },
    ],
  },
  {
    id: "visual",
    icon: Camera,
    badge: "AI Visual Search",
    title: "Cari Pakai Foto",
    description:
      "Upload foto produk kelapa apa saja, dan AI kami akan langsung mengenali dan mencari produk serupa di marketplace.",
    preview: "visual",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    accent: "#C68642",
  },
  {
    id: "insights",
    icon: Brain,
    badge: "Seller AI Insight",
    title: "Wawasan Cerdas Penjual",
    description:
      "AI menganalisis tren pasar, merekomendasikan produk yang harus ditambah, dan kapan waktu terbaik untuk promosi.",
    preview: "insights",
    color: "text-moss-600",
    bg: "bg-moss-50",
    border: "border-moss-200",
    accent: "#52B788",
  },
];

function ChatPreview({ messages }: { messages: { role: string; text: string }[] }) {
  return (
    <div className="space-y-3 p-4">
      {messages.map((msg, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.3 }}
          className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
        >
          {msg.role === "ai" && (
            <div className="w-7 h-7 rounded-full bg-forest-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Bot className="w-4 h-4 text-cream" />
            </div>
          )}
          <div
            className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line ${
              msg.role === "user"
                ? "bg-forest-600 text-white rounded-tr-sm"
                : "bg-white border border-border text-charcoal-700 rounded-tl-sm shadow-sm"
            }`}
          >
            {msg.text}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function VisualSearchPreview() {
  return (
    <div className="p-4 space-y-3">
      {/* Upload area simulation */}
      <div className="border-2 border-dashed border-amber-200 rounded-xl p-4 flex flex-col items-center gap-2 bg-amber-50/50">
        <Upload className="w-8 h-8 text-amber-400" />
        <p className="text-xs text-charcoal-400 text-center">
          Upload foto produk kelapa...
        </p>
      </div>
      {/* Detection result simulation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-border shadow-sm"
      >
        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-amber-500" />
        </div>
        <div>
          <p className="text-xs font-semibold text-charcoal-800">
            Terdeteksi: Briket Kelapa BBQ
          </p>
          <p className="text-[10px] text-charcoal-400">
            Kepercayaan 96% · 48 produk ditemukan
          </p>
        </div>
      </motion.div>
      {/* Products preview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="grid grid-cols-3 gap-1.5"
      >
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="aspect-square rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 border border-amber-200 flex items-center justify-center text-amber-600"
          >
            <Package className="w-5 h-5" aria-hidden="true" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function InsightsPreview() {
  const insights = [
    { icon: TrendingUp, text: "Briket meningkat 34% bulan ini", type: "trend" },
    { icon: AlertTriangle, text: "Stok cocopeat hampir habis", type: "alert" },
    { icon: Lightbulb, text: "Tambah produk keset untuk raih segmen baru", type: "tip" },
  ];

  return (
    <div className="p-4 space-y-2.5">
      {insights.map((insight, i) => {
        const Icon = insight.icon;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.25 }}
            className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs ${
              insight.type === "alert"
                ? "bg-red-50 border-red-100"
                : insight.type === "tip"
                ? "bg-amber-50 border-amber-100"
                : "bg-moss-50 border-moss-100"
            }`}
          >
            <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
              insight.type === "alert"
                ? "text-red-500"
                : insight.type === "tip"
                ? "text-amber-500"
                : "text-forest-600"
            }`} aria-hidden="true" />
            <p className="text-charcoal-700 leading-snug">{insight.text}</p>
          </motion.div>
        );
      })}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex items-center gap-1.5 text-[10px] text-charcoal-400"
      >
        <Zap className="w-3 h-3 text-amber-400" />
        Diperbarui oleh AI setiap hari
      </motion.div>
    </div>
  );
}

export function AISpotlight() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  const [activeFeature, setActiveFeature] = useState("nyai");

  const active = AI_FEATURES.find((f) => f.id === activeFeature)!;

  return (
    <section
      ref={ref}
      className="section-padding bg-charcoal-800 relative overflow-hidden"
      aria-label="Fitur AI Nyiur Nanggroe"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-forest-900 opacity-90" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(250, 247, 240, 0.8) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="container-base relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-500/20 border border-forest-400/30 text-forest-200 text-xs font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              AI sebagai Otak Platform
            </div>

            <h2 className="font-display text-display-md font-bold text-white mb-4 leading-tight">
              Kecerdasan Buatan yang{" "}
              <span className="text-gradient-amber">Benar-Benar Membantu</span>
            </h2>

            <p className="text-charcoal-300 text-base mb-8 leading-relaxed">
              Bukan sekadar chatbot. AI di Nyiur Nanggroe adalah lapisan
              kecerdasan yang hadir di setiap langkah perjalananmu — dari
              menemukan produk hingga mengembangkan bisnis.
            </p>

            {/* Feature Tabs */}
            <div className="space-y-2 mb-8">
              {AI_FEATURES.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => setActiveFeature(feature.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left ${
                    activeFeature === feature.id
                      ? "bg-white/10 border-white/20 shadow-inner"
                      : "bg-white/[0.03] border-white/5 hover:bg-white/[0.07]"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      activeFeature === feature.id
                        ? "bg-forest-500 text-white"
                        : "bg-white/10 text-charcoal-300"
                    } transition-colors`}
                  >
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded ${
                          activeFeature === feature.id
                            ? "bg-forest-400/20 text-forest-200"
                            : "bg-white/10 text-charcoal-400"
                        }`}
                      >
                        {feature.badge}
                      </span>
                    </div>
                    <p
                      className={`text-sm font-semibold mt-0.5 ${
                        activeFeature === feature.id
                          ? "text-white"
                          : "text-charcoal-300"
                      }`}
                    >
                      {feature.title}
                    </p>
                  </div>
                  {activeFeature === feature.id && (
                    <ArrowRight className="w-4 h-4 text-charcoal-300 ml-auto" />
                  )}
                </button>
              ))}
            </div>

            <p className="text-charcoal-400 text-sm mb-6">{active.description}</p>

            <div className="flex items-center gap-3">
              <Link
                href="/produk?visual=1"
                className="btn-amber inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Coba Sekarang
              </Link>
            </div>
          </motion.div>

          {/* Right: Preview Panel */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            {/* Phone mockup / Panel */}
            <div className="relative mx-auto max-w-sm">
              {/* Glow */}
              <div
                className="absolute inset-0 -inset-4 rounded-3xl opacity-20 blur-2xl"
                style={{
                  background: `radial-gradient(circle, ${active.accent} 0%, transparent 70%)`,
                }}
              />

              {/* Panel */}
              <div className="relative rounded-3xl border border-white/10 overflow-hidden bg-charcoal-900 shadow-2xl">
                {/* Panel Header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-charcoal-800 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-moss-500/70" />
                  </div>
                  <div className="flex-1 h-5 bg-white/5 rounded-md mx-4 flex items-center justify-center">
                    <span className="text-[10px] text-charcoal-500">nyiurnanggroe.id</span>
                  </div>
                </div>

                {/* Panel Content */}
                <div className="bg-mist min-h-64">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeFeature}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                    >
                      {activeFeature === "nyai" && active.chatMessages && (
                        <ChatPreview messages={active.chatMessages} />
                      )}
                      {activeFeature === "visual" && <VisualSearchPreview />}
                      {activeFeature === "insights" && <InsightsPreview />}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
