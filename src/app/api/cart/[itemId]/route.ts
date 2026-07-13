import { NextRequest } from "next/server";
import { updateCartItem, removeFromCart } from "@/lib/services/cart.service";
import { updateCartItemSchema } from "@/lib/validators/order.schema";
import { getAuthUser } from "@/lib/utils/auth-helpers";
import { ok, badRequest, unauthorized, forbidden, handleError } from "@/lib/utils/api-response";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;
    const { user, error: authError } = await getAuthUser();
    if (authError || !user) {
      return unauthorized();
    }

    const body = await req.json();
    const validation = updateCartItemSchema.safeParse(body);
    if (!validation.success) {
      return badRequest("Validasi gagal");
    }

    const updated = await updateCartItem(user.id, itemId, validation.data.quantity);
    return ok(updated, { message: "Jumlah item diperbarui" });
  } catch (error: any) {
    if (error.message === "FORBIDDEN") {
      return forbidden("Anda tidak berhak memperbarui item ini.");
    }
    return handleError(error);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;
    const { user, error: authError } = await getAuthUser();
    if (authError || !user) {
      return unauthorized();
    }

    await removeFromCart(user.id, itemId);
    return ok({ removed: true }, { message: "Item berhasil dihapus dari keranjang" });
  } catch (error: any) {
    if (error.message === "FORBIDDEN") {
      return forbidden("Anda tidak berhak menghapus item ini.");
    }
    return handleError(error);
  }
}
