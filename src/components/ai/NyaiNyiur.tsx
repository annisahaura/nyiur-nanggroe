"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  Minimize2,
  Maximize2,
  Sparkles,
  RefreshCw,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/lib/stores/auth-store";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

const getContextualSuggestions = (pathname: string) => {
  if (pathname.includes("/mitra")) {
    return [
      "Bagaimana cara menaikkan omzet toko saya?",
      "Bagaimana mengoptimalkan stok briket kelapa?",
      "Tips menurunkan emisi karbon produksi kelapa?",
      "Bagaimana menjadi penjual terverifikasi?"
    ];
  }
  if (pathname.includes("/produk/")) {
    return [
      "Bagaimana cara memverifikasi kualitas Grade A?",
      "Apa beda briket kelapa premium ini dengan arang biasa?",
      "Bagaimana cara menghitung kontribusi CO2 produk ini?",
      "Berapa minimal pemesanan untuk briket kelapa?"
    ];
  }
  if (pathname.includes("/produk")) {
    return [
      "Rekomendasikan briket kelapa kualitas terbaik",
      "Mana media tanam cocopeat terpopuler?",
      "Bagaimana cara kerja pencarian visual AI?",
      "Ada kerajinan kelapa khas daerah mana saja?"
    ];
  }
  if (pathname.includes("/edukasi")) {
    return [
      "Bagaimana cara belajar mengolah kelapa circular?",
      "Berapa skor minimal kelulusan kuis?",
      "Apa saja keuntungan memiliki Learning Points?",
      "Rekomendasikan artikel tentang VCO"
    ];
  }
  return [
    "Apa produk kelapa yang paling diminati?",
    "Bagaimana cara menjadi Mitra Nyiur?",
    "Apa manfaat cocopeat untuk pertanian?",
    "Briket kelapa vs arang biasa?",
  ];
};

const getContextualGreeting = (pathname: string) => {
  if (pathname.includes("/mitra")) {
    return "Halo Mitra Nyiur! Saya asisten AI toko Anda. Butuh saran optimasi penjualan atau cara mengelola stok produk kelapa Anda hari ini?";
  }
  if (pathname.includes("/produk/")) {
    return "Halo! Ada pertanyaan tentang spesifikasi detail, sertifikasi eco, atau mutu kualitas Grade A dari produk kelapa ini?";
  }
  if (pathname.includes("/produk")) {
    return "Selamat datang di Marketplace Nyiur! Butuh rekomendasi produk kelapa terbaik atau panduan pencarian produk sirkular?";
  }
  if (pathname.includes("/edukasi")) {
    return "Halo Sobat Belajar! Butuh rangkuman artikel edukasi kelapa atau butuh tips menjawab kuis mingguan?";
  }
  return "Halo! Saya **Nyai Nyiur** — asisten AI dari Nyiur Nanggroe.\n\nSaya siap membantu kamu menemukan produk kelapa terbaik, menjawab pertanyaan tentang ekonomi sirkular, atau membantu bisnismu berkembang.\n\nAda yang bisa saya bantu hari ini?";
};

function formatContent(content: string) {
  return content
    .split("**")
    .map((part, i) =>
      i % 2 === 1 ? `<strong>${part}</strong>` : part
    )
    .join("");
}

export function NyaiNyiur() {
  const pathname = usePathname();
  const user = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [guestQuestionCount, setGuestQuestionCount] = useState(0);

  const GUEST_QUESTION_LIMIT = 5;
  const GUEST_COUNT_KEY = "nyiur_guest_ai_question_count";

  useEffect(() => {
    const handleOpenRequest = () => setIsOpen(true);
    window.addEventListener("nyiur:open-ai-chat", handleOpenRequest);
    return () => window.removeEventListener("nyiur:open-ai-chat", handleOpenRequest);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || user) return;
    const stored = parseInt(localStorage.getItem(GUEST_COUNT_KEY) || "0", 10);
    setGuestQuestionCount(Number.isNaN(stored) ? 0 : stored);
  }, [user]);
  
  const suggestions = getContextualSuggestions(pathname);
  const greeting = getContextualGreeting(pathname);

  const initialMessage: Message = {
    id: "welcome",
    role: "assistant",
    content: greeting,
    timestamp: new Date(),
  };

  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: greeting,
        timestamp: new Date(),
      }
    ]);
    setShowSuggestions(true);
  }, [pathname, greeting]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    if (!user && guestQuestionCount >= GUEST_QUESTION_LIMIT) {
      setShowSuggestions(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "user",
          content: content.trim(),
          timestamp: new Date(),
        },
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "Kamu sudah mencapai batas tanya-jawab gratis untuk tamu.\n\nYuk **buat akun dulu** biar bisa lanjut ngobrol sama saya tanpa batas, sekalian dapat rekomendasi produk yang lebih personal!",
          timestamp: new Date(),
        },
      ]);
      setInput("");
      return;
    }

    if (!user) {
      const nextCount = guestQuestionCount + 1;
      setGuestQuestionCount(nextCount);
      if (typeof window !== "undefined") {
        localStorage.setItem(GUEST_COUNT_KEY, String(nextCount));
      }
    }

    setShowSuggestions(false);
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const assistantId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pathname,
          messages: [...messages.slice(1), userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error("Response not OK");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  accumulated += parsed.text;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantId
                        ? { ...m, content: accumulated, isStreaming: true }
                        : m
                    )
                  );
                }
              } catch {
                // ignore
              }
            }
          }
        }
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, isStreaming: false } : m
        )
      );
    } catch (error) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content:
                  "Maaf, saya sedang tidak bisa menjawab saat ini. Silakan coba lagi sebentar ya.",
                isStreaming: false,
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const resetConversation = () => {
    setMessages([initialMessage]);
    setShowSuggestions(true);
  };

  // ── AssistiveTouch drag logic ──────────────────────────────────────────────
  // Track position manually so we can distinguish tap vs drag
  const BUTTON_SIZE = 64; // px
  const EDGE_MARGIN = 16;  // px from screen edge

  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const posRef = useRef({ x: 0, y: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  // Initialise position (bottom-right, same as before)
  useEffect(() => {
    const x = window.innerWidth - BUTTON_SIZE - EDGE_MARGIN;
    const y = window.innerHeight - BUTTON_SIZE - EDGE_MARGIN;
    setPos({ x, y });
    posRef.current = { x, y };
  }, []);

  const clamp = useCallback((val: number, min: number, max: number) =>
    Math.max(min, Math.min(max, val)), []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    hasDragged.current = false;
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      px: posRef.current.x,
      py: posRef.current.y,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    // Mark as drag if moved > 6px
    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) hasDragged.current = true;
    const maxX = window.innerWidth - BUTTON_SIZE - EDGE_MARGIN;
    const maxY = window.innerHeight - BUTTON_SIZE - EDGE_MARGIN;
    const nx = clamp(dragStart.current.px + dx, EDGE_MARGIN, maxX);
    const ny = clamp(dragStart.current.py + dy, EDGE_MARGIN, maxY);
    posRef.current = { x: nx, y: ny };
    setPos({ x: nx, y: ny });
  }, [clamp]);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
    // Snap to nearest vertical edge
    const maxX = window.innerWidth - BUTTON_SIZE - EDGE_MARGIN;
    const snapX = posRef.current.x < window.innerWidth / 2 ? EDGE_MARGIN : maxX;
    const clamped = {
      x: snapX,
      y: clamp(posRef.current.y, EDGE_MARGIN, window.innerHeight - BUTTON_SIZE - EDGE_MARGIN),
    };
    posRef.current = clamped;
    setPos(clamped);
  }, [clamp]);

  const handleTap = useCallback(() => {
    // Only open if it was a real tap, not end of a drag
    if (!hasDragged.current) setIsOpen(true);
  }, []);

  return (
    <>
      {/* AssistiveTouch Floating Button */}
      <AnimatePresence>
        {!isOpen && pos && (
          <motion.div
            style={{ left: pos.x, top: pos.y, position: "fixed" }}
            animate={{ left: pos.x, top: pos.y }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="z-[55] touch-none"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          >
            <button
              ref={btnRef}
              onClick={handleTap}
              className="relative group focus:outline-none select-none"
              style={{ cursor: isDragging.current ? "grabbing" : "grab" }}
              aria-label="Tanya Nyai Nyiur"
              draggable={false}
            >
              {/* Logo Button */}
              <div className="w-16 h-16 rounded-full border-2 border-forest-400 shadow-xl overflow-hidden bg-white flex items-center justify-center transition-all duration-200 group-hover:border-amber-400 group-hover:shadow-2xl group-active:scale-95">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/Logo-NyiurNanggroe.png"
                  alt="Nyai Nyiur AI"
                  className="w-full h-full object-contain p-1"
                  draggable={false}
                />
              </div>

              {/* Sparkle badge */}
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center shadow-md animate-bounce">
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </span>

              {/* Tooltip */}
              <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-forest-700 text-white text-xs font-semibold px-3.5 py-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none shadow-xl border border-forest-500">
                Nyai Nyiur di sini!
                <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-forest-700" />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Bubble UI */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, originX: 1, originY: 1 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              height: isMinimized ? "auto" : undefined,
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={cn(
              "fixed bottom-6 right-6 z-[55] w-[365px] max-w-[calc(100vw-3rem)] rounded-[32px] overflow-hidden shadow-2xl",
              "bg-white border border-border/80",
              isMinimized && "shadow-glass"
            )}
            role="dialog"
            aria-label="Asisten AI Nyai Nyiur"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-forest-700 to-forest-800 text-white relative">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-forest-400 flex-shrink-0 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/Logo-NyiurNanggroe.png"
                  alt="Nyai Nyiur"
                  className="w-full h-full object-contain p-0.5"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm">Nyai Nyiur</span>
                  <span className="flex items-center gap-1 text-[9px] bg-forest-600 px-2 py-0.5 rounded-full text-forest-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-moss-400 animate-ping" />
                    Aktif
                  </span>
                </div>
                <p className="text-forest-200 text-[10px]">
                  Pakar Kelapa & Ekonomi Sirkular
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={resetConversation}
                  className="p-1.5 rounded-xl hover:bg-white/10 transition-colors"
                  aria-label="Reset percakapan"
                  title="Reset"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 rounded-xl hover:bg-white/10 transition-colors"
                  aria-label={isMinimized ? "Perbesar" : "Perkecil"}
                >
                  {isMinimized ? (
                    <Maximize2 className="w-3.5 h-3.5" />
                  ) : (
                    <Minimize2 className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-white/10 transition-colors"
                  aria-label="Tutup asisten AI"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            {!isMinimized && (
              <>
                <div className="h-80 overflow-y-auto p-5 space-y-4 bg-cream/30">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3",
                        message.role === "user" ? "flex-row-reverse" : ""
                      )}
                    >
                      {/* Avatar */}
                      {message.role === "assistant" && (
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-forest-100 shadow-sm flex-shrink-0 mt-0.5 bg-white">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/images/Logo-NyiurNanggroe.png"
                            alt="Nyai Nyiur"
                            className="w-full h-full object-contain p-0.5"
                          />
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div
                        className={cn(
                          "max-w-[80%] rounded-[20px] px-4 py-3 text-xs leading-relaxed shadow-sm",
                          message.role === "user"
                            ? "bg-forest-600 text-white rounded-tr-none"
                            : "bg-white border border-border/80 text-charcoal-700 rounded-tl-none"
                        )}
                      >
                        {message.isStreaming && message.content === "" ? (
                          <div className="flex items-center gap-1.5 py-1">
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                className="w-2 h-2 rounded-full bg-forest-400"
                                animate={{ y: [0, -6, 0] }}
                                transition={{
                                  duration: 0.6,
                                  repeat: Infinity,
                                  delay: i * 0.15,
                                }}
                              />
                            ))}
                          </div>
                        ) : (
                          <div
                            className="prose prose-sm prose-forest"
                            dangerouslySetInnerHTML={{
                              __html: formatContent(message.content).replace(
                                /\n/g,
                                "<br/>"
                              ),
                            }}
                          />
                        )}
                        {message.isStreaming && message.content && (
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity }}
                            className="inline-block w-1.5 h-3.5 bg-forest-500 ml-0.5 align-middle"
                          />
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Suggestion Prompts */}
                  {showSuggestions && messages.length === 1 && (
                    <div className="space-y-2 pt-2">
                      <p className="text-[10px] text-charcoal-400 font-bold px-1 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        Pilih topik diskusi:
                      </p>
                      {suggestions.map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => sendMessage(prompt)}
                          className="w-full text-left text-xs px-3.5 py-2.5 rounded-2xl bg-white border border-border/80 text-charcoal-600 hover:text-forest-700 hover:border-forest-400 hover:bg-forest-50/50 hover:shadow-sm transition-all duration-200"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Panel */}
                <div className="p-4 border-t border-border bg-white rounded-b-[32px]">
                  <div className="flex gap-2 items-center">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Tanya Nyai Nyiur..."
                      rows={1}
                      className="flex-1 resize-none text-xs text-charcoal bg-mist rounded-2xl px-4 py-3 border border-border/80 focus:outline-none focus:ring-2 focus:ring-forest-500/20 focus:border-forest-500 transition-all placeholder:text-charcoal-300 max-h-24"
                      style={{ minHeight: "42px" }}
                      disabled={isLoading}
                    />
                    <button
                      onClick={() => sendMessage(input)}
                      disabled={!input.trim() || isLoading}
                      className="w-10 h-10 rounded-2xl bg-forest-600 text-white flex items-center justify-center hover:bg-forest-500 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all flex-shrink-0 shadow-sm"
                      aria-label="Kirim pesan"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[9px] text-charcoal-400 mt-2 text-center flex items-center justify-center gap-1">
                    <HelpCircle className="w-3 h-3" />
                    Informasi penting harap selalu diverifikasi mandiri.
                  </p>
                  {!user && (
                    <p className="text-[10px] mt-1.5 text-center">
                      {guestQuestionCount >= GUEST_QUESTION_LIMIT ? (
                        <Link href="/daftar" className="font-bold text-forest-600 hover:underline">
                          Daftar Akun Gratis untuk Bertanya Lagi →
                        </Link>
                      ) : (
                        <span className="text-charcoal-400 font-medium">
                          Tersisa {GUEST_QUESTION_LIMIT - guestQuestionCount} tanya-jawab gratis untuk tamu
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
