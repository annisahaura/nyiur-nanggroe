import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/utils/auth-helpers";
import { findOrderById } from "@/lib/services/order.service";
import { initiatePayment } from "@/lib/services/payment.service";
import { ok, badRequest, unauthorized, forbidden, notFound, handleError } from "@/lib/utils/api-response";

export async function POST(req: NextRequest) {
  try {
    const { user, error: authError } = await getAuthUser();
    if (authError || !user) {
      return unauthorized();
    }

    const body = await req.json();
    const { order_id, method } = body;
    if (!order_id || !method) {
      return badRequest("Order ID dan Metode Pembayaran wajib diisi");
    }

    const order = await findOrderById(order_id);
    if (!order) {
      return notFound("Pesanan");
    }

    if (order.buyer_id !== user.id) {
      return forbidden("Anda tidak berhak membayar pesanan ini.");
    }

    if (order.payment_status === "paid") {
      return badRequest("Pesanan ini sudah lunas.");
    }

    const result = await initiatePayment(order_id, method, order);
    return ok(result, { message: "Pembayaran berhasil diinisiasi" });
  } catch (error) {
    return handleError(error);
  }
}
