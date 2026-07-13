import { NextRequest } from "next/server";
import { submitQuiz } from "@/lib/services/education.service";
import { quizSubmitSchema } from "@/lib/validators/education.schema";
import { getAuthUser } from "@/lib/utils/auth-helpers";
import { ok, badRequest, unauthorized, handleError } from "@/lib/utils/api-response";

// POST /api/education/quizzes/[id]/submit
// Menilai jawaban di server, menyimpan hasil, dan mengembalikan skor + penjelasan
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error: authError } = await getAuthUser();
    if (authError || !user) return unauthorized("Login untuk mengikuti kuis.");

    const { id: quizId } = await params;

    const body = await req.json();
    const validation = quizSubmitSchema.safeParse(body);
    if (!validation.success) {
      return badRequest("Jawaban tidak valid", validation.error.flatten().fieldErrors);
    }

    const result = await submitQuiz(user.id, quizId, validation.data.answers);
    return ok(result, {
      message: result.passed
        ? `Selamat! Kamu lulus dengan skor ${result.score}%.`
        : `Skor kamu ${result.score}%. Terus belajar dan coba lagi!`,
    });
  } catch (error: any) {
    if (error.message === "QUIZ_NOT_FOUND") return badRequest("Kuis tidak ditemukan.");
    if (error.message === "ANSWER_COUNT_MISMATCH")
      return badRequest("Jumlah jawaban tidak sesuai dengan jumlah pertanyaan.");
    return handleError(error);
  }
}
