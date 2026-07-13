import { NextRequest } from "next/server";
import { getQuizDetail } from "@/lib/services/education.service";
import { getAuthUser } from "@/lib/utils/auth-helpers";
import { ok, notFound, handleError } from "@/lib/utils/api-response";

// GET /api/education/quizzes/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user } = await getAuthUser();

    const quiz = await getQuizDetail(id, user?.id);
    if (!quiz) return notFound("Kuis");

    return ok(quiz);
  } catch (error) {
    return handleError(error);
  }
}
