import { NextRequest } from "next/server";
import { listArticles, publishArticle } from "@/lib/services/education.service";
import { articleFilterSchema, createArticleSchema } from "@/lib/validators/education.schema";
import { getAuthUser, isAdmin } from "@/lib/utils/auth-helpers";
import { ok, created, badRequest, unauthorized, forbidden, handleError } from "@/lib/utils/api-response";

// GET /api/education/articles — daftar artikel yang dipublikasikan
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params: Record<string, any> = {};
    searchParams.forEach((value, key) => (params[key] = value));

    const validation = articleFilterSchema.safeParse(params);
    if (!validation.success) {
      return badRequest("Filter artikel tidak valid");
    }

    const result = await listArticles(validation.data);
    return ok(result.data, { meta: result.meta });
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/education/articles — buat artikel baru (hanya admin)
export async function POST(req: NextRequest) {
  try {
    const { user, error: authError } = await getAuthUser();
    if (authError || !user) return unauthorized();
    if (!isAdmin(user)) return forbidden("Hanya admin yang dapat membuat artikel.");

    const body = await req.json();
    const validation = createArticleSchema.safeParse(body);
    if (!validation.success) {
      return badRequest("Validasi artikel gagal", validation.error.flatten().fieldErrors);
    }

    const article = await publishArticle(user.id, validation.data as any);
    return created(article, "Artikel berhasil dibuat");
  } catch (error) {
    return handleError(error);
  }
}
