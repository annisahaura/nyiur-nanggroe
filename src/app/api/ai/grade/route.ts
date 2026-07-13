import { NextRequest, NextResponse } from "next/server";
import { AIService } from "@/lib/services/ai/ai.service";
import { getAuthUser, isSeller } from "@/lib/utils/auth-helpers";
import { getProfileWithStore } from "@/lib/repositories/user.repository";
import { badRequest, unauthorized, forbidden, handleError } from "@/lib/utils/api-response";

// POST /api/ai/grade
// Mengunggah gambar, menganalisis mutu produk dengan AI, dan menghasilkan laporan penilaian mutu
export async function POST(req: NextRequest) {
  try {
    const { user, error: authError } = await getAuthUser();
    if (authError || !user) return unauthorized("Login terlebih dahulu untuk melakukan penilaian.");

    // Pastikan hanya penjual (Mitra) yang bisa mengakses fitur grading
    const profile = await getProfileWithStore(user.id);
    const store = profile?.seller_profile;
    if (!store) return forbidden("Hanya mitra kelapa terdaftar yang dapat menilai produk.");

    const formData = await req.formData();
    const imageFile = formData.get("image") as File;
    const imageUrl = formData.get("imageUrl") as string || ""; // Tautan bucket storage publik

    if (!imageFile) {
      return badRequest("Gambar produk wajib dilampirkan.");
    }

    // Validasi tipe file
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(imageFile.type)) {
      return badRequest("Format berkas gambar tidak didukung (gunakan JPG/PNG/WebP).");
    }

    // Konversi gambar ke base64
    const arrayBuffer = await imageFile.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    // Lakukan grading produk menggunakan AI
    const qualityReport = await AIService.gradeImage(
      store.id,
      base64,
      imageFile.type,
      imageUrl,
      user.id
    );

    return NextResponse.json(qualityReport);
  } catch (error) {
    return handleError(error);
  }
}

// GET /api/ai/grade
// Mengambil riwayat laporan mutu produk milik mitra toko
export async function GET(req: NextRequest) {
  try {
    const { user, error: authError } = await getAuthUser();
    if (authError || !user) return unauthorized();

    const profile = await getProfileWithStore(user.id);
    const store = profile?.seller_profile;
    if (!store) return forbidden("Profil Mitra tidak ditemukan.");

    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "10", 10), 50);

    const reports = await AIService.getStoreReports(store.id, limit);
    return NextResponse.json(reports);
  } catch (error) {
    return handleError(error);
  }
}
