import { NextRequest } from "next/server";
import { getArticleDetail } from "@/lib/services/education.service";
import { getAuthUser } from "@/lib/utils/auth-helpers";
import { ok, notFound, handleError } from "@/lib/utils/api-response";

// GET /api/education/articles/[slug]
// Mengembalikan artikel lengkap + artikel terkait + status bookmark pengguna
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { user } = await getAuthUser();

    const article = await getArticleDetail(slug, user?.id);
    if (!article) return notFound("Artikel");

    return ok(article);
  } catch (error) {
    return handleError(error);
  }
}
