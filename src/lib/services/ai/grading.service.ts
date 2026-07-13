import { GoogleGenerativeAI } from "@google/generative-ai";
import { PROMPTS } from "./prompt-manager";
import { createRouteClient } from "@/lib/utils/auth-helpers";
import { logAIInteraction } from "../ai.service";

export interface QualityReport {
  id?: string;
  overall_grade: "A" | "B" | "C";
  moisture_estimate: string;
  surface_condition: string;
  color_consistency: string;
  packaging_appearance: string;
  image_quality: string;
  presentation_score: number;
  potential_market: "Local" | "National" | "Export";
  suggestions: string[];
  explanation: string;
  created_at?: string;
}

/**
 * Layanan Penilaian Kualitas Foto Produk (AI Quality Grading Service)
 * Menganalisis kondisi fisik produk dan kualitas foto, lalu menyimpan laporan di database
 */
export async function gradeProductImage(
  storeId: string,
  imageBase64: string,
  mimeType: string,
  imageUrl: string,
  userId?: string
): Promise<QualityReport> {
  const startTime = Date.now();
  const apiKey = process.env.GEMINI_API_KEY ?? "";

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY tidak dikonfigurasi.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const gradingPrompt = PROMPTS.getQualityGradingPrompt();

  try {
    const result = await model.generateContent([
      gradingPrompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType,
        },
      },
    ]);

    const responseText = result.response.text();

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Gagal mengurai hasil laporan mutu dari AI.");
    }

    const report: QualityReport = JSON.parse(jsonMatch[0]);

    // Simpan hasil grading ke database Supabase
    const supabase = await createRouteClient();
    const { data: savedReport, error } = await supabase
      .from("ai_quality_reports")
      .insert({
        store_id: storeId,
        image_url: imageUrl,
        overall_grade: report.overall_grade,
        moisture_estimate: report.moisture_estimate,
        surface_condition: report.surface_condition,
        color_consistency: report.color_consistency,
        packaging_appearance: report.packaging_appearance,
        image_quality: report.image_quality,
        presentation_score: report.presentation_score,
        potential_market: report.potential_market,
        suggestions: report.suggestions,
        explanation: report.explanation,
      })
      .select("*")
      .single();

    if (error) {
      console.error("[Quality Grading] Gagal menyimpan ke DB:", error);
    }

    const latency = Date.now() - startTime;

    // Catat ke log interaksi AI
    logAIInteraction({
      user_id: userId,
      type: "visual_search", // Gunakan 'visual_search' atau tipe khusus
      input: `[AI Quality Grading Foto: ${mimeType}]`,
      output: `Grade: ${report.overall_grade}, Skor: ${report.presentation_score}, Pasar: ${report.potential_market}`,
      model: "gemini-1.5-flash",
      latency_ms: latency,
    }).catch(() => {});

    return savedReport ?? report;
  } catch (error) {
    const latency = Date.now() - startTime;

    logAIInteraction({
      user_id: userId,
      type: "visual_search",
      input: `[AI Quality Grading Foto: ${mimeType}]`,
      output: `ERROR: ${error instanceof Error ? error.message : "Tidak diketahui"}`,
      model: "gemini-1.5-flash",
      latency_ms: latency,
    }).catch(() => {});

    throw error;
  }
}

/**
 * Mendapatkan riwayat laporan penilaian kualitas untuk toko mitra
 */
export async function getStoreQualityReports(storeId: string, limit = 10) {
  const supabase = await createRouteClient();

  const { data, error } = await supabase
    .from("ai_quality_reports")
    .select("*")
    .eq("store_id", storeId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}
