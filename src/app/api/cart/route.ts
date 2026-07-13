import { NextRequest } from "next/server";
import { getUserCart, addToCart } from "@/lib/services/cart.service";
import { addCartItemSchema } from "@/lib/validators/order.schema";
import { getAuthUser } from "@/lib/utils/auth-helpers";
import { ok, created, badRequest, unauthorized, handleError } from "@/lib/utils/api-response";

export async function GET(_req: NextRequest) {
  try {
    const { user, error: authError } = await getAuthUser();
    if (authError || !user) {
      return unauthorized();
    }

    const cart = await getUserCart(user.id);
    return ok(cart);
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
    const validation = addCartItemSchema.safeParse(body);
    if (!validation.success) {
      return badRequest("Validasi gagal");
    }

    const item = await addToCart(
      user.id,
      validation.data.product_id,
      validation.data.quantity
    );
    return created(item, "Produk berhasil ditambahkan ke keranjang");
  } catch (error: any) {
    if (error.message.startsWith("INSUFFICIENT_STOCK:")) {
      const productName = error.message.split(":")[1];
      return badRequest(`Stok produk ${productName} tidak mencukupi.`);
    }
    return handleError(error);
  }
}
