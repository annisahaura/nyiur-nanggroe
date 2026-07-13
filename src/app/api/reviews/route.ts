import { NextRequest } from "next/server";
import { getProductReviews, createProductReview } from "@/lib/services/review.service";
import { createReviewSchema } from "@/lib/validators/review.schema";
import { getAuthUser } from "@/lib/utils/auth-helpers";
import { ok, created, badRequest, unauthorized, conflict, handleError } from "@/lib/utils/api-response";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("product_id");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const perPage = parseInt(searchParams.get("per_page") || "10", 10);

    if (!productId) {
      return badRequest("product_id wajib diisi");
    }

    const result = await getProductReviews(productId, page, perPage);
    return ok(result.data, { meta: result.meta });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user, error: authError } = await getAuthUser();
    if (authError || !user) {
      return unauthorized();
    }

    const body = await req.json();
    const validation = createReviewSchema.safeParse(body);
    if (!validation.success) {
      return badRequest("Validasi ulasan gagal");
    }

    const review = await createProductReview(user.id, validation.data);
    return created(review, "Ulasan berhasil dikirim");
  } catch (error: any) {
    if (error.message === "REVIEW_ALREADY_EXISTS") {
      return conflict("Anda sudah mengulas produk ini untuk pesanan ini.");
    }
    return handleError(error);
  }
}
