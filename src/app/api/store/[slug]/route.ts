import { NextRequest } from "next/server";
import { getStoreDetail, updateStoreProfile } from "@/lib/services/store.service";
import { getAuthUser, isSeller } from "@/lib/utils/auth-helpers";
import { getProfileWithStore } from "@/lib/repositories/user.repository";
import { createSellerSchema } from "@/lib/validators/auth.schema";
import { ok, badRequest, unauthorized, forbidden, notFound, handleError } from "@/lib/utils/api-response";

const partialStoreSchema = createSellerSchema.partial().extend({
  logo_url: createSellerSchema.shape.website.optional(), // custom extensions
  banner_url: createSellerSchema.shape.website.optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const perPage = parseInt(searchParams.get("per_page") || "12", 10);

    const storeDetail = await getStoreDetail(slug, page, perPage);
    if (!storeDetail) {
      return notFound("Toko");
    }

    return ok(storeDetail.store, {
      meta: storeDetail.meta,
      // Pass products directly inside data for wrapper compatibility
      status: 200,
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { user, error: authError } = await getAuthUser();
    if (authError || !user) {
      return unauthorized();
    }

    if (!isSeller(user)) {
      return forbidden();
    }

    const profile = await getProfileWithStore(user.id);
    const store = profile?.seller_profile;
    if (!store || store.slug !== slug) {
      return forbidden("Anda tidak berhak mengedit toko ini.");
    }

    const body = await req.json();
    const validation = partialStoreSchema.safeParse(body);
    if (!validation.success) {
      return badRequest("Validasi gagal");
    }

    const updated = await updateStoreProfile(store.id, user.id, validation.data);
    return ok(updated, { message: "Profil toko berhasil diperbarui" });
  } catch (error) {
    return handleError(error);
  }
}
