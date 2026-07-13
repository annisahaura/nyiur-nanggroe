import { NextRequest } from "next/server";
import { getAuthUser, isSeller } from "@/lib/utils/auth-helpers";
import { getProfileWithStore } from "@/lib/repositories/user.repository";
import { findOrdersByStore } from "@/lib/repositories/order.repository";
import { ok, unauthorized, forbidden, handleError } from "@/lib/utils/api-response";

export async function GET(req: NextRequest) {
  try {
    const { user, error: authError } = await getAuthUser();
    if (authError || !user) {
      return unauthorized();
    }

    if (!isSeller(user)) {
      return forbidden();
    }

    const profile = await getProfileWithStore(user.id);
    const store = profile?.seller_profile;
    if (!store) {
      return forbidden();
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const perPage = parseInt(searchParams.get("per_page") || "20", 10);

    const result = await findOrdersByStore(store.id, page, perPage);
    return ok(result.data, { meta: result.meta });
  } catch (error) {
    return handleError(error);
  }
}
