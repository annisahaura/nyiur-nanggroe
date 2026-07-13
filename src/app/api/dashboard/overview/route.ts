import { NextRequest } from "next/server";
import { getAuthUser, isSeller } from "@/lib/utils/auth-helpers";
import { getProfileWithStore } from "@/lib/repositories/user.repository";
import { getSellerDashboardOverview } from "@/lib/services/store.service";
import { ok, unauthorized, forbidden, handleError } from "@/lib/utils/api-response";

export async function GET(_req: NextRequest) {
  try {
    const { user, error: authError } = await getAuthUser();
    if (authError || !user) {
      return unauthorized();
    }

    if (!isSeller(user)) {
      return forbidden("Akses ditolak. Hanya untuk Mitra.");
    }

    const profile = await getProfileWithStore(user.id);
    const store = profile?.seller_profile;
    if (!store) {
      return forbidden("Profil Mitra Anda tidak ditemukan.");
    }

    const dashboardData = await getSellerDashboardOverview(store.id);
    return ok(dashboardData);
  } catch (error) {
    return handleError(error);
  }
}
