import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/utils/auth-helpers";
import { getProfileWithStore, updateProfile } from "@/lib/repositories/user.repository";
import { updateProfileSchema } from "@/lib/validators/auth.schema";
import { ok, badRequest, unauthorized, handleError } from "@/lib/utils/api-response";

export async function GET(_req: NextRequest) {
  try {
    const { user, error: authError } = await getAuthUser();
    if (authError || !user) {
      return unauthorized();
    }

    const profile = await getProfileWithStore(user.id);
    return ok(profile);
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { user, error: authError } = await getAuthUser();
    if (authError || !user) {
      return unauthorized();
    }

    const body = await req.json();
    const validation = updateProfileSchema.safeParse(body);
    if (!validation.success) {
      return badRequest("Validasi gagal");
    }

    const updated = await updateProfile(user.id, validation.data);
    return ok(updated, { message: "Profil berhasil diperbarui" });
  } catch (error) {
    return handleError(error);
  }
}
