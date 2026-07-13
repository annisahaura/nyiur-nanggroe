import { NextRequest } from "next/server";
import { checkout, findOrdersByBuyer } from "@/lib/services/order.service";
import { findOrdersByStore } from "@/lib/repositories/order.repository";
import { checkoutSchema } from "@/lib/validators/order.schema";
import { getAuthUser, isSeller } from "@/lib/utils/auth-helpers";
import { getProfileWithStore } from "@/lib/repositories/user.repository";
import { ok, created, badRequest, unauthorized, forbidden, handleError } from "@/lib/utils/api-response";

export async function GET(req: NextRequest) {
  try {
    const { user, error: authError } = await getAuthUser();
    if (authError || !user) {
      return unauthorized();
    }

    const { searchParams } = new URL(req.url);
    const scope = searchParams.get("scope") || "buyer";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const perPage = parseInt(searchParams.get("per_page") || "10", 10);

    if (scope === "seller") {
      if (!isSeller(user)) {
        return forbidden("Anda tidak berhak melihat pesanan penjualan.");
      }
      
      const profile = await getProfileWithStore(user.id);
      const store = profile?.seller_profile;
      if (!store) {
        return forbidden("Profil Mitra Anda tidak ditemukan.");
      }

      const result = await findOrdersByStore(store.id, page, perPage);
      return ok(result.data, { meta: result.meta });
    }

    // Default to buyer
    const result = await findOrdersByBuyer(user.id, page, perPage);
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
    const validation = checkoutSchema.safeParse(body);
    if (!validation.success) {
      return badRequest("Validasi checkout gagal");
    }

    const order = await checkout(user.id, validation.data);
    return created(order, "Pesanan berhasil dibuat");
  } catch (error: any) {
    if (error.message === "CART_EMPTY") {
      return badRequest("Keranjang belanja Anda kosong.");
    }
    if (error.message.startsWith("INSUFFICIENT_STOCK:")) {
      const name = error.message.split(":")[1];
      return badRequest(`Stok produk ${name} tidak mencukupi.`);
    }
    if (error.message === "MULTI_STORE_CHECKOUT") {
      return badRequest(
        "Produk yang dipilih berasal dari lebih dari satu toko. Saat ini checkout hanya bisa dilakukan per toko — pilih produk dari satu toko yang sama dulu ya."
      );
    }
    if (error.message === "INVALID_CART") {
      return badRequest("Ada produk yang tidak valid di keranjangmu.");
    }
    return handleError(error);
  }
}
