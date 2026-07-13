import { createRouteClient } from "@/lib/utils/auth-helpers";
import { analyzeProductImage } from "@/lib/ai/gemini";
import { findProducts } from "@/lib/repositories/product.repository";

// ============================================================
// LAYANAN AI
// Memusatkan semua operasi AI dengan pencatatan ke tabel ai_logs
// Mendukung: obrolan (OpenAI/Gemini), pencarian visual (Gemini Vision)
// ============================================================

export type AIInteractionType = "chat" | "visual_search" | "recommendation";

export interface AILogInput {
  user_id?: string;
  type: AIInteractionType;
  input?: string;
  output?: string;
  tokens_used?: number;
  model?: string;
  latency_ms?: number;
}

// ============================================================
// CATAT INTERAKSI AI
// ============================================================

export async function logAIInteraction(input: AILogInput): Promise<void> {
  try {
    const supabase = await createRouteClient();
    await supabase.from("ai_logs").insert(input);
  } catch {
    // Kegagalan pencatatan tidak boleh merusak respons pengguna
    console.warn("[AI] Gagal mencatat interaksi");
  }
}

// ============================================================
// PENCARIAN VISUAL
// Gemini Vision → identifikasi produk → pencarian di marketplace
// ============================================================

export interface VisualSearchResult {
  detected_product: string;
  category: string;
  search_query: string;
  confidence: number;
  description: string;
  tags: string[];
  products: any[];
}

export async function performVisualSearch(
  imageBase64: string,
  mimeType: string,
  userId?: string
): Promise<VisualSearchResult> {
  const startTime = Date.now();
  let analysis: Awaited<ReturnType<typeof analyzeProductImage>> | null = null;

  try {
    // Analisis gambar dengan Gemini Vision
    analysis = await analyzeProductImage(imageBase64, mimeType);

    // Cari produk di marketplace berdasarkan query yang terdeteksi
    const { data: products } = await findProducts({
      q: analysis.search_query,
      page: 1,
      per_page: 8,
      sort: "newest",
    });

    const latency = Date.now() - startTime;

    // Catat interaksi
    await logAIInteraction({
      user_id: userId,
      type: "visual_search",
      input: `[gambar:${mimeType}]`,
      output: JSON.stringify({ terdeteksi: analysis.detected_product, query: analysis.search_query }),
      model: "gemini-1.5-flash",
      latency_ms: latency,
    });

    return {
      detected_product: analysis.detected_product,
      category: analysis.category,
      search_query: analysis.search_query,
      confidence: analysis.confidence,
      description: analysis.description,
      tags: analysis.tags,
      products,
    };
  } catch (error) {
    const latency = Date.now() - startTime;

    await logAIInteraction({
      user_id: userId,
      type: "visual_search",
      input: `[gambar:${mimeType}]`,
      output: `ERROR: ${error instanceof Error ? error.message : "Tidak diketahui"}`,
      model: "gemini-1.5-flash",
      latency_ms: latency,
    });

    throw error;
  }
}

// ============================================================
// OBROLAN AI
// Berbasis OpenAI dengan konteks + pencatatan otomatis
// ============================================================

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatResult {
  reply: string;
  tokens_used?: number;
}

const NYIUR_SYSTEM_PROMPT = `Kamu adalah Nyiur AI, asisten cerdas platform Nyiur Nanggroe — marketplace produk kelapa terbesar di Indonesia. 
Tugasmu membantu pengguna dengan:
- Informasi tentang produk turunan kelapa (VCO, briket, cocopeat, arang, sabut, dll)
- Panduan berjualan dan membeli di platform
- Edukasi tentang ekonomi sirkular dan manfaat produk kelapa
- Tips pertanian kelapa dan pengolahan produk
- Estimasi dampak lingkungan dari produk kelapa ramah lingkungan

Selalu berikan respons dalam Bahasa Indonesia yang ramah, informatif, dan profesional.
Jika pertanyaan di luar topik kelapa dan marketplace, arahkan kembali ke topik yang relevan.`;

export async function chatWithAI(
  messages: ChatMessage[],
  userId?: string
): Promise<ChatResult> {
  // Impor lazy agar tidak crash jika env belum dikonfigurasi
  const { default: OpenAI } = await import("openai").catch(() => ({ default: null }));

  if (!OpenAI || !process.env.OPENAI_API_KEY) {
    // Fallback ke Gemini jika OpenAI tidak dikonfigurasi
    return chatWithGemini(messages, userId);
  }

  const startTime = Date.now();
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // Batasi 10 pesan terakhir agar tidak melebihi batas konteks
  const recent = messages.slice(-10);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: NYIUR_SYSTEM_PROMPT },
        ...recent.map((m) => ({ role: m.role, content: m.content })),
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content ?? "Maaf, saya tidak bisa menjawab saat ini.";
    const tokens = completion.usage?.total_tokens;
    const latency = Date.now() - startTime;
    const lastUserMsg = messages[messages.length - 1]?.content ?? "";

    await logAIInteraction({
      user_id: userId,
      type: "chat",
      input: lastUserMsg.slice(0, 500),
      output: reply.slice(0, 500),
      tokens_used: tokens,
      model: "gpt-4o-mini",
      latency_ms: latency,
    });

    return { reply, tokens_used: tokens };
  } catch (error) {
    const latency = Date.now() - startTime;
    const lastUserMsg = messages[messages.length - 1]?.content ?? "";

    await logAIInteraction({
      user_id: userId,
      type: "chat",
      input: lastUserMsg.slice(0, 500),
      output: `ERROR: ${error instanceof Error ? error.message : "Tidak diketahui"}`,
      model: "gpt-4o-mini",
      latency_ms: latency,
    });

    throw error;
  }
}

// ============================================================
// FALLBACK OBROLAN GEMINI
// ============================================================

async function chatWithGemini(
  messages: ChatMessage[],
  userId?: string
): Promise<ChatResult> {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const startTime = Date.now();
  const lastUserMsg = messages[messages.length - 1]?.content ?? "";

  // Gabungkan riwayat percakapan ke satu prompt
  const context = messages
    .slice(-6)
    .map((m) => `${m.role === "user" ? "Pengguna" : "Nyiur AI"}: ${m.content}`)
    .join("\n");

  const prompt = `${NYIUR_SYSTEM_PROMPT}\n\n${context}\n\nNyiur AI:`;

  try {
    const result = await model.generateContent(prompt);
    const reply = result.response.text();
    const latency = Date.now() - startTime;

    await logAIInteraction({
      user_id: userId,
      type: "chat",
      input: lastUserMsg.slice(0, 500),
      output: reply.slice(0, 500),
      model: "gemini-1.5-flash",
      latency_ms: latency,
    });

    return { reply };
  } catch (error) {
    throw error;
  }
}

// ============================================================
// RIWAYAT INTERAKSI AI PENGGUNA
// ============================================================

export async function getUserAIHistory(userId: string, limit = 20) {
  const supabase = await createRouteClient();

  const { data, error } = await supabase
    .from("ai_logs")
    .select("id, type, input, output, model, latency_ms, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}
