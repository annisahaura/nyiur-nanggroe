import { createRouteClient } from "@/lib/utils/auth-helpers";
import { PROMPTS } from "./prompt-manager";
import { queryKnowledgeBase } from "./knowledge-base";
import { logAIInteraction } from "../ai.service";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatServiceOptions {
  messages: ChatMessage[];
  pathname: string;
  userId?: string;
  stream?: boolean;
}

/**
 * Layanan Obrolan AI (Chat Service)
 * Mendukung OpenAI GPT-4o-mini dengan fallback otomatis ke Google Gemini 1.5 Flash
 */
export async function getStreamingChatCompletion(options: ChatServiceOptions) {
  const { messages, pathname, userId } = options;
  const startTime = Date.now();

  const userQuestion = messages[messages.length - 1]?.content ?? "";

  // 1. Ambil system prompt dinamis berdasarkan posisi halaman pengguna
  const baseSystemPrompt = PROMPTS.getSystemPrompt(pathname);

  // 2. Ambil referensi basis pengetahuan kelapa yang cocok dengan isi obrolan
  const knowledgeSnippet = queryKnowledgeBase(userQuestion);
  const finalSystemPrompt = baseSystemPrompt + knowledgeSnippet;

  const systemMessage = {
    role: "system" as const,
    content: finalSystemPrompt,
  };

  const recentMessages = messages.slice(-8); // Batasi riwayat obrolan untuk menghemat kuota token

  // 3. Lazy import OpenAI
  const { default: OpenAI } = await import("openai").catch(() => ({ default: null }));

  if (OpenAI && process.env.OPENAI_API_KEY) {
    try {
      const openaiInstance = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await openaiInstance.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [systemMessage, ...recentMessages],
        stream: true,
        temperature: 0.7,
        max_tokens: 600,
      });

      // Kembalikan stream dan catat secara non-blocking setelah stream selesai dibaca di route
      return {
        provider: "openai",
        model: "gpt-4o-mini",
        stream: completion,
        startTime,
        systemPrompt: finalSystemPrompt,
      };
    } catch (err) {
      console.warn("[AI Chat] Gagal menggunakan OpenAI, mencoba fallback ke Gemini...", err);
    }
  }

  // 4. Fallback ke Google Gemini jika OpenAI tidak aktif
  try {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Format chat history ke gaya Gemini
    const contextHistory = recentMessages
      .map((m) => `${m.role === "user" ? "Pengguna" : "Nyai Nyiur"}: ${m.content}`)
      .join("\n");

    const promptText = `${finalSystemPrompt}\n\nRiwayat Obrolan:\n${contextHistory}\n\nNyai Nyiur:`;

    const result = await model.generateContentStream(promptText);

    return {
      provider: "gemini",
      model: "gemini-1.5-flash",
      stream: result.stream,
      startTime,
      systemPrompt: finalSystemPrompt,
    };
  } catch (err) {
    console.error("[AI Chat] Fallback Gemini juga gagal:", err);
    throw new Error("Semua penyedia layanan AI (OpenAI & Gemini) sedang tidak tersedia.");
  }
}
