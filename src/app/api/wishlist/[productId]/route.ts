import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/utils/auth-helpers";
import { createRouteClient } from "@/lib/utils/auth-helpers";
import { ok, unauthorized, handleError } from "@/lib/utils/api-response";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const { user, error: authError } = await getAuthUser();
    if (authError || !user) {
      return unauthorized();
    }

    const supabase = await createRouteClient();
    const { error } = await supabase
      .from("wishlists")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId);

    if (error) throw error;

    return ok({ removed: true }, { message: "Berhasil dihapus dari wishlist" });
  } catch (error) {
    return handleError(error);
  }
}
