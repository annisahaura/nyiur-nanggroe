import { NextRequest } from "next/server";
import { findOrderById, changeOrderStatus } from "@/lib/services/order.service";
import { updateOrderStatusSchema } from "@/lib/validators/order.schema";
import { getAuthUser, isSeller } from "@/lib/utils/auth-helpers";
import { getProfileWithStore } from "@/lib/repositories/user.repository";
import { ok, badRequest, unauthorized, forbidden, notFound, handleError } from "@/lib/utils/api-response";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user, error: authError } = await getAuthUser();
    if (authError || !user) {
      return unauthorized();
    }

    const order = await findOrderById(id);
    if (!order) {
      return notFound("Pesanan");
    }

    // Permission guard
    let hasAccess = order.buyer_id === user.id || user.role === "admin";
    if (!hasAccess && isSeller(user)) {
      const profile = await getProfileWithStore(user.id);
      const store = profile?.seller_profile;
      if (store && order.store_id === store.id) {
        hasAccess = true;
      }
    }

    if (!hasAccess) {
      return forbidden("Anda tidak berhak melihat pesanan ini.");
    }

    return ok(order);
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user, error: authError } = await getAuthUser();
    if (authError || !user) {
      return unauthorized();
    }

    const body = await req.json();
    const validation = updateOrderStatusSchema.safeParse(body);
    if (!validation.success) {
      return badRequest("Validasi gagal");
    }

    const updated = await changeOrderStatus(
      id,
      validation.data,
      user.id,
      user.role
    );
    return ok(updated, { message: "Status pesanan berhasil diperbarui" });
  } catch (error: any) {
    if (error.message === "FORBIDDEN") {
      return forbidden("Anda tidak berhak memperbarui pesanan ini.");
    }
    if (error.message.startsWith("INVALID_TRANSITION:")) {
      const details = error.message.split(":")[1];
      return badRequest(`Transisi status tidak valid: ${details}`);
    }
    return handleError(error);
  }
}
