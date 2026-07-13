import { GoogleGenerativeAI } from "@google/generative-ai";
import { PROMPTS } from "./prompt-manager";
import { findProducts } from "@/lib/repositories/product.repository";
import { logAIInteraction } from "../ai.service";

export interface VisionSearchResult {
  detected_product: string;
  category: string;
  search_query: string;
  confidence: number;
  description: string;
  tags: string[];
  products: any[];
}

/**
 * Layanan Pencarian Visual (Vision Service)
 * Menggunakan Gemini-1.5-Flash untuk mengidentifikasi objek foto dan mencari kesamaan di marketplace
 */
export async function identifyAndSearchProduct(
  imageBase64: string,
  mimeType: string,
  userId?: string
): Promise<VisionSearchResult> {
  const startTime = Date.now();
  const apiKey = process.env.GEMINI_API_KEY ?? "";

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY tidak dikonfigurasi.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const visionPrompt = PROMPTS.getVisualSearchPrompt();

  try {
    const result = await model.generateContent([
      visionPrompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType,
        },
      },
    ]);

    const responseText = result.response.text();

    // Parsing JSON dari respons Gemini
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Gagal mengurai respons AI sebagai JSON.");
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // Cari produk kelapa yang relevan di database marketplace
    const searchResult = await findProducts({
      q: analysis.search_query,
      page: 1,
      per_page: 8,
      sort: "newest",
    });

    const latency = Date.now() - startTime;

    // Catat log interaksi pencarian visual secara asynchronous
    logAIInteraction({
      user_id: userId,
      type: "visual_search",
      input: `[Pencarian Visual Foto: ${mimeType}]`,
      output: `Terdeteksi: ${analysis.detected_product} (Kepercayaan: ${analysis.confidence}), Query: ${analysis.search_query}`,
      model: "gemini-1.5-flash",
      latency_ms: latency,
    }).catch(() => {});

    return {
      detected_product: analysis.detected_product,
      category: analysis.category,
      search_query: analysis.search_query,
      confidence: analysis.confidence,
      description: analysis.description,
      tags: analysis.tags,
      products: searchResult?.data ?? [],
    };
  } catch (error) {
    const latency = Date.now() - startTime;

    logAIInteraction({
      user_id: userId,
      type: "visual_search",
      input: `[Pencarian Visual Foto: ${mimeType}]`,
      output: `ERROR: ${error instanceof Error ? error.message : "Tidak diketahui"}`,
      model: "gemini-1.5-flash",
      latency_ms: latency,
    }).catch(() => {});

    throw error;
  }
}
