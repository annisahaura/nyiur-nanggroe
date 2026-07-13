import { NextRequest, NextResponse } from "next/server";
import { AIService } from "@/lib/services/ai/ai.service";
import { getAuthUser } from "@/lib/utils/auth-helpers";
import { handleError } from "@/lib/utils/api-response";

// GET /api/ai/recommendations
// Mengambil rekomendasi produk sejenis, produk populer, dan modul edukasi terpersonalisasi
export async function GET(req: NextRequest) {
  try {
    const { user } = await getAuthUser();
    const { searchParams } = new URL(req.url);

    const productId = searchParams.get("productId") || undefined;
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "4", 10), 12);

    const recommendations = await AIService.getRecommendations(
      user?.id,
      productId,
      limit
    );

    return NextResponse.json(recommendations);
  } catch (error) {
    return handleError(error);
  }
}
