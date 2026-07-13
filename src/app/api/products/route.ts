import { NextRequest } from "next/server";
import { searchProducts, createSellerProduct } from "@/lib/services/product.service";
import { productFilterSchema, createProductSchema } from "@/lib/validators/product.schema";
import { getAuthUser, isSeller } from "@/lib/utils/auth-helpers";
import { getProfileWithStore } from "@/lib/repositories/user.repository";
import { ok, created, badRequest, unauthorized, forbidden, handleError } from "@/lib/utils/api-response";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Parse query params
    const params: Record<string, any> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    const validation = productFilterSchema.safeParse(params);
    if (!validation.success) {
      return badRequest("Filter tidak valid");
    }

    const result = await searchProducts(validation.data);
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

    if (!isSeller(user)) {
      return forbidden("Hanya Mitra (Penjual) yang dapat menambah produk.");
    }

    // Get seller's store profile
    const profile = await getProfileWithStore(user.id);
    const store = profile?.seller_profile;
    if (!store) {
      return forbidden("Anda belum membuat profil Mitra.");
    }

    const body = await req.json();
    const validation = createProductSchema.safeParse(body);
    if (!validation.success) {
      return badRequest("Validasi gagal");
    }

    const product = await createSellerProduct(user.id, store.id, validation.data);
    return created(product, "Produk berhasil ditambahkan");
  } catch (error) {
    return handleError(error);
  }
}
