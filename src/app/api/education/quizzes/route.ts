import { NextRequest } from "next/server";
import { listQuizzes } from "@/lib/services/education.service";
import { ok, handleError } from "@/lib/utils/api-response";

// GET /api/education/quizzes
export async function GET(_req: NextRequest) {
  try {
    const quizzes = await listQuizzes();
    return ok(quizzes);
  } catch (error) {
    return handleError(error);
  }
}
