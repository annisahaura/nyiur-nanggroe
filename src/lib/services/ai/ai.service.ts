// ============================================================
// NYIUR NANGGROE — LAYANAN UTAMA KECERDASAN BUATAN (AI SERVICE)
// Pintu masuk utama (facade) untuk seluruh operasi AI di platform
// ============================================================

import { getStreamingChatCompletion, type ChatServiceOptions } from "./chat.service";
import { identifyAndSearchProduct, type VisionSearchResult } from "./vision.service";
import { gradeProductImage, getStoreQualityReports, type QualityReport } from "./grading.service";
import { getPersonalizedRecommendations, type RecommendationEngineResult } from "./recommendation.service";
import { createRouteClient } from "@/lib/utils/auth-helpers";

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

/**
 * Mencatat interaksi AI ke tabel database `ai_logs` untuk audit & analitik masa depan
 */
export async function logAIInteraction(input: AILogInput): Promise<void> {
  try {
    const supabase = await createRouteClient();
    await supabase.from("ai_logs").insert({
      user_id: input.user_id || null,
      type: input.type,
      input: input.input,
      output: input.output,
      tokens_used: input.tokens_used,
      model: input.model,
      latency_ms: input.latency_ms,
    });
  } catch (error) {
    // Pastikan kegagalan logging tidak menghentikan jalan utama aplikasi
    console.warn("[AI Service] Gagal mencatat interaksi:", error);
  }
}

/**
 * AI Service Gateway
 */
export const AIService = {
  // 1. Obrolan Maskot Nyai Nyiur (Streaming & Context-aware)
  chat: getStreamingChatCompletion,

  // 2. Pencarian Visual AI
  visualSearch: identifyAndSearchProduct,

  // 3. AI Quality Grading (Penilaian Mutu Foto)
  gradeImage: gradeProductImage,
  getStoreReports: getStoreQualityReports,

  // 4. Rekomendasi Produk Cerdas
  getRecommendations: getPersonalizedRecommendations,

  // 5. Pencatatan log interaksi AI
  log: logAIInteraction,
};
