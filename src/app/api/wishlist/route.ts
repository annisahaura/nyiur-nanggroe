import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/utils/auth-helpers";
import { createRouteClient } from "@/lib/utils/auth-helpers";
import { ok, created, badRequest, unauthorized, handleError } from "@/lib/utils/api-response";

export async function GET(_req: NextRequest) {
  try {
    const { user, error: authError } = await getAuthUser();
    if (authError || !user) {
      return unauthorized();
    }

    const supabase = await createRouteClient();
    const { data, error } = await supabase
      .from("wishlists")
      .select(`
        id, created_at,
        product:products(
          id, name, slug, price, stock, unit, rating, review_count, is_eco_certified, is_featured,
          store:seller_profiles(id, name, slug),
          images:product_images(url, is_primary)
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return ok(data ?? []);
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
    const productId = body.product_id;
    if (!productId) {
      return badRequest("Product ID wajib diisi");
    }

    const supabase = await createRouteClient();

    // Check if already in wishlist
    const { data: existing } = await supabase
      .from("wishlists")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .single();

    if (existing) {
      // Toggle logic: delete
      await supabase.from("wishlists").delete().eq("id", existing.id);
      return ok({ wishlisted: false }, { message: "Dihapus dari wishlist" });
    }

    // Add to wishlist
    const { data, error } = await supabase
      .from("wishlists")
      .insert({ user_id: user.id, product_id: productId })
      .select("id")
      .single();

    if (error) throw error;

    return created({ id: data.id, wishlisted: true }, "Ditambahkan ke wishlist");
  } catch (error) {
    return handleError(error);
  }
}
