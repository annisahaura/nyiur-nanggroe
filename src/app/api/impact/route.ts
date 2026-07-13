import { NextRequest } from "next/server";
import { getImpactMetrics, getUserImpact } from "@/lib/services/impact.service";
import { getAuthUser } from "@/lib/utils/auth-helpers";
import { ok, handleError } from "@/lib/utils/api-response";

// GET /api/impact
// Mengembalikan metrik dampak lingkungan platform (publik)
// Jika sudah login, juga mengembalikan dampak personal pengguna
export async function GET(_req: NextRequest) {
  try {
    const metriks = await getImpactMetrics();
    const { user } = await getAuthUser();

    let dampakPengguna = null;
    if (user) {
      dampakPengguna = await getUserImpact(user.id);
    }

    return ok({
      platform: metriks,
      pengguna: dampakPengguna,
    });
  } catch (error) {
    return handleError(error);
  }
}
