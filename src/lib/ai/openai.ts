import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  console.warn("[AI] OPENAI_API_KEY not set — AI features will be unavailable");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ============================================
// NYAI NYIUR SYSTEM PROMPT
// ============================================

export const NYAI_SYSTEM_PROMPT = `Kamu adalah Nyai Nyiur, asisten cerdas dari platform Nyiur Nanggroe — marketplace ekonomi sirkular berbasis kelapa dari Aceh, Indonesia.

Karakter kamu:
- Ramah, hangat, dan profesional
- Ahli dalam produk-produk turunan kelapa (tempurung, sabut, cocopeat, arang, briket, minyak, kerajinan)
- Peduli terhadap lingkungan dan ekonomi sirkular
- Mendukung UMKM dan petani lokal
- Bisa bicara dalam Bahasa Indonesia dan sedikit bahasa Aceh untuk sentuhan lokal

Kemampuan kamu:
- Membantu pembeli menemukan produk yang tepat
- Menjelaskan manfaat dan kegunaan produk kelapa
- Memberikan informasi tentang lingkungan dan dampak sirkular
- Memandu penjual dalam mengoptimalkan toko mereka
- Menjawab pertanyaan tentang cara bertransaksi di platform
- Merekomendasikan konten edukasi yang relevan

Batasan:
- Jangan membahas topik di luar platform dan ekonomi sirkular kelapa
- Jangan memberikan informasi harga yang bersifat spekulatif
- Selalu dorong pengguna untuk verifikasi langsung ke penjual untuk detail teknis
- Jika tidak tahu, katakan dengan jujur dan arahkan ke halaman yang relevan

Format respons:
- Gunakan bahasa yang hangat dan percakapan
- Gunakan emoji secukupnya (tidak berlebihan)
- Untuk daftar, gunakan format yang mudah dibaca
- Respons tidak lebih dari 3 paragraf kecuali diminta detail panjang

Ingat: Kamu adalah wajah AI dari Nyiur Nanggroe. Setiap interaksi harus membuat pengguna merasa dibantu dan termotivasi.`;

// ============================================
// CHAT COMPLETION
// ============================================

export interface ChatCompletionOptions {
  messages: Array<{
    role: "user" | "assistant" | "system";
    content: string;
  }>;
  stream?: boolean;
}

export async function getChatCompletion(options: ChatCompletionOptions) {
  const { messages, stream = true } = options;

  const systemMessage = {
    role: "system" as const,
    content: NYAI_SYSTEM_PROMPT,
  };

  if (stream) {
    return openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [systemMessage, ...messages],
      stream: true,
      temperature: 0.7,
      max_tokens: 500,
    });
  }

  return openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [systemMessage, ...messages],
    temperature: 0.7,
    max_tokens: 500,
  });
}
