import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/utils/auth-helpers";
import { getProfileWithStore } from "@/lib/repositories/user.repository";
import { registerSeller } from "@/lib/services/store.service";
import { createSellerSchema } from "@/lib/validators/auth.schema";
import { ok, created, badRequest, unauthorized, conflict, handleError } from "@/lib/utils/api-response";

export async function POST(req: NextRequest) {
  try {
    const { user, error: authError } = await getAuthUser();
    if (authError || !user) {
      return unauthorized();
    }

    // Check if user already is a seller
    const profile = await getProfileWithStore(user.id);
    if (profile?.seller_profile) {
      return conflict("Anda sudah memiliki profil Mitra.");
    }

    const body = await req.json();
    const validation = createSellerSchema.safeParse(body);
    if (!validation.success) {
      return badRequest("Validasi pendaftaran Mitra gagal");
    }

    const seller = await registerSeller(profile!.id, validation.data);
    return created(seller, "Pendaftaran Mitra berhasil. Selamat datang!");
  } catch (error) {
    return handleError(error);
  }
}
