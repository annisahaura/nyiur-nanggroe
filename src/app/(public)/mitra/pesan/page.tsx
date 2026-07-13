"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MitraSidebar } from "@/components/layout/MitraSidebar";
import { Search, Send, CheckCheck, User, Smile, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock messaging threads
const INITIAL_CHATS = [
  {
    id: "chat-1",
    name: "Ahmad Maulana",
    lastMsg: "Apakah briket hexagon ini siap kirim dalam jumlah besar (1 ton)?",
    time: "10:14",
    unread: 2,
    online: true,
    messages: [
      { id: "m-1", sender: "user", text: "Halo, selamat pagi. Saya tertarik dengan Briket Kelapa Hexagon Anda.", time: "10:02" },
      { id: "m-2", sender: "seller", text: "Selamat pagi! Tentu, briket kami menggunakan 100% tempurung kelapa murni tanpa campuran bahan kimia.", time: "10:05" },
      { id: "m-3", sender: "user", text: "Apakah briket hexagon ini siap kirim dalam jumlah besar (1 ton)?", time: "10:14" }
    ]
  },
  {
    id: "chat-2",
    name: "Budi Santoso",
    lastMsg: "Baik, segera saya kabari untuk pengajuannya.",
    time: "Kemarin",
    unread: 0,
    online: false,
    messages: [
      { id: "m-4", sender: "user", text: "Apakah VCO Anda berbau tengik? Saya pernah beli dari seller lain berbau tengik.", time: "Kemarin 14:02" },
      { id: "m-5", sender: "seller", text: "VCO kami diproses dingin (cold-pressed) & disaring mikro. Dijamin bening, jernih, dan beraroma kelapa segar alami tanpa bau tengik.", time: "Kemarin 14:10" },
      { id: "m-6", sender: "user", text: "Baik, segera saya kabari untuk pengajuannya.", time: "Kemarin 14:15" }
    ]
  },
  {
    id: "chat-3",
    name: "Siti Aisyah",
    lastMsg: "Terima kasih banyak atas bonus cocopot-nya!",
    time: "2 hari lalu",
    unread: 0,
    online: true,
    messages: [
      { id: "m-7", sender: "user", text: "Apakah cocopeat ini steril dari hama tanah?", time: "2 hari lalu" },
      { id: "m-8", sender: "seller", text: "Betul Kak Siti, sudah di-treatment khusus & memiliki EC rendah (di bawah 0.5) sehingga sangat aman digunakan untuk tanaman hias.", time: "2 hari lalu" },
      { id: "m-9", sender: "user", text: "Terima kasih banyak atas bonus cocopot-nya!", time: "2 hari lalu" }
    ]
  }
];

const QUICK_REPLIES = [
  "Halo! Stok produk ini masih tersedia. Silakan langsung diorder ya Kak. 😊",
  "Pesanan Anda sedang kami kemas dan segera dikirim sore ini juga. Terima kasih!",
  "Produk kami menggunakan kelapa alami pilihan Aceh dan diproduksi secara sirkular.",
  "Untuk pembelian partai besar di atas 100kg, silakan ajukan penawaran khusus."
];

export default function MitraMessagesPage() {
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState("chat-1");
  const [inputText, setInputText] = useState("");
  const [search, setSearch] = useState("");

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  const handleSend = (textToSend = inputText) => {
    if (!textToSend.trim()) return;

    const newMsg = {
      id: `m-${Date.now()}`,
      sender: "seller",
      text: textToSend,
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    };

    setChats(prev => prev.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMsg],
          lastMsg: textToSend,
          time: newMsg.time,
          unread: 0
        };
      }
      return chat;
    }));

    setInputText("");
  };

  const handleQuickReply = (reply: string) => {
    handleSend(reply);
  };

  const filteredChats = chats.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream pt-24 md:pt-28 pb-8">
        <div className="container-base">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <MitraSidebar activeId="messages" />
            </aside>

            <div className="lg:col-span-3 space-y-6">
              <div>
                <h1 className="text-xl font-bold text-charcoal-800">Kotak Masuk Pesan</h1>
                <p className="text-xs text-charcoal-500 mt-0.5">Komunikasi interaktif langsung dengan calon pembeli dan pelanggan toko Anda.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white border border-border/60 rounded-3xl shadow-sm overflow-hidden h-[540px]">
                {/* Chat Threads list */}
                <div className="md:col-span-1 border-r flex flex-col h-full bg-mist/5">
                  <div className="p-4 border-b shrink-0 bg-white">
                    <div className="flex items-center gap-2 border px-3 py-2 rounded-xl bg-mist/20">
                      <Search className="w-4 h-4 text-charcoal-400" />
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari pembeli..."
                        className="bg-transparent border-none outline-none text-xs w-full text-charcoal placeholder:text-charcoal-350"
                      />
                    </div>
                  </div>

                  <div className="overflow-y-auto flex-1 divide-y">
                    {filteredChats.map(chat => (
                      <button
                        key={chat.id}
                        onClick={() => {
                          setActiveChatId(chat.id);
                          // Reset unread count
                          setChats(prev => prev.map(c => c.id === chat.id ? { ...c, unread: 0 } : c));
                        }}
                        className={cn(
                          "w-full text-left p-4 transition-all flex items-start gap-3 hover:bg-mist/10",
                          activeChatId === chat.id ? "bg-forest-50/50" : ""
                        )}
                      >
                        <div className="relative shrink-0 mt-0.5">
                          <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center font-bold text-forest-700 text-sm">
                            {chat.name.charAt(0)}
                          </div>
                          {chat.online && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex justify-between items-center">
                            <h3 className="text-xs font-bold text-charcoal-800 truncate pr-2">{chat.name}</h3>
                            <span className="text-[9px] text-charcoal-400 font-medium whitespace-nowrap">{chat.time}</span>
                          </div>
                          <p className="text-[11px] text-charcoal-500 truncate line-clamp-1 leading-normal">
                            {chat.lastMsg}
                          </p>
                        </div>
                        {chat.unread > 0 && (
                          <span className="w-5 h-5 rounded-full bg-forest-600 text-white text-[9px] font-bold flex items-center justify-center shrink-0 ml-1.5 self-center">
                            {chat.unread}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Conversation Box */}
                <div className="md:col-span-2 flex flex-col h-full justify-between bg-white">
                  {activeChat ? (
                    <>
                      {/* Active Header */}
                      <div className="px-5 py-3 border-b flex items-center gap-3 shrink-0">
                        <div className="w-9 h-9 rounded-xl bg-forest-100 flex items-center justify-center font-bold text-forest-700 text-sm">
                          {activeChat.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-charcoal-800">{activeChat.name}</h3>
                          <span className="text-[10px] text-emerald-500 font-semibold">{activeChat.online ? "Online" : "Offline"}</span>
                        </div>
                      </div>

                      {/* Messages Flow */}
                      <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-none">
                        {activeChat.messages.map(msg => {
                          const isMe = msg.sender === "seller";
                          return (
                            <div
                              key={msg.id}
                              className={cn(
                                "flex flex-col max-w-[75%] space-y-1.5",
                                isMe ? "ml-auto items-end" : "mr-auto items-start"
                              )}
                            >
                              <div
                                className={cn(
                                  "px-4 py-3 rounded-2xl text-xs leading-relaxed shadow-sm border",
                                  isMe
                                    ? "bg-forest-600 border-forest-600 text-white rounded-tr-none"
                                    : "bg-mist/30 border-border/40 text-charcoal rounded-tl-none"
                                )}
                              >
                                {msg.text}
                              </div>
                              <span className="text-[9px] text-charcoal-400 px-1 font-medium flex items-center gap-1">
                                {msg.time}
                                {isMe && <CheckCheck className="w-3.5 h-3.5 text-forest-500" />}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Quick Replies Tray */}
                      <div className="px-4 py-2 border-t bg-mist/5 flex gap-2 overflow-x-auto scrollbar-none shrink-0">
                        {QUICK_REPLIES.map((reply, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleQuickReply(reply)}
                            className="px-3 py-1.5 bg-white border border-border/80 text-[10px] text-charcoal-600 hover:text-forest-600 hover:border-forest-500 rounded-full font-semibold whitespace-nowrap transition-colors shrink-0 shadow-sm"
                          >
                            ⚡ {reply.slice(0, 24)}...
                          </button>
                        ))}
                      </div>

                      {/* Input Actions Box */}
                      <form
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        className="p-4 border-t flex items-center gap-3 shrink-0"
                      >
                        <button type="button" className="text-charcoal-400 hover:text-charcoal transition-colors">
                          <Paperclip className="w-5 h-5" />
                        </button>
                        <input
                          type="text"
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          placeholder="Tulis balasan pesan di sini..."
                          className="flex-1 input-base py-2.5 text-xs"
                        />
                        <button type="button" className="text-charcoal-400 hover:text-charcoal transition-colors">
                          <Smile className="w-5 h-5" />
                        </button>
                        <button
                          type="submit"
                          className="bg-forest-600 hover:bg-forest-700 text-white p-2.5 rounded-xl shadow-md transition-colors"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-charcoal-400 text-xs font-medium">
                      Pilih obrolan untuk mulai berkirim pesan.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
