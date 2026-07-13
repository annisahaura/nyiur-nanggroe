import { NextRequest } from "next/server";
import { getMyBookmarks, toggleArticleBookmark } from "@/lib/services/education.service";
import { bookmarkToggleSchema } from "@/lib/validators/education.schema";
import { getAuthUser } from "@/lib/utils/auth-helpers";
import { ok, badRequest, unauthorized, handleError } from "@/lib/utils/api-response";

// GET /api/education/bookmarks  — list user's bookmarked articles
export async function GET(req: NextRequest) {
  try {
    const { user, error: authError } = await getAuthUser();
    if (authError || !user) return unauthorized("Login untuk melihat bookmark.");

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const per_page = parseInt(searchParams.get("per_page") ?? "12", 10);

    const result = await getMyBookmarks(user.id, page, per_page);
    return ok(result.data, { meta: result.meta });
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/education/bookmarks  — toggle bookmark (add/remove)
export async function POST(req: NextRequest) {
  try {
    const { user, error: authError } = await getAuthUser();
    if (authError || !user) return unauthorized("Login untuk menambah bookmark.");

    const body = await req.json();
    const validation = bookmarkToggleSchema.safeParse(body);
    if (!validation.success) {
      return badRequest("Article ID tidak valid");
    }

    const result = await toggleArticleBookmark(user.id, validation.data.article_id);
    return ok(result, {
      message: result.bookmarked
        ? "Artikel berhasil disimpan ke bookmark."
        : "Artikel dihapus dari bookmark.",
    });
  } catch (error) {
    return handleError(error);
  }
}
