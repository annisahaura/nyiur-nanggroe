import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  console.warn("[AI] GEMINI_API_KEY not set — Visual Search will be unavailable");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

export const geminiVision = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// ============================================
// VISUAL SEARCH
// ============================================

export interface VisualSearchAnalysis {
  detected_product: string;
  category: string;
  search_query: string;
  tags: string[];
  confidence: number;
  description: string;
}

export async function analyzeProductImage(
  imageBase64: string,
  mimeType: string = "image/jpeg"
): Promise<VisualSearchAnalysis> {
  const prompt = `Kamu adalah sistem analisis produk kelapa. Analisis gambar ini dan identifikasi:

1. Apa produk turunan kelapa yang terlihat? (misal: tempurung kelapa, sabut kelapa, cocopeat, arang kelapa, briket kelapa, minyak kelapa, kerajinan tempurung, dll.)
2. Kategori produk
3. Query pencarian yang tepat untuk marketplace
4. Tag-tag relevan untuk pencarian

Jika gambar bukan produk kelapa, tetap berikan analisis tentang apa yang terlihat.

Respons dalam format JSON:
{
  "detected_product": "nama produk dalam bahasa Indonesia",
  "category": "kategori produk",
  "search_query": "query pencarian untuk marketplace",
  "tags": ["tag1", "tag2", "tag3"],
  "confidence": 0.95,
  "description": "deskripsi singkat produk"
}`;

  const result = await geminiVision.generateContent([
    prompt,
    {
      inlineData: {
        data: imageBase64,
        mimeType: mimeType,
      },
    },
  ]);

  const text = result.response.text();

  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse Gemini response as JSON");
  }

  return JSON.parse(jsonMatch[0]) as VisualSearchAnalysis;
}
