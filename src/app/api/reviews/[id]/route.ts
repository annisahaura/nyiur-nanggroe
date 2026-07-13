import { NextRequest } from "next/server";
import { markReviewHelpful } from "@/lib/services/review.service";
import { getAuthUser } from "@/lib/utils/auth-helpers";
import { createRouteClient } from "@/lib/utils/auth-helpers";
import { ok, unauthorized, forbidden, notFound, handleError } from "@/lib/utils/api-response";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user, error: authError } = await getAuthUser();
    if (authError || !user) {
      return unauthorized();
    }

    const updated = await markReviewHelpful(id);
    return ok(updated, { message: "Ulasan ditandai bermanfaat" });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user, error: authError } = await getAuthUser();
    if (authError || !user) {
      return unauthorized();
    }

    const supabase = await createRouteClient();

    // Check review owner or admin
    const { data: review } = await supabase
      .from("reviews")
      .select("user_id")
      .eq("id", id)
      .single();

    if (!review) {
      return notFound("Ulasan");
    }

    if (review.user_id !== user.id && user.role !== "admin") {
      return forbidden("Anda tidak berhak menghapus ulasan ini.");
    }

    await supabase.from("reviews").delete().eq("id", id);
    return ok({ deleted: true }, { message: "Ulasan berhasil dihapus" });
  } catch (error) {
    return handleError(error);
  }
}
