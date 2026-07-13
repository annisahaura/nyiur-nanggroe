import { NextRequest } from "next/server";
import { recalculateImpact } from "@/lib/services/impact.service";
import { getAuthUser, isAdmin } from "@/lib/utils/auth-helpers";
import { ok, unauthorized, forbidden, handleError } from "@/lib/utils/api-response";

// POST /api/impact/recalculate  (admin only)
// Triggers SQL function to recalculate all environmental metrics from real orders
export async function POST(_req: NextRequest) {
  try {
    const { user, error: authError } = await getAuthUser();
    if (authError || !user) return unauthorized();
    if (!isAdmin(user)) return forbidden("Hanya admin yang dapat memperbarui metrik dampak.");

    const result = await recalculateImpact();
    return ok(result, { message: "Metrik dampak lingkungan berhasil diperbarui." });
  } catch (error) {
    return handleError(error);
  }
}
