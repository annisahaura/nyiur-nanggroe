import { NextRequest, NextResponse } from "next/server";
import { AIService } from "@/lib/services/ai/ai.service";
import { getAuthUser } from "@/lib/utils/auth-helpers";
import { badRequest, handleError } from "@/lib/utils/api-response";

// POST /api/ai/visual-search
// Menganalisis gambar menggunakan Gemini Vision lalu mencari kecocokan produk kelapa di database
export async function POST(req: NextRequest) {
  try {
    const { user } = await getAuthUser();

    const formData = await req.formData();
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return badRequest("File gambar produk wajib dilampirkan.");
    }

    // Validasi tipe format gambar
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(imageFile.type)) {
      return badRequest("Format gambar tidak didukung. Gunakan JPG, PNG, atau WebP.");
    }

    // Batasan ukuran berkas (maksimal 5MB)
    if (imageFile.size > 5 * 1024 * 1024) {
      return badRequest("Ukuran gambar terlalu besar. Maksimal 5MB.");
    }

    // Konversi file gambar ke format base64
    const arrayBuffer = await imageFile.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    // Lakukan pencarian visual menggunakan AI
    const result = await AIService.visualSearch(
      base64,
      imageFile.type,
      user?.id
    );

    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
}
